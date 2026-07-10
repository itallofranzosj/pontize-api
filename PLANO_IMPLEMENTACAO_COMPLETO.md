# 🏗️ PLANO DE IMPLEMENTAÇÃO COMPLETO - Sistema Pontize v2.0

**Data:** 2026-07-10  
**Status:** 📋 PLANEJAMENTO ESTRATÉGICO - SEM ALTERAÇÕES  
**Escopo:** Análise de jornadas, pontos de alteração, design, functions, telas

---

## 🎯 OVERVIEW ESTRATÉGICO

```
ANTES (Pontize v1):
├── App Trabalhador
│   └── Bater ponto (entrada/saída/intervalo)
│
├── Backend
│   └── Registrar marcações + Relatórios simples
│
└── BD
    └── Tabelas: marcacoes, profiles, unidades, setores

DEPOIS (Pontize v2):
├── App Trabalhador
│   ├── Bater ponto (com validações)
│   ├── Ver meus dados (horas, holerite, afastamentos)
│   ├── Solicitar justificativa
│   └── Consultar banco de horas
│
├── App RH/Admin
│   ├── Configurar empresa (jornadas, horários, feriados)
│   ├── Gerenciar colaboradores (com dados completos)
│   ├── Manutenção diária (ajustes de ponto)
│   ├── Processar afastamentos (férias, licenças)
│   ├── Relatórios avançados (CLT compliant)
│   └── Exportação (folha, MTE)
│
├── Backend
│   ├── APIs de CRUD (12 novas tabelas)
│   ├── APIs de Cálculos CLT
│   ├── APIs de Operações (recalcular, fechar, etc)
│   ├── APIs de Relatórios (15+ novos)
│   └── APIs de Integração/Exportação
│
└── BD
    ├── 12 novas tabelas
    ├── Histórico de alterações
    └── Auditoria completa
```

---

## 📱 JORNADAS DE USUÁRIOS & PONTOS DE ALTERAÇÃO

### **JORNADA 1: TRABALHADOR - Bater Ponto**

#### Fluxo Atual (v1):
```
Abrir App → Tela de Ponto → Botão "Entrada/Saída" → Bater → Feedback
                               (sem validações)
```

#### Fluxo Novo (v2):
```
Abrir App → Autenticar → Verificar:
                          ├── Jornada do dia (qual horário trabalha?)
                          ├── Se é feriado (descansa?)
                          ├── Se tem afastamento ativo (em férias?)
                          ├── Geolocalização (dentro da "cerca"?)
                          └── Se intervalo foi cumprido?
                          
                          → Tela de Ponto (com contexto)
                          
                          → Botões "Entrada/Saída/Intervalo"
                          
                          → Validação:
                             ├── Tolerância (±5 min ok?)
                             ├── Intervalo mínimo (1h se >6h?)
                             ├── Sequência válida (entrada→intervalo→saída?)
                             └── GPS dentro raio?
                          
                          → Registrar + Feedback detalhado
                          
                          → Sincronizar com servidor
```

**Pontos de Alteração - APP:**

| Ponto | Tipo | Alteração |
|-------|------|-----------|
| Tela Login | UI/UX | Adicionar validação de empresa/departamento |
| Tela Ponto | UI/UX | Mostrar jornada do dia, feriado, status intervalo |
| Botões Marcação | Logic | Validar jornada antes de permitir |
| Validação Entrada | Logic | Verificar se trabaja hoje (não é feriado/afastamento) |
| Validação Saída | Logic | Verificar intervalo mínimo cumprido |
| Tela Histórico | UI/UX | Mostrar detalhe completo do dia (horas, extras) |
| GPS | Feature | Implementar geolocalização (novo) |
| Notificação | Logic | Avisar se intervalo insuficiente |
| Solicitar Justificativa | UI/UX | Nova tela para justify falta/atraso (novo) |
| Meu Banco de Horas | UI/UX | Nova tela mostrando saldo (novo) |

**Pontos de Alteração - Backend API:**

