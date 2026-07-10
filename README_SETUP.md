# Pontize API - Guia de Instalação Segura

## ⚡ Quick Start (5 minutos)

### 1️⃣ Clonar e Instalar
```bash
git clone <seu-repositorio>
cd pontize-api
npm install
```

### 2️⃣ Configurar Credenciais Locais
```bash
cp .env.example .env.local
```

Edite `.env.local` com:
```
SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=sua_chave_aqui
PORT=3000
```

### 3️⃣ Executar em Desenvolvimento
```bash
npm run dev
```

Acesse: `http://localhost:3000/health` (deve retornar `{"ok": true}`)

---

## 🚀 Deploy em Produção (Vercel)

### Configuração One-Time

1. **No Vercel Dashboard:**
   - Vá para Settings → Environment Variables
   - Adicione cada variável:

| Variável | Valor | Obrigatório |
|----------|-------|------------|
| `SUPABASE_URL` | URL do seu projeto | ✅ Sim |
| `SUPABASE_SERVICE_ROLE_KEY` | Chave de serviço | ✅ Sim |
| `RESEND_API_KEY` | Chave Resend | ❌ Opcional |
| `RESEND_FROM_EMAIL` | Email de saída | ❌ Opcional |

2. **Deploy automático:**
   ```bash
   git push origin main
   ```
   Vercel faz deploy automaticamente

---

## 📁 Arquivo `.env.local` - NÃO COMMITAR!

O arquivo `.env.local` está no `.gitignore` para evitar expor credenciais.

```bash
# .env.local (local only, não em Git)
SUPABASE_URL=https://ghszfwfxxmczwlndcgkp.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_xxxxx
PORT=3000
```

**NUNCA faça:**
- ❌ `git add .env*`
- ❌ `git commit -m "add credentials"`
- ❌ Commitar `.env.test` com credenciais

---

## ✅ O que Mudou

### Segurança
- ✅ Arquivo `.env.test` com credenciais **REMOVIDO**
- ✅ Novo template `.env.example` **ADICIONADO**
- ✅ `.gitignore` **ATUALIZADO** com `.env*`
- ✅ Documentação `ENVIRONMENT.md` **CRIADA**

### Bugs Corrigidos
- ✅ Relatório `/v1/relatorios/comparecimento` retorna dados REAIS agora
  - Antes: `Math.random() > 0.2` ❌
  - Depois: Verifica marcações reais ✅

- ✅ Cálculo de horas melhorado
  - Antes: 0.5h por marcação (simplista)
  - Depois: 8h/dia completo, 4h/meio período (realista)

### Infraestrutura
- ✅ `setup.sh` criado para facilitar setup local
- ✅ `SETUP_SEGURO.md` com boas práticas
- ✅ Suporta Vercel, Docker, Node local

---

## 🔐 Segurança

### Checklist
- [ ] `.env.local` criado e editado
- [ ] `.env.local` **não** foi commitado
- [ ] Credenciais adicionadas ao Vercel Settings
- [ ] Teste local: `npm run dev` funciona
- [ ] Health check retorna status OK

### Revogar Credenciais Vazadas (SE ACONTECEU)

Se `.env.test` foi commitado antes:
1. Revogue a chave no Supabase Dashboard
2. Gere uma nova chave
3. Atualize em Vercel Settings
4. Force push: `git push origin main --force`

---

## 📊 Endpoints Testados

```bash
# Health (público)
curl http://localhost:3000/health

# Login (público)
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"123456"}'

# Marcações (requer auth)
curl http://localhost:3000/v1/marcacoes \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"

# Relatório (requer auth)
curl "http://localhost:3000/v1/relatorios/comparecimento?mes=7&ano=2026" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

---

## 🆘 Troubleshooting

### Erro: `Cannot find env variables`
```bash
# Certifique-se que .env.local existe
ls -la .env.local

# Copie novamente se não existir
cp .env.example .env.local
```

### Erro: `SUPABASE_URL is empty`
```bash
# Edite .env.local com valores reais
nano .env.local  # ou use seu editor
```

### Erro: `401 Unauthorized` em endpoints
```bash
# Seu token expirou ou é inválido
# Use /auth/login para obter novo token
# Ou use /auth/refresh com refresh_token
```

---

## 🔗 Documentação Completa

- `ENVIRONMENT.md` - Guia de variáveis de ambiente
- `SETUP_SEGURO.md` - Boas práticas de segurança
- `package.json` - Scripts disponíveis
- `src/api/routes/` - Documentação de endpoints

---

## 💡 Tips Úteis

```bash
# Desenvolver com auto-reload
npm run dev

# Build para produção
npm run build

# Lint de código
npm run lint

# Formatar código
npm run format

# Iniciar servidor em produção
npm start
```

---

**Dúvidas?** Consulte a documentação ou abra uma issue! 🚀
