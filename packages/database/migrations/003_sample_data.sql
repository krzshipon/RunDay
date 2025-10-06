-- =====================================================
-- RunDay Platform - Sample Data
-- Phase 1.2: Test Data for Development
-- =====================================================

-- Note: This file contains sample data for testing
-- Run this AFTER setting up authentication and creating some test users

-- =====================================================
-- 1. Sample Events (Run after you have test users)
-- =====================================================

-- Sample event 1 - Morning Run
INSERT INTO public.events (
    name, 
    description, 
    event_date, 
    distance, 
    location, 
    max_participants, 
    status,
    created_by
) VALUES (
    'Morning Marathon Training',
    'A training run to prepare for the upcoming marathon season. Perfect for intermediate runners looking to improve their endurance.',
    '2025-11-15',
    '10K',
    'Central Park, NYC',
    50,
    'upcoming',
    -- Replace with actual admin user ID after creating test users
    '00000000-0000-0000-0000-000000000000'
);

-- Sample event 2 - Fun Run
INSERT INTO public.events (
    name, 
    description, 
    event_date, 
    distance, 
    location, 
    max_participants, 
    status,
    created_by
) VALUES (
    'Community Fun Run',
    'A casual 5K run for the whole family. Beginners welcome! Post-run refreshments provided.',
    '2025-11-22',
    '5K',
    'Riverside Park',
    100,
    'upcoming',
    -- Replace with actual admin user ID after creating test users
    '00000000-0000-0000-0000-000000000000'
);

-- Sample event 3 - Completed Event
INSERT INTO public.events (
    name, 
    description, 
    event_date, 
    distance, 
    location, 
    max_participants, 
    status,
    created_by
) VALUES (
    'Autumn Challenge Run',
    'Our first completed event of the season. Great turnout with fantastic weather!',
    '2025-10-01',
    '15K',
    'Brooklyn Bridge Park',
    75,
    'completed',
    -- Replace with actual admin user ID after creating test users
    '00000000-0000-0000-0000-000000000000'
);

-- =====================================================
-- 2. Instructions for Manual Setup
-- =====================================================

-- After running the schema and RLS policies:
-- 
-- 1. Create test users through Supabase Auth UI or your app
-- 2. Update the created_by fields above with actual user IDs
-- 3. Create an admin user by updating their profile:
--    UPDATE public.profiles SET role = 'admin' WHERE id = 'your-admin-user-id';
-- 4. Then run this sample data script
-- 
-- 5. Test registrations can be added like:
--    INSERT INTO public.registrations (event_id, user_id) 
--    VALUES ('event-id', 'user-id');
--
-- 6. Test results can be added like:
--    UPDATE public.registrations 
--    SET bib_number = 123, finish_time = '00:45:30', position = 1
--    WHERE event_id = 'event-id' AND user_id = 'user-id';