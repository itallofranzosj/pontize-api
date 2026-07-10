import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const alertasRouter = new Hono<HonoEnv>();

const AlertaConfigSchema = z.object({
  alerta_horas_extras: z.boolean().default(true),
  alerta_intervalo_insuficiente: z.boolean().default(true),
  alerta_feriado_nao_registrado: z.boolean().default(true),
  alerta_repouso_semanal_violado: z.boolean().default(true),
  alerta_trabalho_noturno_excessivo: z.boolean().default(true),
  alerta_atraso: z.boolean().default(true),
  alerta_falta: z.boolean().default(true),
  alerta_gps_fora_raio: z.boolean().default(true),

  notificar_colaborador: z.boolean().default(true),
  notificar_gestor: z.boolean().default(true),
  notificar_rh: z.boolean().default(true),

  destinatarios_email: z.array(z.string().email()).optional(),
  incluir_resumo_diario: z.boolean().default(true),
  horario_resumo_diario: z.string().regex(/^\d{2}:\d{2}$/).optional(),
});

const AlertaConfigUpdateSchema = AlertaConfigSchema.partial();

// GET /v1/alertas-config/empresa - Obter configuração de alertas
alertasRouter.get("/empresa", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("alertas_config")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Alert configuration not found" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[ALERTAS] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/alertas-config/empresa - Criar configuração de alertas
alertasRouter.post(
  "/empresa",
  zValidator("json", AlertaConfigSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("alertas_config")
        .insert({
          empresa_id: authedUser.id,
          ...payload,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return c.json(
            { error: "Alert configuration already exists for this company" },
            409
          );
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data, 201);
    } catch (error) {
      console.error("[ALERTAS] POST erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/alertas-config/empresa - Atualizar configuração de alertas
alertasRouter.put(
  "/empresa",
  zValidator("json", AlertaConfigUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("alertas_config")
        .update(payload)
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
      console.error("[ALERTAS] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/alertas-config/defaults - Obter valores padrão
alertasRouter.get("/defaults", async (c) => {
  try {
    const defaults = {
      alerta_horas_extras: true,
      alerta_intervalo_insuficiente: true,
      alerta_feriado_nao_registrado: true,
      alerta_repouso_semanal_violado: true,
      alerta_trabalho_noturno_excessivo: true,
      alerta_atraso: true,
      alerta_falta: true,
      alerta_gps_fora_raio: true,

      notificar_colaborador: true,
      notificar_gestor: true,
      notificar_rh: true,

      destinatarios_email: [],
      incluir_resumo_diario: true,
      horario_resumo_diario: "09:00",
    };

    return c.json(defaults);
  } catch (error) {
    console.error("[ALERTAS] GET defaults erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default alertasRouter;
