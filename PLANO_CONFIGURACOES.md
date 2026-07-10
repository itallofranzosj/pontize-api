# 🏗️ PLANO ARQUITETURAL - Sistema Configurável de Cálculos CLT

**Data:** 2026-07-10  
**Status:** 📋 PLANEJAMENTO (SEM ALTERAÇÕES)  
**Impacto:** Alto - Modificações estruturais significativas

---

## 📊 SITUAÇÃO ATUAL

### ✅ O Que Já Existe
- ✅ Registro de marcações (entrada/saída/intervalo)
- ✅ Funções CLT implementadas (`src/utils/calculo-clt.ts`)
- ✅ Multi-tenant por empresa
- ✅ Estrutura de banco básica

### ❌ O Que NÃO Existe
- ❌ Tabela de configurações de empresa
- ❌ Tabela de jornadas/horários de trabalho
- ❌ Tabela de turnos
- ❌ Tabela de feriados
- ❌ Tabela de intervalos configuráveis
- ❌ Integração das funções CLT nos relatórios
- ❌ Rota de edição de configurações
- ❌ Sistema de tolerância
- ❌ Sistema de faltas/justificativas

### ⚠️ Problema Principal
As funções CLT estão **implementadas mas NÃO USADAS** - Relatórios ainda usam cálculo SIMPLISTA

---

## 🎯 VISÃO ARQUITETURAL

```
┌─────────────────────────────────────────────────────────────┐
│              APP DO TRABALHADOR (Mobile/Web)                │
│  POST /v1/marcacoes → {entrada, saida, intervalo, etc}     │
└────────────────┬────────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────────┐
│       SUPABASE: Tabela MARCACOES (raw data)                 │
│  - entrada/saida/intervalo com timestamp                    │
└────────────────┬────────────────────────────────────────────┘
                 │
        ┌────────┴───────────────────────────────┐
        │                                        │
        ▼                                        ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│  TABELAS DE CONFIGURAÇÃO    │    │  Relatórios (Cálculos)      │
│  (POR EMPRESA)              │    │  GET /v1/relatorios/*       │
│                             │    │                             │
│  • empresa_config          │    │  Usa funções CLT:          │
│  • jornadas                │    │  - calcularHorasDia()      │
│  • horarios_trabalho       │    │  - detectarHorasExtras()   │
│  • turnos                  │    │  - validarIntervalo()      │
│  • dias_uteis (feriados)   │    │  - validarRepouso()        │
│  • perfis_jornada          │    │  - detectarTrabalhoNoturno()│
│                             │    │                             │
│  (Novos - Tabelas 1-6)      │    │  Retorna dados CLT-completos│
└──────────────────────────────┘    └──────────────────────────────┘
```

---

## 🗂️ TABELAS A CRIAR (6 novas tabelas)

### **TABELA 1: empresa_config**

```sql
CREATE TABLE empresa_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  
  -- Jornada padrão
  jornada_padrao_horas DECIMAL(4,2) DEFAULT 8.00,    -- Horas/dia padrão
  jornada_padrao_minutos INT DEFAULT 480,             -- Minutos/dia
  
  -- Intervalo intrajornada
  intervalo_minimo_ate_6h INT DEFAULT 15,             -- Minutos
  intervalo_minimo_apos_6h INT DEFAULT 60,            -- Minutos
  intervalo_remunerado BOOLEAN DEFAULT false,         -- Se é pago
  
  -- Trabalho noturno (Art. 73-74)
  horario_noturno_inicio INT DEFAULT 21,              -- 21:00
  horario_noturno_fim INT DEFAULT 5,                  -- 05:00
  adicional_noturno_percentual INT DEFAULT 20,        -- 20%
  hora_noturna_minutos DECIMAL(4,2) DEFAULT 52.5,     -- Reduzida
  
  -- Horas extras (Art. 59)
  adicional_extra_padrao INT DEFAULT 50,              -- 50%
  adicional_extra_feriado INT DEFAULT 100,            -- 100%
  horas_extra_limite_dia INT DEFAULT 2,               -- Máximo 2h/dia
  
  -- Tolerância de marcação
  tolerancia_minutos INT DEFAULT 5,                   -- 5 min
  aplicar_tolerancia BOOLEAN DEFAULT true,
  
  -- Feriado trabalhado
  feriado_adicional_percentual INT DEFAULT 100,       -- 100%
  
  -- Descanso semanal
  dia_repouso_preferencial INT DEFAULT 0,             -- 0=domingo, 1-6
  exigir_repouso_semanal BOOLEAN DEFAULT true,
  
  -- Configurações gerais
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now()
);

CREATE UNIQUE INDEX idx_empresa_config ON empresa_config(empresa_id);
```

