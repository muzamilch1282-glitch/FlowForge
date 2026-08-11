'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { settingsService } from '@/services/settings.service';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2 } from 'lucide-react';

const defaultPreferences = {
  task_assigned: true,
  task_comments: true,
  task_due_date: true,
  task_completed: true,
  project_updates: true,
  workspace_activity: true,
  automation_notifications: true,
  ai_notifications: true,
};

export function NotificationSettings() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: preferences, isLoading, isError } = useQuery({
    queryKey: ['notificationPreferences', user?.id],
    queryFn: async () => {
      if (!user) throw new Error('No user');
      try {
        const data = await settingsService.getNotificationPreferences(user.id);
        return data || defaultPreferences;
      } catch (error) {
        return defaultPreferences;
      }
    },
    enabled: !!user,
  });

  const mutation = useMutation({
    mutationFn: async (updates: Partial<typeof defaultPreferences>) => {
      if (!user) throw new Error('No user');
      return settingsService.updateNotificationPreferences(user.id, updates);
    },
    onMutate: async (newPref) => {
      await queryClient.cancelQueries({ queryKey: ['notificationPreferences', user?.id] });
      const previousPref = queryClient.getQueryData(['notificationPreferences', user?.id]);
      queryClient.setQueryData(['notificationPreferences', user?.id], (old: any) => ({
        ...old,
        ...newPref,
      }));
      return { previousPref };
    },
    onError: (err, newPref, context) => {
      if (context?.previousPref) {
        queryClient.setQueryData(['notificationPreferences', user?.id], context.previousPref);
      }
      toast.error('Failed to save preferences');
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['notificationPreferences', user?.id] });
    },
  });

  const handleToggle = (key: keyof typeof defaultPreferences, checked: boolean) => {
    mutation.mutate({ [key]: checked });
  };

  const prefs = preferences || defaultPreferences;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Notification Preferences</CardTitle>
              <CardDescription>
                Choose what you want to be notified about.
              </CardDescription>
            </div>
            {mutation.isPending && (
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            )}
          </div>
          {isError && (
            <p className="text-sm text-amber-500 mt-2">
              Unable to load preferences. Default settings are shown and will be saved when available.
            </p>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <h4 className="text-sm font-medium">Tasks</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Assigned</Label>
                  <p className="text-sm text-muted-foreground">Get notified when a task is assigned to you</p>
                </div>
                <Switch 
                  checked={prefs.task_assigned} 
                  onCheckedChange={(c) => handleToggle('task_assigned', c)}
                  disabled={isLoading || mutation.isPending}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Comments</Label>
                  <p className="text-sm text-muted-foreground">Get notified when someone comments on your tasks</p>
                </div>
                <Switch 
                  checked={prefs.task_comments} 
                  onCheckedChange={(c) => handleToggle('task_comments', c)}
                  disabled={isLoading || mutation.isPending}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Due Date</Label>
                  <p className="text-sm text-muted-foreground">Get reminders about upcoming due dates</p>
                </div>
                <Switch 
                  checked={prefs.task_due_date} 
                  onCheckedChange={(c) => handleToggle('task_due_date', c)}
                  disabled={isLoading || mutation.isPending}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Task Completed</Label>
                  <p className="text-sm text-muted-foreground">Get notified when assigned tasks are completed</p>
                </div>
                <Switch 
                  checked={prefs.task_completed} 
                  onCheckedChange={(c) => handleToggle('task_completed', c)}
                  disabled={isLoading || mutation.isPending}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Projects</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Project Updates</Label>
                  <p className="text-sm text-muted-foreground">Get notified about project status changes</p>
                </div>
                <Switch 
                  checked={prefs.project_updates} 
                  onCheckedChange={(c) => handleToggle('project_updates', c)}
                  disabled={isLoading || mutation.isPending}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">Workspace</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Workspace Activity</Label>
                  <p className="text-sm text-muted-foreground">Get notified about workspace-level activity</p>
                </div>
                <Switch 
                  checked={prefs.workspace_activity} 
                  onCheckedChange={(c) => handleToggle('workspace_activity', c)}
                  disabled={isLoading || mutation.isPending}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <h4 className="text-sm font-medium">System</h4>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Automation Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified when automations trigger</p>
                </div>
                <Switch 
                  checked={prefs.automation_notifications} 
                  onCheckedChange={(c) => handleToggle('automation_notifications', c)}
                  disabled={isLoading || mutation.isPending}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>AI Notifications</Label>
                  <p className="text-sm text-muted-foreground">Get notified about AI assistant suggestions</p>
                </div>
                <Switch 
                  checked={prefs.ai_notifications} 
                  onCheckedChange={(c) => handleToggle('ai_notifications', c)}
                  disabled={isLoading || mutation.isPending}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
