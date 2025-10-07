"use strict";
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var index_exports = {};
__export(index_exports, {
  createEvent: () => createEvent,
  createSupabaseClient: () => createSupabaseClient,
  deleteEvent: () => deleteEvent,
  duplicateEvent: () => duplicateEvent,
  eventSchema: () => eventSchema,
  getEventById: () => getEventById,
  getEvents: () => getEvents,
  profileSchema: () => profileSchema,
  registrationSchema: () => registrationSchema,
  supabase: () => supabase,
  updateEvent: () => updateEvent,
  updateEventStatus: () => updateEventStatus
});
module.exports = __toCommonJS(index_exports);

// src/client.ts
var import_supabase_js = require("@supabase/supabase-js");
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Please check your .env.local file.");
}
var supabase = (0, import_supabase_js.createClient)(supabaseUrl, supabaseAnonKey);
function createSupabaseClient(url, anonKey) {
  return (0, import_supabase_js.createClient)(
    url || supabaseUrl,
    anonKey || supabaseAnonKey
  );
}

// src/schemas.ts
var import_zod = require("zod");
var profileSchema = import_zod.z.object({
  id: import_zod.z.string().uuid(),
  full_name: import_zod.z.string().min(2, "Full name must be at least 2 characters"),
  role: import_zod.z.enum(["admin", "user"]).default("user"),
  created_at: import_zod.z.string(),
  updated_at: import_zod.z.string()
});
var eventSchema = import_zod.z.object({
  id: import_zod.z.string().uuid().optional(),
  name: import_zod.z.string().min(3, "Event name must be at least 3 characters"),
  description: import_zod.z.string().optional(),
  event_date: import_zod.z.string(),
  distance: import_zod.z.string().min(1, "Distance is required"),
  location: import_zod.z.string().optional(),
  max_participants: import_zod.z.number().positive().optional(),
  status: import_zod.z.enum(["upcoming", "completed", "cancelled"]).default("upcoming"),
  created_by: import_zod.z.string().uuid(),
  created_at: import_zod.z.string().optional(),
  updated_at: import_zod.z.string().optional()
});
var registrationSchema = import_zod.z.object({
  id: import_zod.z.string().uuid().optional(),
  event_id: import_zod.z.string().uuid(),
  user_id: import_zod.z.string().uuid(),
  bib_number: import_zod.z.number().positive().optional(),
  finish_time: import_zod.z.string().optional(),
  position: import_zod.z.number().positive().optional(),
  registered_at: import_zod.z.string().optional()
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
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
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
});
