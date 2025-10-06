import { createClient } from '@supabase/supabase-js';

export const createSupabaseClient = () => {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );
};

export const supabase = createSupabaseClient();

// Auth utilities
export const checkUserRole = async (userId: string) => {
    try {
        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', userId)
            .single();

        return profile?.role || 'user';
    } catch (error) {
        console.error('Error checking user role:', error);
        return 'user';
    }
};

export const isAdminUser = async (userId: string) => {
    const role = await checkUserRole(userId);
    return role === 'admin';
};