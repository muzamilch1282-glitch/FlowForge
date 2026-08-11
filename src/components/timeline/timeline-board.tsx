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

interface TimelineBoardProps {
  tasks: Task[];
  projects: Project[];
}

export function TimelineBoard({ tasks, projects }: TimelineBoardProps) {
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
  
  // Pad the timeline by 2 weeks on each side so items aren't flush against the edges
  const minDate = subWeeks(min(allDates), 2);
  const maxDate = addWeeks(max(allDates), 2);
  const totalDays = Math.max(differenceInDays(maxDate, minDate), 1);
  
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
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[600px] bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      
      {/* Scrollable Timeline Area */}
      <div className="flex-1 overflow-auto relative">
        <div className="min-w-[1200px] relative pb-10">
          
          {/* Header row (Months) */}
          <div className="sticky top-0 z-20 flex bg-secondary/80 backdrop-blur-sm border-b border-border text-xs font-semibold text-muted-foreground">
            <div className="w-[300px] shrink-0 border-r border-border p-3">
              Projects & Tasks
            </div>
            <div className="flex-1 relative h-10">
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
                    className="absolute h-full border-l border-border/50 p-2 truncate"
                    style={style}
                  >
                    {format(month, 'MMMM yyyy')}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Today Indicator Line */}
          <div 
            className="absolute top-0 bottom-0 border-l-2 border-primary/50 z-10 pointer-events-none"
            style={{ left: `calc(300px + ${todayStyle.left})` }}
          >
            <div className="absolute -top-1 -left-1.5 w-3 h-3 rounded-full bg-primary" />
          </div>

          {/* Project Groups */}
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
                <div key={project.id} className="group flex flex-col border-b border-border/50">
                  {/* Project Row */}
                  <div className="flex items-center hover:bg-secondary/10 transition-colors">
                    <div className="w-[300px] shrink-0 border-r border-border p-3 flex items-center justify-between bg-card z-20">
                      <div className="font-semibold text-sm truncate pr-2" title={project.title}>
                        {project.title}
                      </div>
                      <div className="text-xs text-muted-foreground font-medium">
                        {progress}%
                      </div>
                    </div>
                    <div className="flex-1 relative h-12 flex items-center">
                      <div 
                        className="absolute h-6 bg-secondary rounded-md border border-border/50 overflow-hidden"
                        style={projectStyle}
                        title={`Project: ${project.title} (${progress}%)`}
                      >
                        <div 
                          className="h-full bg-primary/20 transition-all"
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Task Rows */}
                  {projectTasks.map(task => {
                    const tStart = task.start_date ? parseISO(task.start_date) : (task.due_date ? parseISO(task.due_date) : today);
                    const tEnd = task.due_date ? parseISO(task.due_date) : tStart;
                    const taskStyle = getStyleProps(tStart, tEnd);
                    
                    const isOverdue = isBefore(tEnd, today) && task.status !== 'completed';
                    
                    let barColor = 'bg-blue-500/20 border-blue-500/40 text-blue-700 dark:text-blue-300';
                    if (task.status === 'completed') {
                      barColor = 'bg-gray-500/20 border-gray-500/40 text-gray-700 dark:text-gray-300';
                    } else if (isOverdue) {
                      barColor = 'bg-destructive/20 border-destructive/50 text-destructive';
                    }

                    return (
                      <div key={task.id} className="flex items-center hover:bg-secondary/20 transition-colors">
                        <div className="w-[300px] shrink-0 border-r border-border p-2 pl-8 flex items-center gap-2 bg-card z-20">
                          <div className={`w-2 h-2 rounded-full shrink-0 ${task.status === 'completed' ? 'bg-gray-400' : isOverdue ? 'bg-destructive' : 'bg-blue-500'}`} />
                          <Link href={`/dashboard/tasks/${task.id}`} className="text-xs truncate hover:underline" title={task.title}>
                            {task.title}
                          </Link>
                        </div>
                        <div className="flex-1 relative h-10 flex items-center group-hover:bg-background/5">
                          {/* Background grid lines can go here if needed */}
                          
                          <Link 
                            href={`/dashboard/tasks/${task.id}`}
                            className={`absolute h-5 rounded-sm border shadow-sm flex items-center px-2 text-[10px] font-medium truncate hover:opacity-80 transition-opacity ${barColor}`}
                            style={taskStyle}
                            title={`${task.title} | ${format(tStart, 'MMM d')} - ${format(tEnd, 'MMM d')}`}
                          >
                            <span className="truncate">{task.title}</span>
                          </Link>
                        </div>
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
  );
}
