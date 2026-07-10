# 📊 COMPARATIVO DETALHADO: PontoFopag (ePays) vs Pontize API

**Data:** 2026-07-10  
**Status:** 🔍 ANÁLISE COMPARATIVA (SEM ALTERAÇÕES)  
**Base:** Screenshots do PontoFopag vs Código atual do Pontize

---

## 📋 RESUMO EXECUTIVO

| Aspecto | PontoFopag | Pontize | Status |
|---------|-----------|---------|--------|
| **Total de Funcionalidades** | ~80+ | ~20 | ❌ Pontize tem ~25% |
| **Cadastros** | 13 tipos | 4 tipos | ⚠️ Faltam 9 |
| **Configurações** | 6 áreas | 0 áreas | ❌ Crítico |
| **Relatórios** | 15+ tipos | 3 tipos | ⚠️ Faltam 12+ |
| **Manutenção/Operação** | 11 operações | 1 operação | ❌ Crítico |
| **Exportação/Integração** | 6 tipos | 0 tipos | ❌ Não existe |
| **Banco de Horas** | Completo | Não existe | ❌ Não existe |

---

## 🔴 SEÇÃO 1: CADASTROS

### PONTOFOPAG TEM:

```
├── Gerais
│   ├── Pessoa (empresa)
│   ├── Grupo Econômico
│   ├── Filial ✅ (Pontize tem como "unidades")
│   ├── Departamento ✅ (Pontize tem como "setores")
│   ├── Contrato
│   └── Função ✅ (Pontize tem como "cargo" em profiles)
│
├── Funcionário ✅ (Pontize tem como "profiles")
├── Jornada ❌ (Pontize não tem tabela)
├── Horário ❌ (Pontize não tem)
│   ├── Normal
│   ├── Flexível
│   └── Dinâmico
├── Jornada Alternativa ❌ (Pontize não tem)
├── Feriado ❌ (Pontize não tem)
├── Compensação ❌ (Pontize não tem)
├── Rep ✅ (Pontize tem como "rep_devices")
├── Afastamento ❌ (Pontize não tem)
├── Ocorrência ❌ (Pontize não tem)
├── Justificativa ❌ (Pontize não tem)
├── Classificação ❌ (Pontize não tem)
└── Alocação ❌ (Pontize não tem)
```

### ANÁLISE:

**✅ O Que Pontize JÁ TEM:**
- Unidades/Filiais (funcional)
- Setores/Departamentos (funcional)
- Colaboradores/Funcionários (funcional)
- REP Devices (funcional)

**❌ O Que Falta (CRÍTICO):**
1. **Jornada** - Tabela não existe (URGENTE)
2. **Horário** - Tipos de horário (Normal, Flexível, Dinâmico)
3. **Jornada Alternativa** - Para colaboradores com jornada diferente
4. **Feriado** - Cadastro de feriados nacionais/estaduais/municipais
5. **Compensação** - Configuração de banco de horas
6. **Afastamento** - Licenças, férias, afastamentos
7. **Ocorrência** - Falta, atraso, etc
8. **Justificativa** - Tipos de justificativa
9. **Classificação** - Classificação de colaboradores
10. **Alocação** - Alocação de recursos
11. **Contrato** - Tipos de contrato (CLT, PJ, etc)
12. **Grupo Econômico** - Agrupamento de filiais

---

## 🔴 SEÇÃO 2: CONFIGURAÇÕES

### PONTOFOPAG TEM:

```
├── Parâmetro Geral ❌
│   └── (Configurações da empresa)
├── Cartão Ponto Customizável ❌
├── Alertas ❌
├── Situação Reps ❌
├── Situação Registradores em Massa ❌
└── Cerca Virtual ❌ (Geolocalização)
```

**Status:** Pontize NÃO TEM NENHUMA configuração (0/6)

### ANÁLISE:

**Configurações que Faltam:**
1. **Parâmetro Geral** - Tolerância, jornada padrão, intervalo, etc
2. **Cartão Ponto Customizável** - Layout do cartão de ponto
3. **Alertas** - Configurar alertas do sistema
4. **Situação Reps** - Status de relógios de ponto
5. **Situação Registradores em Massa** - Sincronização de registradores
6. **Cerca Virtual** - Geolocalização para validar local de trabalho

---

## 🔴 SEÇÃO 3: MANUTENÇÃO/OPERAÇÃO

### PONTOFOPAG TEM:

