import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const perfisJornadaRouter = new Hono<HonoEnv>();

const PerfilJornadaSchema = z.object({
  cargo: z.string().min(2).max(100),
  setor_id: z.string().uuid().optional(),
  jornada_id: z.string().uuid(),
  jornada_horas_sobrescrita: z.number().min(1).max(12).optional(),
  intervalo_minutos_sobrescrita: z.number().min(0).max(120).optional(),
  ativo: z.boolean().default(true),
});

const PerfilJornadaUpdateSchema = PerfilJornadaSchema.partial();

// GET /v1/perfis-jornada - Listar perfis de jornada
perfisJornadaRouter.get("/", async (c) => {
  const authedUser = c.get("user");
  const { cargo, setor_id, ativo } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let query = supabase
      .from("perfis_jornada")
      .select(
        `*,
         jornadas(id, nome, codigo, horas_dia, intervalo_minutos)`
      )
      .eq("empresa_id", authedUser.id)
      .order("cargo");

    if (cargo) {
      query = query.ilike("cargo", `%${cargo}%`);
    }

    if (setor_id) {
      query = query.eq("setor_id", setor_id);
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
    console.error("[PERFIS_JORNADA] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/perfis-jornada/:id - Obter perfil específico
perfisJornadaRouter.get("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("perfis_jornada")
      .select(
        `*,
         jornadas(id, nome, codigo, horas_dia, intervalo_minutos)`
      )
      .eq("id", id)
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Perfil de jornada not found" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[PERFIS_JORNADA] GET :id erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/perfis-jornada - Criar perfil de jornada
perfisJornadaRouter.post(
  "/",
  zValidator("json", PerfilJornadaSchema),
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
        .from("perfis_jornada")
        .insert({
          empresa_id: authedUser.id,
          ...payload,
        })
        .select(
          `*,
           jornadas(id, nome, codigo, horas_dia, intervalo_minutos)`
        )
        .single();

      if (error) {
        if (error.code === "23505") {
          return c.json(
            {
              error: `Perfil para cargo "${payload.cargo}" já existe nesta empresa`,
            },
            409
          );
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data, 201);
    } catch (error) {
      console.error("[PERFIS_JORNADA] POST erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/perfis-jornada/:id - Atualizar perfil de jornada
perfisJornadaRouter.put(
  "/:id",
  zValidator("json", PerfilJornadaUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    const { id } = c.req.param();

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Se está alterando a jornada, validar que a nova jornada pertence à empresa
      if (payload.jornada_id) {
        const { data: jornada } = await supabase
          .from("jornadas")
          .select("id")
          .eq("id", payload.jornada_id)
          .eq("empresa_id", authedUser.id)
          .single();

        if (!jornada) {
          return c.json({ error: "Jornada not found or unauthorized" }, 404);
        }
      }

      const { data, error } = await supabase
        .from("perfis_jornada")
        .update(payload)
        .eq("id", id)
        .eq("empresa_id", authedUser.id)
        .select(
          `*,
           jornadas(id, nome, codigo, horas_dia, intervalo_minutos)`
        )
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return c.json({ error: "Perfil de jornada not found" }, 404);
        }
        if (error.code === "23505") {
          return c.json({ error: "Perfil com esse cargo já existe" }, 409);
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data);
    } catch (error) {
      console.error("[PERFIS_JORNADA] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// DELETE /v1/perfis-jornada/:id - Deletar perfil de jornada
perfisJornadaRouter.delete("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { error } = await supabase
      .from("perfis_jornada")
      .delete()
      .eq("id", id)
      .eq("empresa_id", authedUser.id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error("[PERFIS_JORNADA] DELETE erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/perfis-jornada/cargo/:cargo - Obter perfil por cargo
perfisJornadaRouter.get("/cargo/:cargo", async (c) => {
  const authedUser = c.get("user");
  const { cargo } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("perfis_jornada")
      .select(
        `*,
         jornadas(id, nome, codigo, horas_dia, intervalo_minutos)`
      )
      .eq("empresa_id", authedUser.id)
      .eq("cargo", cargo)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json(
          { error: "Perfil not found for this cargo", jornada: null },
          404
        );
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[PERFIS_JORNADA] GET cargo erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default perfisJornadaRouter;
