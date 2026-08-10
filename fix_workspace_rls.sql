-- Update workspaces RLS to allow members to view the workspace
DROP POLICY IF EXISTS "Users can view own workspaces" ON public.workspaces;
DROP POLICY IF EXISTS "Users can view workspaces they are members of" ON public.workspaces;

CREATE POLICY "Users can view workspaces they are members of" 
ON public.workspaces 
FOR SELECT 
USING (
  id IN (SELECT public.get_user_workspace_ids())
);
