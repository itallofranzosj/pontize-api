# 🔒 Setup Seguro - Pontize API

## Checklist de Segurança

### ✅ Em Desenvolvimento Local

```bash
# 1. Clone o repositório
git clone <repo>
cd pontize-api

# 2. Copie o template de env
cp .env.example .env.local

# 3. Edite .env.local com suas credenciais locais
# (NUNCA committe este arquivo)

# 4. Instale dependências
npm install

# 5. Execute em desenvolvimento
npm run dev
```

### ✅ Em Produção (Vercel)

1. **Configurar Secrets no Vercel:**
   ```
   Vercel Dashboard → Settings → Environment Variables
   ```

2. **Adicionar variáveis:**
   - `SUPABASE_URL` - URL do seu projeto Supabase
   - `SUPABASE_SERVICE_ROLE_KEY` - Chave de serviço do Supabase
   - `RESEND_API_KEY` (opcional) - Para envio de emails MFA
   - `RESEND_FROM_EMAIL` (opcional) - Email padrão

3. **Nenhuma credencial deve ir para o Git!**

## 🚨 Vulnerabilidades Corrigidas

### ✅ `.env.test` REMOVIDO
- Arquivo continha credenciais em plain text
- **Solução:** Usar apenas `.env.local` (não commitado)

### ✅ Placeholder em `/relatorios/comparecimento` CORRIGIDO
- Estava retornando dados aleatórios (`Math.random() > 0.2`)
- **Solução:** Agora consulta marcações reais do banco

### ✅ Cálculo de Horas MELHORADO
- Antes: 0.5 horas por marcação (incorreto)
- Depois: 8 horas para dia completo, 4 horas para meio período

## 📋 Estrutura de Código

```
pontize-api/
├── src/
│   ├── api/
│   │   ├── index.ts          # App principal com Hono
│   │   ├── middleware/
│   │   │   └── auth.ts       # Middleware de autenticação JWT
│   │   └── routes/
│   │       ├── auth.ts       # Login, logout, refresh
│   │       ├── marcacoes.ts  # CRUD de marcações
│   │       ├── colaboradores.ts
│   │       ├── relatorios.ts # Horas, comparecimento, produtividade
│   │       ├── dispositivos.ts
│   │       ├── setores.ts
│   │       ├── unidades.ts
│   │       ├── rep-devices.ts # Relógios de ponto
│   │       ├── mfa.ts        # Autenticação de dois fatores
│   │       └── health.ts
│   └── integrations/
│       └── supabase/
│           └── client.server.ts # Cliente Supabase Admin
├── .env.example   # Template (commitar)
├── .env.local     # Credenciais locais (NÃO commitar)
├── .gitignore     # Incluir .env* (commitar)
├── ENVIRONMENT.md # Guia de env vars
└── SETUP_SEGURO.md # Este arquivo
```

## 🔐 Boas Práticas Implementadas

### Autenticação
- ✅ JWT via Supabase Auth
- ✅ Validação em todos os endpoints (exceto `/health` e `/auth/login`)
- ✅ MFA com códigos de 6 dígitos e expiração de 10 min

### Autorização
- ✅ Isolamento por empresa (`empresa_id` sempre validado)
- ✅ Usuários só acessam seus próprios dados
- ✅ Admin pode acessar dados da empresa

### Validação
- ✅ Zod schemas em todos os endpoints
- ✅ UUIDs validados
- ✅ Enums restritivos

### Banco de Dados
- ✅ Queries seguras via Supabase client
- ✅ Paginação implementada
- ✅ Sem SQL injection

## 🛠️ Deploy no Vercel

```bash
# Vercel detecta automáticamente Hono
vercel deploy

# Ou via GitHub (recomendado)
# 1. Push para main
# 2. Vercel deploya automaticamente
```

## 📊 Monitoramento

Adicione logs estruturados em produção:

```bash
npm install winston
```

```typescript
import winston from 'winston';

const logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    new winston.transports.Console()
  ]
});

// Usar em rotas:
logger.info('User login', { user_id: user.id });
```

## ⚠️ Antes de Mergear

- [ ] Remover credenciais do código
- [ ] Usar apenas `.env.local` em dev
- [ ] Configurar secrets no Vercel
- [ ] Testar endpoints com Postman/Insomnia
- [ ] Executar `npm run lint` e `npm run build`
- [ ] Revisar permissões de CORS

## 🔗 Recursos

- [Supabase Auth](https://supabase.com/docs/guides/auth)
- [Hono Middleware](https://hono.dev/api/middleware)
- [Zod Validation](https://zod.dev)
- [Vercel Env Vars](https://vercel.com/docs/projects/environment-variables)
