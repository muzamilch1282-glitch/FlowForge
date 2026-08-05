import React from 'react';
import { RichTextInput } from './RichTextInput';
import { Button } from '@/components/shared';
import { Send, X } from 'lucide-react';

interface CommentEditorProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
  placeholder?: string;
  submitLabel?: string;
  cancelLabel?: string;
}

export function CommentEditor({
  value,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  placeholder = "Add a comment...",
  submitLabel = "Post",
  cancelLabel = "Cancel"
}: CommentEditorProps) {
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!value.trim() || value === '<br>') return;
    onSubmit();
  };

  const isEmpty = !value.trim() || value === '<br>';

  return (
    <div className="flex flex-col gap-2">
      <RichTextInput
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={isSubmitting}
      />
      
      <div className="flex items-center justify-end gap-2 mt-1">
        {onCancel && (
          <Button 
            type="button" 
            variant="ghost" 
            size="sm" 
            onClick={onCancel}
            disabled={isSubmitting}
          >
            {cancelLabel}
          </Button>
        )}
        <Button 
          type="button" 
          size="sm" 
          onClick={handleSubmit} 
          disabled={isEmpty || isSubmitting}
          className="gap-1.5"
        >
          {isSubmitting ? (
            <div className="h-3 w-3 animate-spin rounded-full border-2 border-primary-foreground border-r-transparent" />
          ) : (
            <Send className="h-3.5 w-3.5" />
          )}
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
