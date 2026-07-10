# 🎨 MAPA DE TELAS & FUNÇÕES - Onde Tudo Fica

**Data:** 2026-07-10  
**Status:** 📋 PLANEJAMENTO - SEM ALTERAÇÕES  
**Objetivo:** Mostrar exatamente onde cada função fica em cada tela

---

## 📱 ESTRUTURA GERAL DO SISTEMA

```
┌─────────────────────────────────────────────────────┐
│          APLICAÇÕES DO PONTIZE v2.0                 │
├─────────────────────────────────────────────────────┤
│                                                     │
│  ┌──────────────────┐      ┌──────────────────┐    │
│  │  APP TRABALHADOR │      │  APP ADMIN/RH    │    │
│  │  (Mobile/Web)    │      │  (Web Desktop)   │    │
│  └──────────────────┘      └──────────────────┘    │
│         │                           │               │
│         └───────────┬───────────────┘               │
│                     │                               │
│              ┌──────▼──────┐                        │
│              │   BACKEND   │                        │
│              │   (APIs)    │                        │
│              └──────┬──────┘                        │
│                     │                               │
│              ┌──────▼──────┐                        │
│              │  SUPABASE   │                        │
│              │  (BD + Auth)│                        │
│              └─────────────┘                        │
│                                                     │
└─────────────────────────────────────────────────────┘
```

---

## 📱 APP TRABALHADOR - Mapa de Telas

```
┌─────────────────────────────────────┐
│     LOGIN / AUTENTICAÇÃO            │
├─────────────────────────────────────┤
│ [Entrar com Email]                  │
│ [Entrar com Biometria]              │
│ [2FA Code]                          │
│                                     │
│ FUNÇÕES:                            │
│ • validarCredenciais()              │
│ • verificarMFA()                    │
│ • buscarDadosUsuario()              │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────┐
│    TELA INICIAL / DASHBOARD         │
├─────────────────────────────────────┤
│ Olá, João Silva!                    │
│ ┌─────────────────────────────────┐ │
│ │ Hoje: 10/07/2026 (Quarta-feira) │ │
│ │ Jornada: 08:00 - 17:00          │ │
│ │ Status: Trabalhando             │ │
│ │ Horas: 2h 30m                   │ │
│ └─────────────────────────────────┘ │
│                                     │
│ [ENTRADA]  [SAÍDA]  [INTERVALO]    │
│                                     │
│ ┌─────────────────────────────────┐ │
│ │ Marcações de Hoje:              │ │
│ │ 08:10 - Entrada                 │ │
│ │ 12:00 - Saída Intervalo         │ │
│ │ 13:00 - Volta Intervalo         │ │
│ └─────────────────────────────────┘ │
│                                     │
│ FUNÇÕES CHAMADAS:                   │
│ • getMeuPerfil()                    │
│ • getJornadaHoje()                  │
│ • getMarcacoesHoje()                │
│ • verificarAfastamento()            │
│ • verificarFeriado()                │
│ • calcularHorasAteAgora()           │
│ • getAlertas()                      │
└────────────┬────────────────────────┘
    ┌────────┼────────────────────────┐
    │        │                        │
    ▼        ▼                        ▼
┌──────┐ ┌──────┐ ┌────────────────┐
│TELA  │ │TELA  │ │ MENU PRINCIPAL │
│ENTRADA│ │SAÍDA │ │ (TABS)        │
└──────┘ └──────┘ └────────────────┘
    │        │           │
    ▼        ▼           ▼
┌──────────────────────────────────────┐
│ • VER EXTRATO (MEU PONTO)            │
│ • JUSTIFICAR FALTA                   │
│ • BANCO DE HORAS (SALDO)             │
│ • CONFIGURAÇÕES                      │
│ • PERFIL                             │
└──────────────────────────────────────┘
```

### **TELA 1: LOGIN / 2FA**

**Localização:** Primeira tela ao abrir app

**Componentes:**
```
┌─────────────────────────────────┐
│ PONTIZE                         │
│                                 │
│ Email: [____________________]   │
│ Senha: [____________________]   │
│                                 │
│ [Entrar com Email]              │
│ [Usar Biometria]                │
│                                 │
│ Esqueceu a senha?               │
│                                 │
│ ────────────────────────────    │
│ 2FA (se habilitado):            │
│                                 │
│ Código (6 dígitos): [______]    │
│ [Verificar]                     │
└─────────────────────────────────┘
```

**Funções Chamadas:**
| Função | Quando | O Que Faz |
|--------|--------|-----------|
| `validarCredenciais()` | Ao clicar "Entrar" | Valida email/senha contra Supabase |
| `verificarMFA()` | Ao clicar "Verificar" | Valida código 2FA |
| `getMeuPerfil()` | Após login bem-sucedido | Busca dados do usuário (nome, empresa) |
| `getJornada()` | Após login | Busca jornada do usuário |
| `getFeriado()` | Após login | Verifica se hoje é feriado |
| `getAfastamento()` | Após login | Verifica se está em afastamento |

---

### **TELA 2: PONTO (DASHBOARD PRINCIPAL)**