```
├── Marcação ✅ (Pontize tem POST)
├── Manutenção Diária ⚠️
├── Mudança de Horário ❌
├── Recalcular Marcações ❌
├── Transferência de Bilhetes ❌
├── Funcionário Excluído ❌
├── Mudança de Código do Funcionário ❌
├── Importação de AFD ❌
├── Rep (Sincronização) ❌
├── Lançamentos em Lote ❌
└── Fechamento Ponto ❌
```

### ANÁLISE:

**O Que Pontize TEM:**
- POST /v1/marcacoes (registrar marcação) ✅

**O Que Falta (CRÍTICO):**
1. **Manutenção Diária** - Ajustes diários de marcações
2. **Mudança de Horário** - Alterar horário de um colaborador
3. **Recalcular Marcações** - Recalcular horas após alteração
4. **Transferência de Bilhetes** - Transferir bilhetes entre colaboradores
5. **Funcionário Excluído** - Processar exclusão
6. **Mudança de Código do Funcionário** - Alterar identificação
7. **Importação de AFD** - Importar dados de aparelhos
8. **Sincronização REP** - Sincronizar relógios
9. **Lançamentos em Lote** - Processar múltiplos lançamentos
10. **Fechamento Ponto** - Fechar períodos de marcação

---

## 🔴 SEÇÃO 4: RELATÓRIOS

### PONTOFOPAG TEM:

```
RELATÓRIOS → Cadastrais
├── Funcionário ❌
├── Histórico ❌
├── Horário ❌
└── Crachá QRCode ❌

RELATÓRIOS → Específicos
├── Afastamento ❌
├── Banco de Horas ❌
├── Fechamento por Percentual de Horas Extras ❌
├── Relatório de Compensação ❌
├── Cartão Ponto ❌
├── Espelho ❌
└── Manutenção Diária ❌

RELATÓRIOS → Detalhados
├── Horas Extras ⚠️ (Pontize tem função, não integrada)
├── Intervalos ❌
├── Ocorrência ❌
├── Presença ⚠️ (Pontize tem "comparecimento")
├── Absenteísmo ❌
├── Inconsistências ❌
├── Abonos ❌
├── Registros ❌
└── Bloqueio/Conclusão Painel do RH ❌
```

### ANÁLISE:

**Pontize TEM:**
- GET /v1/relatorios/horas-mes (simplista)
- GET /v1/relatorios/comparecimento (presença básica)
- GET /v1/relatorios/producao (simplista)

**Faltam (CRÍTICO):**
1. **Relatórios Cadastrais** - Funcionário, Histórico, Horário, Crachá (4)
2. **Afastamento** - Relatório de afastamentos
3. **Banco de Horas** - Saldo e movimentação
4. **Fechamento por % de Extras** - Por percentual de horas extras
5. **Compensação** - Relatório de compensação
6. **Cartão Ponto** - Espelho do cartão
7. **Espelho** - Detalhado de marcações
8. **Manutenção Diária** - Histórico de alterações
9. **Intervalos** - Detalhe de intervalos
10. **Ocorrência** - Faltas, atrasos, etc
11. **Absenteísmo** - Taxa de ausência
12. **Inconsistências** - Alertas de problemas
13. **Abonos** - Horas abonadas
14. **Registros** - Histórico de registros
15. **Bloqueio/Conclusão RH** - Status de fechamento

**Total: 15 relatórios faltando**

---

## 🔴 SEÇÃO 5: EXPORTAÇÃO & INTEGRAÇÃO

### PONTOFOPAG TEM:

```
├── Eventos para Exportação ❌
├── Lista de Eventos ❌
├── Layout de Exportação ❌
├── Exportação Webfopag ❌
├── Exportação Txt ❌
└── Ministério do Trabalho ❌
```

**Status:** Pontize NÃO TEM NENHUMA (0/6)

### ANÁLISE:

**Faltam Completamente:**
1. **Exportação para Eventos** - Exportar eventos do ponto
2. **Lista de Eventos** - Listar eventos disponíveis
3. **Layouts Customizados** - Diferentes formatos de exportação
4. **Exportação Webfopag** - Para sistema ePays
5. **Exportação Txt** - Formato texto
6. **Exportação Ministério do Trabalho** - Formato MTE

---

## 🔴 SEÇÃO 6: BANCO DE HORAS

### PONTOFOPAG TEM:

