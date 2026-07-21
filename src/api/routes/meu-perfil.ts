import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const meuPerfilRouter = new Hono<HonoEnv>();

// GET /v1/meu-perfil - Obter dados pessoais do trabalhador
meuPerfilRouter.get("/", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: profile } = await supabase
      .from("profiles")
      .select(
        `*,
         jornadas(id, nome, horas_dia),
         empresa:empresa_id(id, nome)
        `
      )
      .eq("id", authedUser.id)
      .single();

    if (!profile) {
      return c.json({ error: "Perfil não encontrado" }, 404);
    }

    // Mapear campos para resposta amigável
    const resposta = {
      id: profile.id,
      nome: profile.full_name,
      email: profile.email,
      cargo: profile.cargo,
      empresa: profile.empresa,
      jornada: profile.jornadas,
      dados_bancarios: {
        banco: profile.banco_id,
        agencia: profile.agencia_id,
        conta: profile.conta,
      },
      dados_demissao: profile.data_demissao
        ? {
            data_demissao: profile.data_demissao,
            motivo: profile.motivo_demissao,
            com_justa_causa: profile.com_justa_causa,
            aviso_previo_dias: profile.aviso_previo_dias,
            data_fim_aviso: profile.data_fim_aviso_previo,
          }
        : null,
      salario_base: profile.salario_base,
      ativo: profile.ativo,
      criado_em: profile.criado_em,
    };

    return c.json(resposta);
  } catch (error) {
    console.error("[MEU_PERFIL] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/meu-perfil/extrato - Extrato de horas do mês
meuPerfilRouter.get(
  "/extrato",
  zValidator(
    "query",
    z.object({
      mes: z.string().optional(),
      ano: z.string().optional(),
    })
  ),
  async (c) => {
    const authedUser = c.get("user");
    const { mes: mesStr, ano: anoStr } = c.req.valid("query");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Usar mês/ano atual se não fornecido
      const agora = new Date();
      const ano = anoStr ? parseInt(anoStr) : agora.getFullYear();
      const mes = mesStr ? parseInt(mesStr) : agora.getMonth() + 1;

      const dataInicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
      const dataFim = new Date(ano, mes, 0).toISOString().split("T")[0];

      // Buscar marcações validadas do período
      const { data: marcacoes } = await supabase
        .from("marcacoes")
        .select("*")
        .eq("user_id", authedUser.id)
        .gte("marcada_em::DATE", dataInicio)
        .lte("marcada_em::DATE", dataFim)
        .eq("validada", true);

      // Calcular totais
      const totalHoras = marcacoes?.reduce((sum, m) => sum + (m.horas_trabalhadas || 0), 0) || 0;
      const totalExtras = marcacoes?.reduce((sum, m) => sum + (m.horas_extras || 0), 0) || 0;
      const totalNoturno = marcacoes?.reduce((sum, m) => sum + (m.adicional_noturno || 0), 0) || 0;
      const totalExtra = marcacoes?.reduce((sum, m) => sum + (m.adicional_extra || 0), 0) || 0;

      // Agrupar por dia
      const dias = (marcacoes || []).reduce(
        (acc: Record<string, any>, m) => {
          const data = m.marcada_em?.split("T")[0];
          if (!acc[data]) {
            acc[data] = {
              data,
              horas: 0,
              extras: 0,
              intervalo: 0,
              adicionais: 0,
              validada: true,
            };
          }
          acc[data].horas += m.horas_trabalhadas || 0;
          acc[data].extras += m.horas_extras || 0;
          acc[data].intervalo += m.intervalo_realizado || 0;
          acc[data].adicionais += (m.adicional_noturno || 0) + (m.adicional_extra || 0);
          return acc;
        },
        {}
      );

      const resposta = {
        periodo: { mes, ano, data_inicio: dataInicio, data_fim: dataFim },
        resumo: {
          dias_trabalhados: Object.keys(dias).length,
          horas_totais: parseFloat(totalHoras.toFixed(2)),
          horas_extras: parseFloat(totalExtras.toFixed(2)),
          adicional_noturno: parseFloat(totalNoturno.toFixed(2)),
          adicional_extra: parseFloat(totalExtra.toFixed(2)),
          total_adicionais: parseFloat((totalNoturno + totalExtra).toFixed(2)),
        },
        dias: Object.values(dias).map((d: any) => ({
          ...d,
          horas: parseFloat(d.horas.toFixed(2)),
          extras: parseFloat(d.extras.toFixed(2)),
          intervalo: parseFloat(d.intervalo.toFixed(2)),
          adicionais: parseFloat(d.adicionais.toFixed(2)),
        })),
      };

      return c.json(resposta);
    } catch (error) {
      console.error("[MEU_PERFIL] GET extrato erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/meu-perfil/banco-horas - Banco de horas do colaborador
meuPerfilRouter.get("/banco-horas", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Ordenação/limite de recurso embutido vai como opção do query builder —
    // dentro da string do select o PostgREST rejeita a query inteira e o
    // banco de horas voltava sempre vazio.
    const { data: bancosHoras } = await supabase
      .from("banco_horas")
      .select(
        `*,
         movimentacoes:movimentacoes_banco_horas(id, tipo, horas, data_movimentacao, descricao)`
      )
      .eq("user_id", authedUser.id)
      .order("data_vencimento", { ascending: true })
      .order("data_movimentacao", { referencedTable: "movimentacoes", ascending: false })
      .limit(10, { referencedTable: "movimentacoes" });

    // Calcular alertas
    const alertas: string[] = [];
    bancosHoras?.forEach((bh) => {
      if (bh.status === "expirado") {
        alertas.push(`Banco de ${bh.periodo_mes}/${bh.periodo_ano} expirou`);
      } else if (bh.data_vencimento) {
        const dias = Math.floor(
          (new Date(bh.data_vencimento).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );
        if (dias > 0 && dias <= 30) {
          alertas.push(`Banco de ${bh.periodo_mes}/${bh.periodo_ano} vence em ${dias} dias`);
        }
      }
    });

    const resposta = {
      bancos: (bancosHoras || []).map((bh) => ({
        periodo: { mes: bh.periodo_mes, ano: bh.periodo_ano },
        saldo_horas: bh.saldo_horas,
        saldo_minutos: bh.saldo_minutos,
        data_vencimento: bh.data_vencimento,
        status: bh.status,
        movimentacoes: bh.movimentacoes,
      })),
      saldo_total: (bancosHoras || []).reduce((sum, bh) => sum + (bh.saldo_horas || 0), 0),
      alertas,
    };

    return c.json(resposta);
  } catch (error) {
    console.error("[MEU_PERFIL] GET banco-horas erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/meu-perfil/historico-marcacoes - Histórico de marcações
meuPerfilRouter.get(
  "/historico-marcacoes",
  zValidator(
    "query",
    z.object({
      data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
      limite: z.string().optional(),
    })
  ),
  async (c) => {
    const authedUser = c.get("user");
    const { data_inicio, data_fim, limite } = c.req.valid("query");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const dataIni = data_inicio || new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split("T")[0];
      const dataFim_var = data_fim || new Date().toISOString().split("T")[0];
      const lim = Math.min(parseInt(limite || "100"), 500);

      const { data: marcacoes } = await supabase
        .from("marcacoes")
        .select("*")
        .eq("user_id", authedUser.id)
        .gte("marcada_em::DATE", dataIni)
        .lte("marcada_em::DATE", dataFim_var)
        .order("marcada_em", { ascending: false })
        .limit(lim);

      // Agrupar por dia
      const dias = (marcacoes || []).reduce(
        (acc: Record<string, any>, m) => {
          const data = m.marcada_em?.split("T")[0];
          if (!acc[data]) {
            acc[data] = {
              data,
              marcacoes: [],
              horas_trabalhadas: 0,
              horas_extras: 0,
              validada: false,
              alertas: [],
            };
          }
          acc[data].marcacoes.push({
            tipo: m.tipo,
            horario: m.marcada_em?.split("T")[1],
          });
          acc[data].horas_trabalhadas = m.horas_trabalhadas || 0;
          acc[data].horas_extras = m.horas_extras || 0;
          acc[data].validada = m.validada;
          if (m.alertas && m.alertas.length > 0) {
            acc[data].alertas = m.alertas;
          }
          return acc;
        },
        {}
      );

      const resposta = {
        periodo: { data_inicio: dataIni, data_fim: dataFim_var },
        dias: Object.values(dias),
        total_dias: Object.keys(dias).length,
      };

      return c.json(resposta);
    } catch (error) {
      console.error("[MEU_PERFIL] GET historico-marcacoes erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/meu-perfil/afastamentos - Afastamentos pessoais
meuPerfilRouter.get("/afastamentos", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: afastamentos } = await supabase
      .from("afastamentos")
      .select("*, tipos_afastamento(nome)")
      .eq("user_id", authedUser.id)
      .order("data_inicio", { ascending: false });

    const resposta = {
      total: afastamentos?.length || 0,
      ativos: afastamentos?.filter((a) => a.status === "aprovado") || [],
      historico: afastamentos?.map((a) => ({
        id: a.id,
        tipo: a.tipos_afastamento?.nome,
        data_inicio: a.data_inicio,
        data_fim: a.data_fim,
        duracao_dias: a.duracao_dias,
        status: a.status,
        motivo: a.motivo,
      })) || [],
    };

    return c.json(resposta);
  } catch (error) {
    console.error("[MEU_PERFIL] GET afastamentos erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default meuPerfilRouter;
