import { z } from 'zod'

export const profileSchema = z.object({
    id: z.string().uuid(),
    full_name: z.string().min(2, 'Full name must be at least 2 characters'),
    role: z.enum(['admin', 'user']).default('user'),
    created_at: z.string(),
    updated_at: z.string(),
})

export const eventSchema = z.object({
    id: z.string().uuid().optional(),
    name: z.string().min(3, 'Event name must be at least 3 characters'),
    description: z.string().optional(),
    event_date: z.string(),
    distance: z.string().min(1, 'Distance is required'),
    location: z.string().optional(),
    max_participants: z.number().positive().optional(),
    status: z.enum(['upcoming', 'completed', 'cancelled']).default('upcoming'),
    created_by: z.string().uuid(),
    created_at: z.string().optional(),
    updated_at: z.string().optional(),
})

export const registrationSchema = z.object({
    id: z.string().uuid().optional(),
    event_id: z.string().uuid(),
    user_id: z.string().uuid(),
    bib_number: z.number().positive().optional(),
    finish_time: z.string().optional(),
    position: z.number().positive().optional(),
    registered_at: z.string().optional(),
})

export type Profile = z.infer<typeof profileSchema>
export type Event = z.infer<typeof eventSchema>
export type Registration = z.infer<typeof registrationSchema>