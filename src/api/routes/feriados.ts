import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const feriadosRouter = new Hono<HonoEnv>();

const DiaUtilSchema = z.object({
  data: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  eh_feriado: z.boolean(),
  tipo: z.enum(["feriad_nacional", "feriad_estadual", "feriad_municipal", "ponte"]),
  descricao: z.string().min(1).max(200),
  adicional_percentual: z.number().min(0).max(200).optional(),
  ativo: z.boolean().default(true),
});

const DiaUtilUpdateSchema = DiaUtilSchema.partial();

// GET /v1/dias-uteis - Listar feriados/dias úteis
feriadosRouter.get("/", async (c) => {
  const authedUser = c.get("user");
  const { mes, ano, eh_feriado } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    let query = supabase
      .from("dias_uteis")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .order("data");

    // Filtrar por mês/ano se fornecido
    if (mes && ano) {
      const mesNum = parseInt(mes);
      const anoNum = parseInt(ano);
      const dataInicio = `${anoNum}-${String(mesNum).padStart(2, "0")}-01`;
      const dataFim = new Date(anoNum, mesNum, 1);
      dataFim.setDate(dataFim.getDate() - 1);
      const dataFimStr = dataFim.toISOString().split("T")[0];

      query = query
        .gte("data", dataInicio)
        .lte("data", dataFimStr);
    }

    if (eh_feriado !== undefined) {
      query = query.eq("eh_feriado", eh_feriado === "true");
    }

    const { data, error } = await query;

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[FERIADOS] GET erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/dias-uteis/intervalo - Listar por intervalo de datas
feriadosRouter.get("/intervalo", async (c) => {
  const authedUser = c.get("user");
  const { data_inicio, data_fim } = c.req.query();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    if (!data_inicio || !data_fim) {
      return c.json({ error: "Missing data_inicio or data_fim" }, 400);
    }

    const { data, error } = await supabase
      .from("dias_uteis")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .gte("data", data_inicio)
      .lte("data", data_fim)
      .order("data");

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json(data || []);
  } catch (error) {
    console.error("[FERIADOS] GET intervalo erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// GET /v1/dias-uteis/:id - Obter feriado específico
feriadosRouter.get("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("dias_uteis")
      .select("*")
      .eq("id", id)
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Dia útil not found" }, 404);
      }
      return c.json({ error: error.message }, 400);
    }

    return c.json(data);
  } catch (error) {
    console.error("[FERIADOS] GET :id erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/dias-uteis - Criar feriado/dia útil
feriadosRouter.post(
  "/",
  zValidator("json", DiaUtilSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("dias_uteis")
        .insert({
          empresa_id: authedUser.id,
          ...payload,
        })
        .select()
        .single();

      if (error) {
        if (error.code === "23505") {
          return c.json(
            { error: `Data ${payload.data} já existe nesta empresa` },
            409
          );
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data, 201);
    } catch (error) {
      console.error("[FERIADOS] POST erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/dias-uteis/:id - Atualizar feriado
feriadosRouter.put(
  "/:id",
  zValidator("json", DiaUtilUpdateSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");
    const { id } = c.req.param();

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("dias_uteis")
        .update(payload)
        .eq("id", id)
        .eq("empresa_id", authedUser.id)
        .select()
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          return c.json({ error: "Dia útil not found" }, 404);
        }
        if (error.code === "23505") {
          return c.json({ error: "Data já existe" }, 409);
        }
        return c.json({ error: error.message }, 400);
      }

      return c.json(data);
    } catch (error) {
      console.error("[FERIADOS] PUT erro:", error);
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// DELETE /v1/dias-uteis/:id - Deletar feriado
feriadosRouter.delete("/:id", async (c) => {
  const authedUser = c.get("user");
  const { id } = c.req.param();

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { error } = await supabase
      .from("dias_uteis")
      .delete()
      .eq("id", id)
      .eq("empresa_id", authedUser.id);

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    return c.json({ success: true }, 204);
  } catch (error) {
    console.error("[FERIADOS] DELETE erro:", error);
    return c.json({ error: "Internal server error" }, 500);
  }
});

export default feriadosRouter;
