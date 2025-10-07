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
  AuthContext: () => AuthContext,
  AuthProvider: () => AuthProvider,
  checkUserRole: () => checkUserRole,
  createEvent: () => createEvent,
  createSupabaseClient: () => createSupabaseClient,
  deleteEvent: () => deleteEvent,
  demoteAdminToUser: () => demoteAdminToUser,
  duplicateEvent: () => duplicateEvent,
  getAllEvents: () => getAllEvents,
  getAllUsers: () => getAllUsers,
  getUserProfile: () => getUserProfile,
  isAdminUser: () => isAdminUser,
  promoteUserToAdmin: () => promoteUserToAdmin,
  requireAdminAccess: () => requireAdminAccess,
  searchUsers: () => searchUsers,
  supabase: () => supabase,
  updateEvent: () => updateEvent,
  updateEventStatus: () => updateEventStatus,
  updateUserProfile: () => updateUserProfile,
  useAuth: () => useAuth
});
module.exports = __toCommonJS(index_exports);

// src/auth-provider.tsx
var import_react = require("react");

// src/utils.ts
var import_supabase_js = require("@supabase/supabase-js");
var createSupabaseClient = () => {
  return (0, import_supabase_js.createClient)(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
};
var supabase = createSupabaseClient();
var checkUserRole = async (userId) => {
  try {
    const { data: profile } = await supabase.from("profiles").select("role").eq("id", userId).single();
    return profile?.role || "user";
  } catch (error) {
    console.error("Error checking user role:", error);
    return "user";
  }
};
var isAdminUser = async (userId) => {
  const role = await checkUserRole(userId);
  return role === "admin";
};

// src/auth-provider.tsx
var import_jsx_runtime = require("react/jsx-runtime");
var AuthContext = (0, import_react.createContext)({
  user: null,
  session: null,
  loading: true,
  isAdmin: false,
  signOut: async () => {
  }
});
function AuthProvider({ children }) {
  const [user, setUser] = (0, import_react.useState)(null);
  const [session, setSession] = (0, import_react.useState)(null);
  const [loading, setLoading] = (0, import_react.useState)(true);
  const [isAdmin, setIsAdmin] = (0, import_react.useState)(false);
  (0, import_react.useEffect)(() => {
    supabase.auth.getSession().then(({ data: { session: session2 } }) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      checkAdminStatus(session2?.user ?? null);
      setLoading(false);
    });
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (_event, session2) => {
      setSession(session2);
      setUser(session2?.user ?? null);
      await checkAdminStatus(session2?.user ?? null);
      setLoading(false);
    });
    return () => subscription.unsubscribe();
  }, []);
  const checkAdminStatus = async (user2) => {
    if (!user2) {
      setIsAdmin(false);
      return;
    }
    try {
      const { data: profile } = await supabase.from("profiles").select("role").eq("id", user2.id).single();
      setIsAdmin(profile?.role === "admin");
    } catch (error) {
      console.error("Error checking admin status:", error);
      setIsAdmin(false);
    }
  };
  const signOut = async () => {
    await supabase.auth.signOut();
  };
  return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(
    AuthContext.Provider,
    {
      value: {
        user,
        session,
        loading,
        isAdmin,
        signOut
      },
      children
    }
  );
}
var useAuth = () => {
  const context = (0, import_react.useContext)(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

// src/role-management.ts
var getAllUsers = async () => {
  try {
    const { data, error } = await supabase.from("profiles").select("*").order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};
var promoteUserToAdmin = async (userId) => {
  try {
    const { data, error } = await supabase.from("profiles").update({ role: "admin" }).eq("id", userId).select().single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error promoting user to admin:", error);
    throw error;
  }
};
var demoteAdminToUser = async (userId) => {
  try {
    const { data, error } = await supabase.from("profiles").update({ role: "user" }).eq("id", userId).select().single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error demoting admin to user:", error);
    throw error;
  }
};
var getUserProfile = async (userId) => {
  try {
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error fetching user profile:", error);
    throw error;
  }
};
var updateUserProfile = async (userId, updates) => {
  try {
    const { data, error } = await supabase.from("profiles").update(updates).eq("id", userId).select().single();
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error updating user profile:", error);
    throw error;
  }
};
var requireAdminAccess = async (currentUserId) => {
  const profile = await getUserProfile(currentUserId);
  if (profile.role !== "admin") {
    throw new Error("Admin access required for this operation");
  }
  return profile;
};
var searchUsers = async (searchTerm) => {
  try {
    const { data, error } = await supabase.from("profiles").select(`
                *,
                email:auth.users!inner(email)
            `).or(`full_name.ilike.%${searchTerm}%,auth.users.email.ilike.%${searchTerm}%`).order("created_at", { ascending: false });
    if (error) {
      throw error;
    }
    return data;
  } catch (error) {
    console.error("Error searching users:", error);
    throw error;
  }
};

// src/event-operations.ts
var import_supabase_js2 = require("@supabase/supabase-js");
var supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
var supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
var supabase2 = (0, import_supabase_js2.createClient)(supabaseUrl, supabaseAnonKey);
async function createEvent(formData, userId) {
  try {
    const { data, error } = await supabase2.from("events").insert({
      name: formData.name,
      description: formData.description || null,
      event_date: formData.date,
      distance: formData.distance,
      location: formData.location || null,
      max_participants: formData.maxParticipants || null,
      status: formData.status || "upcoming",
      created_by: userId
    }).select().single();
    if (error) {
      console.error("Supabase error creating event:", error);
      return { success: false, error: error.message };
    }
    const eventData = {
      id: data.id,
      name: data.name,
      description: data.description || void 0,
      date: data.event_date,
      location: data.location || void 0,
      distance: data.distance,
      maxParticipants: data.max_participants || void 0,
      registeredCount: 0,
      // New events have 0 registrations
      status: data.status,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    return { success: true, data: eventData };
  } catch (error) {
    console.error("Error creating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
async function getAllEvents() {
  try {
    const { data: events, error } = await supabase2.from("events").select(`
        id,
        name,
        description,
        event_date,
        distance,
        location,
        max_participants,
        status,
        created_by,
        created_at,
        updated_at
      `).order("event_date", { ascending: true });
    if (error) {
      console.error("Supabase error fetching events:", error);
      return { success: false, error: error.message };
    }
    const eventIds = events?.map((event) => event.id) || [];
    const { data: registrations } = await supabase2.from("registrations").select("event_id").in("event_id", eventIds);
    const registrationCounts = registrations?.reduce((acc, reg) => {
      acc[reg.event_id] = (acc[reg.event_id] || 0) + 1;
      return acc;
    }, {}) || {};
    const eventData = events?.map((event) => ({
      id: event.id,
      name: event.name,
      description: event.description || void 0,
      date: event.event_date,
      location: event.location || void 0,
      distance: event.distance,
      maxParticipants: event.max_participants || void 0,
      registeredCount: registrationCounts[event.id] || 0,
      status: event.status,
      created_by: event.created_by,
      created_at: event.created_at,
      updated_at: event.updated_at
    })) || [];
    return { success: true, data: eventData };
  } catch (error) {
    console.error("Error fetching events:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
async function updateEvent(eventId, formData, userId) {
  try {
    const { data: existingEvent, error: checkError } = await supabase2.from("events").select("created_by").eq("id", eventId).single();
    if (checkError) {
      return { success: false, error: "Event not found" };
    }
    if (existingEvent.created_by !== userId) {
      return { success: false, error: "You can only edit events you created" };
    }
    const { data, error } = await supabase2.from("events").update({
      name: formData.name,
      description: formData.description || null,
      event_date: formData.date,
      distance: formData.distance,
      location: formData.location || null,
      max_participants: formData.maxParticipants || null,
      status: formData.status,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", eventId).select().single();
    if (error) {
      console.error("Supabase error updating event:", error);
      return { success: false, error: error.message };
    }
    const { data: registrations } = await supabase2.from("registrations").select("id").eq("event_id", eventId);
    const eventData = {
      id: data.id,
      name: data.name,
      description: data.description || void 0,
      date: data.event_date,
      location: data.location || void 0,
      distance: data.distance,
      maxParticipants: data.max_participants || void 0,
      registeredCount: registrations?.length || 0,
      status: data.status,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    return { success: true, data: eventData };
  } catch (error) {
    console.error("Error updating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
async function deleteEvent(eventId, userId) {
  try {
    const { data: existingEvent, error: checkError } = await supabase2.from("events").select("created_by, status").eq("id", eventId).single();
    if (checkError) {
      return { success: false, error: "Event not found" };
    }
    if (existingEvent.created_by !== userId) {
      return { success: false, error: "You can only delete events you created" };
    }
    const { data: registrations } = await supabase2.from("registrations").select("id").eq("event_id", eventId).limit(1);
    if (registrations && registrations.length > 0) {
      return { success: false, error: "Cannot delete events with existing registrations" };
    }
    const { error } = await supabase2.from("events").delete().eq("id", eventId);
    if (error) {
      console.error("Supabase error deleting event:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error("Error deleting event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
async function duplicateEvent(eventId, userId) {
  try {
    const { data: originalEvent, error: fetchError } = await supabase2.from("events").select("*").eq("id", eventId).single();
    if (fetchError) {
      return { success: false, error: "Original event not found" };
    }
    const newDate = new Date(originalEvent.event_date);
    newDate.setDate(newDate.getDate() + 7);
    const { data, error } = await supabase2.from("events").insert({
      name: `Copy of ${originalEvent.name}`,
      description: originalEvent.description,
      event_date: newDate.toISOString().split("T")[0],
      distance: originalEvent.distance,
      location: originalEvent.location,
      max_participants: originalEvent.max_participants,
      status: "upcoming",
      created_by: userId
    }).select().single();
    if (error) {
      console.error("Supabase error duplicating event:", error);
      return { success: false, error: error.message };
    }
    const eventData = {
      id: data.id,
      name: data.name,
      description: data.description || void 0,
      date: data.event_date,
      location: data.location || void 0,
      distance: data.distance,
      maxParticipants: data.max_participants || void 0,
      registeredCount: 0,
      status: data.status,
      created_by: data.created_by,
      created_at: data.created_at,
      updated_at: data.updated_at
    };
    return { success: true, data: eventData };
  } catch (error) {
    console.error("Error duplicating event:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
async function updateEventStatus(eventId, status, userId) {
  try {
    const { data: existingEvent, error: checkError } = await supabase2.from("events").select("created_by").eq("id", eventId).single();
    if (checkError) {
      return { success: false, error: "Event not found" };
    }
    if (existingEvent.created_by !== userId) {
      return { success: false, error: "You can only modify events you created" };
    }
    const { error } = await supabase2.from("events").update({
      status,
      updated_at: (/* @__PURE__ */ new Date()).toISOString()
    }).eq("id", eventId);
    if (error) {
      console.error("Supabase error updating event status:", error);
      return { success: false, error: error.message };
    }
    return { success: true };
  } catch (error) {
    console.error("Error updating event status:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "An unexpected error occurred"
    };
  }
}
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  AuthContext,
  AuthProvider,
  checkUserRole,
  createEvent,
  createSupabaseClient,
  deleteEvent,
  demoteAdminToUser,
  duplicateEvent,
  getAllEvents,
  getAllUsers,
  getUserProfile,
  isAdminUser,
  promoteUserToAdmin,
  requireAdminAccess,
  searchUsers,
  supabase,
  updateEvent,
  updateEventStatus,
  updateUserProfile,
  useAuth
});
