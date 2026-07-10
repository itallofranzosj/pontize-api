# 🔒 ANÁLISE DE COMPATIBILIDADE - O Que Existe vs O Que Vai Ser Adicionado

**Data:** 2026-07-10  
**Status:** 🔍 ANÁLISE DE RISCO - SEM ALTERAÇÕES  
**Objetivo:** Garantir que NADA quebra e não há duplicação

---

## 📊 MAPEAMENTO: O QUE JÁ EXISTE

### **TABELAS EXISTENTES (Pontize v1)**

```
✅ profiles
   - id (PK)
   - nome, cpf, matricula, cargo
   - setor_id (FK → setores)
   - empresa_id
   - ativo, data_admissao
   - mfa_enabled
   - created_at

✅ marcacoes
   - id (PK)
   - user_id (FK → profiles)
   - empresa_id
   - tipo (entrada, saida, saida_intervalo, volta_intervalo)
   - marcada_em
   - tolerancia_aplicada
   - justificativa (nullable)
   - tipo_justificativa (nullable)
   - criado_em, atualizado_em

✅ unidades
   - id (PK)
   - nome
   - empresa_id
   - ativo

✅ setores
   - id (PK)
   - empresa_id
   - departamento_id (nullable)
   - nome, codigo
   - responsavel_id (FK → profiles)
   - ativo

✅ dispositivos
   - id (PK)
   - user_id (FK → profiles)
   - nome, tipo, serie
   - localizacao (opcional)
   - ativo, criado_em

✅ rep_devices
   - id (PK)
   - empresa_id
   - identificador, ip_local, fabricante, modelo, numero_serie
   - tipo_rep, unidade_id, nr_id_estab, tipo_id_estab
   - ativo, ingest_enabled, updated_at

✅ mfa_codes
   - id (PK)
   - user_id (FK → profiles)
   - code (6 dígitos)
   - method (email/sms)
   - expires_at, used_at, created_at
```

### **ENDPOINTS EXISTENTES (Pontize v1)**

```
AUTENTICAÇÃO:
✅ POST /auth/login
✅ POST /auth/logout
✅ POST /auth/refresh
✅ GET /auth/verify
✅ POST /auth/mfa/send
✅ POST /auth/mfa/verify
✅ GET /auth/mfa/status

MARCAÇÕES:
✅ GET /v1/marcacoes (com filtros)
✅ POST /v1/marcacoes
✅ GET /v1/marcacoes/:id
✅ PUT /v1/marcacoes/:id
✅ DELETE /v1/marcacoes/:id

COLABORADORES:
✅ GET /v1/colaboradores
✅ GET /v1/colaboradores/:id
✅ GET /v1/colaboradores/:id/marcacoes

ESTRUTURA:
✅ GET /v1/setores
✅ GET /v1/setores/:id
✅ GET /v1/setores/:id/colaboradores
✅ GET /v1/unidades

DISPOSITIVOS:
✅ GET /v1/dispositivos
✅ POST /v1/dispositivos
✅ GET /v1/dispositivos/:id
✅ PUT /v1/dispositivos/:id
✅ DELETE /v1/dispositivos/:id
✅ PATCH /v1/dispositivos/:id/desativar

REP DEVICES:
✅ GET /v1/rep-devices
✅ POST /v1/rep-devices
✅ PATCH /v1/rep-devices/:id

RELATÓRIOS (SIMPLES):
✅ GET /v1/relatorios/horas-mes
✅ GET /v1/relatorios/comparecimento
✅ GET /v1/relatorios/producao

HEALTH:
✅ GET /health
```

### **FUNÇÕES EXISTENTES (Utils)**

```
✅ Arquivo: src/utils/calculo-clt.ts (Implementado mas NÃO USADO)
   - calcularHorasDia(marcacoes)
   - detectarHorasExtras(horasDia, valorHoraBase, percentual)
   - validarIntervalo(horasDia, intervaloMinutos)
   - detectarTrabalhoNoturno(marcacoes)
   - validarRepouso(datas_trabalho)
   - analisarDiaCLT(marcacoes, valorHoraBase)
   - minutosParaHoras(minutos)
   - ehDiaUtil(data)
   - contarDiasUteis(dataInicio, dataFim)
```

