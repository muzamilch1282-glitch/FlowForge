import * as React from 'react';

interface MemberAvatarProps {
  name: string;
  avatarUrl?: string | null;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export function MemberAvatar({ name, avatarUrl, size = 'md', className = '' }: MemberAvatarProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-[10px]',
    md: 'h-9 w-9 text-xs',
    lg: 'h-12 w-12 text-sm',
  };

  const initials = name
    .split(' ')
    .map(n => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase();

  return (
    <div 
      className={`relative flex shrink-0 items-center justify-center overflow-hidden rounded-full bg-primary/10 text-primary font-medium border border-primary/20 ${sizeClasses[size]} ${className}`}
      title={name}
    >
      {avatarUrl ? (
        <img 
          src={avatarUrl} 
          alt={name} 
          className="h-full w-full object-cover"
        />
      ) : (
        <span>{initials}</span>
      )}
    </div>
  );
}
