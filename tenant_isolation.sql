-- Phase 1: Multi-Tenant Architecture & Tenant Isolation

-- Ensure UUID extension is enabled
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 1. Create a secure, centralized SECURITY DEFINER function to get user's accessible workspaces
CREATE OR REPLACE FUNCTION public.get_user_workspace_ids()
RETURNS SETOF UUID AS $$
BEGIN
  RETURN QUERY
  SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
  UNION
  SELECT workspace_id FROM public.team_members WHERE user_id = auth.uid();
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. WORKSPACES (Tenant Root)
-- Drop existing policies
DROP POLICY IF EXISTS "Users can view own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can insert own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can update own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can delete own workspaces" ON public.workspaces;

-- Create Tenant-Aware Policies
CREATE POLICY "Users can view accessible workspaces" 
ON public.workspaces FOR SELECT 
USING (id IN (SELECT public.get_user_workspace_ids()));

CREATE POLICY "Users can insert own workspaces" 
ON public.workspaces FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Owners can update workspaces" 
ON public.workspaces FOR UPDATE 
USING (auth.uid() = owner_id);

CREATE POLICY "Owners can delete workspaces" 
ON public.workspaces FOR DELETE 
USING (auth.uid() = owner_id);


-- 3. TEAM MEMBERS
DROP POLICY IF EXISTS "Users can view team members of their workspaces" ON public.team_members;
DROP POLICY IF EXISTS "Admins and owners can insert team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins and owners can update team members" ON public.team_members;
DROP POLICY IF EXISTS "Admins and owners can delete team members" ON public.team_members;

CREATE POLICY "Users can view team members in their workspaces" 
ON public.team_members FOR SELECT 
USING (workspace_id IN (SELECT public.get_user_workspace_ids()));

CREATE POLICY "Admins and owners can manage team members" 
ON public.team_members FOR ALL 
USING (
  workspace_id IN (SELECT id FROM public.workspaces WHERE owner_id = auth.uid()) OR
  workspace_id IN (SELECT workspace_id FROM public.team_members WHERE user_id = auth.uid() AND role = 'admin')
);


-- 4. PROJECTS
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;

CREATE POLICY "Users can access projects in their workspaces"
ON public.projects FOR ALL
USING (workspace_id IN (SELECT public.get_user_workspace_ids()));


-- 5. TASKS
DROP POLICY IF EXISTS "Users can view tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Users can delete tasks" ON public.tasks;

CREATE POLICY "Users can access tasks in their workspaces"
ON public.tasks FOR ALL
USING (
  project_id IN (
    SELECT id FROM public.projects 
    WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
  )
);


-- 6. TASK COMMENTS
DROP POLICY IF EXISTS "Users can view task comments in their workspaces" ON public.task_comments;
DROP POLICY IF EXISTS "Users can insert task comments in their workspaces" ON public.task_comments;
DROP POLICY IF EXISTS "Users can update their own comments" ON public.task_comments;
DROP POLICY IF EXISTS "Users can delete their own comments or admins can delete any" ON public.task_comments;
DROP POLICY IF EXISTS "Users can access task comments in their workspaces" ON public.task_comments;
DROP POLICY IF EXISTS "Users can insert comments in their workspaces" ON public.task_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.task_comments;
DROP POLICY IF EXISTS "Users can delete own comments or workspace admins can delete" ON public.task_comments;

CREATE POLICY "Users can access task comments in their workspaces"
ON public.task_comments FOR SELECT
USING (
  task_id IN (
    SELECT id FROM public.tasks WHERE project_id IN (
      SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
    )
  )
);

CREATE POLICY "Users can insert comments in their workspaces"
ON public.task_comments FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
  task_id IN (
    SELECT id FROM public.tasks WHERE project_id IN (
      SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
    )
  )
);

CREATE POLICY "Users can update own comments"
ON public.task_comments FOR UPDATE
USING (user_id = auth.uid());

CREATE POLICY "Users can delete own comments or workspace admins can delete"
ON public.task_comments FOR DELETE
USING (
  user_id = auth.uid() OR
  task_id IN (
    SELECT id FROM public.tasks WHERE project_id IN (
      SELECT id FROM public.projects WHERE workspace_id IN (
        SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM public.team_members WHERE user_id = auth.uid() AND role = 'admin'
      )
    )
  )
);


-- 7. TASK ATTACHMENTS
DROP POLICY IF EXISTS "Users can view task attachments in their workspaces" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can insert task attachments in their workspaces" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can delete their own attachments or admins can delete any" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can access task attachments in their workspaces" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can insert attachments in their workspaces" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can delete own attachments or workspace admins can delete" ON public.task_attachments;

CREATE POLICY "Users can access task attachments in their workspaces"
ON public.task_attachments FOR SELECT
USING (
  task_id IN (
    SELECT id FROM public.tasks WHERE project_id IN (
      SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
    )
  )
);

CREATE POLICY "Users can insert attachments in their workspaces"
ON public.task_attachments FOR INSERT
WITH CHECK (
  uploaded_by = auth.uid() AND
  task_id IN (
    SELECT id FROM public.tasks WHERE project_id IN (
      SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
    )
  )
);

CREATE POLICY "Users can delete own attachments or workspace admins can delete"
ON public.task_attachments FOR DELETE
USING (
  uploaded_by = auth.uid() OR
  task_id IN (
    SELECT id FROM public.tasks WHERE project_id IN (
      SELECT id FROM public.projects WHERE workspace_id IN (
        SELECT id FROM public.workspaces WHERE owner_id = auth.uid()
        UNION
        SELECT workspace_id FROM public.team_members WHERE user_id = auth.uid() AND role = 'admin'
      )
    )
  )
);


-- 8. ACTIVITY LOGS
DROP POLICY IF EXISTS "Users can view activity logs in their workspaces" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can insert activity logs in their workspaces" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can access activity logs in their workspaces" ON public.activity_logs;

CREATE POLICY "Users can access activity logs in their workspaces"
ON public.activity_logs FOR SELECT
USING (workspace_id IN (SELECT public.get_user_workspace_ids()));

CREATE POLICY "Users can insert activity logs in their workspaces"
ON public.activity_logs FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
  workspace_id IN (SELECT public.get_user_workspace_ids())
);


-- 9. NOTIFICATIONS
DROP POLICY IF EXISTS "Users can manage their own notifications" ON public.notifications;

CREATE POLICY "Users can manage their own notifications"
ON public.notifications FOR ALL
USING (user_id = auth.uid());

-- Reload schema cache to apply all changes instantly
NOTIFY pgrst, 'reload schema';
