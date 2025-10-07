import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface PublicEventData {
    id: string;
    name: string;
    description?: string;
    event_date: string;
    distance: string;
    location?: string;
    max_participants?: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    created_at: string;
    registeredCount?: number;
    isUserRegistered?: boolean;
    userRegistrationId?: string;
}

export interface EventRegistrationData {
    id: string;
    event_id: string;
    user_id: string;
    bib_number?: number;
    finish_time?: string;
    position?: number;
    registered_at: string;
    event?: PublicEventData;
}

/**
 * Get all public events available for registration
 */
export async function getPublicEvents(userId?: string): Promise<{
    success: boolean;
    data?: PublicEventData[];
    error?: string;
}> {
    try {
        // First get all upcoming public events
        const { data: events, error: eventsError } = await supabase
            .from('events')
            .select('*')
            .eq('status', 'upcoming')
            .gte('event_date', new Date().toISOString().split('T')[0])
            .order('event_date', { ascending: true });

        if (eventsError) {
            console.error('Error fetching events:', eventsError);
            return { success: false, error: eventsError.message };
        }

        // Get registration counts for each event
        const eventIds = events?.map(e => e.id) || [];
        let registrationCounts: Record<string, number> = {};
        let userRegistrations: Record<string, string> = {};

        if (eventIds.length > 0) {
            const { data: registrations, error: regError } = await supabase
                .from('registrations')
                .select('event_id, id, user_id')
                .in('event_id', eventIds);

            if (!regError && registrations) {
                registrationCounts = registrations.reduce((acc: Record<string, number>, reg: any) => {
                    acc[reg.event_id] = (acc[reg.event_id] || 0) + 1;
                    return acc;
                }, {});

                // If user is provided, check their registrations
                if (userId) {
                    userRegistrations = registrations.reduce((acc: Record<string, string>, reg: any) => {
                        if (reg.user_id === userId) {
                            acc[reg.event_id] = reg.id;
                        }
                        return acc;
                    }, {});
                }
            }
        }

        const publicEvents: PublicEventData[] = events?.map((event: any) => ({
            id: event.id,
            name: event.name,
            description: event.description,
            event_date: event.event_date,
            distance: event.distance,
            location: event.location,
            max_participants: event.max_participants,
            status: event.status,
            created_at: event.created_at,
            registeredCount: registrationCounts[event.id] || 0,
            isUserRegistered: userId ? !!userRegistrations[event.id] : false,
            userRegistrationId: userId ? userRegistrations[event.id] : undefined,
        })) || [];

        return { success: true, data: publicEvents };
    } catch (error) {
        console.error('Error getting public events:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Register user for an event
 */
export async function registerForEvent(eventId: string, userId: string): Promise<{
    success: boolean;
    data?: EventRegistrationData;
    error?: string;
}> {
    try {
        // Check if user is already registered
        const { data: existingReg } = await supabase
            .from('registrations')
            .select('id')
            .eq('event_id', eventId)
            .eq('user_id', userId)
            .single();

        if (existingReg) {
            return { success: false, error: 'You are already registered for this event' };
        }

        // Check if event is full
        const { data: event } = await supabase
            .from('events')
            .select('max_participants')
            .eq('id', eventId)
            .single();

        if (event?.max_participants) {
            const { data: registrations } = await supabase
                .from('registrations')
                .select('id')
                .eq('event_id', eventId);

            if (registrations && registrations.length >= event.max_participants) {
                return { success: false, error: 'This event is full' };
            }
        }

        // Create registration
        const { data: registration, error } = await supabase
            .from('registrations')
            .insert([{
                event_id: eventId,
                user_id: userId,
                registered_at: new Date().toISOString()
            }])
            .select()
            .single();

        if (error) {
            console.error('Error creating registration:', error);
            return { success: false, error: error.message };
        }

        return { success: true, data: registration };
    } catch (error) {
        console.error('Error registering for event:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Cancel user registration for an event
 */
export async function cancelRegistration(eventId: string, userId: string): Promise<{
    success: boolean;
    error?: string;
}> {
    try {
        // Check if event is completed (can't cancel completed events)
        const { data: event } = await supabase
            .from('events')
            .select('status, event_date')
            .eq('id', eventId)
            .single();

        if (event?.status === 'completed') {
            return { success: false, error: 'Cannot cancel registration for completed events' };
        }

        // Check if event is too close (optional: prevent cancellation within 24 hours)
        const eventDate = new Date(event?.event_date || '');
        const now = new Date();
        const hoursDiff = (eventDate.getTime() - now.getTime()) / (1000 * 60 * 60);

        if (hoursDiff < 24) {
            return { success: false, error: 'Cannot cancel registration within 24 hours of the event' };
        }

        const { error } = await supabase
            .from('registrations')
            .delete()
            .eq('event_id', eventId)
            .eq('user_id', userId);

        if (error) {
            console.error('Error canceling registration:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error canceling registration:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Get user's registered events
 */
export async function getUserRegisteredEvents(userId: string): Promise<{
    success: boolean;
    data?: EventRegistrationData[];
    error?: string;
}> {
    try {
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select(`
                id,
                event_id,
                user_id,
                bib_number,
                finish_time,
                position,
                registered_at,
                events!inner (
                    id,
                    name,
                    description,
                    event_date,
                    distance,
                    location,
                    max_participants,
                    status,
                    created_at
                )
            `)
            .eq('user_id', userId)
            .order('registered_at', { ascending: false });

        if (error) {
            console.error('Error fetching user registrations:', error);
            return { success: false, error: error.message };
        }

        const userEvents: EventRegistrationData[] = registrations?.map((reg: any) => ({
            id: reg.id,
            event_id: reg.event_id,
            user_id: reg.user_id,
            bib_number: reg.bib_number,
            finish_time: reg.finish_time,
            position: reg.position,
            registered_at: reg.registered_at,
            event: {
                id: reg.events.id,
                name: reg.events.name,
                description: reg.events.description,
                event_date: reg.events.event_date,
                distance: reg.events.distance,
                location: reg.events.location,
                max_participants: reg.events.max_participants,
                status: reg.events.status,
                created_at: reg.events.created_at,
            },
        })) || [];

        return { success: true, data: userEvents };
    } catch (error) {
        console.error('Error getting user registered events:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Get user's event statistics
 */
export async function getUserEventStats(userId: string): Promise<{
    success: boolean;
    data?: {
        totalRegistered: number;
        upcomingEvents: number;
        completedEvents: number;
        totalDistance: string;
        averageFinishTime?: string;
    };
    error?: string;
}> {
    try {
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select(`
                finish_time,
                events!inner (
                    status,
                    distance,
                    event_date
                )
            `)
            .eq('user_id', userId);

        if (error) {
            return { success: false, error: error.message };
        }

        const now = new Date();
        let totalDistance = 0;
        let completedCount = 0;
        let upcomingCount = 0;
        const finishTimes: string[] = [];

        registrations?.forEach((reg: any) => {
            const eventDate = new Date(reg.events.event_date);

            if (reg.events.status === 'completed' || eventDate < now) {
                completedCount++;
                if (reg.finish_time) {
                    finishTimes.push(reg.finish_time);
                }
            } else if (reg.events.status === 'upcoming' && eventDate >= now) {
                upcomingCount++;
            }

            // Calculate total distance (assuming distance is in format like "5K", "10K", "21K", "42K")
            const distance = reg.events.distance?.replace(/[^0-9.]/g, '') || '0';
            totalDistance += parseFloat(distance) || 0;
        });

        return {
            success: true,
            data: {
                totalRegistered: registrations?.length || 0,
                upcomingEvents: upcomingCount,
                completedEvents: completedCount,
                totalDistance: `${totalDistance}K`,
                averageFinishTime: finishTimes.length > 0 ? 'Average calculation needed' : undefined, // TODO: Implement proper time calculation
            }
        };
    } catch (error) {
        console.error('Error getting user event stats:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}