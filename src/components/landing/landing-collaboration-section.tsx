"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { MessageSquare, Bell, Paperclip, Activity } from "lucide-react";

export function LandingCollaborationSection() {
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

  const feedContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  };

  const feedItemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 10 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
  };

  const feedItems = [
    { initials: "AH", color: "bg-violet-500", text: "Ahmed completed Landing Page", time: "2m ago" },
    { initials: "SJ", color: "bg-emerald-500", text: "Sara commented on API Integration", time: "15m ago" },
    { initials: "JK", color: "bg-blue-500", text: "John moved Testing to In Progress", time: "1h ago" },
    { initials: "MZ", color: "bg-amber-500", text: "Maria created task Database Schema", time: "2h ago" },
    { initials: "TL", color: "bg-rose-500", text: "Team reached 80% completion", time: "3h ago" },
  ];

  return (
    <section className="py-24 bg-white w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Left Mockup */}
          <div className="flex items-center justify-center">
            <motion.div
              variants={leftVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="rounded-2xl border border-gray-200 shadow-xl bg-white overflow-hidden"
            >
            <div className="px-4 py-3 border-b border-gray-100 text-sm font-semibold text-gray-700 flex items-center gap-2">
              <Activity className="h-4 w-4 text-[var(--primary)]" />
              Activity Feed
            </div>
            <motion.div
              variants={feedContainerVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="flex flex-col"
            >
              {feedItems.map((item, idx) => (
                <motion.div
                  key={idx}
                  variants={feedItemVariants}
                  className="flex gap-3 items-start px-4 py-3 border-b border-gray-50 last:border-0"
                >
                  <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0 ${item.color}`}>
                    {item.initials}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">{item.text}</p>
                    <span className="text-xs text-gray-400">{item.time}</span>
                  </div>
                </motion.div>
              ))}
            </motion.div>
            </motion.div>
          </div>

          {/* Right Text */}
          <motion.div
            variants={rightVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="py-6 lg:py-12"
          >
            <span className="text-xs font-semibold uppercase tracking-wider text-[var(--primary)] bg-[var(--primary-soft)] px-3 py-1 rounded-full">
              Collaboration
            </span>
            <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 mt-4 leading-tight">
              Everyone stays aligned.
            </h2>
            <p className="text-gray-500 mt-4 text-lg max-w-md">
              Comments, mentions, real-time updates, file attachments and activity feeds keep your whole team on the same page.
            </p>
            <ul className="mt-8 space-y-4">
              {[
                { icon: MessageSquare, label: "Threaded comments and @mentions" },
                { icon: Bell, label: "Smart notifications" },
                { icon: Paperclip, label: "File attachments" },
                { icon: Activity, label: "Real-time activity feed" },
              ].map((feature, idx) => (
                <li key={idx} className="flex items-center gap-3">
                  <feature.icon className="text-[var(--primary)] h-5 w-5 flex-shrink-0" />
                  <span className="text-gray-700 font-medium">{feature.label}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
