# API de Configuração CLT - Pontize

Documentação completa dos endpoints de configuração de jornadas, horários, feriados e alertas.

## Base URL
```
https://api.pontize.com/v1
```

## Autenticação
Todos os endpoints exigem Bearer Token no header:
```
Authorization: Bearer {token}
```

---

## 1. CONFIGURAÇÃO EMPRESA (CLT)

### GET /config/empresa
Obter configuração CLT atual da empresa.

**Response (200)**
```json
{
  "id": "uuid",
  "empresa_id": "uuid",
  "jornada_padrao_horas": 8,
  "jornada_padrao_minutos": 480,
  "intervalo_minimo_ate_6h": 15,
  "intervalo_minimo_apos_6h": 60,
  "intervalo_remunerado": false,
  "horario_noturno_inicio": 21,
  "horario_noturno_fim": 5,
  "adicional_noturno_percentual": 20,
  "hora_noturna_minutos": 52.5,
  "adicional_extra_padrao": 50,
  "adicional_extra_feriado": 100,
  "horas_extra_limite_dia": 2,
  "tolerancia_minutos": 5,
  "aplicar_tolerancia": true,
  "feriado_adicional_percentual": 100,
  "dia_repouso_preferencial": 0,
  "exigir_repouso_semanal": true,
  "timezone": "America/Sao_Paulo",
  "criado_em": "2026-07-10T10:30:00Z",
  "atualizado_em": "2026-07-10T10:30:00Z"
}
```

### POST /config/empresa
Criar configuração CLT inicial para a empresa.

**Request Body**
```json
{
  "jornada_padrao_horas": 8,
  "intervalo_minimo_ate_6h": 15,
  "intervalo_minimo_apos_6h": 60,
  "horario_noturno_inicio": 21,
  "horario_noturno_fim": 5,
  "adicional_noturno_percentual": 20,
  "adicional_extra_padrao": 50,
  "adicional_extra_feriado": 100,
  "horas_extra_limite_dia": 2,
  "tolerancia_minutos": 5,
  "feriado_adicional_percentual": 100,
  "dia_repouso_preferencial": 0,
  "exigir_repouso_semanal": true,
  "timezone": "America/Sao_Paulo"
}
```

### PUT /config/empresa
Atualizar configuração CLT (campos opcionais).

**Request Body** (Todos os campos são opcionais)
```json
{
  "jornada_padrao_horas": 8,
  "adicional_noturno_percentual": 25
}
```

### GET /config/defaults
Obter valores padrão para criar nova configuração.

---

## 2. JORNADAS DE TRABALHO

### GET /jornadas
Listar jornadas da empresa.

**Query Parameters**
- `ativo` (boolean): Filtrar por status ativo
- Sem parâmetros: retorna todas

**Response (200)**
```json
[
  {
    "id": "uuid",
    "empresa_id": "uuid",
    "nome": "Jornada Padrão",
    "codigo": "JP",
    "horas_dia": 8,
    "minutos_dia": 480,
    "dias_semana": [1, 2, 3, 4, 5],
    "permite_intervalo": true,
    "intervalo_minutos": 60,
    "horario_inicio_padrao": "08:00",
    "horario_fim_padrao": "17:00",
    "tipo": "periodo",
    "ativo": true,
    "criado_em": "2026-07-10T10:30:00Z",
    "atualizado_em": "2026-07-10T10:30:00Z"
  }
]
```

### GET /jornadas/:id
Obter jornada específica por ID.

### POST /jornadas
Criar nova jornada.

**Request Body**
```json
{
  "nome": "Jornada Noturna",
  "codigo": "JN",
  "horas_dia": 8,
  "dias_semana": [1, 2, 3, 4, 5],
  "permite_intervalo": true,
  "intervalo_minutos": 60,
  "horario_inicio_padrao": "21:00",
  "horario_fim_padrao": "05:00",
  "tipo": "turno"
}
```

**Response (201)**
```json
{
  "id": "uuid",
  "empresa_id": "uuid",
  "nome": "Jornada Noturna",
  "codigo": "JN",
  "horas_dia": 8,
  "minutos_dia": 480,
  "dias_semana": [1, 2, 3, 4, 5],
  "permite_intervalo": true,
  "intervalo_minutos": 60,
  "horario_inicio_padrao": "21:00",
  "horario_fim_padrao": "05:00",
  "tipo": "turno",
  "ativo": true,
  "criado_em": "2026-07-10T10:30:00Z",
  "atualizado_em": "2026-07-10T10:30:00Z"
}
```

