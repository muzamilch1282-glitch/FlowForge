'use client';

import * as React from 'react';
import { useChat } from 'ai/react';
import { useWorkspace } from '@/hooks/useWorkspace';
import { useAppStore } from '@/store';
import { Button } from '@/components/shared';
import { X, Bot, User, Send, Sparkles, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ReactMarkdown from 'react-markdown';

export function AIAssistant() {
  const { workspaces } = useWorkspace();
  const { activeWorkspaceId, aiAssistantOpen, setAiAssistantOpen } = useAppStore();
  const currentWorkspace = workspaces.find(w => w.id === activeWorkspaceId);
  const bottomRef = React.useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading, setInput, append } = useChat({
    api: '/api/ai/chat',
    body: {
      workspaceId: currentWorkspace?.id,
    },
    onError: (err) => {
      console.error(err);
    }
  });

  // Auto-scroll to bottom
  React.useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  if (!aiAssistantOpen) return null;

  const quickPrompts = [
    "What are my overdue tasks?",
    "Summarize the project status.",
    "Create a high priority task for Landing Page."
  ];

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-[400px] bg-card border-l border-border shadow-2xl z-[99] flex flex-col transform transition-transform duration-300 ease-in-out">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Sparkles className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-semibold text-foreground leading-none">FlowForge AI</h2>
            <span className="text-xs text-muted-foreground">Workspace Assistant</span>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={() => setAiAssistantOpen(false)} className="h-8 w-8 rounded-full">
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4 opacity-70">
            <Bot className="h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground max-w-[250px]">
              Hi! I'm your FlowForge assistant. I can help you manage projects, find overdue tasks, or create new ones.
            </p>
            <div className="flex flex-col gap-2 mt-4 w-full px-4">
              {quickPrompts.map((prompt, i) => (
                <button
                  key={i}
                  disabled={!currentWorkspace}
                  onClick={() => {
                    if (currentWorkspace?.id) {
                      append(
                        { role: 'user', content: prompt },
                        { options: { body: { workspaceId: currentWorkspace.id } } }
                      );
                    }
                  }}
                  className="text-xs text-left p-2.5 rounded-lg border border-border bg-background hover:bg-accent transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {prompt}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map(m => (
            <div
              key={m.id}
              className={cn(
                "flex gap-3 max-w-[90%]",
                m.role === 'user' ? "ml-auto flex-row-reverse" : ""
              )}
            >
              <div className={cn(
                "flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"
              )}>
                {m.role === 'user' ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>
              <div className={cn(
                "rounded-xl px-4 py-2.5 text-sm",
                m.role === 'user' ? "bg-primary text-primary-foreground" : "bg-muted text-foreground border border-border"
              )}>
                {/* Render tool invocations gracefully */}
                {m.toolInvocations && m.toolInvocations.length > 0 ? (
                  <div className="text-xs italic opacity-80 mb-2">
                    {m.toolInvocations.map(t => (
                      <div key={t.toolCallId} className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        Executing action: {t.toolName}...
                      </div>
                    ))}
                  </div>
                ) : null}
                <div className="prose prose-sm dark:prose-invert max-w-none">
                  <ReactMarkdown>
                    {m.content}
                  </ReactMarkdown>
                </div>
              </div>
            </div>
          ))
        )}
        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground">
              <Bot className="h-4 w-4" />
            </div>
            <div className="flex items-center rounded-xl bg-muted px-4 py-2.5">
              <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-border bg-card">
        <form onSubmit={(e) => {
          e.preventDefault();
          if (currentWorkspace?.id) {
            handleSubmit(e, { options: { body: { workspaceId: currentWorkspace.id } } });
          }
        }} className="flex items-center gap-2 relative">
          <input
            type="text"
            className="flex-1 h-10 w-full rounded-full border border-input bg-background px-4 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            placeholder="Ask AI or type a command..."
            value={input}
            onChange={handleInputChange}
            disabled={!currentWorkspace || isLoading}
          />
          <Button 
            type="submit" 
            size="icon" 
            className="absolute right-1 h-8 w-8 rounded-full"
            disabled={!input?.trim() || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </form>
        {!currentWorkspace && (
          <p className="text-xs text-destructive mt-2 text-center">
            Select a workspace first to use the assistant.
          </p>
        )}
      </div>
    </div>
  );
}
