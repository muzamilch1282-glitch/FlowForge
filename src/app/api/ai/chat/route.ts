import { openai } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { z } from 'zod';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { messages, workspaceId } = await req.json();

    if (!workspaceId) {
      return NextResponse.json({ error: 'Workspace ID is required' }, { status: 400 });
    }

    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // The `setAll` method was called from a Server Component.
              // This can be ignored if you have middleware refreshing user sessions.
            }
          },
        },
      }
    );

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify workspace access
    const { data: membership } = await supabase
      .from('team_members')
      .select('role')
      .eq('workspace_id', workspaceId)
      .eq('user_id', user.id)
      .single();

    if (!membership) {
      return NextResponse.json({ error: 'Unauthorized workspace access' }, { status: 403 });
    }

    // Process chat stream with tools
    const result = await streamText({
      model: openai('gpt-4o') as any,
      system: `You are the FlowForge AI Assistant, deeply integrated into the user's project management workflow.
      The user's ID is: ${user.id}.
      The current Workspace ID is: ${workspaceId}.
      Your role is to help the user manage projects and tasks, analyze productivity, and suggest priorities.
      Use the provided tools to interact with the database. 
      DO NOT invent data. If a tool fails or returns empty, state that to the user.
      When asked to summarize projects or tasks, use the appropriate tools to fetch the data first, then formulate a concise, helpful summary.
      When asked to create a task, verify all required fields and use the create_task tool.`,
      messages,
      tools: {
        get_overdue_tasks: tool({
          description: 'Fetch all tasks in the current workspace that are past their due date and not completed.',
          parameters: z.object({}),
          execute: async () => {
            const { data, error } = await supabase
              .from('tasks')
              .select('id, title, status, priority, due_date, projects!inner(workspace_id, title)')
              .eq('projects.workspace_id', workspaceId)
              .neq('status', 'completed')
              .lt('due_date', new Date().toISOString())
              .order('due_date', { ascending: true });
            
            if (error) return { error: error.message };
            return { tasks: data };
          },
        }),
        get_project_summary: tool({
          description: 'Fetch the status and task count of a specific project by name.',
          parameters: z.object({
            project_name: z.string().describe('The title of the project to look up'),
          }),
          execute: async ({ project_name }) => {
            // Find project
            const { data: project } = await supabase
              .from('projects')
              .select('id, title, status, description')
              .eq('workspace_id', workspaceId)
              .ilike('title', `%${project_name}%`)
              .single();

            if (!project) return { error: `Project '${project_name}' not found in this workspace.` };

            // Fetch tasks for project
            const { data: tasks } = await supabase
              .from('tasks')
              .select('status')
              .eq('project_id', project.id);

            const completed = tasks?.filter(t => t.status === 'completed').length || 0;
            const total = tasks?.length || 0;
            
            return {
              project,
              stats: { total_tasks: total, completed_tasks: completed },
            };
          }
        }),
        create_task: tool({
          description: 'Create a new task in a specified project.',
          parameters: z.object({
            title: z.string().describe('Title of the task'),
            project_name: z.string().describe('Name of the project to add the task to'),
            priority: z.enum(['low', 'medium', 'high']).optional().describe('Priority of the task'),
            assignee_name: z.string().optional().describe('Name or email of the team member to assign'),
          }),
          execute: async ({ title, project_name, priority = 'medium', assignee_name }) => {
            // 1. Find project
            const { data: project } = await supabase
              .from('projects')
              .select('id')
              .eq('workspace_id', workspaceId)
              .ilike('title', `%${project_name}%`)
              .single();

            if (!project) return { error: `Project '${project_name}' not found.` };

            // 2. Resolve assignee if provided
            let assignee_id = null;
            if (assignee_name) {
              const { data: members } = await supabase
                .from('team_members')
                .select('user_id, profiles!inner(full_name, email)')
                .eq('workspace_id', workspaceId);
              
              if (members) {
                const member = members.find((m: any) => 
                  m.profiles?.full_name?.toLowerCase().includes(assignee_name.toLowerCase()) || 
                  m.profiles?.email?.toLowerCase().includes(assignee_name.toLowerCase())
                );
                if (member) assignee_id = member.user_id;
              }
            }

            // 3. Create task
            const { data: newTask, error } = await supabase
              .from('tasks')
              .insert({
                project_id: project.id,
                title,
                priority,
                status: 'todo',
                assigned_to: assignee_id,
                position: 0
              })
              .select()
              .single();

            if (error) return { error: error.message };

            // 4. Log activity
            await supabase.from('activity_logs').insert({
              workspace_id: workspaceId,
              project_id: project.id,
              user_id: user.id,
              action: 'created',
              entity_type: 'task',
              entity_id: newTask.id,
              entity_name: title,
              metadata: { via: 'ai_assistant' }
            });

            return { success: true, task: newTask, message: `Task '${title}' created successfully.` };
          }
        })
      }
    });

    return result.toDataStreamResponse();
  } catch (error: any) {
    console.error('AI Chat Error:', error);
    return NextResponse.json({ error: error.message || 'An error occurred' }, { status: 500 });
  }
}
