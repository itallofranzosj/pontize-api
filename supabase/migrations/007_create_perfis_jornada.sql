-- Migration: Create perfis_jornada table
-- Date: 2026-07-10
-- Description: Mapeamento de cargo/setor -> jornada

CREATE TABLE IF NOT EXISTS perfis_jornada (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,

  -- Quem se aplica (pelo menos um deve ser preenchido)
  cargo TEXT,                            -- "Gerente", "Assistente", etc (nullable)
  setor_id UUID,                         -- Opcional: filtro por setor

  -- Qual jornada/turno se aplica
  jornada_id UUID NOT NULL,

  -- Sobrescritas específicas (se NULL, usa valores da jornada_id)
  jornada_horas_sobrescrita DECIMAL(4,2),  -- Se preenchido, sobrescreve
  intervalo_minutos_sobrescrita INT,

  -- Flags
  ativo BOOLEAN DEFAULT true,

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT unique_perfil_cargo_setor UNIQUE(empresa_id, cargo, setor_id),
  CONSTRAINT check_cargo_or_setor CHECK (cargo IS NOT NULL OR setor_id IS NOT NULL),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (jornada_id) REFERENCES jornadas(id) ON DELETE CASCADE,
  FOREIGN KEY (setor_id) REFERENCES setores(id) ON DELETE SET NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_perfis_jornada_empresa ON perfis_jornada(empresa_id);
CREATE INDEX IF NOT EXISTS idx_perfis_jornada_cargo ON perfis_jornada(cargo);
CREATE INDEX IF NOT EXISTS idx_perfis_jornada_setor ON perfis_jornada(setor_id);
CREATE INDEX IF NOT EXISTS idx_perfis_jornada_jornada ON perfis_jornada(jornada_id);
CREATE INDEX IF NOT EXISTS idx_perfis_jornada_ativo ON perfis_jornada(ativo) WHERE ativo = true;

-- Trigger
CREATE OR REPLACE FUNCTION update_perfis_jornada_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_perfis_jornada_timestamp ON perfis_jornada;
CREATE TRIGGER tr_perfis_jornada_timestamp
BEFORE UPDATE ON perfis_jornada
FOR EACH ROW
EXECUTE FUNCTION update_perfis_jornada_timestamp();

COMMENT ON TABLE perfis_jornada IS 'Mapeia cargo e/ou setor para sua jornada de trabalho';
COMMENT ON COLUMN perfis_jornada.cargo IS 'Se preenchido, aplica a este cargo (busca por prioridade: setor específico, depois setor NULL)';
