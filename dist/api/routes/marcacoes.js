"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.marcacoesRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const zod_1 = require("zod");
const client_server_1 = require("../../integrations/supabase/client.server");
exports.marcacoesRouter = new hono_1.Hono();
// Schemas
const MarcacaoSchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid(),
    marcada_em: zod_1.z.string().datetime(),
    tipo: zod_1.z.enum(["entrada", "saida", "saida_intervalo", "volta_intervalo"]),
    motivo_alteracao: zod_1.z.string().optional(),
});
const QuerySchema = zod_1.z.object({
    user_id: zod_1.z.string().uuid().optional(),
    empresa_id: zod_1.z.string().uuid().optional(),
    data_inicio: zod_1.z.string().datetime().optional(),
    data_fim: zod_1.z.string().datetime().optional(),
    limit: zod_1.z.string().default("100").transform(Number),
    offset: zod_1.z.string().default("0").transform(Number),
});
// GET /v1/marcacoes - Listar marcações
exports.marcacoesRouter.get("/", (0, zod_validator_1.zValidator)("query", QuerySchema), async (c) => {
    const { user_id, empresa_id, data_inicio, data_fim, limit, offset } = c.req.valid("query");
    const authedUser = c.get("user");
    try {
        if (!authedUser?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        let query = client_server_1.supabaseAdmin.from("marcacoes").select("*");
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
exports.marcacoesRouter.post("/", (0, zod_validator_1.zValidator)("json", MarcacaoSchema), async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    // Validar que user_id pertence ao usuário autenticado
    if (!authedUser?.id || payload.user_id !== authedUser.id) {
        return c.json({ error: "Forbidden" }, 403);
    }
    try {
        const { data, error } = await client_server_1.supabaseAdmin.from("marcacoes").insert([payload]).select().single();
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
exports.marcacoesRouter.get("/:id", async (c) => {
    const id = c.req.param("id");
    const authedUser = c.get("user");
    try {
        const { data, error } = await client_server_1.supabaseAdmin.from("marcacoes").select("*").eq("id", id).single();
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
exports.marcacoesRouter.put("/:id", (0, zod_validator_1.zValidator)("json", MarcacaoSchema.partial()), async (c) => {
    const id = c.req.param("id");
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    try {
        // Obter marcação original
        const { data: original } = await client_server_1.supabaseAdmin.from("marcacoes").select("*").eq("id", id).single();
        if (!original) {
            return c.json({ error: "Not found" }, 404);
        }
        // Verificar permissão
        if (!authedUser?.id || original.user_id !== authedUser.id) {
            return c.json({ error: "Forbidden" }, 403);
        }
        const { data, error } = await client_server_1.supabaseAdmin
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
exports.marcacoesRouter.delete("/:id", async (c) => {
    const id = c.req.param("id");
    const authedUser = c.get("user");
    try {
        // Obter marcação original
        const { data: original } = await client_server_1.supabaseAdmin.from("marcacoes").select("*").eq("id", id).single();
        if (!original) {
            return c.json({ error: "Not found" }, 404);
        }
        // Verificar permissão (apenas owner pode deletar)
        if (!authedUser?.id || original.user_id !== authedUser.id) {
            return c.json({ error: "Forbidden" }, 403);
        }
        const { error } = await client_server_1.supabaseAdmin.from("marcacoes").delete().eq("id", id);
        if (error) {
            return c.json({ error: error.message }, 400);
        }
        return c.json({ message: "Deleted" }, 200);
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
