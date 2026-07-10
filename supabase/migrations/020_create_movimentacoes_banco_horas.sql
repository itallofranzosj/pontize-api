-- Migration: Create movimentacoes_banco_horas table
-- Date: 2026-07-10
-- Description: Histórico de movimentações do banco de horas (crédito, débito, compensação)

CREATE TABLE IF NOT EXISTS movimentacoes_banco_horas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,
  user_id UUID NOT NULL,
  banco_horas_id UUID NOT NULL,

  -- Tipo de movimentação
  tipo VARCHAR(50) NOT NULL,  -- credito_extra, credito_ajuste, debito_uso, debito_compensacao, debito_expirado
  descricao TEXT NOT NULL,
  data_movimentacao DATE NOT NULL,

  -- Valores
  horas DECIMAL(10,2) NOT NULL,  -- Positivo para crédito, negativo para débito
  minutos INT,
  saldo_anterior DECIMAL(10,2),
  saldo_novo DECIMAL(10,2),

  -- Referência de origem
  periodo_ano SMALLINT,
  periodo_mes SMALLINT,
  marcacao_id UUID REFERENCES marcacoes(id) ON DELETE SET NULL,  -- Se débito por uso
  afastamento_id UUID REFERENCES afastamentos(id) ON DELETE SET NULL,  -- Se crédito/débito por afastamento

  -- Aprovação
  usuario_origem_id UUID,  -- Quem criou (sistema ou RH)
  usuario_aprovacao_id UUID,
  data_aprovacao TIMESTAMP,
  motivo_rejeicao TEXT,

  -- Status
  status VARCHAR(30) DEFAULT 'aprovado',  -- pendente, aprovado, rejeitado
  observacoes TEXT,

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT check_tipo CHECK (tipo IN ('credito_extra', 'credito_ajuste', 'debito_uso', 'debito_compensacao', 'debito_expirado')),
  CONSTRAINT check_status CHECK (status IN ('pendente', 'aprovado', 'rejeitado')),
  CONSTRAINT check_horas CHECK (horas != 0),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (banco_horas_id) REFERENCES banco_horas(id) ON DELETE CASCADE,
  FOREIGN KEY (usuario_origem_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_aprovacao_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_movimentacoes_user ON movimentacoes_banco_horas(empresa_id, user_id, data_movimentacao DESC);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_banco ON movimentacoes_banco_horas(banco_horas_id);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_tipo ON movimentacoes_banco_horas(tipo);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_status ON movimentacoes_banco_horas(status);
CREATE INDEX IF NOT EXISTS idx_movimentacoes_data ON movimentacoes_banco_horas(data_movimentacao);

-- Índice para buscar movimentações de um período
CREATE INDEX IF NOT EXISTS idx_movimentacoes_periodo ON movimentacoes_banco_horas(empresa_id, periodo_ano, periodo_mes)
WHERE periodo_ano IS NOT NULL AND periodo_mes IS NOT NULL;

-- Trigger para timestamp
CREATE OR REPLACE FUNCTION update_movimentacoes_banco_horas_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  NEW.minutos := ROUND((ABS(NEW.horas) - FLOOR(ABS(NEW.horas))) * 60);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_movimentacoes_banco_horas_timestamp ON movimentacoes_banco_horas;
CREATE TRIGGER tr_movimentacoes_banco_horas_timestamp
BEFORE INSERT OR UPDATE ON movimentacoes_banco_horas
FOR EACH ROW
EXECUTE FUNCTION update_movimentacoes_banco_horas_timestamp();

-- Trigger para atualizar saldo no banco_horas
CREATE OR REPLACE FUNCTION atualizar_saldo_banco_horas()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE banco_horas
  SET saldo_horas = saldo_horas + NEW.horas,
      data_ultima_atualizacao = now()
  WHERE id = NEW.banco_horas_id;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_atualizar_saldo ON movimentacoes_banco_horas;
CREATE TRIGGER tr_atualizar_saldo
AFTER INSERT ON movimentacoes_banco_horas
FOR EACH ROW
WHEN (NEW.status = 'aprovado')
EXECUTE FUNCTION atualizar_saldo_banco_horas();

-- Comentários
COMMENT ON TABLE movimentacoes_banco_horas IS 'Histórico de movimentações do banco de horas - créditos, débitos, compensações';
COMMENT ON COLUMN movimentacoes_banco_horas.tipo IS 'credito_extra=horas extras acumuladas, credito_ajuste=ajuste manual, debito_uso=uso de banco, debito_compensacao=compensação de faltas, debito_expirado=perda por vencimento';
COMMENT ON COLUMN movimentacoes_banco_horas.horas IS 'Positivo=crédito, negativo=débito';
COMMENT ON COLUMN movimentacoes_banco_horas.saldo_anterior IS 'Saldo antes desta movimentação (audit trail)';
COMMENT ON COLUMN movimentacoes_banco_horas.saldo_novo IS 'Saldo após esta movimentação (audit trail)';
COMMENT ON COLUMN movimentacoes_banco_horas.status IS 'pendente=aguarda aprovação RH, aprovado=efetivado, rejeitado=descartado';