```
├── Cadastro de Banco de Horas ❌
├── Fechamento do Banco de Horas ❌
└── Lançamento de Crédito/Débito ❌
```

**Status:** Pontize NÃO TEM (0/3)

### ANÁLISE:

**Faltam Completamente:**
1. **Cadastro de Banco** - Criar e gerenciar banco de horas
2. **Fechamento** - Fechar períodos do banco
3. **Lançamentos** - Registrar créditos e débitos

**Impacto:** CLT Art. 59 - Obrigatório para horas extras compensáveis

---

## 🔴 SEÇÃO 7: INTEGRAÇÃO & SEGURANÇA

### PONTOFOPAG TEM:

```
Integração Manual
├── Banco de Dados ❌
├── Folha de Pagamento ❌
├── ERP ❌
└── Diversos ❌

Segurança
├── Usuários e Permissões ❌
├── Auditoria ❌
├── Backup ❌
└── Logs ❌
```

**Status:** Pontize NÃO TEM (0/8)

---

## 📊 TABELA COMPARATIVA DETALHADA

| Funcionalidade | PontoFopag | Pontize | Prioridade | Esforço |
|---|---|---|---|---|
| **CADASTROS** | | | | |
| Jornada | ✅ Completa | ❌ Não existe | 🔴 CRÍTICO | Alto |
| Horário (Normal/Flex/Dinâmico) | ✅ Completa | ❌ Não existe | 🔴 CRÍTICO | Alto |
| Feriado | ✅ Completa | ❌ Não existe | 🔴 CRÍTICO | Médio |
| Afastamento | ✅ Completa | ❌ Não existe | 🟠 Alto | Alto |
| Ocorrência | ✅ Completa | ❌ Não existe | 🟠 Alto | Médio |
| Compensação | ✅ Completa | ❌ Não existe | 🟠 Alto | Médio |
| **CONFIGURAÇÕES** | | | | |
| Parâmetro Geral | ✅ Completa | ❌ Não existe | 🔴 CRÍTICO | Médio |
| Alertas do Sistema | ✅ Completa | ❌ Não existe | 🟡 Médio | Médio |
| Cerca Virtual (GPS) | ✅ Completa | ❌ Não existe | 🟡 Médio | Alto |
| **OPERAÇÃO** | | | | |
| Manutenção Diária | ✅ Completa | ⚠️ Parcial | 🟠 Alto | Médio |
| Recalcular Marcações | ✅ Completa | ❌ Não existe | 🔴 CRÍTICO | Médio |
| Mudança de Horário | ✅ Completa | ❌ Não existe | 🟠 Alto | Médio |
| Lançamentos em Lote | ✅ Completa | ❌ Não existe | 🟠 Alto | Alto |
| Fechamento Ponto | ✅ Completa | ❌ Não existe | 🔴 CRÍTICO | Alto |
| **RELATÓRIOS** | | | | |
| Horas Extras Detalhe | ✅ Completa | ⚠️ Função existe | 🔴 CRÍTICO | Baixo |
| Banco de Horas | ✅ Completa | ❌ Não existe | 🔴 CRÍTICO | Alto |
| Compensação | ✅ Completa | ❌ Não existe | 🟠 Alto | Alto |
| Intervalo Detalhe | ✅ Completa | ❌ Não existe | 🟠 Alto | Médio |
| Absenteísmo | ✅ Completa | ❌ Não existe | 🟠 Alto | Médio |
| Espelho (Cartão Ponto) | ✅ Completa | ❌ Não existe | 🟡 Médio | Médio |
| **EXPORTAÇÃO** | | | | |
| Exportação Customizada | ✅ Completa | ❌ Não existe | 🟡 Médio | Alto |
| Integração Folha | ✅ Completa | ❌ Não existe | 🟠 Alto | Alto |

---

## 🎯 MAPEAMENTO: O QUE PONTIZE PRECISA PARA IGUALAR PONTOFOPAG

### **FASE 1: CADASTROS FALTANDO (URGENTE)**

