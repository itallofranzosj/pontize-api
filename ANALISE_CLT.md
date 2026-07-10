# 📋 Análise de Conformidade CLT - Pontize API

Data: 2026-07-10  
Versão: 1.0  
Status: ⚠️ INCOMPLETO - Faltam cálculos importantes

---

## 📊 O Que o Sistema Calcula HOJE

### ✅ Implementado

| Item | Implementação | Status |
|------|---------------|----|
| Marcações básicas | entrada, saída, saída_intervalo, volta_intervalo | ✅ OK |
| Horas por dia | 8h (entrada + saída) ou 4h (apenas uma) | ⚠️ SIMPLISTA |
| Comparecimento | Presença/Ausência por mês | ✅ OK |
| Intervalo | Registra `saida_intervalo` e `volta_intervalo` | ✅ PARCIAL |
| Período | Filtra por mês/ano | ✅ OK |

---

## 🚨 O QUE FALTA PARA COMPLIANCE COM CLT

### 1. ⚠️ CÁLCULO DE HORAS TRABALHADAS (CRÍTICO)

**Problema Atual:**
```typescript
// Código atual - INCORRETO para CLT
if (temEntrada && temSaida) {
  horasPorUsuario[userId] += 8;  // ❌ Assume sempre 8h
} else if (temEntrada || temSaida) {
  horasPorUsuario[userId] += 4;  // ❌ Muito simplista
}
```

**Obrigação CLT:**
- Calcular horas **reais** entre entrada e saída
- Descontar tempo de intervalo inteligentemente
- Detectar horas extras (acima de 8h/dia)
- Validar se intervalo foi respeitado

**Exemplo do problema:**
```
Entrada: 08:00
Saída: 12:30
Intervalo: 1h (12:30-13:30)
Volta: 13:30
Saída Final: 18:00

HOJE (Sistema):     8 horas  ❌
CORRETO (CLT):      8h 30m   ✅
  • Manhã: 08:00-12:30 = 4h 30m
  • Tarde: 13:30-18:00 = 4h 30m
  • Total: 9h (com 1h intervalo)
```

---

### 2. ⚠️ HORAS EXTRAS (NÃO IMPLEMENTADO)

**Obrigação CLT (Art. 59):**
- Horas extras devem ser pagas com **50% a 100%** de acréscimo
- Limite de 2h extras/dia
- Acordo ou convenção coletiva pode modificar

**Falta no Sistema:**
- Não calcula quando ultrapassa 8h/dia
- Não flagga horas extras
- Não diferencia adicional (50% vs 100%)
- Não rastreia acúmulo de extras

**Exemplo de relatório esperado:**
```json
{
  "dia": "2026-07-10",
  "horas_normais": 8,
  "horas_extras": 2,
  "adicional_noturno": false,
  "valor_hora_extra": "valor_base * 1.5",
  "status": "PRECISA APROVAÇÃO"
}
```

---

### 3. ⚠️ TRABALHO NOTURNO (NÃO IMPLEMENTADO)

**Obrigação CLT (Arts. 73-74):**
- Trabalho noturno (21:00-05:00) = **20% adicional mínimo**
- Hora noturna = 52.5 minutos (não 60 minutos!)
- Adicional cumulativo se tiver extras

**Falta no Sistema:**
- Não detecta se horário é noturno
- Não calcula hora reduzida (52.5min)
- Não adiciona 20% de adicional noturno

**Exemplo:**
```
Entrada: 22:00
Saída: 05:00 (dia seguinte)

HOJE:     7h ❌
CORRETO:  7h × (60/52.5) = 8h contabilizadas
ADICIONAL: +20% = valor_base * 1.2
```

---

### 4. ⚠️ INTERVALO INTELIGENTE (NÃO IMPLEMENTADO)

**Obrigação CLT (Art. 66):**
- Jornada ≤ 6h: intervalo mínimo 15 min
- Jornada > 6h: intervalo mínimo 1h
- Intervalo não é contabilizado como trabalho
- Desconto automático do intervalo

**Falta no Sistema:**
- Não valida se intervalo foi respeitado
- Não desconta intervalo automaticamente
- Não calcula se intervalo foi intrajornada vs de repouso
- Não alerta se intervalo < mínimo

**Exemplo:**
```
Entrada: 08:00
Saída intervalo: 11:45
Volta: 12:00
Saída: 18:00

Sistema de Intervalo CORRETO:
- Manhã: 08:00-11:45 = 3h 45m
- Intervalo: 11:45-12:00 = 15m (❌ ABAIXO DO MÍNIMO 1h)
- Tarde: 12:00-18:00 = 6h
- Total: 9h 45m
- ⚠️ ALERTA: Intervalo < 1 hora (jornada > 6h)
```

---

