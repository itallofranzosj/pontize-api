# ⚙️ FASE 1 EXECUTÁVEL - Configurações (Semana 1-2)

**Status:** 🚀 PRONTO PARA INICIAR  
**Duração:** 2 semanas (10 dias úteis)  
**Story Points:** 12  
**Objetivo:** Criar infraestrutura de configuração da empresa

---

## 📋 O QUE SERÁ CRIADO NESTA FASE

### **1. BANCO DE DADOS (Migrations)**

6 novas tabelas, 60+ novos campos

---

### **2. BACKEND (APIs)**

15 endpoints CRUD com validações completas

---

### **3. FRONTEND (Telas Admin)**

8 novas telas de administração

---

## 🗂️ ESTRUTURA DE ARQUIVOS A CRIAR

```
pontize-api/
├── supabase/
│   └── migrations/
│       ├── 1_create_empresa_config.sql
│       ├── 2_create_jornadas.sql
│       ├── 3_create_horarios_trabalho.sql
│       ├── 4_create_dias_uteis.sql
│       ├── 5_create_alertas_config.sql
│       ├── 6_create_localizacao_config.sql
│       ├── 7_create_perfis_jornada.sql
│       ├── 8_alter_profiles_add_columns.sql
│       ├── 9_create_indexes.sql
│       └── 10_populate_feriados_2024_2027.sql
│
├── src/
│   ├── api/
│   │   └── routes/
│   │       ├── config.ts (NOVO)
│   │       ├── jornadas.ts (NOVO)
│   │       ├── horarios.ts (NOVO)
│   │       ├── feriados.ts (NOVO)
│   │       ├── alertas.ts (NOVO)
│   │       ├── localizacao.ts (NOVO)
│   │       └── perfis-jornada.ts (NOVO)
│   │
│   └── utils/
│       ├── validators/
│       │   ├── config-validator.ts (NOVO)
│       │   ├── jornada-validator.ts (NOVO)
│       │   └── horario-validator.ts (NOVO)
│       │
│       └── seeds/
│           └── feriados-seed.ts (NOVO)
│
├── tests/
│   └── config/
│       ├── config.test.ts (NOVO)
│       ├── jornadas.test.ts (NOVO)
│       └── horarios.test.ts (NOVO)
│
└── docs/
    └── API_CONFIG.md (NOVO)
```

---

## 🎯 TAREFAS DETALHADAS

### **TAREFA 1: Criar Migrations SQL (2-3 horas)**

**Arquivo 1:** `1_create_empresa_config.sql`

```sql
CREATE TABLE empresa_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  
  -- Jornada padrão
  jornada_padrao_horas DECIMAL(4,2) DEFAULT 8.00,
  jornada_padrao_minutos INT DEFAULT 480,
  
  -- Intervalo intrajornada
  intervalo_minimo_ate_6h INT DEFAULT 15,
  intervalo_minimo_apos_6h INT DEFAULT 60,
  intervalo_remunerado BOOLEAN DEFAULT false,
  
  -- Trabalho noturno (Art. 73-74)
  horario_noturno_inicio INT DEFAULT 21,
  horario_noturno_fim INT DEFAULT 5,
  adicional_noturno_percentual INT DEFAULT 20,
  hora_noturna_minutos DECIMAL(4,2) DEFAULT 52.5,
  
  -- Horas extras (Art. 59)
  adicional_extra_padrao INT DEFAULT 50,
  adicional_extra_feriado INT DEFAULT 100,
  horas_extra_limite_dia INT DEFAULT 2,
  
  -- Tolerância de marcação
  tolerancia_minutos INT DEFAULT 5,
  aplicar_tolerancia BOOLEAN DEFAULT true,
  
  -- Feriado trabalhado
  feriado_adicional_percentual INT DEFAULT 100,
  
  -- Descanso semanal
  dia_repouso_preferencial INT DEFAULT 0, -- 0=domingo
  exigir_repouso_semanal BOOLEAN DEFAULT true,
  
  -- Configurações gerais
  timezone TEXT DEFAULT 'America/Sao_Paulo',
  
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now()
);

CREATE UNIQUE INDEX idx_empresa_config_empresa_id ON empresa_config(empresa_id);
CREATE TRIGGER update_empresa_config_timestamp 
BEFORE UPDATE ON empresa_config
FOR EACH ROW EXECUTE FUNCTION update_timestamp();
```

**Arquivo 2:** `2_create_jornadas.sql`

