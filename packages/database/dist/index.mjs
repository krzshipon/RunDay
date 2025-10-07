// src/client.ts
import { createClient } from "@supabase/supabase-js";
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please check your .env.local file.");
}
var supabase = createClient(supabaseUrl, supabaseAnonKey);
function createSupabaseClient(url, anonKey) {
  return createClient(
    url || supabaseUrl,
    anonKey || supabaseAnonKey
  );
}

// src/schemas.ts
import { z } from "zod";
var profileSchema = z.object({
  id: z.string().uuid(),
  full_name: z.string().min(2, "Full name must be at least 2 characters"),
  role: z.enum(["admin", "user"]).default("user"),
  created_at: z.string(),
  updated_at: z.string()
});
var eventSchema = z.object({
  id: z.string().uuid().optional(),
  name: z.string().min(3, "Event name must be at least 3 characters"),
  description: z.string().optional(),
  event_date: z.string(),
  distance: z.string().min(1, "Distance is required"),
  location: z.string().optional(),
  max_participants: z.number().positive().optional(),
  status: z.enum(["upcoming", "completed", "cancelled"]).default("upcoming"),
  created_by: z.string().uuid(),
  created_at: z.string().optional(),
  updated_at: z.string().optional()
});
var registrationSchema = z.object({
  id: z.string().uuid().optional(),
  event_id: z.string().uuid(),
  user_id: z.string().uuid(),
  bib_number: z.number().positive().optional(),
  finish_time: z.string().optional(),
  position: z.number().positive().optional(),
  registered_at: z.string().optional()
});

// src/events.ts
async function createEvent(eventData, userId) {
  try {
    const insertData = {
      name: eventData.name,
      description: eventData.description || null,
      event_date: eventData.date,
      distance: eventData.distance,
      location: eventData.location || null,
      max_participants: eventData.maxParticipants || null,
      status: eventData.status || "upcoming",
      created_by: userId
    };
    const { data, error } = await supabase.from("events").insert(insertData).select().single();
    if (error) {
      console.error("Error creating event:", error);
      throw new Error(`Failed to create event: ${error.message}`);
    }
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error creating event:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
async function getEvents(filters) {
  try {
    let query = supabase.from("events").select(`
        *,
        registrations(count)
      `).order("event_date", { ascending: true });
    if (filters?.status) {
      query = query.eq("status", filters.status);
    }
    if (filters?.createdBy) {
      query = query.eq("created_by", filters.createdBy);
    }
    const { data, error } = await query;
    if (error) {
      console.error("Error fetching events:", error);
      throw new Error(`Failed to fetch events: ${error.message}`);
    }
    const eventsWithCount = data?.map((event) => ({
      ...event,
      registeredCount: event.registrations?.[0]?.count || 0
    })) || [];
    return { data: eventsWithCount, error: null };
  } catch (error) {
    console.error("Unexpected error fetching events:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
async function getEventById(eventId) {
  try {
    const { data, error } = await supabase.from("events").select(`
        *,
        registrations(count)
      `).eq("id", eventId).single();
    if (error) {
      console.error("Error fetching event:", error);
      throw new Error(`Failed to fetch event: ${error.message}`);
    }
    const eventWithCount = {
      ...data,
      registeredCount: data.registrations?.[0]?.count || 0
    };
    return { data: eventWithCount, error: null };
  } catch (error) {
    console.error("Unexpected error fetching event:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
async function updateEvent(eventId, eventData, userId) {
  try {
    const { data: event, error: fetchError } = await supabase.from("events").select("created_by").eq("id", eventId).single();
    if (fetchError) {
      throw new Error(`Event not found: ${fetchError.message}`);
    }
    if (event.created_by !== userId) {
      throw new Error("You can only edit events you created");
    }
    const updateData = {};
    if (eventData.name !== void 0) updateData.name = eventData.name;
    if (eventData.description !== void 0) updateData.description = eventData.description || null;
    if (eventData.date !== void 0) updateData.event_date = eventData.date;
    if (eventData.distance !== void 0) updateData.distance = eventData.distance;
    if (eventData.location !== void 0) updateData.location = eventData.location || null;
    if (eventData.maxParticipants !== void 0) updateData.max_participants = eventData.maxParticipants || null;
    if (eventData.status !== void 0) updateData.status = eventData.status;
    updateData.updated_at = (/* @__PURE__ */ new Date()).toISOString();
    const { data, error } = await supabase.from("events").update(updateData).eq("id", eventId).select().single();
    if (error) {
      console.error("Error updating event:", error);
      throw new Error(`Failed to update event: ${error.message}`);
    }
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error updating event:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
async function deleteEvent(eventId, userId) {
  try {
    const { data: event, error: fetchError } = await supabase.from("events").select("created_by, status").eq("id", eventId).single();
    if (fetchError) {
      throw new Error(`Event not found: ${fetchError.message}`);
    }
    if (event.created_by !== userId) {
      throw new Error("You can only delete events you created");
    }
    if (event.status === "completed") {
      const { data: registrations } = await supabase.from("registrations").select("id").eq("event_id", eventId).limit(1);
      if (registrations && registrations.length > 0) {
        throw new Error("Cannot delete completed events with registrations");
      }
    }
    const { error } = await supabase.from("events").delete().eq("id", eventId);
    if (error) {
      console.error("Error deleting event:", error);
      throw new Error(`Failed to delete event: ${error.message}`);
    }
    return { error: null };
  } catch (error) {
    console.error("Unexpected error deleting event:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
async function duplicateEvent(eventId, userId) {
  try {
    const { data: originalEvent, error: fetchError } = await supabase.from("events").select("*").eq("id", eventId).single();
    if (fetchError) {
      throw new Error(`Original event not found: ${fetchError.message}`);
    }
    const newEventDate = new Date(originalEvent.event_date);
    newEventDate.setDate(newEventDate.getDate() + 7);
    const duplicateData = {
      name: `Copy of ${originalEvent.name}`,
      description: originalEvent.description,
      event_date: newEventDate.toISOString().split("T")[0],
      // Format as YYYY-MM-DD
      distance: originalEvent.distance,
      location: originalEvent.location,
      max_participants: originalEvent.max_participants,
      status: "upcoming",
      // Always set duplicated events as upcoming
      created_by: userId
    };
    const { data, error } = await supabase.from("events").insert(duplicateData).select().single();
    if (error) {
      console.error("Error duplicating event:", error);
      throw new Error(`Failed to duplicate event: ${error.message}`);
    }
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error duplicating event:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
async function updateEventStatus(eventId, status, userId) {
  try {
    const { data: event, error: fetchError } = await supabase.from("events").select("created_by").eq("id", eventId).single();
    if (fetchError) {
      throw new Error(`Event not found: ${fetchError.message}`);
    }
    if (event.created_by !== userId) {
      throw new Error("You can only modify events you created");
    }
    const { data, error } = await supabase.from("events").update({
      status,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", eventId).select().single();
    if (error) {
      console.error("Error updating event status:", error);
      throw new Error(`Failed to update event status: ${error.message}`);
    }
    return { data, error: null };
  } catch (error) {
    console.error("Unexpected error updating event status:", error);
    return {
      data: null,
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}
export {
  createEvent,
  createSupabaseClient,
  deleteEvent,
  duplicateEvent,
  eventSchema,
  getEventById,
  getEvents,
  profileSchema,
  registrationSchema,
  supabase,
  updateEvent,
  updateEventStatus
};
