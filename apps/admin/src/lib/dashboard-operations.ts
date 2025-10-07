import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface DashboardStats {
  totalEvents: number;
  totalParticipants: number;
  completedEvents: number;
  eventsThisMonth: number;
}

export interface RecentEventData {
  id: string;
  name: string;
  date: string;
  status: 'upcoming' | 'completed' | 'cancelled';
}

/**
 * Get dashboard statistics
 */
export async function getDashboardStats(): Promise<{ success: boolean; data?: DashboardStats; error?: string }> {
  try {
    // Get total events
    const { count: totalEvents, error: eventsError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true });

    if (eventsError) {
      console.error('Error fetching total events:', eventsError);
      return { success: false, error: eventsError.message };
    }

    // Get completed events
    const { count: completedEvents, error: completedError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'completed');

    if (completedError) {
      console.error('Error fetching completed events:', completedError);
      return { success: false, error: completedError.message };
    }

    // Get events this month
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).toISOString().split('T')[0];

    const { count: eventsThisMonth, error: monthError } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .gte('event_date', startOfMonth)
      .lte('event_date', endOfMonth);

    if (monthError) {
      console.error('Error fetching events this month:', monthError);
      return { success: false, error: monthError.message };
    }

    // Get total participants (registrations)
    const { count: totalParticipants, error: participantsError } = await supabase
      .from('registrations')
      .select('*', { count: 'exact', head: true });

    if (participantsError) {
      console.error('Error fetching total participants:', participantsError);
      return { success: false, error: participantsError.message };
    }

    const stats: DashboardStats = {
      totalEvents: totalEvents || 0,
      totalParticipants: totalParticipants || 0,
      completedEvents: completedEvents || 0,
      eventsThisMonth: eventsThisMonth || 0,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error('Error getting dashboard stats:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

/**
 * Get recent events for dashboard
 */
export async function getRecentEvents(limit: number = 5): Promise<{ success: boolean; data?: RecentEventData[]; error?: string }> {
  try {
    const { data: events, error } = await supabase
      .from('events')
      .select('id, name, event_date, status')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching recent events:', error);
      return { success: false, error: error.message };
    }

    const recentEvents: RecentEventData[] = events?.map(event => ({
      id: event.id,
      name: event.name,
      date: event.event_date,
      status: event.status,
    })) || [];

    return { success: true, data: recentEvents };
  } catch (error) {
    console.error('Error getting recent events:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

/**
 * Get upcoming events count
 */
export async function getUpcomingEventsCount(): Promise<{ success: boolean; data?: number; error?: string }> {
  try {
    const { count, error } = await supabase
      .from('events')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'upcoming');

    if (error) {
      console.error('Error fetching upcoming events count:', error);
      return { success: false, error: error.message };
    }

    return { success: true, data: count || 0 };
  } catch (error) {
    console.error('Error getting upcoming events count:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}

/**
 * Get events by status count
 */
export async function getEventsByStatus(): Promise<{ 
  success: boolean; 
  data?: { upcoming: number; completed: number; cancelled: number }; 
  error?: string;
}> {
  try {
    const [upcomingResult, completedResult, cancelledResult] = await Promise.all([
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'upcoming'),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'completed'),
      supabase.from('events').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
    ]);

    if (upcomingResult.error || completedResult.error || cancelledResult.error) {
      const error = upcomingResult.error || completedResult.error || cancelledResult.error;
      console.error('Error fetching events by status:', error);
      return { success: false, error: error!.message };
    }

    const data = {
      upcoming: upcomingResult.count || 0,
      completed: completedResult.count || 0,
      cancelled: cancelledResult.count || 0,
    };

    return { success: true, data };
  } catch (error) {
    console.error('Error getting events by status:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'An unexpected error occurred' 
    };
  }
}