# 🏗️ Phase 1: Foundation & Testing

**Duration:** 1-2 weeks  
**Priority:** 🔴 Critical  
**Status:** 📋 Planned

## 🎯 Goals

1. Test existing zrok controller integration
2. Fix any integration issues
3. Add comprehensive error handling
4. Write unit tests for existing code
5. Document setup process
6. Ensure stability before adding new features

---

## 📋 Tasks Breakdown

### Task 1.1: Setup zrok Controller (2-3 days)

**Objective:** Get a working zrok controller for testing

**Steps:**
1. Install OpenZiti quickstart
2. Install zrok controller
3. Configure controller
4. Test controller APIs
5. Document setup process

**Files to Create:**
- `docs/ZROK-CONTROLLER-SETUP.md`

**Testing:**
```bash
# Test controller health
curl http://localhost:18080/api/v1/version

# Test account creation
curl -X POST http://localhost:18080/api/v1/account \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com"}'
```

**Success Criteria:**
- ✅ zrok controller running
- ✅ APIs responding
- ✅ Can create accounts
- ✅ Setup documented

---

### Task 1.2: Test Existing Integration (2-3 days)

**Objective:** Verify our zrokApi.ts works with real controller

**Files to Test:**
- `backend/src/services/zrokApi.ts`
- `backend/src/routes/tunnels.ts`

**Test Cases:**
```typescript
// Test 1: Account Metrics
const metrics = await zrokAccountMetrics(token);
expect(metrics).toHaveProperty('periods');

// Test 2: Share Metrics
const shareMetrics = await zrokShareMetrics(token, shareToken);
expect(shareMetrics).toHaveProperty('periods');

// Test 3: List Shares
const shares = await zrokListShares(token);
expect(Array.isArray(shares)).toBe(true);

// Test 4: Create Share
const share = await zrokCreateShare(token, {
  type: 'http',
  target: 'http://localhost:3000'
});
expect(share).toHaveProperty('token');

// Test 5: Delete Share
await zrokDeleteShare(token, shareToken);
// Should not throw error
```

**Issues to Fix:**
- API endpoint URLs
- Request/response formats
- Error handling
- Authentication headers

**Success Criteria:**
- ✅ All API calls work
- ✅ Proper error handling
- ✅ Correct data formats
- ✅ No breaking changes

---

### Task 1.3: Add Error Handling (1-2 days)

**Objective:** Comprehensive error handling throughout the app

**Files to Update:**
- `backend/src/services/zrokApi.ts`
- `backend/src/routes/*.ts`
- `frontend/src/services/api.ts`

**Error Types to Handle:**
```typescript
// 1. Network Errors
try {
  const response = await axios.get(url);
} catch (error) {
  if (error.code === 'ECONNREFUSED') {
    throw new Error('zrok controller not reachable');
  }
}

// 2. API Errors
if (response.status === 404) {
  throw new Error('Resource not found');
}

// 3. Validation Errors
if (!token) {
  throw new Error('Token is required');
}

// 4. Timeout Errors
axios.get(url, { timeout: 5000 });
```

**Error Response Format:**
```typescript
interface ErrorResponse {
  success: false;
  error: string;
  code?: string;
  details?: any;
}
```

**Success Criteria:**
- ✅ All errors caught
- ✅ User-friendly messages
- ✅ Proper HTTP status codes
- ✅ Error logging

---

### Task 1.4: Add Unit Tests (3-4 days)

**Objective:** Test coverage for existing code

**Test Files to Create:**
```
backend/src/__tests__/
├── services/
│   ├── redisService.test.ts
│   └── zrokApi.test.ts
├── routes/
│   ├── auth.test.ts
│   ├── tokens.test.ts
│   └── tunnels.test.ts
└── middleware/
    └── auth.test.ts

frontend/src/__tests__/
├── services/
│   └── api.test.ts
├── pages/
│   ├── Login.test.tsx
│   ├── Register.test.tsx
│   ├── Dashboard.test.tsx
│   └── Metrics.test.tsx
└── App.test.tsx
```

**Test Examples:**

**Backend Test:**
```typescript
// backend/src/__tests__/services/redisService.test.ts
import { redis } from '../../services/redisService';

describe('RedisService', () => {
  it('should set and get value', async () => {
    await redis.set('test-key', 'test-value');
    const value = await redis.get('test-key');
    expect(value).toBe('test-value');
  });

  it('should fallback to in-memory when Redis unavailable', () => {
    // Mock Redis failure
    expect(redis.isUsingInMemory()).toBe(true);
  });
});
```

**Frontend Test:**
```typescript
// frontend/src/__tests__/pages/Login.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import Login from '../../pages/auth/Login';

describe('Login Page', () => {
  it('should render login form', () => {
    render(<Login />);
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  });

  it('should submit form', async () => {
    render(<Login />);
    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' }
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'password123' }
    });
    fireEvent.click(screen.getByRole('button', { name: /login/i }));
    // Assert API call made
  });
});
```

