import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export interface DbEvent {
  id: string;
  title: string;
  event_date: string; // ISO yyyy-mm-dd
  description: string | null;
  category: string;
  created_at: string;
}

export function formatDisplayDate(iso: string): string {
  try {
    const d = new Date(iso + "T00:00:00");
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

interface UseEventsOptions {
  upcomingOnly?: boolean;
  limit?: number;
}

export function useEvents(opts: UseEventsOptions = {}) {
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    const load = async () => {
      setLoading(true);
      setError(null);

      let query = supabase
        .from("events")
        .select("*")
        .eq("category", "SSDC");

      if (opts.upcomingOnly) {
        const today = new Date().toISOString().slice(0, 10);
        query = query.gte("event_date", today).order("event_date", { ascending: true });
      } else {
        query = query.order("event_date", { ascending: false });
      }

      if (opts.limit) query = query.limit(opts.limit);

      const { data, error: err } = await query;
      if (!active) return;

      if (err) {
        setError(err.message);
        setEvents([]);
      } else {
        setEvents((data ?? []) as DbEvent[]);
      }
      setLoading(false);
    };

    load();

    // Realtime: refetch whenever events table changes
    const channel = supabase
      .channel(`events-hook-${opts.upcomingOnly ? "upcoming" : "all"}-${opts.limit ?? "all"}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "events" },
        () => load()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, [opts.upcomingOnly, opts.limit]);

  return { events, loading, error };
}
