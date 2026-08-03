import { UserProfile } from './auth';

export type TeamRole = 'admin' | 'member';

export interface TeamMember {
  id: string;
  workspace_id: string;
  user_id: string;
  role: TeamRole;
  created_at: string;
  updated_at: string;
  profile?: UserProfile;
}

export interface InviteMemberDTO {
  email: string;
  workspace_id: string;
  role: TeamRole;
}

export interface UpdateMemberRoleDTO {
  id: string;
  role: TeamRole;
}
