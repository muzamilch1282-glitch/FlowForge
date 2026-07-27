import React from 'react';
import { Search, Plus } from 'lucide-react';

interface DashboardHeaderProps {
  title: string;
  welcomeMessage: string;
}

export function DashboardHeader({ title, welcomeMessage }: DashboardHeaderProps) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        <p className="text-sm text-muted-foreground">
          {welcomeMessage}
        </p>
      </div>

    </div>
  );
}
