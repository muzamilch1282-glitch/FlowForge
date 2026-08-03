import * as React from 'react';
import { TeamMember } from '@/types/team';
import { MemberAvatar } from './member-avatar';
import { MemberRoleBadge } from './member-role-badge';
import { MoreVertical, Trash, Shield, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/shared';

interface TeamMemberCardProps {
  member: TeamMember;
  isAdmin: boolean;
  isCurrentUser: boolean;
  onRemove: (id: string) => void;
  onUpdateRole: (id: string, newRole: 'admin' | 'member') => void;
  isProcessing?: boolean;
}

export function TeamMemberCard({ 
  member, 
  isAdmin, 
  isCurrentUser, 
  onRemove, 
  onUpdateRole,
  isProcessing = false
}: TeamMemberCardProps) {
  const [isOpen, setIsOpen] = React.useState(false);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  const profile = member.profile;
  const name = profile?.full_name || 'Unknown User';
  const email = profile?.email || 'No email';

  // Close dropdown when clicking outside
  React.useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="flex items-center justify-between rounded-xl border border-border bg-card p-4 transition-all hover:shadow-sm">
      <div className="flex items-center gap-4">
        <MemberAvatar name={name} avatarUrl={profile?.avatar_url} size="lg" />
        <div className="flex flex-col">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-foreground">{name}</span>
            {isCurrentUser && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                You
              </span>
            )}
          </div>
          <span className="text-sm text-muted-foreground">{email}</span>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <div className="hidden sm:block">
          <MemberRoleBadge role={member.role} />
        </div>
        
        {isAdmin && !isCurrentUser && (
          <div className="relative" ref={dropdownRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground"
              onClick={() => setIsOpen(!isOpen)}
              disabled={isProcessing}
            >
              <MoreVertical className="h-4 w-4" />
            </Button>
            
            {isOpen && (
              <div className="absolute right-0 top-full z-10 mt-1 w-48 rounded-md border border-border bg-popover p-1 text-popover-foreground shadow-md animate-in fade-in slide-in-from-top-2">
                <button
                  onClick={() => {
                    onUpdateRole(member.id, member.role === 'admin' ? 'member' : 'admin');
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground"
                >
                  {member.role === 'admin' ? (
                    <>
                      <ShieldAlert className="h-4 w-4" />
                      Demote to Member
                    </>
                  ) : (
                    <>
                      <Shield className="h-4 w-4" />
                      Promote to Admin
                    </>
                  )}
                </button>
                <div className="my-1 h-px bg-border" />
                <button
                  onClick={() => {
                    onRemove(member.id);
                    setIsOpen(false);
                  }}
                  className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-destructive/10"
                >
                  <Trash className="h-4 w-4" />
                  Remove from Team
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
