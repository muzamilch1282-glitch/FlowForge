import * as React from 'react';
import { Button } from '@/components/shared';

export function NotificationSettings() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border/60 bg-card shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-3">
          <h3 className="text-sm font-semibold text-foreground">Email Notifications</h3>
          <p className="text-xs text-muted-foreground mt-1">Control what you receive in your inbox.</p>
        </div>
        
        <div className="space-y-6">
          <NotificationToggle 
            title="Task assignments" 
            description="When someone assigns a task to you"
            defaultChecked={true}
          />
          <NotificationToggle 
            title="Comments" 
            description="When someone comments on a task you're involved in"
            defaultChecked={true}
          />
          <NotificationToggle 
            title="Mentions" 
            description="When someone @mentions you anywhere"
            defaultChecked={true}
          />
          <NotificationToggle 
            title="Due dates" 
            description="Daily summary of upcoming and overdue tasks"
            defaultChecked={false}
          />
          <NotificationToggle 
            title="Activity summary" 
            description="Weekly digest of workspace activity"
            defaultChecked={false}
          />
        </div>
      </div>
    </div>
  );
}

function NotificationToggle({ title, description, defaultChecked }: { title: string, description: string, defaultChecked: boolean }) {
  const [checked, setChecked] = React.useState(defaultChecked);
  
  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <div className="text-sm font-medium text-foreground">{title}</div>
        <div className="text-xs text-muted-foreground">{description}</div>
      </div>
      <button 
        onClick={() => setChecked(!checked)}
        className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 ${checked ? 'bg-primary' : 'bg-muted'}`}
      >
        <span 
          className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${checked ? 'translate-x-2' : '-translate-x-2'}`}
        />
      </button>
    </div>
  );
}
