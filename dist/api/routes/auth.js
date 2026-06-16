"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const zod_1 = require("zod");
const client_server_1 = require("../../integrations/supabase/client.server");
exports.authRouter = new hono_1.Hono();
const LoginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
const RefreshSchema = zod_1.z.object({
    refresh_token: zod_1.z.string(),
});
// POST /auth/login - Login com email e senha
exports.authRouter.post("/login", (0, zod_validator_1.zValidator)("json", LoginSchema), async (c) => {
    const { email, password } = c.req.valid("json");
    try {
        const { data, error } = await client_server_1.supabaseAdmin.auth.signInWithPassword({
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
exports.authRouter.post("/logout", async (c) => {
    const authHeader = c.req.header("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return c.json({ ok: true }, 200);
    }
    try {
        const token = authHeader.slice(7);
        await client_server_1.supabaseAdmin.auth.admin.signOut(token);
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
exports.authRouter.post("/refresh", (0, zod_validator_1.zValidator)("json", RefreshSchema), async (c) => {
    const { refresh_token } = c.req.valid("json");
    try {
        const { data, error } = await client_server_1.supabaseAdmin.auth.refreshSession({
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
exports.authRouter.get("/verify", async (c) => {
    const authHeader = c.req.header("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        return c.json({
            ok: false,
            error: "Missing authorization header",
        }, 401);
    }
    try {
        const token = authHeader.slice(7);
        const { data, error } = await client_server_1.supabaseAdmin.auth.getUser(token);
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