```sql
CREATE TABLE jornadas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES auth.users(id),
  
  nome TEXT NOT NULL,                    -- "Jornada 8h", "Turno Noturno"
  codigo TEXT NOT NULL,
  
  horas_dia DECIMAL(4,2) DEFAULT 8.00,  -- 8h, 6h, 12h, etc
  minutos_dia INT,
  
  -- Dias de aplicação
  dias_semana JSONB DEFAULT '{"seg":true, "ter":true, "qua":true, "qui":true, "sex":true, "sab":false, "dom":false}',
  
  -- Características
  permite_intervalo BOOLEAN DEFAULT true,
  intervalo_minutos INT,
  
  -- Horários (base)
  horario_inicio_padrao TIME,             -- 08:00
  horario_fim_padrao TIME,                -- 17:00
  
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),
  
  CONSTRAINT unique_empresa_jornada UNIQUE(empresa_id, codigo),
  CONSTRAINT check_horas CHECK (horas_dia > 0 AND horas_dia <= 24)
);

CREATE INDEX idx_jornadas_empresa ON jornadas(empresa_id);
CREATE INDEX idx_jornadas_ativo ON jornadas(ativo) WHERE ativo = true;
```

**Arquivo 3:** `3_create_horarios_trabalho.sql`

```sql
CREATE TABLE horarios_trabalho (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES auth.users(id),
  jornada_id UUID NOT NULL REFERENCES jornadas(id),
  
  -- Classificação
  nome TEXT,                              -- "Manhã", "Tarde", "Noturno"
  tipo TEXT CHECK(tipo IN ('normal', 'noturno', 'extra', 'flexible')) DEFAULT 'normal',
  
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
  atualizado_em TIMESTAMP DEFAULT now(),
  
  CONSTRAINT check_horarios CHECK (horario_entrada < horario_saida)
);

CREATE INDEX idx_horarios_jornada ON horarios_trabalho(jornada_id);
CREATE INDEX idx_horarios_empresa ON horarios_trabalho(empresa_id);
```

**Arquivo 4:** `4_create_dias_uteis.sql`

```sql
CREATE TABLE dias_uteis (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES auth.users(id),
  
  data DATE NOT NULL,
  eh_feriado BOOLEAN DEFAULT false,
  tipo TEXT CHECK(tipo IN ('feriad_nacional', 'feriad_estadual', 'feriad_municipal', 'ponte', 'outro')) DEFAULT 'outro',
  
  descricao TEXT,                        -- "Independência do Brasil"
  
  -- Se trabalhado neste dia:
  obrigatorio_folga_compensatoria BOOLEAN DEFAULT true,
  adicional_percentual INT DEFAULT 100,   -- 100% (duplicado)
  
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT now(),
  
  CONSTRAINT unique_empresa_data UNIQUE(empresa_id, data)
);

CREATE INDEX idx_dias_uteis_empresa ON dias_uteis(empresa_id);
CREATE INDEX idx_dias_uteis_data ON dias_uteis(data);
CREATE INDEX idx_dias_uteis_feriado ON dias_uteis(eh_feriado) WHERE eh_feriado = true;
```

**Arquivo 5:** `5_create_alertas_config.sql`

```sql
CREATE TABLE alertas_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  
  -- Ativar/desativar alertas
  alerta_falta_de_ponto BOOLEAN DEFAULT true,
  alerta_intervalo_insuficiente BOOLEAN DEFAULT true,
  alerta_saldo_banco_vencimento BOOLEAN DEFAULT true,
  alerta_horas_extras_nao_aprovadas BOOLEAN DEFAULT true,
  alerta_repouso_nao_respeitado BOOLEAN DEFAULT true,
  
  -- Destinatários
  destinatarios_email TEXT[], -- Array de emails
  notificar_colaborador BOOLEAN DEFAULT true,
  notificar_gestor BOOLEAN DEFAULT true,
  notificar_rh BOOLEAN DEFAULT true,
  
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_alertas_config_empresa ON alertas_config(empresa_id);
```

**Arquivo 6:** `6_create_localizacao_config.sql`

```sql
CREATE TABLE localizacao_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL UNIQUE REFERENCES auth.users(id),
  
  -- Localização GPS
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  raio_metros INT DEFAULT 500,           -- 500 metros
  
  validar_gps_automaticamente BOOLEAN DEFAULT true,
  alerta_fora_raio BOOLEAN DEFAULT true,
  
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now()
);

CREATE INDEX idx_localizacao_config_empresa ON localizacao_config(empresa_id);
```

