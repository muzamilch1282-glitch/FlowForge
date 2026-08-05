import React, { useEffect, useRef } from 'react';
import { TaskComment } from '@/types/comment';
import { CommentCard } from './CommentCard';
import { CommentSkeleton } from './CommentSkeleton';
import { EmptyComments } from './EmptyComments';

interface CommentListProps {
  comments: TaskComment[];
  isLoading: boolean;
  onEdit: (id: string, content: string) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export function CommentList({ comments, isLoading, onEdit, onDelete, isUpdating }: CommentListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom when comments change (e.g., when a new comment is added)
  useEffect(() => {
    if (bottomRef.current && comments.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [comments.length]); // Only trigger on length change to avoid scrolling on every edit

  if (isLoading) {
    return (
      <div className="space-y-4">
        <CommentSkeleton />
        <CommentSkeleton />
        <CommentSkeleton />
      </div>
    );
  }

  if (comments.length === 0) {
    return <EmptyComments />;
  }

  return (
    <div className="space-y-2">
      {comments.map((comment) => (
        <CommentCard
          key={comment.id}
          comment={comment}
          onEdit={onEdit}
          onDelete={onDelete}
          isUpdating={isUpdating}
        />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
