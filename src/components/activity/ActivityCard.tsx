import React from 'react';
import { ActivityLog } from '@/types/activity';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  CheckCircle2, 
  MessageSquare, 
  FilePlus, 
  Trash2, 
  Edit3, 
  UserPlus, 
  UserMinus,
  Briefcase,
  Folder
} from 'lucide-react';

interface ActivityCardProps {
  activity: ActivityLog;
  isLast?: boolean;
}

const getActionIcon = (action: string, entityType: string) => {
  if (action === 'completed') return <CheckCircle2 className="h-4 w-4 text-green-500" />;
  if (entityType === 'comment') return <MessageSquare className="h-4 w-4 text-blue-500" />;
  if (entityType === 'file') return action === 'deleted' ? <Trash2 className="h-4 w-4 text-destructive" /> : <FilePlus className="h-4 w-4 text-indigo-500" />;
  if (entityType === 'member') return action === 'removed' ? <UserMinus className="h-4 w-4 text-destructive" /> : <UserPlus className="h-4 w-4 text-purple-500" />;
  if (entityType === 'project') return <Folder className="h-4 w-4 text-amber-500" />;
  if (entityType === 'workspace') return <Briefcase className="h-4 w-4 text-slate-500" />;
  if (action === 'updated') return <Edit3 className="h-4 w-4 text-orange-500" />;
  if (action === 'deleted') return <Trash2 className="h-4 w-4 text-destructive" />;
  
  // Default created task/project
  return <div className="h-2 w-2 rounded-full bg-primary" />;
};

const formatActionText = (activity: ActivityLog) => {
  const actor = activity.profile?.full_name || 'Someone';
  const entityName = <span className="font-medium text-foreground">{activity.entity_name}</span>;
  
  switch (activity.action) {
    case 'created':
      return <>{actor} created {activity.entity_type} {entityName}</>;
    case 'updated':
      return <>{actor} updated {activity.entity_type} {entityName}</>;
    case 'deleted':
      return <>{actor} deleted {activity.entity_type} {entityName}</>;
    case 'completed':
      return <>{actor} completed task {entityName}</>;
    case 'assigned':
      return <>{actor} assigned {activity.entity_type} {entityName}</>;
    case 'uploaded':
      return <>{actor} uploaded file {entityName}</>;
    case 'invited':
      return <>{actor} invited {entityName} to the workspace</>;
    case 'removed':
      return <>{actor} removed {entityName} from the workspace</>;
    default:
      return <>{actor} performed an action on {entityName}</>;
  }
};

export function ActivityCard({ activity, isLast }: ActivityCardProps) {
  const initials = activity.profile?.full_name
    ?.split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase() || '?';

  return (
    <div className="flex gap-4">
      <div className="flex flex-col items-center">
        <div className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-background border border-border shadow-sm">
          <Avatar className="h-8 w-8">
            {activity.profile?.avatar_url && <AvatarImage src={activity.profile.avatar_url} />}
            <AvatarFallback className="text-[10px]">{initials}</AvatarFallback>
          </Avatar>
          <div className="absolute -bottom-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-background border border-border">
            {getActionIcon(activity.action, activity.entity_type)}
          </div>
        </div>
        {!isLast && <div className="w-px h-full bg-border mt-2" />}
      </div>
      
      <div className="flex-1 pb-6 pt-1">
        <p className="text-sm text-muted-foreground">
          {formatActionText(activity)}
        </p>
        <p className="text-xs text-muted-foreground mt-1" suppressHydrationWarning>
          {formatDistanceToNow(parseISO(activity.created_at), { addSuffix: true })}
        </p>
        
        {activity.details && (
          <div className="mt-2 text-xs bg-muted/30 p-2 rounded border border-border/50 font-mono text-muted-foreground break-words">
            {JSON.stringify(activity.details)}
          </div>
        )}
      </div>
    </div>
  );
}
