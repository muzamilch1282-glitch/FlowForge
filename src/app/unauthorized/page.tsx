'use client';

import React from 'react';
import { Unauthorized } from '@/components/auth/Unauthorized';

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <Unauthorized />
    </div>
  );
}