### PUT /jornadas/:id
Atualizar jornada (todos os campos opcionais).

**Response (200)** - Mesmo formato da criação

### DELETE /jornadas/:id
Deletar jornada (retorna 204).

---

## 3. HORÁRIOS DE TRABALHO

### GET /horarios-trabalho
Listar horários de trabalho (shifts).

**Query Parameters**
- `jornada_id` (uuid): Filtrar por jornada
- `ativo` (boolean): Filtrar por status

**Response (200)**
```json
[
  {
    "id": "uuid",
    "jornada_id": "uuid",
    "nome": "Manhã",
    "horario_entrada": "08:00",
    "horario_saida": "12:00",
    "intervalo_minutos": 15,
    "permite_intervalo": true,
    "permite_acumulo": false,
    "requer_justificativa": false,
    "ativo": true,
    "criado_em": "2026-07-10T10:30:00Z",
    "atualizado_em": "2026-07-10T10:30:00Z",
    "jornadas": {
      "id": "uuid",
      "nome": "Jornada Padrão",
      "codigo": "JP"
    }
  }
]
```

### GET /horarios-trabalho/:id
Obter horário específico.

### POST /horarios-trabalho
Criar novo horário de trabalho.

**Request Body**
```json
{
  "jornada_id": "uuid",
  "nome": "Tarde",
  "horario_entrada": "13:00",
  "horario_saida": "18:00",
  "intervalo_minutos": 30,
  "permite_intervalo": true,
  "permite_acumulo": false,
  "requer_justificativa": false
}
```

### PUT /horarios-trabalho/:id
Atualizar horário de trabalho.

### DELETE /horarios-trabalho/:id
Deletar horário de trabalho (retorna 204).

---

## 4. DIAS ÚTEIS / FERIADOS

### GET /dias-uteis
Listar feriados e dias úteis.

**Query Parameters**
- `mes` (number 1-12): Filtrar por mês
- `ano` (number): Filtrar por ano
- `eh_feriado` (boolean): true=feriados, false=dias úteis

**Response (200)**
```json
[
  {
    "id": "uuid",
    "empresa_id": "uuid",
    "data": "2026-07-09",
    "eh_feriado": true,
    "tipo": "feriad_nacional",
    "descricao": "Independência",
    "adicional_percentual": 100,
    "ativo": true,
    "criado_em": "2026-07-10T10:30:00Z",
    "atualizado_em": "2026-07-10T10:30:00Z"
  }
]
```

### GET /dias-uteis/intervalo?data_inicio=2026-01-01&data_fim=2026-12-31
Listar dias úteis por intervalo de datas.

### GET /dias-uteis/:id
Obter dia útil específico.

### POST /dias-uteis
Criar novo dia útil / feriado.

**Request Body**
```json
{
  "data": "2026-07-25",
  "eh_feriado": true,
  "tipo": "feriad_estadual",
  "descricao": "Aniversário da Cidade",
  "adicional_percentual": 100
}
```

### PUT /dias-uteis/:id
Atualizar dia útil.

### DELETE /dias-uteis/:id
Deletar dia útil (retorna 204).

---

## 5. CONFIGURAÇÃO DE ALERTAS

### GET /alertas-config/empresa
Obter configuração de alertas.

**Response (200)**
```json
{
  "id": "uuid",
  "empresa_id": "uuid",
  "alerta_horas_extras": true,
  "alerta_intervalo_insuficiente": true,
  "alerta_feriado_nao_registrado": true,
  "alerta_repouso_semanal_violado": true,
  "alerta_trabalho_noturno_excessivo": true,
  "alerta_atraso": true,
  "alerta_falta": true,
  "alerta_gps_fora_raio": true,
  "notificar_colaborador": true,
  "notificar_gestor": true,
  "notificar_rh": true,
  "destinatarios_email": ["rh@empresa.com", "gestor@empresa.com"],
  "incluir_resumo_diario": true,
  "horario_resumo_diario": "09:00",
  "criado_em": "2026-07-10T10:30:00Z",
  "atualizado_em": "2026-07-10T10:30:00Z"
}
```

### POST /alertas-config/empresa
Criar configuração de alertas.

**Request Body**
```json
{
  "alerta_horas_extras": true,
  "alerta_intervalo_insuficiente": true,
  "notificar_colaborador": true,
  "notificar_gestor": true,
  "notificar_rh": true,
  "destinatarios_email": ["rh@empresa.com"],
  "incluir_resumo_diario": true,
  "horario_resumo_diario": "09:00"
}
```

### PUT /alertas-config/empresa
Atualizar configuração de alertas.

