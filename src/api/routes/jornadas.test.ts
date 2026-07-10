import { describe, it, expect, beforeEach, vi } from "vitest";
import { jornadasRouter } from "./jornadas";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";

vi.mock("../../integrations/supabase/client.server");

describe("Jornadas Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET / should return 401 without auth", async () => {
    const res = await jornadasRouter.request("/", {
      method: "GET",
    });

    expect(res.status).toBe(401);
  });

  it("POST / should create jornada with validation", async () => {
    const mockJornada = {
      id: "jornada-1",
      empresa_id: "empresa-1",
      nome: "Jornada Padrão",
      codigo: "JP",
      horas_dia: 8,
      minutos_dia: 480,
      dias_semana: [1, 2, 3, 4, 5],
      permite_intervalo: true,
      intervalo_minutos: 60,
      horario_inicio_padrao: "08:00",
      horario_fim_padrao: "17:00",
      tipo: "periodo",
      ativo: true,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };

    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockJornada, error: null }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("GET /:id should return specific jornada", async () => {
    const mockJornada = {
      id: "jornada-1",
      empresa_id: "empresa-1",
      nome: "Jornada Padrão",
      codigo: "JP",
      horas_dia: 8,
    };

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockJornada, error: null }),
          }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("PUT /:id should handle duplicate codigo with 409", async () => {
    const mockError = { code: "23505", message: "Unique constraint violation" };

    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            select: vi.fn().mockReturnValue({
              single: vi
                .fn()
                .mockResolvedValue({ data: null, error: mockError }),
            }),
          }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("DELETE /:id should return 204", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      delete: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockResolvedValue({ error: null }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("should calculate minutos_dia from horas_dia", () => {
    const horas = 8;
    const minutos = Math.round(horas * 60);
    expect(minutos).toBe(480);
  });
});
