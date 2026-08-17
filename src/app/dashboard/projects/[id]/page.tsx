'use client';

import * as React from 'react';
import { use } from 'react';
import Link from 'next/link';
import { ArrowLeft, Edit, LayoutList, Calendar, Building2, Plus, KanbanSquare, AlignLeft, FileText, Activity } from 'lucide-react';
import { useProjectById } from '@/hooks/useProjects';
import { useWorkspaceById } from '@/hooks/useWorkspace';
import { useTasksByProject, useTasks } from '@/hooks/useTasks'; 
import { Button, Badge } from '@/components/shared';
import { ProjectMembers } from '@/components/project/project-members';
import { LoadingSpinner } from '@/components/shared/loading-spinner';
import { ProjectOverviewTab } from '@/components/project/project-overview-tab';
import { KanbanBoard } from '@/components/kanban/kanban-board';
import { ProjectHeader } from '@/components/project/project-header';
import { ProjectActivityTab } from '@/components/project/project-activity-tab';
import { ProjectAnalyticsTab } from '@/components/project/project-analytics-tab';
import { TimelineView } from '@/components/project/timeline-view';
import { TaskTable } from '@/components/task/task-table';
import { TaskDetailDrawer } from '@/components/task/task-detail-drawer';
import { TaskModal } from '@/components/task/task-modal';
import { AutomationBuilder } from '@/components/automations/automation-builder';
import { BarChart2 } from 'lucide-react';
import { defaultColumns, BoardState } from '@/types/kanban';
import { TaskStatus, Task } from '@/types/task';
import { cn } from '@/lib/utils';

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const projectId = resolvedParams.id;
  
  const { data: project, isLoading: isProjectLoading, error } = useProjectById(projectId);
  const { data: workspace, isLoading: isWorkspaceLoading } = useWorkspaceById(project?.workspace_id || '');
  const { data: tasks, isLoading: isTasksLoading } = useTasksByProject(projectId);
  const { createTask, updateTask, deleteTask, isCreating, isUpdating } = useTasks();

  const [activeTab, setActiveTab] = React.useState<'overview' | 'board' | 'list' | 'timeline' | 'calendar' | 'analytics' | 'activity'>('overview');
  
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);
  const [viewingTask, setViewingTask] = React.useState<Task | null>(null);
  
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const [isAutomationsOpen, setIsAutomationsOpen] = React.useState(false);

  const initialBoardState = React.useMemo(() => {
    const state: BoardState = { backlog: [], todo: [], 'in-progress': [], review: [], completed: [] };
    if (tasks) {
      tasks.forEach(task => {
        if (state[task.status]) {
          state[task.status].push(task);
        } else {
          state['todo'].push(task); // Fallback
        }
      });
    }
    return state;
  }, [tasks]);

  const handleTaskMove = (taskId: string, newStatus: TaskStatus) => {
    updateTask({ id: taskId, data: { status: newStatus } });
  };
  
  const handleViewTask = (task: Task) => {
    setViewingTask(task);
    setIsDrawerOpen(true);
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };
  
  const handleDeleteTask = (task: Task) => {
    if (window.confirm(`Are you sure you want to delete task "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };
  
  const handleCreateNewTask = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleSubmitTask = (data: any) => {
    if (editingTask) {
      updateTask(
        { id: editingTask.id, data },
        { onSuccess: () => setIsModalOpen(false) }
      );
    } else {
      createTask(
        { ...data, project_id: project?.id },
        { onSuccess: () => setIsModalOpen(false) }
      );
    }
  };

  if (isProjectLoading || (project && isWorkspaceLoading) || isTasksLoading) {
    return (
      <div className="flex h-[50vh] items-center justify-center">
        <LoadingSpinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-4 text-center">
        <h2 className="text-xl font-semibold text-foreground">Project not found</h2>
        <p className="text-muted-foreground">The project you're looking for doesn't exist or you don't have access.</p>
        <Link href="/dashboard/projects">
          <Button variant="outline">Back to Projects</Button>
        </Link>
      </div>
    );
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutList },
    { id: 'board', label: 'Board', icon: KanbanSquare },
    { id: 'list', label: 'List', icon: AlignLeft },
    { id: 'timeline', label: 'Timeline', icon: Activity },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'activity', label: 'Activity', icon: Activity },
  ] as const;

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] animate-in fade-in duration-500">
      
      {/* Scrollable container for page content */}
      <div className="flex-1 overflow-y-auto">
        <div className="space-y-6 pb-12 max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          
          <ProjectHeader 
            project={project} 
            workspace={workspace || undefined} 
            onAddTask={handleCreateNewTask}
            onAutomations={() => setIsAutomationsOpen(true)}
          />

          {/* Navigation Tabs */}
          <div className="border-b border-border/60 mt-2">
            <div className="flex gap-6 overflow-x-auto scrollbar-hide">
              {tabs.map(tab => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={cn(
                      "flex items-center gap-2 pb-3 pt-1 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                      isActive 
                        ? "border-primary text-primary" 
                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Content Area */}
          <div className="mt-6">
            {activeTab === 'overview' && (
              <ProjectOverviewTab project={project} tasks={tasks || []} workspaceId={workspace?.id || ''} />
            )}
            
            {activeTab === 'board' && (
              <div className="h-[calc(100vh-280px)] min-h-[500px]">
                <KanbanBoard 
                  initialBoardState={initialBoardState} 
                  columns={defaultColumns} 
                  projects={[project]} 
                  onTaskMove={handleTaskMove}
                />
              </div>
            )}
            
            {activeTab === 'list' && (
              <div className="animate-in fade-in duration-300">
                <TaskTable
                  tasks={tasks || []}
                  projects={[project]}
                  isLoading={isTasksLoading}
                  hasProjects={true}
                  onEdit={handleEditTask}
                  onDelete={handleDeleteTask}
                  onView={handleViewTask}
                  onCreateNew={handleCreateNewTask}
                />
              </div>
            )}

            {activeTab === 'timeline' && (
              <div className="h-[calc(100vh-280px)] min-h-[500px]">
                <TimelineView tasks={tasks || []} projects={[project]} />
              </div>
            )}
            
            {activeTab === 'analytics' && (
              <ProjectAnalyticsTab project={project} tasks={tasks || []} />
            )}

            {activeTab === 'activity' && (
              <ProjectActivityTab projectId={project.id} />
            )}
          </div>
          
        </div>
      </div>
      
      <TaskDetailDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        task={viewingTask}
        project={project}
      />

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        task={editingTask}
        projects={[project]}
        onSubmit={handleSubmitTask}
        isSubmitting={isCreating || isUpdating}
      />

      {isAutomationsOpen && workspace && (
        <AutomationBuilder 
          workspaceId={workspace.id}
          existingRule={null} 
          onClose={() => setIsAutomationsOpen(false)} 
        />
      )}
    </div>
  );
}