| Endpoint | Alteração |
|----------|-----------|
| POST /v1/marcacoes | Validar jornada, feriado, afastamento, GPS |
| GET /v1/marcacoes | Retornar com contexto (jornada, status intervalo) |
| GET /v1/meu-perfil | Retornar jornada do dia, afastamentos, saldo banco |
| POST /v1/justificativa | Novo - Criar solicitação de justificativa |
| GET /v1/banco-horas/meu-saldo | Novo - Retornar saldo e movimentações |
| GET /v1/relatorios/meu-extrato | Novo - Retornar detalhes de um dia |

**Pontos de Alteração - BD:**

| Tabela | Alteração |
|--------|-----------|
| marcacoes | Adicionar validações (validada, motivo_rejeicao) |
| profiles | Adicionar turno_id, jornada_id, data_demissao |
| dias_uteis | Nova - Feriados |
| afastamentos | Nova - Afastamentos do colaborador |
| banco_horas | Nova - Saldo de banco |
| justificativas | Nova - Solicitações de justificativa |

---

### **JORNADA 2: RH/ADMIN - Configurar Empresa**

#### Fluxo Novo (v2 - CRÍTICO):
```
Acessar Admin → Menu Configuração → Parâmetro Geral
                                     ├── Jornada padrão (8h)
                                     ├── Intervalo mínimo (60 min)
                                     ├── Tolerância (5 min)
                                     ├── Adicional noturno (20%)
                                     ├── Adicional extra (50%)
                                     ├── Horário noturno (21-05)
                                     └── Timezone

                      → Cadastro Jornada
                        ├── Criar jornada 8h
                        ├── Definir entrada (08:00)
                        ├── Definir saída (17:00)
                        ├── Definir intervalo (12:00-13:00)
                        └── Aplicar a colaboradores

                      → Cadastro Horário
                        ├── Criar horário "Normal" (08:00-17:00)
                        ├── Criar horário "Noturno" (22:00-06:00)
                        ├── Vincular a turnos/colaboradores
                        └── Aplicar data de vigência

                      → Cadastro Feriado
                        ├── Importar feriados nacionais
                        ├── Adicionar feriados estaduais
                        ├── Adicionar feriados municipais
                        ├── Configurar se dobrado (100%)
                        └── Configurar folga compensatória

                      → Configurar Alertas
                        ├── Ativar/desativar alertas
                        ├── Destinatários
                        └── Thresholds

                      → Configurar GPS (Cerca Virtual)
                        ├── Coordenadas geográficas
                        ├── Raio de tolerância
                        └── Validar automaticamente
```

**Pontos de Alteração - TELAS ADMIN:**

| Tela | Tipo | Alteração |
|------|------|-----------|
| Dashboard Admin | UI | Adicionar menu "Configuração" |
| Parâmetro Geral | NOVO | Formulário com 10+ campos |
| Jornada | NOVO | CRUD de jornadas + visualização |
| Horário | NOVO | CRUD de horários + tipos |
| Feriado | NOVO | CRUD de feriados + importação |
| Alerta | NOVO | Configuração de alertas |
| GPS/Cerca | NOVO | Mapa interativo + raio |
| Perfil Jornada | NOVO | Mapping cargo→jornada |
| Turnos | NOVO | CRUD de turnos |
| Afastamento Tipo | NOVO | Tipos de afastamento (férias, licença, etc) |

**Pontos de Alteração - Backend API:**

| Endpoint | Tipo | Ação |
|----------|------|------|
| POST /v1/config/empresa | NOVO | Criar config geral |
| PUT /v1/config/empresa | NOVO | Atualizar config |
| GET /v1/config/empresa | NOVO | Obter config |
| POST /v1/jornadas | NOVO | CRUD jornada |
| PUT /v1/jornadas/:id | NOVO | |
| GET /v1/jornadas | NOVO | |
| DELETE /v1/jornadas/:id | NOVO | |
| POST /v1/horarios-trabalho | NOVO | CRUD horário |
| PUT /v1/horarios-trabalho/:id | NOVO | |
| GET /v1/horarios-trabalho | NOVO | |
| POST /v1/dias-uteis | NOVO | CRUD feriado |
| DELETE /v1/dias-uteis/:id | NOVO | |
| GET /v1/dias-uteis | NOVO | |
| POST /v1/alertas-config | NOVO | CRUD alertas |
| POST /v1/localizacao-config | NOVO | CRUD GPS |

**Pontos de Alteração - BD:**

