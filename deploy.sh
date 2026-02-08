#!/bin/bash

# ============================================
# VidaPassageira - Script de Deploy Produção
# ============================================

set -e  # Exit on error

echo "🚀 VidaPassageira - Deploy de Produção"
echo "======================================"
echo ""

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.prod exists
if [ ! -f .env.prod ]; then
    echo -e "${RED}❌ Erro: Arquivo .env.prod não encontrado!${NC}"
    echo ""
    echo "Copie o template e preencha com valores reais:"
    echo "  cp .env.prod.example .env.prod"
    echo "  nano .env.prod"
    exit 1
fi

# Check if compose.prod.yaml exists
if [ ! -f compose.prod.yaml ]; then
    echo -e "${RED}❌ Erro: Arquivo compose.prod.yaml não encontrado!${NC}"
    exit 1
fi

echo -e "${GREEN}✓ Arquivos de configuração encontrados${NC}"
echo ""

# Ask for confirmation
echo -e "${YELLOW}⚠️  Este script irá:${NC}"
echo "  1. Fazer pull das imagens Docker"
echo "  2. Parar containers atuais"
echo "  3. Iniciar novos containers"
echo ""
read -p "Deseja continuar? (s/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Ss]$ ]]; then
    echo "Deploy cancelado."
    exit 1
fi

echo ""
echo "📥 Fazendo pull das imagens Docker..."
docker-compose -f compose.prod.yaml pull

echo ""
echo "🛑 Parando containers atuais..."
docker-compose -f compose.prod.yaml down

echo ""
echo "🚀 Iniciando serviços..."
docker-compose -f compose.prod.yaml up -d

echo ""
echo "⏳ Aguardando inicialização (30 segundos)..."
sleep 30

echo ""
echo "📊 Status dos containers:"
docker-compose -f compose.prod.yaml ps

echo ""
echo "🔍 Verificando health dos serviços..."

# Check MySQL
if docker-compose -f compose.prod.yaml exec -T mysql mysqladmin ping -h localhost --silent > /dev/null 2>&1; then
    echo -e "${GREEN}✓ MySQL: OK${NC}"
else
    echo -e "${RED}✗ MySQL: FALHOU${NC}"
fi

# Check Backend
if curl -s http://localhost:8080/actuator/health | grep -q "UP"; then
    echo -e "${GREEN}✓ Backend: OK${NC}"
else
    echo -e "${YELLOW}⚠ Backend: Ainda inicializando... (verifique logs)${NC}"
fi

# Check Frontend
if curl -s http://localhost:80 > /dev/null 2>&1; then
    echo -e "${GREEN}✓ Frontend: OK${NC}"
else
    echo -e "${YELLOW}⚠ Frontend: Ainda inicializando... (verifique logs)${NC}"
fi

echo ""
echo -e "${GREEN}✅ Deploy concluído!${NC}"
echo ""
echo "📝 Comandos úteis:"
echo "  Ver logs:      docker-compose -f compose.prod.yaml logs -f"
echo "  Ver status:    docker-compose -f compose.prod.yaml ps"
echo "  Restart:       docker-compose -f compose.prod.yaml restart <service>"
echo "  Parar tudo:    docker-compose -f compose.prod.yaml down"
echo ""
echo "🌐 Acesse a aplicação:"
echo "  Frontend:      http://$(hostname -I | awk '{print $1}')"
echo "  Backend API:   http://$(hostname -I | awk '{print $1}'):8080/api"
echo ""
