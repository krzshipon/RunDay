import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface EventFormData {
    name: string;
    description: string;
    date: string;
    location: string;
    distance: string;
    maxParticipants: number | '';
    status: 'upcoming' | 'completed' | 'cancelled';
}

export interface EventData {
    id: string;
    name: string;
    description?: string;
    date: string;
    location?: string;
    distance: string;
    maxParticipants?: number;
    registeredCount?: number;
    status: 'upcoming' | 'completed' | 'cancelled';
    created_by: string;
    created_at: string;
    updated_at: string;
}

/**
 * Create a new event
 */
export async function createEvent(formData: EventFormData, userId: string): Promise<{ success: boolean; data?: EventData; error?: string }> {
    try {
        const { data, error } = await supabase
            .from('events')
            .insert({
                name: formData.name,
                description: formData.description || null,
                event_date: formData.date,
                distance: formData.distance,
                location: formData.location || null,
                max_participants: formData.maxParticipants || null,
                status: formData.status || 'upcoming',
                created_by: userId,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error creating event:', error);
            return { success: false, error: error.message };
        }

        // Transform the data to match our EventData interface
        const eventData: EventData = {
            id: data.id,
            name: data.name,
            description: data.description || undefined,
            date: data.event_date,
            location: data.location || undefined,
            distance: data.distance,
            maxParticipants: data.max_participants || undefined,
            registeredCount: 0, // New events have 0 registrations
            status: data.status,
            created_by: data.created_by,
            created_at: data.created_at,
            updated_at: data.updated_at,
        };

        return { success: true, data: eventData };
    } catch (error) {
        console.error('Error creating event:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Get all events
 */
export async function getAllEvents(): Promise<{ success: boolean; data?: EventData[]; error?: string }> {
    try {
        const { data: events, error } = await supabase
            .from('events')
            .select(`
        id,
        name,
        description,
        event_date,
        distance,
        location,
        max_participants,
        status,
        created_by,
        created_at,
        updated_at
      `)
            .order('event_date', { ascending: true });

        if (error) {
            console.error('Supabase error fetching events:', error);
            return { success: false, error: error.message };
        }

        // Get registration counts for all events
        const eventIds = events?.map(event => event.id) || [];
        const { data: registrations } = await supabase
            .from('registrations')
            .select('event_id')
            .in('event_id', eventIds);

        // Count registrations per event
        const registrationCounts = registrations?.reduce((acc, reg) => {
            acc[reg.event_id] = (acc[reg.event_id] || 0) + 1;
            return acc;
        }, {} as Record<string, number>) || {};

        // Transform the data
        const eventData: EventData[] = events?.map(event => ({
            id: event.id,
            name: event.name,
            description: event.description || undefined,
            date: event.event_date,
            location: event.location || undefined,
            distance: event.distance,
            maxParticipants: event.max_participants || undefined,
            registeredCount: registrationCounts[event.id] || 0,
            status: event.status,
            created_by: event.created_by,
            created_at: event.created_at,
            updated_at: event.updated_at,
        })) || [];

        return { success: true, data: eventData };
    } catch (error) {
        console.error('Error fetching events:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Update an existing event
 */
export async function updateEvent(eventId: string, formData: EventFormData, userId: string): Promise<{ success: boolean; data?: EventData; error?: string }> {
    try {
        // First check if the user owns this event
        const { data: existingEvent, error: checkError } = await supabase
            .from('events')
            .select('created_by')
            .eq('id', eventId)
            .single();

        if (checkError) {
            return { success: false, error: 'Event not found' };
        }

        if (existingEvent.created_by !== userId) {
            return { success: false, error: 'You can only edit events you created' };
        }

        const { data, error } = await supabase
            .from('events')
            .update({
                name: formData.name,
                description: formData.description || null,
                event_date: formData.date,
                distance: formData.distance,
                location: formData.location || null,
                max_participants: formData.maxParticipants || null,
                status: formData.status,
                updated_at: new Date().toISOString(),
            })
            .eq('id', eventId)
            .select()
            .single();

        if (error) {
            console.error('Supabase error updating event:', error);
            return { success: false, error: error.message };
        }

        // Get registration count
        const { data: registrations } = await supabase
            .from('registrations')
            .select('id')
            .eq('event_id', eventId);

        const eventData: EventData = {
            id: data.id,
            name: data.name,
            description: data.description || undefined,
            date: data.event_date,
            location: data.location || undefined,
            distance: data.distance,
            maxParticipants: data.max_participants || undefined,
            registeredCount: registrations?.length || 0,
            status: data.status,
            created_by: data.created_by,
            created_at: data.created_at,
            updated_at: data.updated_at,
        };

        return { success: true, data: eventData };
    } catch (error) {
        console.error('Error updating event:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Delete an event
 */
export async function deleteEvent(eventId: string, userId: string): Promise<{ success: boolean; error?: string }> {
    try {
        // First check if the user owns this event
        const { data: existingEvent, error: checkError } = await supabase
            .from('events')
            .select('created_by, status')
            .eq('id', eventId)
            .single();

        if (checkError) {
            return { success: false, error: 'Event not found' };
        }

        if (existingEvent.created_by !== userId) {
            return { success: false, error: 'You can only delete events you created' };
        }

        // Check if event has registrations
        const { data: registrations } = await supabase
            .from('registrations')
            .select('id')
            .eq('event_id', eventId)
            .limit(1);

        if (registrations && registrations.length > 0) {
            return { success: false, error: 'Cannot delete events with existing registrations' };
        }

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId);

        if (error) {
            console.error('Supabase error deleting event:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error deleting event:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Duplicate an event
 */
export async function duplicateEvent(eventId: string, userId: string): Promise<{ success: boolean; data?: EventData; error?: string }> {
    try {
        // Get the original event
        const { data: originalEvent, error: fetchError } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (fetchError) {
            return { success: false, error: 'Original event not found' };
        }

        // Create duplicate with adjusted date
        const newDate = new Date(originalEvent.event_date);
        newDate.setDate(newDate.getDate() + 7); // Add 7 days

        const { data, error } = await supabase
            .from('events')
            .insert({
                name: `Copy of ${originalEvent.name}`,
                description: originalEvent.description,
                event_date: newDate.toISOString().split('T')[0],
                distance: originalEvent.distance,
                location: originalEvent.location,
                max_participants: originalEvent.max_participants,
                status: 'upcoming',
                created_by: userId,
            })
            .select()
            .single();

        if (error) {
            console.error('Supabase error duplicating event:', error);
            return { success: false, error: error.message };
        }

        const eventData: EventData = {
            id: data.id,
            name: data.name,
            description: data.description || undefined,
            date: data.event_date,
            location: data.location || undefined,
            distance: data.distance,
            maxParticipants: data.max_participants || undefined,
            registeredCount: 0,
            status: data.status,
            created_by: data.created_by,
            created_at: data.created_at,
            updated_at: data.updated_at,
        };

        return { success: true, data: eventData };
    } catch (error) {
        console.error('Error duplicating event:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Update event status
 */
export async function updateEventStatus(
    eventId: string,
    status: 'upcoming' | 'completed' | 'cancelled',
    userId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // Check if the user owns this event
        const { data: existingEvent, error: checkError } = await supabase
            .from('events')
            .select('created_by')
            .eq('id', eventId)
            .single();

        if (checkError) {
            return { success: false, error: 'Event not found' };
        }

        if (existingEvent.created_by !== userId) {
            return { success: false, error: 'You can only modify events you created' };
        }

        const { error } = await supabase
            .from('events')
            .update({
                status,
                updated_at: new Date().toISOString(),
            })
            .eq('id', eventId);

        if (error) {
            console.error('Supabase error updating event status:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating event status:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}