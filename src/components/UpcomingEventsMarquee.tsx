import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Megaphone } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface UpcomingEvent {
  id: string;
  title: string;
  event_date: string | null;
  event_time: string | null;
}

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  try {
    return new Date(iso + "T00:00:00").toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
};

const formatTime = (t: string | null) => {
  if (!t) return "";
  // t is "HH:MM" or "HH:MM:SS"
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  if (isNaN(hour)) return "";
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${m ?? "00"} ${ampm}`;
};

/**
 * UpcomingEventsMarquee — reads from the `event` table (singular).
 * Shows rows where event_date >= today, sorted ascending.
 * Falls back gracefully if event_date column is missing.
 */
const UpcomingEventsMarquee = () => {
  const [upcoming, setUpcoming] = useState<UpcomingEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      const today = new Date().toISOString().slice(0, 10);
      const { data, error } = await supabase
        .from("event" as never)
        .select("id, title, event_date, event_time")
        .gte("event_date", today)
        .order("event_date", { ascending: true });

      if (!active) return;
      if (error) {
        // If event_date column doesn't exist yet, just hide (no crash)
        console.warn("[UpcomingEventsMarquee] fetch error:", error.message);
        setUpcoming([]);
      } else {
        setUpcoming((data ?? []) as unknown as UpcomingEvent[]);
      }
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel("event-marquee")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "event" },
        () => load()
      )
      .subscribe();

    return () => {
      active = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <div
      className="w-full bg-[#F5F5F5] border-b border-border ssdc-marquee-pause"
      aria-label="Upcoming SSDC events"
    >
      <div className="flex items-stretch">
        <div className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 text-xs sm:text-sm font-semibold whitespace-nowrap shrink-0">
          <Megaphone className="h-4 w-4" aria-hidden="true" />
          <span>Upcoming Events</span>
        </div>

        <div className="relative flex-1 overflow-hidden">
          {loading ? (
            <div className="px-4 py-2 text-sm text-muted-foreground italic">
              Loading events…
            </div>
          ) : upcoming.length === 0 ? (
            <div className="px-4 py-2 text-sm text-muted-foreground italic">
              No upcoming SSDC events
            </div>
          ) : (
            <div className="flex w-max ssdc-marquee-track">
              {[0, 1].map((dup) => (
                <ul
                  key={dup}
                  className="flex items-center gap-8 px-6 py-2 shrink-0"
                  aria-hidden={dup === 1}
                >
                  {upcoming.map((ev) => (
                    <li key={`${dup}-${ev.id}`} className="flex items-center gap-2 text-sm">
                      <Link
                        to={`/events#${ev.id}`}
                        className="text-foreground hover:text-primary transition-colors font-medium"
                      >
                        {ev.title}
                      </Link>
                      <span className="text-muted-foreground">
                        – {formatDate(ev.event_date)}
                        {ev.event_time ? ` · ${formatTime(ev.event_time)}` : ""}
                      </span>
                      <span className="text-border" aria-hidden="true">|</span>
                    </li>
                  ))}
                </ul>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UpcomingEventsMarquee;
