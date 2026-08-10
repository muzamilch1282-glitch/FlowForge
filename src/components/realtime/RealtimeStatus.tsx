'use client';

import * as React from 'react';
import { useRealtimeStatus } from './RealtimeProvider';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Wifi, WifiOff } from 'lucide-react';

export function RealtimeStatus() {
  const { status } = useRealtimeStatus();

  let icon = <Wifi className="h-4 w-4 text-emerald-500" />;
  let tooltipText = 'Realtime Connected';
  let dotClass = 'bg-emerald-500';
  let pingClass = 'bg-emerald-400';

  if (status === 'connecting') {
    icon = <Wifi className="h-4 w-4 text-amber-500" />;
    tooltipText = 'Connecting to Realtime...';
    dotClass = 'bg-amber-500';
    pingClass = 'bg-amber-400';
  } else if (status === 'disconnected') {
    icon = <WifiOff className="h-4 w-4 text-muted-foreground" />;
    tooltipText = 'Realtime Disconnected';
    dotClass = 'bg-muted-foreground';
    pingClass = 'hidden';
  }

  return (
    <TooltipProvider delayDuration={100}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center justify-center h-9 w-9 rounded-full hover:bg-secondary transition-colors cursor-help relative">
            {/* The Icon */}
            {icon}
            
            {/* The status dot */}
            <span className="absolute bottom-1 right-1 flex h-2.5 w-2.5">
              {status === 'connecting' && (
                <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${pingClass}`}></span>
              )}
              <span className={`relative inline-flex rounded-full h-2.5 w-2.5 border-[1.5px] border-background ${dotClass}`}></span>
            </span>
          </div>
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end" className="text-xs">
          {tooltipText}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
