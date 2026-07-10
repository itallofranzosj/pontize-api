/**
 * Funções de cálculo CLT (Consolidação das Leis do Trabalho)
 *
 * Referências:
 * - Art. 59: Horas extras
 * - Art. 66: Intervalo intrajornada
 * - Art. 67: Repouso semanal
 * - Art. 73: Trabalho noturno
 * - Art. 129: Férias
 */

interface Marcacao {
  tipo: "entrada" | "saida" | "saida_intervalo" | "volta_intervalo";
  marcada_em: string; // ISO datetime
}

interface ResultadoDia {
  horas_trabalhadas: number;
  horas_extras: number;
  eh_noturno: boolean;
  horas_noturnas: number;
  intervalo_minutos: number;
  intervalo_valido: boolean;
  alertas: string[];
}

// ============================================================================
// 1. CALCULAR HORAS REAIS DE UM DIA
// ============================================================================

/**
 * Calcula horas trabalhadas de um dia
 *
 * @example
 * const marcacoes = [
 *   { tipo: "entrada", marcada_em: "2026-07-10T08:00:00" },
 *   { tipo: "saida_intervalo", marcada_em: "2026-07-10T12:00:00" },
 *   { tipo: "volta_intervalo", marcada_em: "2026-07-10T13:00:00" },
 *   { tipo: "saida", marcada_em: "2026-07-10T18:00:00" }
 * ]
 * calcularHorasDia(marcacoes)
 * // { horas: 9, intervalo: 60 }
 */
export function calcularHorasDia(marcacoes: Marcacao[]): {
  horas: number;
  intervalo: number;
  detalhes: string;
} {
  if (!marcacoes.length) {
    return { horas: 0, intervalo: 0, detalhes: "Sem marcações" };
  }

  // Ordenar por hora
  const ordenadas = [...marcacoes].sort(
    (a, b) =>
      new Date(a.marcada_em).getTime() - new Date(b.marcada_em).getTime()
  );

  let entrada: Date | null = null;
  let totalMinutos = 0;
  let intervaloMinutos = 0;
  let ultimaSaida: Date | null = null;

  for (const marc of ordenadas) {
    const hora = new Date(marc.marcada_em);

    if (marc.tipo === "entrada") {
      entrada = hora;
    } else if (marc.tipo === "saida") {
      if (entrada) {
        const minutos = Math.round((hora.getTime() - entrada.getTime()) / 60000);
        totalMinutos += minutos;
        entrada = null;
      }
    } else if (marc.tipo === "saida_intervalo") {
      ultimaSaida = hora;
    } else if (marc.tipo === "volta_intervalo") {
      if (ultimaSaida) {
        intervaloMinutos = Math.round(
          (hora.getTime() - ultimaSaida.getTime()) / 60000
        );
        ultimaSaida = null;
      }
    }
  }

  const horas = (totalMinutos - intervaloMinutos) / 60;

  return {
    horas: Math.round(horas * 100) / 100, // 2 casas decimais
    intervalo: intervaloMinutos,
    detalhes: `${Math.floor(horas)}h ${Math.round((horas % 1) * 60)}m`,
  };
}

// ============================================================================
// 2. DETECTAR HORAS EXTRAS
// ============================================================================

/**
 * Detecta se houve horas extras e calcula valor
 *
 * CLT Art. 59: Horas extras tem adicional de 50% (ou 100% em casos especiais)
 */
