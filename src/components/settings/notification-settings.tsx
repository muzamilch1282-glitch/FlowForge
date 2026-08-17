'use client';

import * as React from 'react';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { toast } from 'sonner';

export function NotificationSettings() {
  const { user } = useAuth();
  
  const [preferences, setPreferences] = React.useState({
    task_assigned: true,
    comment_added: true,
    mentions: true,
    due_date_reminder: false,
    activity_summary: false,
  });

  React.useEffect(() => {
    if (user?.user_metadata?.notification_preferences) {
      setPreferences(prev => ({
        ...prev,
        ...user.user_metadata.notification_preferences
      }));
    }
  }, [user]);

  const handleToggle = async (key: string, value: boolean) => {
    const newPrefs = { ...preferences, [key]: value };
    setPreferences(newPrefs);
    
    try {
      await authService.updateNotificationPreferences(newPrefs);
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update preferences');
      // Revert on error
      setPreferences(preferences);
    }
  };

  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border/60 bg-card shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-3">
          <h3 className="text-sm font-semibold text-foreground">Email & In-App Notifications</h3>
          <p className="text-xs text-muted-foreground mt-1">Control what you receive in your inbox.</p>
        </div>
        
        <div className="space-y-6">
          <NotificationToggle 
            title="Task assignments" 
            description="When someone assigns a task to you"
            checked={preferences.task_assigned}
            onChange={(checked) => handleToggle('task_assigned', checked)}
          />
          <NotificationToggle 
            title="Comments" 
            description="When someone comments on a task you're involved in"
            checked={preferences.comment_added}
            onChange={(checked) => handleToggle('comment_added', checked)}
          />
          <NotificationToggle 
            title="Mentions" 
            description="When someone @mentions you anywhere"
            checked={preferences.mentions}
            onChange={(checked) => handleToggle('mentions', checked)}
          />
          <NotificationToggle 
            title="Due dates" 
            description="Daily summary of upcoming and overdue tasks"
            checked={preferences.due_date_reminder}
            onChange={(checked) => handleToggle('due_date_reminder', checked)}
          />
          <NotificationToggle 
            title="Activity summary" 
            description="Weekly digest of workspace activity"
            checked={preferences.activity_summary}
            onChange={(checked) => handleToggle('activity_summary', checked)}
          />
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({ title, description, checked, onChange }: { title: string, description: string, checked: boolean, onChange: (checked: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <button 
        onClick={() => onChange(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span 
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-2' : '-translate-x-2'}`}
        />
      </button>
    </div>
  );
}
