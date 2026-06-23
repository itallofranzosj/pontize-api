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

// Envia o código via Resend (REST — sem dependência extra)
async function sendEmailCode(to: string, code: string): Promise<void> {
  const resendKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@pontize.com";

  if (!resendKey) {
    console.warn("[MFA] RESEND_API_KEY não configurado — código gerado mas email não enviado");
    return;
  }

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: fromEmail,
      to: [to],
      subject: "Seu código de verificação Pontize",
      html: `
        <div style="font-family:sans-serif;max-width:480px;margin:0 auto;padding:32px">
          <h2 style="color:#0F3D34;margin-bottom:8px">Código de Verificação</h2>
          <p style="color:#374151;margin-bottom:24px">
            Use o código abaixo para concluir o login no Pontize Agent:
          </p>
          <div style="background:#F0FDF4;border:2px solid #0F3D34;border-radius:8px;padding:24px;text-align:center">
            <span style="font-size:36px;font-weight:700;letter-spacing:12px;color:#0F3D34">${code}</span>
          </div>
          <p style="color:#6B7280;font-size:13px;margin-top:20px">
            Este código expira em 10 minutos. Não compartilhe com ninguém.
          </p>
        </div>
      `,
    }),
  });

  if (!response.ok) {
    const err = await response.text();
    throw new Error(`Resend error ${response.status}: ${err}`);
  }
}

mfaRouter.post("/send", zValidator("json", SendCodeSchema), async (c) => {
  const { user_id, method } = c.req.valid("json");
  const authedUser = c.get("user");

  if (!authedUser?.id || user_id !== authedUser.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    // Salvar código no banco
    const { error: dbError } = await supabase.from("mfa_codes").insert({
      user_id,
      code,
      method,
      expires_at: expiresAt.toISOString(),
    });

    if (dbError) {
      return c.json({ error: dbError.message }, 400);
    }

    // Enviar email com o código
    if (method === "email") {
      const email = authedUser.email;
      if (!email) {
        return c.json({ error: "Email do usuário não encontrado" }, 400);
      }
      await sendEmailCode(email, code);
    }

    return c.json({
      ok: true,
      message: `Código enviado via ${method}`,
      expires_in: 600,
    });
  } catch (error) {
    console.error("[MFA/send] Erro:", error);
    return c.json({ error: "Erro ao enviar código. Tente novamente." }, 500);
  }
});

mfaRouter.post("/verify", zValidator("json", VerifyCodeSchema), async (c) => {
  const { user_id, code } = c.req.valid("json");
  const authedUser = c.get("user");

  if (!authedUser?.id || user_id !== authedUser.id) {
    return c.json({ error: "Forbidden" }, 403);
  }

  try {
    const { data, error } = await supabase
      .from("mfa_codes")
      .select("*")
      .eq("user_id", user_id)
      .eq("code", code)
      .is("used_at", null) // código ainda não utilizado
      .gt("expires_at", new Date().toISOString())
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error || !data) {
      return c.json({ error: "Código inválido ou expirado" }, 401);
    }

    // Marcar código como usado
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
    console.error("[MFA/verify] Erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

mfaRouter.get("/status", async (c) => {
  const authedUser = c.get("user");

  if (!authedUser?.id) {
    return c.json({ error: "Unauthorized" }, 401);
  }

  try {
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
