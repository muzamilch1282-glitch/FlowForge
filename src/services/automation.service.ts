import { supabase } from '@/lib/supabase';
import { AutomationRule, CreateAutomationRuleDTO, UpdateAutomationRuleDTO, TriggerType } from '@/types/automation';

export const automationService = {
  async getRulesByWorkspace(workspaceId: string): Promise<AutomationRule[]> {
    const { data, error } = await supabase
      .from('automation_rules')
      .select('*')
      .eq('workspace_id', workspaceId)
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data as AutomationRule[];
  },

  async createRule(rule: CreateAutomationRuleDTO): Promise<AutomationRule> {
    const { data, error } = await supabase
      .from('automation_rules')
      .insert(rule)
      .select()
      .single();

    if (error) throw error;
    return data as AutomationRule;
  },

  async updateRule(rule: UpdateAutomationRuleDTO): Promise<AutomationRule> {
    const { id, ...updates } = rule;
    const { data, error } = await supabase
      .from('automation_rules')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data as AutomationRule;
  },

  async deleteRule(id: string): Promise<void> {
    const { error } = await supabase
      .from('automation_rules')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  async toggleRule(id: string, is_active: boolean): Promise<AutomationRule> {
    return this.updateRule({ id, is_active });
  }
};
