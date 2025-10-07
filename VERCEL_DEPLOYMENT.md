# Vercel Deployment Guide for RunDay

## Auto-Deployment Setup

### User App Configuration:
```
Project Name: runday-user-app
Root Directory: apps/user
Build Command: cd ../.. && npm install && npm run build --workspace=apps/user
Output Directory: .next
Install Command: cd ../.. && npm install
Node.js Version: 18.x
```

### Admin App Configuration:
```
Project Name: runday-admin-app
Root Directory: apps/admin  
Build Command: cd ../.. && npm install && npm run build --workspace=apps/admin
Output Directory: .next
Install Command: cd ../.. && npm install
Node.js Version: 18.x
```

## Environment Variables (for both apps):

### Required:
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
- `NODE_ENV`: production

### App-specific URLs (update after deployment):
- `NEXT_PUBLIC_USER_URL`: https://runday-user-app.vercel.app
- `NEXT_PUBLIC_ADMIN_URL`: https://runday-admin-app.vercel.app  
- `NEXT_PUBLIC_APP_URL`: (same as above for each app)

## Auto-Deployment Features:
✅ Automatic deployments on main branch push
✅ Preview deployments for pull requests
✅ Automatic environment promotion
✅ Git integration with deployment status