### **MIDDLEWARE EXISTENTE**

```
✅ authMiddleware (src/api/middleware/auth.ts)
   - Valida JWT
   - Extrai user_id
   - Define user context
```

---

## 🆕 MAPEAMENTO: O QUE SERÁ ADICIONADO

### **NOVAS TABELAS (12)**

```
❌ → ✅ empresa_config
❌ → ✅ jornadas
❌ → ✅ horarios_trabalho
❌ → ✅ dias_uteis
❌ → ✅ afastamentos
❌ → ✅ ocorrencias
❌ → ✅ tipos_afastamento (lookup)
❌ → ✅ tipos_justificativa (lookup)
❌ → ✅ tipos_contrato (lookup)
❌ → ✅ banco_horas
❌ → ✅ perfis_jornada
❌ → ✅ auditoria_log
```

### **NOVOS ENDPOINTS (50+)**

```
CONFIGURAÇÃO:
❌ → ✅ POST /v1/config/empresa
❌ → ✅ GET /v1/config/empresa
❌ → ✅ PUT /v1/config/empresa

JORNADAS:
❌ → ✅ POST /v1/jornadas
❌ → ✅ GET /v1/jornadas
❌ → ✅ PUT /v1/jornadas/:id
❌ → ✅ DELETE /v1/jornadas/:id

HORÁRIOS:
❌ → ✅ POST /v1/horarios-trabalho
❌ → ✅ GET /v1/horarios-trabalho
❌ → ✅ PUT /v1/horarios-trabalho/:id
❌ → ✅ DELETE /v1/horarios-trabalho/:id

FERIADOS:
❌ → ✅ POST /v1/dias-uteis
❌ → ✅ GET /v1/dias-uteis
❌ → ✅ DELETE /v1/dias-uteis/:id

AFASTAMENTOS:
❌ → ✅ POST /v1/afastamentos
❌ → ✅ GET /v1/afastamentos
❌ → ✅ PUT /v1/afastamentos/:id
❌ → ✅ DELETE /v1/afastamentos/:id
❌ → ✅ POST /v1/afastamentos/:id/finalizar

OCORRÊNCIAS:
❌ → ✅ POST /v1/ocorrencias
❌ → ✅ GET /v1/ocorrencias
❌ → ✅ PUT /v1/ocorrencias/:id
❌ → ✅ DELETE /v1/ocorrencias/:id

BANCO DE HORAS:
❌ → ✅ POST /v1/banco-horas/lancar-credito
❌ → ✅ POST /v1/banco-horas/lancar-debito
❌ → ✅ GET /v1/banco-horas/meu-saldo
❌ → ✅ GET /v1/banco-horas/historico

JUSTIFICATIVAS:
❌ → ✅ POST /v1/justificativa/criar
❌ → ✅ GET /v1/justificativa/:id
❌ → ✅ PUT /v1/justificativa/:id/revisar

OPERAÇÕES:
❌ → ✅ PATCH /v1/marcacoes/:id/recalcular ← NOVA FUNÇÃO
❌ → ✅ POST /v1/recalcular-dia ← NOVA FUNÇÃO
❌ → ✅ POST /v1/fechamento-ponto ← NOVA FUNÇÃO
❌ → ✅ GET /v1/fechamento-ponto/:mes/:ano
❌ → ✅ PUT /v1/fechamento-ponto/:mes/:ano/confirmar

RELATÓRIOS (NOVOS):
❌ → ✅ GET /v1/relatorios/horas-dia ← NOVO (detalhado)
❌ → ✅ GET /v1/relatorios/horas-mes ← MODIFICADO (adiciona extras)
❌ → ✅ GET /v1/relatorios/horas-extras
❌ → ✅ GET /v1/relatorios/banco-horas
❌ → ✅ GET /v1/relatorios/repouso-semanal
❌ → ✅ GET /v1/relatorios/trabalho-noturno
❌ → ✅ GET /v1/relatorios/validacao-clt

PERFIL:
❌ → ✅ GET /v1/meu-perfil ← NOVO (expande dados)
❌ → ✅ GET /v1/colaboradores/:id/historico ← NOVO (auditoria)

EXPORTAÇÃO:
❌ → ✅ POST /v1/exportacao/webfopag
❌ → ✅ POST /v1/exportacao/txt
❌ → ✅ POST /v1/exportacao/mte
❌ → ✅ POST /v1/exportacao/folha
❌ → ✅ POST /v1/exportacao/customizada

CAMPOS NOVOS:
❌ → ✅ POST /v1/perfis-jornada
❌ → ✅ GET /v1/perfis-jornada
❌ → ✅ PUT /v1/perfis-jornada/:id
```