| Tabela | Ação |
|--------|------|
| empresa_config | NOVA - 30 campos |
| jornadas | NOVA - 8 campos |
| horarios_trabalho | NOVA - 8 campos |
| dias_uteis | NOVA - 9 campos |
| alertas_config | NOVA - 6 campos |
| localizacao_config | NOVA - 5 campos |
| perfis_jornada | NOVA - 6 campos |

---

### **JORNADA 3: RH/ADMIN - Gerenciar Colaborador**

#### Fluxo Novo (v2):
```
Acessar Admin → Menu Colaboradores → Selecionar Colaborador
                                     
                                     → Aba "Dados Pessoais"
                                        ├── Nome, CPF, Matrícula
                                        ├── Salário (novo)
                                        ├── Banco/Agência (novo)
                                        ├── Centro de Custo (novo)
                                        └── Documento (novo)
                                     
                                     → Aba "Trabalho"
                                        ├── Cargo
                                        ├── Setor
                                        ├── Jornada (associar)
                                        ├── Turno (associar)
                                        ├── Data Admissão
                                        ├── Data Demissão (novo)
                                        ├── Tipo Contrato (novo - CLT/PJ)
                                        └── Ativo/Inativo
                                     
                                     → Aba "Afastamentos"
                                        ├── Listar afastamentos ativos
                                        ├── Adicionar afastamento (novo)
                                        ├── Definir tipo (férias, licença)
                                        ├── Definir período
                                        └── Bloqueia ponto? (sim/não)
                                     
                                     → Aba "Banco de Horas"
                                        ├── Saldo atual
                                        ├── Data vencimento
                                        ├── Histórico movimentação
                                        ├── Lançar crédito (novo)
                                        └── Lançar débito (novo)
                                     
                                     → Aba "Ocorrências"
                                        ├── Listar faltas/atrasos
                                        ├── Registrar ocorrência (novo)
                                        ├── Justificar (novo)
                                        └── Descontar horas (auto)
                                     
                                     → Histórico Alterações (novo)
                                        └── Auditoria completa
```

**Pontos de Alteração - TELAS:**

| Tela | Tipo | Alteração |
|------|------|-----------|
| Lista Colaboradores | UI | Adicionar filtros (ativo, turno, jornada) |
| Detalhe Colaborador | UI | Expandir para 6 abas |
| Aba Dados Pessoais | NEW | Adicionar 3 campos (salário, banco, documento) |
| Aba Trabalho | MOD | Adicionar jornada, turno, data demissão, contrato |
| Aba Afastamento | NEW | CRUD afastamentos |
| Aba Banco Horas | NEW | Mostrar saldo + lançar crédito/débito |
| Aba Ocorrência | NEW | CRUD ocorrências + justificativa |
| Histórico Alterações | NEW | Timeline de mudanças (auditoria) |

**Pontos de Alteração - Backend:**

| Endpoint | Tipo | Ação |
|----------|------|------|
| PUT /v1/colaboradores/:id | MOD | Adicionar novos campos |
| POST /v1/afastamentos | NEW | CRUD |
| GET /v1/afastamentos | NEW | |
| POST /v1/ocorrencias | NEW | CRUD |
| GET /v1/ocorrencias | NEW | |
| POST /v1/banco-horas/lancar | NEW | Crédito/Débito |
| GET /v1/colaboradores/:id/historico | NEW | Auditoria |

**Pontos de Alteração - BD:**

| Tabela | Alteração |
|--------|-----------|
| profiles | +5 campos (salário, banco, demissão, contrato, documento) |
| afastamentos | NOVA |
| ocorrencias | NOVA |
| banco_horas | NOVA |
| auditoria_log | NOVA - Rastreia todas as alterações |

---

### **JORNADA 4: RH/ADMIN - Manutenção Diária**

#### Fluxo Novo (v2 - OPERACIONAL):
```
Acessar Admin → Menu Manutenção → Manutenção Diária
                                  
                                  → Selecionar Dia/Colaborador
                                  
                                  → Ver marcações do dia:
                                     ├── 08:15 - Entrada
                                     ├── 12:00 - Saída Intervalo
                                     ├── 13:00 - Volta Intervalo
                                     └── 17:30 - Saída
                                  
                                  → Sistema calcula:
                                     ├── Horas trabalhadas: 8.25h
                                     ├── Intervalo: 1h ✓
                                     ├── Horas extras: 0.25h
                                     ├── Status: OK
                                     └── Alertas: Nenhum
                                  
                                  → RH pode:
                                     ├── Editar entrada/saída (novo)
                                     ├── Adicionar marcação (novo)
                                     ├── Deletar marcação (novo)
                                     ├── Justificar falta (novo)
                                     └── Ao fazer qualquer mudança:
                                        └── Sistema recalcula automaticamente!
```

