import { TaskDependency } from '../types/task';
import { getSupabaseClient } from '../lib/supabase';
import { activityService } from './activity.service';

export const taskDependencyService = {
  // Get tasks that this task depends on (Blocked By)
  async getDependencies(taskId: string): Promise<TaskDependency[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('task_dependencies')
      .select(`
        *,
        depends_on_task:tasks!task_dependencies_depends_on_task_id_fkey(*)
      `)
      .eq('task_id', taskId);

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Get tasks that depend on this task (Blocks)
  async getDependentTasks(taskId: string): Promise<TaskDependency[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('task_dependencies')
      .select(`
        *,
        dependent_task:tasks!task_dependencies_task_id_fkey(*)
      `)
      .eq('depends_on_task_id', taskId);

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Get all dependencies for a project (useful for cycle detection)
  async getProjectDependencies(projectId: string): Promise<{ task_id: string, depends_on_task_id: string }[]> {
    const supabase = getSupabaseClient();
    const { data, error } = await supabase
      .from('task_dependencies')
      .select(`
        task_id,
        depends_on_task_id,
        dependent_task:tasks!task_dependencies_task_id_fkey!inner(project_id)
      `)
      .eq('dependent_task.project_id', projectId);

    if (error) throw new Error(error.message);
    return data || [];
  },

  // Add dependency
  async addDependency(taskId: string, dependsOnTaskId: string, projectId: string): Promise<TaskDependency> {
    const supabase = getSupabaseClient();
    
    if (taskId === dependsOnTaskId) {
      throw new Error('A task cannot depend on itself.');
    }

    // Cycle detection logic
    const allDeps = await this.getProjectDependencies(projectId);
    
    // Build adjacency list for DFS
    const graph: Record<string, string[]> = {};
    allDeps.forEach(dep => {
      if (!graph[dep.task_id]) graph[dep.task_id] = [];
      graph[dep.task_id].push(dep.depends_on_task_id);
    });

    // Temporarily add the proposed edge to check for cycle
    if (!graph[taskId]) graph[taskId] = [];
    graph[taskId].push(dependsOnTaskId);

    const visited = new Set<string>();
    const recStack = new Set<string>();

    const isCyclic = (node: string): boolean => {
      if (!visited.has(node)) {
        visited.add(node);
        recStack.add(node);

        const edges = graph[node] || [];
        for (const neighbor of edges) {
          if (!visited.has(neighbor) && isCyclic(neighbor)) {
            return true;
          } else if (recStack.has(neighbor)) {
            return true;
          }
        }
      }
      recStack.delete(node);
      return false;
    };

    if (isCyclic(taskId)) {
      throw new Error('This dependency would create a circular loop.');
    }

    const { data, error } = await supabase
      .from('task_dependencies')
      .insert({ task_id: taskId, depends_on_task_id: dependsOnTaskId })
      .select(`
        *,
        depends_on_task:tasks!task_dependencies_depends_on_task_id_fkey(*)
      `)
      .single();

    if (error) {
      if (error.code === '23505') throw new Error('Dependency already exists.');
      throw new Error(error.message);
    }

    // Optional: Log activity
    try {
      const { data: project } = await supabase.from('projects').select('workspace_id').eq('id', projectId).single();
      const { data: mainTask } = await supabase.from('tasks').select('title').eq('id', taskId).single();
      const { data: depTask } = await supabase.from('tasks').select('title').eq('id', dependsOnTaskId).single();
      
      if (project && mainTask && depTask) {
        await activityService.createActivity({
          workspace_id: project.workspace_id,
          project_id: projectId,
          task_id: taskId,
          action: 'updated',
          entity_type: 'task',
          entity_name: `Dependency on ${depTask.title}`
        });
      }
    } catch (e) {
      console.error('Failed to log dependency activity', e);
    }

    return data;
  },

  // Remove dependency
  async removeDependency(dependencyId: string): Promise<void> {
    const supabase = getSupabaseClient();
    
    const { data: depInfo } = await supabase
      .from('task_dependencies')
      .select('task_id, depends_on_task_id')
      .eq('id', dependencyId)
      .single();

    const { error } = await supabase
      .from('task_dependencies')
      .delete()
      .eq('id', dependencyId);

    if (error) throw new Error(error.message);

    if (depInfo) {
      try {
        const { data: task } = await supabase.from('tasks').select('project_id').eq('id', depInfo.task_id).single();
        if (task) {
          const { data: project } = await supabase.from('projects').select('workspace_id').eq('id', task.project_id).single();
          if (project) {
            await activityService.createActivity({
              workspace_id: project.workspace_id,
              project_id: task.project_id,
              task_id: depInfo.task_id,
              action: 'updated',
              entity_type: 'task',
              entity_name: 'Task Dependency'
            });
          }
        }
      } catch (e) {
         console.error('Failed to log dependency removal', e);
      }
    }
  }
};
