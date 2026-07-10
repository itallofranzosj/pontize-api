#!/bin/bash

echo "🔒 Configurando Pontize API de forma segura..."
echo ""

# Verificar se .env.local existe
if [ -f .env.local ]; then
    echo "⚠️  .env.local já existe"
else
    echo "📝 Criando .env.local a partir do template..."
    cp .env.example .env.local
    echo "✅ .env.local criado"
    echo ""
    echo "⚠️  IMPORTANTE: Edite .env.local com suas credenciais!"
    echo "   - SUPABASE_URL"
    echo "   - SUPABASE_SERVICE_ROLE_KEY"
    echo "   - RESEND_API_KEY (opcional)"
fi

echo ""
echo "📦 Instalando dependências..."
npm install

echo ""
echo "✅ Setup concluído!"
echo ""
echo "Próximos passos:"
echo "1. Edite .env.local com suas credenciais"
echo "2. Execute: npm run dev"
echo "3. Teste em: http://localhost:3000/health"
echo ""
echo "Para produção (Vercel):"
echo "1. Configure secrets no Vercel Dashboard"
echo "2. Execute: vercel deploy"
