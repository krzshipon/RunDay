# Custom Domain Setup Guide

## 🌐 Domain Configuration for RunDay Platform

This guide covers setting up custom domains for your RunDay platform deployment.

## 🎯 Overview

**Current Setup:**
- User App: `https://run-day-user.vercel.app`
- Admin App: `https://run-day-admin.vercel.app`

**Custom Domain Goals:**
- User App: `https://app.runday.com` (or your chosen domain)
- Admin App: `https://admin.runday.com` (or your chosen domain)

## 📋 Prerequisites

### Domain Requirements
- Own a domain name (e.g., `runday.com`)
- Access to domain DNS settings
- Vercel account with domain permissions

### SSL Certificate
- Vercel automatically provides SSL certificates
- No manual certificate setup required
- Automatic renewal handled by Vercel

## 🚀 Vercel Domain Setup

### Step 1: Add Domain to Vercel

**For User App:**
1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your `run-day-user` project
3. Go to **Settings** → **Domains**
4. Click **Add Domain**
5. Enter your domain: `app.runday.com`
6. Click **Add**

**For Admin App:**
1. Select your `run-day-admin` project  
2. Go to **Settings** → **Domains**
3. Click **Add Domain**
4. Enter your domain: `admin.runday.com`
5. Click **Add**

### Step 2: Configure DNS Records

**DNS Configuration Required:**

```dns
# For app.runday.com (User App)
Type: CNAME
Name: app
Value: cname.vercel-dns.com

# For admin.runday.com (Admin App)  
Type: CNAME
Name: admin
Value: cname.vercel-dns.com

# Alternative: A Record (if CNAME not supported)
Type: A
Name: app
Value: 76.76.19.123 (Vercel IP)

Type: A  
Name: admin
Value: 76.76.19.123 (Vercel IP)
```

### Step 3: Verify Domain

1. **Wait for DNS Propagation** (5-60 minutes)
2. **Check Vercel Dashboard** - should show "Valid Configuration"
3. **Test Domain Access** - visit your custom domains
4. **Verify SSL Certificate** - ensure HTTPS works

## 🔧 Environment Configuration

### Update Environment Variables

**If using absolute URLs in your app:**

```bash
# User App (.env.local)
NEXT_PUBLIC_APP_URL=https://app.runday.com
NEXT_PUBLIC_API_URL=https://your-supabase-project.supabase.co

# Admin App (.env.local)  
NEXT_PUBLIC_APP_URL=https://admin.runday.com
NEXT_PUBLIC_API_URL=https://your-supabase-project.supabase.co
```

### Update Supabase Auth Configuration

**Allowed Origins:**
1. Go to **Supabase Dashboard** → **Authentication** → **URL Configuration**
2. Add to **Site URL**: `https://app.runday.com`
3. Add to **Redirect URLs**:
   ```
   https://app.runday.com/auth/callback
   https://admin.runday.com/auth/callback
   ```

## 🌍 Popular Domain Providers

### Namecheap Configuration
```dns
Type: CNAME Record
Host: app
Value: cname.vercel-dns.com
TTL: Automatic

Type: CNAME Record  
Host: admin
Value: cname.vercel-dns.com
TTL: Automatic
```

### GoDaddy Configuration
```dns
Type: CNAME
Name: app
Value: cname.vercel-dns.com
TTL: 600 seconds

Type: CNAME
Name: admin  
Value: cname.vercel-dns.com
TTL: 600 seconds
```

### Cloudflare Configuration
```dns
Type: CNAME
Name: app
Target: cname.vercel-dns.com
Proxy Status: DNS Only (Gray Cloud)

Type: CNAME
Name: admin
Target: cname.vercel-dns.com  
Proxy Status: DNS Only (Gray Cloud)
```

## 🔒 Security Considerations

### SSL/TLS Configuration
- **Automatic SSL**: Vercel handles SSL certificates
- **HSTS Header**: Enable in Vercel settings
- **Security Headers**: Configure in `next.config.js`

**Enhanced Security Headers:**
```javascript
// next.config.js
module.exports = {
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY'
          },
          {
            key: 'X-Content-Type-Options', 
            value: 'nosniff'
          },
          {
            key: 'Referrer-Policy',
            value: 'origin-when-cross-origin'
          }
        ]
      }
    ];
  }
};
```