```
❌ Tabela: jornadas
   - id, empresa_id, nome, horas/dia, dias_semana, intervalo_min
   
❌ Tabela: horarios_trabalho
   - id, jornada_id, tipo (normal/flex/dinamico), entrada, saida
   
❌ Tabela: dias_uteis (feriados)
   - id, empresa_id, data, tipo (nacional/estadual/municipal)
   
❌ Tabela: afastamentos
   - id, user_id, data_inicio, data_fim, tipo (ferias/licenca/etc)
   
❌ Tabela: ocorrencias
   - id, user_id, data, tipo (falta/atraso/etc), justificada
   
❌ Tabela: compensacoes
   - id, user_id, horas_saldo, data_vencimento
   
❌ Tabela: tipos_contrato
   - CLT, PJ, Estagiário, Aprendiz
   
❌ Tabela: tipos_justificativa
   - Atestado médico, Abono, Autorização, etc
```

### **FASE 2: CONFIGURAÇÕES FALTANDO (URGENTE)**

```
❌ Tabela: empresa_config (já planejada)
   - Parâmetro geral, tolerância, jornada padrão, intervalo, etc
   
❌ Tabela: alertas_config
   - Tipos de alerta, quando disparar, destinatário
   
❌ Tabela: localizacao_config (GPS)
   - Raio de localização, pontos geográficos permitidos
```

### **FASE 3: OPERAÇÕES FALTANDO (CRÍTICO)**

```
❌ PATCH /v1/marcacoes/:id/recalcular
   - Recalcular horas após alteração de jornada
   
❌ PATCH /v1/marcacoes/bulk
   - Processar múltiplas marcações
   
❌ POST /v1/fechamento-ponto
   - Fechar período de ponto (bloqueio)
   
❌ POST /v1/manutencao-diaria
   - Ajustes manuais de marcações
```

### **FASE 4: RELATÓRIOS FALTANDO (CRÍTICO)**

```
❌ GET /v1/relatorios/espelho-ponto
   - Detalhado de cada dia do mês
   
❌ GET /v1/relatorios/banco-horas
   - Saldo e movimentação
   
❌ GET /v1/relatorios/compensacao
   - Compensação de horas
   
❌ GET /v1/relatorios/absenteismo
   - Taxa de ausência
   
❌ GET /v1/relatorios/intervalo-detalhe
   - Detalhe de cada intervalo
   
❌ GET /v1/relatorios/ocorrencias
   - Faltas, atrasos, etc
```

### **FASE 5: EXPORTAÇÃO & INTEGRAÇÃO (IMPORTANTE)**

```
❌ POST /v1/exportacao/eventos
   - Exportar eventos do ponto
   
❌ POST /v1/exportacao/folha
   - Integração com folha de pagamento
   
❌ POST /v1/exportacao/mte
   - Formato Ministério do Trabalho
   
❌ POST /v1/exportacao/customizada
   - Layouts customizáveis
```

---

## 📋 RESUMO FINAL: O QUE FALTA PARA PONTIZE = PONTOFOPAG

### **TABELAS A CRIAR: 12**
1. jornadas
2. horarios_trabalho
3. dias_uteis
4. afastamentos
5. ocorrencias
6. compensacoes
7. tipos_contrato
8. tipos_justificativa
9. alertas_config
10. localizacao_config
11. banco_horas
12. grupos_economicos

### **ENDPOINTS A CRIAR: 25+**
- 10+ de CRUD das novas tabelas
- 5+ de operações (recalcular, fechamento, etc)
- 6+ novos relatórios
- 4+ de exportação

### **FUNCIONALIDADES CRÍTICAS FALTANDO:**
1. ❌ Jornada customizável (CRÍTICO)
2. ❌ Recalcular marcações (CRÍTICO)
3. ❌ Banco de horas (CRÍTICO)
4. ❌ Fechamento de período (CRÍTICO)
5. ❌ Afastamentos (CRÍTICO)
6. ❌ Exportação (IMPORTANTE)
7. ❌ GPS/Geolocalização (IMPORTANTE)
8. ❌ Alertas do sistema (IMPORTANTE)

### **ESTIMATIVA TOTAL:**
- **Tabelas:** 12 novas
- **Endpoints:** 25+ novos
- **Relatórios:** 6+ novos
- **Tempo estimado:** 4-6 semanas
- **Complexidade:** Alta

---

## ✅ CONCLUSÃO

**Pontize tem ~25% das funcionalidades do PontoFopag**

Para igualar o PontoFopag, seria necessário:
- ✅ Implementar o plano de configurações (já documentado)
- ✅ Adicionar 12 tabelas novas
- ✅ Criar 25+ endpoints novos
- ✅ Implementar 6+ relatórios novos
- ✅ Implementar exportação/integração

**Recomendação:** Implementar as fases por prioridade (Crítica → Alta → Média)

