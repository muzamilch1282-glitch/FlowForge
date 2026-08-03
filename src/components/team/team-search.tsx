import * as React from 'react';
import { Search } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface TeamSearchProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

export function TeamSearch({ value, onChange, className = '' }: TeamSearchProps) {
  const [localValue, setLocalValue] = React.useState(value);
  const debouncedValue = useDebounce(localValue, 300);

  React.useEffect(() => {
    onChange(debouncedValue);
  }, [debouncedValue, onChange]);

  React.useEffect(() => {
    setLocalValue(value);
  }, [value]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder="Search members by name or email..."
        className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-4 text-sm shadow-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
      />
    </div>
  );
}
