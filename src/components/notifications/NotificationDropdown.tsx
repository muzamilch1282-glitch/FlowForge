import React from 'react';
import { useNotifications } from '@/hooks/useNotifications';
import { NotificationCard } from './NotificationCard';
import { NotificationSkeleton } from './NotificationSkeleton';
import { EmptyNotifications } from './EmptyNotifications';
import { CheckCheck } from 'lucide-react';

export function NotificationDropdown() {
  const { 
    notifications, 
    isLoading, 
    markAsRead, 
    markAllAsRead, 
    isMarkingAllRead, 
    deleteNotification,
    unreadCount
  } = useNotifications();

  return (
    <div className="flex flex-col h-[400px] w-[350px] sm:w-[400px]">
      <div className="flex items-center justify-between p-4 border-b border-border shrink-0">
        <div>
          <h3 className="font-semibold text-foreground">Notifications</h3>
          {unreadCount > 0 && (
            <p className="text-xs text-muted-foreground">You have {unreadCount} unread messages</p>
          )}
        </div>
        
        {unreadCount > 0 && (
          <button 
            onClick={() => markAllAsRead()}
            disabled={isMarkingAllRead}
            className="flex items-center gap-1.5 text-xs text-primary hover:text-primary/80 disabled:opacity-50 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Mark all read
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden">
        {isLoading ? (
          <div>
            <NotificationSkeleton />
            <NotificationSkeleton />
            <NotificationSkeleton />
          </div>
        ) : notifications.length === 0 ? (
          <EmptyNotifications />
        ) : (
          <div className="flex flex-col">
            {notifications.map((notification) => (
              <NotificationCard 
                key={notification.id}
                notification={notification}
                onMarkAsRead={markAsRead}
                onDelete={deleteNotification}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
