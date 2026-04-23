-- ============================================================================
-- Project admin: table + storage bucket
-- Safe to run multiple times (uses IF NOT EXISTS)
-- ============================================================================

-- 1. Table
CREATE TABLE IF NOT EXISTS public.project (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text,
  full_description text,
  category text NOT NULL CHECK (category IN ('AI', 'EV', 'IoT')),
  image_url text,
  storage_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 2. RLS
ALTER TABLE public.project ENABLE ROW LEVEL SECURITY;

-- Public can read all projects
DROP POLICY IF EXISTS "project_select_all" ON public.project;
CREATE POLICY "project_select_all"
  ON public.project FOR SELECT
  USING (true);

-- Authenticated users can insert / update / delete
DROP POLICY IF EXISTS "project_insert_authenticated" ON public.project;
CREATE POLICY "project_insert_authenticated"
  ON public.project FOR INSERT
  TO authenticated
  WITH CHECK (true);

DROP POLICY IF EXISTS "project_update_authenticated" ON public.project;
CREATE POLICY "project_update_authenticated"
  ON public.project FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

DROP POLICY IF EXISTS "project_delete_authenticated" ON public.project;
CREATE POLICY "project_delete_authenticated"
  ON public.project FOR DELETE
  TO authenticated
  USING (true);

-- 3. Storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('project', 'project', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- 4. Storage policies
DROP POLICY IF EXISTS "project_bucket_read" ON storage.objects;
CREATE POLICY "project_bucket_read"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'project');

DROP POLICY IF EXISTS "project_bucket_insert" ON storage.objects;
CREATE POLICY "project_bucket_insert"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (bucket_id = 'project');

DROP POLICY IF EXISTS "project_bucket_update" ON storage.objects;
CREATE POLICY "project_bucket_update"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (bucket_id = 'project')
  WITH CHECK (bucket_id = 'project');

DROP POLICY IF EXISTS "project_bucket_delete" ON storage.objects;
CREATE POLICY "project_bucket_delete"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (bucket_id = 'project');
