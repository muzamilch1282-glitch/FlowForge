import * as React from 'react';
import { MessageSquare } from 'lucide-react';
import { useComments } from '@/hooks/useComments';
import { CommentList } from '../comments/CommentList';
import { CommentForm } from '../comments/CommentForm';

interface TaskCommentsProps {
  taskId: string;
}

export function TaskComments({ taskId }: TaskCommentsProps) {
  const { 
    comments, 
    isLoading, 
    createComment, 
    isCreating, 
    updateComment, 
    isUpdating,
    deleteComment
  } = useComments(taskId);

  return (
    <div className="space-y-6 flex flex-col h-full max-h-[600px]">
      <div className="flex items-center gap-2 shrink-0">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Comments ({comments.length})</h3>
      </div>
      
      <div className="flex-1 overflow-y-auto pr-2 min-h-[200px]">
        <CommentList 
          comments={comments} 
          isLoading={isLoading} 
          onEdit={(id, comment) => updateComment({ id, comment })}
          onDelete={(id) => deleteComment(id)}
          isUpdating={isUpdating}
        />
      </div>

      <div className="pt-4 border-t border-border shrink-0 mt-auto">
        <CommentForm 
          onSubmit={(comment) => createComment({ comment })}
          isSubmitting={isCreating}
        />
      </div>
    </div>
  );
}
