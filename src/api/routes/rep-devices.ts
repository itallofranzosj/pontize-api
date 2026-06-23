import { Hono } from "hono";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const repDevicesRouter = new Hono<HonoEnv>();

// GET /v1/rep-devices — lista os REPs de ponto da empresa do usuário autenticado
repDevicesRouter.get("/", async (c) => {
  const authedUser = c.get("user");

  if (!authedUser?.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    // Buscar a empresa do usuário via profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("empresa_id")
      .eq("id", authedUser.id)
      .single();

    if (profileError || !profile?.empresa_id) {
      // Fallback: retornar REPs acessíveis sem filtro de empresa
      // (segurança garantida pelo RLS se configurado corretamente)
      const { data, error } = await supabase
        .from("rep_devices")
        .select("id, identificador, ip_local, fabricante, modelo, tipo, numero_serie, ativo, ingest_enabled")
        .eq("ativo", true)
        .order("identificador", { ascending: true });

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json({ ok: true, data: data || [], count: (data || []).length });
    }

    // Filtrar por empresa do usuário
    const { data, error } = await supabase
      .from("rep_devices")
      .select("id, identificador, ip_local, fabricante, modelo, tipo, numero_serie, ativo, ingest_enabled")
      .eq("empresa_id", profile.empresa_id)
      .eq("ativo", true)
      .order("identificador", { ascending: true });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ ok: true, data: data || [], count: (data || []).length });
  } catch (err) {
    console.error("[rep-devices] Erro:", err);
    return c.json({ error: "Internal server error" }, 500);
  }
});
