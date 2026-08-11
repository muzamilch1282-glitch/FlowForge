'use client';

import * as React from 'react';
import { AutomationRule, CreateAutomationRuleDTO, TriggerType, ActionType, AutomationCondition, ConditionOperator } from '@/types/automation';
import { useAutomations } from '@/hooks/useAutomations';
import { Button } from '@/components/shared';
import { useAuth } from '@/hooks/useAuth';
import { X, Plus, Trash2, ArrowRight } from 'lucide-react';
import { useTeam } from '@/hooks/useTeam';

interface AutomationBuilderProps {
  workspaceId: string;
  existingRule: AutomationRule | null;
  onClose: () => void;
}

const TRIGGER_OPTIONS: { value: TriggerType; label: string }[] = [
  { value: 'task_created', label: 'Task is created' },
  { value: 'task_status_changed', label: 'Task status changes' },
  { value: 'task_priority_changed', label: 'Task priority changes' },
  { value: 'task_completed', label: 'Task is completed' },
  { value: 'task_assigned', label: 'Task is assigned' },
  { value: 'task_overdue', label: 'Task becomes overdue' },
  { value: 'project_created', label: 'Project is created' },
];

const ACTION_OPTIONS: { value: ActionType; label: string }[] = [
  { value: 'create_notification', label: 'Send a notification' },
  { value: 'change_task_status', label: 'Change task status' },
  { value: 'change_task_priority', label: 'Change task priority' },
  { value: 'assign_task', label: 'Assign task to someone' },
  { value: 'create_activity_log', label: 'Create an activity log' },
];

const OPERATOR_OPTIONS: { value: ConditionOperator; label: string }[] = [
  { value: 'equals', label: 'Equals' },
  { value: 'not_equals', label: 'Does not equal' },
  { value: 'contains', label: 'Contains' },
];

