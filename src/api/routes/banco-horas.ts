import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const bancoHorasRouter = new Hono<HonoEnv>();

// Schemas
const CompensacaoSchema = z.object({
  banco_horas_id: z.string().uuid(),
  horas: z.number().min(0.25).max(999),
  motivo: z.string().min(5).max(500),
});

const AjusteSchema = z.object({
  user_id: z.string().uuid(),
  horas: z.number().min(-999).max(999),
  motivo: z.string().min(5).max(500),
  periodo_ano: z.number().int().min(2020).max(2099).optional(),
  periodo_mes: z.number().int().min(1).max(12).optional(),
});

// GET /v1/banco-horas/meu-saldo - Obter saldo do próprio usuário
bancoHorasRouter.get("/meu-saldo", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("banco_horas")
      .select(
        `*,
         movimentacoes:movimentacoes_banco_horas(id, tipo, horas, data_movimentacao, descricao)
           .order('data_movimentacao', { ascending: false })
           .limit(10)`
      )
      .eq("user_id", authedUser.id)
      .eq("empresa_id", authedUser.id)
      .order("data_vencimento", { ascending: true });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[BANCO_HORAS] GET meu-saldo erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/banco-horas/usuario/:user_id - Obter saldo de um colaborador (RH)
bancoHorasRouter.get("/usuario/:user_id", async (c) => {
  const authedUser = c.get("user");
  const { user_id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Validar que colaborador pertence à empresa
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

    const { data, error } = await supabase
      .from("banco_horas")
      .select(
        `*,
         movimentacoes:movimentacoes_banco_horas(id, tipo, horas, data_movimentacao, descricao, status)
           .order('data_movimentacao', { ascending: false })`
      )
      .eq("user_id", user_id)
      .eq("empresa_id", authedUser.id)
      .order("data_vencimento", { ascending: true });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[BANCO_HORAS] GET usuario/:user_id erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/banco-horas/vencimentos-proximos - Listar bancos vencendo
bancoHorasRouter.get("/vencimentos-proximos", async (c) => {
  const authedUser = c.get("user");
  const { dias } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const diasLimite = Math.min(parseInt(dias || "30"), 365);

    const { data, error } = await supabase.rpc(
      "listar_vencimentos_proximos",
      {
        p_empresa_id: authedUser.id,
        p_dias_limite: diasLimite,
      }
    );

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[BANCO_HORAS] GET vencimentos-proximos erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/banco-horas/calcular-saldo - Calcular saldo (sem salvar)
bancoHorasRouter.post(
  "/calcular-saldo",
  zValidator(
    "json",
    z.object({
      user_id: z.string().uuid().optional(),
      periodo_ano: z.number().int(),
      periodo_mes: z.number().int().min(1).max(12),
    })
  ),
  async (c) => {
    const { user_id, periodo_ano, periodo_mes } = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const colaboradorId = user_id || authedUser.id;

      // Validar colaborador
      const { data: colaborador } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", colaboradorId)
        .eq("empresa_id", authedUser.id)
        .single();

      if (!colaborador) {
        return c.json(
          { error: "Colaborador não encontrado ou não pertence à empresa" },
          404
        );
      }

      // Chamar função PostgreSQL
      const { data: resultado, error } = await supabase.rpc(
        "calcular_saldo_banco",
        {
          p_empresa_id: authedUser.id,
          p_user_id: colaboradorId,
          p_periodo_ano: periodo_ano,
          p_periodo_mes: periodo_mes,
        }
      );

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      if (resultado && resultado[0]) {
        return c.json(resultado[0]);
      }

      return c.json({ error: "Erro ao calcular saldo" }, 400);
    } catch (error) {
      console.error("[BANCO_HORAS] POST calcular-saldo erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// POST /v1/banco-horas/aplicar-compensacao - Aplicar débito (compensação)
bancoHorasRouter.post(
  "/aplicar-compensacao",
  zValidator("json", CompensacaoSchema),
  async (c) => {
    const { banco_horas_id, horas, motivo } = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Validar banco_horas pertence à empresa
      const { data: bancoHoras } = await supabase
        .from("banco_horas")
        .select("id, user_id, saldo_horas")
        .eq("id", banco_horas_id)
        .eq("empresa_id", authedUser.id)
        .single();

      if (!bancoHoras) {
        return c.json({ error: "Banco de horas não encontrado" }, 404);
      }

      if (bancoHoras.saldo_horas < horas) {
        return c.json(
          {
            error: `Saldo insuficiente: ${bancoHoras.saldo_horas.toFixed(2)} horas (solicitado: ${horas.toFixed(2)})`,
          },
          409
        );
      }

      // Chamar função PostgreSQL
      const { data: resultado, error } = await supabase.rpc(
        "aplicar_compensacao",
        {
          p_empresa_id: authedUser.id,
          p_user_id: bancoHoras.user_id,
          p_banco_horas_id: banco_horas_id,
          p_horas: horas,
          p_motivo: motivo,
          p_usuario_operacao_id: authedUser.id,
        }
      );

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      if (resultado && resultado[0]) {
        const res = resultado[0];
        return c.json({
          sucesso: res.sucesso,
          novo_saldo: res.novo_saldo,
          movimentacao_id: res.movimentacao_id,
          alertas: res.alertas,
        });
      }

      return c.json({ error: "Erro ao aplicar compensação" }, 400);
    } catch (error) {
      console.error("[BANCO_HORAS] POST aplicar-compensacao erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// POST /v1/banco-horas/ajuste - Ajuste manual (RH)
bancoHorasRouter.post(
  "/ajuste",
  zValidator("json", AjusteSchema),
  async (c) => {
    const { user_id, horas, motivo, periodo_ano, periodo_mes } =
      c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Validar que colaborador pertence à empresa
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

      // Se período não fornecido, usar atual
      const ano = periodo_ano || new Date().getFullYear();
      const mes = periodo_mes || new Date().getMonth() + 1;

      // Buscar ou criar banco de horas
      let { data: bancoHoras } = await supabase
        .from("banco_horas")
        .select("id, saldo_horas")
        .eq("user_id", user_id)
        .eq("empresa_id", authedUser.id)
        .eq("periodo_ano", ano)
        .eq("periodo_mes", mes)
        .single();

      if (!bancoHoras) {
        // Criar novo banco de horas
        const dataInicio = new Date(`${ano}-${String(mes).padStart(2, "0")}-01`);
        const dataFim = new Date(ano, mes, 0); // Último dia do mês
        const dataVencimento = new Date(ano, mes + 11, 0); // Fim do mês 12 meses depois

        const { data: novo } = await supabase
          .from("banco_horas")
          .insert({
            empresa_id: authedUser.id,
            user_id,
            periodo_ano: ano,
            periodo_mes: mes,
            data_vencimento: dataVencimento.toISOString().split("T")[0],
            saldo_horas: 0,
          })
          .select()
          .single();

        bancoHoras = novo;
      }

      // Criar movimentação
      const { data: movimentacao, error: movError } = await supabase
        .from("movimentacoes_banco_horas")
        .insert({
          empresa_id: authedUser.id,
          user_id,
          banco_horas_id: bancoHoras.id,
          tipo: horas > 0 ? "credito_ajuste" : "debito_compensacao",
          descricao: motivo,
          data_movimentacao: new Date().toISOString().split("T")[0],
          horas,
          saldo_anterior: bancoHoras.saldo_horas,
          saldo_novo: bancoHoras.saldo_horas + horas,
          usuario_origem_id: authedUser.id,
          status: "aprovado",
        })
        .select()
        .single();

      if (movError) {
        return c.json({ error: movError.message }, 400);
      }

      return c.json({
        sucesso: true,
        movimentacao: movimentacao,
        novo_saldo: bancoHoras.saldo_horas + horas,
      });
    } catch (error) {
      console.error("[BANCO_HORAS] POST ajuste erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/banco-horas/movimentacoes/:banco_horas_id - Histórico de movimentações
bancoHorasRouter.get("/movimentacoes/:banco_horas_id", async (c) => {
  const authedUser = c.get("user");
  const { banco_horas_id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Validar que banco_horas pertence à empresa
    const { data: bancoHoras } = await supabase
      .from("banco_horas")
      .select("id")
      .eq("id", banco_horas_id)
      .eq("empresa_id", authedUser.id)
      .single();

    if (!bancoHoras) {
      return c.json({ error: "Banco de horas não encontrado" }, 404);
    }

    const { data, error } = await supabase
      .from("movimentacoes_banco_horas")
      .select("*")
      .eq("banco_horas_id", banco_horas_id)
      .order("data_movimentacao", { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[BANCO_HORAS] GET movimentacoes erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default bancoHorasRouter;
