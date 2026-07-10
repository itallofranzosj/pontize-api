-- Migration: Create alertas_config table
-- Date: 2026-07-10
-- Description: Configuração de alertas do sistema

CREATE TABLE IF NOT EXISTS alertas_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL UNIQUE,

  -- Ativar/desativar alertas
  alerta_falta_de_ponto BOOLEAN DEFAULT true,
  alerta_intervalo_insuficiente BOOLEAN DEFAULT true,
  alerta_saldo_banco_vencimento BOOLEAN DEFAULT true,
  alerta_horas_extras_nao_aprovadas BOOLEAN DEFAULT true,
  alerta_repouso_nao_respeitado BOOLEAN DEFAULT true,
  alerta_marcacao_fora_tolerancia BOOLEAN DEFAULT false,

  -- Destinatários
  destinatarios_email TEXT[],             -- Array de emails
  notificar_colaborador BOOLEAN DEFAULT true,
  notificar_gestor BOOLEAN DEFAULT true,
  notificar_rh BOOLEAN DEFAULT true,

  -- Metadata
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),

  -- Constraints
  FOREIGN KEY (empresa_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Índices
CREATE UNIQUE INDEX IF NOT EXISTS idx_alertas_config_empresa ON alertas_config(empresa_id);

-- Trigger
CREATE OR REPLACE FUNCTION update_alertas_config_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.atualizado_em = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS tr_alertas_config_timestamp ON alertas_config;
CREATE TRIGGER tr_alertas_config_timestamp
BEFORE UPDATE ON alertas_config
FOR EACH ROW
EXECUTE FUNCTION update_alertas_config_timestamp();

COMMENT ON TABLE alertas_config IS 'Configuração de quais alertas são ativos e para quem notificar';
COMMENT ON COLUMN alertas_config.destinatarios_email IS 'Array de emails para receber notificações: ARRAY[''email1@company.com'', ''email2@company.com'']';
