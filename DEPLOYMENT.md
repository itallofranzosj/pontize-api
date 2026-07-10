# 🚀 DEPLOYMENT GUIDE - Pontize API v2.0

**Status:** Ready for deployment ✅  
**Latest Commit:** Phase 8 - Auditoria & Security  
**Migrations:** 21 ready  
**Tests:** 5 suites passing  

---

## 📋 Pre-Deployment Checklist

- [x] Code committed to GitHub (main branch)
- [x] All tests passing (`npm run test`)
- [x] Build passing (`npm run build`)
- [x] Lint checks pass (`npm run lint`)
- [x] 21 migrations ready in `supabase/migrations/`
- [x] Environment variables configured
- [x] Database backups created (before migration)
- [x] Rollback plan documented

---

## 🔧 DEPLOYMENT STEPS

### Step 1: Supabase Migrations

**Option A: Using Supabase CLI (Recommended)**

```bash
# 1. Install Supabase CLI
npm install -g supabase

# 2. Login to Supabase
supabase login

# 3. Link project
supabase link --project-ref <your-project-ref>

# 4. Deploy migrations
supabase migration up

# 5. Verify migrations
supabase migration list
```

**Option B: Manual SQL Execution**

If CLI is not available, run each migration manually:

```bash
# 1. Open Supabase Dashboard
# 2. Go to SQL Editor
# 3. Copy contents of each migration file in order (001-021)
# 4. Execute in Supabase
```

**Migrations to Deploy (21 total):**

```
001_create_empresa_config.sql           ← Core config
002_create_jornadas.sql                 ← Jornadas
003_create_horarios_trabalho.sql        ← Horários
004_create_dias_uteis.sql               ← Feriados
005_create_alertas_config.sql           ← Alertas
006_create_localizacao_config.sql       ← GPS
007_create_perfis_jornada.sql           ← Mapping
008_alter_profiles_add_columns.sql      ← Profiles alter
009_create_additional_indexes.sql       ← Indexes
010_populate_feriados_2024_2027.sql     ← Seed data
011_create_tipos_afastamento.sql        ← Afastamento types
012_create_afastamentos.sql             ← Afastamentos
013_create_ocorrencias.sql              ← Occurrences
014_add_demissao_columns_profiles.sql   ← Dismissal columns
015_create_auditoria_log.sql            ← Audit log
016_alter_marcacoes_add_validacao.sql   ← Marcações alter
017_create_periodos_fechados.sql        ← Period closing
018_create_clt_functions.sql            ← PostgreSQL functions
019_create_banco_horas.sql              ← Bank of hours
020_create_movimentacoes_banco_horas.sql ← Movements
021_create_banco_horas_functions.sql    ← BH functions
```

### Step 2: GitHub Verification

```bash
# Latest commit already pushed
git log --oneline | head -5

# Expected output:
# e52a2bd (HEAD -> main) feat: Phase 8 - Auditoria & Security...
# ...
```

✅ **Already Done:** Committed and pushed to GitHub main branch

---

### Step 3: Vercel Deployment

**If using Vercel for the API:**

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel --prod

# 3. Set environment variables
vercel env add SUPABASE_URL
vercel env add SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY

# 4. Trigger redeploy after env setup
vercel --prod
```

**Or use GitHub Auto-Deploy:**
- Connect GitHub repo to Vercel
- Push to main branch
- Vercel automatically deploys

---

### Step 4: Cloudflare (Optional)

**If using Cloudflare Workers:**

```bash
# 1. Install Wrangler
npm i -g wrangler

# 2. Authenticate
wrangler login

# 3. Deploy
wrangler publish

# 4. Verify
curl https://<your-worker>.workers.dev/health
```

---

## 🔍 Post-Deployment Validation

### 1. Database Verification

```bash
# Connect to Supabase and verify tables
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

# Expected: 15 new tables created
```

### 2. API Health Check

```bash
# Test health endpoint
curl https://<your-api>/health

# Expected response:
# { "status": "ok", "timestamp": "..." }
```

### 3. Authentication Test

```bash
# Get token from Supabase
curl -X POST https://<supabase-url>/auth/v1/token?grant_type=password \
  -H "Content-Type: application/json" \
  -d '{"email": "<admin@email.com>", "password": "<password>"}'

# Use token to test API
curl -H "Authorization: Bearer <token>" \
  https://<your-api>/v1/permissoes/meu-role
```

### 4. Endpoint Verification

```bash
# Test key endpoints
curl -H "Authorization: Bearer <token>" \
  https://<your-api>/v1/config/empresa

curl -H "Authorization: Bearer <token>" \
  https://<your-api>/v1/jornadas

curl -H "Authorization: Bearer <token>" \
  https://<your-api>/v1/relatorios-clt/horas-mes

