import * as React from 'react';
import { Filter } from 'lucide-react';

interface TeamFiltersProps {
  selectedRole: string;
  onRoleChange: (val: string) => void;
}

export function TeamFilters({ selectedRole, onRoleChange }: TeamFiltersProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 shadow-sm hover:bg-accent hover:text-accent-foreground transition-colors h-9">
      <Filter className="h-3.5 w-3.5 text-muted-foreground" />
      <select
        value={selectedRole}
        onChange={(e) => onRoleChange(e.target.value)}
        className="bg-transparent text-sm text-foreground focus:outline-none appearance-none pr-2 cursor-pointer"
      >
        <option value="all">All Roles</option>
        <option value="admin">Admins</option>
        <option value="member">Members</option>
      </select>
    </div>
  );
}
