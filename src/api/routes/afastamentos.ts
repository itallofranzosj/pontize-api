import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const afastamentosRouter = new Hono<HonoEnv>();

const AfastamentoSchema = z.object({
  user_id: z.string().uuid(),
  tipo_afastamento_id: z.string().uuid(),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  motivo: z.string().optional(),
  numero_documento: z.string().optional(),
  descontar_do_banco: z.boolean().default(true),
});

const AfastamentoUpdateSchema = AfastamentoSchema.partial();

// GET /v1/afastamentos - Listar afastamentos
afastamentosRouter.get("/", async (c) => {
  const authedUser = c.get("user");
  const { user_id, status, data_inicio, data_fim } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let query = supabase
      .from("afastamentos")
      .select(
        `*,
         tipos_afastamento(id, nome, codigo, bloqueia_ponto, contar_dias_uteis),
         profiles:user_id(nome, email, cargo)`
      )
      .eq("empresa_id", authedUser.id);

    if (user_id) {
      query = query.eq("user_id", user_id);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (data_inicio && data_fim) {
      query = query
        .gte("data_inicio", data_inicio)
        .lte("data_fim", data_fim);
    }

    const { data, error } = await query.order("data_inicio", { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[AFASTAMENTOS] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/afastamentos/:id
afastamentosRouter.get("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("afastamentos")
      .select(
        `*,
         tipos_afastamento(id, nome, codigo, bloqueia_ponto),
         profiles:user_id(nome, email, cargo, jornada_id)`
      )
      .eq("id", id)
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Afastamento not found" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[AFASTAMENTOS] GET :id erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/afastamentos - Criar afastamento
afastamentosRouter.post(
  "/",
  zValidator("json", AfastamentoSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Validar que user_id pertence à empresa
      const { data: user } = await supabase
        .from("profiles")
        .select("id, empresa_id")
        .eq("id", payload.user_id)
        .eq("empresa_id", authedUser.id)
        .single();

      if (!user) {
        return c.json(
          { error: "Colaborador não encontrado ou não pertence à empresa" },
          404
        );
      }

      // Validar tipo_afastamento
      const { data: tipo } = await supabase
        .from("tipos_afastamento")
        .select("id, permite_sobreposicao, bloqueia_ponto, requer_periodo_intervalo, dias_intervalo_minimo")
        .eq("id", payload.tipo_afastamento_id)
        .eq("empresa_id", authedUser.id)
        .single();

      if (!tipo) {
        return c.json({ error: "Tipo de afastamento não encontrado" }, 404);
      }

      // Validar sobreposição de afastamentos
      const { data: sobrepostos } = await supabase
        .from("afastamentos")
        .select("id, data_inicio, data_fim, tipos_afastamento(permite_sobreposicao)")
        .eq("user_id", payload.user_id)
        .eq("empresa_id", authedUser.id)
        .eq("status", "aprovado")
        .lt("data_fim", payload.data_inicio)
        .gte("data_fim", payload.data_inicio);

      if (sobrepostos && sobrepostos.length > 0 && !tipo.permite_sobreposicao) {
        return c.json(
          { error: "Já existe afastamento aprovado no período. Tipo não permite sobreposição" },
          409
        );
      }

      // Validar período entre afastamentos do mesmo tipo
      if (tipo.requer_periodo_intervalo) {
        const { data: ultimoAfastamento } = await supabase
          .from("afastamentos")
          .select("data_fim")
          .eq("user_id", payload.user_id)
          .eq("tipo_afastamento_id", payload.tipo_afastamento_id)
          .eq("status", "aprovado")
          .order("data_fim", { ascending: false })
          .limit(1)
          .single();

        if (ultimoAfastamento) {
          const dataUltimo = new Date(ultimoAfastamento.data_fim);
          const dataNovoInicio = new Date(payload.data_inicio);
          const diasEntre = Math.floor(
            (dataNovoInicio.getTime() - dataUltimo.getTime()) / (1000 * 60 * 60 * 24)
          );

          if (diasEntre < (tipo.dias_intervalo_minimo || 0)) {
            return c.json(
              {
                error: `Intervalo mínimo de ${tipo.dias_intervalo_minimo} dias não respeitado. Últim afastamento: ${ultimoAfastamento.data_fim}`,
              },
              409
            );
          }
        }
      }

      const { data, error } = await supabase
        .from("afastamentos")
        .insert({
          empresa_id: authedUser.id,
          ...payload,
          status: "pendente",
        })
        .select(
          `*,
           tipos_afastamento(id, nome, codigo),
           profiles:user_id(nome, cargo)`
        )
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json(data, 201);
    } catch (error) {
      console.error("[AFASTAMENTOS] POST erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/afastamentos/:id - Atualizar afastamento
afastamentosRouter.put(
  "/:id",
  zValidator("json", AfastamentoUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    const { id } = c.req.param();

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("afastamentos")
        .update(payload)
        .eq("id", id)
        .eq("empresa_id", authedUser.id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return c.json({ error: "Afastamento not found" }, 404);
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data);
    } catch (error) {
      console.error("[AFASTAMENTOS] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// POST /v1/afastamentos/:id/aprovar - Aprovar afastamento
afastamentosRouter.post("/:id/aprovar", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("afastamentos")
      .update({
        status: "aprovado",
        usuario_aprovacao_id: authedUser.id,
        data_aprovacao: new Date().toISOString(),
      })
      .eq("id", id)
      .eq("empresa_id", authedUser.id)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[AFASTAMENTOS] POST aprovar erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/afastamentos/:id/rejeitar - Rejeitar afastamento
afastamentosRouter.post(
  "/:id/rejeitar",
  zValidator("json", z.object({ motivo: z.string() })),
  async (c) => {
    const { motivo } = c.req.valid("json");
    const authedUser = c.get("user");
    const { id } = c.req.param();

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("afastamentos")
        .update({
          status: "rejeitado",
          motivo_rejeicao: motivo,
          data_rejeicao: new Date().toISOString(),
        })
        .eq("id", id)
        .eq("empresa_id", authedUser.id)
        .select()
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json(data);
    } catch (error) {
      console.error("[AFASTAMENTOS] POST rejeitar erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// DELETE /v1/afastamentos/:id
afastamentosRouter.delete("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { error } = await supabase
      .from("afastamentos")
      .delete()
      .eq("id", id)
      .eq("empresa_id", authedUser.id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true }, 200);
  } catch (error) {
    console.error("[AFASTAMENTOS] DELETE erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default afastamentosRouter;
