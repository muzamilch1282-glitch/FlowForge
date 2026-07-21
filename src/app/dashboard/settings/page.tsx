import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Settings } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Settings',
};

const settingsSections = [
  {
    title: 'General',
    description: 'Manage your workspace name, URL, and basic configuration.',
  },
  {
    title: 'Notifications',
    description: 'Configure how and when you receive notifications.',
  },
  {
    title: 'Billing',
    description: 'Manage your subscription plan and payment methods.',
  },
  {
    title: 'Integrations',
    description: 'Connect third-party tools and services.',
  },
  {
    title: 'Security',
    description: 'Two-factor authentication and security preferences.',
  },
];

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Manage your application and account settings."
      />

      <div className="grid gap-4">
        {settingsSections.map((section) => (
          <div
            key={section.title}
            className="flex items-center justify-between rounded-xl border border-border bg-card p-5 hover:bg-accent/30 transition-colors cursor-pointer"
          >
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground">
                {section.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {section.description}
              </p>
            </div>
            <Settings className="h-4 w-4 text-muted-foreground shrink-0 ml-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
