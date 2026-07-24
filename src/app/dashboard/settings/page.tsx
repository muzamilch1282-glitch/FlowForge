'use client';

import { PageHeader } from '@/components/shared/page-header';
import { useState } from 'react';
import { Button } from '@/components/shared/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/shared/badge';
import { ThemeToggle } from '@/components/shared/theme-toggle';

const SECTIONS = ['General', 'Appearance', 'Notifications', 'Security', 'Account'] as const;
type Section = typeof SECTIONS[number];

export default function SettingsPage() {
  const [activeSection, setActiveSection] = useState<Section>('General');

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application and account settings."
      />

      <div className="flex flex-col md:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="w-full md:w-64 space-y-1">
          {SECTIONS.map((section) => (
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
              <Button>Save General Settings</Button>
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
                <h4 className="text-sm font-medium text-red-500 mb-2">Danger Zone</h4>
                <p className="text-sm text-muted-foreground mb-4">Once you delete your account, there is no going back. Please be certain.</p>
                <Button variant="destructive" className="bg-red-500 hover:bg-red-600 text-white">Delete Account</Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
