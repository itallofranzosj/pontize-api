-- Migration: Add demissão/turnover columns to profiles
-- Date: 2026-07-10
-- Description: Adicionar campos de demissão e histórico de turnover

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS motivo_demissao VARCHAR(100),
ADD COLUMN IF NOT EXISTS motivo_demissao_detalhado TEXT,
ADD COLUMN IF NOT EXISTS usuario_demissao_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS data_comunicacao_demissao DATE,
ADD COLUMN IF NOT EXISTS com_justa_causa BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS aviso_previo_dias SMALLINT DEFAULT 30,
ADD COLUMN IF NOT EXISTS data_fim_aviso_previo DATE,
ADD COLUMN IF NOT EXISTS saldo_banco_horas DECIMAL(10,2) DEFAULT 0,
ADD COLUMN IF NOT EXISTS saldo_banco_horas_data_calculo TIMESTAMP;

-- Índices para demissões
CREATE INDEX IF NOT EXISTS idx_profiles_demissao ON profiles(empresa_id, data_demissao)
WHERE data_demissao IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_profiles_em_aviso ON profiles(empresa_id, data_fim_aviso_previo)
WHERE data_demissao IS NOT NULL AND data_fim_aviso_previo IS NOT NULL;

-- Constraint para motivo_demissao
ALTER TABLE profiles
ADD CONSTRAINT check_motivo_demissao CHECK (
  (data_demissao IS NULL AND motivo_demissao IS NULL) OR
  (data_demissao IS NOT NULL AND motivo_demissao IS NOT NULL)
);

-- Constraint para aviso previo
ALTER TABLE profiles
ADD CONSTRAINT check_aviso_previo CHECK (
  (data_demissao IS NULL AND aviso_previo_dias IS NULL) OR
  (data_demissao IS NOT NULL AND aviso_previo_dias > 0)
);

-- Comentários
COMMENT ON COLUMN profiles.motivo_demissao IS 'Código do motivo: aposentadoria, rescisao_sem_justa_causa, rescisao_com_justa_causa, pedido_demissao, morte, etc';
COMMENT ON COLUMN profiles.motivo_demissao_detalhado IS 'Descrição detalhada do motivo da demissão';
COMMENT ON COLUMN profiles.com_justa_causa IS 'Se true, demissão por justa causa (afeta cálculos de direitos)';
COMMENT ON COLUMN profiles.aviso_previo_dias IS 'Dias de aviso prévio (padrão CLT = 30 dias)';
COMMENT ON COLUMN profiles.data_fim_aviso_previo IS 'Data de término do aviso prévio (data_demissao + aviso_previo_dias)';
COMMENT ON COLUMN profiles.saldo_banco_horas IS 'Saldo final do banco de horas na demissão (para eventual acerto)';
COMMENT ON COLUMN profiles.saldo_banco_horas_data_calculo IS 'Timestamp do cálculo do saldo final';