**Pontos de Alteração - TELAS:**

| Tela | Tipo | Alteração |
|------|------|-----------|
| Manutenção Diária | NEW | Tela de busca dia/colaborador |
| Visualizador Dia | NEW | Card mostrando marcações + cálculos |
| Editor Marcação | NEW | Editar entrada/saída com timestamp |
| Adicionar Marcação | NEW | Form para criar marcação manual |
| Justificativa Modal | NEW | Modal para justificar |
| Histórico Mudanças | NEW | Mostrar o que foi alterado |

**Pontos de Alteração - Backend:**

| Endpoint | Tipo | Ação |
|----------|------|------|
| PATCH /v1/marcacoes/:id | MOD | Editar + recalcular |
| DELETE /v1/marcacoes/:id | NEW | Deletar com recalcular |
| POST /v1/marcacoes/manual | NEW | Criar marcação manual |
| POST /v1/recalcular-dia | NEW | Recalcular um dia completo |
| POST /v1/justificativa/criar | NEW | Criar justificativa |

**Função Crítica - Recalcular:**

```typescript
async function recalcularDia(user_id, data) {
  // 1. Buscar todas as marcações do dia
  const marcacoes = await getMarcacoesDia(user_id, data);
  
  // 2. Buscar configurações da empresa
  const config = await getEmpresaConfig(user_id);
  const jornada = await getJornada(user_id, data);
  
  // 3. Executar funções CLT
  const horas = calcularHorasDia(marcacoes);
  const extras = detectarHorasExtras(horas.total);
  const intervalo = validarIntervalo(horas.total, horas.intervalo);
  const noturno = detectarTrabalhoNoturno(marcacoes);
  
  // 4. Atualizar BD com novos valores
  await updateMarcacoesDia({
    user_id,
    data,
    horas_trabalhadas: horas.total,
    horas_extras: extras.horas,
    intervalo_minutos: horas.intervalo,
    alertas: [intervalo.alerta, ...],
    ultima_recalculo: now()
  });
  
  // 5. Log de auditoria
  await logAuditoria({
    tipo: 'recalculo_dia',
    user_id,
    data,
    usuario_responsavel: authedUser.id,
    mudancas: { antes: old, depois: new }
  });
  
  // 6. Notificar RH/Colaborador se houver alertas
  if (alertas.length > 0) {
    await enviarNotificacao(user_id, alertas);
  }
}
```

**Pontos de Alteração - BD:**

| Tabela | Alteração |
|--------|-----------|
| marcacoes | +5 campos (horas_trabalhadas, horas_extras, intervalo_minutos, alertas, ultima_recalculo) |
| auditoria_log | NOVA - Log de todas as mudanças |

---

### **JORNADA 5: RH/ADMIN - Processar Afastamentos**

#### Fluxo Novo (v2):
```
Acessar Admin → Menu Afastamentos
                                  
                                  → Listar afastamentos ativos
                                     ├── Colaborador
                                     ├── Tipo (férias, licença)
                                     ├── Período
                                     └── Status (Ativo/Finalizado)
                                  
                                  → Criar afastamento (novo)
                                     ├── Colaborador
                                     ├── Tipo (dropdown)
                                     ├── Data início
                                     ├── Data término
                                     ├── Calcular dias automaticamente
                                     ├── Remunerado? (sim/não)
                                     ├── Bloqueia ponto? (sim/não)
                                     └── Salvar
                                  
                                  → Sistema faz:
                                     ├── Criar registro de afastamento
                                     ├── Bloquear marcações no período ✓
                                     ├── Notificar colaborador
                                     ├── Registrar em auditoria
                                     └── Ajustar cálculos (não conta horas)
                                  
                                  → Ao terminar afastamento:
                                     ├── Marcar como finalizado
                                     ├── Desbloquear dias
                                     └── Calcular proporcional
```

