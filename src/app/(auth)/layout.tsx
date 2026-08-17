import { Logo } from '@/components/shared/logo';
import { Layers } from 'lucide-react';
import { TypewriterHeading } from '@/components/auth/typewriter-heading';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen">
      {/* Left panel - decorative */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-primary p-10 text-primary-foreground relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -top-24 -left-24 h-96 w-96 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute -bottom-24 -right-24 h-96 w-96 rounded-full bg-black/10 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-64 w-64 rounded-full bg-white/5 blur-2xl" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-background shadow-md">
              <Layers className="h-5 w-5 text-primary" />
            </div>
            <span className="text-xl font-bold text-white tracking-tight">FlowForge</span>
          </div>
        </div>

        <div className="relative z-10 space-y-5">
          <TypewriterHeading />
          <p className="text-primary-foreground/80 text-lg max-w-md leading-relaxed">
            The modern project management platform for teams that move fast.
            Organize tasks, track progress, and collaborate seamlessly.
          </p>
        </div>

        <div className="relative z-10">
          <p className="text-sm text-primary-foreground/60 font-medium">
            &copy; {new Date().getFullYear()} FlowForge. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right panel - auth form */}
      <div className="flex w-full lg:w-1/2 flex-col items-center justify-center bg-background px-4 py-12 relative">
        <div className="w-full max-w-sm relative z-10">
          {/* Mobile logo */}
          <div className="mb-8 flex justify-center lg:hidden">
            <Logo />
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
