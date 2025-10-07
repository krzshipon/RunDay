import { supabase } from './client';
import { Database } from './types';

type EventInsert = Database['public']['Tables']['events']['Insert'];
type EventUpdate = Database['public']['Tables']['events']['Update'];
type EventRow = Database['public']['Tables']['events']['Row'];

export interface CreateEventData {
    name: string;
    description?: string;
    date: string; // ISO date string
    location?: string;
    distance: string;
    maxParticipants?: number;
    status?: 'upcoming' | 'completed' | 'cancelled';
}

export interface UpdateEventData {
    name?: string;
    description?: string;
    date?: string;
    location?: string;
    distance?: string;
    maxParticipants?: number;
    status?: 'upcoming' | 'completed' | 'cancelled';
}

/**
 * Create a new event
 */
export async function createEvent(eventData: CreateEventData, userId: string) {
    try {
        const insertData: EventInsert = {
            name: eventData.name,
            description: eventData.description || null,
            event_date: eventData.date,
            distance: eventData.distance,
            location: eventData.location || null,
            max_participants: eventData.maxParticipants || null,
            status: eventData.status || 'upcoming',
            created_by: userId,
        };

        const { data, error } = await supabase
            .from('events')
            .insert(insertData)
            .select()
            .single();

        if (error) {
            console.error('Error creating event:', error);
            throw new Error(`Failed to create event: ${error.message}`);
        }

        return { data, error: null };
    } catch (error) {
        console.error('Unexpected error creating event:', error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Get all events with optional filtering
 */
export async function getEvents(filters?: {
    status?: 'upcoming' | 'completed' | 'cancelled';
    createdBy?: string;
}) {
    try {
        let query = supabase
            .from('events')
            .select(`
        *,
        registrations(count)
      `)
            .order('event_date', { ascending: true });

        if (filters?.status) {
            query = query.eq('status', filters.status);
        }

        if (filters?.createdBy) {
            query = query.eq('created_by', filters.createdBy);
        }

        const { data, error } = await query;

        if (error) {
            console.error('Error fetching events:', error);
            throw new Error(`Failed to fetch events: ${error.message}`);
        }

        // Transform data to include registration count
        const eventsWithCount = data?.map(event => ({
            ...event,
            registeredCount: event.registrations?.[0]?.count || 0,
        })) || [];

        return { data: eventsWithCount, error: null };
    } catch (error) {
        console.error('Unexpected error fetching events:', error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Get a single event by ID
 */
export async function getEventById(eventId: string) {
    try {
        const { data, error } = await supabase
            .from('events')
            .select(`
        *,
        registrations(count)
      `)
            .eq('id', eventId)
            .single();

        if (error) {
            console.error('Error fetching event:', error);
            throw new Error(`Failed to fetch event: ${error.message}`);
        }

        // Add registration count
        const eventWithCount = {
            ...data,
            registeredCount: data.registrations?.[0]?.count || 0,
        };

        return { data: eventWithCount, error: null };
    } catch (error) {
        console.error('Unexpected error fetching event:', error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Update an existing event
 */
export async function updateEvent(eventId: string, eventData: UpdateEventData, userId: string) {
    try {
        // First check if user owns this event or is admin
        const { data: event, error: fetchError } = await supabase
            .from('events')
            .select('created_by')
            .eq('id', eventId)
            .single();

        if (fetchError) {
            throw new Error(`Event not found: ${fetchError.message}`);
        }

        // For now, only allow the creator to edit (we can add admin check later)
        if (event.created_by !== userId) {
            throw new Error('You can only edit events you created');
        }

        const updateData: EventUpdate = {};

        if (eventData.name !== undefined) updateData.name = eventData.name;
        if (eventData.description !== undefined) updateData.description = eventData.description || null;
        if (eventData.date !== undefined) updateData.event_date = eventData.date;
        if (eventData.distance !== undefined) updateData.distance = eventData.distance;
        if (eventData.location !== undefined) updateData.location = eventData.location || null;
        if (eventData.maxParticipants !== undefined) updateData.max_participants = eventData.maxParticipants || null;
        if (eventData.status !== undefined) updateData.status = eventData.status;

        updateData.updated_at = new Date().toISOString();

        const { data, error } = await supabase
            .from('events')
            .update(updateData)
            .eq('id', eventId)
            .select()
            .single();

        if (error) {
            console.error('Error updating event:', error);
            throw new Error(`Failed to update event: ${error.message}`);
        }

        return { data, error: null };
    } catch (error) {
        console.error('Unexpected error updating event:', error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Delete an event
 */
export async function deleteEvent(eventId: string, userId: string) {
    try {
        // First check if user owns this event
        const { data: event, error: fetchError } = await supabase
            .from('events')
            .select('created_by, status')
            .eq('id', eventId)
            .single();

        if (fetchError) {
            throw new Error(`Event not found: ${fetchError.message}`);
        }

        // Only allow deletion if user owns the event
        if (event.created_by !== userId) {
            throw new Error('You can only delete events you created');
        }

        // Don't allow deletion of completed events with registrations
        if (event.status === 'completed') {
            const { data: registrations } = await supabase
                .from('registrations')
                .select('id')
                .eq('event_id', eventId)
                .limit(1);

            if (registrations && registrations.length > 0) {
                throw new Error('Cannot delete completed events with registrations');
            }
        }

        const { error } = await supabase
            .from('events')
            .delete()
            .eq('id', eventId);

        if (error) {
            console.error('Error deleting event:', error);
            throw new Error(`Failed to delete event: ${error.message}`);
        }

        return { error: null };
    } catch (error) {
        console.error('Unexpected error deleting event:', error);
        return {
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}

/**
 * Duplicate an event
 */
export async function duplicateEvent(eventId: string, userId: string) {
    try {
        // Get the original event
        const { data: originalEvent, error: fetchError } = await supabase
            .from('events')
            .select('*')
            .eq('id', eventId)
            .single();

        if (fetchError) {
            throw new Error(`Original event not found: ${fetchError.message}`);
        }

        // Create new event data
        const newEventDate = new Date(originalEvent.event_date);
        newEventDate.setDate(newEventDate.getDate() + 7); // Add 7 days

        const duplicateData: EventInsert = {
            name: `Copy of ${originalEvent.name}`,
            description: originalEvent.description,
            event_date: newEventDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
            distance: originalEvent.distance,
            location: originalEvent.location,
            max_participants: originalEvent.max_participants,
            status: 'upcoming', // Always set duplicated events as upcoming
            created_by: userId,
        };

        const { data, error } = await supabase
            .from('events')
            .insert(duplicateData)
            .select()
            .single();

        if (error) {
            console.error('Error duplicating event:', error);
            throw new Error(`Failed to duplicate event: ${error.message}`);
        }

        return { data, error: null };
    } catch (error) {
        console.error('Unexpected error duplicating event:', error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
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
) {
    try {
        // Check if user owns this event
        const { data: event, error: fetchError } = await supabase
            .from('events')
            .select('created_by')
            .eq('id', eventId)
            .single();

        if (fetchError) {
            throw new Error(`Event not found: ${fetchError.message}`);
        }

        if (event.created_by !== userId) {
            throw new Error('You can only modify events you created');
        }

        const { data, error } = await supabase
            .from('events')
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq('id', eventId)
            .select()
            .single();

        if (error) {
            console.error('Error updating event status:', error);
            throw new Error(`Failed to update event status: ${error.message}`);
        }

        return { data, error: null };
    } catch (error) {
        console.error('Unexpected error updating event status:', error);
        return {
            data: null,
            error: error instanceof Error ? error.message : 'Unknown error occurred'
        };
    }
}