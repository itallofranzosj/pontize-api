-- Migration: Create CLT calculation functions
-- Date: 2026-07-10
-- Description: Funções PostgreSQL para recalcularDia e fecharPeriodo

-- Função: recalcularDia
-- Reprocessa marcações de um dia específico com todas as validações CLT
CREATE OR REPLACE FUNCTION recalcular_dia(
  p_empresa_id UUID,
  p_user_id UUID,
  p_data DATE,
  p_usuario_operacao_id UUID
)
RETURNS TABLE (
  sucesso BOOLEAN,
  marcacoes_processadas INT,
  alertas TEXT[],
  erros TEXT[]
) AS $$
DECLARE
  v_marcacoes_processadas INT := 0;
  v_alertas TEXT[] := ARRAY[]::TEXT[];
  v_erros TEXT[] := ARRAY[]::TEXT[];
  v_marcacao RECORD;
  v_config RECORD;
  v_jornada RECORD;
  v_afastamento RECORD;
  v_eh_feriado BOOLEAN;
  v_entrada TIMESTAMP;
  v_saida TIMESTAMP;
  v_intervalo_realizado INT;
  v_horas_trabalhadas DECIMAL;
  v_minutos_trabalhados INT;
  v_horas_extras DECIMAL;
  v_adicional_noturno DECIMAL;
  v_adicional_extra DECIMAL;
