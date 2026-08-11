'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  UserCircle,
  Shield,
  Bell,
  Palette,
  Lock,
  Zap,
  Sparkles,
  Building2,
  Users,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PageHeader } from '@/components/shared/page-header';
import { usePermissions } from '@/hooks/usePermissions';
import { PermissionGuard } from '@/components/auth/PermissionGuard';
import { PERMISSIONS } from '@/lib/permissions';

// Settings section components
import { ProfileSettings } from '@/components/settings/profile-settings';
import { AccountSettings } from '@/components/settings/account-settings';
import { WorkspaceSettings } from '@/components/settings/workspace-settings';
import { MembersSettings } from '@/components/settings/members-settings';
import { NotificationSettings } from '@/components/settings/notification-settings';
import { AppearanceSettings } from '@/components/settings/appearance-settings';
import { SecuritySettings } from '@/components/settings/security-settings';
import { AutomationSettings } from '@/components/settings/automation-settings';
import { AISettings } from '@/components/settings/ai-settings';

// ─── Section Configuration ──────────────────────────────────

interface SettingsSection {
  id: string;
  label: string;
  icon: LucideIcon;
  description: string;
  requiresPermission?: string;
  category: 'personal' | 'workspace';
}

const SETTINGS_SECTIONS: SettingsSection[] = [
  // Personal settings — accessible to all authenticated users
  {
    id: 'profile',
    label: 'Profile',
    icon: UserCircle,
    description: 'Manage your personal information',
    category: 'personal',
  },
  {
    id: 'account',
    label: 'Account',
    icon: Shield,
    description: 'Account details and sign out',
    category: 'personal',
  },
  {
    id: 'appearance',
    label: 'Appearance',
    icon: Palette,
    description: 'Theme and display preferences',
    category: 'personal',
  },
  {
    id: 'notifications',
    label: 'Notifications',
    icon: Bell,
    description: 'Manage notification preferences',
    category: 'personal',
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    description: 'Password and authentication',
    category: 'personal',
  },
  {
    id: 'ai',
    label: 'AI Settings',
    icon: Sparkles,
    description: 'Configure AI assistant preferences',
    category: 'personal',
  },
  // Workspace settings — admin/owner only for editing, viewable by members
  {
    id: 'workspace',
    label: 'Workspace',
    icon: Building2,
    description: 'Workspace configuration',
    category: 'workspace',
  },
  {
    id: 'members',
    label: 'Members & Roles',
    icon: Users,
    description: 'Manage team members',
    category: 'workspace',
  },
  {
    id: 'automations',
    label: 'Automations',
    icon: Zap,
    description: 'Workflow automation rules',
    category: 'workspace',
  },
];

// ─── Section Content Renderer ────────────────────────────────

function SettingsContent({ sectionId }: { sectionId: string }) {
  switch (sectionId) {
    case 'profile':
      return <ProfileSettings />;
    case 'account':
      return <AccountSettings />;
    case 'workspace':
      return <WorkspaceSettings />;
    case 'members':
      return <MembersSettings />;
    case 'notifications':
      return <NotificationSettings />;
    case 'appearance':
      return <AppearanceSettings />;
    case 'security':
      return <SecuritySettings />;
    case 'automations':
      return <AutomationSettings />;
    case 'ai':
      return <AISettings />;
    default:
      return <ProfileSettings />;
  }
}

// ─── Main Settings Page ──────────────────────────────────────

export default function SettingsPage() {
  const [activeSection, setActiveSection] = React.useState('profile');
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(true);
  const { hasPermission } = usePermissions();

  const personalSections = SETTINGS_SECTIONS.filter((s) => s.category === 'personal');
  const workspaceSections = SETTINGS_SECTIONS.filter((s) => s.category === 'workspace');

  const activeConfig = SETTINGS_SECTIONS.find((s) => s.id === activeSection);

  const handleSectionClick = (sectionId: string) => {
    setActiveSection(sectionId);
    setMobileMenuOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <PageHeader
        title="Settings"
        description="Manage your account, workspace, and application preferences."
      />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ─── Sidebar Navigation ─────────────────────────── */}
        <div className="w-full lg:w-64 shrink-0">
          {/* Mobile toggle */}
          <button
            className="flex lg:hidden w-full items-center justify-between rounded-xl border border-border bg-card px-4 py-3 text-sm font-medium mb-4"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <span className="flex items-center gap-2">
              {activeConfig && <activeConfig.icon className="h-4 w-4 text-primary" />}
              {activeConfig?.label || 'Settings'}
            </span>
            <svg
              className={cn('h-4 w-4 transition-transform', mobileMenuOpen && 'rotate-180')}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <nav
            className={cn(
              'space-y-6 lg:block',
              mobileMenuOpen ? 'block' : 'hidden'
            )}
          >
            {/* Personal Settings */}
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
                Personal
              </p>
              {personalSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="settings-active-indicator"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />
                    <span className="truncate">{section.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Workspace Settings */}
            <div className="space-y-1">
              <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-2">
                Workspace
              </p>
              {workspaceSections.map((section) => {
                const Icon = section.icon;
                const isActive = activeSection === section.id;
                return (
                  <button
                    key={section.id}
                    onClick={() => handleSectionClick(section.id)}
                    className={cn(
                      'group relative flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200',
                      isActive
                        ? 'bg-primary/10 text-primary'
                        : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground'
                    )}
                  >
                    {isActive && (
                      <motion.div
                        layoutId="settings-active-indicator"
                        className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-primary"
                        transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
                      />
                    )}
                    <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-primary')} />
                    <span className="truncate">{section.label}</span>
                  </button>
                );
              })}
            </div>
          </nav>
        </div>

        {/* ─── Settings Content ────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeSection}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2, ease: 'easeInOut' }}
            >
              <SettingsContent sectionId={activeSection} />
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