**Pergunta ao usuário:**
- Estas constantes são universais ou variam por empresa?
- Precisa suportar múltiplas convenções coletivas?

---

### **TABELA 2: jornadas**

```sql
CREATE TABLE jornadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES auth.users(id),
  
  nome TEXT NOT NULL,                    -- "Jornada 8h", "Turno Noturno"
  codigo TEXT NOT NULL,
  
  horas_dia DECIMAL(4,2) DEFAULT 8.00,  -- 8h, 6h, 12h, etc
  minutos_dia INT,
  
  -- Dias de aplicação
  dias_semana JSONB DEFAULT '{"seg":true, "ter":true, ...}',  -- Quais dias
  
  -- Características
  permite_intervalo BOOLEAN DEFAULT true,
  intervalo_minutos INT,
  
  -- Horários (base)
  horario_inicio_padrao TIME,             -- 08:00
  horario_fim_padrao TIME,                -- 17:00
  
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),
  
  CONSTRAINT unique_empresa_jornada UNIQUE(empresa_id, codigo)
);
```

**Pergunta ao usuário:**
- O sistema precisa suportar jornadas por cargo/setor?
- Ou jornada é universal por empresa?

---

### **TABELA 3: horarios_trabalho**

```sql
CREATE TABLE horarios_trabalho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES auth.users(id),
  jornada_id UUID NOT NULL REFERENCES jornadas(id),
  
  -- Classificação
  nome TEXT,                              -- "Manhã", "Tarde", "Noturno"
  tipo ENUM ('normal', 'noturno', 'extra', 'flexible') DEFAULT 'normal',
  
  -- Horários
  horario_entrada TIME NOT NULL,          -- 08:00
  horario_saida TIME NOT NULL,            -- 12:00
  
  -- Intervalo dentro deste horário
  intervalo_inicio TIME,                  -- 11:45
  intervalo_duracao_minutos INT,          -- 15 minutos
  
  -- Características
  eh_obrigatorio BOOLEAN DEFAULT true,
  usa_ponto_biometrico BOOLEAN DEFAULT false,
  
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT now(),
  
  CONSTRAINT check_horarios CHECK (horario_entrada < horario_saida)
);
```

**Relacionamento:**
```
jornadas (pode ter múltiplos horarios_trabalho)
  1 ---> N horarios_trabalho
  
Exemplo: Jornada 8h
  - Turno 1: 08:00-12:00 (4h) → intervalo 30min → 12:30-16:30 (4h)
  - Turno 2: 08:00-12:00 (4h) → intervalo 60min → 13:00-17:00 (4h)
```

---

### **TABELA 4: turnos**

```sql
CREATE TABLE turnos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES auth.users(id),
  
  nome TEXT NOT NULL,                    -- "Turno 1", "Turno Noturno"
  codigo TEXT NOT NULL,
  
  -- Qual jornada/horário este turno segue
  jornada_id UUID NOT NULL REFERENCES jornadas(id),
  
  -- Colaboradores neste turno
  -- (link via profiles.turno_id)
  
  -- Configuração
  repeticao_padrao TEXT DEFAULT 'diaria',  -- diaria, segunda-sexta, customizado
  dias_atuacao JSONB,                      -- {"seg":true, "ter":true, ...}
  
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT now(),
  
  CONSTRAINT unique_empresa_turno UNIQUE(empresa_id, codigo)
);

-- Adicionar coluna em profiles:
-- ALTER TABLE profiles ADD COLUMN turno_id UUID REFERENCES turnos(id);
```

---

### **TABELA 5: dias_uteis** (Feriados/Feriados)

