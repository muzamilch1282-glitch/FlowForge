'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import { Menu, Settings, UserCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/shared';
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
        'group relative flex items-center gap-2.5 rounded-md px-2.5 py-1.5 text-[13px] font-medium transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-primary/50',
          isActive
            ? 'bg-secondary/60 text-foreground font-semibold'
            : 'text-muted-foreground hover:text-foreground hover:bg-secondary/40',
        collapsed && 'justify-center px-2 py-2'
      )}
    >
      <Icon className={cn('h-4 w-4 shrink-0', isActive && 'text-foreground')} />
      {!collapsed && (
        <span className="truncate">{item.title}</span>
      )}
      {!collapsed && item.badge && (
        <span className="ml-auto flex h-4 min-w-4 items-center justify-center rounded-full bg-primary/10 px-1 text-[9px] font-bold text-primary">
          {item.badge}
        </span>
      )}
      {collapsed && (
        <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md group-hover:block z-50 whitespace-nowrap">
          {item.title}
        </div>
      )}
    </Link>
  );
}

function NavGroupSection({ group, collapsed }: { group: NavGroup; collapsed: boolean }) {
  return (
    <div className="space-y-0.5 mt-4 first:mt-1">
      {!collapsed && group.label && (
        <div className="px-2.5 flex items-center h-6 mb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground/50 transition-colors hover:text-muted-foreground">
            {group.label}
          </span>
        </div>
      )}
      {collapsed && group.label && <div className="mx-auto my-3 h-px w-6 bg-border/50" />}
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
        'hidden lg:flex flex-col border-r border-border/40 bg-[#FBFBFC] dark:bg-card transition-all duration-200',
        sidebarCollapsed ? 'w-[64px]' : 'w-[240px]'
      )}
    >
      {/* Header */}
      <div className={cn(
        'flex h-12 items-center px-3 shrink-0',
        sidebarCollapsed ? 'justify-center' : 'justify-between'
      )}>
        {!sidebarCollapsed && <Logo collapsed={sidebarCollapsed} />}
        <button
          onClick={toggleSidebarCollapsed}
          className={cn(
            "flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground/50 hover:bg-secondary/60 hover:text-foreground transition-colors",
            sidebarCollapsed && "absolute top-2.5 z-50 bg-background shadow-sm border border-border"
          )}
        >
          <Menu className="h-4 w-4" />
        </button>
      </div>

      {/* Workspace Switcher */}
      <div className="px-2 pb-2">
        <WorkspaceSwitcher collapsed={sidebarCollapsed} />
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-2 scrollbar-hide">
        <div className="space-y-1">
          {sidebarNavigation.map((group, idx) => (
            <NavGroupSection key={group.label || idx.toString()} group={group} collapsed={sidebarCollapsed} />
          ))}
        </div>
      </nav>
      
      {/* Bottom Settings / Profile */}
      <div className="p-2 mt-auto space-y-0.5">
        <NavItemLink 
          item={{ title: 'Settings', href: '/dashboard/settings', icon: Settings }} 
          collapsed={sidebarCollapsed} 
        />
        
        {/* User Profile Block */}
        {!sidebarCollapsed ? (
          <Link href="/dashboard/settings" className="mt-2 flex items-center gap-2.5 rounded-md px-2 py-1.5 hover:bg-secondary/40 transition-colors">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-primary/10 text-[10px] font-bold text-primary">
              M
            </div>
            <div className="flex flex-col">
              <span className="text-[13px] font-medium leading-tight">Muhammad</span>
              <span className="text-[11px] text-muted-foreground leading-tight">Account & Profile</span>
            </div>
          </Link>
        ) : (
          <Link href="/dashboard/settings" className="mt-2 group relative flex justify-center items-center rounded-md p-1.5 hover:bg-secondary/40 transition-colors">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-primary/10 text-[9px] font-bold text-primary">
              M
            </div>
            <div className="absolute left-full ml-2 hidden rounded-md bg-popover px-2 py-1 text-xs font-medium text-popover-foreground shadow-md group-hover:block z-50 whitespace-nowrap">
              Account & Profile
            </div>
          </Link>
        )}
      </div>

    </aside>
  );
}
