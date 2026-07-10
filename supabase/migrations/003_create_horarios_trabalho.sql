-- Migration: Create horarios_trabalho table
-- Date: 2026-07-10
-- Description: Horários específicos de trabalho dentro de uma jornada

CREATE TABLE IF NOT EXISTS horarios_trabalho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,
  jornada_id UUID NOT NULL,

  -- Identificação
  nome TEXT,                              -- "Manhã", "Tarde", "Noturno"
  tipo VARCHAR(50) CHECK(tipo IN ('normal', 'noturno', 'extra', 'flexible')) DEFAULT 'normal',
  descricao TEXT,

  -- Horários (sem data, só hora)
  horario_entrada TIME NOT NULL,          -- 08:00
  horario_saida TIME NOT NULL,            -- 17:00

  -- Intervalo intrajornada
  intervalo_inicio TIME,                  -- 12:00
  intervalo_duracao_minutos INT,          -- 60 minutos

  -- Características
  eh_obrigatorio BOOLEAN DEFAULT true,
  usa_ponto_biometrico BOOLEAN DEFAULT false,
  pode_flexibilizar BOOLEAN DEFAULT false,

  -- Flags
  ativo BOOLEAN DEFAULT true,

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT check_horarios_order CHECK (horario_entrada < horario_saida),
  CONSTRAINT check_intervalo_within_hours CHECK (
    (intervalo_inicio IS NULL AND intervalo_duracao_minutos IS NULL) OR
    (intervalo_inicio IS NOT NULL AND intervalo_duracao_minutos IS NOT NULL)
  ),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (jornada_id) REFERENCES jornadas(id) ON DELETE CASCADE
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_horarios_jornada ON horarios_trabalho(jornada_id);
CREATE INDEX IF NOT EXISTS idx_horarios_empresa ON horarios_trabalho(empresa_id);
CREATE INDEX IF NOT EXISTS idx_horarios_tipo ON horarios_trabalho(tipo);
CREATE INDEX IF NOT EXISTS idx_horarios_ativo ON horarios_trabalho(ativo) WHERE ativo = true;

-- Trigger
CREATE OR REPLACE FUNCTION update_horarios_trabalho_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_horarios_trabalho_timestamp ON horarios_trabalho;
CREATE TRIGGER tr_horarios_trabalho_timestamp
BEFORE UPDATE ON horarios_trabalho
FOR EACH ROW
EXECUTE FUNCTION update_horarios_trabalho_timestamp();

COMMENT ON TABLE horarios_trabalho IS 'Horários específicos dentro de uma jornada (Manhã, Tarde, Noturno, etc)';
