"use client";

import { motion, useInView, useReducedMotion } from "framer-motion";
import { useRef } from "react";
import { Users } from "lucide-react";

const teamMembers = [
  {
    name: "Ahmed",
    role: "Designer",
    tasks: 8,
    progress: "85%",
    gradient: "from-violet-500 to-indigo-600",
    initials: "AH",
  },
  {
    name: "Sara",
    role: "Developer",
    tasks: 5,
    progress: "60%",
    gradient: "from-emerald-500 to-teal-600",
    initials: "SA",
  },
  {
    name: "John",
    role: "PM",
    tasks: 3,
    progress: "40%",
    gradient: "from-blue-500 to-cyan-600",
    initials: "JO",
  },
  {
    name: "Maria",
    role: "QA",
    tasks: 6,
    progress: "75%",
    gradient: "from-rose-500 to-pink-600",
    initials: "MA",
  },
  {
    name: "Tom",
    role: "DevOps",
    tasks: 4,
    progress: "55%",
    gradient: "from-amber-500 to-orange-600",
    initials: "TO",
  },
];

export function LandingValueSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const textVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : -30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6 } },
  };

  const mockupVariants = {
    hidden: { opacity: 0, x: shouldReduceMotion ? 0 : 30 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.6, delay: 0.2 } },
  };

  return (
    <section className="py-24 bg-[#FAFAFA] overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24 items-center">
          {/* Text Left */}
          <motion.div
            variants={textVariants}
            initial="hidden"
            animate={isInView ? "visible" : "hidden"}
            className="py-6 lg:py-12"
          >
            <div className="inline-flex items-center rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-medium text-gray-900 mb-6 shadow-sm">
              Team Productivity
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-6 tracking-tight">
              Your whole team, in sync.
            </h2>
            <p className="text-lg text-gray-500 mb-10">
              See who's working on what, track workload and celebrate progress —
              all in real time.
            </p>

            <div className="grid grid-cols-3 gap-4 mt-10">
              <div className="rounded-xl bg-white border border-gray-100 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">6</div>
                <div className="text-xs text-gray-500 mt-1">Active members</div>
              </div>
              <div className="rounded-xl bg-white border border-gray-100 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">94%</div>
                <div className="text-xs text-gray-500 mt-1">
                  On-time delivery
                </div>
              </div>
              <div className="rounded-xl bg-white border border-gray-100 p-4 text-center shadow-sm">
                <div className="text-2xl font-bold text-gray-900">2.4x</div>
                <div className="text-xs text-gray-500 mt-1">
                  Productivity gain
                </div>
              </div>
            </div>
          </motion.div>

          {/* Mockup Right */}
          <div className="flex items-center justify-center">
            <motion.div
              variants={mockupVariants}
              initial="hidden"
              animate={isInView ? "visible" : "hidden"}
              className="w-full"
            >
            <div className="rounded-2xl border border-gray-100 bg-white shadow-xl overflow-hidden max-w-sm mx-auto lg:mx-0 lg:ml-auto">
              <div className="px-4 py-3 border-b border-gray-100 text-sm font-semibold text-gray-700 flex items-center justify-between bg-white">
                <span>Team Workload</span>
                <Users className="h-4 w-4 text-gray-400" />
              </div>
              <div className="flex flex-col">
                {teamMembers.map((member, i) => (
                  <div
                    key={i}
                    className="px-4 py-3 border-b border-gray-50 last:border-0 flex items-center gap-3 bg-white"
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${member.gradient}`}
                    >
                      {member.initials}
                    </div>
                    <div>
                      <div className="text-sm font-medium text-gray-800">
                        {member.name}
                      </div>
                      <div className="text-xs text-gray-400">
                        {member.role}
                      </div>
                    </div>
                    <div className="ml-auto flex items-center">
                      <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden flex">
                        <div
                          className="bg-[var(--primary)] h-full rounded-full"
                          style={{ width: member.progress }}
                        />
                      </div>
                      <span className="text-xs font-medium text-gray-500 ml-2 w-12 text-right">
                        {member.tasks} tasks
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
