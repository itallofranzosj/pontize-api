import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const marcacaoValidadaRouter = new Hono<HonoEnv>();

// Schemas
const MarcacaoSchema = z.object({
  tipo: z.enum(["entrada", "saida", "intervalo_inicio", "intervalo_fim"]),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  observacoes: z.string().max(500).optional(),
});

// GET /v1/marcacao-validada/validar - Validar antes de marcar
marcacaoValidadaRouter.get("/validar", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // 1. Buscar config empresa
    const { data: config } = await supabase
      .from("empresa_config")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .single();

    if (!config) {
      return c.json({ error: "Configuração não encontrada" }, 404);
    }

    // 2. Buscar jornada do colaborador
    const { data: profile } = await supabase
      .from("profiles")
      .select("jornada_id, jornadas(nome, horas_dia, horario_inicio_padrao, horario_fim_padrao)")
      .eq("id", authedUser.id)
      .single();

    if (!profile || !profile.jornada_id) {
      return c.json({ error: "Jornada não configurada" }, 404);
    }

    // 3. Verificar se é feriado hoje
    const hoje = new Date().toISOString().split("T")[0];
    const { data: feriado } = await supabase
      .from("dias_uteis")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .eq("data", hoje)
      .single();

    // 4. Verificar afastamento ativo
    const { data: afastamento } = await supabase
      .from("afastamentos")
      .select("*, tipos_afastamento(nome)")
      .eq("empresa_id", authedUser.id)
      .eq("user_id", authedUser.id)
      .eq("status", "aprovado")
      .lte("data_inicio", hoje)
      .gte("data_fim", hoje)
      .single();

    // 5. Buscar última marcação do dia
    const { data: ultimaMarcacao } = await supabase
      .from("marcacoes")
      .select("*")
      .eq("user_id", authedUser.id)
      .eq("marcada_em::DATE", hoje)
      .order("marcada_em", { ascending: false })
      .limit(1)
      .single();

    // 6. Buscar ocorrências do dia (faltas, atrasos, ocorrências)
    const { data: ocorrencias } = await supabase
      .from("ocorrencias")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .eq("user_id", authedUser.id)
      .eq("data_ocorrencia", hoje);

    // 7. Buscar GPS config
    const { data: gpsConfig } = await supabase
      .from("localizacao_config")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .single();

    // 8. Montar validação
    const podeMarcar = !afastamento && !feriado;
    const alertas: string[] = [];

    if (afastamento) {
      alertas.push(`Você está em ${afastamento.tipos_afastamento?.nome || "afastamento"}`);
    }

    if (feriado) {
      alertas.push("Hoje é feriado");
    }

    if (ocorrencias && ocorrencias.length > 0) {
      alertas.push(`Você tem ${ocorrencias.length} ocorrência(s) registrada(s) hoje`);
    }

    if (ultimaMarcacao) {
      const tipo = ultimaMarcacao.tipo;
      let proximoTipo = "";

      if (tipo === "entrada") proximoTipo = "intervalo_inicio";
      else if (tipo === "intervalo_inicio") proximoTipo = "intervalo_fim";
      else if (tipo === "intervalo_fim") proximoTipo = "saida";

      alertas.push(`Última marcação: ${tipo} às ${new Date(ultimaMarcacao.marcada_em).toLocaleTimeString("pt-BR")}`);
    }

    const resposta = {
      pode_marcar: podeMarcar,
      jornada: profile.jornadas,
      eh_feriado: !!feriado,
      em_afastamento: !!afastamento,
      afastamento_tipo: afastamento?.tipos_afastamento?.nome,
      requer_gps: gpsConfig?.validar_gps_automaticamente || false,
      gps_raio_metros: gpsConfig?.raio_metros,
      ultima_marcacao: ultimaMarcacao
        ? {
            tipo: ultimaMarcacao.tipo,
            horario: ultimaMarcacao.marcada_em,
          }
        : null,
      config: {
        tolerancia_minutos: config.tolerancia_minutos,
        intervalo_minimo: config.intervalo_minimo_apos_6h,
      },
      alertas,
      observacoes: podeMarcar
        ? "Você pode bater ponto"
        : "Verifique o alerta acima antes de tentar marcar",
    };

    return c.json(resposta);
  } catch (error) {
    console.error("[MARCACAO_VALIDADA] GET validar erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/marcacao-validada/marcar - Bater ponto com validações
marcacaoValidadaRouter.post(
  "/marcar",
  zValidator("json", MarcacaoSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // 1. Executar validações (mesmo do endpoint anterior)
      // ... (código similar ao GET /validar)

      // 2. Se GPS é obrigatório, validar
      const { data: gpsConfig } = await supabase
        .from("localizacao_config")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .single();

      if (
        gpsConfig?.validar_gps_automaticamente &&
        payload.latitude &&
        payload.longitude
      ) {
        // Validar distância (usando função PostgreSQL se tiver)
        // Para agora, apenas armazenar as coordenadas
      } else if (gpsConfig?.validar_gps_automaticamente && !payload.latitude) {
        return c.json(
          { error: "GPS obrigatório. Ative a localização e tente novamente" },
          400
        );
      }

      // 3. Criar marcação
      const { data: marcacao, error: marcError } = await supabase
        .from("marcacoes")
        .insert({
          empresa_id: authedUser.id,
          user_id: authedUser.id,
          tipo: payload.tipo,
          entrada: payload.tipo === "entrada" ? new Date() : undefined,
          saida: payload.tipo === "saida" ? new Date() : undefined,
          intervalo_inicio:
            payload.tipo === "intervalo_inicio" ? new Date() : undefined,
          intervalo_fim:
            payload.tipo === "intervalo_fim" ? new Date() : undefined,
          latitude: payload.latitude,
          longitude: payload.longitude,
          descricao: payload.observacoes,
          marcada_em: new Date().toISOString(),
        })
        .select()
        .single();

      if (marcError) {
        return c.json({ error: marcError.message }, 400);
      }

      // 4. Log auditoria
      await supabase.from("auditoria_log").insert({
        empresa_id: authedUser.id,
        entidade: "marcacao",
        entidade_id: marcacao.id,
        operacao: "INSERT",
        tipo_operacao: "marcarPonto",
        usuario_id: authedUser.id,
        data_operacao: new Date().toISOString(),
        status: "sucesso",
        mensagem_status: `Marcação ${payload.tipo} registrada`,
      });

      return c.json(
        {
          sucesso: true,
          marcacao,
          mensagem: `${payload.tipo} registrada com sucesso`,
        },
        201
      );
    } catch (error) {
      console.error("[MARCACAO_VALIDADA] POST marcar erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/marcacao-validada/status-dia - Status atual do dia
marcacaoValidadaRouter.get("/status-dia", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const hoje = new Date().toISOString().split("T")[0];

    // Buscar todas marcações do dia
    const { data: marcacoes } = await supabase
      .from("marcacoes")
      .select("*")
      .eq("user_id", authedUser.id)
      .eq("marcada_em::DATE", hoje)
      .order("marcada_em");

    // Calcular status
    const temEntrada = marcacoes?.some((m) => m.tipo === "entrada");
    const temSaida = marcacoes?.some((m) => m.tipo === "saida");
    const temIntervaloInicio = marcacoes?.some((m) => m.tipo === "intervalo_inicio");
    const temIntervaloFim = marcacoes?.some((m) => m.tipo === "intervalo_fim");

    let status = "não_iniciado";
    if (temEntrada && temSaida) status = "finalizado";
    else if (temEntrada && temIntervaloFim) status = "em_intervalo";
    else if (temEntrada) status = "em_trabalho";

    const resposta = {
      data: hoje,
      status, // não_iniciado, em_trabalho, em_intervalo, finalizado
      marcacoes: marcacoes?.map((m) => ({
        tipo: m.tipo,
        horario: m.marcada_em,
      })) || [],
      resumo: {
        entrada: marcacoes?.find((m) => m.tipo === "entrada")?.marcada_em,
        saida: marcacoes?.find((m) => m.tipo === "saida")?.marcada_em,
        intervalo_inicio: marcacoes?.find((m) => m.tipo === "intervalo_inicio")?.marcada_em,
        intervalo_fim: marcacoes?.find((m) => m.tipo === "intervalo_fim")?.marcada_em,
      },
    };

    return c.json(resposta);
  } catch (error) {
    console.error("[MARCACAO_VALIDADA] GET status-dia erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default marcacaoValidadaRouter;
