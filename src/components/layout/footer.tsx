import { Heart } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-card/30 px-4 py-4 sm:px-6">
      <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
        <p className="text-xs text-muted-foreground">
          &copy; {currentYear} FlowForge. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <a
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Privacy Policy
          </a>
          <a
            href="#"
            className="text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
