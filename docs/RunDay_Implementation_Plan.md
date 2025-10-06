# RunDay Implementation Plan

## 📋 Project Overview

**Objective**: Build two web applications for managing running events
- **RunDay Admin App**: For event organizers to create and manage events
- **RunDay User App**: For runners to discover, register, and track their events

**Tech Stack**: 
- **Frontend**: Next.js 15 (App Router) + TypeScript + Tailwind CSS
- **Backend**: Supabase (Authentication, Database, Storage)
- **Styling**: Tailwind CSS + Custom Design System (@runday/ui)
- **Monorepo**: Turbo + Shared Packages
- **State Management**: React Context API / Zustand
- **Email**: Supabase Auth (built-in email handling)
- **File Handling**: Supabase Storage (for certificates)

## 🎯 Current Progress Status

**✅ Phase 1 COMPLETED** - Foundation & Setup
- ✅ Monorepo structure with Next.js 15
- ✅ Supabase backend with database schema
- ✅ Elegant UI design system with shared components
- ✅ Professional color scheme implementation

**🚀 Next Up**: Phase 2 - Authentication System

---

## 🏗️ Project Structure

```
runday-platform/
├── apps/
│   ├── admin/          # Admin application
│   └── user/           # User application
├── packages/
│   ├── ui/             # Shared UI components
│   ├── database/       # Supabase schema & types
│   └── auth/           # Shared authentication logic
└── docs/               # Documentation
```

---

## 📊 Database Schema Design

### Core Tables

```sql
-- Users table (handled by Supabase Auth)
auth.users (
  id uuid primary key,
  email text unique,
  created_at timestamp
)

-- User profiles
public.profiles (
  id uuid references auth.users primary key,
  full_name text not null,
  role text default 'user' check (role in ('admin', 'user')),
  created_at timestamp default now(),
  updated_at timestamp default now()
)

-- Events
public.events (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  description text,
  event_date date not null,
  distance text not null,
  location text,
  max_participants integer,
  status text default 'upcoming' check (status in ('upcoming', 'completed', 'cancelled')),
  created_by uuid references auth.users not null,
  created_at timestamp default now(),
  updated_at timestamp default now()
)

-- Event registrations
public.registrations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events not null,
  user_id uuid references auth.users not null,
  bib_number integer,
  finish_time interval,
  position integer,
  registered_at timestamp default now(),
  unique(event_id, user_id)
)
```

---

## 🚀 Implementation Phases

## Phase 1: Foundation & Setup (Week 1) ✅ COMPLETED

### 1.1 Project Initialization ✅ COMPLETED
- [x] Set up monorepo with Next.js 15 (App Router)
- [x] Configure TypeScript and ESLint  
- [x] Install and configure Tailwind CSS + shadcn/ui foundation
- [x] Set up environment variables structure
- [x] Create shared packages (ui, database, auth)

**Deliverable**: ✅ Basic project structure with build system

### 1.2 Supabase Setup ✅ COMPLETED
- [x] Create Supabase project
- [x] Set up database schema (users, events, registrations)
- [x] Configure Row Level Security (RLS) policies
- [x] Set up authentication providers (email)
- [x] Configure email templates for OTP
- [x] Test database connection and authentication
- [x] Create first admin user

**Deliverable**: ✅ Complete backend infrastructure

