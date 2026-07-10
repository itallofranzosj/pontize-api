-- Migration: Create tipos_afastamento table
-- Date: 2026-07-10
-- Description: Tipos de afastamento (férias, licença, atestado, etc)

CREATE TABLE IF NOT EXISTS tipos_afastamento (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,

  -- Identificação
  nome VARCHAR(100) NOT NULL,
  codigo VARCHAR(20) NOT NULL,
  descricao TEXT,

  -- Regras CLT
  descontar_banco_horas BOOLEAN DEFAULT false,
  eh_remunerado BOOLEAN DEFAULT true,
  requer_justificativa BOOLEAN DEFAULT false,
  bloqueia_ponto BOOLEAN DEFAULT true,         -- Se true, não permite bater ponto durante afastamento
  permite_sobreposicao BOOLEAN DEFAULT false,  -- Se true, permite dois afastamentos simultâneos

  -- Dias úteis vs dias corridos
  contar_dias_uteis BOOLEAN DEFAULT true,      -- true=apenas úteis, false=dias corridos
  conta_no_saldo BOOLEAN DEFAULT true,         -- Se conta no banco de horas

  -- Validade
  dias_maximo SMALLINT,                         -- Máximo de dias permitidos por período (NULL=ilimitado)
  requer_periodo_intervalo BOOLEAN DEFAULT false, -- Se exigir intervalo entre afastamentos
  dias_intervalo_minimo SMALLINT,              -- Mínimo de dias entre afastamentos

  -- Metadata
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT check_codigo_length CHECK (length(codigo) > 0),
  CONSTRAINT check_nome_length CHECK (length(nome) > 0),
  UNIQUE(empresa_id, codigo),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_tipos_afastamento_empresa ON tipos_afastamento(empresa_id);
CREATE INDEX IF NOT EXISTS idx_tipos_afastamento_ativo ON tipos_afastamento(empresa_id, ativo);

-- Trigger para timestamp
CREATE OR REPLACE FUNCTION update_tipos_afastamento_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_tipos_afastamento_timestamp ON tipos_afastamento;
CREATE TRIGGER tr_tipos_afastamento_timestamp
BEFORE UPDATE ON tipos_afastamento
FOR EACH ROW
EXECUTE FUNCTION update_tipos_afastamento_timestamp();

-- Comentários
COMMENT ON TABLE tipos_afastamento IS 'Tipos de afastamento (férias, licença, atestado, suspensão, etc) - Define regras CLT';
COMMENT ON COLUMN tipos_afastamento.bloqueia_ponto IS 'Se true, não permite bater ponto durante afastamento';
COMMENT ON COLUMN tipos_afastamento.contar_dias_uteis IS 'true=apenas dias úteis, false=dias corridos (incluindo fds e feriados)';
COMMENT ON COLUMN tipos_afastamento.descontar_banco_horas IS 'Se true, as horas de afastamento descontam do banco de horas';
COMMENT ON COLUMN tipos_afastamento.requer_periodo_intervalo IS 'Se true, exigir intervalo mínimo entre afastamentos do mesmo tipo';
