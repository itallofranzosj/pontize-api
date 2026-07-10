-- Migration: Populate feriados nacionais
-- Date: 2026-07-10
-- Description: Popular feriados nacionais para 2024-2027

-- Nota: Substituir 'PLACEHOLDER_EMPRESA_ID' pela empresa_id real
-- Este script é um template. Para use real, execute um por vez com a empresa_id correta

-- 2024
INSERT INTO dias_uteis (empresa_id, data, eh_feriado, tipo, descricao, adicional_percentual, ativo)
SELECT
  id,
  data::DATE,
  true,
  'feriad_nacional',
  descricao,
  100,
  true
FROM auth.users
WHERE email LIKE '%@%.%'
CROSS JOIN (VALUES
  ('2024-01-01'::DATE, 'Ano Novo'),
  ('2024-02-13'::DATE, 'Carnaval'),
  ('2024-03-29'::DATE, 'Sexta-feira Santa'),
  ('2024-04-21'::DATE, 'Tiradentes'),
  ('2024-05-01'::DATE, 'Dia do Trabalho'),
  ('2024-09-07'::DATE, 'Independência'),
  ('2024-10-12'::DATE, 'Nossa Senhora Aparecida'),
  ('2024-11-02'::DATE, 'Finados'),
  ('2024-11-15'::DATE, 'Proclamação da República'),
  ('2024-11-20'::DATE, 'Consciência Negra'),
  ('2024-12-25'::DATE, 'Natal')
) AS t(data, descricao)
ON CONFLICT (empresa_id, data) DO NOTHING;

-- 2025
INSERT INTO dias_uteis (empresa_id, data, eh_feriado, tipo, descricao, adicional_percentual, ativo)
SELECT
  id,
  data::DATE,
  true,
  'feriad_nacional',
  descricao,
  100,
  true
FROM auth.users
WHERE email LIKE '%@%.%'
CROSS JOIN (VALUES
  ('2025-01-01'::DATE, 'Ano Novo'),
  ('2025-03-04'::DATE, 'Carnaval'),
  ('2025-04-18'::DATE, 'Sexta-feira Santa'),
  ('2025-04-21'::DATE, 'Tiradentes'),
  ('2025-05-01'::DATE, 'Dia do Trabalho'),
  ('2025-09-07'::DATE, 'Independência'),
  ('2025-10-12'::DATE, 'Nossa Senhora Aparecida'),
  ('2025-11-02'::DATE, 'Finados'),
  ('2025-11-15'::DATE, 'Proclamação da República'),
  ('2025-11-20'::DATE, 'Consciência Negra'),
  ('2025-12-25'::DATE, 'Natal')
) AS t(data, descricao)
ON CONFLICT (empresa_id, data) DO NOTHING;

-- 2026
INSERT INTO dias_uteis (empresa_id, data, eh_feriado, tipo, descricao, adicional_percentual, ativo)
SELECT
  id,
  data::DATE,
  true,
  'feriad_nacional',
  descricao,
  100,
  true
FROM auth.users
WHERE email LIKE '%@%.%'
CROSS JOIN (VALUES
  ('2026-01-01'::DATE, 'Ano Novo'),
  ('2026-02-17'::DATE, 'Carnaval'),
  ('2026-04-03'::DATE, 'Sexta-feira Santa'),
  ('2026-04-21'::DATE, 'Tiradentes'),
  ('2026-05-01'::DATE, 'Dia do Trabalho'),
  ('2026-09-07'::DATE, 'Independência'),
  ('2026-10-12'::DATE, 'Nossa Senhora Aparecida'),
  ('2026-11-02'::DATE, 'Finados'),
  ('2026-11-15'::DATE, 'Proclamação da República'),
  ('2026-11-20'::DATE, 'Consciência Negra'),
  ('2026-12-25'::DATE, 'Natal')
) AS t(data, descricao)
ON CONFLICT (empresa_id, data) DO NOTHING;

-- 2027
INSERT INTO dias_uteis (empresa_id, data, eh_feriado, tipo, descricao, adicional_percentual, ativo)
SELECT
  id,
  data::DATE,
  true,
  'feriad_nacional',
  descricao,
  100,
  true
FROM auth.users
WHERE email LIKE '%@%.%'
CROSS JOIN (VALUES
  ('2027-01-01'::DATE, 'Ano Novo'),
  ('2027-02-09'::DATE, 'Carnaval'),
  ('2027-03-26'::DATE, 'Sexta-feira Santa'),
  ('2027-04-21'::DATE, 'Tiradentes'),
  ('2027-05-01'::DATE, 'Dia do Trabalho'),
  ('2027-09-07'::DATE, 'Independência'),
  ('2027-10-12'::DATE, 'Nossa Senhora Aparecida'),
  ('2027-11-02'::DATE, 'Finados'),
  ('2027-11-15'::DATE, 'Proclamação da República'),
  ('2027-11-20'::DATE, 'Consciência Negra'),
  ('2027-12-25'::DATE, 'Natal')
) AS t(data, descricao)
ON CONFLICT (empresa_id, data) DO NOTHING;

-- Comentário
-- NOTA: Este script popula automaticamente para TODOS os usuários
-- Para uma empresa específica, use:
-- INSERT INTO dias_uteis (empresa_id, data, eh_feriado, tipo, descricao, adicional_percentual)
-- VALUES ('seu-uuid', '2026-01-01', true, 'feriad_nacional', 'Ano Novo', 100);
