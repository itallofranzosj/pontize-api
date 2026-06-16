"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const client_server_1 = require("../../integrations/supabase/client.server");
const authMiddleware = async (c, next) => {
    try {
        const authHeader = c.req.header("authorization");
        if (!authHeader?.startsWith("Bearer ")) {
            c.set("user", null);
            return await next();
        }
        const token = authHeader.slice(7);
        const { data, error } = await client_server_1.supabaseAdmin.auth.getUser(token);
        if (error || !data.user) {
            c.set("user", null);
            return await next();
        }
        c.set("user", {
            id: data.user.id,
            email: data.user.email,
        });
        return await next();
    }
    catch (err) {
        c.set("user", null);
        return await next();
    }
};
exports.authMiddleware = authMiddleware;
