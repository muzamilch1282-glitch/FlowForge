'use client';

import * as React from 'react';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { isPast, isToday, parseISO } from 'date-fns';
import { 
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, 
  PieChart, Pie, Cell, Legend 
} from 'recharts';
import { Target, CheckSquare, Activity, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import { TimeEntry } from '@/types/time';

interface ProjectAnalyticsTabProps {
  project: Project;
  tasks: Task[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-background border border-border/60 p-3 rounded-lg shadow-lg">
        <p className="text-sm font-semibold mb-1 text-foreground">{label || payload[0].name}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs text-muted-foreground">
            <span className="inline-block w-2 h-2 rounded-full mr-2" style={{ backgroundColor: entry.color || entry.fill }} />
            <span className="font-medium text-foreground">{entry.value}</span> {entry.dataKey !== 'value' ? entry.dataKey : ''}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

import { useQuery } from '@tanstack/react-query';
import { timeService } from '@/services/time.service';
import { formatDuration } from '@/hooks/useTimeTracking';
import { Clock } from 'lucide-react';

export function ProjectAnalyticsTab({ project, tasks }: ProjectAnalyticsTabProps) {
  const { data: timeEntries = [] } = useQuery({
    queryKey: ['project_time_entries', project.id],
    queryFn: () => timeService.getEntriesByTasks(tasks.map(t => t.id)),
    enabled: tasks.length > 0,
  });

  const { data: activeTimer } = useQuery({
    queryKey: ['active_timer'],
    queryFn: () => timeService.getActiveTimer(),
  });

  const [liveDuration, setLiveDuration] = React.useState(0);
  const isTimerActiveInProject = activeTimer && tasks.some(t => t.id === activeTimer.task_id);

  React.useEffect(() => {
    let interval: NodeJS.Timeout;
    if (activeTimer && isTimerActiveInProject) {
      const startedAt = new Date(activeTimer.started_at).getTime();
      const updateDuration = () => {
        const now = Date.now();
        setLiveDuration(Math.max(0, Math.floor((now - startedAt) / 1000)));
      };
      updateDuration();
      interval = setInterval(updateDuration, 1000);
    } else {
      setLiveDuration(0);
    }
    return () => clearInterval(interval);
  }, [activeTimer, isTimerActiveInProject]);

  const stats = React.useMemo(() => {
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const overdueTasks = tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      const date = parseISO(t.due_date);
      return isPast(date) && !isToday(date);
    });

    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    const statusData = [
      { name: 'Backlog', value: tasks.filter(t => t.status === 'backlog').length, color: '#a8a29e' },
      { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: '#fbbf24' },
      { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#f97316' },
      { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#ea580c' },
      { name: 'Completed', value: completedTasks.length, color: '#10b981' },
    ].filter(item => item.value > 0);

    const priorityData = [
      { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#ef4444' },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#f59e0b' },
      { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#a8a29e' },
    ].filter(item => item.value > 0);

    return {
      total: tasks.length,
      completed: completedTasks.length,
      overdue: overdueTasks.length,
      completionRate,
      statusData: statusData.length > 0 ? statusData : [{ name: 'No Data', value: 1, color: '#f1f5f9' }],
      priorityData: priorityData.length > 0 ? priorityData : [{ name: 'No Data', value: 1, color: '#f1f5f9' }]
    };
  }, [tasks]);

  const totalTimeSpent = React.useMemo(() => {
    return timeEntries.reduce((acc, entry) => acc + (entry.duration_seconds || 0), 0) + (isTimerActiveInProject ? liveDuration : 0);
  }, [timeEntries, isTimerActiveInProject, liveDuration]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="p-5 rounded-xl border border-border/60 bg-card shadow-sm">
          <div className="flex items-center gap-2 text-muted-foreground mb-3">
            <CheckSquare className="h-4 w-4" /> <span className="text-xs font-semibold uppercase tracking-wider">Total Tasks</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.total}</div>
        </div>
        <div className="p-5 rounded-xl border border-border/60 bg-card shadow-sm">
          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-500 mb-3">
            <Activity className="h-4 w-4" /> <span className="text-xs font-semibold uppercase tracking-wider">Completed</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.completed}</div>
        </div>
        <div className="p-5 rounded-xl border border-red-500/30 bg-red-500/5 shadow-sm">
          <div className="flex items-center gap-2 text-red-600 dark:text-red-500 mb-3">
            <AlertTriangle className="h-4 w-4" /> <span className="text-xs font-semibold uppercase tracking-wider">Overdue</span>
          </div>
          <div className="text-3xl font-bold text-foreground">{stats.overdue}</div>
        </div>
        <div className="p-5 rounded-xl border border-border/60 bg-card shadow-sm relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5" />
          <div className="relative z-10 flex items-center gap-2 text-primary mb-3">
            <Target className="h-4 w-4" /> <span className="text-xs font-semibold uppercase tracking-wider">Completion Rate</span>
          </div>
          <div className="relative z-10 text-3xl font-bold text-foreground">{stats.completionRate}%</div>
        </div>
        <div className="p-5 rounded-xl border border-border/60 bg-card shadow-sm overflow-hidden relative">
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-500 mb-3">
            <Clock className="h-4 w-4" /> <span className="text-xs font-semibold uppercase tracking-wider">Time Spent</span>
          </div>
          <div className="text-3xl font-bold text-foreground truncate">{formatDuration(totalTimeSpent)}</div>
          {isTimerActiveInProject && (
            <div className="absolute top-4 right-4 flex items-center gap-1.5">
              <div className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <span className="text-[10px] uppercase font-bold text-red-500">Live</span>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="p-6 rounded-xl border border-border/60 bg-card shadow-sm">
          <h3 className="text-base font-semibold mb-6">Tasks by Status</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                >
                  {stats.statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="p-6 rounded-xl border border-border/60 bg-card shadow-sm">
          <h3 className="text-base font-semibold mb-6">Tasks by Priority</h3>
          <div className="h-[250px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={stats.priorityData} layout="vertical" margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="hsl(var(--border))" opacity={0.4} />
                <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} />
                <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fontSize: 12, fill: 'hsl(var(--muted-foreground))' }} width={70} />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--muted)/0.3)' }} />
                <Bar dataKey="value" radius={[0, 4, 4, 0]} maxBarSize={30}>
                  {stats.priorityData.map((entry, index) => (
                     <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
