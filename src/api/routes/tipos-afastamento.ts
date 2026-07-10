import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const tiposAfastamentoRouter = new Hono<HonoEnv>();

const TipoAfastamentoSchema = z.object({
  nome: z.string().min(2).max(100),
  codigo: z.string().min(1).max(20),
  descricao: z.string().optional(),
  descontar_banco_horas: z.boolean().default(false),
  eh_remunerado: z.boolean().default(true),
  requer_justificativa: z.boolean().default(false),
  bloqueia_ponto: z.boolean().default(true),
  permite_sobreposicao: z.boolean().default(false),
  contar_dias_uteis: z.boolean().default(true),
  conta_no_saldo: z.boolean().default(true),
  dias_maximo: z.number().int().min(1).optional(),
  requer_periodo_intervalo: z.boolean().default(false),
  dias_intervalo_minimo: z.number().int().min(0).optional(),
  ativo: z.boolean().default(true),
});

const TipoAfastamentoUpdateSchema = TipoAfastamentoSchema.partial();

// GET /v1/tipos-afastamento - Listar tipos
tiposAfastamentoRouter.get("/", async (c) => {
  const authedUser = c.get("user");
  const { ativo } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let query = supabase
      .from("tipos_afastamento")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .order("nome");

    if (ativo !== undefined) {
      query = query.eq("ativo", ativo === "true");
    }

    const { data, error } = await query;

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[TIPOS_AFASTAMENTO] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/tipos-afastamento/:id
tiposAfastamentoRouter.get("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("tipos_afastamento")
      .select("*")
      .eq("id", id)
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Tipo de afastamento not found" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[TIPOS_AFASTAMENTO] GET :id erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/tipos-afastamento
tiposAfastamentoRouter.post(
  "/",
  zValidator("json", TipoAfastamentoSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("tipos_afastamento")
        .insert({
          empresa_id: authedUser.id,
          ...payload,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return c.json(
            { error: `Código "${payload.codigo}" já existe nesta empresa` },
            409
          );
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data, 201);
    } catch (error) {
      console.error("[TIPOS_AFASTAMENTO] POST erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/tipos-afastamento/:id
tiposAfastamentoRouter.put(
  "/:id",
  zValidator("json", TipoAfastamentoUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    const { id } = c.req.param();

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("tipos_afastamento")
        .update(payload)
        .eq("id", id)
        .eq("empresa_id", authedUser.id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return c.json({ error: "Tipo de afastamento not found" }, 404);
        }
        if (error.code === "23505") {
          return c.json({ error: "Código já existe" }, 409);
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data);
    } catch (error) {
      console.error("[TIPOS_AFASTAMENTO] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// DELETE /v1/tipos-afastamento/:id
tiposAfastamentoRouter.delete("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { error } = await supabase
      .from("tipos_afastamento")
      .delete()
      .eq("id", id)
      .eq("empresa_id", authedUser.id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true }, 204);
  } catch (error) {
    console.error("[TIPOS_AFASTAMENTO] DELETE erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default tiposAfastamentoRouter;
