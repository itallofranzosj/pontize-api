-- Migration: Create auditoria_log table
-- Date: 2026-07-10
-- Description: Log de auditoria para rastrear todas operações críticas

CREATE TABLE IF NOT EXISTS auditoria_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,

  -- O quê
  entidade VARCHAR(100) NOT NULL,        -- ex: marcacao, afastamento, ocorrencia
  entidade_id UUID NOT NULL,
  operacao VARCHAR(50) NOT NULL,         -- INSERT, UPDATE, DELETE, RECALCULAR, FECHAR
  tipo_operacao VARCHAR(100),            -- ex: recalcularDia, fecharPeriodo, aprovarAfastamento

  -- Quem
  usuario_id UUID,                       -- Quem fez a ação
  FOREIGN KEY (usuario_id) REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Quando
  data_operacao TIMESTAMP DEFAULT now(),
  data_referencia DATE,                  -- ex: data do dia recalculado, data do período fechado

  -- Antes vs Depois
  dados_anterior JSONB,                  -- Conteúdo anterior (para UPDATE/DELETE)
  dados_novo JSONB,                      -- Conteúdo novo (para INSERT/UPDATE)
  diferenças JSONB,                      -- Delta do que mudou

  -- Contexto
  motivo TEXT,                           -- Por que foi feito
  validacoes_clt JSONB,                  -- Validações que foram checadas
  alertas JSONB,                         -- Alertas gerados (intervalo insuficiente, etc)
  erros JSONB,                           -- Erros encontrados

  -- Status
  status VARCHAR(30) DEFAULT 'sucesso',  -- sucesso, erro, parcial
  mensagem_status TEXT,

  -- Metadata
  ip_address VARCHAR(45),                -- IPv4 ou IPv6
  user_agent TEXT,

  criado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT check_operacao CHECK (operacao IN ('INSERT', 'UPDATE', 'DELETE', 'RECALCULAR', 'FECHAR', 'RECALCULAR_MES')),
  CONSTRAINT check_status CHECK (status IN ('sucesso', 'erro', 'parcial')),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices para queries de auditoria
CREATE INDEX IF NOT EXISTS idx_auditoria_empresa ON auditoria_log(empresa_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_usuario ON auditoria_log(usuario_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_entidade ON auditoria_log(entidade, entidade_id);
CREATE INDEX IF NOT EXISTS idx_auditoria_data ON auditoria_log(data_operacao DESC);
CREATE INDEX IF NOT EXISTS idx_auditoria_data_referencia ON auditoria_log(data_referencia);
CREATE INDEX IF NOT EXISTS idx_auditoria_operacao ON auditoria_log(operacao);
CREATE INDEX IF NOT EXISTS idx_auditoria_tipo_operacao ON auditoria_log(tipo_operacao);

-- Índice para buscar operações de um período
CREATE INDEX IF NOT EXISTS idx_auditoria_empresa_data ON auditoria_log(empresa_id, data_referencia DESC)
WHERE operacao IN ('RECALCULAR', 'FECHAR', 'RECALCULAR_MES');

-- Comentários
COMMENT ON TABLE auditoria_log IS 'Log de auditoria - rastreia TODAS operações críticas para compliance CLT';
COMMENT ON COLUMN auditoria_log.operacao IS 'Tipo de operação: INSERT, UPDATE, DELETE, RECALCULAR (dia), FECHAR (período), RECALCULAR_MES (mês inteiro)';
COMMENT ON COLUMN auditoria_log.dados_anterior IS 'Snapshot JSON dos dados antes da alteração (importante para rollback)';
COMMENT ON COLUMN auditoria_log.dados_novo IS 'Snapshot JSON dos dados após alteração';
COMMENT ON COLUMN auditoria_log.diferenças IS 'Delta: apenas campos que mudaram (importante para auditoria rápida)';
COMMENT ON COLUMN auditoria_log.validacoes_clt IS 'JSON com resultado de cada validação CLT checada';
COMMENT ON COLUMN auditoria_log.alertas IS 'JSON com lista de alertas encontrados (intervalo insuficiente, atraso, etc)';
