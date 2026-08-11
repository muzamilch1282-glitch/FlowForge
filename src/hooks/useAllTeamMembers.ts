import { useQuery } from '@tanstack/react-query';
import { teamService } from '@/services/team.service';

export function useAllTeamMembers() {
  const query = useQuery({
    queryKey: ['team_members', 'all'],
    queryFn: () => teamService.getAllMembers(),
  });

  return {
    members: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
  };
}
