'use client';

import * as React from 'react';
import { 
  format, 
  addMonths, 
  subMonths, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  isSameMonth, 
  isSameDay, 
  addWeeks, 
  subWeeks,
  eachDayOfInterval,
  parseISO,
  isBefore,
  startOfToday
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import Link from 'next/link';
import { Button } from '@/components/shared';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface CalendarBoardProps {
  tasks: Task[];
  projects: Project[];
}

type ViewMode = 'month' | 'week';

export function CalendarBoard({ tasks, projects }: CalendarBoardProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [view, setView] = React.useState<ViewMode>('month');

  const nextPeriod = () => {
    if (view === 'month') {
      setCurrentDate(addMonths(currentDate, 1));
    } else {
      setCurrentDate(addWeeks(currentDate, 1));
    }
  };

  const prevPeriod = () => {
    if (view === 'month') {
      setCurrentDate(subMonths(currentDate, 1));
    } else {
      setCurrentDate(subWeeks(currentDate, 1));
    }
  };

  const today = startOfToday();
  const goToToday = () => setCurrentDate(today);

  // Generate calendar grid
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  
  // To create a perfect grid, start from the sunday of the first week, and end at saturday of the last week
  const startDate = view === 'month' ? startOfWeek(monthStart) : startOfWeek(currentDate);
  const endDate = view === 'month' ? endOfWeek(monthEnd) : endOfWeek(currentDate);

  const dateFormat = view === 'month' ? 'MMMM yyyy' : 'MMM d, yyyy';

  const days = eachDayOfInterval({
    start: startDate,
    end: endDate
  });

  return (
    <div className="flex flex-col h-[calc(100vh-12rem)] min-h-[600px] bg-card border border-border rounded-xl shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-b border-border bg-muted/10 gap-4">
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-bold text-foreground min-w-[200px]">
            {format(currentDate, dateFormat)}
          </h2>
          
          {/* Animated View Toggle */}
          <div className="flex bg-muted/50 p-1 rounded-lg overflow-x-auto no-scrollbar shrink-0">
            {(['month', 'week'] as const).map((mode) => (
              <button
                key={mode}
                onClick={() => setView(mode)}
                className="relative px-5 py-1.5 text-sm font-medium transition-colors rounded-md whitespace-nowrap capitalize"
              >
                {view === mode && (
                  <motion.div
                    layoutId="view-bg-calendar"
                    className="absolute inset-0 bg-background shadow-sm rounded-md"
                    initial={false}
                    transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                  />
                )}
                <span className={cn("relative z-10", view === mode ? "text-foreground" : "text-muted-foreground hover:text-foreground")}>
                   {mode}
                </span>
              </button>
            ))}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={goToToday} className="rounded-full shadow-sm hover:bg-secondary/50">
            Today
          </Button>
          <Button variant="outline" size="icon" onClick={prevPeriod} className="rounded-full h-9 w-9 shadow-sm hover:bg-secondary/50">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={nextPeriod} className="rounded-full h-9 w-9 shadow-sm hover:bg-secondary/50">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Weekday headers */}
      <div className="grid grid-cols-7 border-b border-border bg-muted/5">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
          <div key={day} className="py-3 text-center text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className={`flex-1 grid grid-cols-7 grid-rows-${days.length / 7} bg-border gap-[1px]`}>
        {days.map((day, idx) => {
          const isCurrentMonth = isSameMonth(day, monthStart);
          const isTodayDate = isSameDay(day, today);
          
          // Find tasks due on this day
          const dayTasks = tasks.filter(task => {
            if (!task.due_date) return false;
            return isSameDay(parseISO(task.due_date), day);
          });

          // Find projects active on this day
          const activeProjects = projects.filter(project => {
            if (!project.start_date || !project.end_date) return false;
            const pStart = parseISO(project.start_date);
            const pEnd = parseISO(project.end_date);
            return (isSameDay(day, pStart) || isBefore(pStart, day)) && (isSameDay(day, pEnd) || isBefore(day, pEnd));
          });

          return (
            <div 
              key={day.toString()} 
              className={`min-h-[120px] bg-card p-1.5 sm:p-2 flex flex-col group overflow-hidden
                ${!isCurrentMonth && view === 'month' ? 'text-muted-foreground/50 bg-secondary/10' : 'text-foreground'}
                ${isTodayDate ? 'bg-primary/5' : ''}
              `}
            >
              <div className="flex justify-between items-center mb-1.5 shrink-0">
                <span className={cn(
                  "text-xs sm:text-sm font-medium h-7 w-7 flex items-center justify-center rounded-full transition-colors",
                  isTodayDate ? 'bg-primary text-primary-foreground shadow-sm' : 'group-hover:bg-muted/50'
                )}>
                  {format(day, 'd')}
                </span>
              </div>
              
              <div className="flex-1 flex flex-col gap-1.5 overflow-y-auto pr-1">
                {/* Project spans */}
                {activeProjects.map(project => (
                  <div 
                    key={`p-${project.id}`} 
                    className="text-[10px] sm:text-xs px-2 py-0.5 rounded-md bg-primary/10 text-primary border border-primary/20 truncate font-medium"
                    title={`Project: ${project.title}`}
                  >
                    {project.title}
                  </div>
                ))}

                {/* Tasks */}
                {dayTasks.map(task => {
                  const isOverdue = isBefore(day, today) && task.status !== 'completed';
                  return (
                    <Link 
                      key={`t-${task.id}`}
                      href={`/dashboard/tasks/${task.id}`}
                      className={cn(
                        "text-[10px] sm:text-xs px-2 py-1 rounded-md border truncate transition-all hover:shadow-sm",
                        isOverdue 
                          ? 'bg-destructive/10 border-destructive/30 text-destructive hover:bg-destructive/20' 
                          : task.status === 'completed'
                            ? 'bg-secondary border-border text-muted-foreground line-through opacity-75'
                            : 'bg-background border-border text-foreground hover:border-primary/40 hover:bg-muted/30'
                      )}
                      title={task.title}
                    >
                      <div className="flex items-center gap-1.5 truncate font-medium">
                        {isOverdue && <Clock className="h-3 w-3 shrink-0" />}
                        <span className="truncate">{task.title}</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
