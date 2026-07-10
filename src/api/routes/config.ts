import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const configRouter = new Hono<HonoEnv>();

// Schemas de validação
const EmpresaConfigSchema = z.object({
  jornada_padrao_horas: z.number().min(4).max(12),
  jornada_padrao_minutos: z.number().optional(),
  intervalo_minimo_ate_6h: z.number().min(0).max(60),
  intervalo_minimo_apos_6h: z.number().min(0).max(120),
  intervalo_remunerado: z.boolean().default(false),
  horario_noturno_inicio: z.number().min(0).max(23),
  horario_noturno_fim: z.number().min(0).max(23),
  adicional_noturno_percentual: z.number().min(0).max(100),
  hora_noturna_minutos: z.number().min(30).max(60),
  adicional_extra_padrao: z.number().min(0).max(100),
  adicional_extra_feriado: z.number().min(0).max(200),
  horas_extra_limite_dia: z.number().min(1).max(4),
  tolerancia_minutos: z.number().min(0).max(15),
  aplicar_tolerancia: z.boolean().default(true),
  feriado_adicional_percentual: z.number().min(0).max(200),
  dia_repouso_preferencial: z.number().min(0).max(6),
  exigir_repouso_semanal: z.boolean().default(true),
  timezone: z.string().default("America/Sao_Paulo"),
});

// GET /v1/config/empresa - Obter configuração da empresa
configRouter.get("/empresa", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("empresa_config")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      // Se não existe, retornar 404
      if (error.code === "PGRST116") {
        return c.json({ error: "Configuration not found" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[CONFIG] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/config/empresa - Criar configuração inicial
configRouter.post(
  "/empresa",
  zValidator("json", EmpresaConfigSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Calcular minutos_dia se não fornecido
      const minutos = payload.jornada_padrao_minutos ||
        Math.round(payload.jornada_padrao_horas * 60);

      const { data, error } = await supabase
        .from("empresa_config")
        .insert({
          empresa_id: authedUser.id,
          ...payload,
          jornada_padrao_minutos: minutos,
        })
        .select()
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json(data, 201);
    } catch (error) {
      console.error("[CONFIG] POST erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/config/empresa - Atualizar configuração
configRouter.put(
  "/empresa",
  zValidator("json", EmpresaConfigSchema.partial()),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Calcular minutos_dia se alterado
      const updateData = { ...payload };
      if (payload.jornada_padrao_horas) {
        updateData.jornada_padrao_minutos = Math.round(
          payload.jornada_padrao_horas * 60
        );
      }

      const { data, error } = await supabase
        .from("empresa_config")
        .update(updateData)
        .eq("empresa_id", authedUser.id)
        .select()
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      if (!data) {
        return c.json({ error: "Configuration not found" }, 404);
      }

      return c.json(data);
    } catch (error) {
      console.error("[CONFIG] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/config/defaults - Obter valores padrão (útil para criar nova config)
configRouter.get("/defaults", async (c) => {
  try {
    const defaults = {
      jornada_padrao_horas: 8.0,
      intervalo_minimo_ate_6h: 15,
      intervalo_minimo_apos_6h: 60,
      intervalo_remunerado: false,
      horario_noturno_inicio: 21,
      horario_noturno_fim: 5,
      adicional_noturno_percentual: 20,
      hora_noturna_minutos: 52.5,
      adicional_extra_padrao: 50,
      adicional_extra_feriado: 100,
      horas_extra_limite_dia: 2,
      tolerancia_minutos: 5,
      aplicar_tolerancia: true,
      feriado_adicional_percentual: 100,
      dia_repouso_preferencial: 0,
      exigir_repouso_semanal: true,
      timezone: "America/Sao_Paulo",
    };

    return c.json(defaults);
  } catch (error) {
    console.error("[CONFIG] GET defaults erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default configRouter;
