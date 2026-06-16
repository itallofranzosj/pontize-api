"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.colaboradoresRouter = void 0;
const hono_1 = require("hono");
const zod_validator_1 = require("@hono/zod-validator");
const zod_1 = require("zod");
const client_server_1 = require("../../integrations/supabase/client.server");
exports.colaboradoresRouter = new hono_1.Hono();
const QuerySchema = zod_1.z.object({
    empresa_id: zod_1.z.string().uuid().optional(),
    setor_id: zod_1.z.string().uuid().optional(),
    ativo: zod_1.z.enum(["true", "false"]).transform(Boolean).optional(),
    limit: zod_1.z.string().default("100").transform(Number),
    offset: zod_1.z.string().default("0").transform(Number),
});
// GET /v1/colaboradores - Listar colaboradores
exports.colaboradoresRouter.get("/", (0, zod_validator_1.zValidator)("query", QuerySchema), async (c) => {
    const { empresa_id, setor_id, ativo, limit, offset } = c.req.valid("query");
    const authedUser = c.get("user");
    try {
        if (!authedUser?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        // Obter empresa do usuário autenticado
        const { data: userProfile } = await client_server_1.supabaseAdmin
            .from("profiles")
            .select("empresa_id")
            .eq("id", authedUser.id)
            .single();
        // Filtrar por empresa (user's company)
        const targetEmpresa = userProfile?.empresa_id || empresa_id;
        if (!targetEmpresa) {
            return c.json({ error: "User empresa_id not found" }, 400);
        }
        let query = client_server_1.supabaseAdmin
            .from("profiles")
            .select("id, nome, cpf, matricula, cargo, setor_id, empresa_id, ativo, data_admissao");
        query = query.eq("empresa_id", targetEmpresa);
        if (setor_id) {
            query = query.eq("setor_id", setor_id);
        }
        if (ativo !== undefined) {
            query = query.eq("ativo", ativo);
        }
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
// GET /v1/colaboradores/:id - Obter colaborador específico
exports.colaboradoresRouter.get("/:id", async (c) => {
    const id = c.req.param("id");
    const authedUser = c.get("user");
    try {
        if (!authedUser?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const { data: userProfile } = await client_server_1.supabaseAdmin
            .from("profiles")
            .select("empresa_id")
            .eq("id", authedUser.id)
            .single();
        const { data, error } = await client_server_1.supabaseAdmin
            .from("profiles")
            .select("id, nome, cpf, matricula, cargo, setor_id, empresa_id, ativo, data_admissao, created_at")
            .eq("id", id)
            .single();
        if (error || !data) {
            return c.json({ error: "Not found" }, 404);
        }
        // Validar acesso (mesmo empresa)
        if (!userProfile?.empresa_id || data.empresa_id !== userProfile.empresa_id) {
            return c.json({ error: "Forbidden" }, 403);
        }
        return c.json(data);
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
// GET /v1/colaboradores/:id/marcacoes - Marcações de um colaborador
exports.colaboradoresRouter.get("/:id/marcacoes", async (c) => {
    const id = c.req.param("id");
    const { mes, ano } = c.req.query();
    const authedUser = c.get("user");
    try {
        if (!authedUser?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const { data: userProfile } = await client_server_1.supabaseAdmin
            .from("profiles")
            .select("empresa_id")
            .eq("id", authedUser.id)
            .single();
        const { data: colab } = await client_server_1.supabaseAdmin
            .from("profiles")
            .select("empresa_id")
            .eq("id", id)
            .single();
        // Validar acesso
        if (!userProfile?.empresa_id || colab?.empresa_id !== userProfile.empresa_id) {
            return c.json({ error: "Forbidden" }, 403);
        }
        // Construir filtro de data
        const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
        const ultimoDia = new Date(parseInt(ano), parseInt(mes), 0).getDate();
        const fim = `${ano}-${String(mes).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
        const { data, error } = await client_server_1.supabaseAdmin
            .from("marcacoes")
            .select("*")
            .eq("user_id", id)
            .gte("marcada_em", inicio)
            .lte("marcada_em", fim)
            .order("marcada_em", { ascending: true });
        if (error) {
            return c.json({ error: error.message }, 400);
        }
        return c.json({
            user_id: id,
            periodo: { mes: parseInt(mes), ano: parseInt(ano) },
            data,
        });
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
