# 🔧 Environment Variables

Complete guide to all environment variables used in zrokui.

---

## 📋 Backend Environment Variables

### Required Variables

#### Server Configuration
```bash
# Port for backend server
PORT=3666

# Node environment
NODE_ENV=development  # Options: development, production, test
```

#### Security
```bash
# JWT secret for token signing (MUST be changed in production!)
# Generate with: openssl rand -base64 32
JWT_SECRET=your-secret-key-change-this-in-production
```

#### Redis Configuration
```bash
# Redis host
REDIS_HOST=localhost

# Redis port
REDIS_PORT=6379

# Redis password (optional, leave empty for no password)
REDIS_PASSWORD=
```

---

### Optional Variables

#### zrok Controller
```bash
# zrok controller API URL
# For self-hosted: http://your-controller:18080
# For zrok.io: https://api.zrok.io
ZROK_API_URL=http://localhost:18080

# zrok controller admin token (if required)
ZROK_CONTROLLER_TOKEN=
```

#### Email Configuration (for future features)
```bash
# SMTP server host
SMTP_HOST=smtp.gmail.com

# SMTP server port
SMTP_PORT=587

# SMTP username
SMTP_USER=your-email@gmail.com

# SMTP password or app password
SMTP_PASS=your-app-password

# Email sender address
EMAIL_FROM=noreply@zrokui.com
```

#### Logging
```bash
# Log level
LOG_LEVEL=info  # Options: error, warn, info, debug

# Log format
LOG_FORMAT=json  # Options: json, simple
```

---

## 🎨 Frontend Environment Variables

### Required Variables

```bash
# Backend API URL
VITE_API_URL=http://localhost:3666
```

### Optional Variables

```bash
# Enable new features (for development)
VITE_ENABLE_NEW_SHARE_UI=false
VITE_ENABLE_TCP_TUNNELS=false
VITE_ENABLE_FILE_SHARING=false

# Analytics (for future)
VITE_ANALYTICS_ID=
```

---

## 📝 Configuration Files

### Backend `.env` File

Create `backend/.env`:

```bash
# Server
PORT=3666
NODE_ENV=development

# Security
JWT_SECRET=change-this-to-a-secure-random-string-in-production

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# zrok Controller
ZROK_API_URL=http://localhost:18080
ZROK_CONTROLLER_TOKEN=

# Email (optional)
SMTP_HOST=
SMTP_PORT=
SMTP_USER=
SMTP_PASS=
EMAIL_FROM=

# Logging
LOG_LEVEL=info
LOG_FORMAT=json
```

### Frontend `.env` File

Create `frontend/.env`:

```bash
# Backend API
VITE_API_URL=http://localhost:3666

# Feature Flags (development only)
VITE_ENABLE_NEW_SHARE_UI=false
VITE_ENABLE_TCP_TUNNELS=false
VITE_ENABLE_FILE_SHARING=false
```

### Root `.env` File (for docker-compose)

Create `.env` in project root:

```bash
# Backend
BACKEND_PORT=3666
JWT_SECRET=change-this-in-production

# Frontend
FRONTEND_PORT=3555
VITE_API_URL=http://localhost:3666

# Redis
REDIS_PORT=6379
REDIS_PASSWORD=

# zrok
ZROK_API_URL=http://localhost:18080
```

---

## 🔒 Security Best Practices

### 1. Generate Secure Secrets

```bash
# Generate JWT secret
openssl rand -base64 32

# Generate Redis password
openssl rand -base64 24

# Generate random string
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Never Commit Secrets

```bash
# .gitignore should include:
.env
.env.local
.env.*.local
backend/.env
frontend/.env
```

### 3. Use Different Secrets Per Environment

```bash
# Development
JWT_SECRET=dev-secret-not-for-production