**Pontos de Alteração - TELAS:**

| Tela | Tipo | Alteração |
|------|------|-----------|
| Lista Afastamentos | NEW | Listar com filtros |
| Criar Afastamento | NEW | Form detalhado |
| Editor Afastamento | NEW | Editar período/tipo |
| Validação Período | NEW | Alertar se sobrepõe outro |

**Pontos de Alteração - Backend:**

| Endpoint | Tipo | Ação |
|----------|------|------|
| POST /v1/afastamentos | NEW | Criar |
| PUT /v1/afastamentos/:id | NEW | Editar |
| DELETE /v1/afastamentos/:id | NEW | Deletar |
| GET /v1/afastamentos | NEW | Listar |
| POST /v1/afastamentos/:id/finalizar | NEW | Encerrar |

**Lógica de Validação:**

```typescript
async function criarAfastamento(payload) {
  // 1. Validar overlapping
  const jaExiste = await checkOverlap(
    payload.user_id,
    payload.data_inicio,
    payload.data_fim
  );
  if (jaExiste) throw new Error('Afastamento sobrepõe outro');
  
  // 2. Validar tipo
  const tipo = await getTipoAfastamento(payload.tipo_id);
  if (!tipo) throw new Error('Tipo inválido');
  
  // 3. Calcular dias
  const dias = contarDiasUteis(payload.data_inicio, payload.data_fim);
  
  // 4. Criar registro
  const afastamento = await db.afastamentos.insert({
    ...payload,
    dias_totais: dias,
    status: 'ativo',
    criado_em: now()
  });
  
  // 5. Bloquear marcações no período
  if (payload.bloqueia_ponto) {
    await db.marcacoes.update(
      { user_id: payload.user_id, data entre inicio/fim },
      { bloqueado: true, motivo_bloqueio: afastamento.id }
    );
  }
  
  // 6. Notificar
  await enviarNotificacao(payload.user_id, 
    `Afastamento criado: ${tipo.nome} de ${data_inicio} a ${data_fim}`);
  
  return afastamento;
}
```

**Pontos de Alteração - BD:**

| Tabela | Alteração |
|--------|-----------|
| afastamentos | NOVA |
| tipos_afastamento | NOVA - Catálogo de tipos |
| marcacoes | +1 campo (bloqueado_por_afastamento) |

---

### **JORNADA 6: RH/ADMIN - Fechamento de Período**

#### Fluxo Novo (v2 - CRÍTICO):
```
Acessar Admin → Menu Manutenção → Fechamento Ponto
                                  
                                  → Selecionar Período (Mês/Ano)
                                  
                                  → Sistema verifica:
                                     ├── Todas marcações registradas?
                                     ├── Todos os dias processados?
                                     ├── Alertas resolvidos?
                                     └── Horas extras aprovadas?
                                  
                                  → Mostrar Resumo:
                                     ├── Total colaboradores: 50
                                     ├── Marcações processadas: 1.250
                                     ├── Alertas pendentes: 3
                                     ├── Horas extras: 45h
                                     ├── Banco de horas variação: +12h
                                     └── Status: ⚠️ 3 alertas antes de fechar
                                  
                                  → RH resolve alertas ou força fechamento
                                  
                                  → Ao clicar "Fechar":
                                     ├── Bloquear alterações no período
                                     ├── Gerar relatórios finais
                                     ├── Calcular acertos (proporcional)
                                     ├── Registrar em auditoria
                                     ├── Disponibilizar para exportação
                                     └── Notificar gestores
                                  
                                  → Período fecha:
                                     ├── ✓ Sem possibilidade de alterar
                                     ├── ✓ Pronto para folha
                                     └── ✓ Auditável
```

**Pontos de Alteração - TELAS:**

| Tela | Tipo | Alteração |
|------|------|-----------|
| Fechamento Ponto | NEW | Seletor período + resumo |
| Pré-Fechamento | NEW | Checklist de validações |
| Aviso Alertas | NEW | Modal com alertas não resolvidos |
| Confirmação | NEW | Confirmar fechamento |
| Relatório Fechamento | NEW | Gerar documento final |

**Pontos de Alteração - Backend:**

