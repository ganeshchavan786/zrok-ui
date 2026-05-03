# 🛡️ Safety Guidelines - Development Best Practices

**Critical:** Follow these guidelines to ensure existing functionality never breaks.

---

## 🎯 Core Principles

### 1. **Never Break Existing Features**
- Existing code must continue to work
- All existing APIs must remain functional
- UI must not regress
- No data loss

### 2. **Backward Compatibility**
- Don't remove existing endpoints
- Don't change existing API responses
- Add new, don't modify old
- Deprecate gradually

### 3. **Test Before Commit**
- Run all tests
- Manual testing
- Check health endpoints
- Verify UI works

---

## 📋 Pre-Development Checklist

Before starting any phase:

```bash
# 1. Create feature branch
git checkout -b feature/phase-X-name

# 2. Create backup tag
git tag backup-before-phase-X
git push origin backup-before-phase-X

# 3. Test current state
cd backend && npm test
cd frontend && npm test
npm run build

# 4. Document current state
git log --oneline -5 > current-state.txt
```

---

## 🔧 During Development

### 1. Use Feature Flags

**Backend:**
```typescript
// backend/src/config/features.ts
export const FEATURES = {
  NEW_SHARE_UI: process.env.ENABLE_NEW_SHARE_UI === 'true',
  TCP_TUNNELS: process.env.ENABLE_TCP_TUNNELS === 'true',
  // ... more features
};

// Usage in code
import { FEATURES } from './config/features';

if (FEATURES.NEW_SHARE_UI) {
  // New feature code
} else {
  // Existing code
}
```

**Frontend:**
```typescript
// frontend/src/config/features.ts
export const FEATURES = {
  NEW_SHARE_UI: import.meta.env.VITE_ENABLE_NEW_SHARE_UI === 'true',
};

// Usage in component
import { FEATURES } from '../../config/features';

{FEATURES.NEW_SHARE_UI ? (
  <NewShareUI />
) : (
  <OldShareUI />
)}
```

### 2. Add, Don't Modify

**❌ Bad - Modifying existing endpoint:**
```typescript
// DON'T DO THIS
app.get('/api/tunnels', (req, res) => {
  // Changed response format - BREAKS CLIENTS!
  res.json({ tunnels: data });
});
```

**✅ Good - Adding new endpoint:**
```typescript
// Keep old endpoint
app.get('/api/tunnels', (req, res) => {
  res.json({ success: true, data });
});

// Add new endpoint
app.get('/api/v2/tunnels', (req, res) => {
  res.json({ tunnels: data, metadata: {} });
});
```

### 3. Commit Frequently

```bash
# Small, focused commits
git add backend/src/services/newFeature.ts
git commit -m "Add newFeature service (no breaking changes)"

# Test before committing
npm test
npm run build

# Push to feature branch
git push origin feature/phase-X-name
```

### 4. Run Tests After Each Change

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# Integration test
docker compose -f docker/docker-compose.yml up -d
curl http://localhost:3666/health
curl http://localhost:3555
```

---

## 🧪 Testing Strategy

### 1. Unit Tests
```typescript
// Test new feature
describe('NewFeature', () => {
  it('should work correctly', () => {
    // Test implementation
  });
  
  it('should not break existing functionality', () => {
    // Test backward compatibility
  });
});
```

### 2. Integration Tests
```typescript
// Test API endpoints
describe('API Integration', () => {
  it('old endpoint still works', async () => {
    const response = await request(app).get('/api/tunnels');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('success');
  });
  
  it('new endpoint works', async () => {
    const response = await request(app).get('/api/v2/tunnels');
    expect(response.status).toBe(200);
  });
});
```

### 3. Manual Testing Checklist
```
Before merging:
[ ] Login works
[ ] Register works
[ ] Token creation works
[ ] Token deletion works
[ ] Metrics page loads
[ ] Dashboard loads
[ ] Navigation works
[ ] Logout works
[ ] Health check passes
[ ] No console errors
```

---

## 🔄 Rollback Strategy

### If Something Breaks:

**1. Immediate Rollback:**
```bash
# Revert to backup tag
git reset --hard backup-before-phase-X
git push origin main --force