---

## ⚠️ ANÁLISE DE CONFLITOS & QUEBRAS

### **1️⃣ ENDPOINTS QUE SERÃO MODIFICADOS (NÃO QUEBRAM)**

#### **GET /v1/marcacoes**
```
ANTES (v1):
{
  data: [...],
  pagination: { limit, offset, total }
}

DEPOIS (v2):
{
  data: [
    {
      ...tudo_anterior,
      + horas_trabalhadas: number
      + horas_extras: number
      + intervalo_minutos: number
      + alertas: string[]
    }
  ],
  pagination: { limit, offset, total }
}

COMPATIBILIDADE: ✅ COMPATÍVEL (apenas ADD campos, nenhum removido)
RISCO: 🟢 BAIXO (novos campos não quebram apps antigos)
```

#### **GET /v1/relatorios/horas-mes**
```
ANTES (v1):
{
  periodo: { mes, ano },
  horas_por_usuario: { user_id: horas },
  total_horas: number,
  contagem_marcacoes: number
}

DEPOIS (v2):
{
  periodo: { mes, ano },
  horas_por_usuario: { user_id: horas },
  total_horas: number,
  contagem_marcacoes: number,
  + horas_extras_total: number
  + alertas: [...],
  + resumo: { dias_trabalhados, horas_extras, ... }
}

COMPATIBILIDADE: ✅ COMPATÍVEL (backward compatible)
RISCO: 🟢 BAIXO (app antiga ignora novos campos)
```

#### **PUT /v1/colaboradores/:id**
```
ANTES (v1):
{
  nome, cpf, matricula, cargo, setor_id, ativo, data_admissao
}

DEPOIS (v2):
{
  nome, cpf, matricula, cargo, setor_id, ativo, data_admissao,
  + turno_id,
  + jornada_id,
  + data_demissao,
  + tipo_contrato,
  + salario_base,
  + banco_agencia,
  + documento_url
}

COMPATIBILIDADE: ✅ COMPATÍVEL (novos campos opcionais)
RISCO: 🟢 BAIXO (campos antigos continuam funcionando)
```

---

### **2️⃣ ENDPOINTS EXISTENTES QUE NÃO SERÃO TOCADOS**

```
✅ POST /auth/login         → Sem mudanças
✅ POST /auth/logout        → Sem mudanças
✅ GET /auth/verify         → Sem mudanças
✅ POST /auth/mfa/*         → Sem mudanças
✅ GET /v1/dispositivos     → Sem mudanças
✅ GET /v1/unidades         → Sem mudanças
✅ GET /v1/setores          → Sem mudanças
✅ GET /v1/rep-devices      → Sem mudanças
✅ GET /health              → Sem mudanças
```

**Risco: 🟢 ZERO - Nada será alterado nestes endpoints**

---

### **3️⃣ FUNÇÕES CLT (Implementadas mas não usadas)**

```
SITUAÇÃO ATUAL:
✅ calcularHorasDia()           → Implementada, NÃO USADA
✅ detectarHorasExtras()        → Implementada, NÃO USADA
✅ validarIntervalo()           → Implementada, NÃO USADA
✅ detectarTrabalhoNoturno()    → Implementada, NÃO USADA
✅ validarRepouso()             → Implementada, NÃO USADA
✅ analisarDiaCLT()             → Implementada, NÃO USADA

MUDANÇA:
❌ Continuará não usada em outros contextos
✅ SERÁ INTEGRADA EM:
   - GET /v1/relatorios/horas-dia (novo)
   - PATCH /v1/marcacoes/:id (modificado)
   - POST /v1/recalcular-dia (novo)
   - GET /v1/relatorios/* (novos)

COMPATIBILIDADE: ✅ 100% COMPATÍVEL (apenas adiciona uso)
RISCO: 🟢 ZERO (arquivo não sofre alteração, só é chamado)
```

