export interface Database {
    public: {
        Tables: {
            profiles: {
                Row: {
                    id: string
                    full_name: string
                    role: 'admin' | 'user'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id: string
                    full_name: string
                    role?: 'admin' | 'user'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    full_name?: string
                    role?: 'admin' | 'user'
                    created_at?: string
                    updated_at?: string
                }
            }
            events: {
                Row: {
                    id: string
                    name: string
                    description: string | null
                    event_date: string
                    distance: string
                    location: string | null
                    max_participants: number | null
                    status: 'upcoming' | 'completed' | 'cancelled'
                    created_by: string
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: string
                    name: string
                    description?: string | null
                    event_date: string
                    distance: string
                    location?: string | null
                    max_participants?: number | null
                    status?: 'upcoming' | 'completed' | 'cancelled'
                    created_by: string
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: string
                    name?: string
                    description?: string | null
                    event_date?: string
                    distance?: string
                    location?: string | null
                    max_participants?: number | null
                    status?: 'upcoming' | 'completed' | 'cancelled'
                    created_by?: string
                    created_at?: string
                    updated_at?: string
                }
            }
            registrations: {
                Row: {
                    id: string
                    event_id: string
                    user_id: string
                    bib_number: number | null
                    finish_time: string | null
                    position: number | null
                    registered_at: string
                }
                Insert: {
                    id?: string
                    event_id: string
                    user_id: string
                    bib_number?: number | null
                    finish_time?: string | null
                    position?: number | null
                    registered_at?: string
                }
                Update: {
                    id?: string
                    event_id?: string
                    user_id?: string
                    bib_number?: number | null
                    finish_time?: string | null
                    position?: number | null
                    registered_at?: string
                }
            }
        }
        Views: {
            [_ in never]: never
        }
        Functions: {
            [_ in never]: never
        }
        Enums: {
            [_ in never]: never
        }
    }
}