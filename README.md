# RunDay Platform

A modern web application platform for managing running events with separate admin and user interfaces.

## 🏗️ Project Structure

```
runday-platform/
├── apps/
│   ├── admin/          # Admin application (Next.js 15 + TypeScript)
│   └── user/           # User application (Next.js 15 + TypeScript)
├── packages/
│   ├── ui/             # Shared UI components (Tailwind CSS + shadcn/ui)
│   ├── database/       # Database types and Supabase client
│   └── auth/           # Authentication utilities
├── docs/               # Documentation
└── README.md          # This file
```

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm 10+

### Installation

1. **Clone and install dependencies:**
```bash
cd RunDay
npm install
```

2. **Set up environment variables:**
```bash
cp .env.example .env.local
# Edit .env.local with your Supabase credentials
```

3. **Start development servers:**

**Admin App (Port 3000):**
```bash
npm run admin
```

**User App (Port 3001):**
```bash
npm run user
```

### Available Scripts

- `npm run build` - Build all packages and apps
- `npm run dev` - Start all apps in development mode
- `npm run lint` - Lint all packages and apps
- `npm run admin` - Start admin app only
- `npm run user` - Start user app only

## 📦 Tech Stack

- **Frontend:** Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend:** Supabase (Authentication, Database, Storage)
- **UI Components:** shadcn/ui + Radix UI
- **Monorepo:** Turbo + npm workspaces
- **Styling:** Tailwind CSS
- **Forms:** React Hook Form + Zod validation

## 🏛️ Architecture

### Apps
- **Admin App**: Event management dashboard for organizers
- **User App**: Event discovery and registration for participants

### Shared Packages
- **@runday/ui**: Reusable UI components
- **@runday/database**: Database types and Supabase client
- **@runday/auth**: Authentication hooks and utilities

## 📋 Next Steps

This project has completed **Phase 1.1: Project Initialization** of the implementation plan.

**✅ Completed:**
- [x] Monorepo setup with Turbo
- [x] Next.js 15 apps (Admin + User) with TypeScript
- [x] Tailwind CSS configuration
- [x] Shared package structure
- [x] Basic build system working

**🔄 Next Phase: 1.2 Supabase Setup**
- [ ] Create Supabase project
- [ ] Set up database schema
- [ ] Configure authentication
- [ ] Add Row Level Security policies

## 🛠️ Development

### Building Individual Apps
```bash
npm run build --workspace=apps/admin
npm run build --workspace=apps/user
```

### Running Specific Package Scripts
```bash
npm run build --workspace=packages/ui
npm run dev --workspace=packages/database
```

---

Ready to continue with Phase 1.2 - Supabase Setup! 🎯