# Or revert specific commit
git revert <commit-hash>
git push origin main
```

**2. Fix Forward:**
```bash
# Create hotfix branch
git checkout -b hotfix/fix-issue

# Fix the issue
# ... make changes ...

# Test thoroughly
npm test
npm run build

# Merge hotfix
git checkout main
git merge hotfix/fix-issue
git push origin main
```

**3. Feature Flag Disable:**
```bash
# Disable feature without code changes
export ENABLE_NEW_FEATURE=false

# Restart services
docker compose restart
```

---

## 📊 Health Monitoring

### Continuous Monitoring:

**1. Health Endpoint:**
```bash
# Check every 5 minutes
watch -n 300 'curl http://localhost:3666/health'
```

**2. Log Monitoring:**
```bash
# Watch logs
docker compose logs -f backend
docker compose logs -f frontend
```

**3. Error Tracking:**
```typescript
// Log all errors
app.use((err, req, res, next) => {
  console.error('ERROR:', {
    message: err.message,
    stack: err.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });
  next(err);
});
```

---

## 🚨 Red Flags - Stop Development If:

1. ❌ Tests failing
2. ❌ Build errors
3. ❌ Health check failing
4. ❌ Existing features broken
5. ❌ Data loss occurring
6. ❌ Performance degradation
7. ❌ Security vulnerabilities

**Action:** Fix immediately before continuing!

---

## ✅ Post-Development Checklist

After completing phase:

```bash
# 1. Run all tests
cd backend && npm test && npm run build
cd frontend && npm test && npm run build

# 2. Manual testing
# - Test all existing features
# - Test new features
# - Test edge cases

# 3. Code review
# - Review all changes
# - Check for breaking changes
# - Verify tests

# 4. Update documentation
# - Update README.md
# - Update API docs
# - Update CHANGELOG.md

# 5. Merge to main
git checkout main
git merge feature/phase-X-name
git push origin main

# 6. Tag release
git tag v1.X.0
git push origin v1.X.0

# 7. Deploy
docker compose -f docker/docker-compose.prod.yml pull
docker compose -f docker/docker-compose.prod.yml up -d

# 8. Monitor
# - Watch logs
# - Check health
# - Monitor errors
```

---

## 📝 Documentation Requirements

Every change must include:

1. **Code Comments:**
   ```typescript
   /**
    * Creates a new share
    * @param token - User's zrok token
    * @param config - Share configuration
    * @returns Share details with token
    * @throws Error if creation fails
    */
   async function createShare(token: string, config: ShareConfig) {
     // Implementation
   }
   ```

2. **API Documentation:**
   ```markdown
   ## POST /api/shares
   
   Create a new share.
   
   **Request:**
   ```json
   {
     "type": "http",
     "target": "http://localhost:3000"
   }
   ```
   
   **Response:**
   ```json
   {
     "success": true,
     "data": {
       "token": "abc123",
       "url": "https://abc123.zrok.io"
     }
   }
   ```
   ```

3. **CHANGELOG Entry:**
   ```markdown
   ## [1.2.0] - 2026-05-10
   
   ### Added
   - Share management UI
   - Share creation form
   - Share listing page
   
   ### Changed
   - None
   
   ### Fixed
   - None
   
   ### Breaking Changes
   - None
   ```

---

## 🎯 Success Criteria

Phase is complete when:

- ✅ All tests passing
- ✅ No breaking changes
- ✅ Documentation updated
- ✅ Code reviewed
- ✅ Deployed successfully
- ✅ Monitoring shows no issues
- ✅ User feedback positive

---

## 🆘 Getting Help

If stuck or unsure:

1. **Review existing code** - See how similar features are implemented
2. **Check documentation** - Read zrok docs, our docs
3. **Test in isolation** - Create minimal test case
4. **Ask for review** - Get second opinion
5. **Rollback if needed** - Better safe than sorry

---

**Remember:** It's better to take more time and do it safely than to rush and break things!

**Motto:** "Move fast, but don't break things!"
