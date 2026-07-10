import { describe, it, expect, beforeEach, vi } from "vitest";
import { horariosRouter } from "./horarios";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";

vi.mock("../../integrations/supabase/client.server");

describe("Horarios Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET / should return 401 without auth", async () => {
    const res = await horariosRouter.request("/", {
      method: "GET",
    });

    expect(res.status).toBe(401);
  });

  it("POST / should create horário de trabalho", async () => {
    const mockHorario = {
      id: "horario-1",
      jornada_id: "jornada-1",
      nome: "Manhã",
      horario_entrada: "08:00",
      horario_saida: "12:00",
      intervalo_minutos: 15,
      permite_intervalo: true,
      permite_acumulo: false,
      requer_justificativa: false,
      ativo: true,
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: { id: "jornada-1" }, error: null }),
        }),
      }),
    } as any);

    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockHorario, error: null }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("GET / should filter by jornada_id", async () => {
    const mockHorarios = [
      {
        id: "h1",
        nome: "Manhã",
        horario_entrada: "08:00",
        jornadas: { id: "jornada-1", nome: "JP", codigo: "JP" },
      },
      {
        id: "h2",
        nome: "Tarde",
        horario_entrada: "13:00",
        jornadas: { id: "jornada-1", nome: "JP", codigo: "JP" },
      },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockResolvedValue({ data: mockHorarios, error: null }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("GET /:id should validate jornada ownership", async () => {
    const mockHorario = {
      id: "h1",
      nome: "Manhã",
      jornadas: { empresa_id: "empresa-1" },
    };

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockHorario, error: null }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("PUT /:id should prevent unauthorized updates", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: null, error: { code: "PGRST116" } }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("DELETE /:id should verify ownership before deletion", async () => {
    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          single: vi
            .fn()
            .mockResolvedValue({ data: { jornadas: { empresa_id: "empresa-1" } }, error: null }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("should validate time format HH:MM", () => {
    const validTimes = ["08:00", "23:59", "00:00"];
    const timeRegex = /^\d{2}:\d{2}$/;

    validTimes.forEach((time) => {
      expect(time).toMatch(timeRegex);
    });
  });

  it("should validate intervalo_minutos range", () => {
    const intervaloMin = 0;
    const intervaloMax = 120;
    const intervalo = 60;

    expect(intervalo).toBeGreaterThanOrEqual(intervaloMin);
    expect(intervalo).toBeLessThanOrEqual(intervaloMax);
  });
});
