-- Migration: Create empresa_config table
-- Date: 2026-07-10
-- Description: Criação da tabela de configuração geral da empresa

CREATE TABLE IF NOT EXISTS empresa_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL UNIQUE,

  -- Jornada padrão
  jornada_padrao_horas DECIMAL(4,2) DEFAULT 8.00,
  jornada_padrao_minutos INT DEFAULT 480,

  -- Intervalo intrajornada
  intervalo_minimo_ate_6h INT DEFAULT 15,
  intervalo_minimo_apos_6h INT DEFAULT 60,
  intervalo_remunerado BOOLEAN DEFAULT false,

  -- Trabalho noturno (Art. 73-74 CLT)
  horario_noturno_inicio INT DEFAULT 21,
  horario_noturno_fim INT DEFAULT 5,
  adicional_noturno_percentual INT DEFAULT 20,
  hora_noturna_minutos DECIMAL(4,2) DEFAULT 52.5,

  -- Horas extras (Art. 59 CLT)
  adicional_extra_padrao INT DEFAULT 50,
  adicional_extra_feriado INT DEFAULT 100,
  horas_extra_limite_dia INT DEFAULT 2,

  -- Tolerância de marcação
  tolerancia_minutos INT DEFAULT 5,
  aplicar_tolerancia BOOLEAN DEFAULT true,

  -- Feriado trabalhado
  feriado_adicional_percentual INT DEFAULT 100,

  -- Descanso semanal (Art. 67 CLT)
  dia_repouso_preferencial INT DEFAULT 0, -- 0=domingo, 1-6=seg-sab
  exigir_repouso_semanal BOOLEAN DEFAULT true,

  -- Configurações gerais
  timezone TEXT DEFAULT 'America/Sao_Paulo',

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  CONSTRAINT check_jornada_hours CHECK (jornada_padrao_horas > 0 AND jornada_padrao_horas <= 24),
  CONSTRAINT check_intervalo_values CHECK (intervalo_minimo_ate_6h >= 0 AND intervalo_minimo_apos_6h >= 0),
  CONSTRAINT check_tolerancia_value CHECK (tolerancia_minutos >= 0 AND tolerancia_minutos <= 60)
);

-- Índices
CREATE UNIQUE INDEX IF NOT EXISTS idx_empresa_config_empresa_id ON empresa_config(empresa_id);
CREATE INDEX IF NOT EXISTS idx_empresa_config_timestamp ON empresa_config(atualizado_em DESC);

-- Trigger para atualizar timestamp
CREATE OR REPLACE FUNCTION update_empresa_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_empresa_config_timestamp ON empresa_config;
CREATE TRIGGER tr_empresa_config_timestamp
BEFORE UPDATE ON empresa_config
FOR EACH ROW
EXECUTE FUNCTION update_empresa_config_timestamp();

-- Comentários
COMMENT ON TABLE empresa_config IS 'Configurações gerais da empresa (jornada, intervalo, extras, noturno, etc)';
COMMENT ON COLUMN empresa_config.hora_noturna_minutos IS 'CLT Art. 74: Hora noturna = 52.5 minutos (não 60)';
COMMENT ON COLUMN empresa_config.adicional_noturno_percentual IS 'CLT Art. 73: Mínimo 20% adicional noturno';
COMMENT ON COLUMN empresa_config.horas_extra_limite_dia IS 'CLT Art. 59: Limite de horas extras por dia';