# Production
JWT_SECRET=<generated-secure-random-string>
```

### 4. Rotate Secrets Regularly

- Change JWT_SECRET every 90 days
- Change Redis password every 90 days
- Update after any security incident

---

## 🐳 Docker Environment Variables

### docker-compose.yml

```yaml
services:
  backend:
    environment:
      - PORT=${BACKEND_PORT:-3666}
      - NODE_ENV=production
      - JWT_SECRET=${JWT_SECRET}
      - REDIS_HOST=redis
      - REDIS_PORT=6379
      - REDIS_PASSWORD=${REDIS_PASSWORD}
      - ZROK_API_URL=${ZROK_API_URL}

  frontend:
    environment:
      - VITE_API_URL=${VITE_API_URL}

  redis:
    environment:
      - REDIS_PASSWORD=${REDIS_PASSWORD}
```

---

## ✅ Validation

### Backend Validation

Create `backend/src/config/env.ts`:

```typescript
import { z } from 'zod';

const envSchema = z.object({
  // Server
  PORT: z.string().default('3666'),
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  
  // Security
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters'),
  
  // Redis
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  REDIS_PASSWORD: z.string().optional(),
  
  // zrok
  ZROK_API_URL: z.string().url().optional(),
  ZROK_CONTROLLER_TOKEN: z.string().optional(),
  
  // Email
  SMTP_HOST: z.string().optional(),
  SMTP_PORT: z.string().optional(),
  SMTP_USER: z.string().optional(),
  SMTP_PASS: z.string().optional(),
  EMAIL_FROM: z.string().email().optional(),
  
  // Logging
  LOG_LEVEL: z.enum(['error', 'warn', 'info', 'debug']).default('info'),
  LOG_FORMAT: z.enum(['json', 'simple']).default('json'),
});

export const env = envSchema.parse(process.env);

// Export typed environment
export type Env = z.infer<typeof envSchema>;
```

### Usage in Code

```typescript
import { env } from './config/env';

// Type-safe access
const port = env.PORT;
const jwtSecret = env.JWT_SECRET;
```

---

## 🧪 Testing Environment

### Test `.env` File

Create `backend/.env.test`:

```bash
NODE_ENV=test
PORT=3667
JWT_SECRET=test-secret-do-not-use-in-production
REDIS_HOST=localhost
REDIS_PORT=6379
LOG_LEVEL=error
```

### Load in Tests

```typescript
// backend/src/__tests__/setup.ts
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../../.env.test') });
```

---

## 📊 Environment Checklist

### Development
- [ ] `backend/.env` created
- [ ] `frontend/.env` created
- [ ] JWT_SECRET set (can be simple)
- [ ] Redis configured
- [ ] VITE_API_URL points to localhost:3666

### Production
- [ ] Strong JWT_SECRET (32+ chars)
- [ ] Redis password set
- [ ] ZROK_API_URL configured
- [ ] Email configured (if needed)
- [ ] All secrets in secure storage
- [ ] Environment variables validated

---

## 🆘 Troubleshooting

### Issue: "JWT_SECRET is required"
```bash
# Solution: Set JWT_SECRET in .env
echo "JWT_SECRET=$(openssl rand -base64 32)" >> backend/.env
```

### Issue: "Cannot connect to Redis"
```bash
# Solution: Check Redis is running
docker ps | grep redis

# Or start Redis
docker compose -f docker/docker-compose.redis-only.yml up -d
```

### Issue: "VITE_API_URL not defined"
```bash
# Solution: Create frontend/.env
echo "VITE_API_URL=http://localhost:3666" > frontend/.env
```

---

## 📚 Related Documentation

- [Quick Reference](QUICK-REFERENCE.md)
- [Start Local Development](START-LOCAL.md)
- [VPS Deployment](VPS-DEPLOYMENT.md)
- [Safety Guidelines](../plan/SAFETY-GUIDELINES.md)

---

**Last Updated:** May 3, 2026  
**Phase:** Phase 1 (Foundation & Testing)  
**Status:** ✅ Complete
