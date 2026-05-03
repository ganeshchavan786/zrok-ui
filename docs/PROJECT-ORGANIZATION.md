# 📂 Project Organization

Complete guide to the zrokui project structure and organization.

## 🎯 Overview

The project is organized into logical folders for better maintainability and scalability:

```
zrokui/
├── 📚 docs/          # All documentation
├── 🐳 docker/        # Docker configurations
├── 🔧 scripts/       # Utility scripts
├── 🖥️  backend/      # Express API server
├── 🎨 frontend/      # React application
├── 💻 cli/           # Command-line tool
└── 🌐 nginx/         # Nginx configurations
```

---

## 📚 Documentation (`docs/`)

**Purpose:** Centralized documentation for all aspects of the project

**Structure:**
```
docs/
├── README.md                      # Documentation index
│
├── Getting Started/
│   ├── QUICK-REFERENCE.md         # Quick commands
│   ├── START-LOCAL.md             # Local development
│   ├── RUN-LOCAL.md               # Alternative setup
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
    ├── PROJECT-PORTS.md           # Port details
    └── PROJECT-ORGANIZATION.md    # This file
```

**Navigation:**
- Start with `docs/README.md` for complete index
- Each category has focused documentation
- Cross-references between related docs

---

## 🐳 Docker (`docker/`)

**Purpose:** All Docker-related configurations in one place

**Files:**
```
docker/
├── README.md                      # Docker guide
├── docker-compose.yml             # Default development
├── docker-compose.dev.yml         # Dev with hot reload
├── docker-compose.prod.yml        # Production deployment
├── docker-compose.redis-only.yml  # Redis only
└── nginx-vps.conf                 # Nginx reverse proxy
```

**Usage:**
```bash
# Development
docker compose -f docker/docker-compose.yml up -d

# Production
docker compose -f docker/docker-compose.prod.yml up -d

# Redis only
docker compose -f docker/docker-compose.redis-only.yml up -d
```

**Benefits:**
- All Docker configs in one place
- Easy to find and modify
- Clear separation of environments
- Documented in docker/README.md

---

## 🔧 Scripts (`scripts/`)

**Purpose:** Utility scripts for setup and maintenance

**Files:**
```
scripts/
├── README.md           # Scripts guide
├── bootstrap.sh        # Initial project setup
├── start-local.sh      # Start development
└── fix-docker-dns.sh   # Fix Docker DNS issues
```

**Usage:**
```bash
# First time setup
./scripts/bootstrap.sh

# Daily development
./scripts/start-local.sh

# Fix Docker DNS (Linux)
sudo ./scripts/fix-docker-dns.sh
```

**Benefits:**
- Automated setup process
- Consistent development environment
- Easy onboarding for new developers
- Documented in scripts/README.md

---

## 🖥️ Backend (`backend/`)

**Purpose:** Express.js API server with TypeScript

**Structure:**
```
backend/
├── src/
│   ├── index.ts              # Main server
│   ├── routes/               # API routes
│   │   ├── auth.ts          # Authentication
│   │   ├── tokens.ts        # Token management
│   │   └── tunnels.ts       # Tunnel/Metrics
│   ├── services/             # Business logic
│   │   ├── redisService.ts  # Redis with fallback
│   │   ├── zrokApi.ts       # zrok integration
│   │   ├── emailService.ts  # Email sending
│   │   └── planLimits.ts    # Plan limits
│   ├── middleware/           # Express middleware
│   │   └── auth.ts          # JWT authentication
│   └── utils/                # Helper functions
│       └── index.ts         # Logger
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── Dockerfile                # Docker image
└── .env                      # Environment variables
```

**Key Features:**
- TypeScript strict mode
- JWT authentication
- Redis with in-memory fallback
- zrok controller integration
- Error handling
- Health checks

---

## 🎨 Frontend (`frontend/`)

**Purpose:** React application with TypeScript and Tailwind CSS

**Structure:**
```
frontend/
├── src/
│   ├── main.tsx              # Entry point
│   ├── App.tsx               # Main component
│   ├── index.css             # Global styles
│   ├── pages/                # Page components
│   │   ├── auth/            # Authentication pages
│   │   │   ├── Login.tsx
│   │   │   └── Register.tsx
│   │   └── dashboard/       # Dashboard pages
│   │       ├── Dashboard.tsx
│   │       └── Metrics.tsx
│   └── services/             # API client
│       └── api.ts           # Axios client
├── package.json              # Dependencies
├── tsconfig.json             # TypeScript config
├── vite.config.ts            # Vite config
├── tailwind.config.js        # Tailwind config
├── Dockerfile                # Docker image
└── nginx.conf                # Nginx config
```

