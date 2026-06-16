import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
export const marcacoesRouter = new Hono();
// Schemas
const MarcacaoSchema = z.object({
    user_id: z.string().uuid(),
    marcada_em: z.string().datetime(),
    tipo: z.enum(["entrada", "saida", "saida_intervalo", "volta_intervalo"]),
    motivo_alteracao: z.string().optional(),
});
const QuerySchema = z.object({
    user_id: z.string().uuid().optional(),
    empresa_id: z.string().uuid().optional(),
    data_inicio: z.string().datetime().optional(),
    data_fim: z.string().datetime().optional(),
    limit: z.string().default("100").transform(Number),
    offset: z.string().default("0").transform(Number),
});
// GET /v1/marcacoes - Listar marcações
marcacoesRouter.get("/", zValidator("query", QuerySchema), async (c) => {
    const { user_id, empresa_id, data_inicio, data_fim, limit, offset } = c.req.valid("query");
    const authedUser = c.get("user");
    try {
        if (!authedUser?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        let query = supabase.from("marcacoes").select("*");
        // Filtrar por empresa (se fornecido) ou usuário
        if (empresa_id) {
            query = query.eq("empresa_id", empresa_id);
        }
        else if (user_id) {
            query = query.eq("user_id", user_id);
        }
        else {
            query = query.eq("user_id", authedUser.id);
        }
        if (data_inicio) {
            query = query.gte("marcada_em", data_inicio);
        }
        if (data_fim) {
            query = query.lte("marcada_em", data_fim);
        }
        const { data, error, count } = await query
            .order("marcada_em", { ascending: false })
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
// POST /v1/marcacoes - Criar marcação
marcacoesRouter.post("/", zValidator("json", MarcacaoSchema), async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    // Validar que user_id pertence ao usuário autenticado
    if (!authedUser?.id || payload.user_id !== authedUser.id) {
        return c.json({ error: "Forbidden" }, 403);
    }
    try {
        const { data, error } = await supabase.from("marcacoes").insert([payload]).select().single();
        if (error) {
            return c.json({ error: error.message }, 400);
        }
        return c.json(data, 201);
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
// GET /v1/marcacoes/:id - Obter marcação específica
marcacoesRouter.get("/:id", async (c) => {
    const id = c.req.param("id");
    const authedUser = c.get("user");
    try {
        const { data, error } = await supabase.from("marcacoes").select("*").eq("id", id).single();
        if (error || !data) {
            return c.json({ error: "Not found" }, 404);
        }
        // Verificar permissão
        if (!authedUser?.id || data.user_id !== authedUser.id) {
            return c.json({ error: "Forbidden" }, 403);
        }
        return c.json(data);
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
// PUT /v1/marcacoes/:id - Atualizar marcação
marcacoesRouter.put("/:id", zValidator("json", MarcacaoSchema.partial()), async (c) => {
    const id = c.req.param("id");
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    try {
        // Obter marcação original
        const { data: original } = await supabase.from("marcacoes").select("*").eq("id", id).single();
        if (!original) {
            return c.json({ error: "Not found" }, 404);
        }
        // Verificar permissão
        if (!authedUser?.id || original.user_id !== authedUser.id) {
            return c.json({ error: "Forbidden" }, 403);
        }
        const { data, error } = await supabase
            .from("marcacoes")
            .update(payload)
            .eq("id", id)
            .select()
            .single();
        if (error) {
            return c.json({ error: error.message }, 400);
        }
        return c.json(data);
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
// DELETE /v1/marcacoes/:id - Deletar marcação
marcacoesRouter.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const authedUser = c.get("user");
    try {
        // Obter marcação original
        const { data: original } = await supabase.from("marcacoes").select("*").eq("id", id).single();
        if (!original) {
            return c.json({ error: "Not found" }, 404);
        }
        // Verificar permissão (apenas owner pode deletar)
        if (!authedUser?.id || original.user_id !== authedUser.id) {
            return c.json({ error: "Forbidden" }, 403);
        }
        const { error } = await supabase.from("marcacoes").delete().eq("id", id);
        if (error) {
            return c.json({ error: error.message }, 400);
        }
        return c.json({ message: "Deleted" }, 200);
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
