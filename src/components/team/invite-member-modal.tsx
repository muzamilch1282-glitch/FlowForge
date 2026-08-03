import * as React from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/shared';
import { Workspace } from '@/types/workspace';
import { TeamRole } from '@/types/team';

interface InviteMemberModalProps {
  isOpen: boolean;
  onClose: () => void;
  workspaces: Workspace[];
  activeWorkspaceId: string;
  onSubmit: (data: { email: string; workspace_id: string; role: TeamRole }) => void;
  isSubmitting: boolean;
}

export function InviteMemberModal({
  isOpen,
  onClose,
  workspaces,
  activeWorkspaceId,
  onSubmit,
  isSubmitting
}: InviteMemberModalProps) {
  const [email, setEmail] = React.useState('');
  const [workspaceId, setWorkspaceId] = React.useState(activeWorkspaceId || (workspaces[0]?.id ?? ''));
  const [role, setRole] = React.useState<TeamRole>('member');
  const [error, setError] = React.useState('');

  React.useEffect(() => {
    if (isOpen) {
      setEmail('');
      setWorkspaceId(activeWorkspaceId || (workspaces[0]?.id ?? ''));
      setRole('member');
      setError('');
    }
  }, [isOpen, activeWorkspaceId, workspaces]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !workspaceId) {
      setError('Please fill out all required fields.');
      return;
    }
    
    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address.');
      return;
    }

    onSubmit({ email, workspace_id: workspaceId, role });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-lg animate-in zoom-in-95 duration-200"
        onClick={e => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-semibold tracking-tight">Invite Team Member</h2>
            <p className="text-sm text-muted-foreground">Add a new member to your workspace.</p>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8 rounded-full">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="email">
              Email Address <span className="text-destructive">*</span>
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              placeholder="colleague@example.com"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="workspace_id">
              Workspace <span className="text-destructive">*</span>
            </label>
            <select
              id="workspace_id"
              required
              value={workspaceId}
              onChange={e => setWorkspaceId(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="" disabled>Select a workspace</option>
              {workspaces.map(w => (
                <option key={w.id} value={w.id}>{w.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground" htmlFor="role">
              Role
            </label>
            <select
              id="role"
              value={role}
              onChange={e => setRole(e.target.value as TeamRole)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
            >
              <option value="member">Member - Can edit and create items</option>
              <option value="admin">Admin - Full access including team management</option>
            </select>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onClose} disabled={isSubmitting}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Inviting...' : 'Send Invite'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
