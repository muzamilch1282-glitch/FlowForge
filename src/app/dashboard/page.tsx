'use client';

import * as React from 'react';
import Link from 'next/link';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useAuth } from '@/hooks/useAuth';
import { useWorkspaceActivity } from '@/hooks/useActivity';
import { useAppStore } from '@/store';
import { isPast, isToday, parseISO, format, isTomorrow, isAfter, startOfDay } from 'date-fns';
import { Circle, Plus, CheckCircle2, Calendar, LayoutDashboard, Ghost, CheckSquare, Clock, AlertTriangle } from 'lucide-react';
import { TaskModal } from '@/components/task/task-modal';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import { Task } from '@/types/task';

export default function DashboardPage() {
  const { user } = useAuth();
  const { tasks, isLoading: tasksLoading, updateTask } = useTasks();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { activeWorkspaceId } = useAppStore();
  const { data: activities, isLoading: activityLoading } = useWorkspaceActivity(activeWorkspaceId || undefined);

  const [editingTask, setEditingTask] = React.useState<Task | null>(null);

  const toggleTaskCompletion = (task: Task, e: React.MouseEvent) => {
    e.stopPropagation();
    updateTask({
      id: task.id,
      data: { status: task.status === 'completed' ? 'todo' : 'completed' }
    });
  };

  const isLoading = tasksLoading || projectsLoading || activityLoading;

  const firstName = user?.user_metadata?.full_name?.split(' ')[0] || 'there';
  const greeting = React.useMemo(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);

  const stats = React.useMemo(() => {
    let completed = 0;
    let overdue = 0;
    let dueToday = 0;
    let highPriority = 0;

    tasks.forEach(t => {
      if (t.status === 'completed') completed++;
      if (t.priority === 'high' && t.status !== 'completed') highPriority++;

      if (t.due_date && t.status !== 'completed') {
        const date = parseISO(t.due_date);
        if (isPast(date) && !isToday(date)) overdue++;
        if (isToday(date)) dueToday++;
      }
    });

    return { completed, overdue, dueToday, highPriority };
  }, [tasks]);

  const activeTasks = React.useMemo(() => tasks.filter(t => t.status !== 'completed'), [tasks]);
  
  // Group upcoming tasks
  const upcomingTasks = React.useMemo(() => {
    const today = startOfDay(new Date());
    const groups: { [key: string]: Task[] } = {
      'Today': [],
      'Tomorrow': [],
      'Later': []
    };
    
    activeTasks.forEach(t => {
      if (!t.due_date) return;
      const date = parseISO(t.due_date);
      if (isPast(date) && !isToday(date)) return; // Exclude overdue from upcoming
      
      if (isToday(date)) {
        groups['Today'].push(t);
      } else if (isTomorrow(date)) {
        groups['Tomorrow'].push(t);
      } else if (isAfter(date, today)) {
        groups['Later'].push(t);
      }
    });
    return groups;
  }, [activeTasks]);

  const recentProjects = projects.slice(0, 4);

  if (isLoading) {
    return (
      <div className="max-w-6xl mx-auto pt-8 pb-12 px-4 sm:px-6 lg:px-8 animate-in fade-in duration-500">
        <Skeleton className="h-10 w-64 mb-4" />
        <div className="flex gap-4 mb-10">
          <Skeleton className="h-24 w-40 rounded-xl" />
          <Skeleton className="h-24 w-40 rounded-xl" />
          <Skeleton className="h-24 w-40 rounded-xl" />
        </div>
        <div className="grid lg:grid-cols-2 gap-8">
          <Skeleton className="h-96 rounded-2xl" />
          <Skeleton className="h-96 rounded-2xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto pt-8 pb-16 px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in duration-500 bg-background/50 min-h-screen">
      
      {/* 1. Page Header & Metric Cards */}
      <section className="flex flex-col gap-6">
        <div>
          <h1 className="text-[32px] leading-tight font-bold text-foreground tracking-tight">
            {greeting}, {firstName}
          </h1>
          <p className="text-[16px] text-muted-foreground mt-1">
            Here's what's happening with your work today.
          </p>
        </div>
        
        {/* Metric Cards Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-primary/50 transition-colors">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Due Today</span>
              <Clock className="w-4 h-4 text-blue-500" />
            </div>
            <span className="text-3xl font-bold text-foreground relative z-10">{stats.dueToday}</span>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all" />
          </div>

          <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-red-500/50 transition-colors">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Overdue</span>
              <AlertTriangle className="w-4 h-4 text-red-500" />
            </div>
            <span className={cn("text-3xl font-bold relative z-10", stats.overdue > 0 ? "text-red-500" : "text-foreground")}>{stats.overdue}</span>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-red-500/10 rounded-full blur-xl group-hover:bg-red-500/20 transition-all" />
          </div>

          <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-amber-500/50 transition-colors">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">High Priority</span>
              <Circle className="w-4 h-4 text-amber-500 fill-amber-500" />
            </div>
            <span className={cn("text-3xl font-bold relative z-10", stats.highPriority > 0 ? "text-amber-500" : "text-foreground")}>{stats.highPriority}</span>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-amber-500/10 rounded-full blur-xl group-hover:bg-amber-500/20 transition-all" />
          </div>

          <div className="bg-card border border-border shadow-sm rounded-xl p-4 flex flex-col gap-2 relative overflow-hidden group hover:border-emerald-500/50 transition-colors">
            <div className="flex items-center justify-between relative z-10">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Completed</span>
              <CheckSquare className="w-4 h-4 text-emerald-500" />
            </div>
            <span className="text-3xl font-bold text-foreground relative z-10">{stats.completed}</span>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-emerald-500/10 rounded-full blur-xl group-hover:bg-emerald-500/20 transition-all" />
          </div>
        </div>
      </section>

      {/* Bento Grid: 2 Columns */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Left Column: My Tasks */}
        <section className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-primary/10 rounded-lg">
                <CheckSquare className="w-4 h-4 text-primary" />
              </div>
              <h2 className="text-[18px] font-bold text-foreground">My Tasks</h2>
            </div>
            <Link href="/dashboard/tasks" className="text-[13px] font-medium text-primary hover:text-primary/80 transition-colors">
              View all
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 space-y-1">
            {activeTasks.length > 0 ? (
              activeTasks.slice(0, 8).map(task => (
                <div 
                  key={task.id} 
                  className="group flex items-center justify-between p-3 border border-transparent hover:border-border/50 hover:bg-secondary/30 transition-all rounded-xl cursor-pointer"
                  onClick={() => setEditingTask(task)}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <button 
                      onClick={(e) => toggleTaskCompletion(task, e)}
                      className="shrink-0 text-muted-foreground/40 hover:text-emerald-500 hover:bg-emerald-500/10 p-1 rounded-full transition-colors focus:outline-none"
                    >
                      {task.status === 'completed' ? (
                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                      ) : (
                        <Circle className="h-5 w-5" />
                      )}
                    </button>
                    <div className="min-w-0 flex flex-col gap-0.5">
                      <p className="text-[14px] font-medium text-foreground truncate group-hover:text-primary transition-colors">{task.title}</p>
                      {task.project_id && (
                         <span className="text-[11px] font-medium text-muted-foreground bg-secondary/80 px-2 py-0.5 rounded-md w-fit truncate">
                           {projects.find(p => p.id === task.project_id)?.title || 'No Project'}
                         </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0 pl-4">
                    {task.due_date && (
                      <span className={cn(
                        "text-[12px] font-semibold px-2 py-1 rounded-md",
                        isPast(parseISO(task.due_date)) && !isToday(parseISO(task.due_date)) ? "bg-red-500/10 text-red-600" : "bg-secondary text-muted-foreground"
                      )}>
                        {format(parseISO(task.due_date), 'MMM d')}
                      </span>
                    )}
                    <span className={cn("h-2 w-2 rounded-full shrink-0", getTaskPriorityColor(task.priority))} />
                  </div>
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4">
                  <CheckSquare className="h-8 w-8 text-muted-foreground/50" />
                </div>
                <p className="text-[15px] font-semibold text-foreground">You're all caught up!</p>
                <p className="text-[13px] text-muted-foreground mt-1 max-w-[200px]">Grab a coffee or take on a new task.</p>
              </div>
            )}
          </div>
        </section>

        {/* Right Column: Upcoming Schedule */}
        <section className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col h-[400px]">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-500/10 rounded-lg">
                <Calendar className="w-4 h-4 text-blue-500" />
              </div>
              <h2 className="text-[18px] font-bold text-foreground">Schedule</h2>
            </div>
            <Link href="/dashboard/calendar" className="text-[13px] font-medium text-primary hover:text-primary/80 transition-colors">
              Full calendar
            </Link>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-2 -mr-2 flex flex-col gap-6">
            {Object.entries(upcomingTasks).some(([_, t]) => t.length > 0) ? (
              Object.entries(upcomingTasks).map(([label, groupTasks]) => {
                if (groupTasks.length === 0) return null;
                return (
                  <div key={label} className="flex flex-col gap-3">
                    <h3 className="text-[11px] font-bold text-muted-foreground uppercase tracking-widest pl-2">{label}</h3>
                    <div className="flex flex-col gap-2">
                      {groupTasks.map(task => (
                        <div 
                          key={task.id} 
                          className="group flex items-center justify-between p-3 bg-secondary/30 hover:bg-secondary/60 border border-transparent hover:border-border/50 transition-all rounded-xl cursor-pointer"
                          onClick={() => setEditingTask(task)}
                        >
                          <div className="min-w-0 flex flex-1 flex-row items-center gap-3">
                            <button 
                              onClick={(e) => toggleTaskCompletion(task, e)}
                              className="shrink-0 text-muted-foreground/40 hover:text-emerald-500 hover:bg-emerald-500/10 p-1 rounded-full transition-colors focus:outline-none"
                            >
                              {task.status === 'completed' ? (
                                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                              ) : (
                                <Circle className="h-4 w-4" />
                              )}
                            </button>
                            <p className="text-[14px] font-medium text-foreground truncate">{task.title}</p>
                          </div>
                          {label === 'Later' && task.due_date && (
                            <span className="text-[12px] font-medium text-muted-foreground shrink-0 ml-4">
                              {format(parseISO(task.due_date), 'MMM d')}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-70">
                <div className="w-16 h-16 bg-blue-500/5 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-8 w-8 text-blue-500/40" />
                </div>
                <p className="text-[15px] font-semibold text-foreground">Clear schedule</p>
                <p className="text-[13px] text-muted-foreground mt-1 max-w-[200px]">Nothing pressing on the horizon.</p>
              </div>
            )}
          </div>
        </section>

      </div>

      {/* Bento Grid: 2 Columns Lower */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Recent Projects */}
        <section className="bg-card border border-border shadow-sm rounded-2xl p-6">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-indigo-500/10 rounded-lg">
              <LayoutDashboard className="w-4 h-4 text-indigo-500" />
            </div>
            <h2 className="text-[18px] font-bold text-foreground">Active Projects</h2>
          </div>
          
          <div className="grid grid-cols-1 gap-4">
            {recentProjects.length > 0 ? (
              recentProjects.map(project => {
                const projectTasks = tasks.filter(t => t.project_id === project.id);
                const completedTasks = projectTasks.filter(t => t.status === 'completed').length;
                const progress = projectTasks.length > 0 ? Math.round((completedTasks / projectTasks.length) * 100) : 0;
                const remainingTasks = projectTasks.length - completedTasks;
                const health = getProjectHealth(project, tasks);
                
                return (
                  <Link href={`/dashboard/projects/${project.id}`} key={project.id} className="block">
                    <div className="group flex flex-col p-4 border border-border/60 rounded-xl bg-background hover:bg-secondary/20 hover:border-indigo-500/30 hover:shadow-md transition-all hover:-translate-y-0.5 duration-300">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <span className="text-[16px] font-bold text-foreground truncate block">{project.title}</span>
                          {project.description && (
                            <p className="text-[13px] text-muted-foreground line-clamp-1 mt-1">{project.description}</p>
                          )}
                        </div>
                        <ProjectHealthBadge state={health.state as any} />
                      </div>
                      
                      <div className="mt-4 flex flex-col gap-2">
                        <div className="flex items-center justify-between text-[12px] font-medium text-muted-foreground">
                          <span>{remainingTasks} tasks left</span>
                          <span className="text-foreground">{progress}%</span>
                        </div>
                        <div className="h-2 w-full bg-secondary rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-indigo-500 rounded-full transition-all duration-1000 ease-out" 
                            style={{ width: `${progress}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
               <div className="py-12 text-center flex flex-col items-center border border-border/40 rounded-xl border-dashed bg-secondary/20">
                  <div className="w-12 h-12 bg-indigo-500/10 rounded-full flex items-center justify-center mb-3">
                    <Plus className="h-5 w-5 text-indigo-500" />
                  </div>
                  <p className="text-[14px] font-medium text-foreground">No projects yet.</p>
                  <p className="text-[13px] text-muted-foreground mt-1">Create your first project to get started.</p>
                </div>
            )}
          </div>
        </section>

        {/* Recent Activity */}
        <section className="bg-card border border-border shadow-sm rounded-2xl p-6 flex flex-col h-full min-h-[400px]">
          <div className="flex items-center gap-2 mb-6">
            <div className="p-2 bg-emerald-500/10 rounded-lg">
              <Circle className="w-4 h-4 text-emerald-500" />
            </div>
            <h2 className="text-[18px] font-bold text-foreground">Recent Activity</h2>
          </div>
          
          <div className="flex-1 flex flex-col">
            {activities && activities.length > 0 ? (
              <div className="space-y-4">
                {activities.slice(0, 5).map(activity => (
                  <div key={activity.id} className="flex gap-4 items-start p-3 bg-secondary/20 hover:bg-secondary/50 rounded-xl transition-colors">
                    <div className="shrink-0 mt-0.5">
                      <Avatar className="h-8 w-8 border border-border shadow-sm">
                        <AvatarImage src={activity.profile?.avatar_url || ''} />
                        <AvatarFallback className="text-[10px] bg-emerald-500 text-white font-bold uppercase">
                          {activity.profile?.full_name?.charAt(0) || activity.profile?.email?.charAt(0) || 'U'}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[14px] text-foreground/90 leading-snug">
                        <span className="font-semibold text-foreground">{activity.profile?.full_name || 'Someone'}</span>
                        {' '}{activity.action}{' '}
                        <span className="font-medium text-muted-foreground">{activity.entity_type}</span>{' '}
                        <span className="font-semibold text-foreground">{activity.entity_name}</span>
                      </p>
                      <p className="text-[12px] font-medium text-muted-foreground mt-1">
                        {format(parseISO(activity.created_at), 'MMM d, h:mm a')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-60 flex-1">
                 <div className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mb-4">
                   <Ghost className="h-8 w-8 text-muted-foreground/60" />
                 </div>
                 <p className="text-[15px] font-semibold text-foreground">It's quiet in here...</p>
                 <p className="text-[13px] text-muted-foreground mt-1">Enjoy the peace and quiet.</p>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}

function getProjectHealth(project: any, tasks: Task[]) {
  const projectTasks = tasks.filter(t => t.project_id === project.id);
  const overdue = projectTasks.filter(t => t.due_date && isPast(parseISO(t.due_date)) && !isToday(parseISO(t.due_date)) && t.status !== 'completed');
  if (overdue.length > 2) return { state: 'Delayed' };
  if (overdue.length > 0) return { state: 'At Risk' };
  return { state: 'On Track' };
}

function getTaskPriorityColor(priority: string) {
  switch (priority) {
    case 'high': return 'bg-red-500';
    case 'medium': return 'bg-amber-500';
    default: return 'bg-blue-500'; 
  }
}

function ProjectHealthBadge({ state }: { state: 'On Track' | 'At Risk' | 'Delayed' }) {
  const colors = {
    'On Track': 'text-emerald-700 bg-emerald-50 border-emerald-200 dark:bg-emerald-500/10 dark:border-emerald-500/20 dark:text-emerald-400',
    'At Risk': 'text-amber-700 bg-amber-50 border-amber-200 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400',
    'Delayed': 'text-red-700 bg-red-50 border-red-200 dark:bg-red-500/10 dark:border-red-500/20 dark:text-red-400'
  };
  const dots = {
    'On Track': 'bg-emerald-500',
    'At Risk': 'bg-amber-500',
    'Delayed': 'bg-red-500'
  };
  return (
    <div className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border text-[11px] font-bold shrink-0", colors[state])}>
      <span className={cn("w-1.5 h-1.5 rounded-full shadow-sm", dots[state])} />
      {state}
    </div>
  );
}
