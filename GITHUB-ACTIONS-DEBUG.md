# 🔍 GitHub Actions Debugging Guide

## 📊 Current Status

**Repository**: https://github.com/ganeshchavan786/zrok-ui
**Actions**: https://github.com/ganeshchavan786/zrok-ui/actions

---

## ✅ What Was Fixed

### Issue 1: Frontend Build Script
**Problem**: `"build": "tsc && vite build"` was running TypeScript compiler before Vite
**Solution**: Changed to `"build": "vite build"` (Vite handles TypeScript internally)

### Issue 2: Workflow Structure
**Problem**: Single job building both images sequentially
**Solution**: Split into two parallel jobs (`build-backend` and `build-frontend`)

### Issue 3: Build Caching
**Added**: GitHub Actions cache for faster builds
```yaml
cache-from: type=gha
cache-to: type=gha,mode=max
```

---

## 🔍 How to Check Build Status

### 1. View All Workflows
```
https://github.com/ganeshchavan786/zrok-ui/actions
```

### 2. Check Specific Workflow Run
Click on any workflow run to see:
- ✅ Green checkmark = Success
- ❌ Red X = Failed
- 🟡 Yellow dot = In progress

### 3. View Logs
1. Click on failed workflow
2. Click on job name (e.g., "Build Backend")
3. Expand steps to see detailed logs

---

## 🐛 Common Build Failures

### 1. Docker Build Timeout
**Symptom**: Build takes >6 minutes and times out
**Solution**: 
- Use build cache (already added)
- Optimize Dockerfile layers
- Use smaller base images (already using alpine)

### 2. TypeScript Compilation Errors
**Symptom**: `tsc` fails with type errors
**Solution**:
```bash
# Test locally first
cd backend
npm run build

cd frontend
npm run build
```

### 3. Missing Dependencies
**Symptom**: `npm ci` fails or module not found
**Solution**: Check package.json and package-lock.json are committed

### 4. GHCR Push Permission Denied
**Symptom**: `denied: permission_denied`
**Solution**: Check workflow has correct permissions:
```yaml
permissions:
  contents: read
  packages: write
```

---

## 🧪 Test Builds Locally

### Test Backend Docker Build
```bash
cd backend
docker build -t test-backend .
docker run -p 3666:3666 test-backend
```

### Test Frontend Docker Build
```bash
cd frontend
docker build --build-arg VITE_API_URL=http://localhost:3666 -t test-frontend .
docker run -p 3555:80 test-frontend
```

---

## 📦 Check Built Images

### After Successful Build

1. **View Packages**:
   ```
   https://github.com/ganeshchavan786?tab=packages
   ```

2. **Pull Images**:
   ```bash
   # Make packages public first!
   docker pull ghcr.io/ganeshchavan786/zrok-ui/backend:latest
   docker pull ghcr.io/ganeshchavan786/zrok-ui/frontend:latest
   ```

3. **Test Images**:
   ```bash
   docker run -p 3666:3666 ghcr.io/ganeshchavan786/zrok-ui/backend:latest
   docker run -p 3555:80 ghcr.io/ganeshchavan786/zrok-ui/frontend:latest
   ```

---

## 🔄 Workflow Triggers

### Automatic Triggers
- Push to `main` branch
- Push to `master` branch

### Manual Trigger
1. Go to: https://github.com/ganeshchavan786/zrok-ui/actions
2. Click "Build and Push to GHCR"
3. Click "Run workflow" button
4. Select branch and click "Run workflow"

---

## 📝 Workflow File Location

```
.github/workflows/deploy.yml
```

### Current Configuration

```yaml
jobs:
  build-backend:
    - Checkout code
    - Setup Docker Buildx
    - Login to GHCR
    - Build and push backend image
    
  build-frontend:
    - Checkout code
    - Setup Docker Buildx
    - Login to GHCR
    - Build and push frontend image
```

**Benefits**:
- ✅ Parallel builds (faster)
- ✅ Independent failure (one can succeed while other fails)
- ✅ Better logs (easier to debug)
- ✅ Build caching (faster subsequent builds)

---

## 🚨 Dependabot Alerts

**Current**: 14 vulnerabilities detected

### Fix Vulnerabilities

```bash
# Backend
cd backend
npm audit
npm audit fix
npm audit fix --force  # if needed

# Frontend
cd frontend
npm audit
npm audit fix
npm audit fix --force  # if needed

# Commit updates
git add package*.json
git commit -m "Fix security vulnerabilities"
git push
```

### View Alerts
```
https://github.com/ganeshchavan786/zrok-ui/security/dependabot
```

---

## 📊 Expected Build Times

| Job           | Expected Time | Status |
|---------------|---------------|--------|
| Build Backend | 2-4 minutes   | ⏱️     |
| Build Frontend| 2-4 minutes   | ⏱️     |
| Total (parallel)| 2-4 minutes | ⏱️     |

**First build**: Slower (no cache)
**Subsequent builds**: Faster (with cache)

---

## ✅ Success Indicators

### Workflow Succeeded When:
1. ✅ Both jobs show green checkmark
2. ✅ Images appear in Packages tab
3. ✅ Can pull images with `docker pull`

### Test After Success:
```bash
# Pull images
docker pull ghcr.io/ganeshchavan786/zrok-ui/backend:latest
docker pull ghcr.io/ganeshchavan786/zrok-ui/frontend:latest

# Run with docker-compose
docker compose -f docker-compose.prod.yml pull
docker compose -f docker-compose.prod.yml up -d
```

---

## 🔧 Troubleshooting Commands

### View Workflow Status (CLI)
```bash
# Install GitHub CLI
gh auth login

# View workflow runs
gh run list

# View specific run
gh run view <run-id>

# View logs
gh run view <run-id> --log
```

### Re-run Failed Workflow
```bash
gh run rerun <run-id>
```

---

## 📚 Resources

- **GitHub Actions Docs**: https://docs.github.com/en/actions
- **Docker Build Push Action**: https://github.com/docker/build-push-action
- **GHCR Docs**: https://docs.github.com/en/packages/working-with-a-github-packages-registry/working-with-the-container-registry

---

## 🎯 Next Steps

1. ✅ Wait for current build to complete
2. ⬜ Check build status (should be green now)
3. ⬜ Make packages public
4. ⬜ Test pulling images
5. ⬜ Deploy to VPS

---

**Last Updated**: After fixing frontend build script and splitting workflow jobs
