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
  Sparkles,
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

type GalleryCategory = "projects" | "workshops" | "events" | "awards";

const CATEGORIES: { value: GalleryCategory; label: string; emoji: string }[] = [
  { value: "projects", label: "Projects", emoji: "🛠️" },
  { value: "workshops", label: "Workshops", emoji: "🎓" },
  { value: "events", label: "Events", emoji: "🎉" },
  { value: "awards", label: "Awards", emoji: "🏆" },
];

interface GalleryItemRow {
  id: string;
  title: string;
  image_url: string;
  storage_path?: string | null;
  category: GalleryCategory;
  created_at: string;
}

interface GalleryItem extends GalleryItemRow {
  url: string;
  path: string;
}

const gallerySchema = z.object({
  title: z.string().trim().min(1, "Title is required").max(200),
  category: z.enum(["projects", "workshops", "events", "awards"]),
});

const getGalleryObjectPath = (imageUrl: string | null | undefined) => {
  if (!imageUrl) return null;

  const cleanValue = decodeURIComponent(imageUrl.split("?")[0]);
  const splitPath = cleanValue.split("/storage/v1/object/public/gallery/")[1];
  if (splitPath) return splitPath.replace(/^\/+/, "");

  return cleanValue.includes("/") && !cleanValue.startsWith("http")
    ? cleanValue.replace(/^\/+/, "")
    : null;
};

const normalizeGalleryItem = (item: GalleryItemRow): GalleryItem => ({
  ...item,
  url: item.image_url,
  path: item.storage_path ?? getGalleryObjectPath(item.image_url) ?? "",
});

