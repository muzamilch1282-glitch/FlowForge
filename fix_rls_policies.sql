-- Fix RLS Policies for automation_rules and time_entries

-- ==========================================
-- 1. AUTOMATION RULES RLS FIXES
-- ==========================================
DROP POLICY IF EXISTS "Users can view automation rules in their workspaces" ON public.automation_rules;
DROP POLICY IF EXISTS "Admins can create automation rules" ON public.automation_rules;
DROP POLICY IF EXISTS "Admins can update automation rules" ON public.automation_rules;
DROP POLICY IF EXISTS "Admins can delete automation rules" ON public.automation_rules;

CREATE POLICY "Users can view automation rules in their workspaces"
    ON public.automation_rules
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workspaces w
            WHERE w.id = workspace_id
            AND w.owner_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.workspace_id = workspace_id
            AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Admins can create automation rules"
    ON public.automation_rules
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.workspaces w
            WHERE w.id = workspace_id
            AND w.owner_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.workspace_id = workspace_id
            AND tm.user_id = auth.uid()
            AND tm.role = 'admin'
        )
    );

CREATE POLICY "Admins can update automation rules"
    ON public.automation_rules
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.workspaces w
            WHERE w.id = workspace_id
            AND w.owner_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.workspace_id = workspace_id
            AND tm.user_id = auth.uid()
            AND tm.role = 'admin'
        )
    );

CREATE POLICY "Admins can delete automation rules"
    ON public.automation_rules
    FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.workspaces w
            WHERE w.id = workspace_id
            AND w.owner_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.workspace_id = workspace_id
            AND tm.user_id = auth.uid()
            AND tm.role = 'admin'
        )
    );


-- ==========================================
-- 2. TIME ENTRIES RLS FIXES
-- ==========================================
DROP POLICY IF EXISTS "Users can view time entries in their workspaces" ON public.time_entries;
DROP POLICY IF EXISTS "Users can insert their own time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Users can update their own time entries" ON public.time_entries;
DROP POLICY IF EXISTS "Users can delete their own time entries" ON public.time_entries;

CREATE POLICY "Users can view time entries in their workspaces"
    ON public.time_entries
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM public.workspaces w
            WHERE w.id = workspace_id
            AND w.owner_id = auth.uid()
        )
        OR
        EXISTS (
            SELECT 1 FROM public.team_members tm
            WHERE tm.workspace_id = workspace_id
            AND tm.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert their own time entries"
    ON public.time_entries
    FOR INSERT
    WITH CHECK (
        auth.uid() = user_id AND (
            EXISTS (
                SELECT 1 FROM public.workspaces w
                WHERE w.id = workspace_id
                AND w.owner_id = auth.uid()
            )
            OR
            EXISTS (
                SELECT 1 FROM public.team_members tm
                WHERE tm.workspace_id = workspace_id
                AND tm.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can update their own time entries"
    ON public.time_entries
    FOR UPDATE
    USING (
        auth.uid() = user_id AND (
            EXISTS (
                SELECT 1 FROM public.workspaces w
                WHERE w.id = workspace_id
                AND w.owner_id = auth.uid()
            )
            OR
            EXISTS (
                SELECT 1 FROM public.team_members tm
                WHERE tm.workspace_id = workspace_id
                AND tm.user_id = auth.uid()
            )
        )
    );

CREATE POLICY "Users can delete their own time entries"
    ON public.time_entries
    FOR DELETE
    USING (
        auth.uid() = user_id AND (
            EXISTS (
                SELECT 1 FROM public.workspaces w
                WHERE w.id = workspace_id
                AND w.owner_id = auth.uid()
            )
            OR
            EXISTS (
                SELECT 1 FROM public.team_members tm
                WHERE tm.workspace_id = workspace_id
                AND tm.user_id = auth.uid()
            )
        )
    );
