import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const permissoesRouter = new Hono<HonoEnv>();

// Roles disponíveis
const ROLES = {
  admin: {
    nome: "Administrador",
    descricao: "Acesso total ao sistema",
    permissoes: [
      "config:read",
      "config:write",
      "usuarios:read",
      "usuarios:write",
      "usuarios:delete",
      "auditoria:read",
      "permissoes:write",
    ],
  },
  manager: {
    nome: "Gerente/RH",
    descricao: "Gestão de colaboradores e operações",
    permissoes: [
      "config:read",
      "colaboradores:read",
      "colaboradores:write",
      "afastamentos:read",
      "afastamentos:write",
      "ocorrencias:read",
      "ocorrencias:write",
      "operacoes:write",
      "auditoria:read",
      "exportacao:read",
    ],
  },
  user: {
    nome: "Colaborador",
    descricao: "Consulta de dados pessoais",
    permissoes: [
      "perfil:read",
      "marcacoes:read",
      "marcacoes:write",
      "justificativas:read",
      "justificativas:write",
      "banco-horas:read",
    ],
  },
};

// GET /v1/permissoes/meu-role - Obter role do usuário
permissoesRouter.get("/meu-role", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Buscar role do usuário em profiles
    const { data: profile } = await supabase
      .from("profiles")
      .select("id, role")
      .eq("id", authedUser.id)
      .single();

    if (!profile) {
      return c.json({ error: "Perfil não encontrado" }, 404);
    }

    const role = profile.role || "user";
    const roleConfig = ROLES[role as keyof typeof ROLES] || ROLES.user;

    return c.json({
      role,
      nome: roleConfig.nome,
      descricao: roleConfig.descricao,
      permissoes: roleConfig.permissoes,
    });
  } catch (error) {
    console.error("[PERMISSOES] GET meu-role erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/permissoes/roles - Listar roles disponíveis (apenas admin)
permissoesRouter.get("/roles", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Verificar se é admin
    const { data: profile } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", authedUser.id)
      .single();

    if (profile?.role !== "admin") {
      return c.json({ error: "Apenas admin pode listar roles" }, 403);
    }

    const roles = Object.entries(ROLES).map(([key, value]) => ({
      id: key,
      ...value,
    }));

    return c.json({ roles });
  } catch (error) {
    console.error("[PERMISSOES] GET roles erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// PUT /v1/permissoes/atribuir-role - Atribuir role a usuário (apenas admin)
permissoesRouter.put(
  "/atribuir-role",
  zValidator("json", z.object({ user_id: z.string().uuid(), role: z.enum(["admin", "manager", "user"]) })),
  async (c) => {
    const { user_id, role } = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Verificar se é admin
      const { data: admin } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authedUser.id)
        .single();

      if (admin?.role !== "admin") {
        return c.json({ error: "Apenas admin pode atribuir roles" }, 403);
      }

      // Atualizar role
      const { data, error } = await supabase
        .from("profiles")
        .update({ role })
        .eq("id", user_id)
        .eq("empresa_id", authedUser.id)
        .select()
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      // Log auditoria
      await supabase.from("auditoria_log").insert({
        empresa_id: authedUser.id,
        entidade: "usuario",
        entidade_id: user_id,
        operacao: "UPDATE",
        tipo_operacao: "atribuirRole",
        usuario_id: authedUser.id,
        data_operacao: new Date().toISOString(),
        dados_anterior: { role_anterior: "a verificar" },
        dados_novo: { role },
        status: "sucesso",
        mensagem_status: `Role atribuída: ${role}`,
      });

      return c.json({
        sucesso: true,
        usuario_id,
        novo_role: role,
        permissoes: ROLES[role as keyof typeof ROLES].permissoes,
      });
    } catch (error) {
      console.error("[PERMISSOES] PUT atribuir-role erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// GET /v1/permissoes/auditoria - Listar auditoria (apenas admin/manager)
permissoesRouter.get(
  "/auditoria",
  zValidator(
    "query",
    z.object({
      limite: z.string().optional(),
      operacao: z.string().optional(),
    })
  ),
  async (c) => {
    const authedUser = c.get("user");
    const { limite, operacao } = c.req.valid("query");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      // Verificar permissão
      const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", authedUser.id)
        .single();

      if (!["admin", "manager"].includes(profile?.role || "user")) {
        return c.json({ error: "Sem permissão para acessar auditoria" }, 403);
      }

      // Buscar auditoria
      let query = supabase
        .from("auditoria_log")
        .select("*")
        .eq("empresa_id", authedUser.id)
        .order("data_operacao", { ascending: false });

      if (operacao) {
        query = query.eq("operacao", operacao);
      }

      const lim = Math.min(parseInt(limite || "100"), 1000);
      query = query.limit(lim);

      const { data, error } = await query;

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      // Agrupar por tipo de operação
      const agrupada = (data || []).reduce(
        (acc: Record<string, any[]>, log) => {
          if (!acc[log.operacao]) {
            acc[log.operacao] = [];
          }
          acc[log.operacao].push(log);
          return acc;
        },
        {}
      );

      return c.json({
        total: data?.length || 0,
        agrupada,
        amostra: (data || []).slice(0, 10),
      });
    } catch (error) {
      console.error("[PERMISSOES] GET auditoria erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

export default permissoesRouter;
