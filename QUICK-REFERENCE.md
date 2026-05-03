# ⚡ Quick Reference Guide

## 🔗 Links

- **GitHub Repository**: https://github.com/ganeshchavan786/zrok-ui
- **GitHub Actions**: https://github.com/ganeshchavan786/zrok-ui/actions
- **Packages (GHCR)**: https://github.com/ganeshchavan786?tab=packages

---

## 🚀 Local Development

```bash
# 1. Start Redis
docker compose -f docker-compose.redis-only.yml up -d

# 2. Backend (Terminal 1)
cd backend && npm install && npm run dev

# 3. Frontend (Terminal 2)
cd frontend && npm install && npm run dev
```

**URLs:**
- Frontend: http://localhost:3555
- Backend: http://localhost:3666
- Backend Health: http://localhost:3666/health

---

## 🐳 Docker Images (GHCR)

After pushing to GitHub, images will be available at:

```
ghcr.io/ganeshchavan786/zrok-ui/backend:latest
ghcr.io/ganeshchavan786/zrok-ui/frontend:latest
```

---

## 📦 GitHub Actions Status

Check build status:
```
https://github.com/ganeshchavan786/zrok-ui/actions
```

The workflow will:
1. ✅ Build backend Docker image
2. ✅ Build frontend Docker image
3. ✅ Push both to GitHub Container Registry (GHCR)
4. ✅ Tag with `latest` and commit SHA

---

## 🔐 GitHub Secrets (Required for Deployment)

Go to: **Settings → Secrets and variables → Actions → New repository secret**

Add these secrets:

| Secret Name      | Example Value                                    |
|------------------|--------------------------------------------------|
| REDIS_PASSWORD   | d8a206cf62819982762e49ecc5d38057fa4a0962fba3d93f034dc38aff121293 |
| JWT_SECRET       | your-super-secret-jwt-key-change-this           |
| BASE_DOMAIN      | your-domain.com                                  |
| ADMIN_EMAIL      | admin@your-domain.com                            |
| SMTP_HOST        | smtp.gmail.com                                   |
| SMTP_PORT        | 587                                              |
| SMTP_USER        | your-email@gmail.com                             |
| SMTP_PASS        | your-app-password                                |

---

## 🌐 VPS Deployment

### Step 1: Make Packages Public

1. Go to: https://github.com/ganeshchavan786?tab=packages
2. Click on `zrok-ui/backend`
3. **Package settings → Change visibility → Public**
4. Repeat for `zrok-ui/frontend`

### Step 2: Deploy on VPS

```bash
# SSH into VPS
ssh user@your-vps-ip

# Create project directory
mkdir -p ~/zrokui && cd ~/zrokui

# Download docker-compose.prod.yml
curl -O https://raw.githubusercontent.com/ganeshchavan786/zrok-ui/main/docker-compose.prod.yml

# Create .env file
nano .env
# Add all environment variables (see above)

# Login to GHCR (if packages are private)
echo $GITHUB_TOKEN | docker login ghcr.io -u ganeshchavan786 --password-stdin

# Pull and start
docker compose -f docker-compose.prod.yml pull
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
cd ~/zrokui
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## 🛑 Stop Services

### Local Development
```bash
# Stop backend/frontend: Ctrl+C in terminals
# Stop Redis:
docker compose -f docker-compose.redis-only.yml down
```

### VPS
```bash
docker compose -f docker-compose.prod.yml down
```

---

## 🐛 Troubleshooting

### GitHub Actions Failed
1. Check: https://github.com/ganeshchavan786/zrok-ui/actions
2. Click on failed workflow
3. Check logs for errors
4. Common issues:
   - Dockerfile syntax errors
   - Missing dependencies
   - Build timeouts

### Can't Pull Images on VPS
```bash
# Make packages public OR login to GHCR
docker login ghcr.io -u ganeshchavan786

# Check image exists
docker pull ghcr.io/ganeshchavan786/zrok-ui/backend:latest
```

### Port Already in Use
```bash
# Windows
netstat -ano | findstr :3666
taskkill /PID <PID> /F

# Linux/VPS
lsof -ti:3666 | xargs kill -9
```

---

## 📊 Monitoring

### Local
```bash
# Check Redis
docker ps | grep redis
docker logs zrokui-redis

# Check backend
curl http://localhost:3666/health

# Check frontend
curl http://localhost:3555
```

### VPS
```bash
# View logs
docker logs -f zrokui-backend
docker logs -f zrokui-frontend
docker logs -f zrokui-redis

# Resource usage
docker stats

# Restart service
docker compose -f docker-compose.prod.yml restart backend
```

---

## 📝 Important Files

| File                          | Purpose                          |
|-------------------------------|----------------------------------|
| README.md                     | Project overview                 |
| START-LOCAL.md                | Local development guide          |
| DEPLOY-GHCR.md                | Deployment guide                 |
| PROJECT-PORTS.md              | Architecture overview            |
| docker-compose.redis-only.yml | Local Redis only                 |
| docker-compose.prod.yml       | Production deployment            |
| .github/workflows/deploy.yml  | CI/CD pipeline                   |

---

## 🎯 Next Steps

1. ✅ Code pushed to GitHub
2. ⬜ Check GitHub Actions build status
3. ⬜ Make packages public (if needed)
4. ⬜ Add GitHub Secrets
5. ⬜ Deploy to VPS
6. ⬜ Setup domain & SSL
7. ⬜ Configure Nginx reverse proxy

---

## 💡 Tips

- Always check GitHub Actions after pushing
- Keep secrets secure - never commit .env files
- Use strong passwords in production
- Regular backups of Redis data
- Monitor logs for errors
- Update Docker images regularly

---

**Repository**: https://github.com/ganeshchavan786/zrok-ui
