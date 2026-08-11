import { AutomationRule, AutomationCondition, TriggerType, ActionType } from '@/types/automation';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { notificationService } from '@/services/notification.service';
import { activityService } from '@/services/activity.service';
import { taskService } from '@/services/task.service';

interface TriggerPayload {
  triggerType: TriggerType;
  workspaceId: string;
  userId: string;
  task?: Task;
  previousTask?: Task;
  project?: Project;
  previousProject?: Project;
}

export class RuleEngine {
  
  static async evaluateAndExecute(rules: AutomationRule[], payload: TriggerPayload) {
    const activeRules = rules.filter(r => r.is_active && r.trigger_type === payload.triggerType);

    for (const rule of activeRules) {
      const isMatch = this.evaluateConditions(rule.conditions, payload);
      if (isMatch) {
        await this.executeAction(rule, payload);
      }
    }
  }

  private static evaluateConditions(conditions: AutomationCondition[], payload: TriggerPayload): boolean {
    if (!conditions || conditions.length === 0) return true; // No conditions = always match

    for (const condition of conditions) {
      let fieldValue: any = undefined;

      // Resolve field value from payload (e.g., 'task.priority' -> payload.task.priority)
      if (condition.field.startsWith('task.') && payload.task) {
        fieldValue = (payload.task as any)[condition.field.split('.')[1]];
      } else if (condition.field.startsWith('project.') && payload.project) {
        fieldValue = (payload.project as any)[condition.field.split('.')[1]];
      } else if (condition.field.startsWith('previous_task.') && payload.previousTask) {
        fieldValue = (payload.previousTask as any)[condition.field.split('.')[1]];
      }

      const match = this.evaluateOperator(fieldValue, condition.operator, condition.value);
      if (!match) return false; // ALL conditions must match (AND logic)
    }

    return true;
  }

  private static evaluateOperator(fieldValue: any, operator: string, targetValue: any): boolean {
    // Coerce to string for simple comparison if needed, or keep types
    switch (operator) {
      case 'equals': return fieldValue === targetValue;
      case 'not_equals': return fieldValue !== targetValue;
      case 'contains': 
        return typeof fieldValue === 'string' && fieldValue.toLowerCase().includes(String(targetValue).toLowerCase());
      case 'is_empty': return fieldValue === null || fieldValue === undefined || fieldValue === '';
      case 'is_not_empty': return fieldValue !== null && fieldValue !== undefined && fieldValue !== '';
      default: return false;
    }
  }

  private static async executeAction(rule: AutomationRule, payload: TriggerPayload) {
    try {
      const { action_type, action_config } = rule;

      switch (action_type as ActionType) {
        case 'create_notification': {
          if (!payload.task && !payload.project) break;
          // E.g., message: "Task {{task.title}} was updated"
          let message = action_config.message || 'Automation triggered';
          if (payload.task) message = message.replace('{{task.title}}', payload.task.title);
          
          await notificationService.createNotification({
            user_id: action_config.notify_user_id || payload.userId, // fallback to triggerer
            type: 'system',
            title: `Automation: ${rule.name}`,
            message: message,
            entity_type: payload.task ? 'task' : (payload.project ? 'project' : 'workspace'),
            entity_id: payload.task?.id || payload.project?.id || payload.workspaceId,
          });
          break;
        }

        case 'change_task_status': {
          if (payload.task && action_config.status) {
            await taskService.updateTask(payload.task.id, { status: action_config.status });
          }
          break;
        }

        case 'change_task_priority': {
          if (payload.task && action_config.priority) {
            await taskService.updateTask(payload.task.id, { priority: action_config.priority });
          }
          break;
        }

        case 'assign_task': {
          if (payload.task && action_config.assignee_id) {
            await taskService.updateTask(payload.task.id, { assigned_to: action_config.assignee_id });
          }
          break;
        }

        case 'create_activity_log': {
          await activityService.createActivity({
            workspace_id: payload.workspaceId,
            project_id: payload.project?.id,
            task_id: payload.task?.id,
            action: 'updated',
            entity_type: payload.task ? 'task' : (payload.project ? 'project' : 'workspace'),
            entity_name: `Rule: ${rule.name}`,
          });
          break;
        }
      }
    } catch (error) {
      console.error(`Failed to execute automation rule ${rule.id}:`, error);
    }
  }
}
