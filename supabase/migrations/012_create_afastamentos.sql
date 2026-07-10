-- Migration: Create afastamentos table
-- Date: 2026-07-10
-- Description: Registro de afastamentos por colaborador (férias, licença, atestado, etc)

CREATE TABLE IF NOT EXISTS afastamentos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL,
  user_id UUID NOT NULL,
  tipo_afastamento_id UUID NOT NULL,

  -- Período
  data_inicio DATE NOT NULL,
  data_fim DATE NOT NULL,
  duracao_dias SMALLINT NOT NULL,

  -- Descrição e documentação
  motivo TEXT,
  numero_documento VARCHAR(100),  -- Para atestado, RG, etc
  documento_url TEXT,

  -- Status e aprovação
  status VARCHAR(50) DEFAULT 'pendente',  -- pendente, aprovado, rejeitado, cancelado
  usuario_aprovacao_id UUID,
  data_aprovacao TIMESTAMP,
  motivo_rejeicao TEXT,
  data_rejeicao TIMESTAMP,

  -- Banco de horas
  descontar_do_banco BOOLEAN DEFAULT true,
  horas_descontadas DECIMAL(5,2),

  -- Sequência de afastamentos (para validação)
  afastamento_anterior_id UUID REFERENCES afastamentos(id) ON DELETE SET NULL,
  dias_desde_anterior SMALLINT,  -- Calculado automaticamente

  -- Validações CLT
  validado_clt BOOLEAN DEFAULT false,
  motivo_invalidade_clt TEXT,

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  CONSTRAINT check_datas CHECK (data_fim >= data_inicio),
  CONSTRAINT check_status CHECK (status IN ('pendente', 'aprovado', 'rejeitado', 'cancelado')),
  CONSTRAINT check_duracao CHECK (duracao_dias > 0),
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  FOREIGN KEY (tipo_afastamento_id) REFERENCES tipos_afastamento(id) ON DELETE RESTRICT,
  FOREIGN KEY (usuario_aprovacao_id) REFERENCES auth.users(id) ON DELETE SET NULL
);

-- Índices para queries comuns
CREATE INDEX IF NOT EXISTS idx_afastamentos_empresa_user ON afastamentos(empresa_id, user_id);
CREATE INDEX IF NOT EXISTS idx_afastamentos_user_data ON afastamentos(user_id, data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_afastamentos_status ON afastamentos(status);
CREATE INDEX IF NOT EXISTS idx_afastamentos_data_intervalo ON afastamentos(data_inicio, data_fim);
CREATE INDEX IF NOT EXISTS idx_afastamentos_tipo ON afastamentos(tipo_afastamento_id);

-- Índice para buscar afastamentos ativos (overlapping)
CREATE INDEX IF NOT EXISTS idx_afastamentos_ativo ON afastamentos(empresa_id, user_id, data_inicio, data_fim)
WHERE status = 'aprovado';

-- Trigger para timestamp
CREATE OR REPLACE FUNCTION update_afastamentos_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_afastamentos_timestamp ON afastamentos;
CREATE TRIGGER tr_afastamentos_timestamp
BEFORE UPDATE ON afastamentos
FOR EACH ROW
EXECUTE FUNCTION update_afastamentos_timestamp();

-- Trigger para calcular duracao_dias automaticamente
CREATE OR REPLACE FUNCTION calculate_afastamento_duracao()
RETURNS TRIGGER AS $$
BEGIN
  -- Calcular dias (incluindo início e fim)
  NEW.duracao_dias = EXTRACT(DAY FROM NEW.data_fim - NEW.data_inicio) + 1;

  -- Se há afastamento anterior, calcular dias desde ele
  IF NEW.afastamento_anterior_id IS NOT NULL THEN
    SELECT EXTRACT(DAY FROM NEW.data_inicio - af.data_fim)::SMALLINT
    INTO NEW.dias_desde_anterior
    FROM afastamentos af
    WHERE af.id = NEW.afastamento_anterior_id;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_afastamentos_duracao ON afastamentos;
CREATE TRIGGER tr_afastamentos_duracao
BEFORE INSERT OR UPDATE ON afastamentos
FOR EACH ROW
EXECUTE FUNCTION calculate_afastamento_duracao();

-- Comentários
COMMENT ON TABLE afastamentos IS 'Registro de afastamentos por colaborador - férias, licença, atestado, suspensão, etc';
COMMENT ON COLUMN afastamentos.status IS 'pendente=aguardando aprovação, aprovado=ativo, rejeitado=não aprovado, cancelado=cancelado após aprovação';
COMMENT ON COLUMN afastastamentos.bloqueia_ponto IS 'Se true, colaborador não pode bater ponto durante este afastamento';
COMMENT ON COLUMN afastamentos.descontar_do_banco IS 'Se true, este afastamento desconta horas do banco de horas do colaborador';
COMMENT ON COLUMN afastamentos.validado_clt IS 'Se false, indica violação de alguma regra CLT (ex: férias sem intervalo mínimo)';
