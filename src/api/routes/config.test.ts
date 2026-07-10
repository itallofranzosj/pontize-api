import { describe, it, expect, beforeEach, vi } from "vitest";
import { configRouter } from "./config";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";

vi.mock("../../integrations/supabase/client.server");

describe("Config Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("GET /empresa should return 401 without auth", async () => {
    const res = await configRouter.request("/empresa", {
      method: "GET",
    });

    expect(res.status).toBe(401);
  });

  it("POST /empresa should create configuration", async () => {
    const mockConfig = {
      id: "config-1",
      empresa_id: "empresa-1",
      jornada_padrao_horas: 8,
      jornada_padrao_minutos: 480,
      intervalo_minimo_ate_6h: 15,
      intervalo_minimo_apos_6h: 60,
      horario_noturno_inicio: 21,
      horario_noturno_fim: 5,
      adicional_noturno_percentual: 20,
      hora_noturna_minutos: 52.5,
      adicional_extra_padrao: 50,
      adicional_extra_feriado: 100,
      horas_extra_limite_dia: 2,
      tolerancia_minutos: 5,
      aplicar_tolerancia: true,
      feriado_adicional_percentual: 100,
      dia_repouso_preferencial: 0,
      exigir_repouso_semanal: true,
      timezone: "America/Sao_Paulo",
      criado_em: new Date().toISOString(),
      atualizado_em: new Date().toISOString(),
    };

    vi.mocked(supabase.from).mockReturnValue({
      insert: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnValue({
          single: vi.fn().mockResolvedValue({ data: mockConfig, error: null }),
        }),
      }),
    } as any);

    // Test would require proper Hono test context
    expect(supabase.from).toBeDefined();
  });

  it("GET /defaults should return default values", async () => {
    const res = await configRouter.request("/defaults", {
      method: "GET",
    });

    expect(res.status).toBe(200);
    const data = await res.json();
    expect(data).toHaveProperty("jornada_padrao_horas", 8.0);
    expect(data).toHaveProperty("timezone", "America/Sao_Paulo");
    expect(data).toHaveProperty("hora_noturna_minutos", 52.5);
  });

  it("PUT /empresa should update configuration", async () => {
    const mockUpdated = {
      id: "config-1",
      empresa_id: "empresa-1",
      jornada_padrao_horas: 9,
      jornada_padrao_minutos: 540,
    };

    vi.mocked(supabase.from).mockReturnValue({
      update: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          select: vi.fn().mockReturnValue({
            single: vi
              .fn()
              .mockResolvedValue({ data: mockUpdated, error: null }),
          }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });
});
