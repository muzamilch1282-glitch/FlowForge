-- Ensure the details column exists in activity_logs
ALTER TABLE public.activity_logs ADD COLUMN IF NOT EXISTS details JSONB;

-- Force Supabase PostgREST to reload its schema cache
NOTIFY pgrst, 'reload schema';
