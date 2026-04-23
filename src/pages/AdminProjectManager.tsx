import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import {
  Loader2,
  Plus,
  Trash2,
  LogOut,
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

const TABLE = "project" as const;
const BUCKET = "project" as const;

type Category = "AI" | "EV" | "IoT";
const CATEGORIES: Category[] = ["AI", "EV", "IoT"];

interface ProjectRow {
  id: string;
  title: string;
  description: string | null;
  full_description: string | null;
  category: Category;
  image_url: string | null;
  storage_path: string | null;
  created_at: string;
}

const projectSchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  description: z.string().trim().min(1, "Short description is required").max(500),
  full_description: z.string().trim().max(5000).optional().or(z.literal("")),
  category: z.enum(["AI", "EV", "IoT"]),
});

const getProjectObjectPath = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return null;
  const cleanValue = decodeURIComponent(imageUrl.split("?")[0]);
  const split = cleanValue.split(`/storage/v1/object/public/${BUCKET}/`)[1];
  if (split) return split.replace(/^\/+/, "");
  return cleanValue.includes("/") && !cleanValue.startsWith("http")
    ? cleanValue.replace(/^\/+/, "")
    : null;
};

const AdminProjectManager = () => {
  const navigate = useNavigate();
  const { session, user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<ProjectRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Create form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [fullDescription, setFullDescription] = useState("");
  const [category, setCategory] = useState<Category>("AI");
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
  const [editFullDescription, setEditFullDescription] = useState("");
  const [editCategory, setEditCategory] = useState<Category>("AI");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Delete
  const [deleteTarget, setDeleteTarget] = useState<ProjectRow | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Filters
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<Category | "All">("All");

  const userEmail = user?.email ?? null;

  const loadItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from(TABLE as never)
      .select("id, title, description, full_description, category, image_url, storage_path, created_at")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("[AdminProjectManager] Failed to load:", error);
      toast.error(error.message);
      setItems([]);
    } else {
      setItems((data ?? []) as unknown as ProjectRow[]);
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
    return items.filter((i) => {
      if (filterCat !== "All" && i.category !== filterCat) return false;
      if (!q) return true;
      return (
        i.title.toLowerCase().includes(q) ||
        (i.description ?? "").toLowerCase().includes(q) ||
        (i.full_description ?? "").toLowerCase().includes(q)
      );
    });
  }, [items, search, filterCat]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  const resetForm = () => {
    setTitle("");
    setDescription("");
    setFullDescription("");
    setCategory("AI");
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

  const startEdit = (item: ProjectRow) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditDescription(item.description ?? "");
    setEditFullDescription(item.full_description ?? "");
    setEditCategory(item.category);
    setEditFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditDescription("");
    setEditFullDescription("");
    setEditCategory("AI");
    setEditFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = projectSchema.safeParse({
      title,
      description,
      full_description: fullDescription,
      category,
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
      const path = `projects/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const uploadRes = await supabase.storage
        .from(BUCKET)
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      if (uploadRes.error) throw uploadRes.error;

      const { data: pub } = supabase.storage
        .from(BUCKET)
        .getPublicUrl(uploadRes.data.path);

      const publicUrl = pub.publicUrl;

      const { data: inserted, error: insertErr } = await supabase
        .from(TABLE as never)
        .insert({
          title: result.data.title,
          description: result.data.description,
          full_description: result.data.full_description || null,
          category: result.data.category,
          image_url: publicUrl,
          storage_path: uploadRes.data.path,
        } as never)
        .select()
        .maybeSingle();

      if (insertErr) throw insertErr;

      if (inserted) {
        // APPEND — never replace existing items
        setItems((prev) => [inserted as unknown as ProjectRow, ...prev]);
        toast.success("Project added");
      }
      setShowForm(false);
      resetForm();
    } catch (err: any) {
      console.error("[AdminProjectManager] Save failed:", err);
      toast.error(err?.message ?? "Failed to upload project");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (item: ProjectRow) => {
    const result = projectSchema.safeParse({
      title: editTitle,
      description: editDescription,
      full_description: editFullDescription,
      category: editCategory,
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid project");
      return;
    }

    setUpdatingId(item.id);
    try {
      let nextImageUrl = item.image_url;
      let nextPath = item.storage_path;

      if (editFile) {
        const oldPath = item.storage_path || getProjectObjectPath(item.image_url);
        if (oldPath) {
          await supabase.storage.from(BUCKET).remove([oldPath]);
        }
        const ext = editFile.name.split(".").pop()?.toLowerCase() || "jpg";
        const newPath = `projects/${Date.now()}-${Math.random()
          .toString(36)
          .slice(2, 8)}.${ext}`;

        const uploadRes = await supabase.storage
          .from(BUCKET)
          .upload(newPath, editFile, {
            cacheControl: "3600",
            upsert: false,
            contentType: editFile.type || undefined,
          });
        if (uploadRes.error) throw uploadRes.error;

        const { data: pub } = supabase.storage
          .from(BUCKET)
          .getPublicUrl(uploadRes.data.path);

        nextImageUrl = pub.publicUrl;
        nextPath = uploadRes.data.path;
      }

      // ONLY update the selected row by id — never affects other records
      const { data, error } = await supabase
        .from(TABLE as never)
        .update({
          title: result.data.title,
          description: result.data.description,
          full_description: result.data.full_description || null,
          category: result.data.category,
          image_url: nextImageUrl,
          storage_path: nextPath,
        } as never)
        .eq("id", item.id)
        .select()
        .maybeSingle();

      if (error) throw error;

      const updated = (data as unknown as ProjectRow) ?? {
        ...item,
        title: result.data.title,
        description: result.data.description,
        full_description: result.data.full_description || null,
        category: result.data.category,
        image_url: nextImageUrl,
        storage_path: nextPath,
      };
      setItems((prev) => prev.map((g) => (g.id === item.id ? updated : g)));
      cancelEdit();
      toast.success("Project updated");
    } catch (err: any) {
      console.error("[AdminProjectManager] Update failed:", err);
      toast.error(err?.message ?? "Failed to update project");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;
    const item = deleteTarget;

    const objectPath = item.storage_path || getProjectObjectPath(item.image_url);

    setDeletingId(item.id);
    try {
      // 1. Delete storage object first
      if (objectPath) {
        const { error: rmErr } = await supabase.storage
          .from(BUCKET)
          .remove([objectPath]);
        if (rmErr) {
          console.warn("[AdminProjectManager] Storage remove error:", rmErr);
        }
      }

      // 2. Delete only this row by id — never any bulk delete
      const { error } = await supabase
        .from(TABLE as never)
        .delete()
        .eq("id", item.id);
      if (error) throw error;

      setItems((prev) => prev.filter((g) => g.id !== item.id));
      setDeleteTarget(null);
      toast.success("Project deleted");
    } catch (err: any) {
      console.error("[AdminProjectManager] Delete failed:", err);
      toast.error(err?.message ?? "Failed to delete project");
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
                Project Manager
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
              <Link
                to="/admin/event-manager"
                className="px-3 py-1 text-xs text-muted-foreground hover:text-foreground rounded-sm transition-colors"
              >
                Event Manager
              </Link>
              <span className="px-3 py-1 text-xs font-medium bg-background text-foreground rounded-sm shadow-sm">
                Projects
              </span>
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
            <h2 className="text-2xl font-bold text-foreground">Projects</h2>
            <p className="text-sm text-muted-foreground">
              {items.length} dynamic project{items.length === 1 ? "" : "s"} · table:{" "}
              <code className="font-mono">project</code> · bucket:{" "}
              <code className="font-mono">project</code>
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Static homepage projects are preserved — these are appended below them.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative">
              <Search className="h-4 w-4 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search projects..."
                className="h-9 pl-8 pr-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
            </div>
            <button
              onClick={() => setShowForm((v) => !v)}
              className="inline-flex items-center gap-1.5 h-9 px-3 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 transition-colors"
            >
              <Plus className="h-4 w-4" />
              {showForm ? "Close" : "Add Project"}
            </button>
          </div>
        </div>

        {/* Category filter */}
        <div className="flex gap-2 mb-6">
          {(["All", ...CATEGORIES] as const).map((c) => (
            <button
              key={c}
              onClick={() => setFilterCat(c)}
              className={`px-3 py-1 text-xs font-medium rounded-sm border transition-colors ${
                filterCat === c
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-background text-muted-foreground border-border hover:text-foreground"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        {/* Add form */}
        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-background border rounded-md p-5 mb-6 shadow-sm"
          >
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Project title"
                  className="w-full h-9 px-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                />
                {errors.title && (
                  <p className="text-xs text-destructive mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-medium text-foreground mb-1.5">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full h-9 px-3 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
                {errors.category && (
                  <p className="text-xs text-destructive mt-1">
                    {errors.category}
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Short Description *
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                placeholder="Brief summary shown on the project card"
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-y"
              />
              {errors.description && (
                <p className="text-xs text-destructive mt-1">
                  {errors.description}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Full Description
              </label>
              <textarea
                value={fullDescription}
                onChange={(e) => setFullDescription(e.target.value)}
                rows={5}
                placeholder="Detailed description shown when the user opens the project"
                className="w-full px-3 py-2 text-sm rounded-md border border-input bg-background focus:outline-none focus:ring-1 focus:ring-ring resize-y"
              />
              {errors.full_description && (
                <p className="text-xs text-destructive mt-1">
                  {errors.full_description}
                </p>
              )}
            </div>

            <div className="mt-4">
              <label className="block text-xs font-medium text-foreground mb-1.5">
                Image *
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
                className={`border-2 border-dashed rounded-md p-6 text-center cursor-pointer transition-colors ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                {previewUrl ? (
                  <div className="flex items-center gap-4">
                    <img
                      src={previewUrl}
                      alt="preview"
                      className="h-20 w-20 object-cover rounded-md"
                    />
                    <div className="text-left">
                      <p className="text-sm font-medium text-foreground">
                        {file?.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(file && (file.size / 1024).toFixed(0)) || 0} KB
                      </p>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setFile(null);
                        }}
                        className="text-xs text-destructive mt-1 hover:underline"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-2">
                    <UploadCloud className="h-8 w-8 text-muted-foreground" />
                    <p className="text-sm text-foreground">
                      Click or drop image here
                    </p>
                    <p className="text-xs text-muted-foreground">
                      PNG, JPG up to ~5MB
                    </p>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
              {errors.file && (
                <p className="text-xs text-destructive mt-1">{errors.file}</p>
              )}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="h-9 px-3 text-sm font-medium border border-input bg-background rounded-md hover:bg-secondary transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center gap-1.5 h-9 px-4 text-sm font-medium bg-primary text-primary-foreground rounded-md shadow-sm hover:bg-primary/90 disabled:opacity-50 transition-colors"
              >
                {saving ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Plus className="h-4 w-4" />
                )}
                Create project
              </button>
            </div>
          </form>
        )}

        {/* Grid */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="h-6 w-6 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="border border-dashed rounded-md p-12 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm text-muted-foreground">
              {items.length === 0
                ? "No dynamic projects yet. Existing static projects on the website are unaffected."
                : "No projects match your search."}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((item) => {
              const isEditing = editingId === item.id;
              return (
                <div
                  key={item.id}
                  className="border rounded-md overflow-hidden bg-background flex flex-col"
                >
                  <div className="relative">
                    {item.image_url ? (
                      <img
                        src={item.image_url}
                        alt={item.title}
                        className="w-full h-40 object-cover"
                        loading="lazy"
                      />
                    ) : (
                      <div className="w-full h-40 bg-secondary flex items-center justify-center">
                        <ImageIcon className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                    <span className="absolute top-2 left-2 bg-primary text-primary-foreground text-[10px] font-bold px-2 py-0.5 rounded-sm">
                      {item.category}
                    </span>
                  </div>

                  <div className="p-3 flex-1 flex flex-col">
                    {isEditing ? (
                      <div className="space-y-2">
                        <input
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full h-8 px-2 text-sm rounded border border-input bg-background"
                        />
                        <select
                          value={editCategory}
                          onChange={(e) =>
                            setEditCategory(e.target.value as Category)
                          }
                          className="w-full h-8 px-2 text-sm rounded border border-input bg-background"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                        <textarea
                          value={editDescription}
                          onChange={(e) => setEditDescription(e.target.value)}
                          rows={2}
                          placeholder="Short description"
                          className="w-full px-2 py-1 text-xs rounded border border-input bg-background resize-y"
                        />
                        <textarea
                          value={editFullDescription}
                          onChange={(e) =>
                            setEditFullDescription(e.target.value)
                          }
                          rows={3}
                          placeholder="Full description"
                          className="w-full px-2 py-1 text-xs rounded border border-input bg-background resize-y"
                        />
                        <input
                          type="file"
                          accept="image/*"
                          onChange={(e) => handleEditFile(e.target.files)}
                          className="text-xs w-full"
                        />
                        {editFile && (
                          <p className="text-[10px] text-muted-foreground">
                            New: {editFile.name}
                          </p>
                        )}
                        <div className="flex gap-2 pt-1">
                          <button
                            onClick={() => handleUpdate(item)}
                            disabled={updatingId === item.id}
                            className="inline-flex items-center gap-1 h-7 px-2 text-xs font-medium bg-primary text-primary-foreground rounded hover:bg-primary/90 disabled:opacity-50"
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
                            className="inline-flex items-center gap-1 h-7 px-2 text-xs font-medium border border-input bg-background rounded hover:bg-secondary"
                          >
                            <X className="h-3 w-3" />
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <h3 className="text-sm font-bold text-foreground">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground mt-1 line-clamp-3 flex-1">
                          {item.description}
                        </p>
                        <div className="flex items-center justify-between mt-3 pt-3 border-t">
                          <span className="text-[10px] text-muted-foreground">
                            {new Date(item.created_at).toLocaleDateString(
                              "en-IN",
                            )}
                          </span>
                          <div className="flex gap-1">
                            <button
                              onClick={() => startEdit(item)}
                              className="inline-flex items-center gap-1 h-7 px-2 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary rounded transition-colors"
                            >
                              <Pencil className="h-3 w-3" />
                              Edit
                            </button>
                            <button
                              onClick={() => setDeleteTarget(item)}
                              className="inline-flex items-center gap-1 h-7 px-2 text-xs text-destructive hover:bg-destructive/10 rounded transition-colors"
                            >
                              <Trash2 className="h-3 w-3" />
                              Delete
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(o) => !o && setDeleteTarget(null)}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete this project?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently remove "{deleteTarget?.title}" and its image
              from storage. Static projects on the homepage are NOT affected.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deletingId === deleteTarget?.id}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={(e) => {
                e.preventDefault();
                void confirmDelete();
              }}
              disabled={deletingId === deleteTarget?.id}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deletingId === deleteTarget?.id ? (
                <Loader2 className="h-4 w-4 animate-spin mr-1" />
              ) : (
                <Trash2 className="h-4 w-4 mr-1" />
              )}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AdminProjectManager;
