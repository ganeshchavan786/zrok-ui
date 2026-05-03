# 🐳 Docker Configuration

Docker Compose files and configurations for zrokui deployment.

## 📁 Files

### Docker Compose Files

#### `docker-compose.yml` - Default Development
```bash
docker-compose up -d
```
**Services:**
- Backend (port 3666)
- Frontend (port 3555)
- Redis (port 6379)

**Use for:** Quick local development with all services

---

#### `docker-compose.dev.yml` - Development with Hot Reload
```bash
docker-compose -f docker-compose.dev.yml up -d
```
**Features:**
- Volume mounts for hot reload
- Development environment variables
- Debug logging enabled

**Use for:** Active development with code changes

---

#### `docker-compose.prod.yml` - Production Deployment
```bash
docker-compose -f docker-compose.prod.yml up -d
```
**Features:**
- GHCR images (ghcr.io/ganeshchavan786/zrok-ui-*)
- Production optimizations
- Health checks
- Restart policies
- Resource limits

**Use for:** VPS/Production deployment

---

#### `docker-compose.redis-only.yml` - Redis Only
```bash
docker-compose -f docker-compose.redis-only.yml up -d
```
**Services:**
- Redis only (port 6379)

**Use for:** Local development when running backend/frontend manually

---

### Configuration Files

#### `nginx-vps.conf` - Nginx Reverse Proxy
Nginx configuration for VPS deployment with SSL/TLS support.

**Features:**
- Reverse proxy to backend (3666)
- Static file serving for frontend
- SSL/TLS configuration
- Security headers
- Gzip compression

---

## 🚀 Quick Start

### Local Development (All Services)
```bash
cd docker
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Local Development (Redis Only)
```bash
cd docker
docker-compose -f docker-compose.redis-only.yml up -d

# Then run backend/frontend manually
cd ../backend && npm run dev
cd ../frontend && npm run dev
```

### Production Deployment
```bash
cd docker

# Pull latest images from GHCR
docker-compose -f docker-compose.prod.yml pull

# Start services
docker-compose -f docker-compose.prod.yml up -d

# Check status
docker-compose -f docker-compose.prod.yml ps

# View logs
docker-compose -f docker-compose.prod.yml logs -f
```

---

## 🔧 Environment Variables

Create `.env` file in project root:

```bash
# Backend
PORT=3666
NODE_ENV=production
JWT_SECRET=your-secret-key-change-this

# Redis
REDIS_HOST=redis
REDIS_PORT=6379
REDIS_PASSWORD=your-redis-password

# zrok
ZROK_API_URL=https://your-zrok-controller.com

# Frontend
VITE_API_URL=http://your-domain.com:3666
```

---

## 📊 Service Ports

| Service  | Internal Port | External Port | Description           |
|----------|---------------|---------------|-----------------------|
| Backend  | 3666          | 3666          | Express API Server    |
| Frontend | 3555          | 3555          | React Application     |
| Redis    | 6379          | 6379          | Cache & Session Store |

---

## 🔍 Health Checks

### Backend Health Check
```bash
curl http://localhost:3666/health
```

**Expected Response:**
```json
{
  "success": true,
  "message": "zrokui backend is running",
  "port": 3666,
  "redis": "connected"
}
```

### Frontend Health Check
```bash
curl http://localhost:3555
```
Should return HTML content.

### Redis Health Check
```bash
docker exec -it zrokui-redis redis-cli ping
```
Should return: `PONG`

---

## 🐛 Troubleshooting

### View Logs
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f backend
docker-compose logs -f frontend
docker-compose logs -f redis
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
```

### Rebuild Images
```bash
# Rebuild and restart
docker-compose up -d --build

# Force rebuild
docker-compose build --no-cache
docker-compose up -d
```

### Clean Up
```bash
# Stop and remove containers
docker-compose down

# Remove volumes too
docker-compose down -v

# Remove images
docker-compose down --rmi all
```

---

## 🔐 Production Security

### 1. Change Default Passwords
```bash
# Generate secure passwords
openssl rand -base64 32  # For JWT_SECRET
openssl rand -base64 32  # For REDIS_PASSWORD
```

### 2. Use Nginx Reverse Proxy
```bash
# Copy nginx config
cp nginx-vps.conf /etc/nginx/sites-available/zrokui
ln -s /etc/nginx/sites-available/zrokui /etc/nginx/sites-enabled/

# Test config
nginx -t

# Reload nginx
systemctl reload nginx
```

### 3. Enable SSL/TLS
```bash
# Using certbot
certbot --nginx -d your-domain.com
```

### 4. Firewall Rules
```bash
# Allow only necessary ports
ufw allow 80/tcp    # HTTP
ufw allow 443/tcp   # HTTPS
ufw allow 22/tcp    # SSH

# Block direct access to backend/frontend
ufw deny 3666/tcp
ufw deny 3555/tcp
```

---

## 📦 GHCR Images

### Pull Latest Images
```bash
docker pull ghcr.io/ganeshchavan786/zrok-ui-backend:latest
docker pull ghcr.io/ganeshchavan786/zrok-ui-frontend:latest
```

### Pull Specific Version
```bash
docker pull ghcr.io/ganeshchavan786/zrok-ui-backend:43fd038
docker pull ghcr.io/ganeshchavan786/zrok-ui-frontend:43fd038
```

### Login to GHCR
```bash
echo $GITHUB_TOKEN | docker login ghcr.io -u YOUR_USERNAME --password-stdin
```

---

## 🔄 Update Deployment

### Update to Latest Version
```bash
cd docker

# Pull latest images
docker-compose -f docker-compose.prod.yml pull

# Restart with new images
docker-compose -f docker-compose.prod.yml up -d

# Check logs
docker-compose -f docker-compose.prod.yml logs -f
```

### Rollback to Previous Version
```bash
# Use specific image tag
# Edit docker-compose.prod.yml and change :latest to :previous-tag

docker-compose -f docker-compose.prod.yml up -d
```

---

## 📚 Related Documentation

- [VPS Deployment Guide](../docs/VPS-DEPLOYMENT.md)
- [GHCR Deployment](../docs/DEPLOY-GHCR.md)
- [Quick Reference](../docs/QUICK-REFERENCE.md)
- [Port Configuration](../docs/PORT-SUMMARY.md)

---

**Last Updated:** May 3, 2026  
**Docker Compose Version:** 2.x+  
**Docker Version:** 20.x+
