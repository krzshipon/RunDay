# 📋 Phase 1.2: Supabase Setup Checklist

## Status: 🟡 In Progress

### ✅ Preparation Complete
- [x] Database schema SQL files created
- [x] RLS policies defined  
- [x] Email templates prepared
- [x] Setup documentation ready

### 🔄 Your Action Items

#### Step 1: Create Supabase Project
- [ ] Visit [supabase.com/dashboard](https://supabase.com/dashboard)
- [ ] Create new project named `runday-platform`
- [ ] Save database password securely
- [ ] Choose appropriate region

#### Step 2: Get Credentials  
- [ ] Copy Project URL from Settings → API
- [ ] Copy anon/public key from Settings → API
- [ ] Create `.env.local` file in project root:
```env
NEXT_PUBLIC_SUPABASE_URL=your_project_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

#### Step 3: Set Up Database Schema
- [ ] Go to SQL Editor in Supabase Dashboard
- [ ] Run `001_initial_schema.sql` (I'll provide the content)
- [ ] Run `002_rls_policies.sql` (I'll provide the content)
- [ ] Verify tables are created successfully

#### Step 4: Configure Authentication
- [ ] Go to Authentication → Settings
- [ ] Set Site URL to `http://localhost:3000`  
- [ ] Add Redirect URLs for both apps
- [ ] Configure email templates (optional for now)

#### Step 5: Test Connection
- [ ] Update environment variables in both apps
- [ ] Test database connection
- [ ] Create test user account
- [ ] Verify authentication flow

---

## 🎯 Ready for Next Step?

**Current Status**: Waiting for Supabase project creation

**What I need from you**:
1. Create the Supabase project
2. Get the Project URL and anon key
3. Let me know when ready, and I'll walk you through the database setup

**Time Required**: ~15 minutes for setup, ~10 minutes for testing

---

**💡 Tip**: Keep your Supabase dashboard open - we'll be using it for the database setup in the next step!