| Endpoint | Tipo | Ação |
|----------|------|------|
| POST /v1/fechamento-ponto | NEW | Criar/validar |
| GET /v1/fechamento-ponto/:mes/:ano | NEW | Status |
| PUT /v1/fechamento-ponto/:mes/:ano/confirmar | NEW | Confirmar fechamento |
| GET /v1/fechamento-ponto/:mes/:ano/relatorio | NEW | Gerar relatório |

**Lógica de Fechamento:**

```typescript
async function fecharPeriodo(mes, ano) {
  // 1. Validar período
  const jaFechado = await checkFechado(mes, ano);
  if (jaFechado) throw new Error('Período já fechado');
  
  // 2. Buscar todos colaboradores
  const colabs = await db.profiles.findAll({ ativo: true });
  
  // 3. Para cada colaborador, validar:
  const alertas = [];
  for (const colab of colabs) {
    // 3.1 Há falta sem justificar?
    const faltas = await getFaltasNaoJustificadas(colab.id, mes, ano);
    if (faltas.length > 0) {
      alertas.push(`${colab.nome}: ${faltas.length} faltas sem justificativa`);
    }
    
    // 3.2 Há intervalo insuficiente?
    const intervalos = await getIntervaloInsuficiente(colab.id, mes, ano);
    if (intervalos.length > 0) {
      alertas.push(`${colab.nome}: ${intervalos.length} dias com intervalo < mínimo`);
    }
    
    // 3.3 Horas extras não aprovadas?
    const extras = await getExtrasNaoAprovadas(colab.id, mes, ano);
    if (extras.length > 0) {
      alertas.push(`${colab.nome}: ${extras.length}h extras não aprovadas`);
    }
  }
  
  // 4. Se há alertas, retornar sem fechar
  if (alertas.length > 0) {
    return {
      status: 'alerta',
      alertas,
      permitir_forcado: true
    };
  }
  
  // 5. Bloquear período
  await db.marcacoes.update(
    { empresa_id, entre mes/ano },
    { periodo_fechado: true, data_fechamento: now() }
  );
  
  // 6. Gerar relatório final
  const relatorio = await gerarRelatórioFinal(mes, ano);
  
  // 7. Log auditoria
  await logAuditoria({
    tipo: 'fechamento_periodo',
    mes, ano,
    usuario: authedUser.id,
    alertas_resolvidos: alertas.length
  });
  
  return {
    status: 'sucesso',
    periodo_fechado: true,
    relatorio
  };
}
```

**Pontos de Alteração - BD:**

| Tabela | Alteração |
|--------|-----------|
| marcacoes | +2 campos (periodo_fechado, data_fechamento) |
| periodo_fechamento | NOVA - Registro de fechamentos |

---

## 📊 TABELA CONSOLIDADA: O QUE MUDA

### **Por Tipo de Alteração:**

```
TELAS/UI:
├── App Trabalhador: +10 novas telas/modais
├── App Admin: +15 novas telas/modals
└── Dashboard: +5 novos widgets

APIS BACKEND:
├── Novos endpoints: 50+
├── Endpoints modificados: 10
└── Funções CLT: 6 (já implementadas, integrar)

BANCO DE DADOS:
├── Novas tabelas: 12
├── Tabelas modificadas: 5
├── Novos campos: 50+
└── Índices: 15+

FUNÇÕES CRÍTICAS:
├── recalcularDia()
├── fecharPeriodo()
├── validarAfastamento()
├── calcularBancoHoras()
├── processarOcorrencia()
└── gerarRelatório()

INTEGRAÇÕES:
├── Notificações (push/email)
├── GPS/Geolocalização
├── Sincronização automática
└── Exportação (folha, MTE)
```

---

## 🎯 RESUMO: O QUE SERÁ FEITO E COMO

### **FASE 1: CONFIGURAÇÕES (Semana 1-2)**

**O QUE:**
- Criar 6 tabelas de configuração
- Criar 15 endpoints de CRUD
- Criar 8 telas de admin

**COMO:**
```
1. BD: Criar schemas (empresa_config, jornadas, horarios, dias_uteis, alertas, gps)
2. Backend: Implementar CRUD endpoints com validações Zod
3. Frontend Admin: Criar telas com formulários + validação
4. Testes: Unit + integração para cada função
5. Deploy: Migrate BD + Deploy APIs
```

