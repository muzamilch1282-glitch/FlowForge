import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, List, ListOrdered } from 'lucide-react';
import { cn } from '@/lib/utils';

interface RichTextInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
}

export function RichTextInput({ value, onChange, placeholder, className, disabled }: RichTextInputProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [isFocused, setIsFocused] = useState(false);

  // Sync external value changes to the editor if it's not focused
  useEffect(() => {
    if (editorRef.current && !isFocused && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value, isFocused]);

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const executeCommand = (command: string, e: React.MouseEvent) => {
    e.preventDefault();
    if (disabled) return;
    document.execCommand(command, false, undefined);
    if (editorRef.current) {
      editorRef.current.focus();
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div 
      className={cn(
        "flex flex-col rounded-md border border-input bg-background shadow-sm transition-colors",
        isFocused ? "ring-1 ring-primary border-primary" : "",
        disabled ? "opacity-50 cursor-not-allowed bg-muted/50" : "",
        className
      )}
    >
      {/* Toolbar */}
      <div className="flex items-center gap-1 border-b border-border p-1 bg-muted/30">
        <button
          type="button"
          onMouseDown={(e) => executeCommand('bold', e)}
          className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"
          disabled={disabled}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => executeCommand('italic', e)}
          className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"
          disabled={disabled}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <div className="w-px h-4 bg-border mx-1" />
        <button
          type="button"
          onMouseDown={(e) => executeCommand('insertUnorderedList', e)}
          className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"
          disabled={disabled}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onMouseDown={(e) => executeCommand('insertOrderedList', e)}
          className="p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground rounded transition-colors"
          disabled={disabled}
          title="Numbered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      {/* Editor Area */}
      <div
        ref={editorRef}
        contentEditable={!disabled}
        className="min-h-[80px] p-3 text-sm focus:outline-none prose prose-sm dark:prose-invert max-w-none"
        onInput={handleInput}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        suppressContentEditableWarning
        data-placeholder={placeholder}
      />
      
      {!value && !isFocused && placeholder && (
        <div className="absolute top-[46px] left-3 text-sm text-muted-foreground pointer-events-none select-none">
          {placeholder}
        </div>
      )}
      <style dangerouslySetInnerHTML={{__html: `
        [contenteditable]:empty:before {
          content: attr(data-placeholder);
          color: hsl(var(--muted-foreground));
          pointer-events: none;
          display: block; /* For Firefox */
        }
      `}} />
    </div>
  );
}
