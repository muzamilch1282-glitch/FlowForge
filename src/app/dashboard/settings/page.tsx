'use client';

import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Settings,
  UserCircle,
  Building2,
  Users,
  Bell,
  Palette,
  Shield,
  Blocks,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';

// Settings section components
import { ProfileSettings } from '@/components/settings/profile-settings';
import { NotificationSettings } from '@/components/settings/notification-settings';
import { AppearanceSettings } from '@/components/settings/appearance-settings';
import { SecuritySettings } from '@/components/settings/security-settings';
import { AccountSettings } from '@/components/settings/account-settings';

// ─── Section Configuration ──────────────────────────────────

interface SettingsSection {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  { id: 'profile', label: 'Profile', icon: UserCircle, description: 'Manage your personal information' },
  { id: 'account', label: 'Account', icon: Shield, description: 'Account details and session management' },
  { id: 'workspace', label: 'Workspace', icon: Building2, description: 'Workspace configuration' },
  { id: 'team', label: 'Team', icon: Users, description: 'Manage team members' },
  { id: 'notifications', label: 'Notifications', icon: Bell, description: 'Manage notification preferences' },
  { id: 'appearance', label: 'Appearance', icon: Palette, description: 'Theme and display preferences' },
  { id: 'security', label: 'Security', icon: Shield, description: 'Password and authentication' },
];

// ─── Section Content Renderer ────────────────────────────────

function SettingsContent({ sectionId }: { sectionId: string }) {
  switch (sectionId) {
    case 'profile': return <ProfileSettings />;
    case 'account': return <AccountSettings />;
    case 'notifications': return <NotificationSettings />;
    case 'appearance': return <AppearanceSettings />;
    case 'security': return <SecuritySettings />;
    case 'team': 
      return (
        <div className="flex flex-col items-start space-y-4">
          <p className="text-sm text-muted-foreground">Team management is handled in the dedicated Team section.</p>
          <a href="/dashboard/team" className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90">
            Go to Team Management
          </a>
        </div>
      );
    default:
      return (
        <div className="flex h-64 flex-col items-center justify-center rounded-xl border border-dashed border-border/60 bg-card/30">
          <h3 className="text-lg font-medium text-foreground capitalize">{sectionId} Settings</h3>
          <p className="text-sm text-muted-foreground mt-1">This section is currently under construction.</p>
        </div>
      );
  }
}

// ─── Main Settings Page ──────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const activeConfig = SETTINGS_SECTIONS.find((s) => s.id === activeSection);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12 animate-in fade-in duration-500">
      <PageHeader
        title="Settings"
        description="Manage your account and application preferences."
      />

      <div className="flex flex-col md:flex-row gap-8">
        
        {/* ─── Sidebar Navigation ─────────────────────────── */}
        <div className="w-full md:w-64 shrink-0">
          {/* Mobile toggle */}
          <button
            className="flex md:hidden w-full items-center justify-between rounded-xl border border-border/60 bg-card px-4 py-3 text-sm font-medium mb-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="flex items-center gap-2">
              {activeConfig && <activeConfig.icon className="h-4 w-4 text-primary" />}
              {activeConfig?.label || 'Settings'}
            </span>
            <svg
              className={cn('h-4 w-4 transition-transform text-muted-foreground', mobileMenuOpen && 'rotate-180')}
              fill="none" viewBox="0 0 24 24" stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <nav className={cn('space-y-1', mobileMenuOpen ? 'block' : 'hidden md:block')}>
            {SETTINGS_SECTIONS.map((section) => {
              const Icon = section.icon;
              const isActive = activeSection === section.id;
              return (
                <button
                  key={section.id}
                  onClick={() => handleSectionClick(section.id)}
                  className={cn(
                    'group relative flex w-full items-center gap-3 rounded-lg px-4 py-3 text-sm font-medium transition-all duration-200',
                    isActive
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:bg-secondary/60 hover:text-foreground'
                  )}
                >
                  {isActive && (
                    <motion.div
                      layoutId="settings-active-indicator"
                      className="absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-primary"
                      transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                    />
                  )}
                  <Icon className={cn('h-4 w-4 shrink-0', isActive ? 'text-primary' : 'text-muted-foreground group-hover:text-foreground')} />
                  <span className="truncate">{section.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* ─── Settings Content ────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-foreground tracking-tight">{activeConfig?.label}</h2>
                <p className="text-sm text-muted-foreground mt-1">{activeConfig?.description}</p>
              </div>
              <SettingsContent sectionId={activeSection} />
            </motion.div>
          </AnimatePresence>
        </div>
        
      </div>
    </div>
  );
}