**Arquivo 7:** `7_create_perfis_jornada.sql`

```sql
CREATE TABLE perfis_jornada (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID NOT NULL REFERENCES auth.users(id),
  
  -- Quem se aplica
  cargo TEXT,                            -- "Gerente", "Assistente", etc
  setor_id UUID REFERENCES setores(id),  -- Opcional: por setor específico
  
  -- Qual jornada/turno
  jornada_id UUID NOT NULL REFERENCES jornadas(id),
  
  -- Sobrescritas específicas
  jornada_horas_sobrescrita DECIMAL(4,2),  -- NULL = usar jornada_id
  intervalo_minutos_sobrescrita INT,
  
  ativo BOOLEAN DEFAULT true,
  criado_em TIMESTAMP DEFAULT now(),
  atualizado_em TIMESTAMP DEFAULT now(),
  
  CONSTRAINT unique_perfil_cargo UNIQUE(empresa_id, cargo, setor_id)
);

CREATE INDEX idx_perfis_empresa ON perfis_jornada(empresa_id);
CREATE INDEX idx_perfis_cargo ON perfis_jornada(cargo);
```

**Arquivo 8:** `8_alter_profiles_add_columns.sql`

```sql
-- Adicionar colunas a profiles (sem quebrar nada)
ALTER TABLE profiles 
ADD COLUMN turno_id UUID REFERENCES turnos(id),
ADD COLUMN jornada_id UUID REFERENCES jornadas(id),
ADD COLUMN data_demissao DATE,
ADD COLUMN tipo_contrato_id UUID REFERENCES tipos_contrato(id),
ADD COLUMN salario_base DECIMAL(10,2),
ADD COLUMN banco_id TEXT,
ADD COLUMN agencia_id TEXT,
ADD COLUMN conta TEXT,
ADD COLUMN documento_url TEXT;

CREATE INDEX idx_profiles_turno ON profiles(turno_id);
CREATE INDEX idx_profiles_jornada ON profiles(jornada_id);
```

**Arquivo 9:** `9_create_indexes.sql`

```sql
-- Índices para performance
CREATE INDEX idx_empresa_config_timestamp ON empresa_config(atualizado_em DESC);
CREATE INDEX idx_jornadas_timestamp ON jornadas(atualizado_em DESC);
CREATE INDEX idx_horarios_timestamp ON horarios_trabalho(atualizado_em DESC);

-- Full-text search (opcional)
CREATE INDEX idx_jornadas_nome_search ON jornadas USING gin(to_tsvector('portuguese', nome));
CREATE INDEX idx_dias_uteis_descricao_search ON dias_uteis USING gin(to_tsvector('portuguese', descricao));
```

**Arquivo 10:** `10_populate_feriados_2024_2027.sql`

```sql
-- Popular feriados nacionais
INSERT INTO dias_uteis (empresa_id, data, eh_feriado, tipo, descricao, adicional_percentual) VALUES
  ('empresa-uuid', '2026-01-01', true, 'feriad_nacional', 'Ano Novo', 100),
  ('empresa-uuid', '2026-02-17', true, 'feriad_nacional', 'Carnaval', 100),
  ('empresa-uuid', '2026-04-21', true, 'feriad_nacional', 'Tiradentes', 100),
  ('empresa-uuid', '2026-05-01', true, 'feriad_nacional', 'Dia do Trabalho', 100),
  ('empresa-uuid', '2026-09-07', true, 'feriad_nacional', 'Independência', 100),
  ('empresa-uuid', '2026-10-12', true, 'feriad_nacional', 'Nossa Senhora', 100),
  ('empresa-uuid', '2026-11-02', true, 'feriad_nacional', 'Finados', 100),
  ('empresa-uuid', '2026-11-15', true, 'feriad_nacional', 'Proclamação República', 100),
  ('empresa-uuid', '2026-11-20', true, 'feriad_nacional', 'Consciência Negra', 100),
  ('empresa-uuid', '2026-12-25', true, 'feriad_nacional', 'Natal', 100);
-- Adicionar mais anos conforme necessário
```

---

### **TAREFA 2: Criar Rotas Backend (4-5 horas)**

**Arquivo:** `src/api/routes/config.ts`

