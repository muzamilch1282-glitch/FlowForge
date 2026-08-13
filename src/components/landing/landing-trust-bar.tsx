"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { CalendarDays, CheckSquare, Users, TrendingUp } from "lucide-react";

export function LandingTrustBar() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <section className="py-24 bg-white w-full">
      <div className="max-w-6xl mx-auto px-6 sm:px-8 lg:px-12" ref={ref}>
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="text-center"
        >
          <motion.h2 variants={itemVariants} className="text-3xl sm:text-4xl font-bold text-gray-900">
            Everything your team needs to move work forward.
          </motion.h2>
          <motion.p variants={itemVariants} className="text-gray-500 mt-4 max-w-lg mx-auto">
            One workspace that connects planning, execution, and insight.
          </motion.p>

          <motion.div variants={itemVariants} className="flex flex-wrap justify-center gap-4 mt-12">
            {[
              { icon: CalendarDays, label: "Plan" },
              { icon: CheckSquare, label: "Execute" },
              { icon: Users, label: "Collaborate" },
              { icon: TrendingUp, label: "Optimize" },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-full border border-gray-200 px-6 py-3 flex items-center gap-3 bg-white shadow-sm hover:shadow-md hover:border-[var(--primary)]/30 transition-all duration-300 cursor-default"
              >
                <feature.icon className="text-[var(--primary)] h-5 w-5 flex-shrink-0" />
                <span className="font-semibold text-gray-800 text-sm">{feature.label}</span>
              </div>
            ))}
          </motion.div>

          <motion.div variants={itemVariants} className="mt-16 flex flex-col sm:flex-row gap-8 justify-center text-center">
            {[
              { stat: "10x", label: "faster project setup" },
              { stat: "85%", label: "reduction in missed deadlines" },
              { stat: "3hrs", label: "saved per team member daily" },
            ].map((item, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <span className="text-4xl font-bold text-gray-900">{item.stat}</span>
                <span className="text-sm text-gray-500 mt-1">{item.label}</span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
