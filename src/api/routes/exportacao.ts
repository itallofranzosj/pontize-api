import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const exportacaoRouter = new Hono<HonoEnv>();

// Schema
const ExportacaoSchema = z.object({
  formato: z.enum(["csv", "txt", "json", "pdf", "webfopag", "mte"]),
  data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  user_ids: z.array(z.string().uuid()).optional(),
  incluir_banco_horas: z.boolean().default(true),
  incluir_adicionais: z.boolean().default(true),
});

// Helper: Formatar CSV
function formatarCSV(dados: any[]): string {
  if (dados.length === 0) return "";

  const headers = Object.keys(dados[0]);
  const csv = [
    headers.join(","),
    ...dados.map((row) =>
      headers
        .map((header) => {
          const valor = row[header];
          if (typeof valor === "string" && (valor.includes(",") || valor.includes('"'))) {
            return `"${valor.replace(/"/g, '""')}"`;
          }
          return valor || "";
        })
        .join(",")
    ),
  ];

  return csv.join("\n");
}

// Helper: Formatar TXT
function formatarTXT(dados: any[]): string {
  if (dados.length === 0) return "";

  let txt = "";
  dados.forEach((row, index) => {
    txt += `\n--- Registro ${index + 1} ---\n`;
    Object.entries(row).forEach(([key, value]) => {
      txt += `${key}: ${value}\n`;
    });
  });

  return txt;
}

// Helper: Formatar JSON
function formatarJSON(dados: any[]): string {
  return JSON.stringify(dados, null, 2);
}

// Helper: Formatar WebFopag (XML-like)
function formatarWebFopag(dados: any[]): string {
  let xml = '<?xml version="1.0" encoding="UTF-8"?>\n<pontos>\n';

  dados.forEach((row) => {
    xml += "  <registro>\n";
    Object.entries(row).forEach(([key, value]) => {
      xml += `    <${key}>${value}</${key}>\n`;
    });
    xml += "  </registro>\n";
  });

  xml += "</pontos>";
  return xml;
}

// Helper: Formatar MTE (Ministério)
function formatarMTE(dados: any[]): string {
  // Formato simplificado do MTE (brasileiro)
  let mte = "CNPJ|Data|Colaborador|Horas|Extras|Adicionais\n";

  dados.forEach((row) => {
    mte += `${row.empresa_cnpj || ""}|${row.data || ""}|${row.colaborador || ""}|${row.horas || 0}|${row.extras || 0}|${row.adicionais || 0}\n`;
  });

  return mte;
}

// GET /v1/exportacao/preview - Preview dos dados a exportar
exportacaoRouter.get(
  "/preview",
  zValidator(
    "query",
    z.object({
      data_inicio: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
      data_fim: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    })
  ),
  async (c) => {
    const authedUser = c.get("user");
    const { data_inicio, data_fim } = c.req.valid("query");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Buscar dados do período
      const { data: marcacoes } = await supabase
        .from("marcacoes")
        .select("*, profiles(nome, cargo)")
        .eq("empresa_id", authedUser.id)
        .gte("marcada_em::DATE", data_inicio)
        .lte("marcada_em::DATE", data_fim)
        .limit(10);

      const resposta = {
        periodo: { data_inicio, data_fim },
        total_registros_estimado: "a calcular",
        amostra_primeiros_10: marcacoes || [],
        colunas_disponiveis: [
          "data",
          "colaborador",
          "cargo",
          "horas_trabalhadas",
          "horas_extras",
          "intervalo_realizado",
          "adicional_noturno",
          "adicional_extra",
          "validada",
        ],
      };

      return c.json(resposta);
    } catch (error) {
      console.error("[EXPORTACAO] GET preview erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// POST /v1/exportacao/exportar - Exportar em formato específico
exportacaoRouter.post(
  "/exportar",
  zValidator("json", ExportacaoSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Buscar dados
      let query = supabase
        .from("marcacoes")
        .select(
          `data:marcada_em,
           colaborador:profiles.nome,
           cargo:profiles.cargo,
           horas_trabalhadas,
           horas_extras,
           intervalo_realizado,
           adicional_noturno,
           adicional_extra,
           validada`
        )
        .eq("empresa_id", authedUser.id)
        .gte("marcada_em::DATE", payload.data_inicio)
        .lte("marcada_em::DATE", payload.data_fim);

      if (payload.user_ids && payload.user_ids.length > 0) {
        query = query.in("user_id", payload.user_ids);
      }

      const { data: marcacoes, error } = await query;

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      if (!marcacoes || marcacoes.length === 0) {
        return c.json({ error: "Nenhum dado encontrado para o período" }, 404);
      }

      // Formatar dados
      let conteudo = "";
      let tipo_conteudo = "text/plain";

      switch (payload.formato) {
        case "csv":
          conteudo = formatarCSV(marcacoes);
          tipo_conteudo = "text/csv";
          break;
        case "txt":
          conteudo = formatarTXT(marcacoes);
          tipo_conteudo = "text/plain";
          break;
        case "json":
          conteudo = formatarJSON(marcacoes);
          tipo_conteudo = "application/json";
          break;
        case "pdf":
          // Aqui seria integrado uma biblioteca como pdfkit
          conteudo = `PDF - ${marcacoes.length} registros\n${formatarTXT(marcacoes)}`;
          tipo_conteudo = "application/pdf";
          break;
        case "webfopag":
          conteudo = formatarWebFopag(marcacoes);
          tipo_conteudo = "application/xml";
          break;
        case "mte":
          conteudo = formatarMTE(marcacoes);
          tipo_conteudo = "text/plain";
          break;
      }

      // Log de auditoria
      await supabase.from("auditoria_log").insert({
        empresa_id: authedUser.id,
        entidade: "exportacao",
        entidade_id: authedUser.id,
        operacao: "INSERT",
        tipo_operacao: "exportar",
        usuario_id: authedUser.id,
        data_operacao: new Date().toISOString(),
        data_referencia: payload.data_inicio,
        dados_novo: {
          formato: payload.formato,
          registros: marcacoes.length,
          periodo: { data_inicio: payload.data_inicio, data_fim: payload.data_fim },
        },
        status: "sucesso",
        mensagem_status: `Exportação ${payload.formato} com ${marcacoes.length} registros`,
      });

      // Retornar arquivo
      const filename = `pontize-${payload.formato}-${new Date().toISOString().split("T")[0]}.${
        payload.formato === "pdf" ? "pdf" : payload.formato === "csv" ? "csv" : "txt"
      }`;

      return new Response(conteudo, {
        headers: {
          "Content-Type": tipo_conteudo,
          "Content-Disposition": `attachment; filename="${filename}"`,
        },
      });
    } catch (error) {
      console.error("[EXPORTACAO] POST exportar erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/exportacao/historico - Histórico de exportações
exportacaoRouter.get("/historico", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Buscar do auditoria_log
    const { data } = await supabase
      .from("auditoria_log")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .eq("tipo_operacao", "exportar")
      .order("data_operacao", { ascending: false })
      .limit(50);

    const resposta = {
      total: data?.length || 0,
      exportacoes: (data || []).map((e) => ({
        data: e.data_operacao,
        formato: e.dados_novo?.formato,
        registros: e.dados_novo?.registros,
        periodo: e.dados_novo?.periodo,
        usuario: e.usuario_id,
      })),
    };

    return c.json(resposta);
  } catch (error) {
    console.error("[EXPORTACAO] GET historico erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default exportacaoRouter;
