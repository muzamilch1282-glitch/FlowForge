'use client';

import * as React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetClose } from '@/components/ui/sheet';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Task } from '@/types/task';
import { Project } from '@/types/project';
import { format, parseISO, formatDistanceToNow } from 'date-fns';
import { 
  X, MoreHorizontal, CheckSquare, Clock, User2, Play, Pause, Square, 
  Paperclip, MessageSquare, History, AlignLeft, Calendar, Link2, 
  ArrowRight, ShieldAlert, CheckCircle2, Circle, AlertCircle, Plus, FileIcon
} from 'lucide-react';
import { PriorityBadge } from './priority-badge';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useComments } from '@/hooks/useComments';
import { useAttachments } from '@/hooks/useAttachments';
import { useAuth } from '@/hooks/useAuth';

import { useTasks } from '@/hooks/useTasks';
import { useTeam } from '@/hooks/useTeam';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface TaskDetailDrawerProps {
  task: Task | null;
  project?: Project;
  isOpen: boolean;
  onClose: () => void;
}

export function TaskDetailDrawer({ task, project, isOpen, onClose }: TaskDetailDrawerProps) {
  const [activeTab, setActiveTab] = React.useState<'comments' | 'activity'>('comments');
  const { user } = useAuth();
  
  // Use tasks hook for updating
  const { updateTask } = useTasks(project?.id || '');
  const { members } = useTeam(project?.workspace_id);

  const handleUpdate = (updates: Partial<Task>) => {
    if (!task) return;
    updateTask({ id: task.id, data: updates });
  };
  
  // State for comments and attachments
  const [commentText, setCommentText] = React.useState('');
  const { comments, createComment, isCreating } = useComments(task?.id || '');
  const { attachments, uploadFile, isUploading } = useAttachments(task?.id || '');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // State for description editing
  const [descValue, setDescValue] = React.useState(task?.description || '');
  const [isEditingDesc, setIsEditingDesc] = React.useState(false);

  React.useEffect(() => {
    setDescValue(task?.description || '');
    setIsEditingDesc(false);
  }, [task?.id, task?.description]);

  const feedItems = React.useMemo(() => {
    const items = [
      ...comments.map(c => ({ type: 'comment' as const, data: c, date: new Date(c.created_at) })),
      ...attachments.map(a => ({ type: 'attachment' as const, data: a, date: new Date(a.created_at) }))
    ];
    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [comments, attachments]);

  const handleSendComment = () => {
    if (!commentText.trim() || !task) return;
    
    createComment({ comment: commentText }, {
      onSuccess: () => setCommentText('')
    });
  };

  const handleAttachFile = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && task) {
      toast.info('Uploading file...');
      try {
        await uploadFile(file);
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (!task) return null;

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full sm:max-w-2xl p-0 gap-0 flex flex-col bg-background shadow-2xl border-l border-border/40 sm:rounded-l-2xl overflow-hidden">
        
        {/* Header Actions */}
        <div className="flex items-center justify-between px-6 py-3 border-b border-border/40 bg-background sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs font-medium text-muted-foreground">
            {project ? (
              <div className="flex items-center gap-1.5 hover:text-foreground cursor-pointer transition-colors">
                <CheckSquare className="h-3.5 w-3.5" />
                <span>{project.title}</span>
              </div>
            ) : (
              <span className="flex items-center gap-1.5"><CheckSquare className="h-3.5 w-3.5" /> Inbox</span>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
            <SheetClose asChild>
              <Button variant="ghost" size="icon" className="h-7 w-7 rounded-md text-muted-foreground hover:text-foreground hover:bg-secondary/50">
                <X className="h-4 w-4" />
              </Button>
            </SheetClose>
          </div>
        </div>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto px-8 py-10 scrollbar-hide">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Title Section */}
            <div>
              <input 
                type="text" 
                defaultValue={task.title}
                onBlur={(e) => {
                  if (e.target.value !== task.title) {
                    handleUpdate({ title: e.target.value });
                  }
                }}
                className="w-full text-3xl font-bold bg-transparent border-none outline-none placeholder:text-muted-foreground/40 text-foreground resize-none focus:ring-0 p-0"
                placeholder="Task title"
              />
            </div>

            {/* Properties Panel (Notion Style) */}
            <div className="flex flex-col gap-3 py-2 border-y border-border/40">
              
              <PropertyRow icon={<Circle className="h-4 w-4" />} label="Status">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <Badge variant="outline" className={cn(
                      "font-medium text-xs h-6 px-2.5 border-transparent bg-secondary/50 cursor-pointer hover:bg-secondary transition-colors",
                      task.status === 'completed' && "bg-emerald-500/10 text-emerald-600",
                      task.status === 'in-progress' && "bg-blue-500/10 text-blue-600",
                    )}>
                      {task.status.replace('-', ' ')}
                    </Badge>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[160px]">
                    {['backlog', 'todo', 'in-progress', 'review', 'completed'].map(status => (
                      <DropdownMenuItem 
                        key={status}
                        onClick={() => handleUpdate({ status: status as any })}
                        className="text-xs capitalize"
                      >
                        {status.replace('-', ' ')}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </PropertyRow>

              <PropertyRow icon={<User2 className="h-4 w-4" />} label="Assignee">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    {task.assigned_to ? (
                      <div className="flex items-center gap-2 px-1.5 py-0.5 rounded-md hover:bg-secondary/50 cursor-pointer transition-colors -ml-1.5">
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-primary/10 text-primary text-[9px]">
                            {members.find(m => m.user_id === task.assigned_to)?.profile?.full_name?.substring(0, 2).toUpperCase() || 'UN'}
                          </AvatarFallback>
                        </Avatar>
                        <span className="text-sm font-medium">
                          {members.find(m => m.user_id === task.assigned_to)?.profile?.full_name || 'Unknown User'}
                        </span>
                      </div>
                    ) : (
                      <span className="text-sm text-muted-foreground hover:text-foreground cursor-pointer transition-colors">Empty</span>
                    )}
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[200px]">
                    <DropdownMenuItem onClick={() => handleUpdate({ assigned_to: null })} className="text-xs text-muted-foreground">
                      Clear assignee
                    </DropdownMenuItem>
                    {members.map(member => (
                      <DropdownMenuItem 
                        key={member.id}
                        onClick={() => handleUpdate({ assigned_to: member.user_id })}
                        className="text-xs flex items-center gap-2"
                      >
                        <Avatar className="h-5 w-5">
                          <AvatarFallback className="bg-primary/10 text-primary text-[9px]">
                            {member.profile?.full_name?.substring(0, 2).toUpperCase() || 'UN'}
                          </AvatarFallback>
                        </Avatar>
                        {member.profile?.full_name || 'Unknown User'}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </PropertyRow>

              <PropertyRow icon={<Calendar className="h-4 w-4" />} label="Due date">
                <input
                  type="date"
                  className={cn(
                    "text-sm font-medium bg-transparent border-none outline-none cursor-pointer hover:text-primary transition-colors h-8 -ml-2 px-2 rounded-md hover:bg-secondary/50",
                    !task.due_date && "text-muted-foreground"
                  )}
                  value={task.due_date ? task.due_date.substring(0, 10) : ''}
                  onChange={(e) => {
                    if (e.target.value) {
                      handleUpdate({ due_date: new Date(e.target.value).toISOString() });
                    } else {
                      handleUpdate({ due_date: null });
                    }
                  }}
                />
              </PropertyRow>

              <PropertyRow icon={<AlertCircle className="h-4 w-4" />} label="Priority">
                <DropdownMenu>
                  <DropdownMenuTrigger className="focus:outline-none">
                    <PriorityBadge priority={task.priority} className="h-6 text-xs px-2.5 shadow-none cursor-pointer" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="start" className="w-[160px]">
                    {['low', 'medium', 'high'].map(priority => (
                      <DropdownMenuItem 
                        key={priority}
                        onClick={() => handleUpdate({ priority: priority as any })}
                        className="text-xs capitalize"
                      >
                        {priority}
                      </DropdownMenuItem>
                    ))}
                  </DropdownMenuContent>
                </DropdownMenu>
              </PropertyRow>
              
            </div>

            {/* Description */}
            <div className="pt-2">
              <textarea 
                value={descValue}
                onChange={(e) => {
                  setDescValue(e.target.value);
                  setIsEditingDesc(true);
                }}
                className="w-full bg-transparent border-none outline-none resize-none text-[15px] text-foreground/90 placeholder:text-muted-foreground/40 min-h-[100px] p-2 hover:bg-secondary/20 focus:bg-secondary/20 rounded-md transition-colors"
                placeholder="Add a description..."
              />
              {isEditingDesc && descValue !== (task.description || '') && (
                <div className="flex gap-2 mt-2">
                  <Button 
                    size="sm" 
                    onClick={() => {
                      handleUpdate({ description: descValue });
                      setIsEditingDesc(false);
                      toast.success('Description saved');
                    }}
                  >
                    Save
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={() => {
                      setDescValue(task.description || '');
                      setIsEditingDesc(false);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>



             {/* Comments Section */}
             <div className="pt-10 border-t border-border/40 mt-12">
                <h3 className="text-sm font-semibold mb-6">Comments</h3>
                
                {/* Comment Input */}
                <div className="flex gap-4 mb-8">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="bg-emerald-100 text-emerald-700 text-xs">YOU</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 border border-border/60 rounded-xl overflow-hidden focus-within:border-primary/50 focus-within:ring-1 focus-within:ring-primary/50 transition-all bg-card">
                    <textarea 
                      value={commentText}
                      onChange={(e) => setCommentText(e.target.value)}
                      placeholder="Add a comment..."
                      className="w-full bg-transparent text-sm p-3 min-h-[80px] outline-none resize-none placeholder:text-muted-foreground/50"
                    />
                    <div className="flex items-center justify-between p-2 bg-secondary/30 border-t border-border/40">
                      <input 
                        type="file" 
                        className="hidden" 
                        ref={fileInputRef} 
                        onChange={handleFileChange}
                      />
                      <Button variant="ghost" size="icon" className="h-7 w-7 rounded" onClick={handleAttachFile}>
                        <Paperclip className="h-3.5 w-3.5 text-muted-foreground" />
                      </Button>
                      <Button size="sm" className="h-7 text-xs font-semibold rounded-md" onClick={handleSendComment}>
                        Send
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  {feedItems.map((item) => {
                    if (item.type === 'comment') {
                      const comment = item.data;
                      const authorName = comment.profile?.full_name || 'Unknown User';
                      const authorInitials = authorName.substring(0, 2).toUpperCase();
                      const isMe = user?.id === comment.user_id;

                      return (
                        <div key={`comment-${comment.id}`} className="flex gap-4">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarFallback className={cn("text-xs", isMe ? 'bg-emerald-100 text-emerald-700' : 'bg-primary/10 text-primary')}>
                              {authorInitials}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{isMe ? 'You' : authorName}</span>
                              <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}</span>
                            </div>
                            <p className="text-sm text-foreground/90 whitespace-pre-wrap">
                              {comment.comment}
                            </p>
                          </div>
                        </div>
                      );
                    } else {
                      const attachment = item.data;
                      const uploaderName = attachment.profile?.full_name || 'Unknown User';
                      const isMe = user?.id === attachment.uploaded_by;

                      return (
                        <div key={`attachment-${attachment.id}`} className="flex gap-4">
                          <div className="h-8 w-8 shrink-0 flex items-center justify-center rounded-full bg-secondary text-muted-foreground">
                            <FileIcon className="h-4 w-4" />
                          </div>
                          <div className="flex-1 space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-foreground">{isMe ? 'You' : uploaderName}</span>
                              <span className="text-[11px] text-muted-foreground">{formatDistanceToNow(new Date(attachment.created_at), { addSuffix: true })}</span>
                              <span className="text-[11px] text-muted-foreground">attached a file</span>
                            </div>
                            <div className="mt-1">
                              <a href={attachment.file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-3 py-2 rounded-lg border border-border/60 bg-card hover:bg-secondary/50 transition-colors text-sm font-medium">
                                <Paperclip className="h-4 w-4 text-primary" />
                                {attachment.file_name}
                              </a>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
             </div>

          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}

function PropertyRow({ icon, label, children }: { icon: React.ReactNode, label: string, children: React.ReactNode }) {
  return (
    <div className="flex items-center min-h-[32px]">
      <div className="w-32 shrink-0 flex items-center gap-2 text-muted-foreground">
        <div className="opacity-70">{icon}</div>
        <span className="text-sm">{label}</span>
      </div>
      <div className="flex-1 flex items-center">
        {children}
      </div>
    </div>
  );
}

// File ends here.
