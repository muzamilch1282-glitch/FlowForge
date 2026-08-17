import * as React from 'react';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LayoutDashboard, 
  CheckSquare, 
  KanbanSquare, 
  BarChart2, 
  Search, 
  Bell, 
  MoreHorizontal,
  Bot,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function LandingProductShowcase() {
  return (
    <section className="py-24 bg-background relative overflow-hidden">
      
      {/* Background Glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] bg-primary/5 rounded-full blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
        
        {/* Floating Labels */}
        <div className="absolute top-[10%] left-[-2%] z-10 hidden lg:block animate-[bounce_4s_infinite_ease-in-out]">
          <div className="flex items-center gap-2 bg-background border border-border shadow-md rounded-full px-4 py-2 text-sm font-semibold text-foreground">
            <LayoutDashboard className="h-4 w-4 text-primary" /> Projects
          </div>
        </div>
        
        <div className="absolute top-[30%] right-[-3%] z-10 hidden lg:block animate-[bounce_5s_infinite_ease-in-out]">
          <div className="flex items-center gap-2 bg-background border border-border shadow-md rounded-full px-4 py-2 text-sm font-semibold text-foreground">
            <CheckSquare className="h-4 w-4 text-emerald-500" /> Tasks
          </div>
        </div>

        <div className="absolute bottom-[20%] left-[-4%] z-10 hidden lg:block animate-[bounce_6s_infinite_ease-in-out]">
          <div className="flex items-center gap-2 bg-background border border-border shadow-md rounded-full px-4 py-2 text-sm font-semibold text-foreground">
            <Zap className="h-4 w-4 text-amber-500" /> Automation
          </div>
        </div>

        <div className="absolute bottom-[10%] right-[-1%] z-10 hidden lg:block animate-[bounce_4.5s_infinite_ease-in-out]">
          <div className="flex items-center gap-2 bg-background border border-border shadow-md rounded-full px-4 py-2 text-sm font-semibold text-foreground">
            <Bot className="h-4 w-4 text-purple-500" /> AI Assistant
          </div>
        </div>

        <div className="absolute top-[-4%] left-[60%] z-10 hidden lg:block animate-[bounce_5.5s_infinite_ease-in-out]">
          <div className="flex items-center gap-2 bg-background border border-border shadow-md rounded-full px-4 py-2 text-sm font-semibold text-foreground">
            <BarChart2 className="h-4 w-4 text-orange-500" /> Analytics
          </div>
        </div>


        {/* The Product Showcase Mockup */}
        <div className="relative mx-auto rounded-[24px] border border-border/80 bg-background shadow-[0_20px_60px_rgba(0,0,0,0.1)] overflow-hidden flex flex-col w-full max-w-5xl h-[650px]">
          
          {/* Top Navigation Bar */}
          <div className="h-14 border-b border-border bg-subtle flex items-center justify-between px-6 shrink-0">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <div className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              
              <div className="flex items-center bg-background border border-border rounded-lg px-3 py-1.5 gap-2 text-sm text-muted-foreground w-64 shadow-sm">
                <Search className="h-4 w-4" />
                <span>Search everything...</span>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <Bell className="h-5 w-5 text-muted-foreground hover:text-foreground cursor-pointer transition-colors" />
              <div className="h-8 w-8 rounded-full border border-border overflow-hidden bg-primary/10 flex items-center justify-center text-primary font-bold text-xs">
                JD
              </div>
            </div>
          </div>

          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-60 border-r border-border bg-subtle/30 p-4 hidden md:flex flex-col gap-6 shrink-0 overflow-y-auto">
              <div className="space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Views</div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-primary/10 text-primary font-medium text-sm">
                  <LayoutDashboard className="h-4 w-4" /> Dashboard
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground font-medium text-sm hover:bg-accent hover:text-foreground transition-colors cursor-pointer">
                  <CheckSquare className="h-4 w-4" /> My Tasks
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground font-medium text-sm hover:bg-accent hover:text-foreground transition-colors cursor-pointer">
                  <BarChart2 className="h-4 w-4" /> Reports
                </div>
              </div>
              
              <div className="space-y-1">
                <div className="px-3 mb-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider flex justify-between items-center">
                  Favorites
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground font-medium text-sm hover:bg-accent hover:text-foreground transition-colors cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-orange-500" /> Q3 Marketing Launch
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground font-medium text-sm hover:bg-accent hover:text-foreground transition-colors cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" /> Engineering Roadmap
                </div>
                <div className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground font-medium text-sm hover:bg-accent hover:text-foreground transition-colors cursor-pointer">
                  <div className="w-2.5 h-2.5 rounded-full bg-purple-500" /> Design System Revamp
                </div>
              </div>
            </div>

            {/* Main Content Area */}
            <div className="flex-1 bg-background flex flex-col overflow-hidden">
              {/* Header */}
              <div className="px-8 py-6 border-b border-border shrink-0">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h1 className="text-2xl font-bold text-foreground">Engineering Roadmap</h1>
                    <p className="text-sm text-muted-foreground mt-1">Plan, track, and manage all engineering deliverables.</p>
                  </div>
                  <div className="flex items-center -space-x-2">
                    <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                      <AvatarFallback className="text-xs bg-orange-100 text-orange-700">JD</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                      <AvatarFallback className="text-xs bg-green-100 text-green-700">AL</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                      <AvatarFallback className="text-xs bg-purple-100 text-purple-700">MK</AvatarFallback>
                    </Avatar>
                    <Avatar className="h-8 w-8 border-2 border-background shadow-sm">
                      <AvatarFallback className="text-xs bg-orange-100 text-orange-700">SR</AvatarFallback>
                    </Avatar>
                    <div className="h-8 w-8 rounded-full border-2 border-background bg-muted flex items-center justify-center text-xs font-medium text-muted-foreground shadow-sm">
                      +3
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex items-center gap-6 text-sm font-medium">
                  <div className="text-primary border-b-2 border-primary pb-2 flex items-center gap-2">
                    <KanbanSquare className="h-4 w-4" /> Board
                  </div>
                  <div className="text-muted-foreground pb-2 flex items-center gap-2 cursor-pointer hover:text-foreground">
                    <LayoutDashboard className="h-4 w-4" /> Overview
                  </div>
                  <div className="text-muted-foreground pb-2 flex items-center gap-2 cursor-pointer hover:text-foreground">
                    <CheckSquare className="h-4 w-4" /> List
                  </div>
                </div>
              </div>

              {/* Board Canvas */}
              <div className="flex-1 overflow-x-auto p-8 bg-subtle/30 flex gap-6">
                
                {/* Column 1 */}
                <div className="w-[300px] shrink-0 flex flex-col gap-4">
                  <div className="flex items-center justify-between font-semibold text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-slate-400" />
                      Backlog
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">5</span>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-xl border border-border p-4 shadow-sm hover:border-border/80 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs font-medium bg-orange-50 text-orange-700 border-orange-200">Frontend</Badge>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-sm text-foreground mb-3">Migrate to Next.js App Router</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><CheckSquare className="h-3.5 w-3.5" /> 0/12</span>
                      </div>
                      <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-orange-100 text-orange-700">JD</AvatarFallback></Avatar>
                    </div>
                  </div>

                  <div className="bg-background rounded-xl border border-border p-4 shadow-sm hover:border-border/80 transition-colors cursor-pointer">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs font-medium bg-purple-50 text-purple-700 border-purple-200">Backend</Badge>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-sm text-foreground mb-3">Setup Redis caching layer</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><CheckSquare className="h-3.5 w-3.5" /> 0/4</span>
                      </div>
                      <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-purple-100 text-purple-700">MK</AvatarFallback></Avatar>
                    </div>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="w-[300px] shrink-0 flex flex-col gap-4">
                  <div className="flex items-center justify-between font-semibold text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      In Progress
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">2</span>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-xl border border-primary/30 p-4 shadow-[0_4px_12px_rgba(99,91,255,0.08)] cursor-pointer ring-1 ring-primary/20">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs font-medium bg-amber-50 text-amber-700 border-amber-200">Design</Badge>
                      <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                    </div>
                    <h3 className="font-medium text-sm text-foreground mb-3">Redesign Landing Page Hero</h3>
                    
                    <div className="w-full bg-muted rounded-full h-1.5 mb-3 overflow-hidden">
                      <div className="bg-primary h-1.5 rounded-full w-[75%]" />
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1 text-primary"><CheckSquare className="h-3.5 w-3.5" /> 3/4</span>
                      </div>
                      <div className="flex -space-x-1.5">
                        <Avatar className="h-6 w-6 border-2 border-background"><AvatarFallback className="text-[10px] bg-green-100 text-green-700">AL</AvatarFallback></Avatar>
                        <Avatar className="h-6 w-6 border-2 border-background"><AvatarFallback className="text-[10px] bg-orange-100 text-orange-700">JD</AvatarFallback></Avatar>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Column 3 */}
                <div className="w-[300px] shrink-0 flex flex-col gap-4 opacity-70">
                  <div className="flex items-center justify-between font-semibold text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                      Done
                      <span className="bg-muted text-muted-foreground px-2 py-0.5 rounded-full text-xs">8</span>
                    </div>
                  </div>
                  
                  <div className="bg-background rounded-xl border border-border p-4 shadow-sm">
                    <div className="flex justify-between items-start mb-2">
                      <Badge variant="outline" className="text-xs font-medium bg-emerald-50 text-emerald-700 border-emerald-200">Infrastructure</Badge>
                    </div>
                    <h3 className="font-medium text-sm text-foreground mb-3 line-through text-muted-foreground">Update PostgreSQL to v15</h3>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span className="text-emerald-600 font-medium">Completed</span>
                      <Avatar className="h-6 w-6"><AvatarFallback className="text-[10px] bg-orange-100 text-orange-700">SR</AvatarFallback></Avatar>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
