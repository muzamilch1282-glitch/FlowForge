import React from 'react';
import Link from 'next/link';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/shared';

export function Unauthorized() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center p-4 text-center">
      <div className="mb-6 rounded-full bg-destructive/10 p-4">
        <ShieldAlert className="h-12 w-12 text-destructive" />
      </div>
      <h1 className="mb-2 text-3xl font-bold tracking-tight">403 Access Denied</h1>
      <p className="mb-8 max-w-md text-muted-foreground">
        You do not have the required permissions to view this page or perform this action. 
        If you believe this is a mistake, please contact your workspace administrator.
      </p>
      <Link href="/dashboard">
        <Button className="gap-2">
          <ArrowLeft className="h-4 w-4" />
          Return to Dashboard
        </Button>
      </Link>
    </div>
  );
}