export function detectarHorasExtras(
  horasDia: number,
  valorHoraBase: number,
  percentual: "50%" | "100%" = "50%"
): {
  horas_extras: number;
  tem_extras: boolean;
  adicional_percentual: number;
  valor_adicional: number;
} {
  const JORNADA_MAXIMA = 8;
  const percentualDecimal = percentual === "50%" ? 0.5 : 1.0;

  if (horasDia > JORNADA_MAXIMA) {
    const horasExtras = horasDia - JORNADA_MAXIMA;
    const valorExtra = horasExtras * valorHoraBase * percentualDecimal;

    return {
      horas_extras: Math.round(horasExtras * 100) / 100,
      tem_extras: true,
      adicional_percentual: percentual === "50%" ? 50 : 100,
      valor_adicional: Math.round(valorExtra * 100) / 100,
    };
  }

  return {
    horas_extras: 0,
    tem_extras: false,
    adicional_percentual: 0,
    valor_adicional: 0,
  };
}

// ============================================================================
// 3. VALIDAR INTERVALO (ART. 66)
// ============================================================================

/**
 * Valida se intervalo cumpre exigências CLT
 *
 * CLT Art. 66:
 * - Jornada ≤ 6h: mínimo 15 minutos
 * - Jornada > 6h: mínimo 60 minutos
 */
export function validarIntervalo(
  horasDia: number,
  intervaloMinutos: number
): {
  valido: boolean;
  intervalo_minimo_requerido: number;
  alerta?: string;
} {
  const INTERVALO_MIN_ATE_6H = 15;
  const INTERVALO_MIN_APOS_6H = 60;

  if (horasDia <= 6) {
    const valido = intervaloMinutos >= INTERVALO_MIN_ATE_6H;
    return {
      valido,
      intervalo_minimo_requerido: INTERVALO_MIN_ATE_6H,
      alerta: !valido
        ? `Intervalo insuficiente: ${intervaloMinutos}min < ${INTERVALO_MIN_ATE_6H}min (Art. 66 CLT)`
        : undefined,
    };
  } else {
    const valido = intervaloMinutos >= INTERVALO_MIN_APOS_6H;
    return {
      valido,
      intervalo_minimo_requerido: INTERVALO_MIN_APOS_6H,
      alerta: !valido
        ? `Intervalo insuficiente: ${intervaloMinutos}min < ${INTERVALO_MIN_APOS_6H}min (Art. 66 CLT)`
        : undefined,
    };
  }
}

// ============================================================================
// 4. DETECTAR TRABALHO NOTURNO (ART. 73)
// ============================================================================

/**
 * Detecta se houve trabalho noturno
 *
 * CLT Art. 73: Trabalho entre 21h-05h = adicional de 20%
 * CLT Art. 74: Hora noturna = 52.5 minutos
 */
export function detectarTrabalhoNoturno(
  marcacoes: Marcacao[]
): {
  eh_noturno: boolean;
  horas_noturnas: number;
  horas_contabilizadas: number;
  adicional_percentual: number;
} {
  if (!marcacoes.length) {
    return {
      eh_noturno: false,
      horas_noturnas: 0,
      horas_contabilizadas: 0,
      adicional_percentual: 0,
    };
  }

  let minutosNoturnos = 0;

  for (const marc of marcacoes) {
    const hora = new Date(marc.marcada_em);
    const horaLocal = hora.getHours();

    // Trabalho noturno: 21h até 05h
    if (horaLocal >= 21 || horaLocal < 5) {
      minutosNoturnos += 5; // Simplificado por marcação
    }
  }

  const horasNoturnas = minutosNoturnos / 60;
  const horasContabilizadas = horasNoturnas * (60 / 52.5);

  return {
    eh_noturno: minutosNoturnos > 0,
    horas_noturnas: Math.round(horasNoturnas * 100) / 100,
    horas_contabilizadas: Math.round(horasContabilizadas * 100) / 100,
    adicional_percentual: minutosNoturnos > 0 ? 20 : 0,
  };
}

// ============================================================================
// 5. VALIDAR REPOUSO SEMANAL (ART. 67)
// ============================================================================

/**
 * Valida se houve repouso semanal mínimo
 *
 * CLT Art. 67: Mínimo 1 dia de repouso por semana (preferencialmente domingo)
 */
