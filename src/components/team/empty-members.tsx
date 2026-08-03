import * as React from 'react';
import { Users, UserPlus } from 'lucide-react';
import { Button } from '@/components/shared';

interface EmptyMembersProps {
  onInvite: () => void;
  isAdmin: boolean;
}

export function EmptyMembers({ onInvite, isAdmin }: EmptyMembersProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-card/50 p-12 text-center animate-in fade-in duration-500">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary mb-6">
        <Users className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-foreground mb-2">
        No team members found
      </h3>
      <p className="text-sm text-muted-foreground max-w-md mx-auto mb-8">
        It looks like there are no members in this workspace matching your filters, or the workspace is currently empty.
      </p>
      
      {isAdmin && (
        <Button onClick={onInvite} className="gap-2">
          <UserPlus className="h-4 w-4" />
          Invite a Member
        </Button>
      )}
    </div>
  );
}
