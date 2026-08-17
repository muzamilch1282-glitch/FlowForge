'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { settingsService } from '@/services/settings.service';
import { toast } from 'sonner';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardDescription, 
  CardContent 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function AccountSettings() {
  const { user } = useAuth();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isSigningOutAll, setIsSigningOutAll] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await settingsService.signOut();
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out');
      setIsSigningOut(false);
    }
  };

  const handleSignOutEverywhere = async () => {
    try {
      setIsSigningOutAll(true);
      await settingsService.signOutEverywhere();
      toast.success('Signed out from all devices successfully');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to sign out everywhere');
      setIsSigningOutAll(false);
    }
  };

  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteAccount = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true);
      return;
    }
    
    if (!user) return;
    
    try {
      setIsDeleting(true);
      await settingsService.deleteAccountData(user.id);
      toast.success('Your account data has been wiped.');
      router.push('/login');
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete account data');
      setIsDeleting(false);
      setShowDeleteConfirm(false);
    }
  };

  const creationDate = user?.created_at 
    ? new Date(user.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    : 'Unknown';

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
          <CardDescription>View your account information and authentication details.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Email Address</span>
              <p className="font-medium">{user?.email || 'N/A'}</p>
            </div>
            
            <div className="space-y-1">
              <span className="text-sm font-medium text-muted-foreground">Account Created</span>
              <p className="font-medium">{creationDate}</p>
            </div>
            
            <div className="space-y-1 md:col-span-2">
              <span className="text-sm font-medium text-muted-foreground">User ID</span>
              <p className="font-mono text-sm bg-muted p-2 rounded-md truncate">
                {user?.id || 'N/A'}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>Manage your active sessions and devices.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-sm font-medium">Sign Out</h4>
              <p className="text-sm text-muted-foreground">Sign out of your current session on this device.</p>
            </div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              disabled={isSigningOut || isSigningOutAll}
            >
              {isSigningOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
          
          <Separator />
          
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-sm font-medium">Sign Out Everywhere</h4>
              <p className="text-sm text-muted-foreground">Sign out of all devices and active sessions.</p>
            </div>
            <Button 
              variant="secondary" 
              onClick={handleSignOutEverywhere}
              disabled={isSigningOut || isSigningOutAll}
            >
              {isSigningOutAll ? 'Signing out...' : 'Sign Out Everywhere'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <Card className="border-destructive/50">
        <CardHeader>
          <CardTitle className="text-destructive">Danger Zone</CardTitle>
          <CardDescription>Irreversible actions for your account.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h4 className="text-sm font-medium">Delete Account</h4>
              <p className="text-sm text-muted-foreground">Permanently delete your account and all associated data.</p>
            </div>
            <Button 
              variant={showDeleteConfirm ? "destructive" : "outline"}
              className={!showDeleteConfirm ? "text-destructive hover:bg-destructive hover:text-destructive-foreground border-destructive/30" : ""}
              onClick={handleDeleteAccount}
              disabled={isDeleting}
            >
              {isDeleting ? 'Deleting...' : (showDeleteConfirm ? 'Yes, delete my account' : 'Delete Account')}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