**Test Commands:**
```bash
# Backend tests
cd backend
npm test
npm run test:coverage

# Frontend tests
cd frontend
npm test
npm run test:coverage
```

**Success Criteria:**
- ✅ 70%+ code coverage
- ✅ All critical paths tested
- ✅ Tests passing
- ✅ CI/CD integration

---

### Task 1.5: Environment Configuration (1 day)

**Objective:** Proper environment variable management

**Files to Create/Update:**
- `.env.example` (update)
- `backend/.env.example` (update)
- `docs/ENVIRONMENT-VARIABLES.md` (new)

**Environment Variables:**
```bash
# Backend
PORT=3666
NODE_ENV=development
JWT_SECRET=your-secret-key-change-this

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

# Frontend
VITE_API_URL=http://localhost:3666
```

**Validation:**
```typescript
// backend/src/config/env.ts
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string().default('3666'),
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_SECRET: z.string().min(32),
  REDIS_HOST: z.string().default('localhost'),
  REDIS_PORT: z.string().default('6379'),
  ZROK_API_URL: z.string().url(),
});

export const env = envSchema.parse(process.env);
```

**Success Criteria:**
- ✅ All env vars documented
- ✅ Validation in place
- ✅ Examples provided
- ✅ Secure defaults

---

### Task 1.6: Health Checks Enhancement (1 day)

**Objective:** Comprehensive health monitoring

**Files to Update:**
- `backend/src/index.ts`

**Enhanced Health Check:**
```typescript
app.get('/health', async (req, res) => {
  const health = {
    status: 'ok',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    services: {
      redis: redis.isUsingInMemory() ? 'in-memory' : 'connected',
      zrok: 'unknown',
    },
    version: '1.0.0',
  };

  // Test zrok controller
  try {
    await axios.get(`${process.env.ZROK_API_URL}/api/v1/version`, {
      timeout: 2000
    });
    health.services.zrok = 'connected';
  } catch (error) {
    health.services.zrok = 'disconnected';
    health.status = 'degraded';
  }

  const statusCode = health.status === 'ok' ? 200 : 503;
  res.status(statusCode).json(health);
});
```

**Success Criteria:**
- ✅ All services checked
- ✅ Proper status codes
- ✅ Useful information
- ✅ Fast response (<100ms)

---

### Task 1.7: Documentation (2 days)

**Objective:** Complete setup and development documentation

**Documents to Create:**
```
docs/
├── ZROK-CONTROLLER-SETUP.md    # How to setup zrok controller
├── ENVIRONMENT-VARIABLES.md     # All env vars explained
├── TESTING-GUIDE.md             # How to run tests
├── DEVELOPMENT-GUIDE.md         # Development workflow
└── TROUBLESHOOTING.md           # Common issues & fixes
```

**Success Criteria:**
- ✅ Clear instructions
- ✅ Examples provided
- ✅ Common issues covered
- ✅ Easy to follow

---

## 🔒 Safety Checklist

Before starting:
- [ ] Create feature branch: `feature/phase-1-foundation`
- [ ] Create backup tag: `backup-before-phase-1`
- [ ] Test current functionality
- [ ] Document current state

During development:
- [ ] Commit frequently
- [ ] Run tests after each change
- [ ] Don't modify existing working code
- [ ] Use feature flags for new code

After completion:
- [ ] All tests passing
- [ ] No breaking changes
- [ ] Documentation updated
- [ ] Code reviewed
- [ ] Merged to main
- [ ] Tagged: `v1.1.0`

---

## 📊 Progress Tracking

### Week 1:
- [ ] Task 1.1: Setup zrok Controller
- [ ] Task 1.2: Test Existing Integration
- [ ] Task 1.3: Add Error Handling
- [ ] Task 1.4: Add Unit Tests (start)

### Week 2:
- [ ] Task 1.4: Add Unit Tests (complete)
- [ ] Task 1.5: Environment Configuration
- [ ] Task 1.6: Health Checks Enhancement
- [ ] Task 1.7: Documentation

---

## 🎯 Deliverables

1. ✅ Working zrok controller integration
2. ✅ Comprehensive error handling
3. ✅ 70%+ test coverage
4. ✅ Complete documentation
5. ✅ No breaking changes
6. ✅ Stable foundation for Phase 2

---

## 🚀 Next Phase

After Phase 1 completion:
- Move to [Phase 2: Share Management UI](PHASE-2-SHARE-MANAGEMENT.md)
- Start implementing share creation UI
- Build on stable foundation

---

**Status:** 📋 Planned  
**Start Date:** TBD  
**End Date:** TBD  
**Completion:** 0%
