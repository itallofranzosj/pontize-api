-- Migration: Alter profiles table - add configuration columns
-- Date: 2026-07-10
-- Description: Adicionar novos campos a profiles para jornada, turno, demissão, etc

-- Adicionar colunas sem quebrar dados existentes
ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS turno_id UUID REFERENCES jornadas(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS jornada_id UUID REFERENCES jornadas(id) ON DELETE SET NULL,
ADD COLUMN IF NOT EXISTS data_demissao DATE,
ADD COLUMN IF NOT EXISTS tipo_contrato VARCHAR(50) DEFAULT 'CLT',
ADD COLUMN IF NOT EXISTS salario_base DECIMAL(10,2),
ADD COLUMN IF NOT EXISTS banco_id TEXT,
ADD COLUMN IF NOT EXISTS agencia_id TEXT,
ADD COLUMN IF NOT EXISTS conta TEXT,
ADD COLUMN IF NOT EXISTS documento_url TEXT;

-- Índices para performance
CREATE INDEX IF NOT EXISTS idx_profiles_turno ON profiles(turno_id);
CREATE INDEX IF NOT EXISTS idx_profiles_jornada ON profiles(jornada_id);
CREATE INDEX IF NOT EXISTS idx_profiles_tipo_contrato ON profiles(tipo_contrato);
CREATE INDEX IF NOT EXISTS idx_profiles_ativo_empresa ON profiles(ativo, empresa_id) WHERE ativo = true;

-- Adicionar constraints
ALTER TABLE profiles
ADD CONSTRAINT check_tipo_contrato CHECK (tipo_contrato IN ('CLT', 'PJ', 'Estagiário', 'Aprendiz', 'Temporário', 'Consultoria'));

-- Comentários
COMMENT ON COLUMN profiles.turno_id IS 'Referência ao turno de trabalho do colaborador';
COMMENT ON COLUMN profiles.jornada_id IS 'Referência à jornada de trabalho do colaborador';
COMMENT ON COLUMN profiles.data_demissao IS 'Data de demissão (NULL = ainda ativo)';
COMMENT ON COLUMN profiles.tipo_contrato IS 'Tipo de contrato: CLT, PJ, Estagiário, Aprendiz, Temporário, Consultoria';
COMMENT ON COLUMN profiles.salario_base IS 'Salário base em reais (para cálculos de horas extras)';
COMMENT ON COLUMN profiles.banco_id IS 'Código do banco (para transferência)';
COMMENT ON COLUMN profiles.agencia_id IS 'Agência bancária';
COMMENT ON COLUMN profiles.conta IS 'Número da conta bancária';
COMMENT ON COLUMN profiles.documento_url IS 'URL do documento de identidade armazenado';
