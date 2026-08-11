import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { automationService } from '@/services/automation.service';
import { CreateAutomationRuleDTO, UpdateAutomationRuleDTO } from '@/types/automation';

export function useAutomations(workspaceId: string | undefined) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['automations', workspaceId],
    queryFn: () => automationService.getRulesByWorkspace(workspaceId!),
    enabled: !!workspaceId,
  });

  const createMutation = useMutation({
    mutationFn: (rule: CreateAutomationRuleDTO) => automationService.createRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations', workspaceId] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: (rule: UpdateAutomationRuleDTO) => automationService.updateRule(rule),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations', workspaceId] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => automationService.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations', workspaceId] });
    },
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, is_active }: { id: string, is_active: boolean }) => automationService.toggleRule(id, is_active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations', workspaceId] });
    },
  });

  return {
    rules: query.data || [],
    isLoading: query.isLoading,
    error: query.error,
    createRule: createMutation.mutateAsync,
    updateRule: updateMutation.mutateAsync,
    deleteRule: deleteMutation.mutateAsync,
    toggleRule: toggleMutation.mutateAsync,
  };
}