**Dependências:** Nenhuma

---

### **FASE 2: COLABORADOR AVANÇADO (Semana 2-3)**

**O QUE:**
- Expandir profiles com 8 novos campos
- Criar tabela de afastamentos
- Criar tabela de ocorrências
- Criar 10+ novas telas admin

**COMO:**
```
1. BD: Criar tabelas (afastamentos, ocorrencias, tipos_*)
2. BD: Adicionar campos a profiles
3. Backend: CRUD endpoints + validações
4. Backend: Lógica de validação (sobrepõe? bloqueia ponto?)
5. Frontend: Telas de gestão de colaborador (6 abas)
6. Testes: Validação de sobrepõe, bloqueio, cascata
```

**Dependências:** Fase 1 (precisa de config geral)

---

### **PHASE 3: OPERAÇÕES CRÍTICAS (Semana 3-4)**

**O QUE:**
- Implementar `recalcularDia()`
- Implementar `fecharPeriodo()`
- Criar telas de manutenção

**COMO:**
```
1. Backend: Implementar função recalcularDia()
   └── Buscar marcações + config → CLT functions → Update BD
2. Backend: Implementar função fecharPeriodo()
   └── Validar alertas → Bloquear período → Log auditoria
3. Frontend: Tela de manutenção diária (buscar, editar, recalcular)
4. Frontend: Tela de fechamento (resumo + confirmação)
5. Testes: Edge cases (overlapping, recalcular em cascata)
6. Auditoria: Log completo de cada operação
```

**Dependências:** Fase 2 (precisa de dados completos)

---

### **PHASE 4: BANCO DE HORAS (Semana 4)**

**O QUE:**
- Criar tabela banco_horas
- Implementar cálculo de saldo
- Criar operações de crédito/débito

**COMO:**
```
1. BD: Criar tabela banco_horas (saldo, data_vencimento, historico)
2. Backend: Função calcularSaldoBanco()
   └── Buscar extras → Descontar compensações → Calcular saldo
3. Backend: Endpoints para lançar crédito/débito
4. Backend: Validar vencimento (aviso 30 dias antes)
5. Frontend: Tela de saldo + histórico movimentações
6. Testes: Vencimento, cascata de compensações
```

**Dependências:** Fase 3 (precisa de cálculos de extras)

---

### **PHASE 5: RELATÓRIOS AVANÇADOS (Semana 5-6)**

**O QUE:**
- Implementar 6 novos relatórios CLT-compliant
- Integrar funções de cálculo existentes

**COMO:**
```
1. Backend: Para cada relatório:
   └── GET /v1/relatorios/[tipo]
   └── Buscar dados + aplicar cálculos CLT
   └── Retornar com alertas/validações
2. Relatórios a implementar:
   ├── GET /v1/relatorios/horas-dia (detalhado)
   ├── GET /v1/relatorios/horas-mes (com extras)
   ├── GET /v1/relatorios/banco-horas
   ├── GET /v1/relatorios/absenteismo
   ├── GET /v1/relatorios/intervalo-detalhe
   └── GET /v1/relatorios/validacao-clt (compliance)
3. Frontend: Telas de relatórios com filtros/exportação
4. Testes: Validar cálculos contra casos reais
```

**Dependências:** Fase 4

---

### **PHASE 6: APP TRABALHADOR (Semana 6-7)**

**O QUE:**
- Adicionar validações ao bater ponto
- Novas telas de consulta
- GPS/Geolocalização

**COMO:**
```
1. Frontend App: Modificar tela de ponto
   ├── Validar jornada do dia (via API)
   ├── Validar afastamento ativo
   ├── Validar intervalo mínimo
   ├── Integrar GPS (novo)
   └── Mostrar contexto (horário, status)
2. Frontend App: Novas telas
   ├── Ver meu extrato (horas, extras, banco)
   ├── Solicitar justificativa (novo)
   ├── Ver banco de horas (novo)
   └── Histórico de marcações
3. Backend: APIs de suporte
   ├── GET /v1/meu-perfil
   ├── GET /v1/meu-banco-horas
   ├── POST /v1/solicitar-justificativa
   └── GET /v1/relatorios/meu-extrato
4. GPS: Implementar validação geolocalização
   └── Calcular distância → Validar dentro raio
5. Notificações: Push quando intervalo insuficiente
```

