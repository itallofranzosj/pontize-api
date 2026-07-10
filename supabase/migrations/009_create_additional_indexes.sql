-- Migration: Create additional indexes for performance
-- Date: 2026-07-10
-- Description: Índices adicionais para otimizar queries

-- Índices compostos para queries comuns
CREATE INDEX IF NOT EXISTS idx_jornadas_empresa_ativo ON jornadas(empresa_id, ativo);
CREATE INDEX IF NOT EXISTS idx_horarios_trabalho_jornada_ativo ON horarios_trabalho(jornada_id, ativo);
CREATE INDEX IF NOT EXISTS idx_dias_uteis_empresa_feriado ON dias_uteis(empresa_id, eh_feriado);

-- Índices para buscas de ranges (data)
CREATE INDEX IF NOT EXISTS idx_dias_uteis_data_desc ON dias_uteis(data DESC);
CREATE INDEX IF NOT EXISTS idx_perfis_jornada_ativo_empresa ON perfis_jornada(ativo, empresa_id);

-- Full-text search (português)
CREATE INDEX IF NOT EXISTS idx_jornadas_nome_fts ON jornadas USING gin(to_tsvector('portuguese', nome));
CREATE INDEX IF NOT EXISTS idx_dias_uteis_descricao_fts ON dias_uteis USING gin(to_tsvector('portuguese', descricao));

-- Índices para marcações (importante para performance)
CREATE INDEX IF NOT EXISTS idx_marcacoes_empresa_data ON marcacoes(empresa_id, marcada_em DESC);
CREATE INDEX IF NOT EXISTS idx_marcacoes_user_data ON marcacoes(user_id, marcada_em DESC);

-- Índices para profiles (novo)
CREATE INDEX IF NOT EXISTS idx_profiles_empresa_ativo ON profiles(empresa_id, ativo);
CREATE INDEX IF NOT EXISTS idx_profiles_cargo_empresa ON profiles(cargo, empresa_id);

COMMENT ON INDEX idx_jornadas_empresa_ativo IS 'Buscar jornadas ativas de uma empresa';
COMMENT ON INDEX idx_dias_uteis_empresa_feriado IS 'Buscar feriados de uma empresa';
COMMENT ON INDEX idx_marcacoes_empresa_data IS 'Buscar marcações por empresa e período';
COMMENT ON INDEX idx_marcacoes_user_data IS 'Buscar marcações de um usuário por período';
