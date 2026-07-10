-- Migration: Create localizacao_config table
-- Date: 2026-07-10
-- Description: Configuração de geolocalização (Cerca Virtual / GPS)

CREATE TABLE IF NOT EXISTS localizacao_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL UNIQUE,

  -- Localização GPS
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  raio_metros INT DEFAULT 500,           -- 500 metros de tolerância

  -- Validação
  validar_gps_automaticamente BOOLEAN DEFAULT true,
  alerta_fora_raio BOOLEAN DEFAULT true,
  bloqueiar_ponto_fora_raio BOOLEAN DEFAULT false,  -- Se true, não permite bater ponto fora

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT check_latitude CHECK (latitude >= -90 AND latitude <= 90),
  CONSTRAINT check_longitude CHECK (longitude >= -180 AND longitude <= 180),
  CONSTRAINT check_raio CHECK (raio_metros > 0 AND raio_metros <= 10000),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices
CREATE UNIQUE INDEX IF NOT EXISTS idx_localizacao_config_empresa ON localizacao_config(empresa_id);

-- Trigger
CREATE OR REPLACE FUNCTION update_localizacao_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_localizacao_config_timestamp ON localizacao_config;
CREATE TRIGGER tr_localizacao_config_timestamp
BEFORE UPDATE ON localizacao_config
FOR EACH ROW
EXECUTE FUNCTION update_localizacao_config_timestamp();

COMMENT ON TABLE localizacao_config IS 'Configuração de geolocalização (Cerca Virtual) - valida entrada/saída via GPS';
COMMENT ON COLUMN localizacao_config.raio_metros IS 'Raio em metros: distância máxima do ponto central para validar marcação';