**Localização:** Tela inicial após login

**Componentes:**
```
┌──────────────────────────────────────┐
│ ◀  PONTIZE              ⚙️  👤       │
├──────────────────────────────────────┤
│                                      │
│  10 JUL 2026 (QUARTA-FEIRA)         │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ STATUS: TRABALHANDO            │  │
│  │ Jornada: 08:00 - 17:00         │  │
│  │ Horas até agora: 2h 30min      │  │
│  │ Intervalo: 12:00 - 13:00 ✓     │  │
│  └────────────────────────────────┘  │
│                                      │
│         [ENTRADA]  [SAÍDA]           │
│                                      │
│         [INTERVALO]                  │
│                                      │
│  ┌────────────────────────────────┐  │
│  │ HOJE:                          │  │
│  │ 08:10 Entrada                  │  │
│  │ 12:00 Saída Int.               │  │
│  │ 13:00 Volta Int.               │  │
│  └────────────────────────────────┘  │
│                                      │
│  ⚠️ Nenhum alerta                    │
│                                      │
├──────────────────────────────────────┤
│ [EXTRATO] [JUSTIF] [BANCO] [CONFIG] │
└──────────────────────────────────────┘
```

**Funções Chamadas:**
| Função | Local | Descrição |
|--------|-------|-----------|
| `getMeuPerfil()` | Header | Nome, foto, empresa |
| `getJornadaHoje()` | Card Status | Jornada do dia (08:00-17:00) |
| `verificarAfastamento()` | Card Status | Se está em férias/licença |
| `verificarFeriado()` | Card Status | Se é feriado (muda cor) |
| `getMarcacoesHoje()` | Lista marcações | Entrada, saída, intervalo |
| `calcularHorasAteAgora()` | Card Status | Horas trabalhadas em tempo real |
| `validarIntervalo()` | Card Status | Verifica se intervalo é ✓ |
| `verificarGeolocalização()` | Ao bater | Valida GPS dentro raio |
| `verificarTolerancia()` | Ao bater | Valida ±5 minutos |
| `verificarSequencia()` | Ao bater | Entrada→Intervalo→Saída |
| `registrarMarcacao()` | POST | Salva no BD |
| `getAlertas()` | Card Alertas | Mostra avisos (intervalo insuf.) |

---

### **TELA 3: BATER PONTO (MODAL ENTRADA)**

**Localização:** Modal ao clicar [ENTRADA]

**Componentes:**
```
┌──────────────────────────────────────┐
│ X  REGISTRAR ENTRADA                 │
├──────────────────────────────────────┤
│                                      │
│ Data/Hora: 10/07/2026 08:15:30      │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ VALIDAÇÃO:                     │  │
│ │ ✓ Jornada: 08:00 - 17:00      │  │
│ │ ✓ Geolocalização: OK          │  │
│ │ ✓ Tolerância: 15 min OK        │  │
│ │ ✓ Não é feriado               │  │
│ │ ✓ Não está afastado           │  │
│ └────────────────────────────────┘  │
│                                      │
│ [CONFIRMAR ENTRADA]                  │
│ [CANCELAR]                           │
│                                      │
└──────────────────────────────────────┘
```

**Funções Chamadas:**
| Função | Quando | O Que Faz |
|--------|--------|-----------|
| `verificarJornada()` | Ao abrir modal | Valida se trabalha hoje |
| `verificarFeriado()` | Ao abrir modal | Se é feriado = não permite |
| `verificarAfastamento()` | Ao abrir modal | Se está em afastamento = não permite |
| `verificarGeolocalização()` | Ao abrir modal | Calcula distância GPS |
| `verificarTolerancia()` | Ao abrir modal | Verifica ±5 minutos |
| `verificarSequencia()` | Ao abrir modal | Entrada sem saída anterior? |
| `registrarMarcacao()` | Ao confirmar | POST /v1/marcacoes |
| `calcularHorasAteAgora()` | Após registrar | Atualiza horas em tempo real |
| `notificarAlerta()` | Se houver | Push notification |

---

### **TELA 4: VER EXTRATO (MEU PONTO)**

**Localização:** Aba "EXTRATO" no bottom menu

**Componentes:**
```
┌──────────────────────────────────────┐
│ ◀  MINHA JORNADA                     │
├──────────────────────────────────────┤
│ JULHO 2026                           │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ Total Mês: 160h 15m            │  │
│ │ Meta: 160h                      │  │
│ │ Diferença: +15m                 │  │
│ │ Horas Extras: 5h 30m            │  │
│ └────────────────────────────────┘  │
│                                      │
│ DETALHES POR DIA:                    │
│ ┌────────────────────────────────┐  │
│ │ 10 (Hoje) - Quarta             │  │
│ │ Entrada: 08:10                 │  │
│ │ Saída: 17:30                   │  │
│ │ Intervalo: 1h ✓                │  │
│ │ Total: 8h 10m (Extra: 10m)     │  │
│ │ Status: ✓ OK                   │  │
│ └────────────────────────────────┘  │
│                                      │
│ [DETALHES DO DIA] [EDITAR]           │
│                                      │
└──────────────────────────────────────┘
```

