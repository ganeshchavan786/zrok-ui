# 📚 zrokui Documentation

Complete documentation for the zrokui project - a self-hosted zrok management platform.

## 📖 Table of Contents

### 🚀 Getting Started
- **[Quick Reference](QUICK-REFERENCE.md)** - Quick commands and common tasks
- **[Start Local Development](START-LOCAL.md)** - Run project locally
- **[Run Local](RUN-LOCAL.md)** - Alternative local setup guide
- **[Start Guide](START.md)** - General startup instructions

### 🎯 Features & Implementation
- **[Complete Feature List](COMPLETE-FEATURE-LIST.md)** - All implemented features
- **[User Flow](USER-FLOW.md)** - Complete user journey (Signup → Token → CLI → Metrics)
- **[Metrics Implementation](METRICS-IMPLEMENTATION.md)** - Metrics page details
- **[Redis Implementation](REDIS-IMPLEMENTATION.md)** - Redis service with fallback

### 🚢 Deployment
- **[Deployment Status](DEPLOYMENT-STATUS.md)** - Current deployment info
- **[VPS Deployment](VPS-DEPLOYMENT.md)** - Deploy to VPS with Docker
- **[Deploy to GHCR](DEPLOY-GHCR.md)** - GitHub Container Registry setup
- **[GitHub Actions Debug](GITHUB-ACTIONS-DEBUG.md)** - CI/CD troubleshooting

### ⚙️ Configuration
- **[Port Summary](PORT-SUMMARY.md)** - Port configuration overview
- **[Project Ports](PROJECT-PORTS.md)** - Detailed port mapping

---

## 🎯 Quick Links

### For Developers:
1. Start here: [Quick Reference](QUICK-REFERENCE.md)
2. Local setup: [Start Local Development](START-LOCAL.md)
3. Features: [Complete Feature List](COMPLETE-FEATURE-LIST.md)

### For DevOps:
1. Deployment: [VPS Deployment](VPS-DEPLOYMENT.md)
2. CI/CD: [Deploy to GHCR](DEPLOY-GHCR.md)
3. Status: [Deployment Status](DEPLOYMENT-STATUS.md)

### For Users:
1. User journey: [User Flow](USER-FLOW.md)
2. Getting started: [Start Guide](START.md)

---

## 📂 Documentation Structure

```
docs/
├── README.md                      # This file - Documentation index
│
├── Getting Started/
│   ├── QUICK-REFERENCE.md         # Quick commands
│   ├── START-LOCAL.md             # Local development
│   ├── RUN-LOCAL.md               # Alternative local setup
│   └── START.md                   # General startup
│
├── Features/
│   ├── COMPLETE-FEATURE-LIST.md   # All features
│   ├── USER-FLOW.md               # User journey
│   ├── METRICS-IMPLEMENTATION.md  # Metrics details
│   └── REDIS-IMPLEMENTATION.md    # Redis implementation
│
├── Deployment/
│   ├── DEPLOYMENT-STATUS.md       # Current status
│   ├── VPS-DEPLOYMENT.md          # VPS setup
│   ├── DEPLOY-GHCR.md             # GHCR setup
│   └── GITHUB-ACTIONS-DEBUG.md    # CI/CD debug
│
└── Configuration/
    ├── PORT-SUMMARY.md            # Port overview
    └── PROJECT-PORTS.md           # Port details
```

---

## 🎨 Project Overview

**zrokui** is a self-hosted web interface for managing zrok tunnels, similar to ngrok's dashboard.

### Key Features:
- ✅ User authentication (Login/Register)
- ✅ API token management
- ✅ Metrics dashboard with charts
- ✅ Tunnel management
- ✅ Redis persistence with fallback
- ✅ Dark theme UI
- ✅ Production-ready

### Tech Stack:
- **Backend:** Node.js + Express + TypeScript + Redis
- **Frontend:** React + TypeScript + Tailwind CSS + Recharts
- **DevOps:** Docker + GitHub Actions + GHCR

---

## 🚀 Quick Start

### Local Development:
```bash
# Clone repository
git clone https://github.com/ganeshchavan786/zrok-ui.git
cd zrok-ui

# Start Redis (optional - has in-memory fallback)
docker-compose -f docker-compose.redis-only.yml up -d

# Start backend
cd backend
npm install
npm run dev

# Start frontend (new terminal)
cd frontend
npm install
npm run dev

# Open browser
http://localhost:3555
```

### Production Deployment:
```bash
# On VPS
git clone https://github.com/ganeshchavan786/zrok-ui.git
cd zrok-ui

# Configure environment
cp .env.example .env
# Edit .env with your settings

# Deploy with Docker
docker-compose -f docker-compose.prod.yml up -d
```

See [VPS Deployment](VPS-DEPLOYMENT.md) for detailed instructions.

---

## 📊 Architecture

```
┌─────────────┐
│   Browser   │
└──────┬──────┘
       │
       ↓
┌─────────────┐     ┌─────────────┐
│  Frontend   │────→│   Backend   │
│  (React)    │     │  (Express)  │
│  Port 3555  │     │  Port 3666  │
└─────────────┘     └──────┬──────┘
                           │
                    ┌──────┴──────┐
                    ↓             ↓
              ┌──────────┐  ┌──────────┐
              │  Redis   │  │   zrok   │
              │ Port 6379│  │Controller│
              └──────────┘  └──────────┘
```

---

## 🔗 External Links

- **Repository:** https://github.com/ganeshchavan786/zrok-ui
- **GHCR Packages:** https://github.com/ganeshchavan786?tab=packages
- **GitHub Actions:** https://github.com/ganeshchavan786/zrok-ui/actions
- **Issues:** https://github.com/ganeshchavan786/zrok-ui/issues

---

## 📝 Contributing

Documentation improvements are welcome! Please:
1. Keep formatting consistent
2. Update this index when adding new docs
3. Use clear, concise language
4. Include code examples where helpful

---

## 📄 License

MIT License - See [LICENSE](../LICENSE) file for details

---

**Last Updated:** May 3, 2026  
**Version:** 1.0.0  
**Status:** Production Ready ✅
