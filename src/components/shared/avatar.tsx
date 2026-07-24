import { Avatar as UIAvatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import * as React from 'react';

interface SharedAvatarProps extends React.ComponentPropsWithoutRef<typeof UIAvatar> {
  src?: string;
  alt?: string;
  fallback?: string;
}

export function Avatar({ src, alt, fallback, className, ...props }: SharedAvatarProps) {
  return (
    <UIAvatar className={cn(className)} {...props}>
      <AvatarImage src={src} alt={alt} />
      <AvatarFallback>{fallback}</AvatarFallback>
    </UIAvatar>
  );
}
