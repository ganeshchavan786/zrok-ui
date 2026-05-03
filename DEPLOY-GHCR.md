# 🚢 GitHub Container Registry (GHCR) Deployment

## Overview
या guide मध्ये तुम्ही:
1. GitHub Actions वापरून Docker images build कराल
2. GitHub Container Registry (ghcr.io) वर push कराल
3. VPS वर deploy कराल

---

## 📋 Prerequisites

- GitHub account
- GitHub repository (public/private)
- VPS with Docker installed
- SSH access to VPS

---

## 🔐 Step 1: GitHub Secrets Setup

तुमच्या GitHub repository मध्ये जा:
**Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:
```
REDIS_PASSWORD=d8a206cf62819982762e49ecc5d38057fa4a0962fba3d93f034dc38aff121293
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
BASE_DOMAIN=your-domain.com
ADMIN_EMAIL=admin@your-domain.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

---

## 🏗️ Step 2: Create GitHub Actions Workflow

File: `.github/workflows/deploy.yml`

```yaml
name: Build and Push to GHCR

on:
  push:
    branches: [main, master]
  workflow_dispatch:

env:
  REGISTRY: ghcr.io
  IMAGE_NAME: ${{ github.repository }}

jobs:
  build-and-push:
    runs-on: ubuntu-latest
    permissions:
      contents: read
      packages: write

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Log in to GHCR
        uses: docker/login-action@v3
        with:
          registry: ${{ env.REGISTRY }}
          username: ${{ github.actor }}
          password: ${{ secrets.GITHUB_TOKEN }}

      - name: Extract metadata (tags, labels)
        id: meta-backend
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/backend

      - name: Build and push Backend
        uses: docker/build-push-action@v5
        with:
          context: ./backend
          push: true
          tags: ${{ steps.meta-backend.outputs.tags }}
          labels: ${{ steps.meta-backend.outputs.labels }}

      - name: Extract metadata for Frontend
        id: meta-frontend
        uses: docker/metadata-action@v5
        with:
          images: ${{ env.REGISTRY }}/${{ env.IMAGE_NAME }}/frontend

      - name: Build and push Frontend
        uses: docker/build-push-action@v5
        with:
          context: ./frontend
          push: true
          tags: ${{ steps.meta-frontend.outputs.tags }}
          labels: ${{ steps.meta-frontend.outputs.labels }}
          build-args: |
            VITE_API_URL=https://api.your-domain.com
```

---

## 🐳 Step 3: VPS Deployment

### 3.1 VPS वर Docker Compose File

Create `docker-compose.prod.yml` on your VPS:

```yaml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    container_name: zrokui-redis
    command: redis-server --requirepass ${REDIS_PASSWORD}
    volumes:
      - redis-data:/data
    restart: unless-stopped
    networks:
      - zrokui-network

  backend:
    image: ghcr.io/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/backend:main
    container_name: zrokui-backend
    ports:
      - "3666:3666"
    environment:
      - NODE_ENV=production
      - PORT=3666
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
      - BASE_DOMAIN=${BASE_DOMAIN}
      - ADMIN_EMAIL=${ADMIN_EMAIL}
      - INVITES_ONLY=${INVITES_ONLY}
      - SMTP_HOST=${SMTP_HOST}
      - SMTP_PORT=${SMTP_PORT}
      - SMTP_USER=${SMTP_USER}
      - SMTP_PASS=${SMTP_PASS}
    depends_on:
      - redis
    restart: unless-stopped
    networks:
      - zrokui-network

  frontend:
    image: ghcr.io/YOUR_GITHUB_USERNAME/YOUR_REPO_NAME/frontend:main
    container_name: zrokui-frontend
    ports:
      - "3555:80"
    restart: unless-stopped
    networks:
      - zrokui-network

volumes:
  redis-data:

networks:
  zrokui-network:
    driver: bridge
```

### 3.2 VPS वर .env File

Create `.env` on VPS:
```bash
REDIS_PASSWORD=d8a206cf62819982762e49ecc5d38057fa4a0962fba3d93f034dc38aff121293
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
BASE_DOMAIN=your-domain.com
ADMIN_EMAIL=admin@your-domain.com
INVITES_ONLY=false
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
```

### 3.3 Deploy Commands

```bash
# SSH into VPS
ssh user@your-vps-ip

# Login to GHCR
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_GITHUB_USERNAME --password-stdin

# Pull latest images
docker compose -f docker-compose.prod.yml pull

# Start services
docker compose -f docker-compose.prod.yml up -d

# Check status
docker ps
docker logs zrokui-backend
docker logs zrokui-frontend
```

---

## 🔄 Update Deployment

```bash
# On VPS
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## 🌐 Nginx Reverse Proxy (Optional)

If you want to use domain names:

```nginx
# /etc/nginx/sites-available/zrokui

# Frontend
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3555;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}

# Backend API
server {
    listen 80;
    server_name api.your-domain.com;

    location / {
        proxy_pass http://localhost:3666;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:
```bash
sudo ln -s /etc/nginx/sites-available/zrokui /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## 📊 Monitoring

```bash
# View logs
docker logs -f zrokui-backend
docker logs -f zrokui-frontend
docker logs -f zrokui-redis

# Check resource usage
docker stats

# Restart services
docker compose -f docker-compose.prod.yml restart
```

---

## 🔒 Security Checklist

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET
- [ ] Enable firewall (ufw)
- [ ] Setup SSL/TLS (Let's Encrypt)
- [ ] Regular backups of Redis data
- [ ] Monitor logs for suspicious activity
- [ ] Keep Docker images updated

---

## 🆘 Troubleshooting

### Images Not Pulling
```bash
# Check GHCR permissions
# Go to GitHub → Package settings → Make public or add VPS as collaborator
```

### Container Crashes
```bash
docker logs zrokui-backend --tail 100
docker logs zrokui-frontend --tail 100
```

### Redis Connection Issues
```bash
docker exec -it zrokui-redis redis-cli -a YOUR_PASSWORD ping
```