```sql
CREATE TABLE dias_uteis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES auth.users(id),
  
  data DATE NOT NULL,
  eh_feriado BOOLEAN DEFAULT false,
  tipo ENUM ('feriad_nacional', 'feriad_estadual', 'feriad_municipal', 'ponte', 'outro') DEFAULT 'outro',
  
  descricao TEXT,                        -- "Independência do Brasil"
  
  -- Se trabalhado neste dia:
  obrigatorio_folga_compensatoria BOOLEAN DEFAULT true,
  adicional_percentual INT DEFAULT 100,   -- 100% (duplicado)
  
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT now(),
  
  CONSTRAINT unique_empresa_data UNIQUE(empresa_id, data)
);

-- Pré-populado com feriados nacionais:
-- 01-01 (Ano Novo)
-- 21-04 (Tiradentes)
-- 01-05 (Dia do Trabalho)
-- 07-09 (Independência)
-- 12-10 (Nossa Senhora Aparecida)
-- 02-11 (Finados)
-- 15-11 (Proclamação da República)
-- 20-11 (Consciência Negra)
-- 25-12 (Natal)
-- Páscoa (dinâmica)
-- Corpus Christi (dinâmica)
```

---

### **TABELA 6: perfis_jornada** (Mapeamento Cargo→Jornada)

```sql
CREATE TABLE perfis_jornada (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Quem se aplica
  cargo TEXT,                            -- "Gerente", "Assistente", etc
  setor_id UUID REFERENCES setores(id),  -- Opcional: por setor específico
  
  -- Qual jornada/turno
  jornada_id UUID NOT NULL REFERENCES jornadas(id),
  turno_id UUID REFERENCES turnos(id),
  
  -- Sobrescritas específicas
  jornada_horas_sobrescrita DECIMAL(4,2),  -- NULL = usar jornada_id
  intervalo_minutos_sobrescrita INT,
  
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),
  
  CONSTRAINT unique_perfil_cargo UNIQUE(empresa_id, cargo, setor_id)
);

-- Consulta de uso:
-- SELECT * FROM perfis_jornada 
-- WHERE empresa_id = :emp AND cargo = profile.cargo
-- ORDER BY setor_id DESC NULLS LAST  -- Setor específico tem prioridade
```

---

## 🔄 FLUXO DE DADOS - Como as Configurações Serão Usadas

### **FLUXO 1: Registrar Marcação (POST /v1/marcacoes)**

```
┌─────────────────────────────────────────┐
│ App Trabalhador envia:                  │
│ {                                       │
│   user_id: "abc-123",                   │
│   marcada_em: "2026-07-10T08:00:00Z",   │
│   tipo: "entrada"                       │
│ }                                       │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Backend valida:                         │
│ 1. User autenticado ✓                   │
│ 2. Hora dentro de tolerância? ✓         │
│    config.tolerancia_minutos            │
│ 3. Não há entrada duplicada? ✓          │
└────────────────┬────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────┐
│ Armazena em MARCACOES:                  │
│ - id, user_id, empresa_id              │
│ - tipo, marcada_em, tolerancia_aplicada│
│ - criado_em                             │
└─────────────────────────────────────────┘
```

### **FLUXO 2: Calcular Horas Trabalhadas (GET /v1/relatorios/horas-dia)**

```
┌──────────────────────────────────────────────┐
│ Requisição:                                  │
│ GET /v1/relatorios/horas-dia                │
│ ?user_id=abc-123&data=2026-07-10            │
└────────────────┬─────────────────────────────┘
                 │
        ┌────────┴────────────────┐
        │ Buscar de 3 tabelas:    │
        ▼                         ▼
    MARCACOES             EMPRESA_CONFIG
    (Raw data)          + PERFIS_JORNADA
                        + JORNADAS
                        + HORARIOS_TRABALHO
                        │
                        ▼
         ┌──────────────────────────────┐
         │ Dados Obtidos:               │
         │ - Marcações: [entrada, ...]  │
         │ - Jornada esperada: 8h       │
         │ - Intervalo mínimo: 60min    │
         │ - Trabalho noturno? 21-05    │
         │ - É feriado? (dias_uteis)    │
         └──────────┬───────────────────┘
                    │
                    ▼
         ┌──────────────────────────────┐
         │ Chama função CLT:            │
         │ analisarDiaCLT(              │
         │   marcacoes,                 │
         │   jornada_esperada,          │
         │   config                     │
         │ )                            │
         └──────────┬───────────────────┘
                    │
                    ▼
         ┌──────────────────────────────┐
         │ Retorna resposta completa:   │
         │ {                            │
         │   horas_trabalhadas: 8.5,    │
         │   horas_extras: 0.5,         │
         │   eh_noturno: false,         │
         │   intervalo_minutos: 60,     │
         │   intervalo_valido: true,    │
         │   alertas: []                │
         │ }                            │
         └──────────────────────────────┘
```

