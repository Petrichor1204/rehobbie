// lib/supabase.ts
// ─────────────────────────────────────────────────────────────────────────────
// Supabase client + anonymous session helpers (Step 6).
//
// No login is required: on first load we sign the visitor in anonymously so we
// can persist their journey to a `sessions` table without ever blocking on
// sign-up. Everything here is a no-op when the env vars are missing, so the app
// runs fine locally without Supabase configured.
//
// Expected `sessions` table (SQL):
//   create table sessions (
//     id uuid primary key default gen_random_uuid(),
//     user_id uuid references auth.users (id),
//     selected_hobbies text[] not null default '{}',
//     favorite_hobby text,
//     stop_reasons text[] not null default '{}',
//     wants_to_resume boolean,
//     skill_level text,
//     created_at timestamptz not null default now()
//   );
// ─────────────────────────────────────────────────────────────────────────────

import { createBrowserClient } from "@supabase/ssr";
import type { Session, SupabaseClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(url && anonKey);

export const supabase: SupabaseClient | null = isSupabaseConfigured
  ? createBrowserClient(url!, anonKey!)
  : null;

/** Ensure an anonymous auth session exists; returns it (or null if disabled). */
export async function ensureAnonSession(): Promise<Session | null> {
  if (!supabase) return null;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (session) return session;

    const { data, error } = await supabase.auth.signInAnonymously();
    if (error) {
      console.warn("[supabase] anonymous sign-in failed:", error.message);
      return null;
    }
    return data.session;
  } catch (err) {
    console.warn("[supabase] ensureAnonSession error:", err);
    return null;
  }
}

export type SessionRecord = {
  selected_hobbies: string[];
  favorite_hobby: string | null;
  stop_reasons: string[];
  wants_to_resume: boolean;
  skill_level?: string | null;
};

/** Persist a completed onboarding journey. Safe no-op when Supabase is off. */
export async function saveSession(record: SessionRecord): Promise<void> {
  if (!supabase) return;
  try {
    const session = await ensureAnonSession();
    const { error } = await supabase
      .from("sessions")
      .insert({ ...record, user_id: session?.user?.id ?? null });
    if (error) console.warn("[supabase] saveSession failed:", error.message);
  } catch (err) {
    console.warn("[supabase] saveSession error:", err);
  }
}
