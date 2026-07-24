import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import * as React from 'react';

interface DropdownItem {
  label: string;
  onClick?: () => void;
  icon?: React.ReactNode;
  disabled?: boolean;
}

interface DropdownProps {
  trigger: React.ReactNode;
  label?: string;
  items: DropdownItem[];
  align?: 'center' | 'end' | 'start';
}

export function Dropdown({ trigger, label, items, align = 'end' }: DropdownProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {trigger}
      </DropdownMenuTrigger>
      <DropdownMenuContent align={align}>
        {label && (
          <>
            <DropdownMenuLabel>{label}</DropdownMenuLabel>
            <DropdownMenuSeparator />
          </>
        )}
        {items.map((item, index) => (
          <DropdownMenuItem key={index} onClick={item.onClick} disabled={item.disabled}>
            {item.icon && <span className="mr-2 h-4 w-4">{item.icon}</span>}
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
