import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  LogOut,
  ImagePlus,
  X,
  ArrowLeft,
  ImageIcon,
  Search,
  LayoutDashboard,
  UploadCloud,
  Pencil,
  Save,
} from "lucide-react";
import { z } from "zod";
import { useAuth } from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

const TABLE = "event" as const;
const BUCKET = "event" as const;

interface EventRow {
  id: string;
  title: string;
  description: string | null;
  image_url: string | null;
  storage_path: string | null;
  event_date: string | null; // YYYY-MM-DD
  event_time: string | null; // HH:MM
  created_at: string;
}

const eventSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().max(2000).optional().or(z.literal("")),
  event_date: z.string().min(1, "Date is required"),
  event_time: z.string().min(1, "Time is required"),
});

const formatAdminDate = (iso: string | null) => {
  if (!iso) return "—";
  const [y, m, d] = iso.split("-");
  if (!y || !m || !d) return iso;
  return `${d}-${m}-${y}`;
};

const formatAdminTime = (t: string | null) => {
  if (!t) return "—";
  const [h, m] = t.split(":");
  const hour = parseInt(h, 10);
  if (isNaN(hour)) return t;
  const ampm = hour >= 12 ? "PM" : "AM";
  const h12 = hour % 12 === 0 ? 12 : hour % 12;
  return `${String(h12).padStart(2, "0")}:${m ?? "00"} ${ampm}`;
};

// Best-effort fallback: extract storage path from a public URL if storage_path is missing
const getEventObjectPath = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return null;
  const cleanValue = decodeURIComponent(imageUrl.split("?")[0]);
  const split = cleanValue.split(`/storage/v1/object/public/${BUCKET}/`)[1];
  if (split) return split.replace(/^\/+/, "");
  return cleanValue.includes("/") && !cleanValue.startsWith("http")
    ? cleanValue.replace(/^\/+/, "")
    : null;
};

