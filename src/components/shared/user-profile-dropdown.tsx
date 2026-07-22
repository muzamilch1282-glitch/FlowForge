'use client';

import * as React from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { userMenuItems } from '@/constants/navigation';
import { LogOut, ChevronsUpDown } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { authService } from '@/services/auth.service';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

interface UserProfileDropdownProps {
  children?: React.ReactNode;
  align?: 'center' | 'end' | 'start';
  side?: 'top' | 'right' | 'bottom' | 'left';
}

export function UserProfileDropdown({ children, align = 'end', side = 'bottom' }: UserProfileDropdownProps) {
  const { user, profile } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await authService.logout();
      toast.success('Logged out successfully');
      router.push('/login');
    } catch (error: any) {
      toast.error('Failed to logout');
    }
  };

  const userInitials = profile?.full_name
    ? profile.full_name.substring(0, 2).toUpperCase()
    : 'FF';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {children || (
          <button className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8 border border-border">
              <AvatarImage src={profile?.avatar_url || ""} alt="User" />
              <AvatarFallback className="bg-gradient-to-br from-violet-500 to-indigo-600 text-xs font-bold text-white">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align={align} side={side} forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {profile?.full_name || 'FlowForge User'}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {profile?.email || user?.email || 'user@flowforge.io'}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {userMenuItems.map((item) => {
            const Icon = item.icon;
            return (
              <DropdownMenuItem key={item.title} asChild>
                <Link href={item.href} className="cursor-pointer">
                  <Icon className="mr-2 h-4 w-4" />
                  <span>{item.title}</span>
                </Link>
              </DropdownMenuItem>
            );
          })}
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
