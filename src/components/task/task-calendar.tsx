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
  eachDayOfInterval,
  parseISO
} from 'date-fns';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon } from 'lucide-react';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { Button } from '@/components/shared';
import { PriorityBadge } from './priority-badge';
import { TaskStatus } from './task-status';
import Link from 'next/link';
import { motion } from 'framer-motion';

const getPillColors = (task: Task) => {
  if (task.status === 'completed') {
    return 'bg-muted/50 border-l-muted-foreground/50 hover:bg-muted';
  }
  switch (task.priority) {
    case 'high':
      return 'bg-red-500/10 border-l-red-500 hover:bg-red-500/20';
    case 'medium':
      return 'bg-yellow-500/10 border-l-yellow-500 hover:bg-yellow-500/20';
    case 'low':
    default:
      return 'bg-green-500/10 border-l-green-500 hover:bg-green-500/20';
  }
};

interface TaskCalendarProps {
  tasks: Task[];
  projects: Project[];
}

export function TaskCalendar({ tasks, projects }: TaskCalendarProps) {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const startDate = startOfWeek(monthStart);
  const endDate = endOfWeek(monthEnd);

  const calendarDays = eachDayOfInterval({ start: startDate, end: endDate });

  // Get tasks for the selected date
  const selectedDateTasks = React.useMemo(() => {
    return tasks.filter(task => 
      task.due_date && isSameDay(parseISO(task.due_date), selectedDate)
    );
  }, [tasks, selectedDate]);

  // Create a map for fast lookup of days that have tasks
  const daysWithTasks = React.useMemo(() => {
    const map = new Map<string, number>();
    tasks.forEach(task => {
      if (task.due_date && task.status !== 'completed') {
        const dateStr = format(parseISO(task.due_date), 'yyyy-MM-dd');
        map.set(dateStr, (map.get(dateStr) || 0) + 1);
      }
    });
    return map;
  }, [tasks]);

  return (
    <div className="flex flex-col md:flex-row gap-6">
      {/* Calendar Grid */}
      <div className="flex-1 rounded-xl border border-border bg-card p-4 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-foreground">
            {format(currentDate, 'MMMM yyyy')}
          </h3>
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={goToToday} className="h-8 mr-2 text-xs">
              Today
            </Button>
            <Button variant="ghost" size="icon" onClick={prevMonth} className="h-8 w-8">
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={nextMonth} className="h-8 w-8">
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-7 gap-1 text-center mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
            <div key={day} className="text-xs font-medium text-muted-foreground py-1">
              {day}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1">
          {calendarDays.map(day => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const taskCount = daysWithTasks.get(dateStr) || 0;
            const isSelected = isSameDay(day, selectedDate);
            const isCurrentMonth = isSameMonth(day, currentDate);
            const isTodayDate = isSameDay(day, new Date());

            return (
              <button
                key={day.toString()}
                onClick={() => setSelectedDate(day)}
                className={`
                  relative flex h-10 w-full flex-col items-center justify-center rounded-md text-sm transition-colors
                  ${!isCurrentMonth ? 'text-muted-foreground/50' : 'text-foreground hover:bg-secondary'}
                  ${isSelected ? 'bg-primary text-primary-foreground hover:bg-primary/90 font-medium shadow-sm' : ''}
                  ${isTodayDate && !isSelected ? 'bg-primary/10 text-primary font-medium' : ''}
                `}
              >
                <span>{format(day, 'd')}</span>
                {taskCount > 0 && (
                  <span className={`absolute bottom-1 h-1 w-1 rounded-full ${isSelected ? 'bg-primary-foreground' : 'bg-primary'}`} />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Date Tasks */}
      <div className="w-full md:w-[320px] lg:w-[400px] shrink-0">
        <div className="rounded-xl border border-border bg-card p-4 shadow-sm h-full min-h-[350px] flex flex-col">
          <h3 className="font-semibold text-foreground mb-4 pb-2 border-b border-border flex items-center gap-2">
            <CalendarIcon className="h-4 w-4 text-muted-foreground" />
            {format(selectedDate, 'MMM d, yyyy')}
          </h3>

          <div className="flex-1 flex flex-col gap-3 overflow-y-auto pr-2">
            {selectedDateTasks.length > 0 ? (
              selectedDateTasks.map(task => {
                const project = projects.find(p => p.id === task.project_id);
                return (
                  <motion.div
                    key={task.id}
                    whileHover={{ y: -2, scale: 1.01 }}
                    className="rounded-lg shadow-sm hover:shadow transition-shadow"
                  >
                    <Link 
                      href={`/dashboard/tasks/${task.id}`}
                      className={`flex flex-col gap-2 rounded-lg p-3 transition-colors border-l-2 ${getPillColors(task)}`}
                    >
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-sm font-medium leading-tight">{task.title}</h4>
                        <PriorityBadge priority={task.priority} className="text-[10px] px-1 h-4 shrink-0" />
                      </div>
                      <div className="flex items-center justify-between mt-1">
                        <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                          {project?.title || 'No Project'}
                        </span>
                        <TaskStatus status={task.status} />
                      </div>
                    </Link>
                  </motion.div>
                );
              })
            ) : (
              <div className="flex-1 flex flex-col items-center justify-center text-center text-muted-foreground py-8">
                <CalendarIcon className="h-8 w-8 mb-3 opacity-20" />
                <p className="text-sm">No tasks due on this date</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
