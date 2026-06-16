// Extensão de tipos para tabelas de benefícios
// Gerado a partir das migrations 20260604000003 e 20260604000004

export type BeneficiosEmpresaRow = {
  id: string;
  empresa_id: string;
  tipo: string;
  nome: string;
  valor_padrao: number | null;
  desconto_colaborador: number;
  elegibilidade: Record<string, unknown>;
  ativo: boolean;
  created_at: string;
  updated_at: string;
};

export type BeneficiosEmpresaAuditRow = {
  id: string;
  empresa_id: string;
  beneficio_id: string | null;
  acao: "CREATE" | "UPDATE" | "DELETE";
  mudancas: Record<string, { anterior: unknown; novo: unknown }> | null;
  usuario_id: string | null;
  ip_address: string | null;
  user_agent: string | null;
  created_at: string;
};

// Type-safe query results
export type BeneficioEmpresaInsert = Omit<BeneficiosEmpresaRow, "id" | "created_at" | "updated_at">;

export type BeneficioEmpresaUpdate = Partial<BeneficioEmpresaInsert>;
