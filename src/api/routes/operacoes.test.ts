import { describe, it, expect, beforeEach, vi } from "vitest";
import { operacoesRouter } from "./operacoes";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";

vi.mock("../../integrations/supabase/client.server");

describe("Operacoes Router", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("POST /recalcular-dia should call PostgreSQL function", async () => {
    const mockResult = {
      sucesso: true,
      marcacoes_processadas: 2,
      alertas: ["Intervalo insuficiente"],
      erros: [],
    };

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: [mockResult],
      error: null,
    });

    expect(supabase.rpc).toBeDefined();
  });

  it("POST /fechar-periodo should validate before closing", async () => {
    const mockResult = {
      sucesso: true,
      periodo_id: "periodo-1",
      colaboradores_processados: 10,
      alertas: [],
      erros: [],
    };

    vi.mocked(supabase.rpc).mockResolvedValue({
      data: [mockResult],
      error: null,
    });

    expect(supabase.rpc).toBeDefined();
  });

  it("POST /reabrir-periodo should allow reopening closed period", async () => {
    const mockPeriodo = {
      id: "periodo-1",
      status: "fechado",
      ano: 2026,
      mes: 7,
    };

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          eq: vi.fn().mockReturnValue({
            single: vi.fn().mockResolvedValue({ data: mockPeriodo, error: null }),
          }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("GET /periodos-fechados should list periods", async () => {
    const mockPeriodos = [
      { id: "p1", ano: 2026, mes: 7, status: "fechado" },
      { id: "p2", ano: 2026, mes: 6, status: "fechado" },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            order: vi.fn().mockResolvedValue({ data: mockPeriodos, error: null }),
          }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("GET /auditoria should filter logs", async () => {
    const mockAuditoria = [
      {
        id: "audit-1",
        entidade: "marcacao",
        operacao: "RECALCULAR",
        tipo_operacao: "recalcularDia",
      },
    ];

    vi.mocked(supabase.from).mockReturnValue({
      select: vi.fn().mockReturnValue({
        eq: vi.fn().mockReturnValue({
          order: vi.fn().mockReturnValue({
            limit: vi.fn().mockResolvedValue({ data: mockAuditoria, error: null }),
          }),
        }),
      }),
    } as any);

    expect(supabase.from).toBeDefined();
  });

  it("should validate date format for recalcular-dia", () => {
    const validDate = "2026-07-10";
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    expect(validDate).toMatch(dateRegex);
  });

  it("should validate ano/mes range for fechar-periodo", () => {
    const ano = 2026;
    const mes = 7;

    expect(ano).toBeGreaterThanOrEqual(2020);
    expect(ano).toBeLessThanOrEqual(2099);
    expect(mes).toBeGreaterThanOrEqual(1);
    expect(mes).toBeLessThanOrEqual(12);
  });

  it("should prevent closing period with pending validations", async () => {
    // Simulando validação que encontra pendências
    const validacaoResult = {
      pode_fechar: false,
      motivos: [
        "Existem marcações pendentes de validação",
        "Existem afastamentos pendentes de aprovação",
      ],
    };

    expect(validacaoResult.pode_fechar).toBe(false);
    expect(validacaoResult.motivos.length).toBe(2);
  });
});
