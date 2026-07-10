import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const jornadasRouter = new Hono<HonoEnv>();

const JornadaSchema = z.object({
  nome: z.string().min(2).max(100),
  codigo: z.string().min(1).max(20),
  horas_dia: z.number().min(1).max(12),
  minutos_dia: z.number().optional(),
  dias_semana: z.array(z.number().min(0).max(6)).optional(),
  permite_intervalo: z.boolean().default(true),
  intervalo_minutos: z.number().min(0).max(120),
  horario_inicio_padrao: z.string().regex(/^\d{2}:\d{2}$/),
  horario_fim_padrao: z.string().regex(/^\d{2}:\d{2}$/),
  tipo: z.enum(["periodo", "turno", "flexivel"]).default("periodo"),
  ativo: z.boolean().default(true),
});

const JornadaUpdateSchema = JornadaSchema.partial();

// GET /v1/jornadas - Listar jornadas da empresa
jornadasRouter.get("/", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { ativo } = c.req.query();

    let query = supabase
      .from("jornadas")
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
    console.error("[JORNADAS] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/jornadas/:id - Obter jornada específica
jornadasRouter.get("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("jornadas")
      .select("*")
      .eq("id", id)
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Jornada not found" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[JORNADAS] GET :id erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/jornadas - Criar jornada
jornadasRouter.post(
  "/",
  zValidator("json", JornadaSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const minutos = payload.minutos_dia || Math.round(payload.horas_dia * 60);
      const diasSemana = payload.dias_semana || [1, 2, 3, 4, 5]; // Seg-Sex

      const { data, error } = await supabase
        .from("jornadas")
        .insert({
          empresa_id: authedUser.id,
          ...payload,
          minutos_dia: minutos,
          dias_semana: diasSemana,
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
      console.error("[JORNADAS] POST erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/jornadas/:id - Atualizar jornada
jornadasRouter.put(
  "/:id",
  zValidator("json", JornadaUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    const { id } = c.req.param();

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const updateData = { ...payload };
      if (payload.horas_dia) {
        updateData.minutos_dia = Math.round(payload.horas_dia * 60);
      }

      const { data, error } = await supabase
        .from("jornadas")
        .update(updateData)
        .eq("id", id)
        .eq("empresa_id", authedUser.id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return c.json({ error: "Jornada not found" }, 404);
        }
        if (error.code === "23505") {
          return c.json({ error: "Código já existe" }, 409);
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data);
    } catch (error) {
      console.error("[JORNADAS] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// DELETE /v1/jornadas/:id - Deletar jornada
jornadasRouter.delete("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { error } = await supabase
      .from("jornadas")
      .delete()
      .eq("id", id)
      .eq("empresa_id", authedUser.id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true }, 204);
  } catch (error) {
    console.error("[JORNADAS] DELETE erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default jornadasRouter;
