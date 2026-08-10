-- 1. Create the storage bucket named "task-files"
INSERT INTO storage.buckets (id, name, public)
VALUES ('task-files', 'task-files', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Allow authenticated users to upload files
DROP POLICY IF EXISTS "Give users authenticated insert access to folder" ON storage.objects;
CREATE POLICY "Give users authenticated insert access to folder"
ON storage.objects FOR INSERT
WITH CHECK (
  bucket_id = 'task-files' AND 
  auth.role() = 'authenticated'
);

-- 3. Allow authenticated users to read/view files
DROP POLICY IF EXISTS "Give users authenticated access to folder" ON storage.objects;
CREATE POLICY "Give users authenticated access to folder"
ON storage.objects FOR SELECT
USING (
  bucket_id = 'task-files' AND 
  auth.role() = 'authenticated'
);

-- 4. Allow authenticated users to delete files
DROP POLICY IF EXISTS "Give users authenticated delete access" ON storage.objects;
CREATE POLICY "Give users authenticated delete access"
ON storage.objects FOR DELETE
USING (
  bucket_id = 'task-files' AND 
  auth.role() = 'authenticated'
);
