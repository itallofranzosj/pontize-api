import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const mfaRouter = new Hono<HonoEnv>();

const SendCodeSchema = z.object({
  user_id: z.string().uuid(),
  method: z.enum(["email", "sms"]),
});

const VerifyCodeSchema = z.object({
  user_id: z.string().uuid(),
  code: z.string().length(6),
});

mfaRouter.post("/send", zValidator("json", SendCodeSchema), async (c) => {
  const { user_id, method } = c.req.valid("json");
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id || user_id !== authedUser.id) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    const { error } = await supabase.from("mfa_codes").insert({
      user_id,
      code,
      method,
      expires_at: expiresAt.toISOString(),
    });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      ok: true,
      message: `Código enviado via ${method}`,
      expires_in: 600,
    });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

mfaRouter.post("/verify", zValidator("json", VerifyCodeSchema), async (c) => {
  const { user_id, code } = c.req.valid("json");
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id || user_id !== authedUser.id) {
      return c.json({ error: "Forbidden" }, 403);
    }

    const { data, error } = await supabase
      .from("mfa_codes")
      .select("*")
      .eq("user_id", user_id)
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return c.json({ error: "Invalid or expired code" }, 401);
    }

    await supabase
      .from("mfa_codes")
      .update({ used_at: new Date().toISOString() })
      .eq("id", data.id);

    return c.json({
      ok: true,
      message: "Autenticação de dois fatores confirmada",
      verified_at: new Date().toISOString(),
    });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

mfaRouter.get("/status", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data: mfaEnabled } = await supabase
      .from("profiles")
      .select("mfa_enabled")
      .eq("id", authedUser.id)
      .single();

    return c.json({
      ok: true,
      user_id: authedUser.id,
      mfa_enabled: mfaEnabled?.mfa_enabled || false,
    });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});
