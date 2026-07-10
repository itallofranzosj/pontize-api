import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const operacoesRouter = new Hono<HonoEnv>();

// Schemas
const RecalcularDiaSchema = z.object({
  user_id: z.string().uuid().optional(),
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

const FecharPeriodoSchema = z.object({
  ano: z.number().int().min(2020).max(2099),
  mes: z.number().int().min(1).max(12),
});

const RreabrirPeriodoSchema = z.object({
  periodo_id: z.string().uuid(),
  motivo: z.string().min(5),
});

// POST /v1/operacoes/recalcular-dia - Recalcular marcações de um dia
operacoesRouter.post(
  "/recalcular-dia",
  zValidator("json", RecalcularDiaSchema),
  async (c) => {
    const { user_id, data } = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Se user_id fornecido, validar que pertence à empresa
      let colaboradorId = user_id;
      if (user_id) {
        const { data: colaborador } = await supabase
          .from("profiles")
          .select("id")
          .eq("id", user_id)
          .eq("empresa_id", authedUser.id)
          .single();

        if (!colaborador) {
          return c.json(
            { error: "Colaborador não encontrado ou não pertence à empresa" },
            404
          );
        }
      } else {
        // Se não fornecido, usar próprio usuário
        colaboradorId = authedUser.id;
      }

      // Chamar função PostgreSQL
      const { data: resultado, error } = await supabase.rpc(
        "recalcular_dia",
        {
          p_empresa_id: authedUser.id,
          p_user_id: colaboradorId,
          p_data: data,
          p_usuario_operacao_id: authedUser.id,
        }
      );

      if (error) {
        console.error("[OPERACOES] recalcular_dia erro:", error);
        return c.json({ error: error.message }, 400);
      }

      if (resultado && resultado[0]) {
        const res = resultado[0];
        return c.json({
          sucesso: res.sucesso,
          marcacoes_processadas: res.marcacoes_processadas,
          alertas: res.alertas,
          erros: res.erros,
        });
      }

      return c.json({
        sucesso: false,
        marcacoes_processadas: 0,
        alertas: [],
        erros: ["Erro ao processar recálculo"],
      });
    } catch (error) {
      console.error("[OPERACOES] POST recalcular-dia erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// POST /v1/operacoes/fechar-periodo - Fechar período/mês
operacoesRouter.post(
  "/fechar-periodo",
  zValidator("json", FecharPeriodoSchema),
  async (c) => {
    const { ano, mes } = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Verificar que período ainda não está fechado
      const { data: periodoExistente } = await supabase
        .from("periodos_fechados")
        .select("id, status")
        .eq("empresa_id", authedUser.id)
        .eq("ano", ano)
        .eq("mes", mes)
        .single();

      if (periodoExistente && periodoExistente.status === "fechado") {
        return c.json(
          { error: "Período já foi fechado anteriormente" },
          409
        );
      }

      // Chamar função PostgreSQL
      const { data: resultado, error } = await supabase.rpc(
        "fechar_periodo",
        {
          p_empresa_id: authedUser.id,
          p_ano: ano,
          p_mes: mes,
          p_usuario_operacao_id: authedUser.id,
        }
      );

      if (error) {
        console.error("[OPERACOES] fechar_periodo erro:", error);
        return c.json({ error: error.message }, 400);
      }

      if (resultado && resultado[0]) {
        const res = resultado[0];
        return c.json({
          sucesso: res.sucesso,
          periodo_id: res.periodo_id,
          colaboradores_processados: res.colaboradores_processados,
          alertas: res.alertas,
          erros: res.erros,
        });
      }

      return c.json({
        sucesso: false,
        periodo_id: null,
        colaboradores_processados: 0,
        alertas: [],
        erros: ["Erro ao processar fechamento"],
      });
    } catch (error) {
      console.error("[OPERACOES] POST fechar-periodo erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// POST /v1/operacoes/reabrir-periodo - Reabrir período fechado
operacoesRouter.post(
  "/reabrir-periodo",
  zValidator("json", RreabrirPeriodoSchema),
  async (c) => {
    const { periodo_id, motivo } = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Buscar período
      const { data: periodo, error: periodoError } = await supabase
        .from("periodos_fechados")
        .select("id, status, ano, mes")
        .eq("id", periodo_id)
        .eq("empresa_id", authedUser.id)
        .single();

      if (periodoError) {
        return c.json({ error: "Período não encontrado" }, 404);
      }

      if (periodo.status !== "fechado") {
        return c.json(
          { error: "Apenas períodos fechados podem ser reabertos" },
          409
        );
      }

      // Reabrir período
      const { data: atualizado, error: updateError } = await supabase
        .from("periodos_fechados")
        .update({
          status: "aberto",
          motivo_cancelamento: motivo,
          data_cancelamento: new Date().toISOString(),
          usuario_cancelamento_id: authedUser.id,
        })
        .eq("id", periodo_id)
        .select()
        .single();

      if (updateError) {
        return c.json({ error: updateError.message }, 400);
      }

      // Log auditoria
      await supabase.from("auditoria_log").insert({
        empresa_id: authedUser.id,
        entidade: "periodo",
        entidade_id: periodo_id,
        operacao: "FECHAR",
        tipo_operacao: "reabrirPeriodo",
        usuario_id: authedUser.id,
        data_operacao: new Date().toISOString(),
        data_referencia: new Date(`${periodo.ano}-${String(periodo.mes).padStart(2, "0")}-01`),
        motivo: `Reabertura: ${motivo}`,
        status: "sucesso",
        mensagem_status: "Período reaberto para correções",
      });

      return c.json({
        sucesso: true,
        periodo: atualizado,
        mensagem: "Período reaberto para correções",
      });
    } catch (error) {
      console.error("[OPERACOES] POST reabrir-periodo erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/operacoes/periodos-fechados - Listar períodos fechados
operacoesRouter.get("/periodos-fechados", async (c) => {
  const authedUser = c.get("user");
  const { status } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let query = supabase
      .from("periodos_fechados")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .order("ano", { ascending: false })
      .order("mes", { ascending: false });

    if (status) {
      query = query.eq("status", status);
    }

    const { data, error } = await query;

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[OPERACOES] GET periodos-fechados erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/operacoes/auditoria - Listar logs de auditoria
operacoesRouter.get("/auditoria", async (c) => {
  const authedUser = c.get("user");
  const { entidade, operacao, data_inicio, data_fim, limit } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let query = supabase
      .from("auditoria_log")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .order("data_operacao", { ascending: false });

    if (entidade) {
      query = query.eq("entidade", entidade);
    }

    if (operacao) {
      query = query.eq("operacao", operacao);
    }

    if (data_inicio && data_fim) {
      query = query
        .gte("data_operacao", `${data_inicio}T00:00:00Z`)
        .lte("data_operacao", `${data_fim}T23:59:59Z`);
    }

    const limitNum = Math.min(parseInt(limit || "100"), 1000);
    query = query.limit(limitNum);

    const { data, error } = await query;

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[OPERACOES] GET auditoria erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/operacoes/auditoria/:id - Detalhe de operação
operacoesRouter.get("/auditoria/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("auditoria_log")
      .select("*")
      .eq("id", id)
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Operação não encontrada" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[OPERACOES] GET auditoria/:id erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default operacoesRouter;