---

## 📝 ROTAS NOVAS A CRIAR (CRUD de Configurações)

### **Admin/RH - Configurar Empresa**

```
POST   /v1/config/empresa          - Criar configuração inicial
GET    /v1/config/empresa          - Obter config atual
PUT    /v1/config/empresa          - Editar config

POST   /v1/jornadas                - Criar jornada
GET    /v1/jornadas                - Listar jornadas
PUT    /v1/jornadas/:id            - Editar jornada
DELETE /v1/jornadas/:id            - Deletar jornada

POST   /v1/horarios-trabalho       - Criar horário
GET    /v1/horarios-trabalho       - Listar horários
PUT    /v1/horarios-trabalho/:id   - Editar
DELETE /v1/horarios-trabalho/:id   - Deletar

POST   /v1/turnos                  - Criar turno
GET    /v1/turnos                  - Listar turnos
PUT    /v1/turnos/:id              - Editar turno
DELETE /v1/turnos/:id              - Deletar turno

POST   /v1/dias-uteis              - Criar feriado
GET    /v1/dias-uteis              - Listar feriados
DELETE /v1/dias-uteis/:id          - Deletar feriado

POST   /v1/perfis-jornada          - Mapear cargo→jornada
GET    /v1/perfis-jornada          - Listar mapeamentos
PUT    /v1/perfis-jornada/:id      - Editar
DELETE /v1/perfis-jornada/:id      - Deletar
```

### **Trabalhador - Consultar Cálculos**

```
GET    /v1/relatorios/horas-dia
       ?user_id=xyz&data=2026-07-10
       → Detalhes de um dia

GET    /v1/relatorios/horas-mes
       ?mes=7&ano=2026
       → Total mês com detalhe de horas extras

GET    /v1/relatorios/horas-extras
       ?mes=7&ano=2026
       → Todas as horas extras

GET    /v1/relatorios/repouso-semanal
       ?mes=7&ano=2026
       → Validação de repouso semanal

GET    /v1/relatorios/trabalho-noturno
       ?mes=7&ano=2026
       → Detalhes de trabalho noturno

GET    /v1/relatorios/validacao-clt
       ?mes=7&ano=2026
       → Compliance completo CLT
```

---

## 🔐 Autorização de Acesso

```
┌────────────────────────────────┐
│ ADMIN/RH (role: admin)         │
│ - Criar/editar config          │
│ - Criar/editar jornadas        │
│ - Criar/editar turnos          │
│ - Definir feriados             │
│ - Ver todos relatórios         │
└────────────────────────────────┘

┌────────────────────────────────┐
│ GERENTE (role: manager)        │
│ - Ver configuração             │
│ - Ver relatórios do setor      │
│ - Aprovar horas extras         │
│ - Justificar faltas            │
└────────────────────────────────┘

┌────────────────────────────────┐
│ COLABORADOR (role: user)       │
│ - Ver seu próprio relatório    │
│ - Ver cálculos de um dia       │
│ - Solicitar justificativa      │
└────────────────────────────────┘
```

---

## 🔄 Como Cada Cálculo Usa as Configurações

### **1. Horas Trabalhadas**