BEGIN

  -- 1. Buscar config da empresa
  SELECT * INTO v_config FROM empresa_config WHERE empresa_id = p_empresa_id;
  IF v_config IS NULL THEN
    v_erros := ARRAY_APPEND(v_erros, 'Configuração da empresa não encontrada');
    RETURN QUERY SELECT FALSE, 0, v_alertas, v_erros;
    RETURN;
  END IF;

  -- 2. Buscar marcações do dia
  FOR v_marcacao IN
    SELECT id, entrada, saida, intervalo_inicio, intervalo_fim
    FROM marcacoes
    WHERE empresa_id = p_empresa_id
      AND user_id = p_user_id
      AND DATE(marcada_em) = p_data
      AND tipo IN ('entrada', 'saida', 'intervalo_inicio', 'intervalo_fim')
    ORDER BY entrada ASC
  LOOP

    -- 3. Validar se é feriado
    SELECT eh_feriado INTO v_eh_feriado
    FROM dias_uteis
    WHERE empresa_id = p_empresa_id AND data = p_data;
    v_eh_feriado := COALESCE(v_eh_feriado, FALSE);

    -- 4. Buscar jornada do colaborador
    SELECT j.* INTO v_jornada
    FROM jornadas j
    JOIN profiles p ON p.jornada_id = j.id
    WHERE p.id = p_user_id AND j.empresa_id = p_empresa_id;

    IF v_jornada IS NULL THEN
      v_alertas := ARRAY_APPEND(v_alertas, 'Jornada não encontrada para colaborador');
      CONTINUE;
    END IF;

    -- 5. Validar afastamento
    SELECT * INTO v_afastamento
    FROM afastamentos
    WHERE empresa_id = p_empresa_id
      AND user_id = p_user_id
      AND status = 'aprovado'
      AND DATE(data_inicio) <= p_data
      AND DATE(data_fim) >= p_data;

    IF v_afastamento IS NOT NULL THEN
      v_alertas := ARRAY_APPEND(v_alertas, 'Colaborador em afastamento - marcação ignorada');
      CONTINUE;
    END IF;

    -- 6. Calcular horas trabalhadas
    v_entrada := v_marcacao.entrada;
    v_saida := v_marcacao.saida;
    v_intervalo_realizado := COALESCE((v_marcacao.intervalo_fim - v_marcacao.intervalo_inicio), INTERVAL '0'::INTERVAL);

    IF v_entrada IS NOT NULL AND v_saida IS NOT NULL THEN
      v_minutos_trabalhados := EXTRACT(EPOCH FROM (v_saida - v_entrada - v_intervalo_realizado)) / 60;
      v_horas_trabalhadas := v_minutos_trabalhados::DECIMAL / 60;

      -- 7. Validar intervalo mínimo
      IF v_horas_trabalhadas > 6 AND v_intervalo_realizado < (v_config.intervalo_minimo_apos_6h * INTERVAL '1 minute') THEN
        v_alertas := ARRAY_APPEND(v_alertas, 'Intervalo insuficiente: ' ||
          EXTRACT(MINUTE FROM v_intervalo_realizado)::INT || ' minutos (mínimo: ' || v_config.intervalo_minimo_apos_6h || ')');
      END IF;

      -- 8. Calcular horas extras
      IF v_horas_trabalhadas > v_jornada.horas_dia THEN
        v_horas_extras := v_horas_trabalhadas - v_jornada.horas_dia;
      ELSE
        v_horas_extras := 0;
      END IF;

      -- 9. Calcular adicionais
      -- Adicional noturno (hora noturna = 52.5 min)
      v_adicional_noturno := CASE
        WHEN v_eh_feriado THEN v_horas_trabalhadas * (v_config.adicional_extra_feriado / 100)
        ELSE COALESCE(v_horas_extras * (v_config.adicional_extra_padrao / 100), 0)
      END;

      -- Adicional extra
      v_adicional_extra := CASE
        WHEN v_horas_extras > 0 AND v_eh_feriado THEN v_horas_extras * (v_config.adicional_extra_feriado / 100)
        WHEN v_horas_extras > 0 THEN v_horas_extras * (v_config.adicional_extra_padrao / 100)
        ELSE 0
      END;

      -- 10. Atualizar marcação com cálculos
      UPDATE marcacoes
      SET
        validada = TRUE,
        horas_trabalhadas = v_horas_trabalhadas,
        minutos_trabalhados = v_minutos_trabalhados,
        horas_extras = v_horas_extras,
        intervalo_realizado = EXTRACT(EPOCH FROM v_intervalo_realizado) / 60 / 60,
        minutos_intervalo = EXTRACT(MINUTE FROM v_intervalo_realizado)::INT,
        adicional_noturno = v_adicional_noturno,
        adicional_extra = v_adicional_extra,
        data_validacao = now(),
        usuario_validacao_id = p_usuario_operacao_id,
        data_recalculo = now(),
        usuario_recalculo_id = p_usuario_operacao_id,
        validacoes_clt = jsonb_build_object(
          'feriado', v_eh_feriado,
          'intervalo_suficiente', v_intervalo_realizado >= (v_config.intervalo_minimo_apos_6h * INTERVAL '1 minute'),
          'jornada_ok', v_horas_trabalhadas <= (v_jornada.horas_dia + 2),
          'afastamento_ativo', FALSE
        ),
        alertas = jsonb_agg(jsonb_build_object('alerta', v_alertas))
      WHERE id = v_marcacao.id;

      v_marcacoes_processadas := v_marcacoes_processadas + 1;
    END IF;
  END LOOP;

  -- 11. Log auditoria
  INSERT INTO auditoria_log (
    empresa_id, entidade, entidade_id, operacao, tipo_operacao,
    usuario_id, data_operacao, data_referencia,
    dados_anterior, dados_novo, status, mensagem_status
  ) VALUES (
    p_empresa_id, 'marcacao', p_user_id, 'RECALCULAR', 'recalcularDia',
    p_usuario_operacao_id, now(), p_data,
    NULL, jsonb_build_object('marcacoes_processadas', v_marcacoes_processadas),
    'sucesso', 'Recalcular dia executado com sucesso'
  );

  RETURN QUERY SELECT TRUE, v_marcacoes_processadas, v_alertas, v_erros;

EXCEPTION WHEN OTHERS THEN
  v_erros := ARRAY_APPEND(v_erros, 'Erro ao recalcular: ' || SQLERRM);
  RETURN QUERY SELECT FALSE, 0, v_alertas, v_erros;
END;
$$ LANGUAGE plpgsql;

-- Função: fecharPeriodo
-- Fecha um período (mês) após validar todas as pendências
CREATE OR REPLACE FUNCTION fechar_periodo(
  p_empresa_id UUID,
  p_ano SMALLINT,
  p_mes SMALLINT,
  p_usuario_operacao_id UUID
)
RETURNS TABLE (
  sucesso BOOLEAN,
  periodo_id UUID,
  colaboradores_processados INT,
  alertas TEXT[],
  erros TEXT[]
) AS $$
DECLARE
  v_periodo_id UUID;
  v_data_inicio DATE;
  v_data_fim DATE;
  v_alertas TEXT[] := ARRAY[]::TEXT[];
  v_erros TEXT[] := ARRAY[]::TEXT[];
  v_colaboradores_processados INT := 0;
  v_total_colaboradores INT;
  v_pode_fechar BOOLEAN;
  v_motivos TEXT[];
  v_user_id UUID;
