import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
export const authRouter = new Hono();
const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
const RefreshSchema = z.object({
    refresh_token: z.string(),
});
// POST /auth/login - Login com email e senha
authRouter.post("/login", zValidator("json", LoginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    try {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        if (error || !data.session) {
            return c.json({
                error: error?.message || "Invalid credentials",
            }, 401);
        }
        return c.json({
            ok: true,
            data: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
                user: {
                    id: data.user.id,
                    email: data.user.email,
                },
            },
        });
    }
    catch (error) {
        return c.json({
            error: "Internal server error",
        }, 500);
    }
});
// POST /auth/logout - Logout (revoke token)
authRouter.post("/logout", async (c) => {
    const authHeader = c.req.header("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return c.json({ ok: true }, 200);
    }
    try {
        const token = authHeader.slice(7);
        await supabase.auth.admin.signOut(token);
        return c.json({
            ok: true,
            message: "Logged out successfully",
        });
    }
    catch (error) {
        // Even if logout fails, return success (token is already invalid)
        return c.json({
            ok: true,
            message: "Logged out",
        });
    }
});
// POST /auth/refresh - Refresh token
authRouter.post("/refresh", zValidator("json", RefreshSchema), async (c) => {
    const { refresh_token } = c.req.valid("json");
    try {
        const { data, error } = await supabase.auth.refreshSession({
            refresh_token,
        });
        if (error || !data.session) {
            return c.json({
                error: error?.message || "Invalid refresh token",
            }, 401);
        }
        return c.json({
            ok: true,
            data: {
                access_token: data.session.access_token,
                refresh_token: data.session.refresh_token,
            },
        });
    }
    catch (error) {
        return c.json({
            error: "Internal server error",
        }, 500);
    }
});
// GET /auth/verify - Verify token validity
authRouter.get("/verify", async (c) => {
    const authHeader = c.req.header("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return c.json({
            ok: false,
            error: "Missing authorization header",
        }, 401);
    }
    try {
        const token = authHeader.slice(7);
        const { data, error } = await supabase.auth.getUser(token);
        if (error || !data.user) {
            return c.json({
                ok: false,
                error: "Invalid token",
            }, 401);
        }
        return c.json({
            ok: true,
            user: {
                id: data.user.id,
                email: data.user.email,
            },
        });
    }
    catch (error) {
        return c.json({
            ok: false,
            error: "Internal server error",
        }, 500);
    }
});
