import {
  LayoutDashboard,
  FolderKanban,
  CheckSquare,
  Building2,
  BarChart3,
  Users,
  Settings,
  UserCircle,
  Bell,
  History,
  CalendarDays,
  type LucideIcon,
} from 'lucide-react';

export interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  badge?: string;
  disabled?: boolean;
}

export interface NavGroup {
  label: string;
  items: NavItem[];
}

export const sidebarNavigation: NavGroup[] = [
  {
    label: 'Overview',
    items: [
      {
        title: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
      },
    ],
  },
  {
    label: 'Manage',
    items: [
      {
        title: 'Projects',
        href: '/dashboard/projects',
        icon: FolderKanban,
      },
      {
        title: 'Tasks',
        href: '/dashboard/tasks',
        icon: CheckSquare,
      },
      {
        title: 'Workspaces',
        href: '/dashboard/workspaces',
        icon: Building2,
      },
      {
        title: 'Calendar',
        href: '/dashboard/calendar',
        icon: CalendarDays,
      },
      {
        title: 'Timeline',
        href: '/dashboard/timeline',
        icon: FolderKanban,
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      {
        title: 'Analytics',
        href: '/dashboard/analytics',
        icon: BarChart3,
      },
      {
        title: 'Activity',
        href: '/dashboard/activity',
        icon: History,
      },
    ],
  },
  {
    label: 'Team',
    items: [
      {
        title: 'Members',
        href: '/dashboard/team',
        icon: Users,
      },
    ],
  },
  {
    label: 'Account',
    items: [
      {
        title: 'Settings',
        href: '/dashboard/settings',
        icon: Settings,
      },
      {
        title: 'Profile',
        href: '/dashboard/profile',
        icon: UserCircle,
      },
    ],
  },
];

export const userMenuItems = [
  { title: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  { title: 'Notifications', href: '/dashboard/notifications', icon: Bell },
];
