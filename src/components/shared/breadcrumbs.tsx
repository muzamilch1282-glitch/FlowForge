'use client';

import * as React from 'react';
import { usePathname } from 'next/navigation';

function getBreadcrumbData(pathname: string): { title: string; description: string } {
  const segments = pathname.split('/').filter(Boolean);
  const last = segments[segments.length - 1] || 'dashboard';
  const parent = segments.length > 1 ? segments[segments.length - 2] : null;

  if (parent === 'projects') {
    return { title: 'Project Details', description: 'Manage your project tasks and settings.' };
  }
  if (parent === 'tasks') {
    return { title: 'Task Details', description: 'View and edit task information.' };
  }

  const formatted = last
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  const descriptions: Record<string, string> = {
    dashboard: 'Overview of your workspace activity and metrics.',
    projects: 'Manage and track your projects.',
    tasks: 'View and organize your tasks.',
    workspace: 'Configure your workspace settings.',
    analytics: 'Insights and performance metrics.',
    team: 'Manage your team members.',
    settings: 'Application and account settings.',
    profile: 'Your profile and preferences.',
  };

  return {
    title: formatted,
    description: descriptions[last] || `Manage your ${formatted.toLowerCase()}.`,
  };
}

export function Breadcrumbs() {
  const pathname = usePathname();
  const { title } = getBreadcrumbData(pathname);

  return (
    <div className="hidden sm:flex items-center text-sm font-medium text-muted-foreground">
      <span>{title}</span>
    </div>
  );
}