**Funções Chamadas:**
| Função | Local | Descrição |
|--------|-------|-----------|
| `getMarcacoesMes()` | Ao abrir | Lista marcações do mês |
| `calcularHorasMes()` | Card Total | Total horas do mês |
| `calcularHorasExtras()` | Card Total | Extras detectadas |
| `detectarHorasExtras()` | Card Total | Busca extras (>8h/dia) |
| `getMarcacoesDia()` | Card Dia | Lista marcações de cada dia |
| `calcularHorasDia()` | Card Dia | Calcula horas do dia |
| `validarIntervalo()` | Card Dia | Verifica intervalo |
| `relatorioMeuExtrato()` | Ao abrir | GET /v1/relatorios/meu-extrato |

---

### **TELA 5: SOLICITAR JUSTIFICATIVA**

**Localização:** Aba "JUSTIFICAR"

**Componentes:**
```
┌──────────────────────────────────────┐
│ ◀  SOLICITAR JUSTIFICATIVA           │
├──────────────────────────────────────┤
│                                      │
│ FALTAS SEM JUSTIFICAR:               │
│                                      │
│ ☐ 05/07/2026 (Sexta) - Falta        │
│                                      │
│ Tipo Justificativa:                  │
│ [▼ Selecione um tipo...]             │
│   • Atestado Médico                  │
│   • Abono Empresarial                │
│   • Autorização do Gestor            │
│   • Justificativa Pessoal            │
│                                      │
│ Documento/Comprovante:               │
│ [📎 Anexar arquivo]                  │
│                                      │
│ Descrição:                           │
│ [________________________]            │
│ [________________________]            │
│                                      │
│ [ENVIAR SOLICITAÇÃO]                 │
│ [CANCELAR]                           │
└──────────────────────────────────────┘
```

**Funções Chamadas:**
| Função | Quando | O Que Faz |
|--------|--------|-----------|
| `getOcorrenciasNaoJustificadas()` | Ao abrir | Lista faltas sem justificar |
| `getTiposJustificativa()` | Ao abrir | Busca tipos disponíveis |
| `uploadDocumento()` | Ao anexar | Salva arquivo |
| `criarSolicitacaoJustificativa()` | Ao enviar | POST /v1/justificativa |
| `notificarRH()` | Ao enviar | Push para RH revisar |

---

### **TELA 6: BANCO DE HORAS (MEU SALDO)**

**Localização:** Aba "BANCO"

**Componentes:**
```
┌──────────────────────────────────────┐
│ ◀  BANCO DE HORAS                    │
├──────────────────────────────────────┤
│                                      │
│ SALDO ATUAL: +12h 30m                │
│                                      │
│ ┌────────────────────────────────┐  │
│ │ Saldo: +12h 30m                │  │
│ │ Data Vencimento: 31/12/2026    │  │
│ │ Status: ✓ Dentro do prazo      │  │
│ │                                │  │
│ │ Próximo vencimento em: 205 dias │  │
│ └────────────────────────────────┘  │
│                                      │
│ HISTÓRICO:                           │
│ ┌────────────────────────────────┐  │
│ │ 30/06 - Compensação: -8h       │  │
│ │ 20/06 - Extras: +5h 30m        │  │
│ │ 15/06 - Compensação: -2h       │  │
│ │ 01/06 - Saldo Anterior: +16h   │  │
│ └────────────────────────────────┘  │
│                                      │
│ [VER MAIS] [BAIXAR EXTRATO]          │
│                                      │
└──────────────────────────────────────┘
```

**Funções Chamadas:**
| Função | Local | Descrição |
|--------|-------|-----------|
| `getMeuBancodeHoras()` | Card Saldo | Busca saldo atual |
| `calcularSaldoBanco()` | Card Saldo | Soma créditos - débitos |
| `getHistoricoBanco()` | Lista Histórico | Movimentações do banco |
| `validarVencimento()` | Card Saldo | Verifica se vai vencer |
| `alertaVencimento()` | Card Saldo | Aviso se <30 dias |
| `relatorioMeuBanco()` | GET /v1/banco-horas/meu-saldo |

---

## 🖥️ APP ADMIN/RH - Mapa de Telas

```
┌──────────────────────────────┐
│  DASHBOARD ADMIN             │
├──────────────────────────────┤
│                              │
│ MENU PRINCIPAL:              │
│ • Configuração (☕ CAFÉ)     │
│ • Cadastro (👥)              │
│ • Manutenção (🔧)            │
│ • Relatório (📊)             │
│ • Exportação (⬇️)            │
│ • Segurança (🔐)             │
│                              │
└────────┬─────────────────────┘
         │
    ┌────┴─────────────────────────────┐
    │                                  │
    ▼                                  ▼
┌──────────────────┐           ┌──────────────────┐
│  CONFIGURAÇÃO    │           │   CADASTRO       │
│  (EMPRESA)       │           │  (COLABORADOR)   │
└──────────────────┘           └──────────────────┘
    │                                  │
    ├─ Parâmetro Geral                ├─ Dados Pessoais
    ├─ Jornada                        ├─ Dados Trabalho
    ├─ Horário                        ├─ Afastamentos
    ├─ Feriado                        ├─ Ocorrências
    ├─ Alerta                         ├─ Banco Horas
    └─ GPS/Cerca                      └─ Histórico
```

