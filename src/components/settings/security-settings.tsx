'use client';

import * as React from 'react';
import { useState } from 'react';
import { Button } from '@/components/shared';
import { Loader2 } from 'lucide-react';
import { authService } from '@/services/auth.service';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function SecuritySettings() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpdatePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast.error('Please fill in both password fields');
      return;
    }
    
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters long');
      return;
    }

    if (!user?.email) {
      toast.error('User email not found');
      return;
    }

    try {
      setIsLoading(true);
      
      // Verify current password by attempting to sign in
      await authService.loginWithEmail(user.email, currentPassword);
      
      // If successful, update to the new password
      await authService.updatePassword(newPassword);
      
      toast.success('Password updated successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (error: any) {
      toast.error(error.message || 'Failed to update password. Please check your current password.');
    } finally {
      setIsLoading(false);
    }
  };

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
            <input 
              type="password" 
              placeholder="••••••••" 
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground outline-none" 
            />
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">New Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full h-10 px-3 rounded-lg border border-border/60 bg-background text-sm text-foreground outline-none" 
            />
          </div>
          <Button 
            onClick={handleUpdatePassword} 
            disabled={isLoading}
            className="w-fit rounded-full h-9 px-6 font-medium"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
            {isLoading ? 'Updating...' : 'Update Password'}
          </Button>
        </div>
      </div>
    </div>
  );
}