### 5. ⚠️ REPOUSO SEMANAL (NÃO IMPLEMENTADO)

**Obrigação CLT (Arts. 67-68):**
- Mínimo 1 dia de repouso/semana (preferencialmente domingo)
- Feriados = repouso remunerado
- Se trabalhar domingo → folga compensatória + 100% adicional

**Falta no Sistema:**
- Não identifica domingos/feriados
- Não valida repouso semanal mínimo
- Não calcula adicional de domingo/feriado

**Exemplo de validação:**
```
Semana:
Seg-Dom: trabalhado em todos os dias
⚠️ ALERTA: Faltou dia de repouso semanal
❌ Violação do Art. 67 CLT
```

---

### 6. ⚠️ MARCAÇÃO DE ENTRADA/SAÍDA (PARCIAL)

**Obrigação CLT (Art. 74):**
- Controle de ponto obrigatório
- Registro automático de entrada/saída
- Tolerância máxima: 5 minutos por marcação

**Sistema Hoje:**
- ✅ Registra entrada/saída
- ✅ Registra intervalo
- ❌ Não valida tolerância
- ❌ Não flagga marcações fora do horário padrão
- ❌ Não detecta falta de marcação

---

### 7. ⚠️ FALTAS E JUSTIFICATIVAS (NÃO IMPLEMENTADO)

**Obrigação CLT (Arts. 6-10):**
- Ausência sem marcação = falta
- Falta injustificada = descontos permitidos
- Falta justificada = sem desconto
- Atestado médico = 3 primeiros dias sem desconto

**Falta no Sistema:**
- Não detecta falta automática
- Não diferencia falta justificada vs injustificada
- Não aplica desconto de falta
- Não rastreia atestados

---

### 8. ⚠️ FÉRIAS (NÃO IMPLEMENTADO)

**Obrigação CLT (Arts. 129-153):**
- 30 dias de férias/ano (mínimo)
- Mínimo 10 dias consecutivos
- Impossibilidade de divisão sem acordo
- Pagamento em dobro se não gozo

**Falta no Sistema:**
- Não calcula direito a férias
- Não marca períodos de férias
- Não bloqueia marcações em férias
- Não previne acúmulo de férias

---

### 9. ⚠️ DÉCIMO TERCEIRO (NÃO IMPLEMENTADO)

**Obrigação CLT (Lei 4.090/62):**
- 1/12 do salário por mês trabalhado
- Proporcional se não completar mês

**Falta no Sistema:**
- Não calcula proporcional
- Não rastreia meses completos

---

### 10. ⚠️ BANCO DE HORAS (NÃO IMPLEMENTADO)

**Obrigação CLT (Art. 59):**
- Horas extras podem ser compensadas
- Prazo máximo de compensação: 120 dias
- Acordo escrito obrigatório

**Falta no Sistema:**
- Não registra banco de horas
- Não calcula compensação
- Não rastreia prazos

---

## 🔧 O QUE PRECISA SER IMPLEMENTADO

### PRIORIDADE ALTA (Obrigatório)

```
1. ✅ URGENTE: Cálculo Real de Horas
   - Calcular diferença entre entrada/saída
   - Descontar intervalo corretamente
   - Detectar se passou de 8h

2. ✅ URGENTE: Detecção de Horas Extras
   - Marcar horas acima de 8h/dia
   - Calcular percentual de acréscimo
   - Alertar gerente

3. ✅ URGENTE: Intervalo Inteligente
   - Validar mínimo de intervalo
   - Descontar automaticamente
   - Alertar se insuficiente

4. ✅ URGENTE: Repouso Semanal
   - Identificar domingos/feriados
   - Validar mínimo repouso/semana
   - Calcular adicional se trabalhar domingo
```

### PRIORIDADE MÉDIA (Importante)

```
5. Trabalho Noturno (20% adicional)
6. Faltas e Justificativas
7. Marcação de Entrada/Saída (validações)
8. Banco de Horas
```

### PRIORIDADE BAIXA (Complementar)

```
9. Férias
10. Décimo Terceiro
11. Adicional por risco
12. DSR (Descanso Semanal Remunerado)
```

---

## 📝 Schema de Banco Necessário

### Tabela: `marcacoes` (precisa expandir)

```sql
CREATE TABLE marcacoes (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES profiles(id),
  empresa_id UUID NOT NULL REFERENCES empresas(id),
  
  -- Registro de marcação
  tipo ENUM('entrada', 'saida', 'saida_intervalo', 'volta_intervalo'),
  marcada_em TIMESTAMP NOT NULL,
  tolerancia_aplicada BOOLEAN DEFAULT false,
  
  -- Justificativa (novo)
  justificativa TEXT,
  tipo_justificativa ENUM('atestado', 'falta_justificada', 'folga', null),
  
  -- Metadados
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),
  
  UNIQUE(user_id, marcada_em)
);
```

