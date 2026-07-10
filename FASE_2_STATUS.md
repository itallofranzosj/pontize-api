# Fase 2 - Status de Implementação

## ✅ CONCLUÍDO

### Migrations SQL (4/4)
- ✅ 011_create_tipos_afastamento.sql
  - Tabela com tipos de afastamento (férias, licença, atestado, etc)
  - Regras CLT: descontar_banco, remunerado, bloqueia_ponto, permite_sobreposicao
  - Validações: dias máximo, intervalo mínimo entre afastamentos
  - Índices para performance (empresa_id, ativo)

- ✅ 012_create_afastamentos.sql
  - Registro de afastamentos por colaborador
  - Período (data_inicio, data_fim), duração calculada automaticamente
  - Status: pendente, aprovado, rejeitado, cancelado
  - Validações CLT: sobrepõe? bloqueia ponto? banco de horas?
  - Índices para queries comuns (user+data, overlapping detection)

- ✅ 013_create_ocorrencias.sql
  - Registro de ocorrências disciplinares (advertência, suspensão, multa, etc)
  - Tipos: advertencia, suspensao, multa, dismissao, elogio, etc
  - Gravidade: leve, media, grave
  - Status: registrada, vigente, expirada, anulada, em_recurso
  - Controle: validação de aprovação (não pode ser feito por registrador)
  - Desconto valor (para multa), afeta_ponto (bloqueia marcação)

- ✅ 014_add_demissao_columns_profiles.sql
  - 9 novos campos em profiles:
    - motivo_demissao (VARCHAR)
    - motivo_demissao_detalhado (TEXT)
    - data_comunicacao_demissao
    - com_justa_causa (BOOLEAN)
    - aviso_previo_dias (padrão 30)
    - data_fim_aviso_previo (calculado)
    - saldo_banco_horas (decimal)
    - saldo_banco_horas_data_calculo
  - Índices para demissões (data_demissao, aviso_previo)
  - Constraints para validação (motivo obrigatório se data_demissão)

---

### Rotas Backend (3/3)
- ✅ `src/api/routes/tipos-afastamento.ts` (5 endpoints)
  - GET /v1/tipos-afastamento (com filtro ativo)
  - GET /v1/tipos-afastamento/:id
  - POST /v1/tipos-afastamento
  - PUT /v1/tipos-afastamento/:id
  - DELETE /v1/tipos-afastamento/:id

- ✅ `src/api/routes/afastamentos.ts` (7 endpoints)
  - GET /v1/afastamentos (com filtros user, status, data)
  - GET /v1/afastamentos/:id
  - POST /v1/afastamentos
    - Validação: sobrepõe? bloqueia? intervalo mínimo?
    - Verifica permission (colaborador pertence à empresa)
    - Verifica periodo_intervalo (dias mínimos entre do mesmo tipo)
  - PUT /v1/afastamentos/:id
  - POST /v1/afastamentos/:id/aprovar
  - POST /v1/afastamentos/:id/rejeitar (com motivo)
  - DELETE /v1/afastamentos/:id

- ✅ `src/api/routes/ocorrencias.ts` (8 endpoints)
  - GET /v1/ocorrencias (com filtros user, tipo, status, gravidade, data)
  - GET /v1/ocorrencias/:id
  - POST /v1/ocorrencias (com validação registrado_por != aprovador)
  - PUT /v1/ocorrencias/:id
  - POST /v1/ocorrencias/:id/aprovar
  - POST /v1/ocorrencias/:id/anular (com motivo)
  - POST /v1/ocorrencias/:id/recurso
  - DELETE /v1/ocorrencias/:id

**Total endpoints Fase 2:** 20 endpoints

---

### Features implementadas por rota

**tipos-afastamento.ts:**
- Multi-tenant isolamento (empresa_id)
- UNIQUE constraint (empresa_id, codigo)
- Zod validation (nome, código, campos CLT)
- Ownership validation em updates/deletes

**afastamentos.ts:**
- Validação de sobreposição (permite_sobreposicao por tipo)
- Validação de período intervalo (requer_periodo_intervalo)
- Cálculo automático de duracao_dias (via trigger)
- Cálculo automático de dias_desde_anterior
- Joins com tipos_afastamento e profiles
- Múltiplos filtros (user_id, status, data range)
- Estados: pendente → (aprovado|rejeitado)
- Cascata de validações CLT