const AdminEventManager = () => {
  const navigate = useNavigate();
  const { session, user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [eventTime, setEventTime] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  // Edit
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editDate, setEditDate] = useState("");
  const [editTime, setEditTime] = useState("");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<EventRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Search
  const [search, setSearch] = useState("");

  const userEmail = user?.email ?? null;

  const loadItems = useCallback(async () => {
    setLoading(true);
    let { data, error } = await supabase
      .from(TABLE as never)
      .select("id, title, description, image_url, storage_path, event_date, event_time, created_at")
      .order("event_date", { ascending: false, nullsFirst: false });

    if (error) {
      console.warn("[AdminEventManager] full select failed, falling back:", error.message);
      const fb = await supabase
        .from(TABLE as never)
        .select("id, title, description, image_url, storage_path, created_at")
        .order("created_at", { ascending: false });
      data = fb.data as never;
      error = fb.error;
    }

    console.log("[AdminEventManager] Fetch response:", { data, error });

    if (error) {
      console.error("[AdminEventManager] Failed to load:", error);
      toast.error(error.message);
      setItems([]);
    } else {
      setItems(((data ?? []) as unknown as EventRow[]));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    if (authLoading) return;
    if (!session || !user) {
      navigate("/login", { replace: true });
      return;
    }
    void loadItems();
  }, [authLoading, session, user, navigate, loadItems]);

  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return items;
    return items.filter(
      (i) =>
        i.title.toLowerCase().includes(q) ||
        (i.description ?? "").toLowerCase().includes(q),
    );
  }, [items, search]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setEventDate("");
    setEventTime("");
    setFile(null);
    setErrors({});
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFiles = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setFile(f);
  };

  const handleEditFile = (files: FileList | null) => {
    const f = files?.[0];
    if (!f) return;
    if (!f.type.startsWith("image/")) {
      toast.error("Please choose an image file");
      return;
    }
    setEditFile(f);
  };

  const startEdit = (item: EventRow) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description ?? "");
    setEditDate(item.event_date ?? "");
    setEditTime(item.event_time ? item.event_time.slice(0, 5) : "");
    setEditFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditDate("");
    setEditTime("");
    setEditFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = eventSchema.safeParse({
      title,
      description,
      event_date: eventDate,
      event_time: eventTime,
    });
    if (!result.success) {
      const fe: Record<string, string> = {};
      result.error.issues.forEach((i) => {
        const k = i.path[0] as string;
        if (!fe[k]) fe[k] = i.message;
      });
      setErrors(fe);
      return;
    }

    if (!file) {
      setErrors({ file: "Please choose an image to upload." });
      return;
    }

    if (!user) {
      toast.error("Please sign in.");
      navigate("/login", { replace: true });
      return;
    }

    setSaving(true);
    try {
      const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
      const path = `events/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const uploadRes = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      console.log("[AdminEventManager] Upload response:", uploadRes);
      if (uploadRes.error) throw uploadRes.error;

      const { data: pub } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(uploadRes.data.path);

      const publicUrl = pub.publicUrl;
      console.log("[AdminEventManager] Public URL:", publicUrl);
      console.log("[AdminEventManager] Storage path:", uploadRes.data.path);

      const { data: inserted, error: insertErr } = await supabase
        .from(TABLE as never)
        .insert({
          title: result.data.title,
          description: result.data.description || null,
          image_url: publicUrl,
          storage_path: uploadRes.data.path,
          event_date: result.data.event_date,
          event_time: result.data.event_time,
        } as never)
        .select()
        .maybeSingle();

      console.log("[AdminEventManager] Insert response:", { inserted, insertErr });
      if (insertErr) throw insertErr;

      if (inserted) {
        setItems((prev) => [inserted as unknown as EventRow, ...prev]);
        toast.success("Event added");
      }
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      console.error("[AdminEventManager] Save failed:", err);
      toast.error(err?.message ?? "Failed to upload event");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (item: EventRow) => {
    const result = eventSchema.safeParse({
      title: editTitle,
      description: editDescription,
      event_date: editDate,
      event_time: editTime,
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid event");
      return;
    }

    setUpdatingId(item.id);
    try {
      let nextImageUrl = item.image_url;
      let nextPath = item.storage_path;

      if (editFile) {
        const oldPath =
          item.storage_path || getEventObjectPath(item.image_url);

        // Delete old image from storage if it exists
        if (oldPath) {
          const { error: rmErr } = await supabase.storage
            .from(BUCKET)
            .remove([oldPath]);
          console.log("[AdminEventManager] Old image removed:", { oldPath, rmErr });
          // Don't throw on remove error — old file may have been already gone
        }

        // Upload new image to a fresh path
        const ext = editFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const newPath = `events/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;

        const uploadRes = await supabase.storage
          .from(BUCKET)
          .upload(newPath, editFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: editFile.type || undefined,
          });
        console.log("[AdminEventManager] Replace upload response:", uploadRes);
        if (uploadRes.error) throw uploadRes.error;

        const { data: pub } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(uploadRes.data.path);

        nextImageUrl = pub.publicUrl;
        nextPath = uploadRes.data.path;
      }

      const { data, error } = await supabase
        .from(TABLE as never)
        .update({
          title: result.data.title,
          description: result.data.description || null,
          image_url: nextImageUrl,
          storage_path: nextPath,
          event_date: result.data.event_date,
          event_time: result.data.event_time,
        } as never)
        .eq("id", item.id)
        .select()
        .maybeSingle();

      console.log("[AdminEventManager] Update response:", { data, error });
      if (error) throw error;

      const updated = (data as unknown as EventRow) ?? {
        ...item,
        title: result.data.title,
        description: result.data.description || null,
        image_url: nextImageUrl,
        storage_path: nextPath,
        event_date: result.data.event_date,
        event_time: result.data.event_time,
      };
      setItems((prev) => prev.map((g) => (g.id === item.id ? updated : g)));
      cancelEdit();
      toast.success("Event updated");
    } catch (err: any) {
      console.error("[AdminEventManager] Update failed:", err);
      toast.error(err?.message ?? "Failed to update event");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const item = deleteTarget;

    const objectPath =
      item.storage_path || getEventObjectPath(item.image_url);
    console.log("[AdminEventManager] Deleting:", objectPath);

    setDeletingId(item.id);
    try {
      // 1. Delete image from storage (if we have a path)
      if (objectPath) {
        const { data: rmData, error: rmErr } = await supabase.storage
          .from(BUCKET)
          .remove([objectPath]);
        console.log("[AdminEventManager] Storage remove response:", {
          objectPath,
          rmData,
          rmErr,
        });
        if (rmErr) throw rmErr;
      } else {
        console.warn(
          "[AdminEventManager] No storage_path — skipping storage delete",
        );
      }

      // 2. Delete row from event table
      const { error } = await supabase
        .from(TABLE as never)
        .delete()
        .eq("id", item.id);
      console.log("[AdminEventManager] Row delete response:", {
        itemId: item.id,
        error,
      });
      if (error) throw error;

      setItems((prev) => prev.filter((g) => g.id !== item.id));
      setDeleteTarget(null);
      toast.success("Event deleted");
    } catch (err: any) {
      console.error("[AdminEventManager] Delete failed:", err);
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

  if (!session || !user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-secondary via-background to-secondary/60">
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
                Event Manager
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <nav className="hidden sm:flex items-center gap-1 mr-2 p-1 bg-secondary rounded-md">
              <Link
                to="/admin"
                className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded-sm transition-colors"
              >
                Events
              </Link>
              <Link
                to="/admin/gallery"
                className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded-sm transition-colors"
              >
                Gallery
              </Link>
              <span className="px-3 py-1 text-xs font-medium bg-background text-foreground rounded-sm shadow-sm">
                Event Manager
              </span>
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
        <div className="mb-6 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h2 className="text-2xl font-bold text-foreground">Events</h2>
            <p className="text-sm text-muted-foreground">
              {items.length} total · table:{" "}
              <code className="font-mono">event</code> · bucket:{" "}
              <code className="font-mono">event</code>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search events..."
                className="h-9 pl-8 pr-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors"
            >
              {showForm ? (
                <>
                  <X className="h-4 w-4" /> Cancel
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" /> New Event
                </>
              )}
            </button>
          </div>
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="mb-8 p-6 rounded-lg border bg-card shadow-sm grid gap-4 md:grid-cols-2"
          >
            <div className="space-y-3">
              <div>
                <label className="text-xs font-medium text-foreground">
                  Title
                </label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Annual Tech Fest"
                  className="mt-1 w-full h-9 px-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {errors.title && (
                  <p className="text-xs text-destructive mt-1">{errors.title}</p>
                )}
              </div>
              <div>
                <label className="text-xs font-medium text-foreground">
                  Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  placeholder="Brief description..."
                  className="mt-1 w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-none"
                />
                {errors.description && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.description}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-foreground">
                    Date <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="mt-1 w-full h-9 px-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {errors.event_date && (
                    <p className="text-xs text-destructive mt-1">{errors.event_date}</p>
                  )}
                </div>
                <div>
                  <label className="text-xs font-medium text-foreground">
                    Time <span className="text-destructive">*</span>
                  </label>
                  <input
                    type="time"
                    value={eventTime}
                    onChange={(e) => setEventTime(e.target.value)}
                    className="mt-1 w-full h-9 px-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                  />
                  {errors.event_time && (
                    <p className="text-xs text-destructive mt-1">{errors.event_time}</p>
                  )}
                </div>
              </div>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <UploadCloud className="h-4 w-4" />
                )}
                {saving ? "Uploading..." : "Create Event"}
              </button>
            </div>

            <div>
              <label className="text-xs font-medium text-foreground">
                Image
              </label>
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragOver(true);
                }}
                onDragLeave={() => setDragOver(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setDragOver(false);
                  handleFiles(e.dataTransfer.files);
                }}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-1 cursor-pointer flex flex-col items-center justify-center gap-2 rounded-md border-2 border-dashed transition-colors h-56 ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-input bg-secondary/30 hover:bg-secondary/50"
                }`}
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="preview"
                    className="h-full w-full object-cover rounded-md"
                  />
                ) : (
                  <>
                    <ImagePlus className="h-8 w-8 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">
                      Click or drag image to upload
                    </p>
                  </>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  hidden
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
              {errors.file && (
                <p className="text-xs text-destructive mt-1">{errors.file}</p>
              )}
            </div>
          </form>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
            <ImageIcon className="h-12 w-12 mb-2 opacity-50" />
            <p className="text-sm">
              {items.length === 0
                ? "No events yet. Create your first one!"
                : "No events match your search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <article
                  key={item.id}
                  className="group rounded-lg border bg-card overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="aspect-video bg-secondary overflow-hidden relative">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                        <ImageIcon className="h-8 w-8" />
                      </div>
                    )}
                  </div>

                  <div className="p-4 space-y-3">
                    {isEditing ? (
                      <>
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full h-8 px-2 text-sm font-semibold rounded-md border border-input bg-background"
                        />
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={3}
                          className="w-full px-2 py-1 text-xs rounded-md border border-input bg-background resize-none"
                        />
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block text-[10px] text-muted-foreground mb-0.5">
                              Date
                            </label>
                            <input
                              type="date"
                              value={editDate}
                              onChange={(e) => setEditDate(e.target.value)}
                              className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background"
                            />
                          </div>
                          <div>
                            <label className="block text-[10px] text-muted-foreground mb-0.5">
                              Time
                            </label>
                            <input
                              type="time"
                              value={editTime}
                              onChange={(e) => setEditTime(e.target.value)}
                              className="w-full h-8 px-2 text-xs rounded-md border border-input bg-background"
                            />
                          </div>
                        </div>
                        <label className="block text-xs text-muted-foreground">
                          Replace image (optional)
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleEditFile(e.target.files)}
                            className="mt-1 block w-full text-xs file:mr-2 file:px-2 file:py-1 file:rounded file:border-0 file:bg-secondary file:text-foreground"
                          />
                        </label>
                        {editFile && (
                          <p className="text-[10px] text-primary truncate">
                            New: {editFile.name}
                          </p>
                        )}
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleUpdate(item)}
                            disabled={updatingId === item.id}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 text-xs font-medium bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50"
                          >
                            {updatingId === item.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Save className="h-3 w-3" />
                            )}
                            Save
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 text-xs font-medium bg-secondary text-foreground rounded-md hover:bg-secondary/80"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-sm font-semibold text-foreground line-clamp-1">
                          {item.title}
                        </h3>
                        {item.description && (
                          <p className="text-xs text-muted-foreground line-clamp-2">
                            {item.description}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-x-3 gap-y-0.5 text-[10px] text-muted-foreground">
                          <span>
                            <span className="font-medium text-foreground/70">Date:</span>{" "}
                            {formatAdminDate(item.event_date)}
                          </span>
                          <span>
                            <span className="font-medium text-foreground/70">Time:</span>{" "}
                            {formatAdminTime(item.event_time)}
                          </span>
                        </div>
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => startEdit(item)}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 text-xs font-medium bg-secondary text-foreground rounded-md hover:bg-secondary/80"
                          >
                            <Pencil className="h-3 w-3" /> Edit
                          </button>
                          <button
                            onClick={() => setDeleteTarget(item)}
                            disabled={deletingId === item.id}
                            className="flex-1 inline-flex items-center justify-center gap-1.5 h-8 text-xs font-medium bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 disabled:opacity-50"
                          >
                            {deletingId === item.id ? (
                              <Loader2 className="h-3 w-3 animate-spin" />
                            ) : (
                              <Trash2 className="h-3 w-3" />
                            )}
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </main>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => !open && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this event?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove the event row and its image from
              storage. This action cannot be undone.
              {deleteTarget && (
                <span className="block mt-2 text-xs font-mono break-all text-foreground">
                  {deleteTarget.title}
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={!!deletingId}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              disabled={!!deletingId}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminEventManager;
