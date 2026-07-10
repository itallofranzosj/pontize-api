-- Migration: Create banco_horas table
-- Date: 2026-07-10
-- Description: Controle de banco de horas (saldo, movimentações, vencimento)

CREATE TABLE IF NOT EXISTS banco_horas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,
  user_id UUID NOT NULL,

  -- Saldo atual
  saldo_horas DECIMAL(10,2) DEFAULT 0,
  saldo_minutos INT DEFAULT 0,
  data_ultima_atualizacao TIMESTAMP DEFAULT now(),

  -- Período de validade
  periodo_ano SMALLINT,
  periodo_mes SMALLINT,
  data_vencimento DATE,
  dias_aviso_vencimento SMALLINT DEFAULT 30,

  -- Status
  status VARCHAR(30) DEFAULT 'ativo',  -- ativo, expirado, compensado, parcialmente_compensado
  observacoes TEXT,

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT check_saldo CHECK (saldo_horas >= -999 AND saldo_horas <= 9999),
  CONSTRAINT check_status CHECK (status IN ('ativo', 'expirado', 'compensado', 'parcialmente_compensado')),
  UNIQUE(empresa_id, user_id, periodo_ano, periodo_mes),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_banco_horas_user ON banco_horas(empresa_id, user_id);
CREATE INDEX IF NOT EXISTS idx_banco_horas_vencimento ON banco_horas(data_vencimento);
CREATE INDEX IF NOT EXISTS idx_banco_horas_status ON banco_horas(status);
CREATE INDEX IF NOT EXISTS idx_banco_horas_ativo ON banco_horas(empresa_id, user_id, status)
WHERE status IN ('ativo', 'parcialmente_compensado');

-- Índice para buscar vencimentos próximos
CREATE INDEX IF NOT EXISTS idx_banco_horas_prox_vencimento ON banco_horas(empresa_id, data_vencimento)
WHERE status IN ('ativo', 'parcialmente_compensado');

-- Trigger para timestamp
CREATE OR REPLACE FUNCTION update_banco_horas_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  NEW.saldo_minutos := ROUND((NEW.saldo_horas - FLOOR(NEW.saldo_horas)) * 60);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_banco_horas_timestamp ON banco_horas;
CREATE TRIGGER tr_banco_horas_timestamp
BEFORE UPDATE ON banco_horas
FOR EACH ROW
EXECUTE FUNCTION update_banco_horas_timestamp();

-- Comentários
COMMENT ON TABLE banco_horas IS 'Banco de horas por período - saldo, vencimento, status';
COMMENT ON COLUMN banco_horas.saldo_horas IS 'Saldo em horas + frações decimais (ex: 10.5 = 10h 30min)';
COMMENT ON COLUMN banco_horas.saldo_minutos IS 'Minutos (calculado automaticamente)';
COMMENT ON COLUMN banco_horas.data_vencimento IS 'Data de vencimento do banco (padrão: final do período + 12 meses)';
COMMENT ON COLUMN banco_horas.status IS 'ativo=banco válido, expirado=venceu, compensado=zerou, parcialmente_compensado=zerou parcial';
