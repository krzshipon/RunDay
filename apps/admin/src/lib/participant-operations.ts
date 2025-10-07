import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ParticipantData {
    id: string;
    event_id: string;
    user_id: string;
    bib_number?: number;
    finish_time?: string; // In format "HH:MM:SS" or interval format
    position?: number;
    registered_at: string;
    // Joined data from user profile
    user_email?: string;
    user_name?: string;
}

export interface EventParticipant {
    id: string;
    event_id: string;
    event_name: string;
    event_date: string;
    user_id: string;
    user_email: string;
    user_name?: string;
    bib_number?: number;
    finish_time?: string;
    position?: number;
    registered_at: string;
    status: 'registered' | 'completed' | 'dns' | 'dnf'; // Did Not Start, Did Not Finish
}

export interface ParticipantFormData {
    bib_number?: number;
    finish_time?: string;
    position?: number;
    status?: 'registered' | 'completed' | 'dns' | 'dnf';
}

/**
 * Get all participants for a specific event
 */
export async function getEventParticipants(eventId: string): Promise<{
    success: boolean;
    data?: EventParticipant[];
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
          event_date
        )
      `)
            .eq('event_id', eventId)
            .order('bib_number', { ascending: true, nullsFirst: false })
            .order('registered_at', { ascending: true });

        if (error) {
            console.error('Error fetching event participants:', error);
            return { success: false, error: error.message };
        }

        // Get user emails and profiles separately
        const userIds = registrations?.map(r => r.user_id) || [];

        // Get user emails from auth
        let userEmailMap: Record<string, string> = {};
        try {
            const { data: users, error: usersError } = await supabase.auth.admin.listUsers();
            if (!usersError && users?.users) {
                userEmailMap = users.users.reduce((acc: Record<string, string>, user: any) => {
                    acc[user.id] = user.email;
                    return acc;
                }, {});
            }
        } catch (authError) {
            console.warn('Could not fetch auth users, will use user_id as fallback');
        }

        // Get user profiles if they exist
        let userProfileMap: Record<string, string> = {};
        if (userIds.length > 0) {
            try {
                const { data: profiles, error: profilesError } = await supabase
                    .from('profiles')
                    .select('id, full_name')
                    .in('id', userIds);

                if (!profilesError && profiles) {
                    userProfileMap = profiles.reduce((acc: Record<string, string>, profile: any) => {
                        acc[profile.id] = profile.full_name;
                        return acc;
                    }, {});
                }
            } catch (profileError) {
                console.warn('Could not fetch user profiles');
            }
        }

        const participants: EventParticipant[] = registrations?.map((registration: any) => ({
            id: registration.id,
            event_id: registration.event_id,
            event_name: registration.events?.name || 'Unknown Event',
            event_date: registration.events?.event_date || '',
            user_id: registration.user_id,
            user_email: userEmailMap[registration.user_id] || `User-${registration.user_id.slice(0, 8)}`,
            user_name: userProfileMap[registration.user_id] || undefined,
            bib_number: registration.bib_number || undefined,
            finish_time: registration.finish_time || undefined,
            position: registration.position || undefined,
            registered_at: registration.registered_at,
            status: registration.finish_time ? 'completed' : 'registered',
        })) || [];

        return { success: true, data: participants };
    } catch (error) {
        console.error('Error getting event participants:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Update participant information (bib number, finish time, position)
 */
export async function updateParticipant(
    participantId: string,
    updates: ParticipantFormData,
    userId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // First verify this is an admin or event creator
        const { data: registration, error: fetchError } = await supabase
            .from('registrations')
            .select(`
        event_id,
        events!inner (
          created_by
        )
      `)
            .eq('id', participantId)
            .single();

        if (fetchError) {
            return { success: false, error: 'Participant not found' };
        }

        // Check if user is admin or event creator
        let isAdmin = false;
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            isAdmin = profile?.role === 'admin';
        } catch (profileError) {
            // If profiles table doesn't exist or user has no profile, assume not admin
            console.warn('Could not check user role, assuming non-admin');
        }

        const isEventCreator = (registration as any).events?.created_by === userId;

        if (!isAdmin && !isEventCreator) {
            return { success: false, error: 'You can only modify participants for events you created' };
        }

        // Update the registration
        const updateData: any = {};
        if (updates.bib_number !== undefined) updateData.bib_number = updates.bib_number;
        if (updates.finish_time !== undefined) updateData.finish_time = updates.finish_time || null;
        if (updates.position !== undefined) updateData.position = updates.position || null;

        const { error } = await supabase
            .from('registrations')
            .update(updateData)
            .eq('id', participantId);

        if (error) {
            console.error('Error updating participant:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error updating participant:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Assign bib numbers automatically to all participants without bib numbers
 */
export async function assignBibNumbers(eventId: string, userId: string): Promise<{
    success: boolean;
    assigned?: number;
    error?: string;
}> {
    try {
        // Verify user can modify this event
        const { data: event, error: eventError } = await supabase
            .from('events')
            .select('created_by')
            .eq('id', eventId)
            .single();

        if (eventError || !event) {
            return { success: false, error: 'Event not found' };
        }

        // Check if user is admin or event creator
        let isAdmin = false;
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            isAdmin = profile?.role === 'admin';
        } catch (profileError) {
            // If profiles table doesn't exist or user has no profile, assume not admin
            console.warn('Could not check user role, assuming non-admin');
        }

        const isEventCreator = event.created_by === userId;

        if (!isAdmin && !isEventCreator) {
            return { success: false, error: 'You can only assign bib numbers for events you created' };
        }

        // Get all registrations for this event
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select('id, bib_number')
            .eq('event_id', eventId)
            .order('registered_at', { ascending: true });

        if (error) {
            return { success: false, error: error.message };
        }

        // Find the highest existing bib number
        const existingBibNumbers = registrations?.map(r => r.bib_number).filter(Boolean) || [];
        let nextBibNumber = existingBibNumbers.length > 0 ? Math.max(...existingBibNumbers) + 1 : 1;

        // Assign bib numbers to participants without them
        const toUpdate = registrations?.filter(r => !r.bib_number) || [];

        for (const registration of toUpdate) {
            const { error: updateError } = await supabase
                .from('registrations')
                .update({ bib_number: nextBibNumber })
                .eq('id', registration.id);

            if (updateError) {
                console.error('Error assigning bib number:', updateError);
                continue;
            }

            nextBibNumber++;
        }

        return { success: true, assigned: toUpdate.length };
    } catch (error) {
        console.error('Error assigning bib numbers:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Remove participant from event (unregister)
 */
export async function removeParticipant(
    participantId: string,
    userId: string
): Promise<{ success: boolean; error?: string }> {
    try {
        // First verify this is an admin or event creator
        const { data: registration, error: fetchError } = await supabase
            .from('registrations')
            .select(`
        event_id,
        events!inner (
          created_by,
          status
        )
      `)
            .eq('id', participantId)
            .single();

        if (fetchError) {
            return { success: false, error: 'Participant not found' };
        }

        // Check if user is admin or event creator
        let isAdmin = false;
        try {
            const { data: profile } = await supabase
                .from('profiles')
                .select('role')
                .eq('id', userId)
                .single();

            isAdmin = profile?.role === 'admin';
        } catch (profileError) {
            // If profiles table doesn't exist or user has no profile, assume not admin
            console.warn('Could not check user role, assuming non-admin');
        }

        const isEventCreator = (registration as any).events?.created_by === userId;

        if (!isAdmin && !isEventCreator) {
            return { success: false, error: 'You can only remove participants from events you created' };
        }

        // Don't allow removing participants from completed events
        if ((registration as any).events?.status === 'completed') {
            return { success: false, error: 'Cannot remove participants from completed events' };
        }

        const { error } = await supabase
            .from('registrations')
            .delete()
            .eq('id', participantId);

        if (error) {
            console.error('Error removing participant:', error);
            return { success: false, error: error.message };
        }

        return { success: true };
    } catch (error) {
        console.error('Error removing participant:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Get participant statistics for an event
 */
export async function getParticipantStats(eventId: string): Promise<{
    success: boolean;
    data?: {
        total: number;
        withBibNumbers: number;
        completed: number;
        averageTime?: string;
    };
    error?: string;
}> {
    try {
        const { data: registrations, error } = await supabase
            .from('registrations')
            .select('bib_number, finish_time')
            .eq('event_id', eventId);

        if (error) {
            return { success: false, error: error.message };
        }

        const total = registrations?.length || 0;
        const withBibNumbers = registrations?.filter(r => r.bib_number).length || 0;
        const completed = registrations?.filter(r => r.finish_time).length || 0;

        // Calculate average finish time if any participants have finished
        let averageTime: string | undefined;
        if (completed > 0) {
            const finishTimes = registrations?.filter(r => r.finish_time).map(r => r.finish_time) || [];
            // This is a simplified calculation - in production you'd want proper time parsing
            averageTime = "Average calculation needed"; // TODO: Implement proper time calculation
        }

        return {
            success: true,
            data: {
                total,
                withBibNumbers,
                completed,
                averageTime,
            }
        };
    } catch (error) {
        console.error('Error getting participant stats:', error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'An unexpected error occurred'
        };
    }
}

/**
 * Export participants data for an event (for CSV download)
 */
export async function exportParticipants(eventId: string): Promise<{
    success: boolean;
    data?: EventParticipant[];
    error?: string;
}> {
    // This uses the same function as getEventParticipants but is separate 
    // in case we want different formatting for export
    return await getEventParticipants(eventId);
}