export function AutomationBuilder({ workspaceId, existingRule, onClose }: AutomationBuilderProps) {
  const { createRule, updateRule } = useAutomations(workspaceId);
  const { members: team = [] } = useTeam();
  const { user } = useAuth();
  const [isSaving, setIsSaving] = React.useState(false);

  const [name, setName] = React.useState(existingRule?.name || '');
  const [trigger, setTrigger] = React.useState<TriggerType>(existingRule?.trigger_type || 'task_status_changed');
  const [conditions, setConditions] = React.useState<AutomationCondition[]>(existingRule?.conditions || []);
  const [action, setAction] = React.useState<ActionType>(existingRule?.action_type || 'create_notification');
  const [actionConfig, setActionConfig] = React.useState<any>(existingRule?.action_config || { message: '{{task.title}} was updated' });

  const handleAddCondition = () => {
    setConditions([...conditions, { field: 'task.status', operator: 'equals', value: '' }]);
  };

  const handleUpdateCondition = (index: number, updates: Partial<AutomationCondition>) => {
    const newConditions = [...conditions];
    newConditions[index] = { ...newConditions[index], ...updates };
    setConditions(newConditions);
  };

  const handleRemoveCondition = (index: number) => {
    setConditions(conditions.filter((_, i) => i !== index));
  };

  const handleSave = async () => {
    if (!name.trim()) return alert('Please provide a rule name.');
    
    setIsSaving(true);
    try {
      if (existingRule) {
        await updateRule({
          id: existingRule.id,
          name,
          trigger_type: trigger,
          conditions,
          action_type: action,
          action_config: actionConfig,
        });
      } else {
        await createRule({
          workspace_id: workspaceId,
          created_by: user?.id || '',
          name,
          description: '',
          trigger_type: trigger,
          conditions,
          action_type: action,
          action_config: actionConfig,
          is_active: true,
        });
      }
      onClose();
    } catch (error: any) {
      console.error("Automation Save Error:", JSON.stringify(error, null, 2), error.message, error);
      alert('Failed to save automation rule: ' + (error?.message || 'Unknown error'));
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="w-full max-w-2xl bg-card border border-border shadow-2xl rounded-2xl overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-border bg-muted/30">
          <h2 className="font-semibold text-lg">{existingRule ? 'Edit Automation' : 'New Automation'}</h2>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-accent text-muted-foreground transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-8 flex-1">
          {/* Rule Name */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-foreground">Rule Name</label>
            <input 
              type="text" 
              value={name} 
              onChange={e => setName(e.target.value)} 
              placeholder="e.g. Notify me when a high priority task is done"
              className="w-full h-10 px-3 rounded-lg border border-input bg-background focus:ring-1 focus:ring-primary outline-none"
            />
          </div>

          {/* WHEN Trigger */}
          <div className="bg-primary/5 border border-primary/20 rounded-xl p-5 space-y-4 relative">
            <div className="absolute -left-3 top-5 bg-primary text-primary-foreground px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">WHEN</div>
            <select 
              value={trigger} 
              onChange={e => setTrigger(e.target.value as TriggerType)}
              className="w-full h-10 px-3 rounded-lg border border-primary/30 bg-background focus:ring-1 focus:ring-primary outline-none font-medium ml-4 max-w-[calc(100%-1rem)]"
            >
              {TRIGGER_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>

          {/* IF Conditions */}
          <div className="bg-amber-500/5 border border-amber-500/20 rounded-xl p-5 space-y-4 relative">
            <div className="absolute -left-3 top-5 bg-amber-500 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">IF</div>
            
            <div className="ml-4 space-y-3">
              {conditions.length === 0 ? (
                <p className="text-sm text-muted-foreground italic">Always runs when triggered</p>
              ) : (
                conditions.map((cond, i) => (
                  <div key={i} className="flex flex-col sm:flex-row items-center gap-2">
                    <input 
                      type="text" 
                      value={cond.field} 
                      onChange={e => handleUpdateCondition(i, { field: e.target.value })}
                      placeholder="e.g. task.status"
                      className="w-full sm:w-1/3 h-9 px-3 rounded-md border border-input bg-background text-sm"
                    />
                    <select 
                      value={cond.operator}
                      onChange={e => handleUpdateCondition(i, { operator: e.target.value as ConditionOperator })}
                      className="w-full sm:w-1/4 h-9 px-3 rounded-md border border-input bg-background text-sm"
                    >
                      {OPERATOR_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                    </select>
                    <input 
                      type="text" 
                      value={cond.value} 
                      onChange={e => handleUpdateCondition(i, { value: e.target.value })}
                      placeholder="Value"
                      className="w-full sm:flex-1 h-9 px-3 rounded-md border border-input bg-background text-sm"
                    />
                    <button onClick={() => handleRemoveCondition(i)} className="p-2 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 rounded-md">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                ))
              )}
              
              <Button variant="outline" size="sm" onClick={handleAddCondition} className="gap-2 mt-2 border-amber-500/30 text-amber-600 hover:bg-amber-500/10">
                <Plus className="h-3 w-3" /> Add Condition
              </Button>
            </div>
          </div>

          {/* THEN Action */}
          <div className="bg-emerald-500/5 border border-emerald-500/20 rounded-xl p-5 space-y-4 relative">
            <div className="absolute -left-3 top-5 bg-emerald-500 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wider">THEN</div>
            
            <div className="ml-4 space-y-4">
              <select 
                value={action} 
                onChange={e => setAction(e.target.value as ActionType)}
                className="w-full h-10 px-3 rounded-lg border border-emerald-500/30 bg-background focus:ring-1 focus:ring-emerald-500 outline-none font-medium"
              >
                {ACTION_OPTIONS.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
              </select>

              {/* Action Config UI based on type */}
              <div className="p-4 rounded-lg bg-background border border-border">
                {action === 'create_notification' && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Notification Message</label>
                    <input 
                      type="text" 
                      value={actionConfig.message || ''} 
                      onChange={e => setActionConfig({ ...actionConfig, message: e.target.value })}
                      placeholder="e.g. {{task.title}} was completed!"
                      className="w-full h-9 px-3 rounded-md border border-input bg-muted/50 text-sm"
                    />
                    <p className="text-[10px] text-muted-foreground">You can use {'{{task.title}}'} or {'{{project.title}}'} as variables.</p>
                  </div>
                )}
                {action === 'change_task_status' && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium">New Status</label>
                    <select 
                      value={actionConfig.status || ''} 
                      onChange={e => setActionConfig({ ...actionConfig, status: e.target.value })}
                      className="w-full h-9 px-3 rounded-md border border-input bg-muted/50 text-sm"
                    >
                      <option value="">Select status...</option>
                      <option value="todo">To Do</option>
                      <option value="in-progress">In Progress</option>
                      <option value="review">Review</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>
                )}
                {action === 'change_task_priority' && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium">New Priority</label>
                    <select 
                      value={actionConfig.priority || ''} 
                      onChange={e => setActionConfig({ ...actionConfig, priority: e.target.value })}
                      className="w-full h-9 px-3 rounded-md border border-input bg-muted/50 text-sm"
                    >
                      <option value="">Select priority...</option>
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                )}
                {action === 'assign_task' && (
                  <div className="space-y-2">
                    <label className="text-xs font-medium">Assign To</label>
                    <select 
                      value={actionConfig.assignee_id || ''} 
                      onChange={e => setActionConfig({ ...actionConfig, assignee_id: e.target.value })}
                      className="w-full h-9 px-3 rounded-md border border-input bg-muted/50 text-sm"
                    >
                      <option value="">Select member...</option>
                      {team.map(m => (
                        <option key={m.user_id} value={m.user_id}>{m.profile?.full_name || m.profile?.email}</option>
                      ))}
                    </select>
                  </div>
                )}
                {action === 'create_activity_log' && (
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">This will simply write a log to the Activity feed when triggered.</p>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>

        <div className="p-4 border-t border-border bg-muted/30 flex justify-end gap-3">
          <Button variant="ghost" onClick={onClose} disabled={isSaving}>Cancel</Button>
          <Button onClick={handleSave} disabled={isSaving} className="gap-2">
            {isSaving ? 'Saving...' : 'Save Automation'}
            {!isSaving && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>
      </div>
    </div>
  );
}
