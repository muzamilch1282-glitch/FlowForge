'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { PanelLeftClose, PanelLeft, LogOut, ChevronsUpDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo, UserProfileDropdown } from '@/components/shared';
import { sidebarNavigation, type NavGroup, type NavItem } from '@/constants/navigation';
import { useAppStore } from '@/store/app-store';
import { WorkspaceSwitcher } from './workspace-switcher';

function NavItemLink({ item, collapsed }: { item: NavItem; collapsed: boolean }) {
  const pathname = usePathname();
  const isActive = pathname === item.href;
  const Icon = item.icon;

  return (
    <Link
      href={item.href}
      className={cn(
        'group relative flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-200',
        'hover:bg-accent/50',
        isActive
          ? 'bg-violet-500/10 text-violet-700 dark:text-violet-400'
          : 'text-muted-foreground hover:text-foreground',
        collapsed && 'justify-center px-2'
      )}
    >
      {isActive && (
        <motion.div
          layoutId="sidebar-active-indicator"
          className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-violet-600 dark:bg-violet-400"
          transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
        />
      )}
      <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-violet-600 dark:text-violet-400')} />
      {!collapsed && (
        <span className="truncate">{item.title}</span>
      )}
      {!collapsed && item.badge && (
        <span className="ml-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-violet-600 px-1.5 text-[10px] font-bold text-white">
          {item.badge}
        </span>
      )}
      {collapsed && (
        <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md group-hover:block z-50">
          {item.title}
        </div>
      )}
    </Link>
  );
}

function NavGroupSection({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  return (
    <div className="space-y-1">
      {!collapsed && (
        <p className="px-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground/70 mb-1">
          {group.label}
        </p>
      )}
      {collapsed && <div className="mx-auto my-2 h-px w-6 bg-border" />}
      {group.items.map((item) => (
        <NavItemLink key={item.href} item={item} collapsed={collapsed} />
      ))}
    </div>
  );
}

export function Sidebar() {
  const { sidebarCollapsed, toggleSidebarCollapsed } = useAppStore();

  return (
    <aside
      className={cn(
        'hidden lg:flex flex-col border-r border-border bg-card/50 backdrop-blur-xl transition-all duration-300',
        sidebarCollapsed ? 'w-[68px]' : 'w-64'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex h-16 items-center border-b border-border px-4',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        <Logo collapsed={sidebarCollapsed} />
        {!sidebarCollapsed && (
          <button
            onClick={toggleSidebarCollapsed}
            className="flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-foreground transition-colors"
          >
            <PanelLeftClose className="h-4 w-4" />
          </button>
        )}
        {sidebarCollapsed && (
          <button
            onClick={toggleSidebarCollapsed}
            className="absolute -right-3 top-6 z-50 flex h-6 w-6 items-center justify-center rounded-full border border-border bg-background shadow-sm hover:bg-accent transition-colors"
          >
            <PanelLeft className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Workspace Switcher */}
      <div className="p-3 border-b border-border">
        <WorkspaceSwitcher collapsed={sidebarCollapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6">
        {sidebarNavigation.map((group) => (
          <NavGroupSection key={group.label} group={group} collapsed={sidebarCollapsed} />
        ))}
      </nav>

    </aside>
  );
}