### GET /alertas-config/defaults
Obter valores padrão para alertas.

---

## 6. CONFIGURAÇÃO DE LOCALIZAÇÃO (GPS)

### GET /localizacao-config/empresa
Obter configuração de geolocalização.

**Response (200)**
```json
{
  "id": "uuid",
  "empresa_id": "uuid",
  "latitude": -23.550520,
  "longitude": -46.633309,
  "raio_metros": 500,
  "validar_gps_automaticamente": true,
  "alerta_fora_raio": true,
  "bloqueiar_ponto_fora_raio": false,
  "criado_em": "2026-07-10T10:30:00Z",
  "atualizado_em": "2026-07-10T10:30:00Z"
}
```

### POST /localizacao-config/empresa
Criar configuração de localização.

**Request Body**
```json
{
  "latitude": -23.550520,
  "longitude": -46.633309,
  "raio_metros": 500,
  "validar_gps_automaticamente": true,
  "alerta_fora_raio": true,
  "bloqueiar_ponto_fora_raio": false
}
```

### PUT /localizacao-config/empresa
Atualizar configuração de localização.

### POST /localizacao-config/validar-distancia
Validar se coordenada está dentro do raio permitido.

**Request Body**
```json
{
  "latitude": -23.550520,
  "longitude": -46.633309
}
```

**Response (200)**
```json
{
  "dentro_raio": true,
  "distancia": 250,
  "raio_metros": 500,
  "distancia_excesso": 0
}
```

---

## 7. PERFIS DE JORNADA (Cargo → Jornada)

### GET /perfis-jornada
Listar perfis de jornada.

**Query Parameters**
- `cargo` (string): Filtrar por cargo (case-insensitive)
- `setor_id` (uuid): Filtrar por setor
- `ativo` (boolean): Filtrar por status

**Response (200)**
```json
[
  {
    "id": "uuid",
    "empresa_id": "uuid",
    "cargo": "Operador",
    "setor_id": "uuid",
    "jornada_id": "uuid",
    "jornada_horas_sobrescrita": null,
    "intervalo_minutos_sobrescrita": null,
    "ativo": true,
    "criado_em": "2026-07-10T10:30:00Z",
    "atualizado_em": "2026-07-10T10:30:00Z",
    "jornadas": {
      "id": "uuid",
      "nome": "Jornada Padrão",
      "codigo": "JP",
      "horas_dia": 8,
      "intervalo_minutos": 60
    }
  }
]
```

### GET /perfis-jornada/:id
Obter perfil específico.

### GET /perfis-jornada/cargo/:cargo
Obter perfil por nome do cargo.

### POST /perfis-jornada
Criar novo perfil de jornada.

**Request Body**
```json
{
  "cargo": "Supervisor",
  "setor_id": "uuid",
  "jornada_id": "uuid",
  "jornada_horas_sobrescrita": 9,
  "intervalo_minutos_sobrescrita": 90
}
```

### PUT /perfis-jornada/:id
Atualizar perfil de jornada.

### DELETE /perfis-jornada/:id
Deletar perfil de jornada (retorna 204).

---

## HTTP Status Codes

| Código | Significado |
|--------|-----------|
| 200 | OK - Sucesso |
| 201 | Created - Recurso criado |
| 204 | No Content - Deletado com sucesso |
| 400 | Bad Request - Validação falhou |
| 401 | Unauthorized - Token inválido/ausente |
| 403 | Forbidden - Sem permissão |
| 404 | Not Found - Recurso não encontrado |
| 409 | Conflict - Violação de constraint (ex: código duplicado) |
| 500 | Internal Server Error |

## Exemplos cURL

### Criar configuração CLT
```bash
curl -X POST https://api.pontize.com/v1/config/empresa \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "jornada_padrao_horas": 8,
    "intervalo_minimo_apos_6h": 60,
    "horario_noturno_inicio": 21,
    "horario_noturno_fim": 5,
    "adicional_noturno_percentual": 20
  }'
```

### Criar jornada
```bash
curl -X POST https://api.pontize.com/v1/jornadas \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "nome": "Jornada Noturna",
    "codigo": "JN",
    "horas_dia": 8,
    "permitir_intervalo": true,
    "intervalo_minutos": 60,
    "horario_inicio_padrao": "21:00",
    "horario_fim_padrao": "05:00",
    "tipo": "turno"
  }'
```

### Validar localização
```bash
curl -X POST https://api.pontize.com/v1/localizacao-config/validar-distancia \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "latitude": -23.550520,
    "longitude": -46.633309
  }'
```
