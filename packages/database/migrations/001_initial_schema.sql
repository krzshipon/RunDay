-- =====================================================
-- RunDay Platform Database Schema
-- Phase 1.2: Initial Schema Setup
-- =====================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- 1. User Profiles Table
-- =====================================================
-- Note: auth.users table is managed by Supabase Auth
-- We create a profiles table to store additional user data

CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('admin', 'user')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS (Row Level Security)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 2. Events Table
-- =====================================================
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    description TEXT,
    event_date DATE NOT NULL,
    distance TEXT NOT NULL,
    location TEXT,
    max_participants INTEGER,
    status TEXT NOT NULL DEFAULT 'upcoming' CHECK (status IN ('upcoming', 'completed', 'cancelled')),
    created_by UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add RLS
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 3. Event Registrations Table
-- =====================================================
CREATE TABLE public.registrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE NOT NULL,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    bib_number INTEGER,
    finish_time INTERVAL,
    position INTEGER,
    registered_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Ensure a user can only register once per event
    UNIQUE(event_id, user_id)
);

-- Add RLS
ALTER TABLE public.registrations ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 4. Create Indexes for Performance
-- =====================================================
CREATE INDEX idx_events_created_by ON public.events(created_by);
CREATE INDEX idx_events_status ON public.events(status);
CREATE INDEX idx_events_event_date ON public.events(event_date);
CREATE INDEX idx_registrations_event_id ON public.registrations(event_id);
CREATE INDEX idx_registrations_user_id ON public.registrations(user_id);

-- =====================================================
-- 5. Updated At Trigger Function
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER profiles_updated_at
    BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER events_updated_at
    BEFORE UPDATE ON public.events
    FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

-- =====================================================
-- 6. Profile Creation Trigger
-- =====================================================
-- Automatically create a profile when a user signs up
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
    INSERT INTO public.profiles (id, full_name, role)
    VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
        'user'
    );
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
    AFTER INSERT ON auth.users
    FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();