import { Context, MiddlewareHandler } from "hono";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

export type HonoEnv = {
  Variables: {
    user: {
      id: string;
      email?: string;
    } | null;
  };
};

export const authMiddleware: MiddlewareHandler = async (c: Context, next) => {
  try {
    const authHeader = c.req.header("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      c.set("user", null);
      return await next();
    }

    const token = authHeader.slice(7);
    const { data, error } = await supabaseAdmin.auth.getUser(token);

    if (error || !data.user) {
      c.set("user", null);
      return await next();
    }

    c.set("user", {
      id: data.user.id,
      email: data.user.email,
    });

    return await next();
  } catch (err) {
    c.set("user", null);
    return await next();
  }
};
