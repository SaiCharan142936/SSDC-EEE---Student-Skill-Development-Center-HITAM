// Supabase browser client
import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

const SUPABASE_URL =
  (import.meta.env.VITE_SUPABASE_URL as string | undefined) ||
  "https://vlrzurflejoqqjuiuuzx.supabase.co";
const SUPABASE_PUBLISHABLE_KEY =
  (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined) ||
  "sb_publishable_dJ0TXd2qZCkW5Qtx979AuQ_baDWsyxU";

if (!SUPABASE_URL || !SUPABASE_PUBLISHABLE_KEY) {
  // eslint-disable-next-line no-console
  console.error("[Supabase] Missing URL or anon key.");
}

// eslint-disable-next-line no-console
console.log("[Supabase] URL:", SUPABASE_URL);
// eslint-disable-next-line no-console
console.log("[Supabase] Anon key loaded:", Boolean(SUPABASE_PUBLISHABLE_KEY));

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      storage: typeof window !== "undefined" ? localStorage : undefined,
      persistSession: true,
      autoRefreshToken: true,
    },
  }
);
