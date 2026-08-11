export type TriggerType = 
  | 'task_created'
  | 'task_status_changed'
  | 'task_priority_changed'
  | 'task_completed'
  | 'task_assigned'
  | 'task_overdue'
  | 'task_due_approaching'
  | 'project_created'
  | 'project_status_changed';

export type ActionType = 
  | 'create_notification'
  | 'change_task_status'
  | 'change_task_priority'
  | 'assign_task'
  | 'create_activity_log';

export type ConditionOperator = 
  | 'equals'
  | 'not_equals'
  | 'contains'
  | 'greater_than'
  | 'less_than'
  | 'is_empty'
  | 'is_not_empty';

export interface AutomationCondition {
  field: string;
  operator: ConditionOperator;
  value: any;
}

export interface AutomationActionConfig {
  [key: string]: any;
}

export interface AutomationRule {
  id: string;
  workspace_id: string;
  name: string;
  description: string | null;
  trigger_type: TriggerType;
  conditions: AutomationCondition[];
  action_type: ActionType;
  action_config: AutomationActionConfig;
  is_active: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
}

export type CreateAutomationRuleDTO = Omit<AutomationRule, 'id' | 'created_at' | 'updated_at'>;
export type UpdateAutomationRuleDTO = Partial<CreateAutomationRuleDTO> & { id: string };