```typescript
// Pseudocódigo
async function calcularHorasDia(user_id, data) {
  const config = await getEmpresaConfig(user_id.empresa_id);
  const perfil = await getPerfisJornada(user_id.cargo, user_id.setor_id);
  const jornada = await getJornada(perfil.jornada_id);
  const marcacoes = await getMarcacoesDia(user_id, data);
  
  const jornada_esperada = jornada.minutos_dia;  // ← DE TABELA
  const intervalo_minimo = config.intervalo_minimo_apos_6h;  // ← DE TABELA
  
  return calcularHorasDia(marcacoes, {
    jornada_esperada,
    intervalo_minimo,
    tolerancia: config.tolerancia_minutos
  });
}
```

### **2. Horas Extras**

```typescript
async function detectarHorasExtras(user_id, mes, ano) {
  const config = await getEmpresaConfig(user_id.empresa_id);
  const marcacoesMes = await getMarcacoesPeriodo(user_id, mes, ano);
  
  const extras = [];
  
  for (const dia of marcacoesMes) {
    const ehFeriado = await checkEsFeriado(dia.data, user_id.empresa_id);  // ← DE TABELA
    
    const resultado = detectarHorasExtras(
      dia.horas,
      config.adicional_extra_padrao,  // 50% ← DE TABELA
      ehFeriado ? config.adicional_extra_feriado : config.adicional_extra_padrao  // 100% ← DE TABELA
    );
    
    if (resultado.tem_extras) {
      extras.push({
        data: dia.data,
        horas: resultado.horas_extras,
        percentual: resultado.adicional_percentual
      });
    }
  }
  
  return extras;
}
```

### **3. Validar Intervalo**

```typescript
async function validarIntervalo(user_id, data) {
  const config = await getEmpresaConfig(user_id.empresa_id);
  const perfil = await getPerfisJornada(user_id.cargo);
  const jornada = await getJornada(perfil.jornada_id);
  const marcacoes = await getMarcacoesDia(user_id, data);
  
  const { horas, intervalo } = calcularHorasDia(marcacoes);
  
  const intervalo_minimo = horas <= 6
    ? config.intervalo_minimo_ate_6h    // 15 min ← DE TABELA
    : config.intervalo_minimo_apos_6h;  // 60 min ← DE TABELA
  
  return validarIntervalo(horas, intervalo, intervalo_minimo);
}
```

### **4. Trabalho Noturno**

```typescript
async function detectarTrabalhoNoturno(user_id, mes, ano) {
  const config = await getEmpresaConfig(user_id.empresa_id);
  const marcacoesMes = await getMarcacoesPeriodo(user_id, mes, ano);
  
  const noturno = detectarTrabalhoNoturno(marcacoesMes, {
    horario_inicio: config.horario_noturno_inicio,    // 21 ← DE TABELA
    horario_fim: config.horario_noturno_fim,          // 5  ← DE TABELA
    hora_noturna_minutos: config.hora_noturna_minutos, // 52.5 ← DE TABELA
    adicional: config.adicional_noturno_percentual     // 20 ← DE TABELA
  });
  
  return noturno;
}
```

### **5. Repouso Semanal**

```typescript
async function validarRepouso(user_id, mes, ano) {
  const config = await getEmpresaConfig(user_id.empresa_id);
  const marcacoesMes = await getMarcacoesPeriodo(user_id, mes, ano);
  
  const resultado = validarRepouso(marcacoesMes.map(m => m.data), {
    dia_repouso_preferencial: config.dia_repouso_preferencial,  // 0 (domingo) ← DE TABELA
    exigir_repouso: config.exigir_repouso_semanal                // true ← DE TABELA
  });
  
  return resultado;
}
```

---

## 🎨 Exemplo de Tela - Admin Configurando Empresa

```
┌─────────────────────────────────────────┐
│  CONFIGURAÇÕES DA EMPRESA               │
└─────────────────────────────────────────┘

📋 JORNADA PADRÃO
  Horas/dia: [8.00] horas
  Minutos/dia: [480] minutos

⏰ INTERVALO INTRAJORNADA
  Até 6 horas: [15] minutos
  Acima de 6 horas: [60] minutos
  ☑ Intervalo é remunerado

🌙 TRABALHO NOTURNO
  Início: [21]h
  Término: [05]h
  Adicional: [20]%
  Hora noturna: [52.5] minutos

⚡ HORAS EXTRAS
  Percentual padrão: [50]%
  Percentual feriado: [100]%
  Limite/dia: [2] horas

⏱️ TOLERÂNCIA
  ☑ Aplicar tolerância
  Minutos: [5]

📅 FERIADO TRABALHADO
  Adicional: [100]%
  ☑ Exigir folga compensatória

📆 REPOUSO SEMANAL
  Dia preferencial: [Domingo ▼]
  ☑ Exigir repouso semanal mínimo

🌍 LOCALIZAÇÃO
  Timezone: [America/Sao_Paulo ▼]

[SALVAR]  [CANCELAR]
```

