import * as React from 'react';
import { Calendar, X } from 'lucide-react';
import { Button } from '@/components/shared';

interface DueDatePickerProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  name?: string;
}

export function DueDatePicker({ value, onChange, id, name }: DueDatePickerProps) {
  // We use the native date picker for simplicity and robustness across devices, 
  // but wrap it in a custom UI to allow easy clearing.
  
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleClear = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onChange('');
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="relative flex items-center w-full">
      <div className="relative w-full">
        <Calendar className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground pointer-events-none" />
        <input
          ref={inputRef}
          type="date"
          id={id}
          name={name}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-input bg-background pl-10 pr-10 py-2 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary appearance-none min-h-[38px]"
        />
      </div>
      
      {value && (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="absolute right-1 h-7 w-7 text-muted-foreground hover:text-foreground"
          onClick={handleClear}
          title="Clear date"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
