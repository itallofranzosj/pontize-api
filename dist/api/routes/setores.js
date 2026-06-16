import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
export const setoresRouter = new Hono();
const QuerySchema = z.object({
    empresa_id: z.string().uuid().optional(),
    limit: z.string().default("100").transform(Number),
    offset: z.string().default("0").transform(Number),
});
// GET /v1/setores - Listar setores
setoresRouter.get("/", zValidator("query", QuerySchema), async (c) => {
    const { empresa_id, limit, offset } = c.req.valid("query");
    const authedUser = c.get("user");
    try {
        if (!authedUser?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const { data: userProfile } = await supabase
            .from("profiles")
            .select("empresa_id")
            .eq("id", authedUser.id)
            .single();
        const targetEmpresa = userProfile?.empresa_id || empresa_id;
        if (!targetEmpresa) {
            return c.json({ error: "User empresa_id not found" }, 400);
        }
        let query = supabase
            .from("setores")
            .select("id, empresa_id, departamento_id, nome, codigo, responsavel_id, ativo");
        query = query.eq("empresa_id", targetEmpresa);
        const { data, error, count } = await query
            .order("nome", { ascending: true })
            .range(offset, offset + limit - 1);
        if (error) {
            return c.json({ error: error.message }, 400);
        }
        return c.json({
            data,
            pagination: {
                limit,
                offset,
                total: count,
            },
        });
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
// GET /v1/setores/:id - Obter setor específico
setoresRouter.get("/:id", async (c) => {
    const id = c.req.param("id");
    const authedUser = c.get("user");
    try {
        if (!authedUser?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const { data: userProfile } = await supabase
            .from("profiles")
            .select("empresa_id")
            .eq("id", authedUser.id)
            .single();
        const { data, error } = await supabase.from("setores").select("*").eq("id", id).single();
        if (error || !data) {
            return c.json({ error: "Not found" }, 404);
        }
        // Validar acesso
        if (!userProfile?.empresa_id || data.empresa_id !== userProfile.empresa_id) {
            return c.json({ error: "Forbidden" }, 403);
        }
        return c.json(data);
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
// GET /v1/setores/:id/colaboradores - Colaboradores de um setor
setoresRouter.get("/:id/colaboradores", async (c) => {
    const id = c.req.param("id");
    const authedUser = c.get("user");
    try {
        if (!authedUser?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const { data: userProfile } = await supabase
            .from("profiles")
            .select("empresa_id")
            .eq("id", authedUser.id)
            .single();
        const { data: setor } = await supabase
            .from("setores")
            .select("empresa_id")
            .eq("id", id)
            .single();
        // Validar acesso
        if (!userProfile?.empresa_id || setor?.empresa_id !== userProfile.empresa_id) {
            return c.json({ error: "Forbidden" }, 403);
        }
        const { data, error } = await supabase
            .from("profiles")
            .select("id, nome, matricula, cargo, ativo")
            .eq("setor_id", id)
            .order("nome", { ascending: true });
        if (error) {
            return c.json({ error: error.message }, 400);
        }
        return c.json({
            setor_id: id,
            count: data?.length || 0,
            data,
        });
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
