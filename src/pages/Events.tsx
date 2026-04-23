import { useEffect, useState } from "react";
import Section from "@/components/Section";
import SectionHeader from "@/components/SectionHeader";
import Reveal from "@/components/Reveal";
import PageHero from "@/components/PageHero";
import pdfIotWorkshop from "@/assets/pdf-iot-workshop.jpg";
import { supabase } from "@/integrations/supabase/client";

interface EventItem {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  event_date: string | null;
  event_time: string | null;
  created_at: string;
}

const formatDate = (iso: string | null) => {
  if (!iso) return "";
  try {
    const d = iso.length === 10 ? new Date(iso + "T00:00:00") : new Date(iso);
    return d.toLocaleDateString("en-IN", {
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
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  if (isNaN(hour)) return "";
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${h12}:${m ?? "00"} ${ampm}`;
};

const objectives = [
  "Provide hands-on training in emerging technologies",
  "Enhance practical understanding of engineering concepts",
  "Expose students to real-time industrial applications",
  "Encourage innovation and technical thinking",
  "Improve industry readiness and professional skills",
];

const categories = {
  workshops: ["Industrial Automation with PLC & SCADA", "IoT and Sensor-based Applications", "Design Thinking and Innovation", "Optimizing Industrial Processes: Hands-on SCADA Workshop"],
  talks: ["Industrial Automation and Career Opportunities", "Entrepreneurship for Economic Empowerment (EAP) with CITD, Hyderabad", "Energy Conservation and Sustainability", "Problem-Solution Fit & Product Market Fit"],
  industry: ["Industry Visit to Olectra Greentech Ltd's Electric Manufacturing Unit", "Interaction with industry professionals", "Exposure to real-time systems and processes"],
};

const timeline = [
  {
    period: "2018 – 2020",
    events: [
      "Industrial Automation with PLC & SCADA (31-08-2018 to 01-09-2018)",
      "Industrial Automation with PLC (13-02-2020 to 15-02-2020)",
    ],
  },
  {
    period: "2020 – 2022",
    events: [
      "Industrial Automation with Various Controllers (03-04-2021)",
      "Electrical Vehicles – Your Opportunity to Grow (16-06-2021)",
      "Industrial Automation with PLC & SCADA (30-11-2021)",
      "Hands-on Session on PLC Programming & SCADA (28-12-2021)",
    ],
  },
  {
    period: "2022 – 2023",
    events: [
      "National Energy Conservation Day (14-12-2022)",
      "Design Thinking Workshop (02-01-2023)",
      "Real Time Applications of Sensors with IoT (31-03-2023 to 01-04-2023)",
      "Remote Labs under IEEE (24-04-2023)",
    ],
  },
  {
    period: "2023 – 2024",
    events: [
      "Awareness Session on How to Prevent Pollution (02-12-2023)",
      "Awareness Session on Energy Conservation Day (14-12-2023)",
      "Guest Lecture on Industrial Automation and Career Opportunities (03-01-2024)",
      "Workshop on IoT: Build Your Own Smart World with Arduino (10-01-2024)",
      "Two-Day Workshop on Optimizing Industrial Process: Hands-on SCADA (31-05-2024 to 01-06-2024)",
    ],
  },
  {
    period: "2024 – 2026",
    events: [
      "Industry Visit to Olectra Greentech Ltd Electric Manufacturing Unit (02-08-2024)",
      "FDP on Sustainable Futures: Green Building and Energy Management (03-10-2024 to 05-10-2024)",
      "Awareness on Energy Conservation (14-12-2024)",
      "Lecture on Problem-Solution Fit & Product Market Fit (30-12-2024)",
      "Lecture on Entrepreneurship for Economic Empowerment (EAP) (11-10-2025)",
      "Training Program on Industrial Automation with PLC & SCADA (04-03-2026)",
    ],
  },
];

const highlights = [
  "Hands-on exposure to PLC, SCADA, and IoT systems",
  "Interaction with industry experts and professionals",
  "Practical understanding of automation and control systems",
  "Opportunities to work on real-time applications",
  "Development of technical and analytical skills",
];

const plannedActivities = [
  { activity: "Training on Arduino Interfacing, PLC, Python", outcome: "Students acquire comprehensive knowledge and practical abilities in critical industry skills." },
  { activity: "Guest Lectures by Industry Professionals", outcome: "Students gain insights into emerging technologies and career paths in EEE." },
  { activity: "Workshops on IoT, Industrial Automation", outcome: "Students acquire practical skills and hands-on experience with industry-relevant software and hardware." },
  { activity: "Student-Led Tech Talks", outcome: "Students enhance understanding of recent advancements and develop communication skills." },
  { activity: "Semester-Long Skill-Based Projects", outcome: "Students apply learned skills to solve real-world engineering problems." },
  { activity: "Industry Visits", outcome: "Students gain exposure to practical applications of the technologies learned." },
  { activity: "Internal & Inter-Collegiate Competitions", outcome: "Students showcase acquired skills and gain competitive experience." },
  { activity: "Mentorship Program", outcome: "Senior students provide guidance, promoting knowledge sharing." },
  { activity: "Attending International Conferences", outcome: "Students gain exposure to cutting-edge research and network with professionals." },
];

const Events = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    const load = async () => {
      // Try with event_date + event_time. If those columns are missing,
      // fall back to a basic select so the page never crashes.
      let { data, error } = await supabase
        .from("event" as never)
        .select("id, title, description, image_url, event_date, event_time, created_at")
        .order("event_date", { ascending: false, nullsFirst: false });

      if (error) {
        console.warn("[Events] event_date select failed, falling back:", error.message);
        const fallback = await supabase
          .from("event" as never)
          .select("id, title, description, image_url, created_at")
          .order("created_at", { ascending: false });
        data = fallback.data as never;
        error = fallback.error;
      }

      if (!active) return;
      if (!error && data) setEvents(data as unknown as EventItem[]);
      setLoading(false);
    };

    load();

    const channel = supabase
      .channel("event-public-grid")
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
    <>
      <PageHero
        title="Technical Events, Workshops and Industry Engagement"
        subtitle="The SSDC regularly organizes technical events, workshops, and industry interaction programs."
        bgImage={pdfIotWorkshop}
      />

      {/* Events from Supabase `event` table */}
      <Section>
        <SectionHeader title="Recent Events" />
        {loading ? (
          <p className="text-sm text-muted-foreground italic mb-8">Loading events…</p>
        ) : events.length === 0 ? (
          <p className="text-sm text-muted-foreground italic mb-8">No events available yet.</p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-10">
            {events.map((ev, i) => (
              <Reveal key={ev.id} delay={i * 0.05}>
                <div id={ev.id} className="border rounded-sm overflow-hidden bg-background h-full flex flex-col scroll-mt-24">
                  {ev.image_url ? (
                    <img
                      src={ev.image_url}
                      alt={ev.title}
                      loading="lazy"
                      className="w-full h-44 object-cover"
                    />
                  ) : (
                    <div className="w-full h-44 bg-secondary flex items-center justify-center text-xs text-muted-foreground">
                      No image
                    </div>
                  )}
                  <div className="p-3 flex-1 flex flex-col">
                    <h3 className="text-sm font-bold text-foreground">{ev.title}</h3>
                    {ev.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-3">
                        {ev.description}
                      </p>
                    )}
                    <p className="text-[11px] text-foreground/60 mt-2">
                      {ev.event_date
                        ? `${formatDate(ev.event_date)}${ev.event_time ? ` · ${formatTime(ev.event_time)}` : ""}`
                        : formatDate(ev.created_at)}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <SectionHeader title="Objectives of Events and Workshops" />
        <ul className="space-y-2 max-w-3xl">
          {objectives.map((o, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <li className="flex gap-2 items-start text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{o}
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Categories */}
      <Section alt>
        <SectionHeader title="Categories of Activities" />
        <div className="grid gap-4 md:grid-cols-3 max-w-3xl">
          <Reveal>
            <div className="border rounded-sm p-5 bg-background h-full">
              <h3 className="text-sm font-bold text-foreground mb-3">Workshops</h3>
              <ul className="space-y-1.5">
                {categories.workshops.map((w, i) => (
                  <li key={i} className="flex gap-2 items-start text-xs text-muted-foreground">
                    <span className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0" />{w}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.06}>
            <div className="border rounded-sm p-5 bg-background h-full">
              <h3 className="text-sm font-bold text-foreground mb-3">Technical Talks & Guest Lectures</h3>
              <ul className="space-y-1.5">
                {categories.talks.map((t, i) => (
                  <li key={i} className="flex gap-2 items-start text-xs text-muted-foreground">
                    <span className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0" />{t}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
          <Reveal delay={0.12}>
            <div className="border rounded-sm p-5 bg-background h-full">
              <h3 className="text-sm font-bold text-foreground mb-3">Industry Exposure</h3>
              <ul className="space-y-1.5">
                {categories.industry.map((ind, i) => (
                  <li key={i} className="flex gap-2 items-start text-xs text-muted-foreground">
                    <span className="mt-1 h-1 w-1 rounded-full bg-primary shrink-0" />{ind}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        </div>
      </Section>

      {/* Timeline */}
      <Section>
        <SectionHeader title="Timeline of Events and Activities" />
        <div className="max-w-3xl">
          <div className="relative pl-6 border-l-2 border-border space-y-8">
            {timeline.map((t, i) => (
              <Reveal key={t.period} delay={i * 0.06}>
                <div className="relative">
                  <div className="absolute -left-[31px] top-1 h-3 w-3 rounded-full bg-primary border-2 border-background" />
                  <div className="text-sm font-bold text-primary mb-2">{t.period}</div>
                  <ul className="space-y-1.5">
                    {t.events.map((e, j) => (
                      <li key={j} className="flex gap-2 items-start text-sm text-muted-foreground">
                        <span className="mt-1.5 h-1 w-1 rounded-full bg-foreground/40 shrink-0" />{e}
                      </li>
                    ))}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </Section>

      {/* Key Highlights */}
      <Section alt>
        <SectionHeader title="Key Highlights" />
        <ul className="space-y-2 max-w-3xl">
          {highlights.map((h, i) => (
            <Reveal key={i} delay={i * 0.04}>
              <li className="flex gap-2 items-start text-sm text-muted-foreground">
                <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />{h}
              </li>
            </Reveal>
          ))}
        </ul>
      </Section>

      {/* Planned Activities */}
      <Section>
        <SectionHeader title="Planned Activities for 2026–2027" />
        <div className="max-w-3xl overflow-x-auto">
          <table className="w-full text-sm border">
            <thead>
              <tr className="bg-primary text-primary-foreground">
                <th className="text-left p-3 font-medium">Activity</th>
                <th className="text-left p-3 font-medium">Expected Outcome</th>
              </tr>
            </thead>
            <tbody>
              {plannedActivities.map((p, i) => (
                <tr key={i} className={i % 2 === 0 ? "bg-background" : "bg-secondary"}>
                  <td className="p-3 text-foreground font-medium border-t">{p.activity}</td>
                  <td className="p-3 text-muted-foreground border-t">{p.outcome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Section>

      {/* CTA */}
      <section className="bg-[hsl(var(--primary-dark))] text-primary-foreground">
        <div className="container py-10">
          <Reveal>
            <h2 className="text-xl font-bold mb-4">Explore Full SSDC Report</h2>
            <a href="/ssdc_report.pdf" download className="inline-flex items-center gap-1.5 rounded-sm border border-primary-foreground/40 px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary-foreground/10 transition-colors">
              Download PDF →
            </a>
          </Reveal>
        </div>
      </section>
    </>
  );
};

export default Events;
