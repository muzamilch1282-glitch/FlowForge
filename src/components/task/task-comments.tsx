import * as React from 'react';
import { MessageSquare, Send } from 'lucide-react';
import { Button } from '@/components/shared';

export function TaskComments() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <MessageSquare className="h-5 w-5 text-muted-foreground" />
        <h3 className="font-semibold text-foreground">Comments</h3>
      </div>
      
      <div className="space-y-4">
        {/* Dummy comments */}
        <div className="flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white shrink-0">
            JD
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">John Doe</span>
              <span className="text-xs text-muted-foreground">2 hours ago</span>
            </div>
            <p className="text-sm text-muted-foreground">
              I've started working on the initial mockups. Will share them soon.
            </p>
          </div>
        </div>

        <div className="flex gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500 text-xs font-medium text-white shrink-0">
            AS
          </div>
          <div className="flex-1 space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-foreground">Alice Smith</span>
              <span className="text-xs text-muted-foreground">1 hour ago</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Great! Let me know if you need any assets for this.
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-3 pt-2 border-t border-border mt-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-xs font-medium text-white shrink-0">
          ME
        </div>
        <div className="flex-1 relative">
          <textarea
            className="w-full resize-none rounded-md border border-input bg-background p-3 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary min-h-[80px]"
            placeholder="Add a comment..."
          />
          <Button size="sm" className="absolute bottom-2 right-2 h-7 px-2">
            <Send className="h-3 w-3 mr-1" /> Post
          </Button>
        </div>
      </div>
    </div>
  );
}
