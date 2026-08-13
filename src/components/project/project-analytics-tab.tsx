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

export function ProjectAnalyticsTab({ project, tasks }: ProjectAnalyticsTabProps) {
  const stats = React.useMemo(() => {
    const completedTasks = tasks.filter(t => t.status === 'completed');
    const overdueTasks = tasks.filter(t => {
      if (!t.due_date || t.status === 'completed') return false;
      const date = parseISO(t.due_date);
      return isPast(date) && !isToday(date);
    });

    const completionRate = tasks.length > 0 ? Math.round((completedTasks.length / tasks.length) * 100) : 0;

    const statusData = [
      { name: 'Backlog', value: tasks.filter(t => t.status === 'backlog').length, color: '#94a3b8' },
      { name: 'To Do', value: tasks.filter(t => t.status === 'todo').length, color: '#38bdf8' },
      { name: 'In Progress', value: tasks.filter(t => t.status === 'in-progress').length, color: '#635BFF' },
      { name: 'Review', value: tasks.filter(t => t.status === 'review').length, color: '#a855f7' },
      { name: 'Completed', value: completedTasks.length, color: '#10b981' },
    ].filter(item => item.value > 0);

    const priorityData = [
      { name: 'High', value: tasks.filter(t => t.priority === 'high').length, color: '#f43f5e' },
      { name: 'Medium', value: tasks.filter(t => t.priority === 'medium').length, color: '#6366f1' },
      { name: 'Low', value: tasks.filter(t => t.priority === 'low').length, color: '#94a3b8' },
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

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
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
