import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Only create client on client side and with valid env vars
let supabaseClient: any = null;

if (typeof window !== 'undefined' && supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
} else if (typeof window === 'undefined') {
    // Server-side: create a mock client for build time
    supabaseClient = {
        auth: {
            getSession: () => Promise.resolve({ data: { session: null }, error: null }),
            onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => { } } } }),
            signOut: () => Promise.resolve({ error: null }),
            signInWithPassword: () => Promise.resolve({ error: null }),
            getUser: () => Promise.resolve({ data: { user: null }, error: null }),
        },
        from: () => ({
            select: () => ({
                eq: () => ({
                    single: () => Promise.resolve({ data: null, error: null })
                })
            }),
            insert: () => ({
                select: () => ({
                    single: () => Promise.resolve({ data: null, error: null })
                })
            }),
            update: () => ({
                eq: () => ({
                    select: () => ({
                        single: () => Promise.resolve({ data: null, error: null })
                    })
                })
            })
        })
    };
}

if (!supabaseClient && typeof window !== 'undefined') {
    throw new Error('Missing Supabase environment variables');
}

export const supabase = supabaseClient;