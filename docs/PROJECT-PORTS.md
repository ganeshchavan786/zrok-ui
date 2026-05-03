# 🔌 zrokui Project Ports & Architecture

## 📊 Port Configuration

| Service  | Port | URL                      | Description           |
|----------|------|--------------------------|-----------------------|
| Backend  | 3666 | http://localhost:3666    | Express API Server    |
| Frontend | 3555 | http://localhost:3555    | React + Vite Dev      |
| Redis    | 6379 | localhost:6379           | Cache & Session Store |

---

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────┐
│                         Browser                              │
│                   http://localhost:3555                      │
└────────────────────────┬────────────────────────────────────┘
                         │
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Frontend (React)                          │
│                    Port: 3555                                │
│  • Vite Dev Server                                           │
│  • Tailwind CSS (Dark Theme)                                 │
│  • Proxy: /api → http://localhost:3666                       │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ HTTP Requests
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                Backend (Express + TypeScript)                │
│                    Port: 3666                                │
│  • REST API                                                  │
│  • JWT Authentication                                        │
│  • Request Validation (zod)                                  │
│  • Error Handling                                            │
└────────────────────────┬────────────────────────────────────┘
                         │
                         │ Redis Client (ioredis)
                         ▼
┌─────────────────────────────────────────────────────────────┐
│                    Redis (Docker)                            │
│                    Port: 6379                                │
│  • Session Storage                                           │
│  • Cache                                                     │
│  • Rate Limiting                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 📁 Project Structure

```
zrokui/
├── backend/                    # Node.js + Express API
│   ├── src/
│   │   ├── index.ts           # Main server (Port 3666)
│   │   ├── services/          # Business logic
│   │   └── utils/             # Helper functions
│   ├── .env                   # Backend config
│   └── package.json
│
├── frontend/                   # React + Vite
│   ├── src/
│   │   ├── App.tsx            # Main component
│   │   ├── pages/             # Page components
│   │   └── main.tsx           # Entry point
│   ├── vite.config.ts         # Port 3555 config
│   └── package.json
│
├── cli/                        # CLI tool
│   └── src/
│       ├── commands/          # CLI commands
│       └── services/          # CLI services
│
├── docker-compose.redis-only.yml   # Local Redis only
├── docker-compose.yml              # Full stack (Docker)
├── docker-compose.prod.yml         # Production (VPS)
│
├── .github/
│   └── workflows/
│       └── deploy.yml         # GHCR deployment
│
├── START-LOCAL.md             # Local dev guide
├── DEPLOY-GHCR.md             # Deployment guide
└── PROJECT-PORTS.md           # This file
```

---

## 🚀 Quick Start Commands

### Local Development (Recommended)

```bash
# 1. Start Redis (Docker WSL)
docker compose -f docker-compose.redis-only.yml up -d

# 2. Start Backend (Terminal 1)
cd backend
npm install
npm run dev

# 3. Start Frontend (Terminal 2)
cd frontend
npm install
npm run dev
```

### Full Docker Stack

```bash
# Start everything in Docker
docker compose up -d

# View logs
docker logs -f zrokui-backend
docker logs -f zrokui-frontend
```

---

## 🌐 API Endpoints

### Backend (Port 3666)

| Method | Endpoint       | Description          |
|--------|----------------|----------------------|
| GET    | /health        | Health check         |
| GET    | /api/status    | Server status        |
| POST   | /api/auth/*    | Authentication       |
| GET    | /api/shares/*  | Share management     |

### Frontend Routes (Port 3555)

| Route           | Component        | Description          |
|-----------------|------------------|----------------------|
| /               | Dashboard        | Main dashboard       |
| /login          | Login            | User login           |
| /shares         | Shares           | Share management     |
| /metrics        | Metrics          | Analytics            |

---

## 🔐 Environment Variables

### Backend (.env)

```bash
# Server
PORT=3666
NODE_ENV=development

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=<your-password>

# JWT
JWT_SECRET=<your-secret>

# Domain
BASE_DOMAIN=localhost

# Admin
ADMIN_EMAIL=admin@zrokui.local
INVITES_ONLY=false
```

### Frontend (Vite)

```typescript
// vite.config.ts
server: {
  port: 3555,
  proxy: {
    '/api': 'http://localhost:3666'
  }
}
```

---

## 🐳 Docker Images

### Local Development
- **Redis**: `redis:7-alpine`

### Production (GHCR)
- **Backend**: `ghcr.io/YOUR_USERNAME/YOUR_REPO/backend:latest`
- **Frontend**: `ghcr.io/YOUR_USERNAME/YOUR_REPO/frontend:latest`
- **Redis**: `redis:7-alpine`

---

## 📝 Development Workflow

1. **Local Development** (START-LOCAL.md)
   - Redis in Docker WSL
   - Backend/Frontend locally
   - Fast hot-reload

2. **Testing**
   - Unit tests: `npm test`
   - Integration tests: Full Docker stack

3. **Deployment** (DEPLOY-GHCR.md)
   - Push to GitHub
   - GitHub Actions builds images
   - Push to GHCR
   - Pull on VPS

---

## 🔧 Troubleshooting

### Port Already in Use

```bash
# Windows
netstat -ano | findstr :3666
netstat -ano | findstr :3555
taskkill /PID <PID> /F

# Linux/WSL
lsof -ti:3666 | xargs kill -9
lsof -ti:3555 | xargs kill -9
```

### Redis Connection Failed

```bash
# Check Redis
docker ps | grep redis
docker logs zrokui-redis

# Test connection
redis-cli -h localhost -p 6379 -a <password> ping
```

### Frontend Can't Reach Backend

1. Check backend is running: `curl http://localhost:3666/health`
2. Check vite.config.ts proxy settings
3. Check CORS settings in backend

---

## 📚 Documentation

- **Local Setup**: START-LOCAL.md
- **Deployment**: DEPLOY-GHCR.md
- **Architecture**: PROJECT-PORTS.md (this file)
- **Steering Rules**: .kiro/steering/rules.md

---

## 🎯 Next Steps

1. ✅ Local development setup
2. ⬜ Add authentication
3. ⬜ Add share management
4. ⬜ Add metrics/analytics
5. ⬜ Deploy to VPS
6. ⬜ Setup domain & SSL
