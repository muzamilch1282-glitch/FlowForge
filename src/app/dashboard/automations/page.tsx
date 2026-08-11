'use client';

import * as React from 'react';
import { PageHeader, Button, EmptyState } from '@/components/shared';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useAppStore } from '@/store';
import { useAutomations } from '@/hooks/useAutomations';
import { Plus, Settings2, Power, Trash2, Edit2 } from 'lucide-react';
import { format } from 'date-fns';
import { AutomationBuilder } from '@/components/automations/automation-builder';
import { AutomationRule } from '@/types/automation';

export default function AutomationsPage() {
  const { workspaces } = useWorkspace();
  const { activeWorkspaceId } = useAppStore();
  const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const { rules, isLoading, toggleRule, deleteRule } = useAutomations(currentWorkspace?.id);
  const [isBuilderOpen, setIsBuilderOpen] = React.useState(false);
  const [editingRule, setEditingRule] = React.useState<AutomationRule | null>(null);

  const handleCreate = () => {
    setEditingRule(null);
    setIsBuilderOpen(true);
  };

  const handleEdit = (rule: AutomationRule) => {
    setEditingRule(rule);
    setIsBuilderOpen(true);
  };

  const handleClose = () => {
    setIsBuilderOpen(false);
    setEditingRule(null);
  };

  const getTriggerLabel = (type: string) => {
    return type.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <PageHeader 
          title="Automations" 
          description="Create powerful rules to automate your workflow in this workspace."
        />
        <Button onClick={handleCreate} className="gap-2 shadow-md hover:shadow-lg transition-all rounded-xl">
          <Plus className="h-4 w-4" />
          Create Automation
        </Button>
      </div>

      {isLoading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-24 bg-card/50 border border-border/50 rounded-2xl animate-pulse" />
          ))}
        </div>
      ) : rules.length === 0 ? (
        <EmptyState
          title="No automations yet"
          description="Save time by automating repetitive tasks and notifications."
          icon={Settings2}
        >
          <Button onClick={handleCreate} className="mt-4 gap-2">
            <Plus className="h-4 w-4" />
            Create your first rule
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4">
          {rules.map(rule => (
            <div 
              key={rule.id} 
              className={`p-5 rounded-2xl border bg-card/40 backdrop-blur-sm transition-all duration-300 hover:shadow-md ${rule.is_active ? 'border-border' : 'border-dashed border-border/50 opacity-70'}`}
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <h3 className="font-semibold text-lg">{rule.name}</h3>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${rule.is_active ? 'bg-emerald-500/10 text-emerald-500' : 'bg-muted text-muted-foreground'}`}>
                      {rule.is_active ? 'Active' : 'Disabled'}
                    </span>
                  </div>
                  {rule.description && (
                    <p className="text-sm text-muted-foreground">{rule.description}</p>
                  )}
                  <div className="flex items-center gap-2 mt-2 text-xs font-medium text-muted-foreground">
                    <span className="text-primary/80">WHEN</span> {getTriggerLabel(rule.trigger_type)}
                    <span className="text-primary/80 ml-2">THEN</span> {getTriggerLabel(rule.action_type)}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => toggleRule({ id: rule.id, is_active: !rule.is_active })}
                    className={rule.is_active ? 'text-amber-500 hover:text-amber-600 hover:bg-amber-500/10' : 'text-emerald-500 hover:text-emerald-600 hover:bg-emerald-500/10'}
                  >
                    <Power className="h-4 w-4 mr-2" />
                    {rule.is_active ? 'Disable' : 'Enable'}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleEdit(rule)}>
                    <Edit2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-500/10" onClick={() => deleteRule(rule.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {isBuilderOpen && currentWorkspace && (
        <AutomationBuilder 
          workspaceId={currentWorkspace.id}
          existingRule={editingRule} 
          onClose={handleClose} 
        />
      )}
    </div>
  );
}
