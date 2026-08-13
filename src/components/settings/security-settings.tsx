import * as React from 'react';
import { Button } from '@/components/shared';
import { Laptop, Smartphone, KeyRound } from 'lucide-react';

export function SecuritySettings() {
  return (
    <div className="space-y-6">
      <div className="p-6 rounded-xl border border-border/60 bg-card shadow-sm space-y-6">
        <div className="border-b border-border/60 pb-3">
          <h3 className="text-sm font-semibold text-foreground">Change Password</h3>
          <p className="text-xs text-muted-foreground mt-1">Ensure your account is using a long, random password to stay secure.</p>
        </div>
        
        <div className="space-y-4 max-w-md">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Current Password</label>
            <input type="password" placeholder="••••••••" className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground outline-none" />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
            <input type="password" placeholder="••••••••" className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground outline-none" />
          </div>
          <Button className="w-fit rounded-full h-9 px-6 font-medium">Update Password</Button>
        </div>
      </div>


    </div>
  );
}
