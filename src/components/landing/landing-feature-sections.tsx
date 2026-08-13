"use client";

import { useRef } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Zap, Bell, CheckCircle2, ArrowDown } from "lucide-react";

const AUTOMATION_EXAMPLES = [
  {
    trigger: "Task becomes overdue",
    action: "Create notification",
    type: "WHEN",
  },
  {
    trigger: "Task assigned",
    action: "Notify member",
    type: "WHEN",
  },
  {
    trigger: "Task completed",
    action: "Update project progress",
    type: "THEN",
  },
  {
    trigger: "Due date approaching",
    action: "Notify assignee",
    type: "THEN",
  },
];

export function LandingFeatureSections() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const fadeInVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const fadeInRightVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 bg-[#FAFAFA] overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Text */}
          <motion.div
            initial={shouldReduceMotion ? "visible" : "hidden"}
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInVariants}
            className="py-6 lg:py-12"
          >
            <div className="inline-block bg-[var(--primary-soft)] text-[var(--primary)] text-sm font-semibold px-3 py-1 rounded-full mb-6">
              Automation
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Automate the repetitive. Focus on what matters.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Set triggers and actions to keep projects moving without manual effort.
            </p>

            <div className="space-y-4 mt-8">
              {AUTOMATION_EXAMPLES.map((example, idx) => (
                <div
                  key={idx}
                  className="rounded-xl border border-gray-200 bg-white p-4 flex gap-4 items-start shadow-sm"
                >
                  <div className="flex-shrink-0">
                    {example.type === "WHEN" ? (
                      <span className="bg-amber-50 text-amber-700 text-xs font-bold px-2 py-0.5 rounded uppercase">
                        WHEN
                      </span>
                    ) : (
                      <span className="bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-bold px-2 py-0.5 rounded uppercase">
                        THEN
                      </span>
                    )}
                  </div>
                  <div className="flex-1 text-sm text-gray-700 font-medium">
                    {example.type === "WHEN" ? example.trigger : example.action}
                    {example.type === "WHEN" && (
                      <div className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                        <ArrowDown className="w-3 h-3" />
                        THEN {example.action}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Right Diagram */}
          <div className="flex items-center justify-center">
            <motion.div
              initial={shouldReduceMotion ? "visible" : "hidden"}
              animate={isInView ? "visible" : "hidden"}
              variants={fadeInRightVariants}
              className="relative"
            >
            <div className="max-w-xs mx-auto flex flex-col items-center">
              {/* Node 1 */}
              <div className="w-full rounded-2xl bg-amber-50 border border-amber-200 p-4 text-center shadow-sm relative z-10">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center">
                    <Zap className="w-5 h-5 text-amber-600" />
                  </div>
                </div>
                <div className="font-semibold text-sm text-amber-800 mb-1">
                  Task becomes overdue
                </div>
                <div className="text-[10px] uppercase tracking-wider text-amber-500 font-bold">
                  TRIGGER
                </div>
              </div>

              {/* Connector 1 */}
              <div className="h-16 flex items-center justify-center relative -my-1 z-0 w-full">
                <style>
                  {`
                    @keyframes dash {
                      to {
                        stroke-dashoffset: -20;
                      }
                    }
                  `}
                </style>
                <svg width="4" height="64" viewBox="0 0 4 64" fill="none">
                  <line
                    x1="2"
                    y1="0"
                    x2="2"
                    y2="64"
                    stroke="#D1D5DB"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    style={{
                      animation: shouldReduceMotion
                        ? "none"
                        : "dash 2s linear infinite",
                    }}
                  />
                </svg>
              </div>

              {/* Node 2 */}
              <div className="w-full rounded-2xl bg-[var(--primary-soft)] border border-[var(--primary)]/20 p-4 text-center shadow-sm relative z-10">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-[var(--primary)]/10 flex items-center justify-center">
                    <Bell className="w-5 h-5 text-[var(--primary)]" />
                  </div>
                </div>
                <div className="font-semibold text-sm text-[var(--primary)] mb-1">
                  Create notification
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--primary)]/70 font-bold">
                  ACTION
                </div>
              </div>

              {/* Connector 2 */}
              <div className="h-16 flex items-center justify-center relative -my-1 z-0 w-full">
                <svg width="4" height="64" viewBox="0 0 4 64" fill="none">
                  <line
                    x1="2"
                    y1="0"
                    x2="2"
                    y2="64"
                    stroke="#D1D5DB"
                    strokeWidth="2"
                    strokeDasharray="4 4"
                    style={{
                      animation: shouldReduceMotion
                        ? "none"
                        : "dash 2s linear infinite",
                    }}
                  />
                </svg>
              </div>

              {/* Node 3 */}
              <div className="w-full rounded-2xl bg-emerald-50 border border-emerald-200 p-4 text-center shadow-sm relative z-10">
                <div className="flex justify-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                </div>
                <div className="font-semibold text-sm text-emerald-800 mb-1">
                  Team member notified
                </div>
                <div className="text-[10px] uppercase tracking-wider text-emerald-500 font-bold">
                  RESULT
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
