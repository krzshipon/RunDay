# Environment Variables for Vercel Deployment

## For User App (runday-user-app):
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=https://runday-user-app.vercel.app
NEXT_PUBLIC_USER_URL=https://runday-user-app.vercel.app
NEXT_PUBLIC_ADMIN_URL=https://runday-admin-app.vercel.app
NODE_ENV=production

## For Admin App (runday-admin-app):
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
NEXT_PUBLIC_APP_URL=https://runday-admin-app.vercel.app
NEXT_PUBLIC_USER_URL=https://runday-user-app.vercel.app
NEXT_PUBLIC_ADMIN_URL=https://runday-admin-app.vercel.app
NODE_ENV=production

## Instructions:
1. Go to Vercel Dashboard → Project Settings → Environment Variables
2. Add each environment variable above for respective apps
3. Set environment to "Production", "Preview", and "Development"
4. Replace "your-project-ref" and "your-anon-key-here" with actual Supabase values
5. Update URLs once you get the actual Vercel deployment URLs