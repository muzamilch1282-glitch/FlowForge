import React, { useState } from 'react';
import { TaskComment } from '@/types/comment';
import { UserAvatar } from './UserAvatar';
import { formatDistanceToNow, parseISO } from 'date-fns';
import { Edit2, Trash2, MoreHorizontal } from 'lucide-react';
import { Dropdown } from '@/components/shared';
import { CommentEditor } from './CommentEditor';
import { useAuth } from '@/hooks/useAuth';
import { usePermissions } from '@/hooks/usePermissions';

interface CommentCardProps {
  comment: TaskComment;
  onEdit: (id: string, newContent: string) => void;
  onDelete: (id: string) => void;
  isUpdating?: boolean;
}

export function CommentCard({ comment, onEdit, onDelete, isUpdating }: CommentCardProps) {
  const { user } = useAuth();
  const { isAdmin } = usePermissions();
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(comment.comment);

  const isOwner = user?.id === comment.user_id;
  const canModify = isOwner || isAdmin();

  const handleSave = () => {
    if (editValue.trim() && editValue !== comment.comment) {
      onEdit(comment.id, editValue);
    }
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditValue(comment.comment);
    setIsEditing(false);
  };

  const isEdited = comment.updated_at !== comment.created_at;

  return (
    <div className={`flex gap-3 p-4 rounded-xl transition-colors ${isEditing ? 'bg-muted/30' : 'hover:bg-muted/10'}`}>
      <div className="shrink-0 pt-1">
        <UserAvatar profile={comment.profile} />
      </div>
      
      <div className="flex-1 space-y-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 truncate">
            <span className="text-sm font-medium text-foreground truncate">
              {comment.profile?.full_name || 'Unknown User'}
            </span>
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              {formatDistanceToNow(parseISO(comment.created_at), { addSuffix: true })}
            </span>
            {isEdited && !isEditing && (
              <span className="text-[10px] text-muted-foreground/70 bg-muted px-1.5 py-0.5 rounded-full">
                edited
              </span>
            )}
          </div>
          
          {canModify && !isEditing && (
            <Dropdown
              trigger={
                <button className="h-6 w-6 rounded flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </button>
              }
              items={[
                ...(isOwner ? [{
                  label: 'Edit',
                  icon: <Edit2 className="h-4 w-4" />,
                  onClick: () => setIsEditing(true),
                }] : []),
                {
                  label: 'Delete',
                  icon: <Trash2 className="h-4 w-4" />,
                  onClick: () => onDelete(comment.id),
                  danger: true,
                }
              ]}
              align="end"
            />
          )}
        </div>

        {isEditing ? (
          <div className="pt-2">
            <CommentEditor
              value={editValue}
              onChange={setEditValue}
              onSubmit={handleSave}
              onCancel={handleCancel}
              isSubmitting={isUpdating}
              submitLabel="Save Changes"
            />
          </div>
        ) : (
          <div 
            className="text-sm text-foreground/90 prose prose-sm dark:prose-invert max-w-none break-words [&>p]:m-0 [&>ul]:m-0 [&>ol]:m-0"
            dangerouslySetInnerHTML={{ __html: comment.comment }}
          />
        )}
      </div>
    </div>
  );
}
