# Configuração de Variáveis de Ambiente

## 🚀 Em Produção (Vercel)

1. Acesse o dashboard do Vercel do seu projeto
2. Vá para **Settings → Environment Variables**
3. Adicione as variáveis:
   - `SUPABASE_URL` 
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `RESEND_API_KEY` (opcional, para MFA por email)
   - `RESEND_FROM_EMAIL` (opcional)

**Nunca** committe credenciais no Git.

## 💻 Em Desenvolvimento Local

1. Crie um arquivo `.env.local` (ignorado pelo Git):
```bash
cp .env.example .env.local
```

2. Edite `.env.local` com suas credenciais locais:
```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...
RESEND_API_KEY=re_xxxxx
RESEND_FROM_EMAIL=noreply@pontize.com
PORT=3000
```

3. Execute o servidor:
```bash
npm run dev
```

## ✅ Checklist de Segurança

- [ ] `.env.test` removido
- [ ] `.env.local` adicionado ao `.gitignore` ✓
- [ ] `.env.example` commitado com template ✓
- [ ] Variáveis sensíveis apenas em Vercel Settings ✓
- [ ] Nenhuma credencial em logs ou console ✓
