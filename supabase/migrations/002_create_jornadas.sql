-- Migration: Create jornadas table
-- Date: 2026-07-10
-- Description: Criação da tabela de jornadas (8h, 6h, 12h, flexível, etc)

CREATE TABLE IF NOT EXISTS jornadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,

  -- Identificação
  nome TEXT NOT NULL,                    -- "Jornada 8h", "Turno Noturno"
  codigo TEXT NOT NULL,                  -- Código único por empresa
  descricao TEXT,

  -- Configuração de horas
  horas_dia DECIMAL(4,2) NOT NULL,       -- 8.0, 6.0, 12.0, etc
  minutos_dia INT,                       -- Precalculado: horas_dia * 60

  -- Dias de aplicação (JSON com dias da semana)
  dias_semana JSONB DEFAULT '{
    "seg": true,
    "ter": true,
    "qua": true,
    "qui": true,
    "sex": true,
    "sab": false,
    "dom": false
  }',

  -- Intervalo
  permite_intervalo BOOLEAN DEFAULT true,
  intervalo_minutos INT,                 -- Duração do intervalo

  -- Horários base
  horario_inicio_padrao TIME,             -- 08:00
  horario_fim_padrao TIME,                -- 17:00

  -- Flags
  ativo BOOLEAN DEFAULT true,
  tipo VARCHAR(50) DEFAULT 'normal',      -- normal, noturno, extra, flexible

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT unique_jornada_codigo UNIQUE(empresa_id, codigo),
  CONSTRAINT check_jornada_hours CHECK (horas_dia > 0 AND horas_dia <= 24),
  CONSTRAINT check_horarios_order CHECK (horario_inicio_padrao < horario_fim_padrao),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_jornadas_empresa ON jornadas(empresa_id);
CREATE INDEX IF NOT EXISTS idx_jornadas_ativo ON jornadas(ativo) WHERE ativo = true;
CREATE INDEX IF NOT EXISTS idx_jornadas_tipo ON jornadas(tipo);
CREATE INDEX IF NOT EXISTS idx_jornadas_timestamp ON jornadas(atualizado_em DESC);

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION update_jornadas_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  NEW.minutos_dia = ROUND(NEW.horas_dia * 60)::INT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_jornadas_timestamp ON jornadas;
CREATE TRIGGER tr_jornadas_timestamp
BEFORE UPDATE ON jornadas
FOR EACH ROW
EXECUTE FUNCTION update_jornadas_timestamp();

-- Trigger para inserção (calcular minutos_dia)
CREATE OR REPLACE FUNCTION on_jornadas_insert()
RETURNS TRIGGER AS $$
BEGIN
  NEW.minutos_dia = ROUND(NEW.horas_dia * 60)::INT;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_jornadas_insert ON jornadas;
CREATE TRIGGER tr_jornadas_insert
BEFORE INSERT ON jornadas
FOR EACH ROW
EXECUTE FUNCTION on_jornadas_insert();

-- Comentários
COMMENT ON TABLE jornadas IS 'Jornadas de trabalho da empresa (8h, 6h, 12h, flexível, etc)';
COMMENT ON COLUMN jornadas.dias_semana IS 'JSON: {"seg": true, "ter": true, ..., "dom": false}';
COMMENT ON COLUMN jornadas.minutos_dia IS 'Calculado automaticamente: horas_dia * 60';
