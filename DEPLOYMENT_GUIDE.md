# 🚀 Deployment Guide - Oluku LLC Website

## Overview

This guide covers the complete deployment process for the Oluku LLC website from development to production.

---

## Prerequisites

Before deploying, ensure you have:

- [ ] Git installed and configured
- [ ] Node.js v18+ installed
- [ ] npm installed
- [ ] GitHub account with write access to the repository
- [ ] Hosting provider account (GitHub Pages, Netlify, Vercel, etc.)
- [ ] DNS domain configured
- [ ] SSL certificate ready

---

## Deployment Stages

### Stage 1: Development
```bash
# Clone repository
git clone https://github.com/okulus79/oluku-llc-website.git
cd oluku-llc-website

# Install dependencies
npm install

# Start development server
npm start
```

### Stage 2: Testing
```bash
# Run all tests
npm test

# Run security audit
npm audit

# Run health check
bash scripts/health-check.sh
```

### Stage 3: Staging
```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes and commit
git add .
git commit -m "Add feature: description"

# Push to GitHub
git push origin feature/your-feature

# Create Pull Request on GitHub
```

### Stage 4: Production Deployment

#### Option A: Automatic Deployment (Recommended)
```bash
# Simply push to main branch
git checkout main
git pull origin main
git merge feature/your-feature
git push origin main

# GitHub Actions will automatically:
# 1. Run tests
# 2. Run security checks
# 3. Build the application
# 4. Run health checks
# 5. Deploy to GitHub Pages
# 6. Run Lighthouse audit
```

#### Option B: Manual Deployment
```bash
# Run deployment script
bash scripts/deploy.sh production main

# Deploy to hosting provider
# (Commands depend on your hosting)
```

---

## Configuration Files

### Environment Variables (.env.local)

```bash
# Copy example configuration
cp .env.example .env.local

# Edit with your production values
nano .env.local
```

**Required Variables:**
- `ENVIRONMENT=production`
- `API_URL=https://api.oluku.com`
- `GOOGLE_ANALYTICS_ID=your-id`
- `SENTRY_DSN=your-sentry-dsn`
- `TMS_API_KEY=your-api-key`

### App Configuration (app.json)

Already configured for Expo with:
- iOS Bundle ID: `com.oluku.llc`
- Android Package: `com.oluku.llc`
- Slug: `oluku-llc`

---

## Pre-Deployment Checklist

### Before Every Deployment

```bash
# 1. Ensure working directory is clean
git status

# 2. Pull latest changes
git pull origin main

# 3. Run health checks
bash scripts/health-check.sh

# 4. Run tests
npm test

# 5. Run security audit
npm audit

# 6. Build and verify
npm run build
```

### Deployment Checklist

- [ ] All tests passing
- [ ] Security audit passed
- [ ] Health checks passed
- [ ] Build successful
- [ ] Environment variables configured
- [ ] DNS records updated (if needed)
- [ ] SSL certificate valid
- [ ] Backup of current version created
- [ ] Team notified of deployment
- [ ] Monitoring systems active

---

## Hosting Providers

### GitHub Pages (Default)
```bash
# Already configured in .github/workflows/deploy.yml
# Site will be live at: https://oluku-llc.com
# After DNS configuration
```

### Netlify
```bash
# Install Netlify CLI
npm install -g netlify-cli

# Deploy
netlify deploy --prod
```

### Vercel
```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel --prod
```

---

## Monitoring Post-Deployment

### Health Checks
```bash
# Monitor in real-time
watch bash scripts/health-check.sh
```

### Error Monitoring
- **Sentry Dashboard:** Track errors in real-time
- **Google Analytics:** Monitor user behavior
- **GitHub Actions:** Check deployment logs

### Performance Monitoring
- **Lighthouse:** Automated performance audits
- **Core Web Vitals:** Monitor page speed metrics
- **Service Worker:** Verify offline functionality

---

## Rollback Procedures

### Quick Rollback
```bash
# If deployment fails or critical issues arise

# 1. Revert last commit
git revert HEAD

# 2. Push to trigger re-deployment
git push origin main

# 3. GitHub Actions will redeploy previous version
```

### Manual Rollback
```bash
# 1. List commit history
git log --oneline -10

# 2. Checkout previous version
git checkout <previous-commit-sha>

# 3. Create rollback branch
git checkout -b rollback/timestamp

# 4. Push and merge
git push origin rollback/timestamp
# Then create PR and merge to main
```

### Database/Data Rollback
```bash
# Restore from backup
# Instructions depend on your data storage solution
```

---

## Troubleshooting

### Deployment Fails
```bash
# 1. Check GitHub Actions logs
# Go to: https://github.com/okulus79/oluku-llc-website/actions

# 2. Check local build
npm run build

# 3. Run health checks
bash scripts/health-check.sh

# 4. Check for environment variable issues
nano .env.local
```

### Site Not Loading After Deployment
```bash
# 1. Check DNS configuration
nslookup oluku-llc.com

# 2. Check SSL certificate
# Visit: https://www.sslshopper.com/ssl-checker.html

# 3. Check GitHub Pages settings
# Go to: https://github.com/okulus79/oluku-llc-website/settings/pages

# 4. Clear cache and try again
# Hard refresh: Ctrl+Shift+R (or Cmd+Shift+R on Mac)
```

### Service Worker Issues
```bash
# Clear service worker cache
# In browser DevTools Console:
// navigator.serviceWorker.getRegistrations().then(regs => {
//   regs.forEach(reg => reg.unregister());
// })

# Then hard refresh page
```

---

## Emergency Contacts

- **Technical Lead:** okulus79
- **Deployment Status:** Check GitHub Actions
- **Status Page:** https://status.oluku.com
- **Support:** support@oluku.com

---

## Additional Resources

- [GitHub Pages Documentation](https://pages.github.com)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [Expo Documentation](https://docs.expo.dev)
- [Web Performance Best Practices](https://web.dev)
- [Security Headers Guide](https://securityheaders.com)

---

**Last Updated:** 2026-08-21  
**Deployment Status:** 🔴 Not Deployed  
**Next Review:** Before each deployment
