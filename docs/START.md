# 🚀 zrokui — Quick Start Guide

## Ports Configuration
- **Backend API:** http://localhost:3666
- **Frontend Dashboard:** http://localhost:3555
- **Redis:** localhost:6379
- **zrok Controller:** localhost:18080
- **zrok Frontend:** localhost:8090

---

## 📦 Local Development Setup

### 1️⃣ Generate Secrets
```bash
# Generate random tokens
openssl rand -hex 32  # Use for ZROK_ADMIN_TOKEN
openssl rand -hex 32  # Use for JWT_SECRET
openssl rand -hex 32  # Use for REDIS_PASSWORD
```

### 2️⃣ Update .env File
Edit `.env` and replace placeholder values:
```bash
ZROK_ADMIN_TOKEN=<generated_token_1>
JWT_SECRET=<generated_token_2>
REDIS_PASSWORD=<generated_token_3>
ZITI_ADMIN_PASSWORD=<strong_password>
```

### 3️⃣ Start Services
```bash
# Start all services
docker compose up -d

# Check logs
docker compose logs -f backend
docker compose logs -f frontend
```

### 4️⃣ Bootstrap zrok
```bash
# Wait 30 seconds for zrok-controller to start, then:
bash scripts/bootstrap.sh
```

### 5️⃣ Access Dashboard
Open browser:
- **Frontend:** http://localhost:3555
- **Backend API:** http://localhost:3666/health

---

## 🛠️ Development Commands

```bash
# View all containers
docker compose ps

# Restart a service
docker compose restart backend
docker compose restart frontend

# View logs
docker compose logs -f backend
docker compose logs -f frontend

# Stop all services
docker compose down

# Stop and remove volumes (fresh start)
docker compose down -v
```

---

## 🐛 Troubleshooting

### Backend not starting?
```bash
# Check backend logs
docker compose logs backend

# Check if Redis is running
docker compose ps redis

# Restart backend
docker compose restart backend
```

### Frontend not loading?
```bash
# Check frontend logs
docker compose logs frontend

# Rebuild frontend
docker compose up -d --build frontend
```

### Port already in use?
```bash
# Check what's using the port
netstat -ano | findstr :3666
netstat -ano | findstr :3555

# Kill the process or change ports in docker-compose.yml
```

---

## 📝 Next Steps

1. **Create Admin Account:**
   - Run `bash scripts/bootstrap.sh`
   - Save the account token

2. **Install CLI:**
   ```bash
   cd cli
   npm install
   npm link
   ```

3. **Enable CLI:**
   ```bash
   zrokui enable <account_token>
   zrokui login --token <api_token>
   ```

4. **Create First Tunnel:**
   ```bash
   zrokui http 8080
   ```

---

## 🌐 Production Deployment

See `DEPLOY.md` for VPS deployment with:
- GitHub Container Registry (GHCR)
- Nginx reverse proxy
- Let's Encrypt SSL
- Wildcard DNS setup