### Tabela: `dias_uteis` (nova)

```sql
CREATE TABLE dias_uteis (
  id UUID PRIMARY KEY,
  empresa_id UUID NOT NULL,
  data DATE NOT NULL,
  eh_feriad BOOLEAN DEFAULT false,
  tipo ENUM('feriad_nacional', 'feriad_estadual', 'feriad_municipal'),
  descricao TEXT,
  
  UNIQUE(empresa_id, data)
);
```

### Tabela: `horas_extras` (nova)

```sql
CREATE TABLE horas_extras (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  empresa_id UUID NOT NULL,
  data DATE NOT NULL,
  quantidade_horas DECIMAL(5,2),
  percentual_adicional INT DEFAULT 50, -- 50% ou 100%
  motivo TEXT,
  aprovado BOOLEAN DEFAULT false,
  data_compensacao DATE,
  
  UNIQUE(user_id, data)
);
```

### Tabela: `banco_horas` (nova)

```sql
CREATE TABLE banco_horas (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL,
  empresa_id UUID NOT NULL,
  horas_saldo DECIMAL(10,2),
  atualizado_em TIMESTAMP DEFAULT now()
);
```

---

## 🧮 Fórmulas CLT Necessárias

### 1. Horas Trabalhadas em um Dia

```
horas_trabalhadas = (saida - entrada) - tempo_intervalo

Exemplo:
entrada = 08:00
saida = 18:00
intervalo_saida = 12:00
intervalo_volta = 13:00

horas = (18:00 - 08:00) - (13:00 - 12:00)
horas = 10:00 - 01:00 = 9 horas
```

### 2. Horas Extras

```
IF horas_trabalhadas > 8:
  horas_extras = horas_trabalhadas - 8
  valor = horas_extras * valor_hora * percentual
  
  percentual = 50% (padrão) ou 100% (feriado/noturno/domiciliar)
ELSE:
  horas_extras = 0
```

### 3. Adicional Noturno (20%)

```
IF existe marcação entre 21:00-05:00:
  horas_noturnas = quantidade_horas_noturnas
  valor_horas_noturnas = horas_noturnas * (60/52.5) * valor_hora * 1.2
```

### 4. Repouso Semanal

```
repouso_respeitado = (data.day_of_week == domingo) OR
                     (colaborador_tinha_folga_semana_anterior)
```

### 5. Intervalo Validação

```
IF jornada <= 6h:
  intervalo_minimo = 15 minutos
ELSE:
  intervalo_minimo = 60 minutos

alerta = intervalo_real < intervalo_minimo
```

---

## 📋 Checklist de Implementação

### Fase 1: Cálculo Correto de Horas (2-3 dias)
- [ ] Criar função `calcularHorasDia(entrada, saida, intervalos)`
- [ ] Criar função `detectarHorasExtras(horas_dia)`
- [ ] Criar função `validarIntervalo(intervalo_tempo, jornada)`
- [ ] Adicionar alertas no relatório
- [ ] Adicionar testes

### Fase 2: Dados de Suporte (1-2 dias)
- [ ] Criar tabela `dias_uteis` (feriados)
- [ ] Popular feriados 2024-2027
- [ ] Criar tabela `horas_extras`
- [ ] Criar tabela `banco_horas`

### Fase 3: Novos Endpoints (2-3 dias)
- [ ] GET `/v1/relatorios/horas-extra` - Extras por período
- [ ] GET `/v1/relatorios/repouso-semanal` - Validação
- [ ] GET `/v1/relatorios/trabalho-noturno` - Noturno
- [ ] POST `/v1/horas-extras/:id/aprovar` - Aprovação

### Fase 4: Validações & Alertas (1-2 dias)
- [ ] Middleware de validação CLT
- [ ] Sistema de alertas
- [ ] Relatório de conformidade
- [ ] Testes completos

---

## 🔍 Conclusão

**Status:** ⚠️ **INCOMPLETO PARA CLT**

O sistema cobre:
- ✅ Registro básico de marcações
- ✅ Comparecimento simples
- ✅ Intervalo (parcial)

Mas **NÃO** cobre:
- ❌ Cálculo real de horas
- ❌ Horas extras
- ❌ Trabalho noturno
- ❌ Repouso semanal
- ❌ Faltas
- ❌ Férias
- ❌ Décimo terceiro
- ❌ Banco de horas

**Recomendação:** Implementar Fase 1 e 2 antes de colocar em produção, pois há **risco legal significativo**.

---

## 📞 Próximas Ações

1. Definir com RH/legal quais requisitos são prioritários
2. Expandir schema do banco de dados
3. Implementar funções de cálculo correto
4. Adicionar testes CLT-específicos
5. Documentar interpretação da lei (por empresa/convenção)

