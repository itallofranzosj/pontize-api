-- Migration: Create banco_horas calculation functions
-- Date: 2026-07-10
-- Description: Funções para cálculo e gestão de banco de horas

-- Função: calcularSaldoBanco
-- Calcula o saldo de banco de horas (extras - compensações)
CREATE OR REPLACE FUNCTION calcular_saldo_banco(
  p_empresa_id UUID,
  p_user_id UUID,
  p_periodo_ano SMALLINT,
  p_periodo_mes SMALLINT
)
RETURNS TABLE (
  saldo_horas DECIMAL,
  saldo_minutos INT,
  horas_extras DECIMAL,
  horas_compensadas DECIMAL,
  horas_expiradas DECIMAL,
  status VARCHAR,
  alertas TEXT[]
) AS $$
DECLARE
  v_saldo_horas DECIMAL := 0;
  v_horas_extras DECIMAL := 0;
  v_horas_compensadas DECIMAL := 0;
  v_horas_expiradas DECIMAL := 0;
  v_status VARCHAR := 'ativo';
  v_alertas TEXT[] := ARRAY[]::TEXT[];
  v_data_inicio DATE;
  v_data_fim DATE;
  v_data_vencimento DATE;
  v_dias_para_vencer INT;
BEGIN

  -- 1. Calcular datas do período
  v_data_inicio := (p_periodo_ano || '-' || LPAD(p_periodo_mes::TEXT, 2, '0') || '-01')::DATE;
  v_data_fim := (DATE_TRUNC('MONTH', v_data_inicio) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

  -- Data de vencimento: fim do período + 12 meses
  v_data_vencimento := v_data_fim + INTERVAL '12 months';

  -- 2. Buscar horas extras do período
  SELECT COALESCE(SUM(horas_extras), 0)
  INTO v_horas_extras
  FROM marcacoes
  WHERE empresa_id = p_empresa_id
    AND user_id = p_user_id
    AND DATE(marcada_em) >= v_data_inicio
    AND DATE(marcada_em) <= v_data_fim
    AND horas_extras > 0
    AND validada = true;

  -- 3. Buscar compensações de faltas (afastamentos não remunerados)
  SELECT COALESCE(SUM(duracao_dias), 0)
  INTO v_horas_compensadas
  FROM afastamentos
  WHERE empresa_id = p_empresa_id
    AND user_id = p_user_id
    AND DATE(data_inicio) >= v_data_inicio
    AND DATE(data_fim) <= v_data_fim
    AND status = 'aprovado'
    AND eh_remunerado = false;

  -- 4. Calcular saldo liquido
  v_saldo_horas := v_horas_extras - v_horas_compensadas;

  -- 5. Validar vencimento
  v_dias_para_vencer := EXTRACT(DAY FROM v_data_vencimento - CURRENT_DATE);

  IF v_dias_para_vencer <= 0 THEN
    v_status := 'expirado';
    v_horas_expiradas := v_saldo_horas;
    v_alertas := ARRAY_APPEND(v_alertas, 'Banco de horas expirou em ' || v_data_vencimento::TEXT);
  ELSIF v_dias_para_vencer <= 30 THEN
    v_alertas := ARRAY_APPEND(v_alertas, 'Banco de horas vence em ' || v_dias_para_vencer || ' dias (' || v_data_vencimento::TEXT || ')');
  END IF;

  -- 6. Validar saldo
  IF v_saldo_horas = 0 THEN
    v_status := 'compensado';
  ELSIF v_saldo_horas < 0 THEN
    v_alertas := ARRAY_APPEND(v_alertas, 'Banco de horas negativo: -' || ABS(v_saldo_horas)::TEXT || ' horas');
  END IF;

  -- 7. Retornar resultado
  saldo_horas := v_saldo_horas;
  saldo_minutos := ROUND((ABS(v_saldo_horas) - FLOOR(ABS(v_saldo_horas))) * 60);
  horas_extras := v_horas_extras;
  horas_compensadas := v_horas_compensadas;
  horas_expiradas := v_horas_expiradas;
  status := v_status;
  alertas := v_alertas;

  RETURN NEXT;

EXCEPTION WHEN OTHERS THEN
  alertas := ARRAY_APPEND(ARRAY[]::TEXT[], 'Erro ao calcular saldo: ' || SQLERRM);
  RETURN NEXT;
END;
$$ LANGUAGE plpgsql STABLE;

-- Função: aplicar_compensacao
-- Aplica compensação de banco de horas (débito)
CREATE OR REPLACE FUNCTION aplicar_compensacao(
  p_empresa_id UUID,
  p_user_id UUID,
  p_banco_horas_id UUID,
  p_horas DECIMAL,
  p_motivo TEXT,
  p_usuario_operacao_id UUID
)
RETURNS TABLE (
  sucesso BOOLEAN,
  novo_saldo DECIMAL,
  movimentacao_id UUID,
  alertas TEXT[]
) AS $$
DECLARE
  v_saldo_atual DECIMAL;
  v_novo_saldo DECIMAL;
  v_movimentacao_id UUID;
  v_alertas TEXT[] := ARRAY[]::TEXT[];
BEGIN

  -- 1. Buscar saldo atual
  SELECT saldo_horas INTO v_saldo_atual
  FROM banco_horas
  WHERE id = p_banco_horas_id
    AND empresa_id = p_empresa_id
    AND user_id = p_user_id;

  IF v_saldo_atual IS NULL THEN
    v_alertas := ARRAY_APPEND(v_alertas, 'Banco de horas não encontrado');
    RETURN QUERY SELECT FALSE, NULL::DECIMAL, NULL::UUID, v_alertas;
    RETURN;
  END IF;

  -- 2. Validar se há saldo suficiente
  IF v_saldo_atual < p_horas THEN
    v_alertas := ARRAY_APPEND(v_alertas, 'Saldo insuficiente: ' || v_saldo_atual::TEXT || ' (solicitado: ' || p_horas::TEXT || ')');
    RETURN QUERY SELECT FALSE, v_saldo_atual, NULL::UUID, v_alertas;
    RETURN;
  END IF;

  -- 3. Calcular novo saldo
  v_novo_saldo := v_saldo_atual - p_horas;

  -- 4. Criar movimentação
  INSERT INTO movimentacoes_banco_horas (
    empresa_id, user_id, banco_horas_id,
    tipo, descricao, data_movimentacao,
    horas, saldo_anterior, saldo_novo,
    usuario_origem_id, status
  ) VALUES (
    p_empresa_id, p_user_id, p_banco_horas_id,
    'debito_compensacao', p_motivo, CURRENT_DATE,
    -p_horas, v_saldo_atual, v_novo_saldo,
    p_usuario_operacao_id, 'aprovado'
  )
  RETURNING id INTO v_movimentacao_id;

  -- 5. Atualizar saldo no banco_horas (trigger automático)
  -- Já é feito pelo trigger tr_atualizar_saldo

  -- 6. Log de auditoria
  INSERT INTO auditoria_log (
    empresa_id, entidade, entidade_id, operacao, tipo_operacao,
    usuario_id, data_operacao,
    dados_anterior, dados_novo, status, mensagem_status
  ) VALUES (
    p_empresa_id, 'banco_horas', p_banco_horas_id, 'UPDATE', 'aplicarCompensacao',
    p_usuario_operacao_id, now(),
    jsonb_build_object('saldo_anterior', v_saldo_atual),
    jsonb_build_object('saldo_novo', v_novo_saldo, 'horas_compensadas', p_horas),
    'sucesso', 'Compensação aplicada'
  );

  v_alertas := ARRAY_APPEND(v_alertas, 'Compensação de ' || p_horas::TEXT || ' horas aplicada com sucesso');

  sucesso := TRUE;
  novo_saldo := v_novo_saldo;
  movimentacao_id := v_movimentacao_id;
  alertas := v_alertas;

  RETURN NEXT;

EXCEPTION WHEN OTHERS THEN
  v_alertas := ARRAY_APPEND(v_alertas, 'Erro ao aplicar compensação: ' || SQLERRM);
  RETURN QUERY SELECT FALSE, v_saldo_atual, NULL::UUID, v_alertas;
END;
$$ LANGUAGE plpgsql;

-- Função: listar_vencimentos_proximos
-- Busca bancos de horas que vencem em breve
CREATE OR REPLACE FUNCTION listar_vencimentos_proximos(
  p_empresa_id UUID,
  p_dias_limite SMALLINT DEFAULT 30
)
RETURNS TABLE (
  user_id UUID,
  user_nome VARCHAR,
  saldo_horas DECIMAL,
  data_vencimento DATE,
  dias_para_vencer INT,
  status VARCHAR
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    bh.user_id,
    p.full_name,
    bh.saldo_horas,
    bh.data_vencimento,
    EXTRACT(DAY FROM bh.data_vencimento - CURRENT_DATE)::INT,
    bh.status
  FROM banco_horas bh
  JOIN auth.users p ON bh.user_id = p.id
  WHERE bh.empresa_id = p_empresa_id
    AND bh.status IN ('ativo', 'parcialmente_compensado')
    AND EXTRACT(DAY FROM bh.data_vencimento - CURRENT_DATE) <= p_dias_limite
  ORDER BY bh.data_vencimento ASC;
END;
$$ LANGUAGE plpgsql STABLE;

-- Comentários
COMMENT ON FUNCTION calcular_saldo_banco IS 'Calcula saldo de banco de horas = extras - compensações, valida vencimento';
COMMENT ON FUNCTION aplicar_compensacao IS 'Aplica débito no banco de horas (compensação), cria movimentação e log auditoria';
COMMENT ON FUNCTION listar_vencimentos_proximos IS 'Lista bancos de horas que vencem em breve (aviso RH)';
