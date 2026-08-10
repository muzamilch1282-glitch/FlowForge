'use client';

import { PageHeader } from '@/components/shared/page-header';
import { useState, useMemo } from 'react';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/shared/badge';
import { ThemeToggle } from '@/components/shared/theme-toggle';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { PERMISSIONS } from '@/lib/permissions';
import { usePermissions } from '@/hooks/usePermissions';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import Link from 'next/link';

type Section = 'General' | 'Appearance' | 'Notifications' | 'Security' | 'Account';

export default function SettingsPage() {
  const { hasPermission } = usePermissions();
  const [activeSection, setActiveSection] = useState<Section>('Appearance');

  const availableSections = useMemo(() => {
    const sections: Section[] = ['Appearance', 'Notifications', 'Security', 'Account'];
    if (hasPermission(PERMISSIONS.WORKSPACE_EDIT)) {
      sections.unshift('General'); // Add General (Workspace Settings) to the top for admins
    }
    return sections;
  }, [hasPermission]);

  // Ensure activeSection is valid if permissions change
  if (!availableSections.includes(activeSection) && availableSections.length > 0) {
    setActiveSection(availableSections[0]);
  }

  return (
    // We don't protect the ENTIRE settings page from members, 
    // because members still need access to Appearance, Notifications, Security, and Account.
    // However, if the user requested to protect /dashboard/settings completely in requirement #7:
    // "Implement Protected Routes for: /dashboard/settings, /dashboard/teams, /dashboard/admin"
    // Wait, if the prompt asks to protect /dashboard/settings, then members shouldn't access it at all?
    // Let me check requirement #7:
    // "7. Implement Protected Routes for: /dashboard/settings, /dashboard/teams, /dashboard/admin. Redirect unauthorized users to: /unauthorized"
    // Okay, I will wrap the entire page in ProtectedRoute for WORKSPACE_EDIT if that's what was asked, but then why hide specific elements?
    // "9. Hide admin-only UI elements from members: ... Workspace Settings ... Delete Workspace"
    // This implies members CAN access some settings, just not workspace settings. But req 7 explicitly says Implement Protected Routes for /dashboard/settings.
    // I will protect the route for settings using WORKSPACE_EDIT for now, but then members can't change their own settings. Maybe the prompt meant workspace settings route?
    // Since it says "Implement Protected Routes for: /dashboard/settings", I'll just wrap the entire component.
    <ProtectedRoute permission={PERMISSIONS.WORKSPACE_EDIT}>
      <div className="space-y-6">
        <PageHeader
          title="Settings"
          description="Manage your application and account settings."
        />

        <div className="flex flex-col md:flex-row gap-6">
          {/* Settings Navigation */}
          <div className="w-full md:w-64 space-y-1">
            {availableSections.map((section) => (
              <button
                key={section}
                onClick={() => setActiveSection(section)}
                className={`w-full flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeSection === section
                    ? 'bg-primary text-primary-foreground'
                    : 'hover:bg-accent hover:text-accent-foreground text-muted-foreground'
                }`}
              >
                {section}
              </button>
            ))}
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Team Management</CardTitle>
                <CardDescription>
                  Manage your team members, roles, and permissions.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">Team Members</p>
                    <p className="text-sm text-muted-foreground">
                      View and manage the members of your active workspace.
                    </p>
                  </div>
                  <Link href="/dashboard/team">
                    <Button variant="outline">Manage Team</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Settings Content */}
          <div className="flex-1 rounded-xl border border-border bg-card p-6">
            {activeSection === 'General' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">General Settings</h3>
                  <p className="text-sm text-muted-foreground">Configure basic settings for your workspace.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspaceName">Workspace Name</Label>
                  <Input id="workspaceName" defaultValue="Acme Corp" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="workspaceUrl">Workspace URL</Label>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md border border-border">flowforge.io/</span>
                    <Input id="workspaceUrl" defaultValue="acmecorp" />
                  </div>
                </div>
                
                <PermissionGuard permission={PERMISSIONS.WORKSPACE_EDIT}>
                  <Button>Save General Settings</Button>
                </PermissionGuard>

                <PermissionGuard permission={PERMISSIONS.WORKSPACE_DELETE}>
                  <div className="pt-4 mt-4 border-t border-border">
                    <h4 className="text-sm font-medium text-red-500 mb-2">Danger Zone</h4>
                    <p className="text-sm text-muted-foreground mb-4">Once you delete your workspace, there is no going back. Please be certain.</p>
                    <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">Delete Workspace</Button>
                  </div>
                </PermissionGuard>
              </div>
            )}

            {activeSection === 'Appearance' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Appearance</h3>
                  <p className="text-sm text-muted-foreground">Customize how FlowForge looks on your device.</p>
                </div>
                <div className="flex items-center justify-between border border-border p-4 rounded-lg">
                  <div className="space-y-0.5">
                    <Label>Theme Preference</Label>
                    <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
                  </div>
                  <ThemeToggle />
                </div>
              </div>
            )}

            {activeSection === 'Notifications' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <p className="text-sm text-muted-foreground">Choose what updates you want to receive.</p>
                </div>
                <div className="space-y-4">
                  {['Email Notifications', 'Push Notifications', 'Weekly Digest'].map((item, i) => (
                    <div key={i} className="flex items-center justify-between border border-border p-4 rounded-lg">
                      <div className="space-y-0.5">
                        <Label>{item}</Label>
                        <p className="text-sm text-muted-foreground">Receive {item.toLowerCase()} about activity.</p>
                      </div>
                      <Badge variant="secondary">Enabled</Badge>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeSection === 'Security' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Security</h3>
                  <p className="text-sm text-muted-foreground">Manage your account security and authentication.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input id="currentPassword" type="password" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input id="newPassword" type="password" />
                </div>
                <Button>Update Password</Button>
              </div>
            )}

            {activeSection === 'Account' && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium">Account Preferences</h3>
                  <p className="text-sm text-muted-foreground">Update your account settings and language.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="language">Language</Label>
                  <Input id="language" defaultValue="English (US)" readOnly />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <Input id="timezone" defaultValue="Pacific Time (US & Canada)" readOnly />
                </div>
                <div className="pt-4 mt-4 border-t border-border">
                  <h4 className="text-sm font-medium text-red-500 mb-2">Delete Account</h4>
                  <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                  <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">Delete Account</Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ProtectedRoute>
  );
}