**ocorrencias.ts:**
- Validação: registrado_por != usuario_aprovacao (não auto-aprovação)
- Estados: registrada → vigente → (expirada|anulada)
- Em recurso: em_recurso + resultado_recurso
- Efeito temporal (data_efeito_inicio até data_efeito_fim)
- Afeta ponto (bloqueia marcações)
- Desconto valor (para multa)
- Busca por gravidade, tipo, status
- Anulação com motivo + auditor

---

### Registro em src/api/index.ts
- ✅ 3 importações adicionadas
- ✅ 3 routers registrados (paths /v1/tipos-afastamento, /v1/afastamentos, /v1/ocorrencias)

---

## 📊 RESUMO FASE 2

| Métrica | Valor |
|---------|-------|
| SQL Migrations | 4 |
| Backend Routes | 3 |
| Endpoints | 20 |
| Novas colunas profiles | 9 |
| LOC (Routes) | ~1,100+ linhas |
| Validações CLT | Sobreposição, intervalo, banco horas |
| Status workflows | pendente→aprovado|rejeitado (afastamentos), registrada→vigente|anulada (ocorrências) |

---

## 🔧 PRÓXIMOS PASSOS

### Testes Unitários (RECOMENDADO)
```bash
# Criar:
# - tipos-afastamento.test.ts (CRUD + validação de código)
# - afastamentos.test.ts (Sobreposição, período intervalo, validação)
# - ocorrencias.test.ts (Auto-aprovação, anulação com motivo)
```

### Documentação API (RECOMENDADO)
```bash
# Adicionar a docs/API_CONFIG.md ou criar docs/API_COLABORADOR.md:
# - Endpoints de tipos_afastamento (CRUD)
# - Endpoints de afastamentos (CRUD + aprovar/rejeitar)
# - Endpoints de ocorrencias (CRUD + aprovar/anular/recurso)
```

### Deploy
```bash
npm install  # Se já não fez na Fase 1
npm run build
npm run lint
npm run test

# Migrations
supabase migration up  # 011-014

# Deploy API
# (seu pipeline)
```

---

## ✨ FEATURES DE DESTAQUE

### Validações CLT Implementadas
1. **Sobreposição de afastamentos** - Respeita permite_sobreposicao por tipo
2. **Período intervalo** - Garante dias mínimos entre afastamentos do mesmo tipo
3. **Bloqueio de ponto** - Afastamento pode bloquear marcações do período
4. **Banco de horas** - Afastamento pode descontar do banco (descontar_do_banco)
5. **Ocorrências** - Bloqueia ponto se afeta_ponto = true durante período
6. **Demissão** - Rastreia aviso prévio (data_demissao + aviso_previo_dias)

### Workflows de Aprovação
- **Afastamentos:** pendente → aprovado (por RH) | rejeitado
- **Ocorrências:** registrada → vigente (por supervisor diferente) | anulada
- **Recurso:** em_recurso = true + resultado_recurso (deferido|indeferido|parcial)

### Segurança
- Multi-tenant isolamento (empresa_id em tudo)
- Ownership verification
- Validação de auto-aprovação
- Audit trail (registrado_por, data, usuario_aprovacao)

---

## 🚀 INTEGRAÇÃO COM FASE 1

Fase 2 depende completamente de Fase 1:
- ✅ empresa_config → para definir dias_maximo de afastamento
- ✅ profiles → expandido com campos de demissão
- ✅ perfis_jornada → usado para validação de cargo/jornada

---

## 📝 PRÓXIMA FASE (FASE 3)

Após aprovação e testes de Fase 2, iniciar:
- **Fase 3: Operações Críticas** (recalcularDia, fecharPeriodo)
- Função `recalcularDia(data)` → reprocessa marcações com CLT
- Função `fecharPeriodo(periodo)` → fecha mês e valida alertas
- Telas de manutenção diária
- Tela de fechamento

---

Gerado em: 2026-07-10
Status: PRONTO PARA TESTES
Dependência: Fase 1 (CONCLUÍDA)
