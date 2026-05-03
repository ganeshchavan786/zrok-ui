#!/bin/bash

echo "🚀 Starting zrokui Local Development"
echo "===================================="
echo ""

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}❌ Docker is not running. Please start Docker first.${NC}"
    exit 1
fi

# Start Redis
echo -e "${YELLOW}📦 Starting Redis...${NC}"
docker compose -f docker-compose.redis-only.yml up -d

# Wait for Redis
echo -e "${YELLOW}⏳ Waiting for Redis to be ready...${NC}"
sleep 3

# Check Redis
if docker ps | grep -q zrokui-redis; then
    echo -e "${GREEN}✓ Redis is running${NC}"
else
    echo -e "${RED}❌ Redis failed to start${NC}"
    exit 1
fi

echo ""
echo -e "${GREEN}✓ Setup complete!${NC}"
echo ""
echo "Next steps:"
echo "1. Open Terminal 1: cd backend && npm install && npm run dev"
echo "2. Open Terminal 2: cd frontend && npm install && npm run dev"
echo ""
echo "URLs:"
echo "  Backend:  http://localhost:3666"
echo "  Frontend: http://localhost:3555"
echo ""
