-- Migration: Alter marcacoes table - add validation columns
-- Date: 2026-07-10
-- Description: Adicionar colunas de validação CLT e rastreamento de cálculos

ALTER TABLE marcacoes
ADD COLUMN IF NOT EXISTS validada BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS motivo_rejeicao VARCHAR(500),
ADD COLUMN IF NOT EXISTS data_validacao TIMESTAMP,
ADD COLUMN IF NOT EXISTS usuario_validacao_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS horas_trabalhadas DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS minutos_trabalhados INT,
ADD COLUMN IF NOT EXISTS intervalo_realizado DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS minutos_intervalo INT,
ADD COLUMN IF NOT EXISTS horas_extras DECIMAL(5,2),
ADD COLUMN IF NOT EXISTS minutos_extras INT,
ADD COLUMN IF NOT EXISTS adicional_noturno DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS adicional_extra DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS adicional_feriado DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS validacoes_clt JSONB,
ADD COLUMN IF NOT EXISTS alertas JSONB,
ADD COLUMN IF NOT EXISTS data_recalculo TIMESTAMP,
ADD COLUMN IF NOT EXISTS usuario_recalculo_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS sob_auditoria BOOLEAN DEFAULT false;

-- Índices para validação
CREATE INDEX IF NOT EXISTS idx_marcacoes_validada ON marcacoes(empresa_id, user_id, validada);
CREATE INDEX IF NOT EXISTS idx_marcacoes_sob_auditoria ON marcacoes(empresa_id, sob_auditoria);
CREATE INDEX IF NOT EXISTS idx_marcacoes_com_extras ON marcacoes(empresa_id, user_id, marcada_em)
WHERE horas_extras > 0 OR adicional_noturno > 0;

-- Índice para dias que precisam de fechamento
CREATE INDEX IF NOT EXISTS idx_marcacoes_nao_validada ON marcacoes(empresa_id, marcada_em::DATE)
WHERE validada = false;

-- Constraints
ALTER TABLE marcacoes
ADD CONSTRAINT check_horas_trabalhadas CHECK (horas_trabalhadas IS NULL OR horas_trabalhadas >= 0),
ADD CONSTRAINT check_minutos_trabalhados CHECK (minutos_trabalhados IS NULL OR minutos_trabalhados >= 0),
ADD CONSTRAINT check_horas_extras CHECK (horas_extras IS NULL OR horas_extras >= 0),
ADD CONSTRAINT check_minutos_extras CHECK (minutos_extras IS NULL OR minutos_extras >= 0),
ADD CONSTRAINT check_adicional CHECK (
  (adicional_noturno IS NULL OR adicional_noturno >= 0) AND
  (adicional_extra IS NULL OR adicional_extra >= 0) AND
  (adicional_feriado IS NULL OR adicional_feriado >= 0)
);

-- Comentários
COMMENT ON COLUMN marcacoes.validada IS 'Se true, marcação foi validada contra CLT (pode estar rejeitada ou aceita)';
COMMENT ON COLUMN marcacoes.motivo_rejeicao IS 'Se validada=true e rejeitada, motivo da rejeição';
COMMENT ON COLUMN marcacoes.data_validacao IS 'Quando foi validada/rejeitada pela última vez';
COMMENT ON COLUMN marcacoes.usuario_validacao_id IS 'Quem validou/rejeitou';
COMMENT ON COLUMN marcacoes.horas_trabalhadas IS 'Horas efetivamente trabalhadas (entrada - saída - intervalo)';
COMMENT ON COLUMN marcacoes.minutos_intervalo IS 'Minutos de intervalo realizado (pode ser < intervalo obrigatório)';
COMMENT ON COLUMN marcacoes.horas_extras IS 'Horas extras (horas_trabalhadas - jornada_padrão)';
COMMENT ON COLUMN marcacoes.adicional_noturno IS 'Valor em R$ do adicional noturno (horas noturnas * valor)';
COMMENT ON COLUMN marcacoes.adicional_extra IS 'Valor em R$ do adicional extra (horas extras * valor)';
COMMENT ON COLUMN marcacoes.adicional_feriado IS 'Valor em R$ se trabalhou em feriado (jornada * percentual feriado)';
COMMENT ON COLUMN marcacoes.validacoes_clt IS 'JSON com resultado de cada validação: intervalo_suficiente, jornada_ok, feriado, afastamento, etc';
COMMENT ON COLUMN marcacoes.alertas IS 'JSON com lista de alertas gerados durante validação';
COMMENT ON COLUMN marcacoes.data_recalculo IS 'Timestamp do último recálculo automático';
COMMENT ON COLUMN marcacoes.usuario_recalculo_id IS 'Quem disparou o recálculo (sistema ou RH)';
COMMENT ON COLUMN marcacoes.sob_auditoria IS 'Se true, marcação está sendo auditada por RH';
