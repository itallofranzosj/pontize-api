import { Hono } from "hono";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const unidadesRouter = new Hono<HonoEnv>();

// GET /v1/unidades - Lista as unidades/filiais da empresa do usuário autenticado
// Usado pelo Pontize Agent (Windows) para vincular um relógio a uma unidade.
unidadesRouter.get("/", async (c) => {
  const authedUser = c.get("user");

  if (!authedUser?.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("empresa_id")
      .eq("id", authedUser.id)
      .maybeSingle();

    if (profileError) {
      return c.json({ error: profileError.message }, 400);
    }

    if (!profile?.empresa_id) {
      return c.json({ error: "Usuário sem empresa vinculada" }, 400);
    }

    const { data, error } = await supabase
      .from("unidades")
      .select("id, nome")
      .eq("empresa_id", profile.empresa_id)
      .eq("ativo", true)
      .order("nome");

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ ok: true, data: data ?? [] });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});
