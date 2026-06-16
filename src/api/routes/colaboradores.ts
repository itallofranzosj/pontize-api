import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const colaboradoresRouter = new Hono<HonoEnv>();

const QuerySchema = z.object({
  empresa_id: z.string().uuid().optional(),
  setor_id: z.string().uuid().optional(),
  ativo: z.enum(["true", "false"]).transform(Boolean).optional(),
  limit: z.string().default("100").transform(Number),
  offset: z.string().default("0").transform(Number),
});

// GET /v1/colaboradores - Listar colaboradores
colaboradoresRouter.get("/", zValidator("query", QuerySchema), async (c) => {
  const { empresa_id, setor_id, ativo, limit, offset } = c.req.valid("query");
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    // Obter empresa do usuário autenticado
    const { data: userProfile } = await supabase
      .from("profiles")
      .select("empresa_id")
      .eq("id", authedUser.id)
      .single();

    // Filtrar por empresa (user's company)
    const targetEmpresa = userProfile?.empresa_id || empresa_id;

    if (!targetEmpresa) {
      return c.json({ error: "User empresa_id not found" }, 400);
    }

    let query = supabase
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
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/colaboradores/:id - Obter colaborador específico
colaboradoresRouter.get("/:id", async (c) => {
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

    const { data, error } = await supabase
      .from("profiles")
      .select(
        "id, nome, cpf, matricula, cargo, setor_id, empresa_id, ativo, data_admissao, created_at",
      )
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
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/colaboradores/:id/marcacoes - Marcações de um colaborador
colaboradoresRouter.get("/:id/marcacoes", async (c) => {
  const id = c.req.param("id");
  const { mes, ano } = c.req.query();
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

    const { data: colab } = await supabase
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

    const { data, error } = await supabase
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
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});