```typescript
import { Hono } from "hono";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import { supabaseAdmin as supabase } from "../../integrations/supabase/client.server";
import type { HonoEnv } from "../middleware/auth";

export const configRouter = new Hono<HonoEnv>();

// Schemas
const EmpresaConfigSchema = z.object({
  jornada_padrao_horas: z.number().min(4).max(12),
  intervalo_minimo_ate_6h: z.number().min(0).max(60),
  intervalo_minimo_apos_6h: z.number().min(0).max(120),
  intervalo_remunerado: z.boolean(),
  horario_noturno_inicio: z.number().min(0).max(23),
  horario_noturno_fim: z.number().min(0).max(23),
  adicional_noturno_percentual: z.number().min(0).max(100),
  hora_noturna_minutos: z.number().min(30).max(60),
  adicional_extra_padrao: z.number().min(0).max(100),
  adicional_extra_feriado: z.number().min(0).max(200),
  horas_extra_limite_dia: z.number().min(1).max(4),
  tolerancia_minutos: z.number().min(0).max(15),
  aplicar_tolerancia: z.boolean(),
  feriado_adicional_percentual: z.number().min(0).max(200),
  dia_repouso_preferencial: z.number().min(0).max(6),
  exigir_repouso_semanal: z.boolean(),
  timezone: z.string(),
});

// GET /v1/config/empresa - Obter configuração
configRouter.get("/empresa", async (c) => {
  const authedUser = c.get("user");

  try {
    if (!authedUser?.id) {
      return c.json({ error: "Unauthorized" }, 401);
    }

    const { data, error } = await supabase
      .from("empresa_config")
      .select("*")
      .eq("empresa_id", authedUser.id)
      .single();

    if (error) {
      return c.json({ error: error.message }, 400);
    }

    if (!data) {
      return c.json({ error: "Config not found" }, 404);
    }

    return c.json(data);
  } catch (error) {
    return c.json({ error: "Internal server error" }, 500);
  }
});

// POST /v1/config/empresa - Criar configuração
configRouter.post(
  "/empresa",
  zValidator("json", EmpresaConfigSchema),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("empresa_config")
        .insert({
          empresa_id: authedUser.id,
          ...payload,
        })
        .select()
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json(data, 201);
    } catch (error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);

// PUT /v1/config/empresa - Atualizar configuração
configRouter.put(
  "/empresa",
  zValidator("json", EmpresaConfigSchema.partial()),
  async (c) => {
    const payload = c.req.valid("json");
    const authedUser = c.get("user");

    try {
      if (!authedUser?.id) {
        return c.json({ error: "Unauthorized" }, 401);
      }

      const { data, error } = await supabase
        .from("empresa_config")
        .update(payload)
        .eq("empresa_id", authedUser.id)
        .select()
        .single();

      if (error) {
        return c.json({ error: error.message }, 400);
      }

      return c.json(data);
    } catch (error) {
      return c.json({ error: "Internal server error" }, 500);
    }
  }
);
```

**Arquivos Similares (mesma estrutura):**
- `src/api/routes/jornadas.ts` (POST, GET, PUT, DELETE)
- `src/api/routes/horarios.ts` (POST, GET, PUT, DELETE)
- `src/api/routes/feriados.ts` (POST, GET, DELETE)
- `src/api/routes/alertas.ts` (POST, GET, PUT)
- `src/api/routes/localizacao.ts` (POST, GET, PUT)
- `src/api/routes/perfis-jornada.ts` (POST, GET, PUT, DELETE)

---

### **TAREFA 3: Adicionar Rotas ao Index (30 minutos)**

**Modificar:** `src/api/index.ts`

```typescript
import { configRouter } from "./routes/config";
import { jornadasRouter } from "./routes/jornadas";
import { horariosRouter } from "./routes/horarios";
import { feriadosRouter } from "./routes/feriados";
import { alertasRouter } from "./routes/alertas";
import { localizacaoRouter } from "./routes/localizacao";
import { perfilsJornadaRouter } from "./routes/perfis-jornada";

// ... código existente ...

// Novas rotas de configuração
app.route("/v1/config", configRouter);
app.route("/v1/jornadas", jornadasRouter);
app.route("/v1/horarios-trabalho", horariosRouter);
app.route("/v1/dias-uteis", feriadosRouter);
app.route("/v1/alertas-config", alertasRouter);
app.route("/v1/localizacao-config", localizacaoRouter);
app.route("/v1/perfis-jornada", perfilsJornadaRouter);
```

---

### **TAREFA 4: Criar Testes (2 horas)**

