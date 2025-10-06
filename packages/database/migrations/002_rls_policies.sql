-- =====================================================
-- RunDay Platform - Row Level Security Policies
-- Phase 1.2: Security Policies Setup
-- =====================================================

-- =====================================================
-- 1. Profiles Table Policies
-- =====================================================

-- Policy: Users can view all profiles (for public listings)
CREATE POLICY "Profiles are viewable by everyone"
    ON public.profiles FOR SELECT
    USING (true);

-- Policy: Users can insert their own profile
CREATE POLICY "Users can insert their own profile"
    ON public.profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "Users can update their own profile"
    ON public.profiles FOR UPDATE
    USING (auth.uid() = id);

-- =====================================================
-- 2. Events Table Policies
-- =====================================================

-- Policy: Anyone can view events (for public event discovery)
CREATE POLICY "Events are viewable by everyone"
    ON public.events FOR SELECT
    USING (true);

-- Policy: Only authenticated users can create events
-- (Admin role check will be handled in application logic)
CREATE POLICY "Authenticated users can create events"
    ON public.events FOR INSERT
    WITH CHECK (auth.role() = 'authenticated');

-- Policy: Event creators can update their own events
CREATE POLICY "Event creators can update their own events"
    ON public.events FOR UPDATE
    USING (auth.uid() = created_by);

-- Policy: Event creators can delete their own events
CREATE POLICY "Event creators can delete their own events"
    ON public.events FOR DELETE
    USING (auth.uid() = created_by);

-- =====================================================
-- 3. Registrations Table Policies
-- =====================================================

-- Policy: Users can view registrations for events they created (admins)
CREATE POLICY "Event creators can view all registrations for their events"
    ON public.registrations FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = registrations.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- Policy: Users can view their own registrations
CREATE POLICY "Users can view their own registrations"
    ON public.registrations FOR SELECT
    USING (auth.uid() = user_id);

-- Policy: Users can insert their own registrations
CREATE POLICY "Users can register for events"
    ON public.registrations FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own registrations (for cancellation)
CREATE POLICY "Users can update their own registrations"
    ON public.registrations FOR UPDATE
    USING (auth.uid() = user_id);

-- Policy: Users can delete their own registrations (unregister)
CREATE POLICY "Users can delete their own registrations"
    ON public.registrations FOR DELETE
    USING (auth.uid() = user_id);

-- Policy: Event creators can update registrations (for adding results)
CREATE POLICY "Event creators can update registrations for their events"
    ON public.registrations FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.events 
            WHERE events.id = registrations.event_id 
            AND events.created_by = auth.uid()
        )
    );

-- =====================================================
-- 4. Helper Functions for Role Checking
-- =====================================================

-- Function to check if current user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.profiles 
        WHERE id = auth.uid() 
        AND role = 'admin'
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user owns an event
CREATE OR REPLACE FUNCTION public.owns_event(event_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 FROM public.events 
        WHERE id = event_id 
        AND created_by = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;