### **TELA 1: CONFIGURAÇÃO GERAL DA EMPRESA**

**Localização:** Menu → Configuração → Parâmetro Geral

**Componentes:**
```
┌──────────────────────────────────────────────┐
│ ◀ CONFIGURAÇÃO DA EMPRESA                    │
├──────────────────────────────────────────────┤
│                                              │
│ JORNADA PADRÃO:                              │
│ Horas/dia: [8.00]                            │
│ Minutos/dia: [480]                           │
│                                              │
│ INTERVALO:                                   │
│ Até 6h: [15] minutos                         │
│ Acima 6h: [60] minutos                       │
│ Remunerado? ☑                                │
│                                              │
│ TRABALHO NOTURNO:                            │
│ Início: [21]h                                │
│ Fim: [5]h                                    │
│ Hora Noturna: [52.5] minutos                 │
│ Adicional: [20] %                            │
│                                              │
│ HORAS EXTRAS:                                │
│ Adicional Padrão: [50] %                     │
│ Adicional Feriado: [100] %                   │
│ Limite/dia: [2] horas                        │
│                                              │
│ TOLERÂNCIA:                                  │
│ ☑ Aplicar Tolerância                         │
│ Minutos: [5]                                 │
│                                              │
│ REPOUSO SEMANAL:                             │
│ Dia Preferencial: [Domingo ▼]                │
│ ☑ Exigir repouso mínimo                      │
│                                              │
│ [SALVAR] [CANCELAR]                          │
│                                              │
└──────────────────────────────────────────────┘
```

**Funções Chamadas:**
| Função | Quando | O Que Faz |
|--------|--------|-----------|
| `getEmpresaConfig()` | Ao abrir | Busca valores atuais |
| `validarValores()` | Antes salvar | Valida ranges (jornada 4-12h) |
| `updateEmpresaConfig()` | Ao salvar | PUT /v1/config/empresa |
| `logAuditoria()` | Ao salvar | Registra mudança |
| `notificarMudanca()` | Ao salvar | Avisa RH que config mudou |

---

### **TELA 2: CADASTRO DE JORNADA**

**Localização:** Menu → Configuração → Jornada

**Componentes:**
```
┌──────────────────────────────────────────────┐
│ ◀ JORNADAS                                   │
├──────────────────────────────────────────────┤
│                                              │
│ [+ CRIAR NOVA JORNADA]                       │
│                                              │
│ JORNADAS ATIVAS:                             │
│ ┌────────────────────────────────────────┐  │
│ │ JORNADA 8H (Padrão)                    │  │
│ │ Entrada: 08:00 - Saída: 17:00          │  │
│ │ Intervalo: 12:00-13:00 (1h)            │  │
│ │ Aplicável a: 35 colaboradores          │  │
│ │ [EDITAR] [DELETAR]                     │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ JORNADA 6H (Matutino)                  │  │
│ │ Entrada: 06:00 - Saída: 12:00          │  │
│ │ Intervalo: Nenhum                      │  │
│ │ Aplicável a: 8 colaboradores           │  │
│ │ [EDITAR] [DELETAR]                     │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ JORNADA NOTURNA (12H)                  │  │
│ │ Entrada: 22:00 - Saída: 06:00 (día+1) │  │
│ │ Intervalo: 02:00-03:00 (1h)            │  │
│ │ Aplicável a: 12 colaboradores          │  │
│ │ [EDITAR] [DELETAR]                     │  │
│ └────────────────────────────────────────┘  │
│                                              │
└──────────────────────────────────────────────┘

┌──────────────────────────────────────────────┐
│ + CRIAR NOVA JORNADA                         │
├──────────────────────────────────────────────┤
│                                              │
│ Nome: [________________]                     │
│ Horas/dia: [8.00]                            │
│                                              │
│ Entrada: [08:00]                             │
│ Saída: [17:00]                               │
│                                              │
│ Intervalo: [Ativado ☑]                       │
│ Saída Intervalo: [12:00]                     │
│ Volta Intervalo: [13:00]                     │
│ Duração: 1h (automático)                     │
│                                              │
│ Aplicável a (dias): ☑ Seg ☑ Ter ☑ Qua      │
│                     ☑ Qui ☑ Sex ☐ Sab      │
│                     ☐ Dom                    │
│                                              │
│ [CRIAR] [CANCELAR]                           │
│                                              │
└──────────────────────────────────────────────┘
```

