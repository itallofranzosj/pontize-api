-- Migration: Create dias_uteis table
-- Date: 2026-07-10
-- Description: Feriados nacionais, estaduais, municipais e pontes

CREATE TABLE IF NOT EXISTS dias_uteis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,

  data DATE NOT NULL,
  eh_feriado BOOLEAN DEFAULT false,
  tipo VARCHAR(50) CHECK(tipo IN ('feriad_nacional', 'feriad_estadual', 'feriad_municipal', 'ponte', 'outro')) DEFAULT 'outro',

  descricao TEXT,                        -- "Independência do Brasil"

  -- Se trabalhado neste dia
  obrigatorio_folga_compensatoria BOOLEAN DEFAULT true,
  adicional_percentual INT DEFAULT 100,   -- Percentual de adicional

  -- Flags
  ativo BOOLEAN DEFAULT true,

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT unique_empresa_data UNIQUE(empresa_id, data),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_dias_uteis_empresa ON dias_uteis(empresa_id);
CREATE INDEX IF NOT EXISTS idx_dias_uteis_data ON dias_uteis(data);
CREATE INDEX IF NOT EXISTS idx_dias_uteis_feriado ON dias_uteis(eh_feriado) WHERE eh_feriado = true;
CREATE INDEX IF NOT EXISTS idx_dias_uteis_tipo ON dias_uteis(tipo);
CREATE INDEX IF NOT EXISTS idx_dias_uteis_empresa_data ON dias_uteis(empresa_id, data);

-- Trigger
CREATE OR REPLACE FUNCTION update_dias_uteis_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_dias_uteis_timestamp ON dias_uteis;
CREATE TRIGGER tr_dias_uteis_timestamp
BEFORE UPDATE ON dias_uteis
FOR EACH ROW
EXECUTE FUNCTION update_dias_uteis_timestamp();

COMMENT ON TABLE dias_uteis IS 'Registro de feriados nacionais, estaduais, municipais e pontes';
COMMENT ON COLUMN dias_uteis.adicional_percentual IS 'Percentual de adicional se trabalhado neste dia (padrão 100%)';