### Domain Verification
- **Verify Ownership**: Ensure you control the domain
- **Monitor Certificate**: Check SSL certificate validity
- **Security Scanning**: Regular security scans

## 📊 Monitoring Custom Domains

### Performance Monitoring
- **DNS Resolution Time**: Monitor DNS lookup speed
- **SSL Handshake**: Monitor certificate performance  
- **Geographic Performance**: Test from different locations

### Analytics Updates
**Update Analytics Configuration:**
```javascript
// Update analytics.ts if needed
const config = {
  domain: 'app.runday.com', // Update domain
  apiEndpoint: 'https://your-analytics-endpoint',
  // ... other config
};
```

## 🔄 Migration Process

### Gradual Migration
1. **Test Custom Domains**: Verify functionality
2. **Update Documentation**: Update all domain references
3. **Communicate Changes**: Notify users of new URLs
4. **Monitor Traffic**: Watch for issues during transition
5. **Update Bookmarks**: Provide migration guide for users

### Rollback Plan
1. **Keep Original Domains Active**: Don't delete immediately
2. **Monitor Error Rates**: Watch for increased errors
3. **Quick Rollback**: Be ready to revert DNS changes
4. **Communication Plan**: Prepare user notifications

## 🚨 Troubleshooting

### Common Issues

**Domain Not Resolving:**
- Check DNS propagation: `dig app.runday.com`
- Verify CNAME record: `nslookup app.runday.com`
- Wait for DNS cache expiry (up to 24 hours)

**SSL Certificate Issues:**
- Verify domain ownership in Vercel
- Check DNS configuration accuracy
- Wait for certificate provisioning (up to 24 hours)

**Supabase Auth Issues:**
- Update allowed origins in Supabase
- Check redirect URLs configuration
- Verify CORS settings

### Diagnostic Commands

```bash
# Check DNS resolution
dig app.runday.com
nslookup admin.runday.com

# Check SSL certificate
openssl s_client -connect app.runday.com:443 -servername app.runday.com

# Test HTTP response
curl -I https://app.runday.com
curl -I https://admin.runday.com
```

## 📈 Best Practices

### Domain Management
- **Use Subdomains**: Easier to manage than separate domains
- **Consistent Naming**: Use logical, memorable subdomain names
- **Document Changes**: Keep records of all DNS changes
- **Monitor Expiry**: Set reminders for domain renewal

### Performance Optimization
- **CDN Configuration**: Leverage Vercel's global CDN
- **Caching Strategy**: Configure appropriate cache headers
- **Image Optimization**: Use Vercel's image optimization
- **Bundle Analysis**: Monitor bundle sizes

### Security Best Practices
- **Regular Updates**: Keep dependencies updated
- **Security Headers**: Implement comprehensive security headers
- **Access Logging**: Monitor access patterns
- **Incident Response**: Have plan for security incidents

---

## ✅ Verification Checklist

### Pre-Launch Verification
- [ ] DNS records configured correctly
- [ ] SSL certificates active and valid
- [ ] Supabase auth URLs updated
- [ ] Environment variables updated
- [ ] Analytics tracking updated
- [ ] All links and redirects working
- [ ] Performance testing completed
- [ ] Security headers configured

### Post-Launch Monitoring
- [ ] Monitor error rates
- [ ] Check user feedback
- [ ] Verify analytics data
- [ ] Monitor performance metrics
- [ ] Check SSL certificate status
- [ ] Validate DNS resolution globally

---

## 🎯 Quick Reference

### Essential DNS Records
```dns
# Standard Configuration
app.runday.com    → CNAME → cname.vercel-dns.com
admin.runday.com  → CNAME → cname.vercel-dns.com

# Root domain (if needed)
runday.com        → A     → 76.76.19.123
www.runday.com    → CNAME → cname.vercel-dns.com
```

### Vercel CLI Commands
```bash
# Deploy with custom domain
vercel --prod --alias app.runday.com

# Check domain status  
vercel domains ls

# Add domain via CLI
vercel domains add app.runday.com --scope=your-team
```

---

*Ready to launch your custom domains! 🚀🌐*