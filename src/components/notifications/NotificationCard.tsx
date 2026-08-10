import React from 'react';
import { AppNotification } from '@/types/notification';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { MessageSquare, Calendar, Folder, CheckSquare, UserPlus, Trash2 } from 'lucide-react';
import { Dropdown } from '@/components/shared';

interface NotificationCardProps {
  notification: AppNotification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

const getIcon = (type: string) => {
  switch (type) {
    case 'task_assigned':
      return <CheckSquare className="h-4 w-4 text-blue-500" />;
    case 'comment_added':
      return <MessageSquare className="h-4 w-4 text-green-500" />;
    case 'due_date_reminder':
      return <Calendar className="h-4 w-4 text-amber-500" />;
    case 'project_updated':
      return <Folder className="h-4 w-4 text-purple-500" />;
    case 'member_invited':
      return <UserPlus className="h-4 w-4 text-indigo-500" />;
    default:
      return <div className="h-4 w-4 bg-muted rounded-full" />;
  }
};

export function NotificationCard({ notification, onMarkAsRead, onDelete }: NotificationCardProps) {
  return (
    <div 
      className={`group relative flex items-start gap-3 p-3 transition-colors border-b border-border last:border-0 hover:bg-muted/30 ${!notification.is_read ? 'bg-primary/5' : ''}`}
      onClick={() => !notification.is_read && onMarkAsRead(notification.id)}
    >
      {!notification.is_read && (
        <div className="absolute left-1 top-1/2 -translate-y-1/2 h-1.5 w-1.5 rounded-full bg-primary" />
      )}
      
      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-background border border-border shadow-sm">
        {getIcon(notification.type)}
      </div>
      
      <div className="flex-1 min-w-0 pr-6">
        <p className="text-sm font-medium text-foreground">
          {notification.title}
        </p>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-[10px] text-muted-foreground mt-1.5" suppressHydrationWarning>
          {formatDistanceToNow(parseISO(notification.created_at), { addSuffix: true })}
        </p>
      </div>

      <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <Dropdown
          trigger={
            <button className="h-6 w-6 flex items-center justify-center rounded text-muted-foreground hover:bg-muted transition-colors">
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          }
          items={[
            {
              label: 'Delete',
              icon: <Trash2 className="h-4 w-4" />,
              onClick: (e) => {
                e.stopPropagation();
                onDelete(notification.id);
              },
              danger: true,
            }
          ]}
          align="end"
        />
      </div>
    </div>
  );
}
