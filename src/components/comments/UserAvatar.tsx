import React from 'react';
import { Avatar } from '@/components/shared/avatar';
import { UserProfile } from '@/types/auth';

interface UserAvatarProps {
  profile?: UserProfile;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ profile, className, size = 'md' }: UserAvatarProps) {
  const fallback = profile?.full_name 
    ? profile.full_name.substring(0, 2).toUpperCase()
    : 'U';
    
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-8 w-8 text-sm',
    lg: 'h-10 w-10 text-base',
  };

  return (
    <Avatar 
      src={profile?.avatar_url || ''} 
      alt={profile?.full_name || 'User Avatar'} 
      fallback={fallback}
      className={`${sizeClasses[size]} ${className || ''}`}
    />
  );
}