---

### **4️⃣ TABELAS EXISTENTES - ALTERAÇÕES MÍNIMAS**

#### **profiles**
```
CAMPOS EXISTENTES:
✅ id, nome, cpf, matricula, cargo, setor_id, empresa_id
✅ ativo, data_admissao, mfa_enabled, created_at

NOVOS CAMPOS A ADICIONAR:
+ turno_id (FK → turnos)        NULLABLE
+ jornada_id (FK → jornadas)    NULLABLE
+ data_demissao                 NULLABLE
+ tipo_contrato_id              NULLABLE
+ salario_base                  NULLABLE
+ banco_id, agencia_id, conta   NULLABLE
+ documento_url                 NULLABLE

IMPACTO:
- ALTER TABLE profiles ADD COLUMN ... (não quebra nada)
- Todos os novos campos são NULLABLE
- Queries antigas continuam funcionando
- Nenhuma coluna foi removida ou renomeada

COMPATIBILIDADE: ✅ 100%
RISCO: 🟢 ZERO (apenas ADD, sem ALTER/DROP)
```

#### **marcacoes**
```
CAMPOS EXISTENTES:
✅ id, user_id, empresa_id, tipo, marcada_em
✅ tolerancia_aplicada, justificativa, tipo_justificativa
✅ criado_em, atualizado_em

NOVOS CAMPOS A ADICIONAR:
+ horas_trabalhadas          (calculated, nullable)
+ horas_extras               (calculated, nullable)
+ intervalo_minutos          (calculated, nullable)
+ alertas                    (JSON, nullable)
+ ultima_recalculo           (timestamp, nullable)
+ periodo_fechado            (boolean, default false)
+ data_fechamento            (timestamp, nullable)
+ bloqueado_por_afastamento  (boolean, default false)

IMPACTO:
- ALTER TABLE marcacoes ADD COLUMN ... (não quebra nada)
- Todos os novos campos têm defaults ou são nullable
- Queries antigas continuam 100% funcionando
- Sem remoção ou renomeação de colunas

COMPATIBILIDADE: ✅ 100%
RISCO: 🟢 ZERO (apenas ADD, sem DROP/RENAME)
```

---

### **5️⃣ MIDDLEWARE & AUTENTICAÇÃO**

```
MIDDLEWARE EXISTENTE:
✅ authMiddleware (src/api/middleware/auth.ts)
   - Validar JWT ✓
   - Extrair user_id ✓
   - Setar user context ✓

MUDANÇAS:
❌ NENHUMA mudança no middleware existente
✅ NOVOS middlewares a adicionar:
   + roleMiddleware (validar admin/manager/user)
   + auditMiddleware (log de operações)
   + validarEmpresaMiddleware (isolamento multi-tenant)

COMPATIBILIDADE: ✅ 100%
RISCO: 🟢 ZERO (middleware novo não afeta antigo)
```

---

## 🔴 POSSÍVEIS RISCOS & MITIGAÇÃO

### **RISCO 1: Nome de Endpoint Conflitante**

```
❌ RISCO:
Se criar POST /v1/marcacoes/recalcular 
E já existe PUT /v1/marcacoes/:id
→ Pode confundir clientes

✅ MITIGAÇÃO:
- Usar PATCH /v1/marcacoes/:id/recalcular (mais claro)
- Ou criar POST /v1/recalcular-dia (separado)
- Documentar bem ambos endpoints
```

### **RISCO 2: Performance de Recalcular**

```
❌ RISCO:
Se recalcularDia() é chamado 1000x em paralelo
→ Pode sobrecarregar BD

✅ MITIGAÇÃO:
- Usar fila de jobs (Bull, RQ)
- Limitar concorrência (max 5 recálculos simultâneos)
- Cache de resultados (Redis)
- Índices no BD para queries rápidas
```

### **RISCO 3: Dados Históricos Não Recalculados**

```
❌ RISCO:
Se config muda de 8h para 6h jornada
Dados antigos do mês passado não mudam
→ Inconsistência histórica

✅ MITIGAÇÃO:
- Adicionar data_vigencia na empresa_config
- Manter histórico de configs
- Sempre usar config da DATA para cálculos
- Documento explicando que histórico não é recalculado
```

