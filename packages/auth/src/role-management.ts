import { supabase } from './utils';

/**
 * Role management utilities for admin operations
 */

export interface UserProfile {
    id: string;
    full_name: string | null;
    role: 'user' | 'admin';
    created_at: string;
    updated_at: string;
}

/**
 * Get all user profiles (admin-only function)
 */
export const getAllUsers = async () => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data as UserProfile[];
    } catch (error) {
        console.error('Error fetching users:', error);
        throw error;
    }
};

/**
 * Promote a user to admin role
 */
export const promoteUserToAdmin = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role: 'admin' })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as UserProfile;
    } catch (error) {
        console.error('Error promoting user to admin:', error);
        throw error;
    }
};

/**
 * Demote an admin to user role
 */
export const demoteAdminToUser = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update({ role: 'user' })
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as UserProfile;
    } catch (error) {
        console.error('Error demoting admin to user:', error);
        throw error;
    }
};

/**
 * Get a specific user's profile
 */
export const getUserProfile = async (userId: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();

        if (error) {
            throw error;
        }

        return data as UserProfile;
    } catch (error) {
        console.error('Error fetching user profile:', error);
        throw error;
    }
};

/**
 * Update user profile information
 */
export const updateUserProfile = async (userId: string, updates: Partial<Pick<UserProfile, 'full_name' | 'role'>>) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .update(updates)
            .eq('id', userId)
            .select()
            .single();

        if (error) {
            throw error;
        }

        return data as UserProfile;
    } catch (error) {
        console.error('Error updating user profile:', error);
        throw error;
    }
};

/**
 * Check if current user has admin privileges (client-side utility)
 */
export const requireAdminAccess = async (currentUserId: string) => {
    const profile = await getUserProfile(currentUserId);

    if (profile.role !== 'admin') {
        throw new Error('Admin access required for this operation');
    }

    return profile;
};

/**
 * Search users by name or email (admin-only)
 */
export const searchUsers = async (searchTerm: string) => {
    try {
        const { data, error } = await supabase
            .from('profiles')
            .select(`
                *,
                email:auth.users!inner(email)
            `)
            .or(`full_name.ilike.%${searchTerm}%,auth.users.email.ilike.%${searchTerm}%`)
            .order('created_at', { ascending: false });

        if (error) {
            throw error;
        }

        return data;
    } catch (error) {
        console.error('Error searching users:', error);
        throw error;
    }
};