**Funções Chamadas:**
| Função | Quando | O Que Faz |
|--------|--------|-----------|
| `getJornadas()` | Ao abrir | Lista todas as jornadas |
| `criarJornada()` | Ao criar | POST /v1/jornadas |
| `editarJornada()` | Ao editar | PUT /v1/jornadas/:id |
| `validarJornada()` | Antes salvar | Valida entrada < saída |
| `deletarJornada()` | Ao deletar | DELETE + validar não usada |
| `logAuditoria()` | Ao salvar | Registra mudança |
| `avisoRecalcular()` | Ao editar | ⚠️ "Recalcular marcações?" |

---

### **TELA 3: CADASTRO DE COLABORADOR (EXPANDIDA)**

**Localização:** Menu → Cadastro → Colaboradores → Selecionar

**Componentes (6 Abas):**

```
┌──────────────────────────────────────────────┐
│ ◀ JOÃO SILVA (Matrícula: 00123)              │
├──────────────────────────────────────────────┤
│ [DADOS] [TRABALHO] [AFASTAM] [BANCO] [OCORR] [HIST]
│                                              │
└──────────────────────────────────────────────┘

ABA 1: DADOS PESSOAIS
┌──────────────────────────────────────────────┐
│ Nome: [João Silva]                           │
│ CPF: [123.456.789-00]                        │
│ Matrícula: [00123]                           │
│ Salário Base: [R$ 3.500,00]  ← NOVO         │
│ Banco: [123]                 ← NOVO         │
│ Agência: [00123]             ← NOVO         │
│ Conta: [123456-7]            ← NOVO         │
│ Documento: [📎 Anexado]      ← NOVO         │
│ Foto: [👤 Adicionar]         ← NOVO         │
│ [SALVAR] [CANCELAR]                         │
└──────────────────────────────────────────────┘

ABA 2: TRABALHO
┌──────────────────────────────────────────────┐
│ Cargo: [Analista de Sistemas]                │
│ Setor: [TI ▼]                                │
│ Jornada: [Jornada 8H ▼]      ← NOVO         │
│ Turno: [Turno 1 ▼]           ← NOVO         │
│ Data Admissão: [15/03/2023]                  │
│ Data Demissão: [____]        ← NOVO         │
│ Tipo Contrato: [CLT ▼]       ← NOVO         │
│ Ativo? ☑                                    │
│ [SALVAR] [CANCELAR]                         │
└──────────────────────────────────────────────┘

ABA 3: AFASTAMENTOS
┌──────────────────────────────────────────────┐
│ [+ CRIAR NOVO AFASTAMENTO]                   │
│                                              │
│ AFASTAMENTOS ATIVOS:                         │
│ ┌────────────────────────────────────────┐  │
│ │ Férias - 01/07 a 15/07/2026            │  │
│ │ Status: Ativo                          │  │
│ │ Bloqueia Ponto: ✓                      │  │
│ │ Remunerado: ✓                          │  │
│ │ [EDITAR] [FINALIZAR]                   │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ AFASTAMENTOS FINALIZADOS:                    │
│ ┌────────────────────────────────────────┐  │
│ │ Licença - 10/02 a 20/02/2026           │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘

┌────────────────────────────────────────────────┐
│ + CRIAR NOVO AFASTAMENTO                       │
├────────────────────────────────────────────────┤
│ Tipo: [Férias ▼]                              │
│ Data Início: [10/07/2026]                     │
│ Data Término: [20/07/2026]                    │
│ Dias: 11 (automático)                         │
│ Bloqueia Ponto? ☑                             │
│ Remunerado? ☑                                 │
│ Motivo: [_________________________]           │
│ [CRIAR] [CANCELAR]                            │
└────────────────────────────────────────────────┘

ABA 4: BANCO DE HORAS
┌──────────────────────────────────────────────┐
│ SALDO ATUAL: +12h 30m                        │
│ Data Vencimento: 31/12/2026                  │
│ Status: ✓ Dentro do prazo                    │
│                                              │
│ [+ LANÇAR CRÉDITO] [+ LANÇAR DÉBITO]         │
│                                              │
│ HISTÓRICO:                                   │
│ ┌────────────────────────────────────────┐  │
│ │ 30/06 - Compensação: -8h              │  │
│ │ 20/06 - Extras: +5h 30m                │  │
│ │ 01/06 - Saldo Inicial: +16h            │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘

ABA 5: OCORRÊNCIAS
┌──────────────────────────────────────────────┐
│ [+ REGISTRAR OCORRÊNCIA]                     │
│                                              │
│ FALTAS/ATRASOS:                              │
│ ┌────────────────────────────────────────┐  │
│ │ 05/07/2026 - Falta                    │  │
│ │ Status: Sem justificar ⚠️              │  │
│ │ [JUSTIFICAR] [DESCONTAR]               │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ┌────────────────────────────────────────┐  │
│ │ 02/07/2026 - Atraso (15 min)          │  │
│ │ Status: Justificado ✓                 │  │
│ │ Desconto: 15 min                       │  │
│ └────────────────────────────────────────┘  │
└──────────────────────────────────────────────┘

ABA 6: HISTÓRICO / AUDITORIA
┌──────────────────────────────────────────────┐
│ ALTERAÇÕES REALIZADAS:                       │
│                                              │
│ 10/07/2026 10:30 - Jornada alterada          │
│   Por: Maria RH                              │
│   De: 8H → 6H (Matutino)                     │
│   Motivo: Mudança de turno                   │
│                                              │
│ 05/07/2026 14:15 - Afastamento criado        │
│   Por: Sistema                               │
│   Férias: 01/07 a 15/07                      │
│                                              │
│ 01/03/2023 09:00 - Colaborador admitido      │
│   Por: RH Sistema                            │
│                                              │
└──────────────────────────────────────────────┘
```