curl -H "Authorization: Bearer <token>" \
  https://<your-api>/v1/permissoes/meu-role
```

### 5. Auditoria Logging

```bash
# Verify auditoria is being logged
SELECT COUNT(*) FROM auditoria_log;

# Should show recent entries from API calls
```

---

## 📊 Rollback Plan

If issues occur:

### Step 1: Identify Issue
```bash
# Check logs
vercel logs <your-project>

# Or in Supabase
# Check auditoria_log for errors
```

### Step 2: Rollback Database (if needed)
```bash
# Using Supabase backup
# 1. Go to Supabase Dashboard
# 2. Settings → Backups
# 3. Restore from previous backup

# Or manually revert migrations (NOT RECOMMENDED if data exists)
# supabase migration down <migration-id>
```

### Step 3: Rollback Code
```bash
# Revert to previous commit
git revert <commit-hash>
git push origin main

# Or redeploy from Vercel:
# 1. Go to Vercel Dashboard
# 2. Select previous deployment
# 3. Click "Redeploy"
```

### Step 4: Verify
```bash
# Re-run validation tests
npm run test

# Check endpoints
curl https://<your-api>/health
```

---

## 🌐 Domain Configuration

### For API (if not on Vercel):

```bash
# Add custom domain
# 1. Point DNS to deployment URL
# 2. Update CORS in src/api/index.ts
# 3. Restart server
```

### For Frontend Integration:

Update your frontend to use new API endpoint:

```typescript
// .env.production
VITE_API_URL=https://<your-api-domain>/v1
```

---

## 📈 Monitoring Setup

### Enable Logging

In Supabase Dashboard:
1. Go to Database → Extensions
2. Enable `pg_stat_statements`
3. Monitor slow queries

### Setup Alerts (Optional)

```bash
# Using Supabase monitoring
# 1. Dashboard → Settings → Monitoring
# 2. Configure alerts for:
#    - Database CPU > 80%
#    - Connections > 100
#    - Slow queries > 1000ms
```

### Application Monitoring

```bash
# Add monitoring to your app
# Option 1: Datadog
npm install @datadog/browser-rum

# Option 2: Sentry
npm install @sentry/node

# Configure in your API startup
```

---

## 🔐 Security Post-Deployment

### 1. Environment Variables

Verify all secrets are set:
```bash
# Check Vercel/Cloudflare secrets
# - SUPABASE_SERVICE_ROLE_KEY (keep secure!)
# - SUPABASE_URL
# - SUPABASE_ANON_KEY
# - API_KEYS (if using custom auth)
```

### 2. CORS Configuration

```typescript
// In src/api/index.ts - verify CORS origin
app.use("*", cors({ 
  origin: ["https://app.pontize.com", "https://admin.pontize.com"] 
}));
```

### 3. Rate Limiting

```bash
# Implement rate limiting (optional)
npm install rate-limiter-flexible
```

### 4. Database Firewall

In Supabase:
1. Settings → Network
2. Add IP whitelist (if needed)
3. Enable "Only connections from allowed IPs"

---

## 📞 Troubleshooting

### Migration Fails

```bash
# Check migration status
supabase migration list --status

# View error details
# Check Supabase dashboard → Migrations tab

# Common issues:
# 1. Column already exists → Check existing schema
# 2. FK constraint → Verify table order
# 3. Trigger syntax → Check PostgreSQL version
```

### API Returns 500

```bash
# Check logs
curl -H "Authorization: Bearer <token>" \
  https://<your-api>/health

# View server logs
# Vercel: Dashboard → Logs
# Self-hosted: docker logs <container>
```

### Tests Fail in Production

```bash
# Run tests with production env
NODE_ENV=production npm run test

# Common issues:
# 1. Missing env variables
# 2. Network connectivity
# 3. Database permissions
```

---

## ✅ Final Checklist

- [ ] Supabase migrations deployed
- [ ] Database verified (15 tables, 21 migrations)
- [ ] GitHub main branch updated
- [ ] API health check passing
- [ ] Authentication working
- [ ] All endpoints responding
- [ ] Auditoria logging events
- [ ] Frontend connected to new API
- [ ] Monitoring/alerts configured
- [ ] Backup tested and working
- [ ] Rollback plan documented

---

## 🎊 Summary

**Pontize API v2.0 Deployment:**

1. **Code:** ✅ Committed to GitHub (main branch)
2. **Database:** 📋 21 migrations ready for Supabase
3. **Tests:** ✅ 5 suites passing
4. **Build:** ✅ Production build ready
5. **Docs:** ✅ Complete deployment guide (this file)

**Next Step:** Run Supabase migrations and deploy to production! 🚀

---

*Last Updated: 2026-07-10*  
*Status: Ready for Production*  
*Migrations: 21/21 Ready*

