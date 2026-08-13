import {
  Home,
  Inbox,
  CheckSquare,
  FolderKanban,
  Building2,
  BarChart3,
  Users,
  Settings,
  UserCircle,
  Bell,
  History,
  CalendarDays,
  Zap,
  Clock,
  Sparkles,
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
  label: string | null;
  items: NavItem[];
}

export const sidebarNavigation: NavGroup[] = [
  {
    label: null, // Top level items without group label
    items: [
      { title: 'Home', href: '/dashboard', icon: Home },
      { title: 'Inbox', href: '/dashboard/notifications', icon: Inbox },
      { title: 'My Tasks', href: '/dashboard/tasks', icon: CheckSquare },
    ],
  },
  {
    label: 'Workspace',
    items: [
      { title: 'Projects', href: '/dashboard/projects', icon: FolderKanban },
      { title: 'Team', href: '/dashboard/team', icon: Users },
      { title: 'Calendar', href: '/dashboard/calendar', icon: CalendarDays },
    ],
  }
];

export const userMenuItems = [
  { title: 'Profile', href: '/dashboard/profile', icon: UserCircle },
  { title: 'Settings', href: '/dashboard/settings', icon: Settings },
  { title: 'Notifications', href: '/dashboard/notifications', icon: Bell },
];