**Dependências:** Fase 5

---

### **PHASE 7: EXPORTAÇÃO & INTEGRAÇÕES (Semana 7-8)**

**O QUE:**
- Implementar 6 tipos de exportação
- Integração com folha de pagamento

**COMO:**
```
1. Backend: Criar exportadores
   ├── ExportadorWebfopag() → XML
   ├── ExportadorTxt() → Texto delimitado
   ├── ExportadorMTE() → Formato Ministério
   ├── ExportadorFolha() → CSV para DP
   └── ExportadorCustomizado() → Layout do cliente
2. Backend: Endpoints
   ├── POST /v1/exportacao/webfopag
   ├── POST /v1/exportacao/txt
   ├── POST /v1/exportacao/mte
   ├── POST /v1/exportacao/folha
   └── POST /v1/exportacao/customizada
3. Frontend: Telas de exportação
   ├── Seletor período
   ├── Seletor colaboradores
   ├── Preview dos dados
   └── Download/Enviar
4. Testes: Validar formato de cada exportador
```

**Dependências:** Fase 5

---

### **PHASE 8: SEGURANÇA & AUDITORIA (Semana 8)**

**O QUE:**
- Implementar auditoria completa
- Roles e permissões
- Backup automático

**COMO:**
```
1. BD: Criar tabela auditoria_log
   └── O QUE, QUEM, QUANDO, ANTES, DEPOIS
2. Middleware: Log automático em todas operações críticas
   ├── Mudança de jornada
   ├── Alteração de marcação
   ├── Criação afastamento
   ├── Fechamento período
   └── Mudança de config
3. Authorization: Implementar roles
   ├── admin (tudo)
   ├── manager (relatórios, justificar)
   ├── rh (operações, sem deletar)
   ├── trabalhador (ver seus dados)
   └── Por endpoint validar role
4. Backup: Script automático daily
5. Tests: Validar que todas ações são logadas
```

**Dependências:** Todas as fases

---

## 🔄 CRONOGRAMA COMPLETO

```
SEMANA 1-2: Configurações + Tabelas         (12 pontos)
SEMANA 2-3: Gestão Colaborador              (10 pontos)
SEMANA 3-4: Operações Críticas              (13 pontos)
SEMANA 4:   Banco de Horas                  (8 pontos)
SEMANA 5-6: Relatórios                      (13 pontos)
SEMANA 6-7: App Trabalhador                 (10 pontos)
SEMANA 7-8: Exportação                      (8 pontos)
SEMANA 8:   Auditoria & Security            (5 pontos)
-------------------------------------------
TOTAL:      8 semanas | 79 story points     (2 meses)
```

---

## 📋 RESUMO FINAL: O QUE SERÁ FEITO E COMO

| O QUE | COMO | QUANDO | PRIORIDADE |
|-------|------|--------|-----------|
| **Tabelas Config** | 6 schemas SQL + índices | Semana 1 | 🔴 CRÍTICO |
| **CRUD Config** | 15 endpoints + Zod + Tests | Semana 1-2 | 🔴 CRÍTICO |
| **Telas Admin** | 8+ telas React/Vue | Semana 2 | 🟠 ALTO |
| **Colaborador Avançado** | 6 abas, validações cascata | Semana 2-3 | 🟠 ALTO |
| **recalcularDia()** | Função + integração APIs | Semana 3 | 🔴 CRÍTICO |
| **fecharPeriodo()** | Função + validações + log | Semana 3-4 | 🔴 CRÍTICO |
| **Banco de Horas** | Tabela + cálculos + UI | Semana 4 | 🟠 ALTO |
| **6 Relatórios** | GET endpoints + gráficos | Semana 5-6 | 🟠 ALTO |
| **App Trabalhador** | Validações + GPS + Notif | Semana 6-7 | 🟡 MÉDIO |
| **Exportação 6x** | Exportadores + formatadores | Semana 7-8 | 🟡 MÉDIO |
| **Auditoria** | Middleware + Log table | Semana 8 | 🟡 MÉDIO |

---

## ✅ RESULTADO ESPERADO

Ao final: **Pontize v2.0 com 100% das funcionalidades do ePays (mínimo) + CLT-compliant + Auditável**

