-- Phase 2: Fine-Grained RBAC & RLS Security Audit

-- 1. Helper function: Check if user is Workspace Admin or Owner
CREATE OR REPLACE FUNCTION public.is_workspace_admin(check_workspace_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.workspaces WHERE id = check_workspace_id AND owner_id = auth.uid()
    UNION
    SELECT 1 FROM public.team_members WHERE workspace_id = check_workspace_id AND user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;


-- 2. WORKSPACES
DROP POLICY IF EXISTS "Users can view accessible workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can insert own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Owners can update workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Owners can delete workspaces" ON public.workspaces;

CREATE POLICY "Members can view accessible workspaces" 
ON public.workspaces FOR SELECT 
USING (id IN (SELECT public.get_user_workspace_ids()));

CREATE POLICY "Users can insert own workspaces" 
ON public.workspaces FOR INSERT 
WITH CHECK (auth.uid() = owner_id);

CREATE POLICY "Admins can update workspaces" 
ON public.workspaces FOR UPDATE 
USING (public.is_workspace_admin(id));

CREATE POLICY "Only Owners can delete workspaces" 
ON public.workspaces FOR DELETE 
USING (auth.uid() = owner_id);


-- 3. TEAM MEMBERS
DROP POLICY IF EXISTS "Users can view team members in their workspaces" ON public.team_members;
DROP POLICY IF EXISTS "Admins and owners can manage team members" ON public.team_members;

CREATE POLICY "Members can view team members in their workspaces" 
ON public.team_members FOR SELECT 
USING (workspace_id IN (SELECT public.get_user_workspace_ids()));

CREATE POLICY "Admins can manage team members" 
ON public.team_members FOR ALL 
USING (public.is_workspace_admin(workspace_id));


-- 4. PROJECTS
DROP POLICY IF EXISTS "Users can access projects in their workspaces" ON public.projects;

CREATE POLICY "Members can view projects in their workspaces"
ON public.projects FOR SELECT
USING (workspace_id IN (SELECT public.get_user_workspace_ids()));

CREATE POLICY "Admins can manage projects"
ON public.projects FOR INSERT
WITH CHECK (public.is_workspace_admin(workspace_id));

CREATE POLICY "Admins can update projects"
ON public.projects FOR UPDATE
USING (public.is_workspace_admin(workspace_id));

CREATE POLICY "Admins can delete projects"
ON public.projects FOR DELETE
USING (public.is_workspace_admin(workspace_id));


-- 5. TASKS
DROP POLICY IF EXISTS "Users can access tasks in their workspaces" ON public.tasks;

CREATE POLICY "Members can view tasks in their workspaces"
ON public.tasks FOR SELECT
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
  )
);

CREATE POLICY "Admins can insert tasks"
ON public.tasks FOR INSERT
WITH CHECK (
  public.is_workspace_admin((SELECT workspace_id FROM public.projects WHERE id = project_id))
);

CREATE POLICY "Admins or assigned members can update tasks"
ON public.tasks FOR UPDATE
USING (
  public.is_workspace_admin((SELECT workspace_id FROM public.projects WHERE id = project_id)) OR
  assigned_to = auth.uid()
);

CREATE POLICY "Admins can delete tasks"
ON public.tasks FOR DELETE
USING (
  public.is_workspace_admin((SELECT workspace_id FROM public.projects WHERE id = project_id))
);


-- 6. TASK COMMENTS
DROP POLICY IF EXISTS "Users can access task comments in their workspaces" ON public.task_comments;
DROP POLICY IF EXISTS "Users can insert comments in their workspaces" ON public.task_comments;
DROP POLICY IF EXISTS "Users can update own comments" ON public.task_comments;
DROP POLICY IF EXISTS "Users can delete own comments or workspace admins can delete" ON public.task_comments;

CREATE POLICY "Members can view task comments"
ON public.task_comments FOR SELECT
USING (
  task_id IN (
    SELECT id FROM public.tasks WHERE project_id IN (
      SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
    )
  )
);

CREATE POLICY "Members can insert comments"
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

CREATE POLICY "Users can delete own comments or Admins can delete any"
ON public.task_comments FOR DELETE
USING (
  user_id = auth.uid() OR
  public.is_workspace_admin(
    (SELECT workspace_id FROM public.projects WHERE id = (
      SELECT project_id FROM public.tasks WHERE id = task_id
    ))
  )
);


-- 7. TASK ATTACHMENTS
DROP POLICY IF EXISTS "Users can access task attachments in their workspaces" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can insert attachments in their workspaces" ON public.task_attachments;
DROP POLICY IF EXISTS "Users can delete own attachments or workspace admins can delete" ON public.task_attachments;

CREATE POLICY "Members can view task attachments"
ON public.task_attachments FOR SELECT
USING (
  task_id IN (
    SELECT id FROM public.tasks WHERE project_id IN (
      SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
    )
  )
);

CREATE POLICY "Members can insert task attachments"
ON public.task_attachments FOR INSERT
WITH CHECK (
  uploaded_by = auth.uid() AND
  task_id IN (
    SELECT id FROM public.tasks WHERE project_id IN (
      SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
    )
  )
);

CREATE POLICY "Users can delete own attachments or Admins can delete any"
ON public.task_attachments FOR DELETE
USING (
  uploaded_by = auth.uid() OR
  public.is_workspace_admin(
    (SELECT workspace_id FROM public.projects WHERE id = (
      SELECT project_id FROM public.tasks WHERE id = task_id
    ))
  )
);


-- 8. ACTIVITY LOGS
DROP POLICY IF EXISTS "Users can access activity logs in their workspaces" ON public.activity_logs;
DROP POLICY IF EXISTS "Users can insert activity logs in their workspaces" ON public.activity_logs;

CREATE POLICY "Members can view activity logs"
ON public.activity_logs FOR SELECT
USING (workspace_id IN (SELECT public.get_user_workspace_ids()));

CREATE POLICY "Members can insert activity logs"
ON public.activity_logs FOR INSERT
WITH CHECK (
  user_id = auth.uid() AND
  workspace_id IN (SELECT public.get_user_workspace_ids())
);


-- Reload schema cache
NOTIFY pgrst, 'reload schema';