**Funções Chamadas:**

| Aba | Função | Quando | O Que Faz |
|-----|--------|--------|-----------|
| DADOS | `getColaborador()` | Ao abrir | Busca dados pessoais |
| DADOS | `updateColaborador()` | Ao salvar | PUT atualiza |
| DADOS | `uploadDocumento()` | Ao anexar | Salva arquivo |
| TRABALHO | `getJornadas()` | Ao abrir | Lista jornadas |
| TRABALHO | `getTurnos()` | Ao abrir | Lista turnos |
| TRABALHO | `updateTrabalho()` | Ao salvar | PUT atualiza |
| TRABALHO | `avisoRecalcular()` | Ao mudar jornada | ⚠️ Recalcular? |
| AFASTAM | `getAfastamentos()` | Ao abrir | Lista afastamentos |
| AFASTAM | `criarAfastamento()` | Ao criar | POST /v1/afastamentos |
| AFASTAM | `validarOverlap()` | Antes criar | Verifica sobrepõe |
| AFASTAM | `bloquearPonto()` | Ao criar | Bloqueia marcações |
| AFASTAM | `finalizarAfastamento()` | Ao finalizar | Libera marcações |
| BANCO | `getMeuBancodeHoras()` | Ao abrir | Busca saldo |
| BANCO | `calcularSaldoBanco()` | Ao abrir | Soma créditos-débitos |
| BANCO | `lancarCredito()` | Ao lançar | POST crédito |
| BANCO | `lancarDebito()` | Ao lançar | POST débito |
| OCORR | `getOcorrencias()` | Ao abrir | Lista faltas/atrasos |
| OCORR | `criarOcorrencia()` | Ao registrar | POST /v1/ocorrencias |
| OCORR | `justificarOcorrencia()` | Ao justificar | POST justificativa |
| OCORR | `descontarHoras()` | Ao descontar | Atualiza marcações |
| HIST | `getHistoricoAuditoria()` | Ao abrir | GET /v1/colaboradores/:id/historico |

---

### **TELA 4: MANUTENÇÃO DIÁRIA**

**Localização:** Menu → Manutenção → Manutenção Diária

**Componentes:**
```
┌──────────────────────────────────────────────┐
│ ◀ MANUTENÇÃO DIÁRIA                          │
├──────────────────────────────────────────────┤
│                                              │
│ BUSCAR:                                      │
│ Colaborador: [__________ ▼]                  │
│ Data: [10/07/2026]                           │
│ [BUSCAR]                                     │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│ JOÃO SILVA - 10/07/2026 (QUARTA)             │
│ ┌──────────────────────────────────────────┐ │
│ │ JORNADA: 08:00 - 17:00                   │ │
│ │ PERÍODO: 1h 48m                          │ │
│ │                                          │ │
│ │ 08:10 ✓ ENTRADA                          │ │
│ │ 12:00 ✓ SAÍDA INTERVALO                  │ │
│ │ 13:00 ✓ VOLTA INTERVALO                  │ │
│ │ 17:30 ✓ SAÍDA                            │ │
│ │                                          │ │
│ │ CÁLCULOS:                                │ │
│ │ Horas Trabalhadas: 8h 10m                │ │
│ │ Horas Extras: 10 min                     │ │
│ │ Intervalo: 1h ✓                          │ │
│ │ Status: ✓ OK - Sem alertas               │ │
│ │                                          │ │
│ │ [EDITAR] [ADICIONAR] [DELETAR] [JUSTIF] │ │
│ └──────────────────────────────────────────┘ │
│                                              │
└──────────────────────────────────────────────┘

MODAL EDITAR MARCAÇÃO:
┌──────────────────────────────────────────────┐
│ X EDITAR ENTRADA                             │
├──────────────────────────────────────────────┤
│ Data/Hora Original: 10/07/2026 08:10:00     │
│ Nova Data/Hora: [10/07/2026 08:15:00]       │
│                                              │
│ Motivo da Alteração: [_____________]         │
│                                              │
│ [RECALCULAR E SALVAR]                        │
│ [CANCELAR]                                   │
│                                              │
│ ⚠️ Sistema recalculará automaticamente!      │
└──────────────────────────────────────────────┘
```

**Funções Chamadas:**
| Função | Quando | O Que Faz |
|--------|--------|-----------|
| `getMarcacoesDia()` | Ao buscar | GET marcações do dia |
| `calcularHorasDia()` | Ao exibir | Calcula horas |
| `validarIntervalo()` | Ao exibir | Valida intervalo |
| `editarMarcacao()` | Ao editar | PATCH /v1/marcacoes/:id |
| `recalcularDia()` | Ao salvar | **FUNÇÃO CRÍTICA** |
| `adicionarMarcacao()` | Ao adicionar | POST marcação manual |
| `deletarMarcacao()` | Ao deletar | DELETE com recalcular |
| `criarJustificativa()` | Ao justificar | POST /v1/justificativa |
| `logAuditoria()` | Ao salvar | Registra mudança |