const AdminGallery = () => {
  const navigate = useNavigate();
  const { session, user, loading: authLoading } = useAuth();
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<GalleryCategory>("projects");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState<GalleryCategory | "all">("all");
  const [dragOver, setDragOver] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<GalleryItem | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState("");
  const [editCategory, setEditCategory] = useState<GalleryCategory>("projects");
  const [editFile, setEditFile] = useState<File | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const userEmail = user?.email ?? null;

  const loadItems = useCallback(async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("gallery_items" as never)
      .select("id, title, image_url, storage_path, category, created_at")
      .order("created_at", { ascending: false });

    console.log("[AdminGallery] Fetch response:", { data, error });

    if (error) {
      console.error("[AdminGallery] Failed to load items:", error);
      toast.error(error.message);
      setItems([]);
    } else {
      setItems(((data ?? []) as unknown as GalleryItemRow[]).map(normalizeGalleryItem));
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

  const stats = useMemo(() => {
    const counts = { projects: 0, workshops: 0, events: 0, awards: 0 };
    items.forEach((i) => {
      counts[i.category] = (counts[i.category] ?? 0) + 1;
    });
    return { total: items.length, ...counts };
  }, [items]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return items.filter((i) => {
      if (filterCat !== "all" && i.category !== filterCat) return false;
      if (q && !i.title.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [items, search, filterCat]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    toast.success("Logged out");
    navigate("/login", { replace: true });
  };

  const resetForm = () => {
    setTitle("");
    setCategory("projects");
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

  const startEdit = (item: GalleryItem) => {
    setEditingId(item.id);
    setEditTitle(item.title);
    setEditCategory(item.category);
    setEditFile(null);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditTitle("");
    setEditCategory("projects");
    setEditFile(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    const result = gallerySchema.safeParse({ title, category });
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
      const path = `${result.data.category}/${Date.now()}-${Math.random()
        .toString(36)
        .slice(2, 8)}.${ext}`;

      const uploadRes = await supabase.storage
        .from("gallery")
        .upload(path, file, {
          cacheControl: "3600",
          upsert: false,
          contentType: file.type || undefined,
        });

      console.log("[AdminGallery] Upload response:", uploadRes);

      if (uploadRes.error) throw uploadRes.error;

      const { data: pub } = supabase.storage
        .from("gallery")
        .getPublicUrl(uploadRes.data.path);

      const publicUrl = pub.publicUrl;
      console.log("[AdminGallery] Public URL:", publicUrl);
      console.log("[AdminGallery] Stored file path:", uploadRes.data.path);

      const { data: inserted, error: insertErr } = await supabase
        .from("gallery_items" as never)
        .insert({
          title: result.data.title,
          image_url: publicUrl,
          storage_path: uploadRes.data.path,
          category: result.data.category,
        } as never)
        .select()
        .maybeSingle();

      console.log("[AdminGallery] Insert response:", { inserted, insertErr });

      if (insertErr) throw insertErr;

      if (inserted) {
        setItems((prev) => [normalizeGalleryItem(inserted as unknown as GalleryItemRow), ...prev]);
        toast.success("Image added to gallery");
      }

      setShowForm(false);
      resetForm();
    } catch (err: any) {
      console.error("[AdminGallery] Save failed:", err);
      toast.error(err?.message ?? "Failed to upload image");
    } finally {
      setSaving(false);
    }
  };

  const handleUpdate = async (item: GalleryItem) => {
    const result = gallerySchema.safeParse({
      title: editTitle,
      category: editCategory,
    });
    if (!result.success) {
      toast.error(result.error.issues[0]?.message ?? "Invalid gallery item");
      return;
    }

    const objectPath = item.path || getGalleryObjectPath(item.url);
    setUpdatingId(item.id);

    try {
      let nextImageUrl = item.url;
      let nextPath = item.path || objectPath || "";

      if (editFile) {
        if (!objectPath) throw new Error("Could not read storage file path");

        const uploadRes = await supabase.storage
          .from("gallery")
          .upload(objectPath, editFile, {
            cacheControl: "0",
            upsert: true,
            contentType: editFile.type || undefined,
          });

        console.log("[AdminGallery] Replace upload response:", {
          objectPath,
          uploadRes,
        });

        if (uploadRes.error) throw uploadRes.error;

        const { data: pub } = supabase.storage
          .from("gallery")
          .getPublicUrl(objectPath);
        nextImageUrl = `${pub.publicUrl}?v=${Date.now()}`;
        nextPath = objectPath;
      }

      const { data, error } = await supabase
        .from("gallery_items" as never)
        .update({
          title: result.data.title,
          category: result.data.category,
          image_url: nextImageUrl,
          storage_path: nextPath,
        } as never)
        .eq("id", item.id)
        .select()
        .maybeSingle();

      console.log("[AdminGallery] Update response:", { data, error });

      if (error) throw error;

       const updated = data as unknown as GalleryItemRow | null;
      setItems((prev) =>
        prev.map((g) =>
          g.id === item.id
            ? updated
              ? normalizeGalleryItem(updated)
              : {
                  ...g,
                  title: result.data.title,
                  category: result.data.category,
                  image_url: nextImageUrl,
                  url: nextImageUrl,
                  path: nextPath,
                }
            : g,
        ),
      );
      cancelEdit();
      toast.success("Gallery item updated");
    } catch (err: any) {
      console.error("[AdminGallery] Update failed:", err);
      toast.error(err?.message ?? "Failed to update gallery item");
    } finally {
      setUpdatingId(null);
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) return;

    const item = deleteTarget;
    const objectPath = item.path || getGalleryObjectPath(item.url);
    const objectName = objectPath?.split("/").pop();
    const objectFolder = objectPath?.split("/").slice(0, -1).join("/") ?? "";
    console.log("[AdminGallery] Delete image URL:", item.url);
    console.log("[AdminGallery] Delete extracted file path:", objectPath);

    if (!objectPath) {
      toast.error("Could not read storage file path");
      return;
    }

    setDeletingId(item.id);
    try {
      const { data: rmData, error: rmErr } = await supabase.storage
        .from("gallery")
        .remove([objectPath]);

      console.log("[AdminGallery] Storage remove response:", {
        objectPath,
        rmData,
        rmErr,
      });

      if (rmErr) throw rmErr;
      console.log("[AdminGallery] Storage delete result count:", rmData?.length ?? 0);

      const { data: stillExists, error: listErr } = await supabase.storage
        .from("gallery")
        .list(objectFolder, { search: objectName });

      console.log("[AdminGallery] Storage verify response:", {
        objectFolder,
        objectName,
        stillExists,
        listErr,
      });

      if (listErr) throw listErr;
      if ((stillExists ?? []).some((entry) => entry.name === objectName)) {
        throw new Error("Failed to delete image from storage");
      }

      const { error } = await supabase
        .from("gallery_items" as never)
        .delete()
        .eq("id", item.id);

      console.log("[AdminGallery] Row delete response:", { itemId: item.id, error });

      if (error) throw error;
      setItems((prev) => prev.filter((g) => g.id !== item.id));
      setDeleteTarget(null);
      toast.success("Image deleted");
    } catch (err: any) {
      console.error("[AdminGallery] Delete failed:", err);
      toast.error(err?.message ?? "Failed to delete image");
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

  const deletePath = deleteTarget ? deleteTarget.path || getGalleryObjectPath(deleteTarget.url) : null;

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
                Admin Console
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
              <span className="px-3 py-1 text-xs font-medium bg-background text-foreground rounded-sm shadow-sm">
                Gallery
              </span>
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
        <div className="mb-8">
          <div className="inline-flex items-center gap-1.5 mb-2 text-[10px] font-bold tracking-widest uppercase text-primary">
            <Sparkles className="h-3 w-3" /> Gallery Management
          </div>
          <h2 className="text-3xl font-bold text-foreground tracking-tight">
            Gallery Dashboard
          </h2>
          <p className="text-sm text-muted-foreground mt-1.5">
            Upload images, group them by category, and manage what appears on
            the public Gallery page.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-8">
          <button
            onClick={() => setFilterCat("all")}
            className={`text-left bg-gradient-to-br border rounded-lg p-4 transition-all ${
              filterCat === "all"
                ? "from-primary/15 to-primary/5 border-primary/30 ring-2 ring-primary/20"
                : "from-secondary to-background hover:border-primary/30"
            }`}
          >
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
              Total
            </p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {stats.total}
            </p>
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c.value}
              onClick={() => setFilterCat(c.value)}
              className={`text-left bg-gradient-to-br border rounded-lg p-4 transition-all ${
                filterCat === c.value
                  ? "from-primary/15 to-primary/5 border-primary/30 ring-2 ring-primary/20"
                  : "from-secondary to-background hover:border-primary/30"
              }`}
            >
              <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground flex items-center gap-1">
                <span>{c.emoji}</span> {c.label}
              </p>
              <p className="text-2xl font-bold text-foreground mt-1">
                {stats[c.value]}
              </p>
            </button>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title…"
              className="w-full bg-background border rounded-md pl-9 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
            />
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center justify-center gap-1.5 rounded-md bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow transition-all"
            >
              <Plus className="h-3.5 w-3.5" /> Add Image
            </button>
          )}
        </div>

        {showForm && (
          <form
            onSubmit={handleSubmit}
            className="bg-background border rounded-lg p-6 mb-8 shadow-sm space-y-4"
          >
            <div className="flex items-center justify-between pb-3 border-b">
              <div>
                <h3 className="text-base font-bold text-foreground">
                  Upload new image
                </h3>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Drag and drop or browse to add a photo to the gallery.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-muted-foreground hover:text-foreground p-1.5 hover:bg-secondary rounded-sm transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-foreground mb-1.5">
                Image *
              </label>
              <label
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
                className={`block cursor-pointer rounded-lg border-2 border-dashed transition-all overflow-hidden ${
                  dragOver
                    ? "border-primary bg-primary/5"
                    : previewUrl
                      ? "border-primary/30"
                      : "border-border hover:border-primary/40 bg-secondary/40"
                }`}
              >
                {previewUrl ? (
                  <div className="relative">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-64 object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-foreground/80 to-transparent flex items-end p-4">
                      <div className="flex items-center gap-2 text-background">
                        <ImagePlus className="h-4 w-4" />
                        <span className="text-xs font-medium">
                          {file?.name} · click to replace
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center text-center px-6 py-12">
                    <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mb-3">
                      <UploadCloud className="h-6 w-6 text-primary" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      Drop your image here, or{" "}
                      <span className="text-primary">browse</span>
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      PNG, JPG, WEBP — max ~10 MB recommended
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
              </label>
              {errors.file && (
                <p className="text-destructive text-xs mt-1">{errors.file}</p>
              )}
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-foreground mb-1.5">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="E.g. SSDC Project Expo Highlights"
                  className="w-full border rounded-md bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                />
                {errors.title && (
                  <p className="text-destructive text-xs mt-1">{errors.title}</p>
                )}
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-foreground mb-1.5">
                  Category *
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {CATEGORIES.map((c) => (
                    <button
                      key={c.value}
                      type="button"
                      onClick={() => setCategory(c.value)}
                      className={`text-[11px] font-medium px-2 py-2 rounded-md border transition-all ${
                        category === c.value
                          ? "bg-primary text-primary-foreground border-primary shadow-sm"
                          : "bg-background text-muted-foreground hover:text-foreground hover:border-primary/30"
                      }`}
                    >
                      <div className="text-base leading-none mb-0.5">
                        {c.emoji}
                      </div>
                      {c.label}
                    </button>
                  ))}
                </div>
                {errors.category && (
                  <p className="text-destructive text-xs mt-1">
                    {errors.category}
                  </p>
                )}
              </div>
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
                  <UploadCloud className="h-3.5 w-3.5" />
                )}
                {saving ? "Uploading…" : "Upload image"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  resetForm();
                }}
                className="text-xs text-muted-foreground hover:text-foreground px-3 py-2 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="flex md:hidden flex-wrap gap-1.5 mb-4">
          <FilterChip
            active={filterCat === "all"}
            onClick={() => setFilterCat("all")}
            label="All"
          />
          {CATEGORIES.map((c) => (
            <FilterChip
              key={c.value}
              active={filterCat === c.value}
              onClick={() => setFilterCat(c.value)}
              label={c.label}
            />
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center py-16">
            <Loader2 className="h-5 w-5 text-primary animate-spin" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="bg-background border rounded-lg p-16 text-center">
            <ImageIcon className="h-10 w-10 text-muted-foreground mx-auto mb-3" />
            <p className="text-sm font-medium text-foreground">
              {search || filterCat !== "all"
                ? "No matching images"
                : "No gallery items yet"}
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              {search || filterCat !== "all"
                ? "Try a different filter or search."
                : 'Click "Add Image" to upload the first one.'}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filtered.map((item) => {
              const isEditing = editingId === item.id;
              const itemPath = item.path || getGalleryObjectPath(item.url);

              return (
                <div
                  key={item.id}
                  className="group bg-background border rounded-lg overflow-hidden flex flex-col hover:shadow-lg hover:border-primary/30 transition-all"
                >
                  <div className="relative overflow-hidden aspect-[4/3]">
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute top-2 left-2">
                      <span className="text-[9px] uppercase tracking-wide font-bold text-primary-foreground bg-primary/90 backdrop-blur px-2 py-1 rounded-sm shadow-sm">
                        {item.category}
                      </span>
                    </div>
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-all">
                      <button
                        onClick={() => startEdit(item)}
                        disabled={updatingId === item.id || deletingId === item.id}
                        className="p-2 bg-background/90 backdrop-blur text-muted-foreground hover:text-primary hover:bg-background rounded-md disabled:opacity-50 shadow-sm"
                        title="Edit"
                      >
                        <Pencil className="h-3.5 w-3.5" />
                      </button>
                      <button
                        onClick={() => setDeleteTarget(item)}
                        disabled={deletingId === item.id || updatingId === item.id}
                        className="p-2 bg-background/90 backdrop-blur text-muted-foreground hover:text-destructive hover:bg-background rounded-md disabled:opacity-50 shadow-sm"
                        title="Delete"
                      >
                        {deletingId === item.id ? (
                          <Loader2 className="h-3.5 w-3.5 animate-spin" />
                        ) : (
                          <Trash2 className="h-3.5 w-3.5" />
                        )}
                      </button>
                    </div>
                  </div>
                  <div className="p-3 space-y-3">
                    {isEditing ? (
                      <>
                        <input
                          type="text"
                          value={editTitle}
                          onChange={(e) => setEditTitle(e.target.value)}
                          className="w-full border rounded-md bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        />
                        <select
                          value={editCategory}
                          onChange={(e) =>
                            setEditCategory(e.target.value as GalleryCategory)
                          }
                          className="w-full border rounded-md bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                        >
                          {CATEGORIES.map((c) => (
                            <option key={c.value} value={c.value}>
                              {c.label}
                            </option>
                          ))}
                        </select>
                        <label className="block cursor-pointer rounded-md border border-dashed border-border px-3 py-2 text-xs text-muted-foreground hover:text-foreground hover:border-primary/40 transition-colors">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleEditFile(e.target.files)}
                          />
                          {editFile ? editFile.name : "Replace image (optional)"}
                        </label>
                        <p className="break-all text-[10px] text-muted-foreground">
                          Path: {itemPath ?? "Unknown"}
                        </p>
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleUpdate(item)}
                            disabled={updatingId === item.id}
                            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60 transition-all"
                          >
                            {updatingId === item.id ? (
                              <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <Save className="h-3.5 w-3.5" />
                            )}
                            Save
                          </button>
                          <button
                            type="button"
                            onClick={cancelEdit}
                            className="text-xs text-muted-foreground hover:text-foreground px-3 py-2 transition-colors"
                          >
                            Cancel
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <h3 className="text-sm font-medium text-foreground truncate">
                          {item.title}
                        </h3>
                        <p className="break-all text-[10px] text-muted-foreground">
                          {itemPath ?? "Path unavailable"}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {new Date(item.created_at).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </p>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => !open && setDeleteTarget(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete gallery image?</AlertDialogTitle>
            <AlertDialogDescription>
              This will delete the storage file and remove the gallery record.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="rounded-md border bg-secondary/50 p-3">
            <p className="text-xs font-semibold text-foreground mb-1">File path</p>
            <p className="break-all font-mono text-xs text-muted-foreground">
              {deletePath ?? "Unknown path"}
            </p>
          </div>
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
              {deletingId ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`text-xs px-3 py-1.5 rounded-full border transition-colors ${
        active
          ? "bg-primary text-primary-foreground border-primary"
          : "bg-background text-muted-foreground hover:text-foreground border-border"
      }`}
    >
      {label}
    </button>
  );
}

export default AdminGallery;
