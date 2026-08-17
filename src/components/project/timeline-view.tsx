'use client';

import * as React from 'react';
import { 
  format, 
  parseISO, 
  differenceInDays, 
  min, 
  max, 
  addWeeks, 
  subWeeks, 
  eachDayOfInterval, 
  eachMonthOfInterval,
  isBefore,
  startOfToday,
  startOfMonth,
  endOfMonth
} from 'date-fns';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import Link from 'next/link';

interface TimelineViewProps {
  tasks: Task[];
  projects: Project[];
}

export function TimelineView({ tasks, projects }: TimelineViewProps) {
  const today = startOfToday();
  
  // 1. Calculate the overall timeline boundaries
  let allDates: Date[] = [today];
  
  projects.forEach(p => {
    if (p.start_date) allDates.push(parseISO(p.start_date));
    if (p.end_date) allDates.push(parseISO(p.end_date));
  });
  
  tasks.forEach(t => {
    if (t.start_date) allDates.push(parseISO(t.start_date));
    if (t.due_date) allDates.push(parseISO(t.due_date));
  });
  
  // Align timeline boundaries to the start and end of the respective months
  // This ensures month header columns are always wide enough to read clearly
  const earliestDate = min(allDates);
  const latestDate = max(allDates);
  
  const minDate = startOfMonth(subWeeks(earliestDate, 1));
  const maxDate = endOfMonth(addWeeks(latestDate, 1));
  const totalDays = Math.max(differenceInDays(maxDate, minDate), 1);
  
  // Calculate dynamic width to prevent squishing months/tasks. 
  // At least 15px per day, minimum 800px for the timeline part.
  const timelineWidth = Math.max(800, totalDays * 15);
  
  const months = eachMonthOfInterval({ start: minDate, end: maxDate });
  
  // Helper to calculate CSS left and width percentages
  const getStyleProps = (start: Date, end: Date) => {
    // Ensure start is before end
    const safeStart = isBefore(start, end) ? start : end;
    const safeEnd = isBefore(end, start) ? start : end;
    
    const leftPercent = (differenceInDays(safeStart, minDate) / totalDays) * 100;
    // Minimal width of 0.5% so single-day tasks are visible
    const widthPercent = Math.max((differenceInDays(safeEnd, safeStart) / totalDays) * 100, 0.5);
    
    return {
      left: `${Math.max(0, leftPercent)}%`,
      width: `${Math.min(100 - leftPercent, widthPercent)}%`
    };
  };

  const todayStyle = getStyleProps(today, today);

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[600px] bg-card border border-border/60 rounded-2xl shadow-lg shadow-black/5 overflow-hidden">
      
      {/* Scrollable Timeline Area */}
      <div className="flex-1 overflow-auto relative scrollbar-thin">
        <div className="relative pb-10 flex min-w-max">
          
          {/* Fixed Left Column: Projects & Tasks Container */}
          <div className="w-[300px] shrink-0 sticky left-0 z-30 bg-card border-r border-border/60 shadow-[4px_0_24px_rgba(0,0,0,0.03)]">
            
            {/* Header for Left Column */}
            <div className="sticky top-0 z-40 bg-muted/80 backdrop-blur-md h-12 border-b border-border/60 flex items-center px-4 text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Projects & Tasks
            </div>

            {/* Project Groups Left Panel */}
            <div className="flex flex-col relative z-30">
              {projects.map(project => {
                const projectTasks = tasks.filter(t => t.project_id === project.id);
                const completedTasks = projectTasks.filter(t => t.status === 'completed');
                const progress = projectTasks.length > 0 
                  ? Math.round((completedTasks.length / projectTasks.length) * 100) 
                  : 0;

                return (
                  <div key={project.id} className="group flex flex-col border-b border-border/40 bg-card">
                    {/* Project Row Left */}
                    <div className="h-14 flex items-center justify-between px-4 bg-muted/10 hover:bg-muted/30 transition-colors">
                      <div className="font-semibold text-sm text-foreground truncate pr-2" title={project.title}>
                        {project.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-semibold bg-background border border-border/60 px-2 py-0.5 rounded-full shadow-sm">
                        {progress}%
                      </div>
                    </div>

                    {/* Task Rows Left */}
                    {projectTasks.map(task => {
                      const tStart = task.start_date ? parseISO(task.start_date) : (task.due_date ? parseISO(task.due_date) : today);
                      const tEnd = task.due_date ? parseISO(task.due_date) : tStart;
                      const isOverdue = isBefore(tEnd, today) && task.status !== 'completed';

                      return (
                        <div key={task.id} className="h-12 flex items-center px-4 pl-8 gap-3 hover:bg-muted/20 transition-colors relative">
                          {/* Tree connecting line */}
                          <div className="absolute left-[22px] top-0 bottom-0 w-px bg-border/40" />
                          <div className="absolute left-[22px] top-1/2 w-4 h-px bg-border/40" />
                          
                          <div className={`relative z-10 w-2.5 h-2.5 rounded-full shrink-0 shadow-sm border border-white dark:border-background ${task.status === 'completed' ? 'bg-emerald-500' : isOverdue ? 'bg-destructive' : 'bg-primary'}`} />
                          <Link href={`/dashboard/tasks/${task.id}`} className="text-xs font-medium text-muted-foreground hover:text-foreground truncate hover:underline transition-colors" title={task.title}>
                            {task.title}
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Scrollable Timeline Grid */}
          <div className="flex-1 relative" style={{ minWidth: `${timelineWidth}px` }}>
            
            {/* Header row (Months) */}
            <div className="sticky top-0 z-20 h-12 bg-muted/80 backdrop-blur-md border-b border-border/60 text-xs font-bold uppercase tracking-wider text-muted-foreground relative">
              {months.map(month => {
                const monthStart = startOfMonth(month);
                const monthEnd = endOfMonth(month);
                const style = getStyleProps(
                  isBefore(monthStart, minDate) ? minDate : monthStart, 
                  isBefore(maxDate, monthEnd) ? maxDate : monthEnd
                );
                return (
                  <div 
                    key={month.toString()} 
                    className="absolute h-full border-l border-border/40 px-3 py-3.5 truncate flex items-center"
                    style={style}
                  >
                    {format(month, 'MMMM yyyy')}
                  </div>
                );
              })}
            </div>

            {/* Today Indicator Line */}
            <div 
              className="absolute top-0 bottom-0 border-l-2 border-dashed border-primary/40 z-10 pointer-events-none"
              style={{ left: todayStyle.left }}
            >
              <div className="absolute -top-1.5 -left-[7px] w-3 h-3 rounded-full bg-primary ring-4 ring-primary/20 shadow-sm" />
            </div>

            {/* Timeline Bars */}
            <div className="flex flex-col relative z-10">
              {projects.map(project => {
                const projectTasks = tasks.filter(t => t.project_id === project.id);
                const completedTasks = projectTasks.filter(t => t.status === 'completed');
                const progress = projectTasks.length > 0 
                  ? Math.round((completedTasks.length / projectTasks.length) * 100) 
                  : 0;

                let pStart = project.start_date ? parseISO(project.start_date) : today;
                let pEnd = project.end_date ? parseISO(project.end_date) : today;
                
                // If project lacks dates, infer from tasks
                if (!project.start_date && projectTasks.length > 0) {
                  const taskDates = projectTasks.map(t => t.start_date ? parseISO(t.start_date) : (t.due_date ? parseISO(t.due_date) : today));
                  pStart = min(taskDates);
                }
                if (!project.end_date && projectTasks.length > 0) {
                  const taskDates = projectTasks.map(t => t.due_date ? parseISO(t.due_date) : (t.start_date ? parseISO(t.start_date) : today));
                  pEnd = max(taskDates);
                }

                const projectStyle = getStyleProps(pStart, pEnd);

                return (
                  <div key={project.id} className="group flex flex-col border-b border-border/40">
                    {/* Project Bar Row */}
                    <div className="h-14 flex items-center relative hover:bg-muted/10 transition-colors">
                      <div 
                        className="absolute h-4 bg-muted/50 rounded-full border border-border/50 overflow-hidden shadow-inner"
                        style={projectStyle}
                        title={`Project: ${project.title} (${progress}%)`}
                      >
                        <div 
                          className="h-full bg-gradient-to-r from-primary/60 to-primary/40 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>

                  {/* Task Rows Right (Timeline Bars Only) */}
                  {projectTasks.map(task => {
                    const tStart = task.start_date ? parseISO(task.start_date) : (task.due_date ? parseISO(task.due_date) : today);
                    const tEnd = task.due_date ? parseISO(task.due_date) : tStart;
                    const taskStyle = getStyleProps(tStart, tEnd);
                    
                    const isOverdue = isBefore(tEnd, today) && task.status !== 'completed';
                    
                    let barColor = 'bg-primary/10 border-primary/20 text-primary-hover dark:text-primary shadow-sm hover:shadow-md';
                    if (task.status === 'completed') {
                      barColor = 'bg-emerald-500/10 border-emerald-500/20 text-emerald-700 dark:text-emerald-400 shadow-sm hover:shadow-md';
                    } else if (isOverdue) {
                      barColor = 'bg-destructive/10 border-destructive/20 text-destructive dark:text-red-400 shadow-sm hover:shadow-md';
                    }

                    return (
                      <div key={task.id} className="h-12 flex items-center relative hover:bg-muted/10 transition-colors">
                        <Link 
                          href={`/dashboard/tasks/${task.id}`}
                          className={`absolute h-7 rounded-full border flex items-center px-3 text-[11px] font-semibold truncate hover:-translate-y-0.5 transition-all duration-200 cursor-pointer overflow-hidden ${barColor}`}
                          style={{ ...taskStyle, minWidth: 'min-content', paddingRight: '12px' }}
                          title={`${task.title} | ${format(tStart, 'MMM d')} - ${format(tEnd, 'MMM d')}`}
                        >
                          <span className="truncate whitespace-nowrap min-w-[60px]">{task.title}</span>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>

          </div>
        </div>
      </div>
    </div>
  );
}