---

### **TELA 5: FECHAMENTO DE PERÍODO**

**Localização:** Menu → Manutenção → Fechamento Ponto

**Componentes:**
```
┌──────────────────────────────────────────────┐
│ ◀ FECHAMENTO DE PERÍODO                      │
├──────────────────────────────────────────────┤
│                                              │
│ SELECIONAR PERÍODO:                          │
│ Mês: [JULHO ▼]  Ano: [2026 ▼]               │
│                                              │
│ [PRÉ-VALIDAR]                                │
│                                              │
├──────────────────────────────────────────────┤
│                                              │
│ RESUMO DO PERÍODO:                           │
│ ┌────────────────────────────────────────┐  │
│ │ Período: Julho/2026                    │  │
│ │ Status: ⚠️ PRÉ-FECHAMENTO               │  │
│ │                                        │  │
│ │ Total de Colaboradores: 50             │  │
│ │ Marcações Processadas: 1.250           │  │
│ │ Horas Trabalhadas: 8.000h              │  │
│ │ Horas Extras: 45h                      │  │
│ │ Banco Variação: +12h                   │  │
│ │                                        │  │
│ │ ⚠️ ALERTAS PENDENTES: 3                 │  │
│ │ • João Silva: 1 falta sem justificar   │  │
│ │ • Maria Santos: intervalo insuf. (2x)  │  │
│ │ • Pedro Costa: 5h extras não aprovadas │  │
│ │                                        │  │
│ │ [VISUALIZAR ALERTAS]                   │  │
│ └────────────────────────────────────────┘  │
│                                              │
│ ⚠️ Resolva os alertas antes de fechar!      │
│                                              │
│ [FECHAR PERÍODO] [FORÇAR FECHAMENTO]         │
│ [CANCELAR]                                   │
│                                              │
└──────────────────────────────────────────────┘

MODAL ALERTAS:
┌────────────────────────────────────────────────┐
│ X ALERTAS DO PERÍODO - JULHO/2026              │
├────────────────────────────────────────────────┤
│                                                │
│ ☐ João Silva: Falta 05/07 sem justificar      │
│   [JUSTIFICAR] [DESCONTAR]                    │
│                                                │
│ ☑ Maria Santos: Intervalo insuficiente        │
│   02/07 (50 min < 60 min)                     │
│   15/07 (45 min < 60 min)                     │
│   [REVISAR] [CORRIGIR]                        │
│                                                │
│ ☐ Pedro Costa: 5h extras não aprovadas        │
│   [APROVAR] [REJEITAR]                        │
│                                                │
│ [FECHAR MESMO COM ALERTAS] [VOLTAR]            │
│                                                │
└────────────────────────────────────────────────┘
```

**Funções Chamadas:**
| Função | Quando | O Que Faz |
|--------|--------|-----------|
| `preValidarPeriodo()` | Ao clicar "Pré-validar" | Verifica alertas |
| `getFaltasNaoJustificadas()` | Ao validar | Busca faltas |
| `getIntervaloInsuficiente()` | Ao validar | Busca dias com < intervalo |
| `getExtrasNaoAprovadas()` | Ao validar | Busca extras não aprovadas |
| `verificarRepouso()` | Ao validar | Valida repouso semanal |
| `fecharPeriodo()` | Ao confirmar | **FUNÇÃO CRÍTICA** |
| `bloquearPeriodo()` | Ao fechar | Bloqueia alterações |
| `gerarRelatórioFechamento()` | Ao fechar | Gera documento |
| `logAuditoria()` | Ao fechar | Registra fechamento |
| `notificarGestores()` | Ao fechar | Push notification |

---

## 📊 TABELA CONSOLIDADA: FUNÇÕES POR TELA

