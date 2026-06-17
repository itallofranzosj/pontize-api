import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const dispositivosRouter = new Hono<HonoEnv>();

const DispositivoSchema = z.object({
  nome: z.string().min(1),
  tipo: z.enum(["relogio", "terminal", "app", "outro"]),
  serie: z.string(),
  localizacao: z.string().optional(),
});

dispositivosRouter.get("/", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("dispositivos")
      .select("*")
      .eq("user_id", authedUser.id)
      .order("criado_em", { ascending: false });

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({
      data: data || [],
      count: (data || []).length,
    });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

dispositivosRouter.post("/", zValidator("json", DispositivoSchema), async (c) => {
  const payload = c.req.valid("json");
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("dispositivos")
      .insert({
        user_id: authedUser.id,
        ...payload,
        ativo: true,
      })
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data, 201);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

dispositivosRouter.get("/:id", async (c) => {
  const id = c.req.param("id");
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("dispositivos")
      .select("*")
      .eq("id", id)
      .eq("user_id", authedUser.id)
      .single();

    if (error || !data) {
      return c.json({ error: "Not found" }, 404);
    }

    return c.json(data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

dispositivosRouter.put("/:id", zValidator("json", DispositivoSchema.partial()), async (c) => {
  const id = c.req.param("id");
  const payload = c.req.valid("json");
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("dispositivos")
      .update(payload)
      .eq("id", id)
      .eq("user_id", authedUser.id)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

dispositivosRouter.delete("/:id", async (c) => {
  const id = c.req.param("id");
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { error } = await supabase
      .from("dispositivos")
      .delete()
      .eq("id", id)
      .eq("user_id", authedUser.id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ message: "Deleted" });
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

dispositivosRouter.patch("/:id/desativar", async (c) => {
  const id = c.req.param("id");
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("dispositivos")
      .update({ ativo: false })
      .eq("id", id)
      .eq("user_id", authedUser.id)
      .select()
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});
