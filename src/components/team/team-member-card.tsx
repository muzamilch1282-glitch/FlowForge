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
    <tr className="group hover:bg-secondary/40 transition-colors border-b border-border/50 last:border-0">
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <MemberAvatar name={name} avatarUrl={profile?.avatar_url} size="sm" />
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-foreground text-sm">{name}</span>
              {isCurrentUser && (
                <span className="rounded bg-secondary px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  You
                </span>
              )}
            </div>
            <span className="text-xs text-muted-foreground">{email}</span>
          </div>
        </div>
      </td>
      
      <td className="px-4 py-3 hidden sm:table-cell">
        <MemberRoleBadge role={member.role} />
      </td>

      <td className="px-4 py-3 text-right">
        {isAdmin && !isCurrentUser ? (
          <div className="relative inline-block text-left" ref={dropdownRef}>
            <Button 
              variant="ghost" 
              size="icon" 
              className="h-8 w-8 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
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
        ) : (
          <div className="h-8 w-8 inline-block" /> // Placeholder to maintain alignment
        )}
      </td>
    </tr>
  );
}
