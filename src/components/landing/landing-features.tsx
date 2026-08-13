"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { CheckCircle2, ArrowRight } from "lucide-react";
import Link from "next/link";

export function LandingFeatures() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const leftVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const rightVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 bg-[#FAFAFA] w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Text */}
          <motion.div
            variants={leftVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="py-6 lg:py-12"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-soft)] px-3 py-1 rounded-full">
              Project Management
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mt-4 leading-tight whitespace-pre-line">
              {"Manage projects\nyour way."}
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-md">
              Every view you need. Kanban, Calendar, Timeline, Dependencies and Gantt — all in one place.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Drag-and-drop Kanban boards",
                "Timeline and Gantt views",
                "Task dependencies and priorities",
                "Due dates and time tracking",
                "Custom fields and filters",
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <CheckCircle2 className="text-[var(--primary)] h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature}</span>
                </li>
              ))}
            </ul>
            <Link
              href="/features"
              className="text-[var(--primary)] font-semibold mt-8 inline-flex items-center gap-1 hover:gap-2 transition-all"
            >
              See all features <ArrowRight className="h-4 w-4" />
            </Link>
          </motion.div>

          {/* Right Mockup */}
          <div className="flex items-center justify-center">
            <motion.div
              variants={rightVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="rounded-2xl border border-gray-200 shadow-xl bg-white overflow-hidden p-4 select-none"
            >
            <div className="grid grid-cols-3 gap-3 min-w-[500px]">
              {/* Backlog */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Backlog</h3>
                <div className="bg-white border border-gray-100 border-l-4 border-l-red-500 rounded-xl p-3 mb-2 shadow-sm">
                  <p className="text-sm font-medium text-gray-800 mb-2">Auth Integration</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600">High</span>
                    <span className="text-[10px] text-gray-400">Oct 12</span>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 border-l-4 border-l-amber-500 rounded-xl p-3 mb-2 shadow-sm">
                  <p className="text-sm font-medium text-gray-800 mb-2">Landing Page Hero</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">Medium</span>
                    <span className="text-[10px] text-gray-400">Oct 15</span>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 border-l-4 border-l-gray-300 rounded-xl p-3 mb-2 shadow-sm">
                  <p className="text-sm font-medium text-gray-800 mb-2">Update Docs</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Low</span>
                    <span className="text-[10px] text-gray-400">Oct 20</span>
                  </div>
                </div>
              </div>

              {/* In Progress */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">In Progress</h3>
                <div className="bg-white border border-gray-100 border-l-4 border-l-amber-500 rounded-xl p-3 mb-2 shadow-sm">
                  <p className="text-sm font-medium text-gray-800 mb-2">API Route Setup</p>
                  <div className="w-full bg-gray-100 h-1.5 rounded-full mb-2">
                    <div className="bg-[var(--primary)] h-1.5 rounded-full w-[60%]"></div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">Medium</span>
                    <div className="h-5 w-5 rounded-full bg-blue-500 text-[10px] text-white flex items-center justify-center font-bold">AH</div>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 border-l-4 border-l-red-500 rounded-xl p-3 mb-2 shadow-sm">
                  <p className="text-sm font-medium text-gray-800 mb-2">DB Migration</p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-red-600">High</span>
                    <div className="h-5 w-5 rounded-full bg-emerald-500 text-[10px] text-white flex items-center justify-center font-bold">SJ</div>
                  </div>
                </div>
              </div>

              {/* Done */}
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Done</h3>
                <div className="bg-white border border-gray-100 border-l-4 border-l-emerald-500 rounded-xl p-3 mb-2 shadow-sm opacity-60">
                  <p className="text-sm font-medium text-gray-800 mb-2 line-through">Setup Repo</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gray-100 text-gray-500">Low</span>
                    <span className="text-[10px] text-gray-400">Oct 1</span>
                  </div>
                </div>
                <div className="bg-white border border-gray-100 border-l-4 border-l-amber-500 rounded-xl p-3 mb-2 shadow-sm opacity-60">
                  <p className="text-sm font-medium text-gray-800 mb-2 line-through">Wireframes</p>
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-amber-50 text-amber-600">Medium</span>
                    <span className="text-[10px] text-gray-400">Oct 5</span>
                  </div>
                </div>
              </div>
            </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