---

## 🚀 FASES DE IMPLEMENTAÇÃO

### **Fase 1: Banco de Dados (2-3 dias)**
- [ ] Criar 6 tabelas de configuração
- [ ] Popular feriados nacionais 2024-2027
- [ ] Criar índices
- [ ] Backup/Segurança

### **Fase 2: Rotas de Configuração (2-3 dias)**
- [ ] CRUD empresa_config (GET/POST/PUT)
- [ ] CRUD jornadas (GET/POST/PUT/DELETE)
- [ ] CRUD horarios_trabalho
- [ ] CRUD turnos
- [ ] CRUD dias_uteis (feriados)
- [ ] CRUD perfis_jornada
- [ ] Validações Zod para cada

### **Fase 3: Integração com Cálculos (2-3 dias)**
- [ ] Modificar `/v1/relatorios/horas-mes` para usar config
- [ ] Criar `/v1/relatorios/horas-dia` (novo)
- [ ] Criar `/v1/relatorios/horas-extras` (novo)
- [ ] Criar `/v1/relatorios/repouso-semanal` (novo)
- [ ] Criar `/v1/relatorios/trabalho-noturno` (novo)
- [ ] Criar `/v1/relatorios/validacao-clt` (novo)

### **Fase 4: Autorização & Segurança (1-2 dias)**
- [ ] Adicionar middleware de role (admin/manager/user)
- [ ] Validar acesso por empresa
- [ ] Audit logs para alterações de config
- [ ] Testes de segurança

### **Fase 5: Testes & Documentação (2-3 dias)**
- [ ] Testes unitários de cálculos
- [ ] Testes de integração
- [ ] Documentação de API
- [ ] Exemplos de uso

---

## ⚠️ CUIDADOS IMPORTANTES

### **1. Dados Históricos**
- Quando mudar configuração, dados antigos não são recalculados
- Solução: Manter histórico de configurações com data_vigencia

### **2. Multi-tenant Isolamento**
- Cada empresa tem suas próprias configurações
- NUNCA compartilhar configuração entre empresas
- Sempre filtrar por empresa_id

### **3. Timezone**
- Timestamp está em UTC no banco
- Conversão deve ser feita na app do trabalhador
- Backend retorna com timezone da empresa

### **4. Feriados Dinâmicos**
- Páscoa, Corpus Christi variam todo ano
- Sistema deve popular automaticamente
- Ou permitir importação de calendário

### **5. Reversão de Cálculos**
- Se empresa muda jornada (8h→6h), dados não mudam
- Pode usar data_vigencia na config
- Alertar ao mudar config importante

---

## 🎯 RESULTADO FINAL

Após implementação:

✅ Sistema totalmente configurável por empresa  
✅ Nenhum valor fixo em código  
✅ Cálculos CLT precisos e auditáveis  
✅ Suporta múltiplas jornadas/turnos  
✅ Alertas de compliance automáticos  
✅ Relatórios detalhados  
✅ Pronto para produção

---

## 📞 PERGUNTAS CRÍTICAS ANTES DE COMEÇAR

1. **Qual é a prioridade?** (Tudo junto ou por fases?)
2. **Há múltiplas convenções coletivas a suportar?** (Logística ≠ Construção)
3. **Feriados são por estado/município?**
4. **Há colaboradores com jornada variável/flexible?**
5. **Precisa de banco de horas?** (Compensação de extras)
6. **Como será a aprovação de horas extras?** (Manual/Automática)
7. **Precisa de integração com folha de pagamento?**
8. **Há limite de versões de config a manter?**

---

**Este é o PLANO COMPLETO. Aguardando suas aprovações antes de qualquer codificação. ✋**
