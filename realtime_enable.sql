-- Phase 3: Supabase Realtime Collaboration

-- 1. Create the publication if it doesn't already exist (Supabase creates it by default, but this ensures safety)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime'
  ) THEN
    CREATE PUBLICATION supabase_realtime;
  END IF;
END
$$;

-- 2. Add the required tables to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE tasks;
ALTER PUBLICATION supabase_realtime ADD TABLE task_comments;
ALTER PUBLICATION supabase_realtime ADD TABLE notifications;
ALTER PUBLICATION supabase_realtime ADD TABLE activity_logs;
