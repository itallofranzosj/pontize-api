-- Migration: Create periodos_fechados table
-- Date: 2026-07-10
-- Description: Rastreia períodos fechados (meses) - quando foram fechados e por quem

CREATE TABLE IF NOT EXISTS periodos_fechados (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,

  -- Período
  ano SMALLINT NOT NULL,
  mes SMALLINT NOT NULL,
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,

  -- Status do fechamento
  status VARCHAR(30) DEFAULT 'aberto',  -- aberto, em_processamento, fechado, cancelado
  data_abertura TIMESTAMP DEFAULT now(),
  data_fechamento TIMESTAMP,
  usuario_fechamento_id UUID,

  -- Alertas e validações
  total_colaboradores INT,
  colaboradores_processados INT,
  colaboradores_com_alertas INT,
  alertas_gerados JSONB,                -- Lista de alertas do período

  -- Cálculos consolidados
  total_horas_trabalhadas DECIMAL(10,2),
  total_horas_extras DECIMAL(10,2),
  total_adicional_noturno DECIMAL(15,2),
  total_adicional_extra DECIMAL(15,2),
  total_adicional_feriado DECIMAL(15,2),
  total_desconto_intervalo DECIMAL(15,2),

  -- Validações
  todas_marcacoes_validadas BOOLEAN DEFAULT false,
  tem_marcacoes_pendentes BOOLEAN,
  tem_intervalo_insuficiente BOOLEAN,
  tem_afastamentos_pendentes BOOLEAN,
  tem_ocorrencias_pendentes BOOLEAN,

  -- Notas
  notas_fechamento TEXT,
  motivo_cancelamento TEXT,
  data_cancelamento TIMESTAMP,
  usuario_cancelamento_id UUID,

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT check_mes CHECK (mes >= 1 AND mes <= 12),
  CONSTRAINT check_ano CHECK (ano >= 2020 AND ano <= 2099),
  CONSTRAINT check_datas CHECK (data_fim >= data_inicio),
  CONSTRAINT check_status CHECK (status IN ('aberto', 'em_processamento', 'fechado', 'cancelado')),
  CONSTRAINT check_totais CHECK (
    (total_horas_trabalhadas IS NULL OR total_horas_trabalhadas >= 0) AND
    (total_horas_extras IS NULL OR total_horas_extras >= 0)
  ),
  UNIQUE(empresa_id, ano, mes),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_fechamento_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_cancelamento_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_periodos_empresa ON periodos_fechados(empresa_id);
CREATE INDEX IF NOT EXISTS idx_periodos_status ON periodos_fechados(empresa_id, status);
CREATE INDEX IF NOT EXISTS idx_periodos_data_fechamento ON periodos_fechados(data_fechamento DESC);
CREATE INDEX IF NOT EXISTS idx_periodos_ano_mes ON periodos_fechados(empresa_id, ano, mes);

-- Índice para buscar períodos abertos
CREATE INDEX IF NOT EXISTS idx_periodos_abertos ON periodos_fechados(empresa_id)
WHERE status IN ('aberto', 'em_processamento');

-- Trigger para timestamp
CREATE OR REPLACE FUNCTION update_periodos_fechados_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_periodos_fechados_timestamp ON periodos_fechados;
CREATE TRIGGER tr_periodos_fechados_timestamp
BEFORE UPDATE ON periodos_fechados
FOR EACH ROW
EXECUTE FUNCTION update_periodos_fechados_timestamp();

-- Função para validar que período pode ser fechado
CREATE OR REPLACE FUNCTION validate_periodo_fechamento(
  p_empresa_id UUID,
  p_ano SMALLINT,
  p_mes SMALLINT
)
RETURNS TABLE (
  pode_fechar BOOLEAN,
  motivos TEXT[]
) AS $$
DECLARE
  v_data_inicio DATE;
  v_data_fim DATE;
  v_motivos TEXT[];
BEGIN
  -- Calcular data_inicio e data_fim do mês
  v_data_inicio := (p_ano || '-' || LPAD(p_mes::TEXT, 2, '0') || '-01')::DATE;
  v_data_fim := (DATE_TRUNC('MONTH', v_data_inicio) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

  -- Checar se tem marcações pendentes (não validadas)
  IF EXISTS (
    SELECT 1 FROM marcacoes
    WHERE empresa_id = p_empresa_id
      AND DATE(marcada_em) >= v_data_inicio
      AND DATE(marcada_em) <= v_data_fim
      AND validada = false
  ) THEN
    v_motivos := ARRAY_APPEND(v_motivos, 'Existem marcações pendentes de validação');
  END IF;

  -- Checar se tem afastamentos pendentes
  IF EXISTS (
    SELECT 1 FROM afastamentos
    WHERE empresa_id = p_empresa_id
      AND data_inicio <= v_data_fim
      AND data_fim >= v_data_inicio
      AND status = 'pendente'
  ) THEN
    v_motivos := ARRAY_APPEND(v_motivos, 'Existem afastamentos pendentes de aprovação');
  END IF;

  -- Checar se tem ocorrências pendentes
  IF EXISTS (
    SELECT 1 FROM ocorrencias
    WHERE empresa_id = p_empresa_id
      AND DATE(data_ocorrencia) >= v_data_inicio
      AND DATE(data_ocorrencia) <= v_data_fim
      AND status = 'registrada'
  ) THEN
    v_motivos := ARRAY_APPEND(v_motivos, 'Existem ocorrências pendentes de aprovação');
  END IF;

  -- Retornar resultado
  pode_fechar := (v_motivos IS NULL OR ARRAY_LENGTH(v_motivos, 1) = 0);
  motivos := COALESCE(v_motivos, ARRAY[]::TEXT[]);

  RETURN NEXT;
END;
$$ LANGUAGE plpgsql STABLE;

-- Comentários
COMMENT ON TABLE periodos_fechados IS 'Rastreamento de períodos (meses) fechados - importante para compliance e auditoria';
COMMENT ON COLUMN periodos_fechados.status IS 'aberto=período atual, em_processamento=sendo fechado, fechado=finalizado, cancelado=reabertura';
COMMENT ON COLUMN periodos_fechados.todas_marcacoes_validadas IS 'Se false, período não pode ser considerado fechado (reabrir para validação)';
COMMENT ON FUNCTION validate_periodo_fechamento IS 'Função que valida se um período pode ser fechado (sem pendências)';
