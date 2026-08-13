"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useInView, useReducedMotion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function LandingAiSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(sectionRef, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const [chatState, setChatState] = useState<"initial" | "typing" | "response">(
    shouldReduceMotion ? "response" : "initial"
  );

  useEffect(() => {
    if (!isInView || shouldReduceMotion) return;

    const typeTimeout = setTimeout(() => {
      setChatState("typing");
    }, 500);

    const responseTimeout = setTimeout(() => {
      setChatState("response");
    }, 1300); // 0.8s after typing starts

    return () => {
      clearTimeout(typeTimeout);
      clearTimeout(responseTimeout);
    };
  }, [isInView, shouldReduceMotion]);

  const chips = [
    "Create tasks",
    "Summarize projects",
    "Analyze overdue",
    "Priority suggestions",
  ];

  const fadeInVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const fadeLeftVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  return (
    <section className="py-24 bg-white overflow-hidden" ref={sectionRef}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left AI Chat Mockup */}
          <div className="flex items-center justify-center">
            <motion.div
              initial={shouldReduceMotion ? "visible" : "hidden"}
              animate={isInView ? "visible" : "hidden"}
              variants={fadeLeftVariants}
              className="w-full"
            >
            <div className="rounded-2xl border border-gray-200 shadow-xl bg-white overflow-hidden max-w-sm mx-auto">
              {/* Header */}
              <div className="px-4 py-3 bg-gray-50 border-b border-gray-100 flex items-center gap-2">
                <Sparkles className="text-[var(--primary)] h-4 w-4" />
                <span className="text-sm font-semibold text-gray-800">
                  FlowForge AI
                </span>
                <span className="h-2 w-2 rounded-full bg-emerald-500 ml-auto"></span>
              </div>

              {/* Chat Body */}
              <div className="p-4 space-y-4 min-h-[220px]">
                {/* User Message */}
                <div className="bg-[var(--primary)] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-[80%] ml-auto shadow-sm">
                  Create a high priority task called Landing Page and assign it
                  to Ahmed.
                </div>

                {/* Typing Indicator */}
                {chatState === "typing" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 max-w-fit flex gap-1 items-center h-10"
                  >
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.2,
                      }}
                    />
                    <motion.div
                      className="w-2 h-2 bg-gray-400 rounded-full"
                      animate={{ y: [0, -5, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Infinity,
                        delay: 0.4,
                      }}
                    />
                  </motion.div>
                )}

                {/* AI Response */}
                {chatState === "response" && (
                  <motion.div
                    initial={shouldReduceMotion ? false : { opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-gray-50 border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-3 text-sm max-w-[85%] shadow-sm"
                  >
                    <div className="text-emerald-600 font-semibold mb-2">
                      Task created successfully!
                    </div>
                    <div className="space-y-1">
                      <div className="text-red-600 font-medium text-xs">
                        Priority: High
                      </div>
                      <div className="text-gray-600 text-xs">
                        Assigned to: Ahmed
                      </div>
                      <div className="text-gray-400 text-xs">
                        Due date: Not set
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            </div>
            </motion.div>
          </div>

          {/* Right Text */}
          <motion.div
            initial={shouldReduceMotion ? "visible" : "hidden"}
            animate={isInView ? "visible" : "hidden"}
            variants={fadeInVariants}
            className="py-6 lg:py-12"
          >
            <div className="inline-block bg-[var(--primary-soft)] text-[var(--primary)] text-sm font-semibold px-3 py-1 rounded-full mb-6">
              AI Assistant
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4">
              Your project assistant, built into your workflow.
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              Ask FlowForge AI to create tasks, summarize progress, surface
              overdue work, or suggest priorities — all in natural language.
            </p>

            <div className="flex flex-wrap gap-2 mt-6">
              {chips.map((chip, idx) => (
                <span
                  key={idx}
                  className="text-xs font-medium bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full border border-gray-200"
                >
                  {chip}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
