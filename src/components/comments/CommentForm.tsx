import React, { useState } from 'react';
import { CommentEditor } from './CommentEditor';
import { UserAvatar } from './UserAvatar';
import { useAuth } from '@/hooks/useAuth';

interface CommentFormProps {
  onSubmit: (comment: string) => void;
  isSubmitting?: boolean;
}

export function CommentForm({ onSubmit, isSubmitting }: CommentFormProps) {
  const { profile } = useAuth();
  const [value, setValue] = useState('');

  const handleSubmit = () => {
    onSubmit(value);
    setValue('');
  };

  return (
    <div className="flex gap-3 p-4 bg-muted/20 rounded-xl border border-border/50">
      <div className="shrink-0 pt-1">
        <UserAvatar profile={profile || undefined} />
      </div>
      <div className="flex-1 min-w-0">
        <CommentEditor
          value={value}
          onChange={setValue}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
        />
      </div>
    </div>
  );
}
