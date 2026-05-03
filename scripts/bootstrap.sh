#!/bin/bash
# zrokui — VPS Bootstrap Script
# Usage: bash scripts/bootstrap.sh
# Run this ONCE after docker compose up -d

set -e

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
CYAN='\033[0;36m'
NC='\033[0m'

echo ""
echo -e "${CYAN}  ⚡ zrokui Bootstrap${NC}"
echo -e "${CYAN}  ─────────────────────────────────${NC}"
echo ""

# Load .env
if [ ! -f .env ]; then echo -e "${RED}✗ .env file not found. cp .env.example .env first.${NC}"; exit 1; fi
source .env

# Wait for zrok controller
echo -e "${YELLOW}  Waiting for zrok controller...${NC}"
for i in $(seq 1 30); do
  if docker compose exec -T zrok-controller wget -qO- http://localhost:18080/api/v1/version > /dev/null 2>&1; then
    echo -e "${GREEN}  ✓ zrok controller is up${NC}"; break
  fi
  [ $i -eq 30 ] && echo -e "${RED}  ✗ Timed out${NC}" && exit 1
  sleep 3
done

# Bootstrap OpenZiti + zrok
echo -e "${YELLOW}  Bootstrapping zrok...${NC}"
docker compose exec -T zrok-controller zrok admin bootstrap /etc/zrok/ctrl.yml 2>/dev/null || true

# Create public HTTP frontend
echo -e "${YELLOW}  Creating zrok frontend...${NC}"
docker compose exec -T zrok-controller sh -c \
  "zrok admin create frontend \$ZROK_ADMIN_TOKEN public 'http://{token}.${BASE_DOMAIN}:8090'" 2>/dev/null || true

# Create admin account
echo ""
echo -e "${CYAN}  Create admin account${NC}"
read -p "  Admin email: " ADMIN_EMAIL
read -s -p "  Admin password: " ADMIN_PASS
echo ""

ACCOUNT_TOKEN=$(docker compose exec -T zrok-controller \
  zrok admin create account "$ADMIN_EMAIL" "$ADMIN_PASS" 2>/dev/null | grep -oP 'token: \K\S+' || true)

if [ -n "$ACCOUNT_TOKEN" ]; then
  echo -e "${GREEN}  ✓ Admin account created${NC}"
  echo ""
  echo -e "${CYAN}  ─────────────────────────────────${NC}"
  echo -e "${CYAN}  Account token: ${YELLOW}$ACCOUNT_TOKEN${NC}"
  echo -e "${CYAN}  ─────────────────────────────────${NC}"
  echo ""
  echo -e "  Save this token! Then on your machine:"
  echo -e "${YELLOW}  zrokui enable $ACCOUNT_TOKEN${NC}"
else
  echo -e "${YELLOW}  Account may already exist — try logging in at https://${BASE_DOMAIN}${NC}"
fi

echo ""
echo -e "${GREEN}  ✓ Bootstrap complete!${NC}"
echo -e "  Dashboard: ${CYAN}https://${BASE_DOMAIN}${NC}"
echo ""
