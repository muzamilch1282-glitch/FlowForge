"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useAppStore } from "@/store";
import { usePermissions } from "@/hooks/usePermissions";
import { automationService } from "@/services/automation.service";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";

export function AutomationSettings() {
  const { activeWorkspaceId } = useAppStore();
  const { canEditWorkspace } = usePermissions();
  const queryClient = useQueryClient();
  const canEdit = canEditWorkspace();

  const { data: rules = [], isLoading } = useQuery({
    queryKey: ['automations', activeWorkspaceId],
    queryFn: () => automationService.getRulesByWorkspace(activeWorkspaceId!),
    enabled: !!activeWorkspaceId
  });

  const toggleMutation = useMutation({
    mutationFn: ({ id, active }: { id: string, active: boolean }) => automationService.toggleRule(id, active),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations', activeWorkspaceId] });
      toast.success("Automation rule updated");
    },
    onError: () => toast.error("Failed to update automation rule")
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => automationService.deleteRule(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['automations', activeWorkspaceId] });
      toast.success("Automation rule deleted");
    },
    onError: () => toast.error("Failed to delete automation rule")
  });

  if (!activeWorkspaceId) {
    return (
      <Card>
        <CardContent className="pt-6">
          <p className="text-sm text-muted-foreground">Select a workspace to view automations.</p>
        </CardContent>
      </Card>
    );
  }

  const activeCount = rules.filter((r: any) => r.active).length;
  const disabledCount = rules.length - activeCount;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Automation Rules</CardTitle>
          <CardDescription>Manage automated workflows for this workspace.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex gap-4">
            <div className="bg-muted p-4 rounded-xl flex-1 text-center">
              <p className="text-2xl font-semibold">{rules.length}</p>
              <p className="text-sm text-muted-foreground">Total Rules</p>
            </div>
            <div className="bg-muted p-4 rounded-xl flex-1 text-center">
              <p className="text-2xl font-semibold text-green-600">{activeCount}</p>
              <p className="text-sm text-muted-foreground">Active</p>
            </div>
            <div className="bg-muted p-4 rounded-xl flex-1 text-center">
              <p className="text-2xl font-semibold text-amber-600">{disabledCount}</p>
              <p className="text-sm text-muted-foreground">Disabled</p>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            {isLoading ? (
              <p className="text-sm text-muted-foreground text-center py-4">Loading rules...</p>
            ) : rules.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No automation rules found.</p>
            ) : (
              rules.map((rule: any) => (
                <div key={rule.id} className="flex items-center justify-between p-4 border border-border rounded-xl">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <p className="font-medium">{rule.name}</p>
                      <Badge variant={rule.active ? "default" : "secondary"}>
                        {rule.active ? "Active" : "Disabled"}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground">Trigger: {rule.trigger_type}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Switch
                      checked={rule.active}
                      disabled={!canEdit || toggleMutation.isPending}
                      onCheckedChange={(checked) => toggleMutation.mutate({ id: rule.id, active: checked })}
                    />
                    {canEdit && (
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => {
                          if (confirm("Are you sure you want to delete this rule?")) {
                            deleteMutation.mutate(rule.id);
                          }
                        }}
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </Button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="flex justify-end pt-4">
             <Link href="/dashboard/automations">
                <Button variant="outline">Manage All Automations</Button>
             </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
