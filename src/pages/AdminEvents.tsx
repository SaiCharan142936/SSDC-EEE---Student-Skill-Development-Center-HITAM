import { useState, useEffect, useCallback, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Pencil,
  Trash2,
  LogOut,
  Calendar as CalendarIcon,
  X,
  ArrowLeft,
  Search,
  Image as ImageIcon,
  LayoutDashboard,
  Sparkles,
} from "lucide-react";
import { z } from "zod";
import { formatDisplayDate, type DbEvent } from "@/hooks/useEvents";
import { useAuth } from "@/hooks/useAuth";

const eventSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  event_date: z.string().min(1, "Date is required"),
  description: z.string().max(2000).optional().or(z.literal("")),
  category: z.string().trim().min(1, "Category is required").max(50),
});

type FormState = z.infer<typeof eventSchema>;

const EMPTY: FormState = {
  title: "",
  event_date: "",
  description: "",
  category: "SSDC",
};

const CATEGORY_SUGGESTIONS = ["SSDC", "Workshop", "Seminar", "Expo", "Visit"];

const AdminEvents = () => {
  const navigate = useNavigate();
  const { session, user, loading: authLoading } = useAuth();
  const [events, setEvents] = useState<DbEvent[]>([]);
  const [loading, setLoading] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<FormState>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const userEmail = user?.email ?? null;

  const loadEvents = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("events")
      .select("id, title, event_date, description, category, created_at")
      .order("event_date", { ascending: false });

    if (error) {
      console.error("[AdminEvents] Failed to load events:", error);
      toast.error(error.message);
      setEvents([]);
    } else {
      setEvents((data ?? []) as DbEvent[]);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!session || !user) {
      navigate("/login", { replace: true });
      return;
    }
    void loadEvents();
  }, [authLoading, session, user, navigate, loadEvents]);

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    const upcoming = events.filter((e) => e.event_date >= today).length;
    const past = events.length - upcoming;
    const categories = new Set(events.map((e) => e.category)).size;
    return { total: events.length, upcoming, past, categories };
  }, [events]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.title.toLowerCase().includes(q) ||
        e.category.toLowerCase().includes(q) ||
        (e.description ?? "").toLowerCase().includes(q),
    );
  }, [events, search]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  const startCreate = () => {
    setEditingId(null);
    setForm(EMPTY);
    setErrors({});
    setShowForm(true);
  };

  const startEdit = (ev: DbEvent) => {
    setEditingId(ev.id);
    setForm({
      title: ev.title,
      event_date: ev.event_date,
      description: ev.description ?? "",
      category: ev.category,
    });
    setErrors({});
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = eventSchema.safeParse(form);
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0] as string;
        if (!fe[k]) fe[k] = i.message;
      });
      setErrors(fe);
      return;
    }

    if (!user) {
      toast.error("Please sign in.");
      navigate("/login", { replace: true });
      return;
    }

    setSaving(true);
    const payload = {
      title: result.data.title,
      event_date: result.data.event_date,
      description: result.data.description || null,
      category: result.data.category,
    };

    try {
      if (editingId) {
        const { data, error } = await supabase
          .from("events")
          .update(payload)
          .eq("id", editingId)
          .select()
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setEvents((prev) =>
            prev.map((eventItem) =>
              eventItem.id === editingId ? (data as DbEvent) : eventItem,
            ),
          );
          toast.success("Event updated");
        }
      } else {
        const { data, error } = await supabase
          .from("events")
          .insert({ ...payload, created_by: user.id })
          .select()
          .maybeSingle();

        if (error) throw error;
        if (data) {
          setEvents((prev) =>
            [data as DbEvent, ...prev].sort((a, b) =>
              a.event_date < b.event_date ? 1 : -1,
            ),
          );
          toast.success("Event added successfully");
        }
      }

      setShowForm(false);
      setEditingId(null);
      setForm(EMPTY);
    } catch (err: any) {
      console.error("[AdminEvents] Save failed:", err);
      toast.error(err?.message ?? "Failed to save event");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Delete this event? This action cannot be undone."))
      return;

    setDeletingId(id);
    try {
      const { error } = await supabase.from("events").delete().eq("id", id);
      if (error) throw error;
      setEvents((prev) => prev.filter((e) => e.id !== id));
      toast.success("Event deleted");
    } catch (err: any) {
      console.error("[AdminEvents] Delete failed:", err);
      toast.error(err?.message ?? "Failed to delete event");
    } finally {
      setDeletingId(null);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-secondary">
        <Loader2 className="h-6 w-6 text-primary animate-spin" />
      </div>
    );
  }

  if (!session || !user) {
    return null;
  }

  const today = new Date().toISOString().slice(0, 10);

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/60">
      {/* Top bar */}
      <header className="sticky top-0 z-30 backdrop-blur-md bg-background/80 border-b">
        <div className="container flex items-center justify-between h-14">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="text-xs text-muted-foreground hover:text-foreground inline-flex items-center gap-1 transition-colors"
            >
              <ArrowLeft className="h-3 w-3" /> Back to site
            </Link>
            <span className="text-xs text-muted-foreground">/</span>
            <div className="inline-flex items-center gap-1.5">
              <LayoutDashboard className="h-3.5 w-3.5 text-primary" />
              <h1 className="text-sm font-bold text-foreground">
                Admin Console
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <nav className="hidden sm:flex items-center gap-1 mr-2 p-1 bg-secondary rounded-md">
              <span className="px-3 py-1 text-xs font-medium bg-background text-foreground rounded-sm shadow-sm">
                Events
              </span>
              <Link
                to="/admin/gallery"
                className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded-sm transition-colors"
              >
                Gallery
              </Link>
              <Link
                to="/admin/event-manager"
                className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded-sm transition-colors"
              >
                Event Manager
              </Link>
              <Link
                to="/admin/project-manager"
                className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded-sm transition-colors"
              >
                Projects
              </Link>
            </nav>
            <span className="hidden md:inline text-[10px] font-mono text-muted-foreground px-2 py-1 bg-secondary rounded-sm">
              {userEmail}
            </span>
            <button
              onClick={handleLogout}
              className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-destructive px-2 py-1 rounded-sm transition-colors"
            >
              <LogOut className="h-3.5 w-3.5" /> Logout
            </button>
          </div>
        </div>
      </header>

      <main className="container py-8">
        {/* Hero header */}
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 mb-2 text-[10px] font-bold tracking-widest uppercase text-primary">
            <Sparkles className="h-3 w-3" /> Event Management
          </div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Events Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Add, edit, or remove events that appear on the public website.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
          <StatCard label="Total" value={stats.total} accent="primary" />
          <StatCard label="Upcoming" value={stats.upcoming} accent="emerald" />
          <StatCard label="Past" value={stats.past} accent="muted" />
          <StatCard
            label="Categories"
            value={stats.categories}
            accent="amber"
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events by title, category, or description…"
              className="w-full bg-background border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          {!showForm && (
            <button
              onClick={startCreate}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Add Event
            </button>
          )}
        </div>

        {/* Form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-background border rounded-lg p-6 mb-8 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  {editingId ? "Edit event" : "Create new event"}
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {editingId
                    ? "Update event details and save changes."
                    : "Fill in the details below to publish a new event."}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(EMPTY);
                }}
                className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-secondary rounded-sm transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-foreground mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) =>
                    setForm({ ...form, title: e.target.value })
                  }
                  placeholder="E.g. SSDC EEE — Project Expo 2026"
                  className="w-full border rounded-md bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {errors.title && (
                  <p className="text-destructive text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground mb-1.5">
                  Date *
                </label>
                <input
                  type="date"
                  value={form.event_date}
                  onChange={(e) =>
                    setForm({ ...form, event_date: e.target.value })
                  }
                  className="w-full border rounded-md bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {errors.event_date && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.event_date}
                  </p>
                )}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1.5">
                Category *
              </label>
              <input
                type="text"
                value={form.category}
                onChange={(e) =>
                  setForm({ ...form, category: e.target.value })
                }
                list="event-cats"
                placeholder="SSDC, Workshop, Seminar…"
                className="w-full border rounded-md bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
              />
              <datalist id="event-cats">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <option key={c} value={c} />
                ))}
              </datalist>
              <div className="flex flex-wrap gap-1.5 mt-2">
                {CATEGORY_SUGGESTIONS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setForm({ ...form, category: c })}
                    className={`text-[10px] px-2 py-1 rounded-full border transition-colors ${
                      form.category === c
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/70"
                    }`}
                  >
                    {c}
                  </button>
                ))}
              </div>
              {errors.category && (
                <p className="text-destructive text-xs mt-1">
                  {errors.category}
                </p>
              )}
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1.5">
                Description
              </label>
              <textarea
                rows={4}
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
                placeholder="Brief description shown on event cards (optional)"
                className="w-full border rounded-md bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary resize-none transition-all"
              />
              {errors.description && (
                <p className="text-destructive text-xs mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 pt-3 border-t">
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 rounded-md bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm disabled:opacity-60 transition-all"
              >
                {saving ? (
                  <Loader2 className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Plus className="h-3.5 w-3.5" />
                )}
                {editingId ? "Save changes" : "Create event"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setEditingId(null);
                  setForm(EMPTY);
                }}
                className="text-xs text-muted-foreground hover:text-foreground px-3 py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* List */}
        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-background border rounded-lg p-16 text-center">
            <CalendarIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">
              {search ? "No matching events" : "No events yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search
                ? "Try a different search term."
                : 'Click "Add Event" to create the first one.'}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filtered.map((ev) => {
              const isUpcoming = ev.event_date >= today;
              return (
                <div
                  key={ev.id}
                  className="group bg-background border rounded-lg p-4 hover:border-primary/30 hover:shadow-sm transition-all"
                >
                  <div className="flex items-start gap-4">
                    <div
                      className={`h-14 w-14 rounded-md border flex flex-col items-center justify-center shrink-0 ${
                        isUpcoming
                          ? "bg-primary/10 border-primary/20 text-primary"
                          : "bg-secondary border-border text-muted-foreground"
                      }`}
                    >
                      <span className="text-[9px] font-bold uppercase">
                        {new Date(ev.event_date).toLocaleString("en-US", {
                          month: "short",
                        })}
                      </span>
                      <span className="text-base font-bold leading-none">
                        {new Date(ev.event_date).getDate()}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-[10px] uppercase tracking-wide font-bold text-primary bg-primary/10 px-1.5 py-0.5 rounded-sm">
                          {ev.category}
                        </span>
                        {isUpcoming ? (
                          <span className="text-[10px] uppercase tracking-wide font-bold text-emerald-600 bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">
                            Upcoming
                          </span>
                        ) : (
                          <span className="text-[10px] uppercase tracking-wide font-medium text-muted-foreground bg-secondary px-1.5 py-0.5 rounded-sm">
                            Past
                          </span>
                        )}
                        <span className="text-[10px] text-muted-foreground">
                          {formatDisplayDate(ev.event_date)}
                        </span>
                      </div>
                      <h3 className="text-sm font-semibold text-foreground mt-1">
                        {ev.title}
                      </h3>
                      {ev.description && (
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                          {ev.description}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center gap-1 shrink-0 opacity-60 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => startEdit(ev)}
                        disabled={deletingId === ev.id}
                        className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-md disabled:opacity-50 transition-colors"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(ev.id)}
                        disabled={deletingId === ev.id}
                        className="p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-md disabled:opacity-50 transition-colors"
                        title="Delete"
                      >
                        {deletingId === ev.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent: "primary" | "emerald" | "muted" | "amber";
}) {
  const accentClasses: Record<typeof accent, string> = {
    primary: "from-primary/10 to-primary/5 text-primary",
    emerald: "from-emerald-500/10 to-emerald-500/5 text-emerald-600",
    muted: "from-muted to-muted/50 text-muted-foreground",
    amber: "from-amber-500/10 to-amber-500/5 text-amber-600",
  };
  return (
    <div
      className={`bg-gradient-to-br ${accentClasses[accent]} border rounded-lg p-4`}
    >
      <p className="text-[10px] font-bold uppercase tracking-widest opacity-80">
        {label}
      </p>
      <p className="text-2xl font-bold text-foreground mt-1">{value}</p>
    </div>
  );
}

export default AdminEvents;
