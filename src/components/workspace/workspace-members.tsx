import * as React from 'react';
import { Avatar } from '@/components/shared';

export function WorkspaceMembers() {
  const members = [
    { id: 1, name: 'Alex Johnson', email: 'alex@flowforge.io', role: 'Owner' },
    { id: 2, name: 'Sarah Smith', email: 'sarah@flowforge.io', role: 'Admin' },
    { id: 3, name: 'Mike Brown', email: 'mike@flowforge.io', role: 'Member' },
  ];

  return (
    <div className="rounded-xl border border-border bg-card shadow-sm">
      <div className="border-b border-border px-6 py-4">
        <h3 className="font-semibold text-foreground">Workspace Members</h3>
      </div>
      <div className="divide-y divide-border">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between p-6">
            <div className="flex items-center gap-4">
              <Avatar
                src={`https://i.pravatar.cc/150?u=${member.email}`}
                alt={member.name}
                fallback={member.name.charAt(0)}
              />
              <div>
                <p className="text-sm font-medium text-foreground">{member.name}</p>
                <p className="text-sm text-muted-foreground">{member.email}</p>
              </div>
            </div>
            <div className="text-sm font-medium text-muted-foreground">
              {member.role}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