**Key Features:**
- React 18 with hooks
- TypeScript strict mode
- Tailwind CSS dark theme
- Recharts for metrics
- React Router for navigation
- Axios for API calls

---

## 💻 CLI (`cli/`)

**Purpose:** Command-line tool for automation

**Structure:**
```
cli/
├── src/
│   ├── index.ts              # CLI entry point
│   ├── commands/             # CLI commands
│   │   └── index.ts         # Command definitions
│   ├── services/             # CLI services
│   │   ├── api.ts           # API client
│   │   └── zrokRunner.ts    # zrok process
│   └── utils/                # Helper functions
│       ├── config.ts        # Config management
│       └── display.ts       # Terminal output
├── package.json              # Dependencies
└── tsconfig.json             # TypeScript config
```

**Key Features:**
- Commander.js for CLI
- Chalk for colors
- Ora for spinners
- Config management
- API integration

---

## 🌐 Nginx (`nginx/`)

**Purpose:** Nginx configuration files

**Structure:**
```
nginx/
└── zrokui.conf               # Default nginx config
```

**Note:** Additional nginx config in `docker/nginx-vps.conf` for VPS deployment.

---

## 📊 Root Directory

**Files in Root:**
```
zrokui/
├── README.md                 # Main project README
├── LICENSE                   # MIT License
├── .gitignore                # Git ignore rules
├── .env.example              # Environment template
└── .github/                  # GitHub configurations
    └── workflows/
        └── deploy.yml        # CI/CD workflow
```

**Clean Root:**
- Only essential files
- No scattered documentation
- No loose scripts
- Professional appearance

---

## 🎯 Benefits of This Organization

### 1. **Clarity**
- Easy to find files
- Logical grouping
- Clear purpose for each folder

### 2. **Scalability**
- Easy to add new docs
- Easy to add new scripts
- Easy to add new Docker configs

### 3. **Maintainability**
- Related files together
- Easy to update
- Easy to refactor

### 4. **Professionalism**
- Clean root directory
- Well-documented
- Industry standard structure

### 5. **Onboarding**
- New developers can navigate easily
- Clear documentation structure
- Guided learning path

---

## 🔍 Finding Files

### Documentation
```bash
# All docs
ls docs/

# Specific category
ls docs/*DEPLOY*
ls docs/*METRICS*
```

### Docker Configs
```bash
# All Docker files
ls docker/

# Specific compose file
ls docker/*prod*
```

### Scripts
```bash
# All scripts
ls scripts/

# Make executable
chmod +x scripts/*.sh
```

---

## 📝 Adding New Files

### New Documentation
```bash
# Add to appropriate category in docs/
touch docs/NEW-FEATURE.md

# Update docs/README.md index
nano docs/README.md
```

### New Docker Config
```bash
# Add to docker/ folder
touch docker/docker-compose.custom.yml

# Update docker/README.md
nano docker/README.md
```

### New Script
```bash
# Add to scripts/ folder
touch scripts/new-script.sh
chmod +x scripts/new-script.sh

# Update scripts/README.md
nano scripts/README.md
```

---

## 🔄 Migration Notes

### What Changed (May 3, 2026)

**Before:**
```
zrokui/
├── README.md
├── METRICS-IMPLEMENTATION.md
├── REDIS-IMPLEMENTATION.md
├── ... (14 more .md files)
├── docker-compose.yml
├── docker-compose.prod.yml
├── ... (2 more compose files)
├── fix-docker-dns.sh
├── start-local.sh
└── ... (rest of project)
```

**After:**
```
zrokui/
├── README.md
├── docs/              # 📚 All documentation
├── docker/            # 🐳 All Docker configs
├── scripts/           # 🔧 All scripts
└── ... (rest of project)
```

**Changes:**
- Moved 14 .md files → `docs/`
- Moved 4 compose files → `docker/`
- Moved 2 .sh files → `scripts/`
- Added README.md in each folder
- Updated main README.md

**Git History:**
- Git tracked as renames (not deletions)
- Full history preserved
- Commit: `0165b52`

---

## 🎉 Summary

**Organization:**
- ✅ Clean root directory
- ✅ Logical folder structure
- ✅ Comprehensive documentation
- ✅ Easy navigation
- ✅ Professional appearance

**Folders:**
- 📚 `docs/` - 15 documentation files
- 🐳 `docker/` - 5 Docker configs + nginx
- 🔧 `scripts/` - 3 utility scripts + README
- 🖥️ `backend/` - Express API server
- 🎨 `frontend/` - React application
- 💻 `cli/` - Command-line tool

**Benefits:**
- Easier to find files
- Better for collaboration
- Scalable structure
- Professional project
- Great first impression

---

**Last Updated:** May 3, 2026  
**Commit:** 0165b52  
**Status:** Production Ready ✅
