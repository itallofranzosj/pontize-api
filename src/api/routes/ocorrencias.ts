import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const ocorrenciasRouter = new Hono<HonoEnv>();

const OcorrenciaSchema = z.object({
  user_id: z.string().uuid(),
  tipo: z.enum(["advertencia", "suspensao", "multa", "dismissao", "elogio", "comendacao", "aviso", "desligamento"]),
  descricao: z.string().min(5).max(1000),
  data_ocorrencia: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  gravidade: z.enum(["leve", "media", "grave"]).default("media"),
  numero_protocolo: z.string().optional(),
  data_efeito_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  data_efeito_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  afeta_ponto: z.boolean().default(false),
  desconto_valor: z.number().min(0).optional(),
  comentarios: z.string().optional(),
});

const OcorrenciaUpdateSchema = OcorrenciaSchema.partial();

// GET /v1/ocorrencias - Listar ocorrências
ocorrenciasRouter.get("/", async (c) => {
  const authedUser = c.get("user");
  const { user_id, tipo, status, data_inicio, data_fim, gravidade } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let query = supabase
      .from("ocorrencias")
      .select(
        `*,
         profiles:user_id(nome, email, cargo),
         registrado_por:registrado_por_id(nome),
         usuario_aprovacao:usuario_aprovacao_id(nome)`
      )
      .eq("empresa_id", authedUser.id);

    if (user_id) {
      query = query.eq("user_id", user_id);
    }

    if (tipo) {
      query = query.eq("tipo", tipo);
    }

    if (status) {
      query = query.eq("status", status);
    }

    if (gravidade) {
      query = query.eq("gravidade", gravidade);
    }

    if (data_inicio && data_fim) {
      query = query
        .gte("data_ocorrencia", data_inicio)
        .lte("data_ocorrencia", data_fim);
    }

    const { data, error } = await query.order("data_ocorrencia", { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[OCORRENCIAS] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/ocorrencias/:id
ocorrenciasRouter.get("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("ocorrencias")
      .select(
        `*,
         profiles:user_id(nome, email, cargo),
         registrado_por:registrado_por_id(nome),
         usuario_aprovacao:usuario_aprovacao_id(nome),
         usuario_anulacao:usuario_anulacao_id(nome)`
      )
      .eq("id", id)
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Ocorrência not found" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[OCORRENCIAS] GET :id erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/ocorrencias - Criar ocorrência
ocorrenciasRouter.post(
  "/",
  zValidator("json", OcorrenciaSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Validar que colaborador pertence à empresa
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

      const { data, error } = await supabase
        .from("ocorrencias")
        .insert({
          empresa_id: authedUser.id,
          ...payload,
          registrado_por_id: authedUser.id,
          status: "registrada",
        })
        .select(
          `*,
           profiles:user_id(nome, cargo),
           registrado_por:registrado_por_id(nome)`
        )
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json(data, 201);
    } catch (error) {
      console.error("[OCORRENCIAS] POST erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/ocorrencias/:id - Atualizar ocorrência
ocorrenciasRouter.put(
  "/:id",
  zValidator("json", OcorrenciaUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    const { id } = c.req.param();

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("ocorrencias")
        .update(payload)
        .eq("id", id)
        .eq("empresa_id", authedUser.id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return c.json({ error: "Ocorrência not found" }, 404);
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data);
    } catch (error) {
      console.error("[OCORRENCIAS] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// POST /v1/ocorrencias/:id/aprovar - Aprovar ocorrência
ocorrenciasRouter.post("/:id/aprovar", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Buscar ocorrência para validar que registrado_por != usuario_aprovacao
    const { data: ocorrencia } = await supabase
      .from("ocorrencias")
      .select("registrado_por_id")
      .eq("id", id)
      .eq("empresa_id", authedUser.id)
      .single();

    if (!ocorrencia) {
      return c.json({ error: "Ocorrência not found" }, 404);
    }

    if (ocorrencia.registrado_por_id === authedUser.id) {
      return c.json(
        { error: "Não é possível aprovar ocorrência que você registrou" },
        403
      );
    }

    const { data, error } = await supabase
      .from("ocorrencias")
      .update({
        status: "vigente",
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
    console.error("[OCORRENCIAS] POST aprovar erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/ocorrencias/:id/anular - Anular ocorrência
ocorrenciasRouter.post(
  "/:id/anular",
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
        .from("ocorrencias")
        .update({
          status: "anulada",
          motivo_anulacao: motivo,
          usuario_anulacao_id: authedUser.id,
          data_anulacao: new Date().toISOString(),
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
      console.error("[OCORRENCIAS] POST anular erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// POST /v1/ocorrencias/:id/recurso - Registrar recurso
ocorrenciasRouter.post("/:id/recurso", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("ocorrencias")
      .update({
        em_recurso: true,
        data_recurso: new Date().toISOString(),
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
    console.error("[OCORRENCIAS] POST recurso erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// DELETE /v1/ocorrencias/:id
ocorrenciasRouter.delete("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { error } = await supabase
      .from("ocorrencias")
      .delete()
      .eq("id", id)
      .eq("empresa_id", authedUser.id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true }, 204);
  } catch (error) {
    console.error("[OCORRENCIAS] DELETE erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default ocorrenciasRouter;
