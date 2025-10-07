import * as react_jsx_runtime from 'react/jsx-runtime';
import * as react from 'react';
import * as _supabase_supabase_js from '@supabase/supabase-js';
import { User, Session } from '@supabase/supabase-js';
import * as node_modules__supabase_postgrest_js_dist_cjs_select_query_parser_parser from 'node_modules/@supabase/postgrest-js/dist/cjs/select-query-parser/parser';

interface AuthContextType {
    user: User | null;
    session: Session | null;
    loading: boolean;
    isAdmin: boolean;
    signOut: () => Promise<void>;
}
declare const AuthContext: react.Context<AuthContextType>;
interface AuthProviderProps {
    children: React.ReactNode;
}
declare function AuthProvider({ children }: AuthProviderProps): react_jsx_runtime.JSX.Element;
declare const useAuth: () => AuthContextType;

declare const createSupabaseClient: () => _supabase_supabase_js.SupabaseClient<any, "public", "public", any, any>;
declare const supabase: _supabase_supabase_js.SupabaseClient<any, "public", "public", any, any>;
declare const checkUserRole: (userId: string) => Promise<any>;
declare const isAdminUser: (userId: string) => Promise<boolean>;

/**
 * Role management utilities for admin operations
 */
interface UserProfile {
    id: string;
    full_name: string | null;
    role: 'user' | 'admin';
    created_at: string;
    updated_at: string;
}
/**
 * Get all user profiles (admin-only function)
 */
declare const getAllUsers: () => Promise<UserProfile[]>;
/**
 * Promote a user to admin role
 */
declare const promoteUserToAdmin: (userId: string) => Promise<UserProfile>;
/**
 * Demote an admin to user role
 */
declare const demoteAdminToUser: (userId: string) => Promise<UserProfile>;
/**
 * Get a specific user's profile
 */
declare const getUserProfile: (userId: string) => Promise<UserProfile>;
/**
 * Update user profile information
 */
declare const updateUserProfile: (userId: string, updates: Partial<Pick<UserProfile, "full_name" | "role">>) => Promise<UserProfile>;
/**
 * Check if current user has admin privileges (client-side utility)
 */
declare const requireAdminAccess: (currentUserId: string) => Promise<UserProfile>;
/**
 * Search users by name or email (admin-only)
 */
declare const searchUsers: (searchTerm: string) => Promise<node_modules__supabase_postgrest_js_dist_cjs_select_query_parser_parser.ParserError<"Unable to parse renamed field at `email:auth.users!inner(email)\n            `">[]>;

interface EventFormData {
    name: string;
    description: string;
    date: string;
    location: string;
    distance: string;
    maxParticipants: number | '';
    status: 'upcoming' | 'completed' | 'cancelled';
}
interface EventData {
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
declare function createEvent(formData: EventFormData, userId: string): Promise<{
    success: boolean;
    data?: EventData;
    error?: string;
}>;
/**
 * Get all events
 */
declare function getAllEvents(): Promise<{
    success: boolean;
    data?: EventData[];
    error?: string;
}>;
/**
 * Update an existing event
 */
declare function updateEvent(eventId: string, formData: EventFormData, userId: string): Promise<{
    success: boolean;
    data?: EventData;
    error?: string;
}>;
/**
 * Delete an event
 */
declare function deleteEvent(eventId: string, userId: string): Promise<{
    success: boolean;
    error?: string;
}>;
/**
 * Duplicate an event
 */
declare function duplicateEvent(eventId: string, userId: string): Promise<{
    success: boolean;
    data?: EventData;
    error?: string;
}>;
/**
 * Update event status
 */
declare function updateEventStatus(eventId: string, status: 'upcoming' | 'completed' | 'cancelled', userId: string): Promise<{
    success: boolean;
    error?: string;
}>;

export { AuthContext, AuthProvider, type EventData, type EventFormData, type UserProfile, checkUserRole, createEvent, createSupabaseClient, deleteEvent, demoteAdminToUser, duplicateEvent, getAllEvents, getAllUsers, getUserProfile, isAdminUser, promoteUserToAdmin, requireAdminAccess, searchUsers, supabase, updateEvent, updateEventStatus, updateUserProfile, useAuth };