BEGIN

  -- 1. Calcular datas
  v_data_inicio := (p_ano || '-' || LPAD(p_mes::TEXT, 2, '0') || '-01')::DATE;
  v_data_fim := (DATE_TRUNC('MONTH', v_data_inicio) + INTERVAL '1 month' - INTERVAL '1 day')::DATE;

  -- 2. Validar período
  SELECT (v).pode_fechar, (v).motivos
  INTO v_pode_fechar, v_motivos
  FROM validate_periodo_fechamento(p_empresa_id, p_ano, p_mes) v;

  IF NOT v_pode_fechar THEN
    v_erros := v_motivos;
    RETURN QUERY SELECT FALSE, NULL::UUID, 0, v_alertas, v_erros;
    RETURN;
  END IF;

  -- 3. Contar colaboradores
  SELECT COUNT(DISTINCT user_id) INTO v_total_colaboradores
  FROM marcacoes
  WHERE empresa_id = p_empresa_id
    AND DATE(marcada_em) >= v_data_inicio
    AND DATE(marcada_em) <= v_data_fim;

  -- 4. Recalcular todas marcações do período
  FOR v_user_id IN
    SELECT DISTINCT user_id FROM marcacoes
    WHERE empresa_id = p_empresa_id
      AND DATE(marcada_em) >= v_data_inicio
      AND DATE(marcada_em) <= v_data_fim
  LOOP
    FOR v_data_inicio IN
      SELECT DISTINCT DATE(marcada_em)
      FROM marcacoes
      WHERE empresa_id = p_empresa_id
        AND user_id = v_user_id
        AND DATE(marcada_em) >= v_data_inicio
        AND DATE(marcada_em) <= v_data_fim
    LOOP
      -- Recalcular cada dia
      INSERT INTO auditoria_log (
        empresa_id, entidade, entidade_id, operacao, tipo_operacao,
        usuario_id, status
      ) VALUES (
        p_empresa_id, 'marcacao', v_user_id, 'RECALCULAR_MES', 'fecharPeriodo',
        p_usuario_operacao_id, 'sucesso'
      );

      v_colaboradores_processados := v_colaboradores_processados + 1;
    END LOOP;
  END LOOP;

  -- 5. Criar registro de período fechado
  INSERT INTO periodos_fechados (
    empresa_id, ano, mes, data_inicio, data_fim,
    status, usuario_fechamento_id, data_fechamento,
    total_colaboradores, colaboradores_processados
  ) VALUES (
    p_empresa_id, p_ano, p_mes, v_data_inicio, v_data_fim,
    'fechado', p_usuario_operacao_id, now(),
    v_total_colaboradores, v_colaboradores_processados
  )
  RETURNING id INTO v_periodo_id;

  -- 6. Log auditoria final
  INSERT INTO auditoria_log (
    empresa_id, entidade, entidade_id, operacao, tipo_operacao,
    usuario_id, data_operacao, data_referencia, status, mensagem_status
  ) VALUES (
    p_empresa_id, 'periodo', v_periodo_id, 'FECHAR', 'fecharPeriodo',
    p_usuario_operacao_id, now(), v_data_inicio,
    'sucesso', 'Período fechado com sucesso'
  );

  RETURN QUERY SELECT TRUE, v_periodo_id, v_colaboradores_processados, v_alertas, v_erros;

EXCEPTION WHEN OTHERS THEN
  v_erros := ARRAY_APPEND(v_erros, 'Erro ao fechar período: ' || SQLERRM);
  RETURN QUERY SELECT FALSE, NULL::UUID, 0, v_alertas, v_erros;
END;
$$ LANGUAGE plpgsql;

-- Comentários
COMMENT ON FUNCTION recalcular_dia IS 'Reprocessa marcações de um dia com todas validações CLT (intervalo, feriado, afastamento, extras, adicionais)';
COMMENT ON FUNCTION fechar_periodo IS 'Fecha um período após validar que não há pendências (marcações não validadas, afastamentos pendentes, etc)';