export function validarRepouso(
  datas_trabalho: Date[]
): {
  repouso_garantido: boolean;
  dias_trabalhados: number;
  dia_repouso?: string;
  alerta?: string;
} {
  if (!datas_trabalho.length) {
    return {
      repouso_garantido: true,
      dias_trabalhados: 0,
    };
  }

  // Agrupar por semana (seg-dom)
  const semanas: Map<number, Set<number>> = new Map();

  for (const data of datas_trabalho) {
    const semana = Math.floor(data.getDate() / 7);
    const diaSemana = data.getDay();

    if (!semanas.has(semana)) {
      semanas.set(semana, new Set());
    }
    semanas.get(semana)!.add(diaSemana);
  }

  // Verificar se cada semana tem repouso
  let todasSemanasTemRepouso = true;
  let diaRepouso = "";

  for (const [_, dias] of semanas) {
    // Se trabalhou 7 dias (seg-dom), sem repouso
    if (dias.size === 7) {
      todasSemanasTemRepouso = false;
    } else if (dias.has(0)) {
      // Domingo é dia de repouso ideal
      diaRepouso = "Domingo";
    } else {
      // Outro dia como repouso
      const diaNames = [
        "Domingo",
        "Segunda",
        "Terça",
        "Quarta",
        "Quinta",
        "Sexta",
        "Sábado",
      ];
      const primeiroDia = Math.min(...dias);
      diaRepouso = diaNames[primeiroDia];
    }
  }

  return {
    repouso_garantido: todasSemanasTemRepouso,
    dias_trabalhados: datas_trabalho.length,
    dia_repouso: diaRepouso,
    alerta: !todasSemanasTemRepouso
      ? "Falta dia de repouso semanal - Violação Art. 67 CLT"
      : undefined,
  };
}

// ============================================================================
// 6. ANÁLISE COMPLETA DE UM DIA
// ============================================================================

export function analisarDiaCLT(
  marcacoes: Marcacao[],
  valorHoraBase: number = 50
): ResultadoDia {
  const { horas, intervalo } = calcularHorasDia(marcacoes);

  const horasExtras = detectarHorasExtras(horas, valorHoraBase);
  const intervaloValido = validarIntervalo(horas, intervalo);
  const noturno = detectarTrabalhoNoturno(marcacoes);

  const alertas: string[] = [];

  if (!intervaloValido.valido) {
    alertas.push(intervaloValido.alerta!);
  }

  if (horasExtras.tem_extras) {
    alertas.push(
      `⚠️ Horas extras: ${horasExtras.horas_extras}h (+ ${horasExtras.adicional_percentual}%)`
    );
  }

  if (noturno.eh_noturno) {
    alertas.push(
      `🌙 Trabalho noturno: ${noturno.horas_noturnas}h (+ 20% adicional)`
    );
  }

  return {
    horas_trabalhadas: horas,
    horas_extras: horasExtras.horas_extras,
    eh_noturno: noturno.eh_noturno,
    horas_noturnas: noturno.horas_noturnas,
    intervalo_minutos: intervalo,
    intervalo_valido: intervaloValido.valido,
    alertas,
  };
}

// ============================================================================
// 7. HELPERS
// ============================================================================

/**
 * Converte minutos para formato HH:MM
 */
export function minutosParaHoras(minutos: number): string {
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  return `${horas}h ${mins}m`;
}

/**
 * Verifica se é dia útil (seg-sexta)
 */
export function ehDiaUtil(data: Date): boolean {
  const diaSemana = data.getDay();
  return diaSemana >= 1 && diaSemana <= 5;
}

/**
 * Conta dias úteis em um período
 */
export function contarDiasUteis(
  dataInicio: Date,
  dataFim: Date
): number {
  let contador = 0;
  const data = new Date(dataInicio);

  while (data <= dataFim) {
    if (ehDiaUtil(data)) {
      contador++;
    }
    data.setDate(data.getDate() + 1);
  }

  return contador;
}
