# 🛡️ Safe Development - zrokui Project

**Critical Skill:** Always maintain existing functionality while adding new features.

---

## 🎯 Core Rules

### 1. **NEVER Break Existing Features**
- All existing APIs must continue to work
- UI must not regress
- No data loss
- Backward compatibility is mandatory

### 2. **Always Use Feature Flags**
```typescript
// Backend
const FEATURES = {
  NEW_FEATURE: process.env.ENABLE_NEW_FEATURE === 'true',
};

if (FEATURES.NEW_FEATURE) {
  // New code
} else {
  // Existing code (always works)
}

// Frontend
const FEATURES = {
  NEW_FEATURE: import.meta.env.VITE_ENABLE_NEW_FEATURE === 'true',
};

{FEATURES.NEW_FEATURE ? <NewComponent /> : <OldComponent />}
```

### 3. **Add, Don't Modify**
```typescript
// ❌ DON'T modify existing endpoints
app.get('/api/tunnels', (req, res) => {
  res.json({ tunnels: data }); // BREAKS CLIENTS!
});

// ✅ DO add new endpoints
app.get('/api/tunnels', (req, res) => {
  res.json({ success: true, data }); // Keep old format
});

app.get('/api/v2/tunnels', (req, res) => {
  res.json({ tunnels: data, metadata: {} }); // New format
});
```

---

## 📋 Before Starting Any Work

```bash
# 1. Create feature branch
git checkout -b feature/descriptive-name

# 2. Create backup tag
git tag backup-before-feature
git push origin backup-before-feature

# 3. Test current state
cd backend && npm test && npm run build
cd frontend && npm test && npm run build

# 4. Verify health
curl http://localhost:3666/health
curl http://localhost:3555
```

---

## 🔧 During Development

### Commit Checklist:
- [ ] Tests passing
- [ ] Build successful
- [ ] No breaking changes
- [ ] Feature flag used
- [ ] Documentation updated

### Test After Each Change:
```bash
# Run tests
npm test

# Build
npm run build

# Manual test
# - Login works
# - Dashboard works
# - Metrics works
# - New feature works (if enabled)
```

---

## 🚨 If Something Breaks

### Immediate Actions:
1. **Stop development**
2. **Assess impact**
3. **Rollback if critical:**
   ```bash
   git reset --hard backup-before-feature
   git push origin main --force
   ```
4. **Or fix forward:**
   ```bash
   git checkout -b hotfix/fix-issue
   # Fix the issue
   git checkout main
   git merge hotfix/fix-issue
   ```

---

## ✅ Before Merging

### Final Checklist:
- [ ] All tests passing
- [ ] Build successful
- [ ] Manual testing complete
- [ ] No breaking changes
- [ ] Documentation updated
- [ ] CHANGELOG updated
- [ ] Code reviewed

### Merge Process:
```bash
# 1. Update from main
git checkout main
git pull origin main

# 2. Merge feature
git merge feature/descriptive-name

# 3. Test again
npm test
npm run build

# 4. Push
git push origin main

# 5. Tag release
git tag v1.X.0
git push origin v1.X.0
```

---

## 📊 Current Project State

### Working Features (DO NOT BREAK):
- ✅ User authentication (Login/Register)
- ✅ Token management (Create/List/Delete)
- ✅ Metrics dashboard (Charts)
- ✅ Navigation
- ✅ Health checks
- ✅ Redis with fallback
- ✅ Docker deployment

### Critical Files (Handle with Care):
```
backend/src/
├── index.ts              # Main server
├── routes/
│   ├── auth.ts          # Auth APIs
│   ├── tokens.ts        # Token APIs
│   └── tunnels.ts       # Tunnel APIs
├── services/
│   ├── redisService.ts  # Redis with fallback
│   └── zrokApi.ts       # zrok integration
└── middleware/
    └── auth.ts          # JWT middleware

frontend/src/
├── App.tsx              # Main routing
├── pages/
│   ├── auth/           # Login/Register
│   └── dashboard/      # Dashboard/Metrics
└── services/
    └── api.ts          # API client
```

---

## 🎯 Development Phases

### Current: Phase 0 (Planning Complete)
### Next: Phase 1 (Foundation & Testing)

**Phase 1 Focus:**
- Test zrok controller integration
- Add comprehensive error handling
- Write unit tests
- Document setup process
- **NO NEW FEATURES** - Only testing & stability

**See:** `plan/PHASE-1-FOUNDATION.md` for details

---

## 💡 Key Principles

1. **Safety First** - Don't break existing features
2. **Test Everything** - Before and after changes
3. **Feature Flags** - New code behind flags
4. **Backward Compatible** - Add, don't modify
5. **Document Changes** - Update docs
6. **Commit Often** - Small, focused commits
7. **Rollback Ready** - Always have backup

---

## 🆘 Emergency Contacts

**If stuck:**
1. Check `plan/SAFETY-GUIDELINES.md`
2. Review existing code patterns
3. Test in isolation
4. Rollback if unsure

**Remember:** Better to take time and do it safely than rush and break things!

---

**Last Updated:** May 3, 2026  
**Project Status:** Stable & Production Ready  
**Next Phase:** Phase 1 (Foundation & Testing)
