-- Fix RLS for projects
DROP POLICY IF EXISTS "Users can view their own projects" ON public.projects;
CREATE POLICY "Users can view workspace projects" 
ON public.projects 
FOR SELECT 
USING (
  workspace_id IN (SELECT public.get_user_workspace_ids())
);

DROP POLICY IF EXISTS "Users can update their own projects" ON public.projects;
CREATE POLICY "Users can update workspace projects" 
ON public.projects 
FOR UPDATE 
USING (
  workspace_id IN (SELECT public.get_user_workspace_ids())
);

DROP POLICY IF EXISTS "Users can create their own projects" ON public.projects;
CREATE POLICY "Users can create workspace projects" 
ON public.projects 
FOR INSERT 
WITH CHECK (
  workspace_id IN (SELECT public.get_user_workspace_ids())
);

DROP POLICY IF EXISTS "Users can delete their own projects" ON public.projects;
CREATE POLICY "Users can delete workspace projects" 
ON public.projects 
FOR DELETE 
USING (
  workspace_id IN (SELECT public.get_user_workspace_ids())
);

-- Fix RLS for tasks
DROP POLICY IF EXISTS "Users can view tasks" ON public.tasks;
CREATE POLICY "Users can view workspace tasks" 
ON public.tasks 
FOR SELECT 
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
  )
);

DROP POLICY IF EXISTS "Users can update tasks" ON public.tasks;
CREATE POLICY "Users can update workspace tasks" 
ON public.tasks 
FOR UPDATE 
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
  )
);

DROP POLICY IF EXISTS "Users can create tasks" ON public.tasks;
CREATE POLICY "Users can create workspace tasks" 
ON public.tasks 
FOR INSERT 
WITH CHECK (
  project_id IN (
    SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
  )
);

DROP POLICY IF EXISTS "Users can delete tasks" ON public.tasks;
CREATE POLICY "Users can delete workspace tasks" 
ON public.tasks 
FOR DELETE 
USING (
  project_id IN (
    SELECT id FROM public.projects WHERE workspace_id IN (SELECT public.get_user_workspace_ids())
  )
);