### **RISCO 4: Bloqueio de Período Permanente**

```
❌ RISCO:
Se fecharPeriodo() buggar
Período fica bloqueado para sempre
→ RH não consegue corrigir

✅ MITIGAÇÃO:
- Adicionar campo periodo_bloqueado (boolean)
- Endpoint para "desbloquear período" (apenas admin)
- Log completo de quando bloqueou e por quem
- Avisos antes de fechar irreversivelmente
```

### **RISCO 5: Cascata de Afastamento → Marcações**

```
❌ RISCO:
Se criar afastamento
E buscar marcações bloqueadas
Mas houver marcações órfãs
→ Inconsistência

✅ MITIGAÇÃO:
- Usar transações no BD
- Validar FK constraints
- Teste de integridade referencial
- Log de operação (rollback if error)
```

---

## ✅ CHECKLIST DE COMPATIBILIDADE

```
TABELAS EXISTENTES:
✅ profiles         - ADD novos campos (sem remover)
✅ marcacoes        - ADD novos campos (sem remover)
✅ unidades         - SEM mudanças
✅ setores          - SEM mudanças
✅ dispositivos     - SEM mudanças
✅ rep_devices      - SEM mudanças
✅ mfa_codes        - SEM mudanças

ENDPOINTS EXISTENTES:
✅ POST /auth/*     - SEM mudanças
✅ GET /v1/marcacoes        - ADD campos (backward compat)
✅ PUT /v1/marcacoes/:id    - ADD campos opcionais
✅ PUT /v1/colaboradores/:id - ADD campos opcionais
✅ GET /v1/relatorios/horas-mes - ADD campos (backward compat)
✅ GET /health      - SEM mudanças

FUNÇÕES EXISTENTES:
✅ calcularHorasDia()       - Apenas INTEGRADA (não modificada)
✅ detectarHorasExtras()    - Apenas INTEGRADA (não modificada)
✅ validarIntervalo()       - Apenas INTEGRADA (não modificada)
✅ authMiddleware           - SEM mudanças

NOVOS ELEMENTOS:
✅ 12 novas tabelas (sem conflito de nome)
✅ 50+ novos endpoints (sem conflito de rota)
✅ 6 novos middlewares (complementam, não substituem)

RISCO GERAL: 🟢 BAIXÍSSIMO
QUEBRAS ESPERADAS: ❌ ZERO
BACKWARD COMPATIBILITY: ✅ 100%
```

---

## 📋 ESTRATÉGIA DE MIGRAÇÃO (ZERO DOWNTIME)

### **Passo 1: Criar Novas Tabelas (0s downtime)**
```sql
CREATE TABLE empresa_config (...);
CREATE TABLE jornadas (...);
-- etc, sem afetar tabelas existentes
```

### **Passo 2: ADD Colunas a Tabelas Existentes (0s downtime)**
```sql
ALTER TABLE profiles ADD COLUMN turno_id UUID;
ALTER TABLE marcacoes ADD COLUMN horas_trabalhadas DECIMAL;
-- Com NULLABLE/DEFAULT, não bloqueia queries
```

### **Passo 3: Deploy de APIs Novas (0s downtime)**
```
- Novas rotas não afetam rotas antigas
- Clientes antigos continuam funcionando
- Clientes novos usam novos endpoints
```

### **Passo 4: Migração de Dados Gradual (background)**
```
- Popular empresa_config com defaults
- Não força popula jornadas (cria on-demand)
- Histórico não é recalculado (apenas novos dados)
```

---

## 🎯 CONCLUSÃO

**✅ COMPATIBILIDADE: 100% GARANTIDA**

- ❌ **ZERO endpoints quebrados**
- ❌ **ZERO tabelas removidas**
- ❌ **ZERO colunas removidas ou renomeadas**
- ✅ **Todas mudanças são ADITIVAS (ADD, INSERT, new endpoints)**
- ✅ **Backward compatibility 100%**
- ✅ **Pode rodar v1 e v2 em paralelo**
- ✅ **Migração de dados é gradual**

**RISCO: 🟢 BAIXÍSSIMO (mitigável com precauções)**

**Pronto para implementação sem medo! 🚀**