### 1.3 Shared Components Package ✅ COMPLETED
- [x] Create UI component library with elegant design system
- [x] Implement common components (Button, Input, Card, Badge, etc.)
- [x] Set up shared utilities and TypeScript configuration
- [x] Create @runday/ui package for monorepo sharing
- [x] Implement professional color scheme (Navy #2B2D42, Orange #FF9F1C)
- [x] Configure proper exports and peer dependencies

**Deliverable**: ✅ Complete reusable component library with elegant styling

---

## Phase 2: Authentication System (Week 2)

### 2.1 Email-Based Authentication ✅ COMPLETED
- [x] Implement user registration with email/password
- [x] Build email verification flow with Supabase email verification
- [x] Create login/logout functionality
- [x] Implement protected route middleware

**Components Built:**
- ✅ `SignUpForm` - User registration with email verification
- ✅ `SignInForm` - User sign-in with proper validation  
- ✅ `AuthProvider` - React context for auth state management
- ✅ `ProtectedRoute` - Route protection with verification checks

### 2.2 Role Management
- [ ] Create role-based access control
- [ ] Implement admin role checking
- [ ] Set up user profile creation on registration
- [ ] Add role assignment utilities (for manual admin creation)

**Deliverable**: Complete authentication system with role management

---

## Phase 3: Admin App - Core Features (Week 3-4)

### 3.1 Admin Dashboard
- [ ] Create admin-only layout with navigation
- [ ] Build dashboard with event overview
- [ ] Implement event search functionality
- [ ] Add responsive design for mobile/desktop

**Components:**
- `AdminLayout`
- `AdminDashboard`
- `EventSearchBar`
- `EventCard`

### 3.2 Event Creation & Management
- [ ] Build event creation form with validation
- [ ] Implement event editing functionality
- [ ] Add event duplication feature
- [ ] Create event status management (upcoming → completed)

**Components:**
- `EventForm`
- `EventEditDialog`
- `EventDuplicateButton`
- `EventStatusToggle`

### 3.3 Participant Management
- [ ] Create participant list view with search
- [ ] Build bib number assignment interface
- [ ] Implement finish time input system
- [ ] Add bulk save functionality for results

**Components:**
- `ParticipantList`
- `ParticipantSearchBar`
- `ResultsInputForm`
- `BulkSaveButton`

**Deliverable**: Fully functional admin application

---

## Phase 4: User App - Core Features (Week 5-6)

### 4.1 User Dashboard & Event Discovery
- [ ] Create user dashboard layout
- [ ] Build upcoming events listing
- [ ] Implement event details view
- [ ] Add responsive event cards

**Components:**
- `UserLayout`
- `UserDashboard`
- `EventList`
- `EventDetailsCard`

### 4.2 Event Registration System
- [ ] Implement single-click registration
- [ ] Add registration cancellation
- [ ] Prevent duplicate registrations
- [ ] Show registration status indicators

**Components:**
- `RegisterButton`
- `CancelRegistrationButton`
- `RegistrationStatus`

### 4.3 My Events & Results
- [ ] Create "My Events" section
- [ ] Display upcoming and completed events separately
- [ ] Show personal results for completed events
- [ ] Add event filtering and sorting

**Components:**
- `MyEventsList`
- `EventTabs`
- `ResultsCard`
- `EventFilter`

**Deliverable**: Complete user application

---

## Phase 5: Certificate System (Week 7)

### 5.1 Certificate Generation
- [ ] Design certificate template (PDF)
- [ ] Implement certificate generation logic
- [ ] Create download functionality
- [ ] Add certificate preview

**Components:**
- `CertificateGenerator`
- `CertificatePreview`
- `DownloadButton`

### 5.2 Certificate Management
- [ ] Store generated certificates in Supabase Storage
- [ ] Implement certificate caching
- [ ] Add certificate regeneration option
- [ ] Create certificate history

**Deliverable**: Complete certificate download system

---

## Phase 6: Polish & Testing (Week 8)

### 6.1 UI/UX Improvements
- [ ] Implement loading states and error handling
- [ ] Add toast notifications for user actions
- [ ] Improve responsive design across devices
- [ ] Add dark mode support (optional)

### 6.2 Testing & Optimization
- [ ] Write unit tests for critical components
- [ ] Perform end-to-end testing
- [ ] Optimize performance (images, code splitting)
- [ ] Test email functionality

### 6.3 Deployment Preparation
- [ ] Set up deployment pipeline
- [ ] Configure production environment
- [ ] Add monitoring and analytics
- [ ] Create user documentation

**Deliverable**: Production-ready applications

---

## 🔧 Key Implementation Details

### Authentication Flow
1. User registers with email/password
2. Supabase sends OTP to email
3. User verifies OTP to activate account
4. Profile created with default 'user' role
5. Admins manually assigned via Supabase dashboard

### Event Management Flow
1. Admin creates event with details
2. Event appears in user app for registration
3. Users register/cancel registrations
4. Admin inputs results when event completes
5. Event status changes to 'completed'
6. Users can download certificates

### Security Considerations
- Row Level Security (RLS) policies for all tables
- Admin role verification on sensitive operations
- Input validation and sanitization
- Rate limiting on registration endpoints

---

## 📦 Recommended Packages

```json
{
  "dependencies": {
    "next": "^14.0.0",
    "@supabase/supabase-js": "^2.38.0",
    "@supabase/auth-ui-react": "^0.4.0",
    "tailwindcss": "^3.3.0",
    "@radix-ui/react-*": "latest",
    "lucide-react": "^0.292.0",
    "react-hook-form": "^7.47.0",
    "zod": "^3.22.0",
    "date-fns": "^2.30.0",
    "jspdf": "^2.5.1",
    "html2canvas": "^1.4.1"
  },
  "devDependencies": {
    "@types/node": "^20.8.0",
    "@types/react": "^18.2.0",
    "typescript": "^5.2.0",
    "eslint": "^8.51.0"
  }
}
```

---

## 🎯 Success Metrics

### Phase Completion Criteria
- [ ] All authentication flows work end-to-end
- [ ] Admins can create, edit, and manage events
- [ ] Users can register and view their events
- [ ] Results can be input and certificates generated
- [ ] Both apps are responsive and user-friendly

### Quality Gates
- All forms have proper validation
- Error states are handled gracefully
- Loading states provide good UX
- Email functionality works reliably
- Database operations are secure

---

This implementation plan provides a clear roadmap to build both RunDay applications incrementally. Each phase builds upon the previous one, allowing for testing and iteration throughout the development process.