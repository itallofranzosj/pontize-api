import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const localizacaoRouter = new Hono<HonoEnv>();

const LocalizacaoConfigSchema = z.object({
  latitude: z.number().min(-90).max(90),
  longitude: z.number().min(-180).max(180),
  raio_metros: z.number().min(1).max(10000),
  validar_gps_automaticamente: z.boolean().default(true),
  alerta_fora_raio: z.boolean().default(true),
  bloqueiar_ponto_fora_raio: z.boolean().default(false),
});

const LocalizacaoConfigUpdateSchema = LocalizacaoConfigSchema.partial();

// GET /v1/localizacao-config/empresa - Obter configuração de localização
localizacaoRouter.get("/empresa", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("localizacao_config")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Location configuration not found" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[LOCALIZACAO] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/localizacao-config/empresa - Criar configuração de localização
localizacaoRouter.post(
  "/empresa",
  zValidator("json", LocalizacaoConfigSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("localizacao_config")
        .insert({
          empresa_id: authedUser.id,
          ...payload,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return c.json(
            { error: "Location configuration already exists for this company" },
            409
          );
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data, 201);
    } catch (error) {
      console.error("[LOCALIZACAO] POST erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/localizacao-config/empresa - Atualizar configuração de localização
localizacaoRouter.put(
  "/empresa",
  zValidator("json", LocalizacaoConfigUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("localizacao_config")
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
      console.error("[LOCALIZACAO] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// POST /v1/localizacao-config/validar-distancia - Validar se ponto está dentro do raio
localizacaoRouter.post(
  "/validar-distancia",
  zValidator(
    "json",
    z.object({
      latitude: z.number().min(-90).max(90),
      longitude: z.number().min(-180).max(180),
    })
  ),
  async (c) => {
    const { latitude, longitude } = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data: config } = await supabase
        .from("localizacao_config")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .single();

      if (!config) {
        return c.json({ error: "Location configuration not found" }, 404);
      }

      // Calcular distância usando Haversine
      const R = 6371000; // raio da Terra em metros
      const lat1 = (config.latitude * Math.PI) / 180;
      const lat2 = (latitude * Math.PI) / 180;
      const deltaLat = ((latitude - config.latitude) * Math.PI) / 180;
      const deltaLon = ((longitude - config.longitude) * Math.PI) / 180;

      const a =
        Math.sin(deltaLat / 2) * Math.sin(deltaLat / 2) +
        Math.cos(lat1) *
          Math.cos(lat2) *
          Math.sin(deltaLon / 2) *
          Math.sin(deltaLon / 2);

      const c_val = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
      const distancia = R * c_val;

      const dentro_raio = distancia <= config.raio_metros;

      return c.json({
        dentro_raio,
        distancia: Math.round(distancia),
        raio_metros: config.raio_metros,
        distancia_excesso: dentro_raio
          ? 0
          : Math.round(distancia - config.raio_metros),
      });
    } catch (error) {
      console.error("[LOCALIZACAO] validar-distancia erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

export default localizacaoRouter;
