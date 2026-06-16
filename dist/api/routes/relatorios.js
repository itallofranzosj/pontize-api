import { Hono } from "hono";
import { z } from "zod";
import { zValidator } from "@hono/zod-validator";
import { supabaseAdmin as supabase } from "@/integrations/supabase/client.server";
export const relatoriosRouter = new Hono();
const PeriodoSchema = z.object({
    mes: z
        .string()
        .regex(/^\d{1,2}$/)
        .transform(Number),
    ano: z
        .string()
        .regex(/^\d{4}$/)
        .transform(Number),
    user_id: z.string().uuid().optional(),
    setor_id: z.string().uuid().optional(),
});
// GET /v1/relatorios/horas-mes - Relatório de horas por mês
relatoriosRouter.get("/horas-mes", zValidator("query", PeriodoSchema), async (c) => {
    const { mes, ano, user_id, setor_id } = c.req.valid("query");
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
        if (!userProfile?.empresa_id) {
            return c.json({ error: "User empresa_id not found" }, 400);
        }
        // Construir filtro de data
        const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
        const ultimoDia = new Date(ano, mes, 0).getDate();
        const fim = `${ano}-${String(mes).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
        let query = supabase
            .from("marcacoes")
            .select("user_id, marcada_em")
            .gte("marcada_em", inicio)
            .lte("marcada_em", fim);
        if (user_id) {
            query = query.eq("user_id", user_id);
        }
        const { data: marcacoes } = await query;
        // Se filtrar por setor, precisamos de colaboradores
        let targetUsers = [];
        if (setor_id) {
            const { data: colabs } = await supabase
                .from("profiles")
                .select("id")
                .eq("setor_id", setor_id)
                .eq("empresa_id", userProfile.empresa_id);
            targetUsers = colabs?.map((c) => c.id) || [];
        }
        else if (!user_id) {
            const { data: colabs } = await supabase
                .from("profiles")
                .select("id")
                .eq("empresa_id", userProfile.empresa_id);
            targetUsers = colabs?.map((c) => c.id) || [];
        }
        // Calcular horas por usuário
        const horasPorUsuario = {};
        marcacoes?.forEach((marc) => {
            if (targetUsers.length > 0 && !targetUsers.includes(marc.user_id))
                return;
            if (!horasPorUsuario[marc.user_id]) {
                horasPorUsuario[marc.user_id] = 0;
            }
            // Simplificação: contar como 1 marcação = 0.5 horas
            horasPorUsuario[marc.user_id] += 0.5;
        });
        const totalHoras = Object.values(horasPorUsuario).reduce((a, b) => a + b, 0);
        return c.json({
            periodo: { mes, ano },
            horas_por_usuario: horasPorUsuario,
            total_horas: totalHoras,
            contagem_marcacoes: marcacoes?.length || 0,
        });
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
// GET /v1/relatorios/comparecimento - Relatório de comparecimento
relatoriosRouter.get("/comparecimento", zValidator("query", PeriodoSchema), async (c) => {
    const { mes, ano, setor_id } = c.req.valid("query");
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
        if (!userProfile?.empresa_id) {
            return c.json({ error: "User empresa_id not found" }, 400);
        }
        // Buscar colaboradores
        let query = supabase
            .from("profiles")
            .select("id, nome, matricula, setor_id")
            .eq("empresa_id", userProfile.empresa_id)
            .eq("ativo", true);
        if (setor_id) {
            query = query.eq("setor_id", setor_id);
        }
        const { data: colaboradores } = await query;
        if (!colaboradores || colaboradores.length === 0) {
            return c.json({
                periodo: { mes, ano },
                colaboradores: [],
                resumo: { total: 0, presentes: 0, ausentes: 0 },
            });
        }
        // Para cada colaborador, contar dias com marcação
        const comparecimento = colaboradores.map((colab) => ({
            id: colab.id,
            nome: colab.nome,
            matricula: colab.matricula,
            setor_id: colab.setor_id,
            presente: Math.random() > 0.2, // Placeholder
        }));
        const presentes = comparecimento.filter((c) => c.presente).length;
        const ausentes = colaboradores.length - presentes;
        return c.json({
            periodo: { mes, ano },
            comparecimento,
            resumo: {
                total: colaboradores.length,
                presentes,
                ausentes,
                percentual: ((presentes / colaboradores.length) * 100).toFixed(2),
            },
        });
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
// GET /v1/relatorios/producao - Relatório de produtividade
relatoriosRouter.get("/producao", zValidator("query", PeriodoSchema), async (c) => {
    const { mes, ano, setor_id } = c.req.valid("query");
    const authedUser = c.get("user");
    try {
        if (!authedUser?.id) {
            return c.json({ error: "Unauthorized" }, 401);
        }
        const inicio = `${ano}-${String(mes).padStart(2, "0")}-01`;
        const ultimoDia = new Date(ano, mes, 0).getDate();
        const fim = `${ano}-${String(mes).padStart(2, "0")}-${String(ultimoDia).padStart(2, "0")}`;
        // Buscar marcações
        const query = supabase
            .from("marcacoes")
            .select("user_id, marcada_em")
            .gte("marcada_em", inicio)
            .lte("marcada_em", fim);
        const { data: marcacoes } = await query;
        // Se setor_id, filtrar por setor
        let colaboradoresSetor = [];
        if (setor_id) {
            const { data: colabs } = await supabase
                .from("profiles")
                .select("id")
                .eq("setor_id", setor_id);
            colaboradoresSetor = colabs?.map((c) => c.id) || [];
        }
        // Calcular índice de produtividade simples
        const marcacoesFiltradas = marcacoes?.filter((m) => !setor_id || colaboradoresSetor.includes(m.user_id));
        const dias_uteis = ultimoDia - 6; // Aproximado
        const marcacoes_esperadas = (setor_id ? colaboradoresSetor.length : 1) * dias_uteis * 2; // 2 marcações por dia
        const indice = (((marcacoesFiltradas?.length || 0) / marcacoes_esperadas) * 100).toFixed(2);
        return c.json({
            periodo: { mes, ano },
            metricas: {
                marcacoes_registradas: marcacoesFiltradas?.length || 0,
                marcacoes_esperadas,
                indice_produtividade: `${indice}%`,
            },
        });
    }
    catch (error) {
        return c.json({ error: "Internal server error" }, 500);
    }
});
