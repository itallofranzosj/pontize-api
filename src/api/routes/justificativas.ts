import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const justificativasRouter = new Hono<HonoEnv>();

// Schema
const JustificativaSchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  tipo: z.enum(["falta", "atraso", "saida_antecipada", "intervalo_insuficiente"]),
  motivo: z.string().min(10).max(1000),
  arquivo_url: z.string().url().optional(),
});

// POST /v1/justificativas/solicitar - Solicitar justificativa
justificativasRouter.post(
  "/solicitar",
  zValidator("json", JustificativaSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // 1. Validar que existe marcação ou ocorrência nessa data
      const { data: marcacoes } = await supabase
        .from("marcacoes")
        .select("id")
        .eq("user_id", authedUser.id)
        .eq("marcada_em::DATE", payload.data)
        .limit(1);

      const { data: ocorrencias } = await supabase
        .from("ocorrencias")
        .select("id")
        .eq("user_id", authedUser.id)
        .eq("data_ocorrencia", payload.data)
        .limit(1);

      if ((marcacoes || []).length === 0 && (ocorrencias || []).length === 0) {
        return c.json(
          { error: "Nenhuma marcação ou ocorrência encontrada nessa data" },
          404
        );
      }

      // 2. Verificar se já existe justificativa para essa data
      const { data: existente } = await supabase
        .from("justificativas")
        .select("id")
        .eq("user_id", authedUser.id)
        .eq("data", payload.data)
        .eq("status", "pendente")
        .limit(1);

      if (existente && existente.length > 0) {
        return c.json(
          { error: "Já existe uma justificativa pendente para essa data" },
          409
        );
      }

      // 3. Criar justificativa
      const { data: justificativa, error: justError } = await supabase
        .from("justificativas")
        .insert({
          empresa_id: authedUser.id,
          user_id: authedUser.id,
          data: payload.data,
          tipo: payload.tipo,
          motivo: payload.motivo,
          arquivo_url: payload.arquivo_url,
          status: "pendente",
        })
        .select()
        .single();

      if (justError) {
        return c.json({ error: justError.message }, 400);
      }

      // 4. Log auditoria
      await supabase.from("auditoria_log").insert({
        empresa_id: authedUser.id,
        entidade: "justificativa",
        entidade_id: justificativa.id,
        operacao: "INSERT",
        tipo_operacao: "solicitarJustificativa",
        usuario_id: authedUser.id,
        data_operacao: new Date().toISOString(),
        data_referencia: payload.data,
        motivo: payload.motivo,
        status: "sucesso",
        mensagem_status: "Justificativa solicitada",
      });

      return c.json(
        {
          sucesso: true,
          justificativa,
          mensagem: "Justificativa solicitada com sucesso. Aguarde análise",
        },
        201
      );
    } catch (error) {
      console.error("[JUSTIFICATIVAS] POST solicitar erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/justificativas - Listar justificativas pessoais
justificativasRouter.get("/", async (c) => {
  const authedUser = c.get("user");
  const { status } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let query = supabase
      .from("justificativas")
      .select("*")
      .eq("user_id", authedUser.id)
      .order("data", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    // Agrupar por status
    const agrupadas = {
      pendentes: (data || []).filter((j) => j.status === "pendente"),
      aprovadas: (data || []).filter((j) => j.status === "aprovada"),
      rejeitadas: (data || []).filter((j) => j.status === "rejeitada"),
    };

    const resposta = {
      total: data?.length || 0,
      pendentes: agrupadas.pendentes.length,
      aprovadas: agrupadas.aprovadas.length,
      rejeitadas: agrupadas.rejeitadas.length,
      justificativas: data || [],
      agrupadas,
    };

    return c.json(resposta);
  } catch (error) {
    console.error("[JUSTIFICATIVAS] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/justificativas/:id - Detalhes de uma justificativa
justificativasRouter.get("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("justificativas")
      .select("*")
      .eq("id", id)
      .eq("user_id", authedUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Justificativa não encontrada" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[JUSTIFICATIVAS] GET :id erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// PUT /v1/justificativas/:id - Atualizar justificativa (apenas se pendente)
justificativasRouter.put(
  "/:id",
  zValidator("json", JustificativaSchema.partial()),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    const { id } = c.req.param();

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Verificar que é pendente
      const { data: existente } = await supabase
        .from("justificativas")
        .select("status")
        .eq("id", id)
        .eq("user_id", authedUser.id)
        .single();

      if (!existente) {
        return c.json({ error: "Justificativa não encontrada" }, 404);
      }

      if (existente.status !== "pendente") {
        return c.json(
          { error: "Não é possível editar justificativa que já foi analisada" },
          409
        );
      }

      // Atualizar
      const { data, error } = await supabase
        .from("justificativas")
        .update(payload)
        .eq("id", id)
        .eq("user_id", authedUser.id)
        .select()
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json(data);
    } catch (error) {
      console.error("[JUSTIFICATIVAS] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// DELETE /v1/justificativas/:id - Cancelar justificativa (apenas se pendente)
justificativasRouter.delete("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Verificar status
    const { data: existente } = await supabase
      .from("justificativas")
      .select("status")
      .eq("id", id)
      .eq("user_id", authedUser.id)
      .single();

    if (!existente) {
      return c.json({ error: "Justificativa não encontrada" }, 404);
    }

    if (existente.status !== "pendente") {
      return c.json(
        { error: "Não é possível cancelar justificativa que já foi analisada" },
        409
      );
    }

    // Deletar
    const { error } = await supabase
      .from("justificativas")
      .delete()
      .eq("id", id)
      .eq("user_id", authedUser.id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ sucesso: true, mensagem: "Justificativa cancelada" }, 200);
  } catch (error) {
    console.error("[JUSTIFICATIVAS] DELETE erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default justificativasRouter;
