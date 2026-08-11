'use client';

import * as React from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useTasks } from '@/hooks/useTasks';
import { useProjects } from '@/hooks/useProjects';
import { useAllTeamMembers } from '@/hooks/useAllTeamMembers';
import { useDebounce } from '@/hooks/use-debounce';
import { PageHeader, Button } from '@/components/shared';
import { Search, SlidersHorizontal, X } from 'lucide-react';
import { TaskGrid } from '@/components/task/task-grid';
import { ProjectCard } from '@/components/project/project-card';
import { isPast, isToday, parseISO } from 'date-fns';
import { TaskSortDropdown, TaskSortOption } from '@/components/task/task-sort-dropdown';

type EntityType = 'all' | 'projects' | 'tasks' | 'members';

interface AdvancedFilters {
  type: EntityType;
  status: string;
  priority: string;
  assignee: string;
  timing: string;
}

function GlobalSearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const { tasks, isLoading: tasksLoading } = useTasks();
  const { projects, isLoading: projectsLoading } = useProjects();
  const { members, isLoading: membersLoading } = useAllTeamMembers();

  const [query, setQuery] = React.useState(initialQuery);
  const debouncedQuery = useDebounce(query, 300);

  const [sortBy, setSortBy] = React.useState<TaskSortOption>('newest');
  const [filters, setFilters] = React.useState<AdvancedFilters>({
    type: 'all',
    status: 'all',
    priority: 'all',
    assignee: 'all',
    timing: 'all',
  });
  
  const [showFilters, setShowFilters] = React.useState(false);

  // Sync URL query to state on mount if it changes
  React.useEffect(() => {
    if (initialQuery && initialQuery !== query) {
      setQuery(initialQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialQuery]);

  const handleFilterChange = (key: keyof AdvancedFilters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: 'all',
      status: 'all',
      priority: 'all',
      assignee: 'all',
      timing: 'all',
    });
    setSortBy('newest');
  };

  const filteredData = React.useMemo(() => {
    let fTasks = [...tasks];
    let fProjects = [...projects];
    let fMembers = [...members];
    const q = debouncedQuery.toLowerCase();

    // 1. Text Search
    if (q) {
      fTasks = fTasks.filter(t => 
        t.title.toLowerCase().includes(q) || 
        (t.description && t.description.toLowerCase().includes(q))
      );
      fProjects = fProjects.filter(p => 
        p.title.toLowerCase().includes(q) || 
        (p.description && p.description.toLowerCase().includes(q))
      );
      fMembers = fMembers.filter(m => 
        m.profile?.full_name?.toLowerCase().includes(q) || 
        m.role.toLowerCase().includes(q) ||
        m.profile?.email?.toLowerCase().includes(q)
      );
    }

    // 2. Type Filter
    if (filters.type !== 'all') {
      if (filters.type !== 'tasks') fTasks = [];
      if (filters.type !== 'projects') fProjects = [];
      if (filters.type !== 'members') fMembers = [];
    }

    // 3. Status Filter
    if (filters.status !== 'all') {
      fTasks = fTasks.filter(t => t.status === filters.status);
      fProjects = fProjects.filter(p => p.status === filters.status);
    }

    // 4. Priority Filter
    if (filters.priority !== 'all') {
      fTasks = fTasks.filter(t => t.priority === filters.priority);
    }

    // 5. Assignee Filter
    if (filters.assignee !== 'all') {
      if (filters.assignee === 'unassigned') {
        fTasks = fTasks.filter(t => !t.assigned_to);
      } else {
        fTasks = fTasks.filter(t => t.assigned_to === filters.assignee);
      }
    }

    // 6. Timing Filter (Tasks only)
    if (filters.timing !== 'all') {
      fTasks = fTasks.filter(t => {
        if (!t.due_date) return false;
        const date = parseISO(t.due_date);
        if (filters.timing === 'overdue') return isPast(date) && !isToday(date) && t.status !== 'completed';
        if (filters.timing === 'today') return isToday(date) && t.status !== 'completed';
        return true;
      });
    }

    // 7. Sorting (Tasks)
    fTasks.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'alphabetical': return a.title.localeCompare(b.title);
        case 'priority': {
          const pOrder = { high: 3, medium: 2, low: 1 };
          return pOrder[b.priority] - pOrder[a.priority];
        }
        case 'status': {
          const sOrder = { 'todo': 1, 'in-progress': 2, 'review': 3, 'completed': 4 };
          return sOrder[a.status] - sOrder[b.status];
        }
        case 'due_date':
          if (!a.due_date) return 1;
          if (!b.due_date) return -1;
          return new Date(a.due_date).getTime() - new Date(b.due_date).getTime();
        default: return 0;
      }
    });

    // 8. Sorting (Projects)
    fProjects.sort((a, b) => {
      switch (sortBy) {
        case 'newest': return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
        case 'oldest': return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
        case 'alphabetical': return a.title.localeCompare(b.title);
        default: return 0;
      }
    });

    return { fTasks, fProjects, fMembers };
  }, [tasks, projects, members, debouncedQuery, filters, sortBy]);

  const isLoading = tasksLoading || projectsLoading || membersLoading;
  
  // Deduplicate users for assignee filter
  const uniqueUsers = React.useMemo(() => {
    const map = new Map();
    members.forEach(m => {
      if (m.profile && !map.has(m.profile.id)) {
        map.set(m.profile.id, m.profile);
      }
    });
    return Array.from(map.values());
  }, [members]);

  const totalResults = filteredData.fTasks.length + filteredData.fProjects.length + filteredData.fMembers.length;

  return (
    <div className="space-y-6 max-w-6xl mx-auto h-full flex flex-col">
      <div className="flex flex-col gap-4">
        <PageHeader 
          title="Global Search" 
          description="Find tasks, projects, and colleagues across all your workspaces."
        />
        
        {/* Search Bar */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
            <input 
              type="text"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                const newQuery = e.target.value;
                if (newQuery) {
                  router.replace(`/dashboard/search?q=${encodeURIComponent(newQuery)}`, { scroll: false });
                } else {
                  router.replace(`/dashboard/search`, { scroll: false });
                }
              }}
              placeholder="Type to search globally..."
              className="w-full h-12 pl-10 pr-4 rounded-xl border border-input bg-background text-lg shadow-sm focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all"
            />
            {query && (
              <button 
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-full hover:bg-secondary transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <Button 
            variant={showFilters ? "secondary" : "outline"} 
            className="h-12 px-4 gap-2 rounded-xl"
            onClick={() => setShowFilters(!showFilters)}
          >
            <SlidersHorizontal className="h-5 w-5" />
            <span className="hidden sm:inline">Filters</span>
          </Button>
        </div>
        
        {/* Advanced Filters Panel */}
        {showFilters && (
          <div className="bg-card border border-border p-4 rounded-xl shadow-sm animate-in fade-in slide-in-from-top-4 space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Entity Type</label>
                <select className="w-full text-sm border-input bg-background rounded-md h-9 px-3" value={filters.type} onChange={e => handleFilterChange('type', e.target.value)}>
                  <option value="all">All</option>
                  <option value="projects">Projects Only</option>
                  <option value="tasks">Tasks Only</option>
                  <option value="members">Members Only</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Status (Tasks/Projects)</label>
                <select className="w-full text-sm border-input bg-background rounded-md h-9 px-3" value={filters.status} onChange={e => handleFilterChange('status', e.target.value)}>
                  <option value="all">Any Status</option>
                  <option value="todo">To Do / Planning</option>
                  <option value="in-progress">In Progress / Active</option>
                  <option value="review">Review</option>
                  <option value="completed">Completed</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Priority (Tasks)</label>
                <select className="w-full text-sm border-input bg-background rounded-md h-9 px-3" value={filters.priority} onChange={e => handleFilterChange('priority', e.target.value)}>
                  <option value="all">Any Priority</option>
                  <option value="high">High</option>
                  <option value="medium">Medium</option>
                  <option value="low">Low</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Assignee (Tasks)</label>
                <select className="w-full text-sm border-input bg-background rounded-md h-9 px-3" value={filters.assignee} onChange={e => handleFilterChange('assignee', e.target.value)}>
                  <option value="all">Anyone</option>
                  <option value="unassigned">Unassigned</option>
                  {uniqueUsers.map((u: any) => (
                    <option key={u.id} value={u.id}>{u.full_name || u.email}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Timing (Tasks)</label>
                <select className="w-full text-sm border-input bg-background rounded-md h-9 px-3" value={filters.timing} onChange={e => handleFilterChange('timing', e.target.value)}>
                  <option value="all">Any Time</option>
                  <option value="today">Due Today</option>
                  <option value="overdue">Overdue</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">Sort By</label>
                <TaskSortDropdown value={sortBy} onChange={setSortBy} />
              </div>
            </div>
            
            <div className="flex justify-end pt-2">
              <Button variant="ghost" size="sm" onClick={clearFilters}>Reset Filters</Button>
            </div>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-auto py-4">
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          </div>
        ) : totalResults === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="h-16 w-16 bg-secondary/50 rounded-full flex items-center justify-center mb-4 text-muted-foreground">
              <Search className="h-8 w-8 opacity-50" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No results found</h3>
            <p className="text-sm text-muted-foreground mt-1 max-w-md">
              We couldn't find any projects, tasks, or members matching your search and filter criteria.
            </p>
            <Button variant="outline" className="mt-6" onClick={clearFilters}>
              Clear Filters
            </Button>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="flex items-center justify-between border-b border-border pb-2">
              <p className="text-sm font-medium text-muted-foreground">
                Found {totalResults} result{totalResults !== 1 ? 's' : ''}
              </p>
            </div>

            {filteredData.fProjects.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Projects ({filteredData.fProjects.length})</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {filteredData.fProjects.map(project => (
                    <ProjectCard key={project.id} project={project} />
                  ))}
                </div>
              </section>
            )}

            {filteredData.fTasks.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Tasks ({filteredData.fTasks.length})</h2>
                <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden p-1">
                  <TaskGrid 
                    tasks={filteredData.fTasks} 
                    projects={projects} 
                    isLoading={false} 
                    hasProjects={true} 
                    onEdit={() => {}} 
                    onDelete={() => {}} 
                    onCreateNew={() => {}}
                  />
                </div>
              </section>
            )}

            {filteredData.fMembers.length > 0 && (
              <section className="space-y-4">
                <h2 className="text-xl font-semibold tracking-tight">Members ({filteredData.fMembers.length})</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {filteredData.fMembers.map(member => (
                    <div key={member.id} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card shadow-sm hover:border-primary/50 transition-colors">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary shrink-0">
                        {member.profile?.full_name?.charAt(0) || member.profile?.email.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm truncate">{member.profile?.full_name || 'Anonymous'}</p>
                        <p className="text-xs text-muted-foreground truncate">{member.profile?.email}</p>
                        <span className="inline-flex mt-1 items-center rounded-full bg-secondary px-2 py-0.5 text-[10px] font-medium capitalize">
                          {member.role}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default function GlobalSearchPage() {
  return (
    <React.Suspense fallback={<div className="flex h-full items-center justify-center"><div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" /></div>}>
      <GlobalSearchContent />
    </React.Suspense>
  );
}
