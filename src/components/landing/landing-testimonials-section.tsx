"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import {
  FolderKanban,
  CheckSquare,
  Zap,
  Sparkles,
  BarChart2,
  Clock,
} from "lucide-react";

const features = [
  {
    icon: FolderKanban,
    title: "Projects",
    desc: "Organize work into projects with full visibility over every task, milestone, and deliverable.",
  },
  {
    icon: CheckSquare,
    title: "Tasks",
    desc: "Powerful task management with priorities, dependencies, due dates and custom fields.",
  },
  {
    icon: Zap,
    title: "Automation",
    desc: "Set up triggers and actions to eliminate repetitive work and keep projects moving automatically.",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    desc: "Create tasks, summarize progress, and surface insights through natural language.",
  },
  {
    icon: BarChart2,
    title: "Analytics",
    desc: "Real-time dashboards, project health scores and productivity metrics for every team.",
  },
  {
    icon: Clock,
    title: "Time Tracking",
    desc: "Track estimated and actual time per task. Understand where your team's time goes.",
  },
];

export function LandingTestimonialsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
      },
    },
  };

  return (
    <section className="py-24 bg-white" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="text-center max-w-3xl mx-auto">
          <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-900 mb-6 shadow-sm">
            Features
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-4 tracking-tight">
            Every tool your team needs.
          </h2>
          <p className="text-lg text-gray-500">
            From task management to AI-powered insights — FlowForge has you
            covered.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-16"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm hover:shadow-lg hover:border-[var(--primary)]/20 hover:translate-y-[-4px] transition-all duration-300"
            >
              <div className="h-12 w-12 rounded-xl bg-[var(--primary-soft)] flex items-center justify-center mb-4">
                <feature.icon className="text-[var(--primary)] h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {feature.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
