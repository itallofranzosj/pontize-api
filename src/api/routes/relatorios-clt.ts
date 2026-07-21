import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const relatorioCltRouter = new Hono<HonoEnv>();

// Schemas
const PeriodoSchema = z.object({
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  user_id: z.string().uuid().optional(),
});

const RelatorioHorasDiaSchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  user_id: z.string().uuid().optional(),
});

// GET /v1/relatorios-clt/horas-dia - Relatório detalhado de um dia
relatorioCltRouter.get(
  "/horas-dia",
  zValidator("query", RelatorioHorasDiaSchema),
  async (c) => {
    const { data, user_id } = c.req.valid("query");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const colaboradorId = user_id || authedUser.id;

      // Validar colaborador
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
      }

      // 1. Buscar marcações do dia
      const { data: marcacoes, error: marcError } = await supabase
        .from("marcacoes")
        .select(
          `*,
           profiles:user_id(nome, email, cargo)`
        )
        .eq("empresa_id", authedUser.id)
        .eq("user_id", colaboradorId)
        .eq("marcada_em::DATE", data);

      if (marcError) {
        return c.json({ error: marcError.message }, 400);
      }

      // 2. Buscar config empresa
      const { data: config } = await supabase
        .from("empresa_config")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .single();

      // 3. Buscar jornada do colaborador
      const { data: profiles } = await supabase
        .from("profiles")
        .select("jornada_id, jornadas(nome, horas_dia)")
        .eq("id", colaboradorId)
        .single();

      // 4. Verificar se é feriado
      const { data: feriado } = await supabase
        .from("dias_uteis")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .eq("data", data)
        .single();

      // 5. Verificar afastamento
      const { data: afastamento } = await supabase
        .from("afastamentos")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .eq("user_id", colaboradorId)
        .eq("status", "aprovado")
        .lte("data_inicio", data)
        .gte("data_fim", data)
        .single();

      // 6. Compilar relatório
      const totalMarcacoes = marcacoes?.length || 0;
      const totalHoras = marcacoes?.reduce((sum, m) => sum + (m.horas_trabalhadas || 0), 0) || 0;
      const totalExtras = marcacoes?.reduce((sum, m) => sum + (m.horas_extras || 0), 0) || 0;
      const totalIntervalo = marcacoes?.reduce((sum, m) => sum + (m.intervalo_realizado || 0), 0) || 0;
      const totalNoturno = marcacoes?.reduce((sum, m) => sum + (m.adicional_noturno || 0), 0) || 0;
      const totalExtra = marcacoes?.reduce((sum, m) => sum + (m.adicional_extra || 0), 0) || 0;

      // O recurso embutido `jornadas` chega como array do PostgREST; a jornada
      // vigente do colaborador é a primeira (relação efetivamente 1:1).
      const jornadaVigente = Array.isArray(profiles?.jornadas)
        ? profiles?.jornadas[0]
        : profiles?.jornadas;

      const relatorio = {
        data,
        colaborador: profiles,
        jornada: jornadaVigente,
        config: {
          jornada_padrao: config?.jornada_padrao_horas,
          intervalo_minimo: config?.intervalo_minimo_apos_6h,
        },
        eh_feriado: !!feriado,
        em_afastamento: !!afastamento,
        afastamento_tipo: afastamento ? { nome: "Afastamento", data_inicio: afastamento.data_inicio, data_fim: afastamento.data_fim } : null,
        marcacoes: marcacoes || [],
        totais: {
          marcacoes: totalMarcacoes,
          horas_trabalhadas: parseFloat(totalHoras.toFixed(2)),
          horas_extras: parseFloat(totalExtras.toFixed(2)),
          intervalo_realizado: parseFloat(totalIntervalo.toFixed(2)),
          adicional_noturno: parseFloat(totalNoturno.toFixed(2)),
          adicional_extra: parseFloat(totalExtra.toFixed(2)),
        },
        validacoes: {
          jornada_ok: totalHoras <= (jornadaVigente?.horas_dia || 8) + 2,
          intervalo_ok: totalIntervalo >= (config?.intervalo_minimo_apos_6h || 60) / 60,
          todas_marcacoes_validadas: (marcacoes || []).every((m) => m.validada),
        },
        alertas: (marcacoes || [])
          .filter((m) => m.alertas)
          .flatMap((m) => m.alertas || []),
      };

      return c.json(relatorio);
    } catch (error) {
      console.error("[RELATORIOS_CLT] GET horas-dia erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/relatorios-clt/horas-mes - Relatório de horas do mês
relatorioCltRouter.get(
  "/horas-mes",
  zValidator("query", PeriodoSchema),
  async (c) => {
    const { data_inicio, data_fim, user_id } = c.req.valid("query");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const colaboradorId = user_id || authedUser.id;

      // Buscar marcações do período
      const { data: marcacoes } = await supabase
        .from("marcacoes")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .eq("user_id", colaboradorId)
        .gte("marcada_em::DATE", data_inicio)
        .lte("marcada_em::DATE", data_fim)
        .order("marcada_em");

      // Buscar config
      const { data: config } = await supabase
        .from("empresa_config")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .single();

      // Buscar perfil
      const { data: profiles } = await supabase
        .from("profiles")
        .select("nome, cargo, jornadas(horas_dia)")
        .eq("id", colaboradorId)
        .single();

      // Calcular totais
      const totalHoras = marcacoes?.reduce((sum, m) => sum + (m.horas_trabalhadas || 0), 0) || 0;
      const totalExtras = marcacoes?.reduce((sum, m) => sum + (m.horas_extras || 0), 0) || 0;
      const totalNoturno = marcacoes?.reduce((sum, m) => sum + (m.adicional_noturno || 0), 0) || 0;
      const totalExtra = marcacoes?.reduce((sum, m) => sum + (m.adicional_extra || 0), 0) || 0;
      const jornada_esperada = (config?.jornada_padrao_horas || 8) * 22; // ~22 dias úteis

      const relatorio = {
        periodo: { data_inicio, data_fim },
        colaborador: profiles,
        totais: {
          dias_trabalhados: new Set((marcacoes || []).map((m) => m.marcada_em?.split("T")[0])).size,
          horas_trabalhadas: parseFloat(totalHoras.toFixed(2)),
          horas_esperadas: jornada_esperada,
          diferenca_horas: parseFloat((totalHoras - jornada_esperada).toFixed(2)),
          horas_extras: parseFloat(totalExtras.toFixed(2)),
          adicional_noturno: parseFloat(totalNoturno.toFixed(2)),
          adicional_extra: parseFloat(totalExtra.toFixed(2)),
        },
        dias: {
          com_marcacoes: new Set((marcacoes || []).map((m) => m.marcada_em?.split("T")[0])).size,
          sem_marcacoes: 22 - (new Set((marcacoes || []).map((m) => m.marcada_em?.split("T")[0])).size || 0),
        },
        alertas: marcacoes
          ? marcacoes
              .filter((m) => m.alertas)
              .flatMap((m) => m.alertas || [])
              .slice(0, 10)
          : [],
      };

      return c.json(relatorio);
    } catch (error) {
      console.error("[RELATORIOS_CLT] GET horas-mes erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/relatorios-clt/banco-horas - Relatório de banco de horas
relatorioCltRouter.get("/banco-horas", async (c) => {
  const authedUser = c.get("user");
  const { user_id, periodo_ano, periodo_mes } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const colaboradorId = user_id || authedUser.id;
    const ano = periodo_ano ? parseInt(periodo_ano) : new Date().getFullYear();
    const mes = periodo_mes ? parseInt(periodo_mes) : new Date().getMonth() + 1;

    // Buscar banco de horas
    const { data: bancoHoras } = await supabase
      .from("banco_horas")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .eq("user_id", colaboradorId)
      .eq("periodo_ano", ano)
      .eq("periodo_mes", mes)
      .single();

    // Buscar movimentações
    const { data: movimentacoes } = await supabase
      .from("movimentacoes_banco_horas")
      .select("*")
      .eq("user_id", colaboradorId)
      .eq("empresa_id", authedUser.id)
      .gte("data_movimentacao", `${ano}-${String(mes).padStart(2, "0")}-01`)
      .order("data_movimentacao", { ascending: false });

    const relatorio = {
      periodo: { ano, mes },
      colaborador_id: colaboradorId,
      saldo_atual: bancoHoras?.saldo_horas || 0,
      status: bancoHoras?.status || "nao_criado",
      data_vencimento: bancoHoras?.data_vencimento,
      dias_para_vencer: bancoHoras?.data_vencimento
        ? Math.floor(
            (new Date(bancoHoras.data_vencimento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
          )
        : null,
      movimentacoes: (movimentacoes || []).map((m) => ({
        id: m.id,
        tipo: m.tipo,
        data: m.data_movimentacao,
        horas: m.horas,
        descricao: m.descricao,
        saldo_anterior: m.saldo_anterior,
        saldo_novo: m.saldo_novo,
      })),
      resumo: {
        creditos_totais: movimentacoes
          ?.filter((m) => m.horas > 0)
          .reduce((sum, m) => sum + m.horas, 0) || 0,
        debitos_totais: movimentacoes
          ?.filter((m) => m.horas < 0)
          .reduce((sum, m) => sum + Math.abs(m.horas), 0) || 0,
      },
    };

    return c.json(relatorio);
  } catch (error) {
    console.error("[RELATORIOS_CLT] GET banco-horas erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/relatorios-clt/absenteismo - Relatório de faltas e atrasos
relatorioCltRouter.get(
  "/absenteismo",
  zValidator("query", PeriodoSchema),
  async (c) => {
    const { data_inicio, data_fim, user_id } = c.req.valid("query");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const colaboradorId = user_id || authedUser.id;

      // Buscar ocorrências (faltas, atrasos)
      const { data: ocorrencias } = await supabase
        .from("ocorrencias")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .eq("user_id", colaboradorId)
        .gte("data_ocorrencia", data_inicio)
        .lte("data_ocorrencia", data_fim)
        .in("tipo", ["falta", "atraso"]);

      // Buscar afastamentos
      const { data: afastamentos } = await supabase
        .from("afastamentos")
        .select("*, tipos_afastamento(nome)")
        .eq("empresa_id", authedUser.id)
        .eq("user_id", colaboradorId)
        .eq("status", "aprovado")
        .lte("data_inicio", data_fim)
        .gte("data_fim", data_inicio);

      // Contar faltas vs atrasos
      const faltas = ocorrencias?.filter((o) => o.tipo === "falta") || [];
      const atrasos = ocorrencias?.filter((o) => o.tipo === "atraso") || [];

      const relatorio = {
        periodo: { data_inicio, data_fim },
        colaborador_id: colaboradorId,
        resumo: {
          total_faltas: faltas.length,
          total_atrasos: atrasos.length,
          total_afastamentos: afastamentos?.length || 0,
          minutos_atraso_total: atrasos.reduce((sum, a) => sum + (a.intervalo_realizado || 0), 0),
        },
        faltas: faltas.map((f) => ({
          data: f.data_ocorrencia,
          tipo: f.tipo,
          gravidade: f.gravidade,
          status: f.status,
        })),
        atrasos: atrasos.map((a) => ({
          data: a.data_ocorrencia,
          minutos: a.intervalo_realizado,
          gravidade: a.gravidade,
        })),
        afastamentos: afastamentos?.map((af) => ({
          tipo: af.tipos_afastamento?.nome,
          data_inicio: af.data_inicio,
          data_fim: af.data_fim,
          duracao_dias: af.duracao_dias,
        })) || [],
      };

      return c.json(relatorio);
    } catch (error) {
      console.error("[RELATORIOS_CLT] GET absenteismo erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/relatorios-clt/intervalo-detalhe - Relatório de intervalos insuficientes
relatorioCltRouter.get(
  "/intervalo-detalhe",
  zValidator("query", PeriodoSchema),
  async (c) => {
    const { data_inicio, data_fim, user_id } = c.req.valid("query");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const colaboradorId = user_id || authedUser.id;

      // Buscar config
      const { data: config } = await supabase
        .from("empresa_config")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .single();

      // Buscar marcações com intervalo insuficiente
      const { data: marcacoes } = await supabase
        .from("marcacoes")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .eq("user_id", colaboradorId)
        .gte("marcada_em::DATE", data_inicio)
        .lte("marcada_em::DATE", data_fim);

      // Filtrar apenas as com intervalo insuficiente
      const intervaloInsuficiente = (marcacoes || []).filter((m) => {
        const intervaloMinimo =
          m.horas_trabalhadas > 6
            ? (config?.intervalo_minimo_apos_6h || 60) / 60
            : (config?.intervalo_minimo_ate_6h || 15) / 60;
        return m.intervalo_realizado < intervaloMinimo;
      });

      const relatorio = {
        periodo: { data_inicio, data_fim },
        colaborador_id: colaboradorId,
        config_intervalo: {
          ate_6h: config?.intervalo_minimo_ate_6h,
          apos_6h: config?.intervalo_minimo_apos_6h,
        },
        resumo: {
          total_dias_insuficiente: intervaloInsuficiente.length,
          dias_analisados: new Set((marcacoes || []).map((m) => m.marcada_em?.split("T")[0])).size,
          percentual_insuficiente:
            marcacoes && marcacoes.length > 0
              ? ((intervaloInsuficiente.length / new Set((marcacoes || []).map((m) => m.marcada_em?.split("T")[0])).size) * 100).toFixed(1)
              : 0,
        },
        detalhes: intervaloInsuficiente.map((m) => ({
          data: m.marcada_em?.split("T")[0],
          horas_trabalhadas: m.horas_trabalhadas,
          intervalo_realizado: m.intervalo_realizado,
          intervalo_minimo: m.horas_trabalhadas > 6 ? (config?.intervalo_minimo_apos_6h || 60) / 60 : (config?.intervalo_minimo_ate_6h || 15) / 60,
          diferenca: m.intervalo_realizado - (m.horas_trabalhadas > 6 ? (config?.intervalo_minimo_apos_6h || 60) / 60 : (config?.intervalo_minimo_ate_6h || 15) / 60),
        })),
      };

      return c.json(relatorio);
    } catch (error) {
      console.error("[RELATORIOS_CLT] GET intervalo-detalhe erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/relatorios-clt/validacao-clt - Audit de compliance CLT
relatorioCltRouter.get(
  "/validacao-clt",
  zValidator("query", PeriodoSchema),
  async (c) => {
    const { data_inicio, data_fim, user_id } = c.req.valid("query");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const colaboradorId = user_id || authedUser.id;

      // Buscar auditoria
      const { data: auditoria } = await supabase
        .from("auditoria_log")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .gte("data_operacao", `${data_inicio}T00:00:00Z`)
        .lte("data_operacao", `${data_fim}T23:59:59Z`)
        .in("operacao", ["RECALCULAR", "FECHAR"]);

      // Buscar marcações validadas
      const { data: marcacoes } = await supabase
        .from("marcacoes")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .eq("user_id", colaboradorId)
        .gte("marcada_em::DATE", data_inicio)
        .lte("marcada_em::DATE", data_fim);

      // Analisar compliance
      const marcacoesValidadas = (marcacoes || []).filter((m) => m.validada).length;
      const marcacoesTotal = marcacoes?.length || 0;
      const validacoesClt = marcacoes
        ?.filter((m) => m.validacoes_clt)
        .flatMap((m) => m.validacoes_clt || {})
        .reduce((acc: Record<string, number>, val: any) => {
          for (const [key, value] of Object.entries(val)) {
            acc[key] = (acc[key] || 0) + (value ? 1 : 0);
          }
          return acc;
        }, {});

      const relatorio = {
        periodo: { data_inicio, data_fim },
        colaborador_id: colaboradorId,
        validacao_status: {
          marcacoes_validadas: marcacoesValidadas,
          marcacoes_total: marcacoesTotal,
          percentual_validado: marcacoesTotal > 0 ? ((marcacoesValidadas / marcacoesTotal) * 100).toFixed(1) : 0,
        },
        validacoes_clt: validacoesClt || {},
        alertas_encontrados: (marcacoes || [])
          .filter((m) => m.alertas && m.alertas.length > 0)
          .flatMap((m) => m.alertas || [])
          .slice(0, 20),
        operacoes_recalculo: auditoria?.filter((a) => a.operacao === "RECALCULAR").length || 0,
        operacoes_fechamento: auditoria?.filter((a) => a.operacao === "FECHAR").length || 0,
        compliance_score: marcacoesTotal > 0 ? (marcacoesValidadas / marcacoesTotal) * 100 : 0,
      };

      return c.json(relatorio);
    } catch (error) {
      console.error("[RELATORIOS_CLT] GET validacao-clt erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

export default relatorioCltRouter;
