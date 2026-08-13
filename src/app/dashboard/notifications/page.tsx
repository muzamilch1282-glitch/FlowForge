'use client';

import * as React from 'react';
import { PageHeader, Button } from '@/components/shared';
import { useNotifications } from '@/hooks/useNotifications';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Bell, Check, CheckCircle2, Circle, MessageSquare, Clock, Users, X, Info } from 'lucide-react';
import { cn } from '@/lib/utils';
import { AppNotification } from '@/types/notification';

const getNotificationIcon = (type: string) => {
  switch (type) {
    case 'task_assigned':
      return <CheckCircle2 className="h-5 w-5 text-emerald-500" />;
    case 'comment_added':
      return <MessageSquare className="h-5 w-5 text-blue-500" />;
    case 'due_date_reminder':
      return <Clock className="h-5 w-5 text-amber-500" />;
    case 'project_updated':
      return <Info className="h-5 w-5 text-violet-500" />;
    case 'member_invited':
      return <Users className="h-5 w-5 text-indigo-500" />;
    default:
      return <Bell className="h-5 w-5 text-muted-foreground" />;
  }
};

export default function NotificationsPage() {
  const {
    notifications,
    unreadCount,
    isLoading,
    markAsRead,
    markAllAsRead,
    isMarkingAllRead,
    deleteNotification
  } = useNotifications();

  return (
    <div className="space-y-6 max-w-4xl mx-auto h-full flex flex-col">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-6">
        <PageHeader 
          title="Inbox" 
          description="Stay updated on your tasks, projects, and team activity."
        />
        {unreadCount > 0 && (
          <Button 
            variant="outline" 
            onClick={() => markAllAsRead()} 
            disabled={isMarkingAllRead}
            className="shrink-0"
          >
            <Check className="mr-2 h-4 w-4" />
            Mark all as read
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-auto">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4 text-muted-foreground">
              <Bell className="h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">You're all caught up</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-sm">
              When you get notifications about tasks, projects, or team activity, they'll show up here.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2 pb-12">
            {notifications.map((notification: AppNotification) => (
              <div 
                key={notification.id}
                className={cn(
                  "group flex gap-4 p-4 rounded-xl border transition-all relative overflow-hidden",
                  notification.is_read 
                    ? "bg-card border-border hover:border-border/80" 
                    : "bg-primary/5 border-primary/20 shadow-sm"
                )}
              >
                {!notification.is_read && (
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary" />
                )}
                
                <div className="shrink-0 mt-1">
                  {getNotificationIcon(notification.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2">
                    <p className={cn(
                      "text-sm font-medium",
                      notification.is_read ? "text-foreground/90" : "text-foreground"
                    )}>
                      {notification.title}
                    </p>
                    <span className="text-[11px] font-medium text-muted-foreground shrink-0 mt-0.5">
                      {formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true })}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {notification.message}
                  </p>
                </div>

                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!notification.is_read && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-muted-foreground hover:text-primary hover:bg-primary/10"
                      onClick={() => markAsRead(notification.id)}
                      title="Mark as read"
                    >
                      <Circle className="h-4 w-4" />
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => deleteNotification(notification.id)}
                    title="Delete"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
