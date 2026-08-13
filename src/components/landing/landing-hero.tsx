'use client';

import { motion, useReducedMotion } from 'framer-motion';
import { Layers } from 'lucide-react';
import Link from 'next/link';

export function LandingHero() {
  const shouldReduceMotion = useReducedMotion();

  // Helper to determine initial animation state based on reduced motion preference
  const getInitial = (hiddenState: object, visibleState: object): any =>
    shouldReduceMotion ? visibleState : hiddenState;

  return (
    <section className="relative w-full min-h-[92vh] flex items-center overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-24">
      {/* Inline styles for blob keyframe animations */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes drift-1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(3%, 5%) scale(1.05); }
          66% { transform: translate(-2%, 2%) scale(0.95); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes drift-2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-4%, 3%) scale(0.95); }
          66% { transform: translate(2%, -4%) scale(1.05); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes drift-3 {
          0% { transform: translate(0, 0) scale(1); }
          50% { transform: translate(2%, -5%) scale(1.02); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes float-mockup {
          0% { transform: translateY(0px); }
          50% { transform: translateY(-6px); }
          100% { transform: translateY(0px); }
        }
        @media (prefers-reduced-motion: reduce) {
          .blob-animated, .mockup-animated {
            animation: none !important;
            transform: none !important;
          }
        }
      `}} />

      {/* Background blobs and grid */}
      <div className="absolute inset-0 pointer-events-none -z-10 overflow-hidden bg-white">
        {/* Blob 1: Top-Left */}
        <div 
          className="blob-animated absolute -top-[10%] -left-[10%] w-[50%] h-[60%] rounded-full bg-[var(--primary)] opacity-8 blur-[100px]"
          style={{ animation: 'drift-1 60s infinite ease-in-out' }}
        />
        {/* Blob 2: Top-Right */}
        <div 
          className="blob-animated absolute top-[0%] -right-[10%] w-[45%] h-[55%] rounded-full bg-blue-500 opacity-5 blur-[100px]"
          style={{ animation: 'drift-2 80s infinite ease-in-out' }}
        />
        {/* Blob 3: Bottom-Center */}
        <div 
          className="blob-animated absolute top-[40%] left-[25%] w-[50%] h-[50%] rounded-full bg-violet-500 opacity-6 blur-[120px]"
          style={{ animation: 'drift-3 45s infinite ease-in-out' }}
        />
        {/* Fine Dot Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, black 1px, transparent 0)', backgroundSize: '32px 32px' }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex flex-col items-center text-center">
        <div className="max-w-4xl mx-auto flex flex-col items-center text-center">
          <motion.div
            initial={getInitial({ opacity: 0, y: 10 }, { opacity: 1, y: 0 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5, ease: "easeOut" }}
          >
            <span className="inline-block uppercase tracking-widest text-xs font-semibold text-[var(--primary)] bg-[var(--primary-soft)] px-3 py-1 rounded-full mb-6">
              PROJECT MANAGEMENT, REIMAGINED
            </span>
          </motion.div>

          <motion.h1
            initial={getInitial({ opacity: 0, y: 20 }, { opacity: 1, y: 0 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
            className="text-4xl sm:text-5xl md:text-[60px] font-extrabold leading-[1.1] tracking-tight whitespace-pre-line bg-gradient-to-br from-gray-900 to-gray-600 bg-clip-text text-transparent mb-6"
          >
            {"One workspace.\nEvery project.\nComplete control."}
          </motion.h1>

          <motion.p
            initial={getInitial({ opacity: 0, y: 15 }, { opacity: 1, y: 0 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.5, ease: "easeOut" }}
            className="text-lg md:text-xl text-gray-500 max-w-xl mx-auto mb-8"
          >
            FlowForge brings projects, tasks, collaboration, automation, AI and analytics into one focused workspace.
          </motion.p>

          <motion.div
            initial={getInitial({ opacity: 0, y: 10 }, { opacity: 1, y: 0 })}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.4, ease: "easeOut" }}
            className="flex flex-col items-center w-full"
          >
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
              <Link 
                href="/signup" 
                className="w-full sm:w-auto bg-[var(--primary)] text-white rounded-full px-6 py-3 font-semibold hover:bg-[var(--primary-hover)] active:scale-[0.98] transition-all shadow-sm"
              >
                Start for free
              </Link>
              <Link 
                href="#features" 
                className="w-full sm:w-auto border border-gray-200 rounded-full px-6 py-3 font-medium text-gray-700 hover:border-gray-300 hover:bg-gray-50 transition-all bg-white shadow-sm"
              >
                Explore FlowForge
              </Link>
            </div>
            <p className="mt-4 text-xs text-gray-400">
              Built for modern teams.
            </p>
          </motion.div>
        </div>

        {/* Product Preview Mockup */}
        <motion.div
          initial={getInitial({ opacity: 0, scale: 0.97 }, { opacity: 1, scale: 1 })}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.7, duration: 0.7, ease: "easeOut" }}
          className="w-full max-w-5xl mx-auto mt-16 lg:mt-24 perspective-1000"
        >
          <div className="mockup-animated w-full rounded-2xl border border-gray-200 shadow-2xl shadow-gray-200/80 bg-white overflow-hidden text-left flex flex-col" style={{ animation: 'float-mockup 6s infinite ease-in-out' }}>
            {/* Browser Chrome */}
            <div className="bg-gray-50 border-b border-gray-100 h-10 flex items-center gap-2 px-4 shrink-0">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400"></div>
                <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                <div className="w-3 h-3 rounded-full bg-green-400"></div>
              </div>
              <div className="flex-1 max-w-sm mx-auto flex items-center justify-center">
                <div className="bg-white border border-gray-200 rounded-md px-3 py-1 text-[10px] text-gray-500 font-mono w-full text-center truncate shadow-sm">
                  app.flowforge.io/dashboard
                </div>
              </div>
              <div className="w-10"></div> {/* spacer for centering URL */}
            </div>

            {/* App Layout */}
            <div className="flex flex-1 min-h-[400px] bg-white">
              {/* Sidebar */}
              <div className="w-48 bg-gray-50 border-r border-gray-100 flex-shrink-0 p-3 hidden sm:flex flex-col gap-1">
                <div className="flex items-center gap-2 px-2 py-3 mb-2">
                  <div className="w-6 h-6 rounded-md bg-[var(--primary)] flex items-center justify-center">
                    <Layers className="w-3.5 h-3.5 text-white" />
                  </div>
                  <span className="text-sm font-bold text-gray-800">FlowForge</span>
                </div>
                
                {[
                  { name: 'Dashboard', active: false },
                  { name: 'Projects', active: true },
                  { name: 'My Tasks', active: false },
                  { name: 'Calendar', active: false },
                  { name: 'Analytics', active: false }
                ].map((item, i) => (
                  <div 
                    key={i} 
                    className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-sm cursor-default ${
                      item.active ? 'bg-[var(--primary-soft)] text-[var(--primary)] font-medium' : 'text-gray-600 hover:bg-gray-100/50'
                    }`}
                  >
                    <div className={`w-4 h-4 rounded ${item.active ? 'bg-[var(--primary)]/20' : 'bg-gray-200'}`}></div>
                    {item.name}
                  </div>
                ))}
              </div>

              {/* Main Content Area */}
              <div className="flex-1 p-4 flex flex-col min-w-0 bg-white">
                <div className="flex items-center justify-between mb-4 shrink-0">
                  <h2 className="text-lg font-semibold text-gray-800">Projects</h2>
                  <button className="bg-[var(--primary)] text-white text-xs px-2.5 py-1.5 rounded-lg font-medium shadow-sm">
                    + New Project
                  </button>
                </div>

                {/* Kanban Board */}
                <div className="flex gap-3 overflow-hidden flex-1 items-start">
                  {/* Column 1: To Do */}
                  <div className="w-32 lg:w-36 flex-shrink-0 flex flex-col">
                    <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center justify-between px-1">
                      To Do <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">3</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg border border-gray-100 p-2 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-gray-700 leading-tight">Design system audit</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0"></div>
                        </div>
                        <div className="flex justify-end">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-[8px] text-white flex items-center justify-center font-bold">AB</div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-100 p-2 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-gray-700 leading-tight">Homepage copy</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-green-400 mt-1 shrink-0"></div>
                        </div>
                        <div className="flex justify-end">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-blue-400 to-cyan-500 text-[8px] text-white flex items-center justify-center font-bold">JD</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 2: In Progress */}
                  <div className="w-32 lg:w-36 flex-shrink-0 flex flex-col">
                    <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center justify-between px-1">
                      In Progress <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">2</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg border border-gray-100 p-2 shadow-sm ring-1 ring-[var(--primary)]/10">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-gray-700 leading-tight">Hero section animation</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1 shrink-0"></div>
                        </div>
                        <div className="w-full bg-gray-100 h-1 rounded-full mb-2 overflow-hidden">
                          <div className="bg-[var(--primary)] h-full w-[60%] rounded-full"></div>
                        </div>
                        <div className="flex justify-end">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-rose-400 to-orange-500 text-[8px] text-white flex items-center justify-center font-bold">MK</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 3: Review */}
                  <div className="w-32 lg:w-36 flex-shrink-0 flex flex-col">
                    <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center justify-between px-1">
                      Review <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">1</span>
                    </div>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg border border-gray-100 p-2 shadow-sm">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-gray-700 leading-tight">Mobile nav bug fixes</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1 shrink-0"></div>
                        </div>
                        <div className="flex justify-end">
                          <div className="w-4 h-4 rounded-full bg-gradient-to-br from-violet-400 to-indigo-600 text-[8px] text-white flex items-center justify-center font-bold">AB</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Column 4: Done */}
                  <div className="w-32 lg:w-36 flex-shrink-0 flex flex-col hidden md:flex">
                    <div className="text-xs font-semibold text-gray-500 mb-2 flex items-center justify-between px-1">
                      Done <span className="bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded text-[10px]">12</span>
                    </div>
                    <div className="space-y-2 opacity-60">
                      <div className="bg-white rounded-lg border border-gray-100 p-2 shadow-sm line-through decoration-gray-300">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500 leading-tight">Project setup</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1 shrink-0"></div>
                        </div>
                      </div>
                      <div className="bg-white rounded-lg border border-gray-100 p-2 shadow-sm line-through decoration-gray-300">
                        <div className="flex items-start justify-between mb-2">
                          <span className="text-xs font-medium text-gray-500 leading-tight">Initial auth routes</span>
                          <div className="w-1.5 h-1.5 rounded-full bg-gray-300 mt-1 shrink-0"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* KPIs Row */}
                <div className="mt-4 pt-3 border-t border-gray-50 flex items-center gap-3 shrink-0">
                  <div className="rounded-lg bg-gray-50 border border-gray-100 px-2 py-1.5 flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-[10px] font-medium text-gray-600">Tasks Complete 24/30</span>
                  </div>
                  <div className="rounded-lg bg-gray-50 border border-gray-100 px-2 py-1.5 flex items-center gap-2 shadow-sm">
                    <div className="w-2 h-2 rounded-full bg-[var(--primary)]"></div>
                    <span className="text-[10px] font-medium text-gray-600">On Track 85%</span>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
