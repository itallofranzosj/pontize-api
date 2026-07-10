-- Migration: Create ocorrencias table
-- Date: 2026-07-10
-- Description: Ocorrências disciplinares (advertência, suspensão, multa, etc)

CREATE TABLE IF NOT EXISTS ocorrencias (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,
  user_id UUID NOT NULL,

  -- Tipo e descrição
  tipo VARCHAR(50) NOT NULL,  -- advertencia, suspensao, multa, dismissao, elogio, etc
  descricao TEXT NOT NULL,
  data_ocorrencia DATE NOT NULL,

  -- Detalhes
  gravidade VARCHAR(20) DEFAULT 'media',  -- leve, media, grave
  numero_protocolo VARCHAR(100),          -- Número interno de controle

  -- Aprovação/Registro
  registrado_por_id UUID NOT NULL,
  data_registro TIMESTAMP DEFAULT now(),
  usuario_aprovacao_id UUID,
  data_aprovacao TIMESTAMP,

  -- Documentação
  arquivo_url TEXT,
  comentarios TEXT,

  -- Efeitos (para suspensão, multa, etc)
  data_efeito_inicio DATE,           -- Quando a ocorrência começa a vigorar
  data_efeito_fim DATE,              -- Quando a ocorrência cessa
  afeta_ponto BOOLEAN DEFAULT false, -- Se bloqueia marcações
  desconto_valor DECIMAL(10,2),      -- Para multa

  -- Recurso/Contestação
  em_recurso BOOLEAN DEFAULT false,
  data_recurso TIMESTAMP,
  resultado_recurso VARCHAR(20),  -- deferido, indeferido, parcial

  -- Status
  status VARCHAR(30) DEFAULT 'registrada',  -- registrada, vigente, expirada, anulada, em_recurso
  motivo_anulacao TEXT,
  usuario_anulacao_id UUID,
  data_anulacao TIMESTAMP,

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT check_tipo CHECK (tipo IN ('advertencia', 'suspensao', 'multa', 'dismissao', 'elogio', 'comendacao', 'aviso', 'desligamento')),
  CONSTRAINT check_gravidade CHECK (gravidade IN ('leve', 'media', 'grave')),
  CONSTRAINT check_status CHECK (status IN ('registrada', 'vigente', 'expirada', 'anulada', 'em_recurso')),
  CONSTRAINT check_datas_efeito CHECK (data_efeito_fim IS NULL OR data_efeito_fim >= data_efeito_inicio),
  CONSTRAINT check_desconto CHECK (desconto_valor IS NULL OR desconto_valor >= 0),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (registrado_por_id) REFERENCES auth.users(id) ON DELETE RESTRICT,
  FOREIGN KEY (usuario_aprovacao_id) REFERENCES auth.users(id) ON DELETE SET NULL,
  FOREIGN KEY (usuario_anulacao_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índices
CREATE INDEX IF NOT EXISTS idx_ocorrencias_empresa_user ON ocorrencias(empresa_id, user_id);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_user_data ON ocorrencias(user_id, data_ocorrencia DESC);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_tipo ON ocorrencias(tipo);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_status ON ocorrencias(status);
CREATE INDEX IF NOT EXISTS idx_ocorrencias_vigente ON ocorrencias(empresa_id, user_id, data_efeito_inicio, data_efeito_fim)
WHERE status IN ('vigente', 'expirada') AND afeta_ponto = true;

-- Índice para recurso
CREATE INDEX IF NOT EXISTS idx_ocorrencias_recurso ON ocorrencias(empresa_id, em_recurso)
WHERE em_recurso = true;

-- Trigger para timestamp
CREATE OR REPLACE FUNCTION update_ocorrencias_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_ocorrencias_timestamp ON ocorrencias;
CREATE TRIGGER tr_ocorrencias_timestamp
BEFORE UPDATE ON ocorrencias
FOR EACH ROW
EXECUTE FUNCTION update_ocorrencias_timestamp();

-- Trigger para validar que registrado_por e aprovador são pessoas diferentes
CREATE OR REPLACE FUNCTION validate_ocorrencia_registro()
RETURNS TRIGGER AS $$
BEGIN
  -- Não permitir auto-aprovação
  IF NEW.usuario_aprovacao_id = NEW.registrado_por_id THEN
    RAISE EXCEPTION 'Ocorrência não pode ser aprovada por quem a registrou';
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_ocorrencias_validate ON ocorrencias;
CREATE TRIGGER tr_ocorrencias_validate
BEFORE INSERT OR UPDATE ON ocorrencias
FOR EACH ROW
WHEN (NEW.usuario_aprovacao_id IS NOT NULL)
EXECUTE FUNCTION validate_ocorrencia_registro();

-- Comentários
COMMENT ON TABLE ocorrencias IS 'Ocorrências disciplinares - advertência, suspensão, multa, dismissão, elogios, etc';
COMMENT ON COLUMN ocorrencias.tipo IS 'Tipo de ocorrência: advertencia, suspensao, multa, dismissao, elogio, comendacao, aviso, desligamento';
COMMENT ON COLUMN ocorrencias.gravidade IS 'Nível de gravidade: leve, media, grave - para análise de padrões';
COMMENT ON COLUMN ocorrencias.afeta_ponto IS 'Se true, colaborador não pode bater ponto durante período de vigência';
COMMENT ON COLUMN ocorrencias.em_recurso IS 'Se true, colaborador está em processo de recurso/contestação';
COMMENT ON COLUMN ocorrencias.status IS 'registrada=novo registro, vigente=ativo, expirada=fim de vigência, anulada=cancelada, em_recurso=contestação';
