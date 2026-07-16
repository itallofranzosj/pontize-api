import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const repDevicesRouter = new Hono<HonoEnv>();

const DEVICE_COLUMNS =
  "id, identificador, ip_local, fabricante, modelo, numero_serie, tipo_rep, unidade_id, ativo, ingest_enabled";

async function resolveEmpresaId(authedUserId: string) {
  const { data: profile, error } = await supabase
    .from("profiles")
    .select("empresa_id")
    .eq("id", authedUserId)
    .maybeSingle();

  if (error) return { error: error.message };
  if (!profile?.empresa_id) return { error: "Usuário sem empresa vinculada" };
  return { empresaId: profile.empresa_id };
}

// GET /v1/rep-devices - Lista os REPs de ponto da empresa do usuário autenticado
// Usado pelo Pontize Agent (Windows) para exibir a lista de relógios na instalação.
repDevicesRouter.get("/", async (c) => {
  const authedUser = c.get("user");
  if (!authedUser?.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const resolved = await resolveEmpresaId(authedUser.id);
  if ("error" in resolved) {
    return c.json({ error: resolved.error }, 400);
  }

  try {
    const { data, error } = await supabase
      .from("rep_devices")
      .select(DEVICE_COLUMNS)
      .eq("empresa_id", resolved.empresaId)
      .order("updated_at", { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ ok: true, data: data ?? [], count: data?.length ?? 0 });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

const CreateDeviceSchema = z.object({
  identificador: z.string().min(1),
  fabricante: z.string().min(1),
  modelo: z.string().min(1),
  tipo_rep: z.string().min(1),
  ip_local: z.string().min(1).optional(),
  numero_serie: z.string().optional(),
  unidade_id: z.string().uuid().optional(),
});

// POST /v1/rep-devices - Cadastra um novo relógio de ponto (REP) para a empresa.
// Usuário/senha do relógio NÃO são aceitos aqui — ficam só no PC do Agente,
// nunca trafegam para o Pontize. Segue a mesma convenção usada pelo cadastro
// manual no app web (CadastrarRepDialog em app.rep.tsx): nr_id_estab/tipo_id_estab
// não são resolvidos de fato hoje (mesma limitação já existente lá).
repDevicesRouter.post("/", zValidator("json", CreateDeviceSchema), async (c) => {
  const authedUser = c.get("user");
  if (!authedUser?.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const resolved = await resolveEmpresaId(authedUser.id);
  if ("error" in resolved) {
    return c.json({ error: resolved.error }, 400);
  }

  const payload = c.req.valid("json");

  try {
    // Reaproveitar em vez de duplicar: um relógio é identificado fisicamente por
    // (fabricante, numero_serie) — há índice único nisso. Se já existir um com
    // essa série (inclusive um que foi "removido"/inativado), reativa e atualiza
    // esse registro em vez de tentar inserir de novo (o que estourava
    // "duplicate key ... rep_devices_fabricante_serie_idx"). Só dá para
    // deduplicar quando há número de série; sem série, cada cadastro é um novo.
    if (payload.numero_serie) {
      const { data: existente } = await supabase
        .from("rep_devices")
        .select("id, empresa_id")
        .eq("fabricante", payload.fabricante)
        .eq("numero_serie", payload.numero_serie)
        .maybeSingle();

      if (existente) {
        if (existente.empresa_id !== resolved.empresaId) {
          return c.json(
            { error: "Este relógio (nº de série) já está cadastrado em outra empresa." },
            409,
          );
        }
        const { data, error } = await supabase
          .from("rep_devices")
          .update({
            identificador: payload.identificador.toUpperCase(),
            modelo: payload.modelo,
            tipo_rep: payload.tipo_rep,
            ip_local: payload.ip_local ?? null,
            unidade_id: payload.unidade_id ?? null,
            ativo: true,
            ingest_enabled: true,
          })
          .eq("id", existente.id)
          .select(DEVICE_COLUMNS)
          .single();

        if (error) return c.json({ error: error.message }, 400);
        return c.json({ ok: true, data, reaproveitado: true }, 200);
      }
    }

    const { data, error } = await supabase
      .from("rep_devices")
      .insert({
        empresa_id: resolved.empresaId,
        identificador: payload.identificador.toUpperCase(),
        fabricante: payload.fabricante,
        modelo: payload.modelo,
        tipo_rep: payload.tipo_rep,
        ip_local: payload.ip_local ?? null,
        numero_serie: payload.numero_serie ?? null,
        unidade_id: payload.unidade_id ?? null,
        nr_id_estab: "",
        tipo_id_estab: 1,
        ativo: true,
        ingest_enabled: true,
      })
      .select(DEVICE_COLUMNS)
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ ok: true, data }, 201);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

const UpdateDeviceSchema = z
  .object({
    // Dados do relógio — editáveis após o cadastro (corrigir IP digitado errado,
    // modelo, identificador etc. sem precisar remover e recadastrar).
    identificador: z.string().min(1).optional(),
    fabricante: z.string().min(1).optional(),
    modelo: z.string().min(1).optional(),
    tipo_rep: z.string().min(1).optional(),
    ip_local: z.string().min(1).nullable().optional(),
    numero_serie: z.string().nullable().optional(),
    // Vínculo/status
    unidade_id: z.string().uuid().nullable().optional(),
    ativo: z.boolean().optional(),
    ingest_enabled: z.boolean().optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "Nada para atualizar" });

// PATCH /v1/rep-devices/:id - Atualiza os dados de um relógio (IP, modelo,
// identificador, série, fabricante, tipo), vínculo de unidade e status.
repDevicesRouter.patch("/:id", zValidator("json", UpdateDeviceSchema), async (c) => {
  const authedUser = c.get("user");
  if (!authedUser?.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  const resolved = await resolveEmpresaId(authedUser.id);
  if ("error" in resolved) {
    return c.json({ error: resolved.error }, 400);
  }

  const id = c.req.param("id");
  const payload = c.req.valid("json");
  // Mesma convenção do POST: identificador sempre maiúsculo.
  if (payload.identificador) payload.identificador = payload.identificador.toUpperCase();

  try {
    const { data, error } = await supabase
      .from("rep_devices")
      .update(payload)
      .eq("id", id)
      .eq("empresa_id", resolved.empresaId)
      .select(DEVICE_COLUMNS)
      .maybeSingle();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    if (!data) {
      return c.json({ error: "Relógio não encontrado" }, 404);
    }

    return c.json({ ok: true, data });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});
