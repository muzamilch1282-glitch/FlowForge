import { 
  FolderKanban, 
  CheckSquare, 
  Users, 
  TrendingUp, 
  Clock, 
  MessageSquare,
  FileText,
  Plus
} from 'lucide-react';

export interface StatItem {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down' | 'neutral';
  icon: any; // LucideIcon
  color: string;
}

export interface ProjectItem {
  id: string;
  name: string;
  description: string;
  progress: number;
  status: 'In Progress' | 'Review' | 'Completed' | 'Planning';
  priority: 'High' | 'Medium' | 'Low';
  dueDate: string;
  members: { name: string; avatarUrl: string }[];
}

export interface ActivityItem {
  id: string;
  user: string;
  avatarUrl: string;
  action: string;
  target: string;
  timestamp: string;
  type: 'comment' | 'task' | 'file' | 'project';
}

export interface QuickAction {
  id: string;
  label: string;
  icon: any;
  href: string;
  color: string;
}

export const mockStats: StatItem[] = [
  {
    id: '1',
    title: 'Active Projects',
    value: '12',
    change: '+2',
    trend: 'up',
    icon: FolderKanban,
    color: 'from-violet-500 to-indigo-600',
  },
  {
    id: '2',
    title: 'Total Tasks',
    value: '148',
    change: '+24',
    trend: 'up',
    icon: CheckSquare,
    color: 'from-blue-500 to-cyan-600',
  },
  {
    id: '3',
    title: 'Team Members',
    value: '8',
    change: '+1',
    trend: 'up',
    icon: Users,
    color: 'from-amber-500 to-orange-600',
  },
  {
    id: '4',
    title: 'Completion Rate',
    value: '87%',
    change: '+4%',
    trend: 'up',
    icon: TrendingUp,
    color: 'from-emerald-500 to-teal-600',
  },
  {
    id: '5',
    title: 'Overdue Tasks',
    value: '3',
    change: '-2',
    trend: 'down', // down is good for overdue!
    icon: Clock,
    color: 'from-rose-500 to-pink-600',
  },
];

export const mockProjects: ProjectItem[] = [
  {
    id: 'p1',
    name: 'Website Redesign',
    description: 'Overhauling the main corporate website with new branding.',
    progress: 75,
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-08-15',
    members: [
      { name: 'Alice', avatarUrl: '' },
      { name: 'Bob', avatarUrl: '' },
      { name: 'Charlie', avatarUrl: '' },
    ],
  },
  {
    id: 'p2',
    name: 'Mobile App V2',
    description: 'React Native migration for the mobile application.',
    progress: 30,
    status: 'In Progress',
    priority: 'High',
    dueDate: '2026-09-01',
    members: [
      { name: 'Dave', avatarUrl: '' },
      { name: 'Eve', avatarUrl: '' },
    ],
  },
  {
    id: 'p3',
    name: 'Q3 Marketing Campaign',
    description: 'Planning and assets for the upcoming Q3 product launch.',
    progress: 10,
    status: 'Planning',
    priority: 'Medium',
    dueDate: '2026-07-30',
    members: [
      { name: 'Frank', avatarUrl: '' },
    ],
  },
];

export const mockActivities: ActivityItem[] = [
  {
    id: 'a1',
    user: 'Alice Johnson',
    avatarUrl: '',
    action: 'completed task',
    target: 'Update navigation bar',
    timestamp: '10 minutes ago',
    type: 'task',
  },
  {
    id: 'a2',
    user: 'Bob Smith',
    avatarUrl: '',
    action: 'commented on',
    target: 'Mobile App V2 wireframes',
    timestamp: '1 hour ago',
    type: 'comment',
  },
  {
    id: 'a3',
    user: 'Charlie Brown',
    avatarUrl: '',
    action: 'uploaded file',
    target: 'Q3_Budget_Final.xlsx',
    timestamp: '3 hours ago',
    type: 'file',
  },
  {
    id: 'a4',
    user: 'Dave Wilson',
    avatarUrl: '',
    action: 'created project',
    target: 'Security Audit 2026',
    timestamp: 'Yesterday',
    type: 'project',
  },
];

export const mockQuickActions: QuickAction[] = [
  {
    id: 'qa1',
    label: 'Create Project',
    icon: FolderKanban,
    href: '/dashboard/projects/new',
    color: 'text-violet-500 bg-violet-500/10 border-violet-500/20',
  },
  {
    id: 'qa2',
    label: 'Add Task',
    icon: Plus,
    href: '/dashboard/tasks/new',
    color: 'text-blue-500 bg-blue-500/10 border-blue-500/20',
  },
  {
    id: 'qa3',
    label: 'Invite Member',
    icon: Users,
    href: '/dashboard/team/invite',
    color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20',
  },
  {
    id: 'qa4',
    label: 'Workspace Settings',
    icon: TrendingUp,
    href: '/dashboard/settings',
    color: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
  },
];
