import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/shared/badge';
import { Avatar } from '@/components/shared/avatar';
import { CalendarDays, Users } from 'lucide-react';
import * as React from 'react';

export interface ProjectCardProps {
  name: string;
  description: string;
  progress: number;
  status: 'active' | 'completed' | 'on-hold';
  priority: 'high' | 'medium' | 'low';
  members: { name: string; avatarUrl?: string }[];
  dueDate: string;
}

const statusColors = {
  active: 'bg-green-500/10 text-green-500',
  completed: 'bg-blue-500/10 text-blue-500',
  'on-hold': 'bg-yellow-500/10 text-yellow-500',
};

const priorityColors = {
  high: 'bg-red-500/10 text-red-500',
  medium: 'bg-orange-500/10 text-orange-500',
  low: 'bg-emerald-500/10 text-emerald-500',
};

export function ProjectCard({
  name,
  description,
  progress,
  status,
  priority,
  members,
  dueDate,
}: ProjectCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <Badge variant="secondary" className={statusColors[status]}>
            {status}
          </Badge>
        </div>
        <CardDescription className="line-clamp-2 mt-1">{description}</CardDescription>
      </CardHeader>
      <CardContent className="pb-3 space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{progress}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="bg-primary rounded-full h-2 transition-all"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
        
        <div className="flex justify-between items-center text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <CalendarDays className="w-4 h-4" />
            <span>{dueDate}</span>
          </div>
          <Badge variant="outline" className={priorityColors[priority]}>
            {priority} priority
          </Badge>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm text-muted-foreground">{members.length} members</span>
          </div>
          <div className="flex -space-x-2 overflow-hidden">
            {members.slice(0, 3).map((member, i) => (
              <Avatar
                key={i}
                className="w-8 h-8 border-2 border-background"
                src={member.avatarUrl}
                fallback={member.name.charAt(0)}
              />
            ))}
            {members.length > 3 && (
              <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center text-xs border-2 border-background z-10">
                +{members.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