```
APP TRABALHADOR:
├── Login/2FA
│   ├── validarCredenciais()
│   ├── verificarMFA()
│   ├── getMeuPerfil()
│   ├── getJornada()
│   ├── getFeriado()
│   ├── getAfastamento()
│   └── getAlertas()
│
├── Ponto (Dashboard)
│   ├── getJornadaHoje()
│   ├── getMarcacoesHoje()
│   ├── calcularHorasAteAgora()
│   ├── validarIntervalo()
│   ├── verificarGeolocalização()
│   ├── verificarTolerancia()
│   ├── verificarSequencia()
│   ├── registrarMarcacao() ← POST
│   ├── getAlertas()
│   └── getOcorrenciasHoje()
│
├── Ver Extrato
│   ├── getMarcacoesMes()
│   ├── calcularHorasMes()
│   ├── calcularHorasExtras()
│   ├── getMarcacoesDia()
│   ├── calcularHorasDia()
│   └── relatorioMeuExtrato()
│
├── Justificativa
│   ├── getOcorrenciasNaoJustificadas()
│   ├── getTiposJustificativa()
│   ├── uploadDocumento()
│   ├── criarSolicitacaoJustificativa() ← POST
│   └── notificarRH()
│
└── Banco de Horas
    ├── getMeuBancodeHoras()
    ├── calcularSaldoBanco()
    ├── getHistoricoBanco()
    ├── validarVencimento()
    ├── alertaVencimento()
    └── relatorioMeuBanco()

═════════════════════════════════════════════════

APP ADMIN/RH:
├── Configuração Geral
│   ├── getEmpresaConfig()
│   ├── validarValores()
│   ├── updateEmpresaConfig() ← PUT
│   ├── logAuditoria()
│   └── notificarMudanca()
│
├── Cadastro Jornada
│   ├── getJornadas()
│   ├── criarJornada() ← POST
│   ├── editarJornada() ← PUT
│   ├── validarJornada()
│   ├── deletarJornada() ← DELETE
│   ├── logAuditoria()
│   └── avisoRecalcular()
│
├── Cadastro Colaborador
│   ├── getColaborador()
│   ├── getJornadas()
│   ├── getTurnos()
│   ├── updateColaborador() ← PUT
│   ├── uploadDocumento()
│   ├── getAfastamentos()
│   ├── criarAfastamento() ← POST
│   ├── validarOverlap()
│   ├── bloquearPonto()
│   ├── finalizarAfastamento()
│   ├── getMeuBancodeHoras()
│   ├── calcularSaldoBanco()
│   ├── lancarCredito() ← POST
│   ├── lancarDebito() ← POST
│   ├── getOcorrencias()
│   ├── criarOcorrencia() ← POST
│   ├── justificarOcorrencia() ← POST
│   ├── descontarHoras()
│   ├── getHistoricoAuditoria()
│   └── logAuditoria()
│
├── Manutenção Diária
│   ├── getMarcacoesDia()
│   ├── calcularHorasDia()
│   ├── validarIntervalo()
│   ├── editarMarcacao() ← PATCH ⭐ CRÍTICO
│   ├── recalcularDia() ⭐⭐ FUNÇÃO CRÍTICA
│   ├── adicionarMarcacao() ← POST
│   ├── deletarMarcacao() ← DELETE
│   ├── criarJustificativa() ← POST
│   └── logAuditoria()
│
└── Fechamento Período
    ├── preValidarPeriodo()
    ├── getFaltasNaoJustificadas()
    ├── getIntervaloInsuficiente()
    ├── getExtrasNaoAprovadas()
    ├── verificarRepouso()
    ├── fecharPeriodo() ⭐⭐ FUNÇÃO CRÍTICA
    ├── bloquearPeriodo()
    ├── gerarRelatórioFechamento()
    ├── logAuditoria()
    └── notificarGestores()
```

---

## ⭐ FUNÇÕES MAIS CRÍTICAS (Aparecem em múltiplas telas)

1. **`recalcularDia()`** - Manutenção Diária (ao editar)
2. **`fecharPeriodo()`** - Fechamento (ao confirmar)
3. **`calcularHorasDia()`** - Ponto, Extrato, Manutenção
4. **`validarIntervalo()`** - Ponto, Extrato, Manutenção
5. **`getMarcacoesDia()`** - Ponto, Extrato, Manutenção
6. **`getAfastamentos()`** - Colaborador, Ponto
7. **`getMeuBancodeHoras()`** - Banco, Colaborador
8. **`criarAfastamento()`** - Colaborador, pode bloquear ponto

---

## 🔄 FLUXO DE DADOS ENTRE TELAS

```
PONTO (Dashboard) 
    ├─ registrarMarcacao() 
    └─ API: POST /v1/marcacoes
       └─ Banco: INSERT marcacoes
          └─ Volta com ID
          └─ calcularHorasAteAgora() em tempo real

MANUTENÇÃO DIÁRIA
    ├─ getMarcacoesDia()
    │  └─ API: GET /v1/marcacoes?data=X
    │
    ├─ editarMarcacao()
    │  └─ API: PATCH /v1/marcacoes/:id
    │     └─ **recalcularDia()** ⭐⭐
    │        ├─ calcularHorasDia()
    │        ├─ detectarHorasExtras()
    │        ├─ validarIntervalo()
    │        └─ UPDATE BD com novos valores
    │
    └─ logAuditoria()
       └─ Registra mudança

FECHAMENTO
    ├─ preValidarPeriodo()
    │  ├─ getFaltasNaoJustificadas()
    │  ├─ getIntervaloInsuficiente()
    │  ├─ getExtrasNaoAprovadas()
    │  └─ Retorna alertas
    │
    └─ fecharPeriodo() ⭐⭐
       ├─ bloquearPeriodo()
       ├─ gerarRelatórioFechamento()
       ├─ logAuditoria()
       └─ notificarGestores()
```

---

**Documento Criado:** `MAPA_TELAS_FUNCOES.md`

Agora você tem o mapa exato de ONDE cada função fica em cada tela! 🎯