**Arquivo:** `tests/config/config.test.ts`

```typescript
import { expect, describe, it } from "vitest";
import { supabaseAdmin } from "../../src/integrations/supabase/client.server";

describe("Config API", () => {
  const testEmpresaId = "test-empresa-uuid";

  it("POST /v1/config/empresa - criar config", async () => {
    const response = await fetch("http://localhost:3000/v1/config/empresa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${testToken}`,
      },
      body: JSON.stringify({
        jornada_padrao_horas: 8.0,
        intervalo_minimo_ate_6h: 15,
        intervalo_minimo_apos_6h: 60,
        // ... mais campos
      }),
    });

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.empresa_id).toBe(testEmpresaId);
  });

  it("GET /v1/config/empresa - obter config", async () => {
    const response = await fetch("http://localhost:3000/v1/config/empresa", {
      headers: {
        "Authorization": `Bearer ${testToken}`,
      },
    });

    expect(response.status).toBe(200);
  });

  it("PUT /v1/config/empresa - atualizar config", async () => {
    const response = await fetch("http://localhost:3000/v1/config/empresa", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${testToken}`,
      },
      body: JSON.stringify({
        jornada_padrao_horas: 6.0,
      }),
    });

    expect(response.status).toBe(200);
  });
});
```

---

### **TAREFA 5: Documentação API (1 hora)**

**Arquivo:** `docs/API_CONFIG.md`

```markdown
# API de Configuração

## Endpoints

### GET /v1/config/empresa
Obter configuração da empresa

**Autenticação:** Required (Bearer token)

**Response:**
\`\`\`json
{
  "id": "uuid",
  "empresa_id": "uuid",
  "jornada_padrao_horas": 8.0,
  "intervalo_minimo_ate_6h": 15,
  ...
}
\`\`\`

### POST /v1/config/empresa
Criar configuração inicial

**Body:**
\`\`\`json
{
  "jornada_padrao_horas": 8.0,
  "intervalo_minimo_ate_6h": 15,
  ...
}
\`\`\`

### PUT /v1/config/empresa
Atualizar configuração

**Body:** (todos os campos opcionais)
\`\`\`json
{
  "jornada_padrao_horas": 8.0
}
\`\`\`
```

---

## 🎯 CHECKLIST FASE 1

```
BANCO DE DADOS:
☐ 1_create_empresa_config.sql
☐ 2_create_jornadas.sql
☐ 3_create_horarios_trabalho.sql
☐ 4_create_dias_uteis.sql
☐ 5_create_alertas_config.sql
☐ 6_create_localizacao_config.sql
☐ 7_create_perfis_jornada.sql
☐ 8_alter_profiles_add_columns.sql
☐ 9_create_indexes.sql
☐ 10_populate_feriados_2024_2027.sql
☐ Executar migrations no Supabase

BACKEND:
☐ src/api/routes/config.ts
☐ src/api/routes/jornadas.ts
☐ src/api/routes/horarios.ts
☐ src/api/routes/feriados.ts
☐ src/api/routes/alertas.ts
☐ src/api/routes/localizacao.ts
☐ src/api/routes/perfis-jornada.ts
☐ Modificar src/api/index.ts
☐ npm run build (validar compilação)
☐ npm run lint (validar código)

TESTES:
☐ tests/config/config.test.ts
☐ tests/config/jornadas.test.ts
☐ tests/config/horarios.test.ts
☐ npm run test (rodar testes)

DOCUMENTAÇÃO:
☐ docs/API_CONFIG.md
☐ Documentar todos endpoints

DEPLOY:
☐ npm run build
☐ Testar localmente (npm run dev)
☐ Executar migrations em produção
☐ Deploy backend
☐ Verificar health check

TOTAL: 7 tarefas, ~12 horas de trabalho
```

---

## 📅 CRONOGRAMA RECOMENDADO

**Dia 1-2:** Migrations + Populate dados (4-5 horas)  
**Dia 3-4:** Backend routes (8-10 horas)  
**Dia 5:** Testes + Documentação (3-4 horas)  
**Dia 6:** Deploy + Validação (2-3 horas)  

---

## ✅ PRÓXIMOS PASSOS

1. ✅ Preparar estrutura de pastas
2. ✅ Criar arquivos SQL (migrations)
3. ✅ Executar migrations em Supabase
4. ✅ Criar endpoints backend
5. ✅ Testes unitários
6. ✅ Deploy para produção

**Estamos prontos para começar! 🚀**

