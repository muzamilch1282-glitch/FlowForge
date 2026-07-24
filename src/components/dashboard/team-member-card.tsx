import { Card, CardContent } from '@/components/ui/card';

import { Avatar } from '@/components/shared/avatar';
import { Mail, MoreVertical } from 'lucide-react';
import { Button } from '@/components/shared/button';
import { Dropdown } from '@/components/shared/dropdown';
import * as React from 'react';

export interface TeamMemberCardProps {
  name: string;
  role: string;
  email: string;
  status: 'online' | 'offline' | 'away';
  avatarUrl?: string;
}

const statusColors = {
  online: 'bg-green-500',
  offline: 'bg-gray-400',
  away: 'bg-yellow-500',
};

export function TeamMemberCard({
  name,
  role,
  email,
  status,
  avatarUrl,
}: TeamMemberCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Avatar 
                className="w-12 h-12"
                src={avatarUrl}
                fallback={name.charAt(0)}
              />
              <span 
                className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-background ${statusColors[status]}`}
              />
            </div>
            <div>
              <h3 className="font-semibold">{name}</h3>
              <p className="text-sm text-muted-foreground">{role}</p>
            </div>
          </div>
          
          <Dropdown 
            trigger={
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <MoreVertical className="h-4 w-4" />
              </Button>
            }
            items={[
              { label: 'View Profile' },
              { label: 'Message' },
              { label: 'Edit Role' },
              { label: 'Remove Member', disabled: true },
            ]}
          />
        </div>
        
        <div className="mt-4 pt-4 border-t">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="w-4 h-4" />
            <span>{email}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
