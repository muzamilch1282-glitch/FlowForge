import * as React from 'react';
import { Shield, User } from 'lucide-react';
import { TeamRole } from '@/types/team';

interface MemberRoleBadgeProps {
  role: TeamRole;
  className?: string;
}

export function MemberRoleBadge({ role, className = '' }: MemberRoleBadgeProps) {
  const config = {
    admin: {
      color: 'bg-rose-100 text-rose-700 dark:bg-rose-500/10 dark:text-rose-400 border-rose-200 dark:border-rose-500/20',
      icon: Shield,
      label: 'Admin'
    },
    member: {
      color: 'bg-blue-100 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400 border-blue-200 dark:border-blue-500/20',
      icon: User,
      label: 'Member'
    }
  };

  const current = config[role] || config.member;
  const Icon = current.icon;

  return (
    <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium ${current.color} ${className}`}>
      <Icon className="h-3 w-3" />
      {current.label}
    </span>
  );
}
