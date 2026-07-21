import type { Metadata } from 'next';
import { PageHeader } from '@/components/shared/page-header';
import { Camera, Mail, User } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Profile',
};

export default function ProfilePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Profile"
        description="Manage your personal information and preferences."
      />

      <div className="rounded-xl border border-border bg-card p-6">
        {/* Avatar Section */}
        <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6 pb-6 border-b border-border">
          <div className="relative group">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-indigo-600 text-2xl font-bold text-white">
              FF
            </div>
            <button className="absolute inset-0 flex items-center justify-center rounded-full bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
              <Camera className="h-5 w-5 text-white" />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-semibold text-foreground">
              FlowForge User
            </h2>
            <p className="text-sm text-muted-foreground">user@flowforge.io</p>
            <p className="mt-1 text-xs text-muted-foreground">
              Member since January 2024
            </p>
          </div>
        </div>

        {/* Profile Fields */}
        <div className="pt-6 space-y-4">
          {[
            { label: 'Full Name', value: 'FlowForge User', icon: User },
            { label: 'Email', value: 'user@flowforge.io', icon: Mail },
          ].map((field) => {
            const Icon = field.icon;
            return (
              <div key={field.label} className="flex items-center gap-3 rounded-lg border border-border px-4 py-3">
                <Icon className="h-4 w-4 text-muted-foreground shrink-0" />
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">{field.label}</p>
                  <p className="text-sm font-medium text-foreground">{field.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
