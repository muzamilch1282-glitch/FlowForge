import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/shared/badge';
import { Avatar } from '@/components/shared/avatar';
import { FolderKanban, Users } from 'lucide-react';
import * as React from 'react';

export interface WorkspaceCardProps {
  name: string;
  owner: { name: string; avatarUrl?: string };
  projectCount: number;
  memberCount: number;
  status: 'active' | 'archived';
}

export function WorkspaceCard({
  name,
  owner,
  projectCount,
  memberCount,
  status,
}: WorkspaceCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg font-semibold">{name}</CardTitle>
          <Badge variant={status === 'active' ? 'default' : 'secondary'}>
            {status}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <div className="flex items-center gap-3">
          <Avatar 
            className="w-10 h-10"
            src={owner.avatarUrl}
            fallback={owner.name.charAt(0)}
          />
          <div>
            <p className="text-sm font-medium">Owned by {owner.name}</p>
            <p className="text-xs text-muted-foreground">Workspace Owner</p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-3 border-t">
        <div className="flex items-center gap-4 text-sm text-muted-foreground w-full">
          <div className="flex items-center gap-1.5">
            <FolderKanban className="w-4 h-4" />
            <span>{projectCount} Projects</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Users className="w-4 h-4" />
            <span>{memberCount} Members</span>
          </div>
        </div>
      </CardFooter>
    </Card>
  );
}
