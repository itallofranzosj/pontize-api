import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const horariosRouter = new Hono<HonoEnv>();

const HorarioTrabalhoSchema = z.object({
  jornada_id: z.string().uuid(),
  nome: z.string().min(2).max(100),
  horario_entrada: z.string().regex(/^\d{2}:\d{2}$/),
  horario_saida: z.string().regex(/^\d{2}:\d{2}$/),
  intervalo_minutos: z.number().min(0).max(120),
  permite_intervalo: z.boolean().default(true),
  permite_acumulo: z.boolean().default(false),
  requer_justificativa: z.boolean().default(false),
  ativo: z.boolean().default(true),
});

const HorarioTrabalhoUpdateSchema = HorarioTrabalhoSchema.partial();

// GET /v1/horarios-trabalho - Listar horários de trabalho
horariosRouter.get("/", async (c) => {
  const authedUser = c.get("user");
  const { jornada_id, ativo } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let query = supabase
      .from("horarios_trabalho")
      .select(
        `*,
         jornadas(id, nome, codigo)`
      )
      .eq("jornadas.empresa_id", authedUser.id)
      .order("nome");

    if (jornada_id) {
      query = query.eq("jornada_id", jornada_id);
    }

    if (ativo !== undefined) {
      query = query.eq("ativo", ativo === "true");
    }

    const { data, error } = await query;

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[HORARIOS] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/horarios-trabalho/:id - Obter horário específico
horariosRouter.get("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("horarios_trabalho")
      .select(
        `*,
         jornadas(id, nome, codigo, empresa_id)`
      )
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Horário not found" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    // Validar que a jornada pertence à empresa do usuário
    const horario = data as any;
    if (horario.jornadas?.empresa_id !== authedUser.id) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    return c.json(data);
  } catch (error) {
    console.error("[HORARIOS] GET :id erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/horarios-trabalho - Criar horário
horariosRouter.post(
  "/",
  zValidator("json", HorarioTrabalhoSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Validar que a jornada pertence à empresa
      const { data: jornada } = await supabase
        .from("jornadas")
        .select("id")
        .eq("id", payload.jornada_id)
        .eq("empresa_id", authedUser.id)
        .single();

      if (!jornada) {
        return c.json({ error: "Jornada not found or unauthorized" }, 404);
      }

      const { data, error } = await supabase
        .from("horarios_trabalho")
        .insert(payload)
        .select()
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json(data, 201);
    } catch (error) {
      console.error("[HORARIOS] POST erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/horarios-trabalho/:id - Atualizar horário
horariosRouter.put(
  "/:id",
  zValidator("json", HorarioTrabalhoUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    const { id } = c.req.param();

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Validar que o horário pertence à empresa do usuário
      const { data: existing } = await supabase
        .from("horarios_trabalho")
        .select("jornada_id, jornadas(empresa_id)")
        .eq("id", id)
        .single();

      if (
        !existing ||
        (existing.jornadas as any)?.empresa_id !== authedUser.id
      ) {
        return c.json({ error: "Unauthorized" }, 403);
      }

      const { data, error } = await supabase
        .from("horarios_trabalho")
        .update(payload)
        .eq("id", id)
        .select()
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json(data);
    } catch (error) {
      console.error("[HORARIOS] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// DELETE /v1/horarios-trabalho/:id - Deletar horário
horariosRouter.delete("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Validar que o horário pertence à empresa
    const { data: existing } = await supabase
      .from("horarios_trabalho")
      .select("jornada_id, jornadas(empresa_id)")
      .eq("id", id)
      .single();

    if (
      !existing ||
      (existing.jornadas as any)?.empresa_id !== authedUser.id
    ) {
      return c.json({ error: "Unauthorized" }, 403);
    }

    const { error } = await supabase
      .from("horarios_trabalho")
      .delete()
      .eq("id", id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true }, 204);
  } catch (error) {
    console.error("[HORARIOS] DELETE erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default horariosRouter;
