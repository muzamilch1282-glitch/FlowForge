import Link from 'next/link';
import { Lock, ArrowLeft, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/shared';

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background/50 p-6">
      <div className="max-w-md w-full flex flex-col items-center text-center space-y-6 animate-in fade-in zoom-in-95 duration-500">
        
        {/* Icon */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full" />
          <div className="h-24 w-24 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center relative z-10 shadow-sm">
            <Lock className="h-10 w-10 text-primary" strokeWidth={1.5} />
          </div>
        </div>
        
        {/* Text Content */}
        <div className="space-y-3">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            You don't have access to this page.
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto">
            Your current role doesn't have permission to access this resource. If you believe this is a mistake, please contact your workspace administrator.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row items-center gap-3 pt-4 w-full sm:w-auto">
          <Link href="/dashboard" className="w-full sm:w-auto">
            <Button className="w-full sm:w-auto gap-2 h-11 px-8 rounded-full font-medium shadow-sm hover:shadow-md transition-all">
              <LayoutDashboard className="h-4 w-4" />
              Go to Dashboard
            </Button>
          </Link>
          <Link href="javascript:history.back()" className="w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto gap-2 h-11 px-8 rounded-full font-medium hover:bg-secondary/80 transition-all border-border/60">
              <ArrowLeft className="h-4 w-4" />
              Go Back
            </Button>
          </Link>
        </div>
        
      </div>
    </div>
  );
}
