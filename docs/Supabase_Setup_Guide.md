# Supabase Setup Guide - Phase 1.2

## 📋 Step 1: Create Supabase Project

### 1.1 Go to Supabase Dashboard
1. Visit [https://supabase.com/dashboard](https://supabase.com/dashboard)
2. Sign in with your GitHub account (recommended) or create a new account
3. Click "New Project"

### 1.2 Create Project
- **Organization**: Select your organization (or create one)
- **Name**: `runday-platform`
- **Database Password**: Generate a strong password (save it securely!)
- **Region**: Choose closest to your location (e.g., `Southeast Asia (Singapore)`)
- **Pricing Plan**: Free tier is fine for development

### 1.3 Wait for Project Setup
- Project creation takes 2-3 minutes
- You'll see a progress indicator

## 📋 Step 2: Get Project Credentials

Once your project is ready:

### 2.1 Get API Keys
1. Go to **Settings** → **API**
2. Copy these values:
   - **Project URL**: `https://your-project-ref.supabase.co`
   - **anon/public key**: `eyJ0eXAiOiJKV1QiLCJhbGciOiJI...` (starts with eyJ)

### 2.2 Create Environment File
Create `.env.local` in the project root with:

```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 📋 Step 3: Ready for Database Setup
Once you have the credentials, I'll help you:
1. Set up the database schema
2. Configure Row Level Security
3. Set up authentication
4. Configure email templates

---

**🎯 Action Required**: Please create your Supabase project and get the credentials, then let me know when you're ready for the next step!