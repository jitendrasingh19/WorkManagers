import { supabase } from "@/lib/supabaseClient";

// ─── Types ────────────────────────────────────────────────────────────────────

export type TrainerStatus = "active" | "inactive" | "on_leave";

export type Trainer = {
  id: string;
  name: string;
  email: string;
  phone: string;
  photo_url: string | null;
  specializations: string[];
  experience: number;
  certifications: string[];
  assigned_clients: number;
  sessions_completed: number;
  rating: number | null;
  status: TrainerStatus;
  joined_at: string;
  created_at: string;
};

export type TrainerFilters = {
  q?: string;
  status?: string;
  spec?: string;
  sort?: string;
};

export type TrainerStats = {
  total: number;
  active: number;
  on_leave: number;
  avg_rating: number | null;
  total_sessions: number;
};

// ─── Specializations list ─────────────────────────────────────────────────────

export const ALL_SPECIALIZATIONS = [
  "Strength",
  "CrossFit",
  "Yoga",
  "Pilates",
  "Cardio",
  "HIIT",
  "Zumba",
  "Dance Fitness",
  "Powerlifting",
  "Nutrition",
  "Aerobics",
  "Senior Fitness",
];

// ─── Fetch all trainers with filters ─────────────────────────────────────────

export async function getTrainers(filters: TrainerFilters = {}): Promise<Trainer[]> {
  let query = supabase.from("trainers").select("*");

  if (filters.status && ["active", "inactive", "on_leave"].includes(filters.status)) {
    query = query.eq("status", filters.status);
  }

  if (filters.spec) {
    query = query.contains("specializations", [filters.spec]);
  }

  if (filters.q) {
    query = query.or(`name.ilike.%${filters.q}%,email.ilike.%${filters.q}%`);
  }

  switch (filters.sort) {
    case "rating":
      query = query.order("rating", { ascending: false, nullsFirst: false });
      break;
    case "sessions":
      query = query.order("sessions_completed", { ascending: false });
      break;
    case "clients":
      query = query.order("assigned_clients", { ascending: false });
      break;
    case "joined":
      query = query.order("joined_at", { ascending: false });
      break;
    default:
      query = query.order("name", { ascending: true });
  }

  const { data, error } = await query;

  if (error) {
    console.error("getTrainers error:", error.message);
    return [];
  }

  return (data ?? []) as Trainer[];
}

// ─── Fetch single trainer by ID ───────────────────────────────────────────────

export async function getTrainerById(id: string): Promise<Trainer | null> {
  const { data, error } = await supabase
    .from("trainers")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("getTrainerById error:", error.message);
    return null;
  }

  return data as Trainer;
}

// ─── Trainer stats ────────────────────────────────────────────────────────────

export async function getTrainerStats(): Promise<TrainerStats> {
  const { data, error } = await supabase
    .from("trainers")
    .select("status, rating, sessions_completed");

  if (error || !data) {
    return { total: 0, active: 0, on_leave: 0, avg_rating: null, total_sessions: 0 };
  }

  const total = data.length;
  const active = data.filter((t) => t.status === "active").length;
  const on_leave = data.filter((t) => t.status === "on_leave").length;
  const rated = data.filter((t) => t.rating !== null);
  const avg_rating =
    rated.length > 0
      ? rated.reduce((sum, t) => sum + t.rating, 0) / rated.length
      : null;
  const total_sessions = data.reduce(
    (sum, t) => sum + (t.sessions_completed ?? 0),
    0
  );

  return { total, active, on_leave, avg_rating, total_sessions };
}