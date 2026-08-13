"use client";

import { motion, useInView, useReducedMotion, Variants } from "framer-motion";
import { useRef } from "react";

export function LandingCtaSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const shouldReduceMotion = useReducedMotion();

  const contentVariants: Variants = {
    hidden: { opacity: 0, y: shouldReduceMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section
      className="py-32 relative overflow-hidden bg-[var(--primary)]"
      ref={ref}
    >
      <style>{`
        @keyframes drift1 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @keyframes drift2 {
          0% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(-30px, 50px) scale(0.9); }
          66% { transform: translate(20px, -20px) scale(1.1); }
          100% { transform: translate(0, 0) scale(1); }
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-drift1, .animate-drift2 {
            animation: none;
          }
        }
        .animate-drift1 {
          animation: drift1 25s infinite ease-in-out;
        }
        .animate-drift2 {
          animation: drift2 30s infinite ease-in-out;
        }
        .pattern-dots {
          background-image: radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px);
          background-size: 24px 24px;
        }
      `}</style>

      {/* Decorative Background Elements */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <div className="absolute inset-0 pattern-dots opacity-30" />
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-white/10 rounded-full blur-3xl animate-drift1 mix-blend-overlay" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-white/5 rounded-full blur-3xl animate-drift2 mix-blend-overlay" />
      </div>

      <div className="relative z-10 max-w-3xl mx-auto px-6 sm:px-8 text-center">
        <motion.div
          variants={contentVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          <h2 className="text-4xl sm:text-5xl font-bold text-white tracking-tight">
            Bring your work together.
          </h2>
          <p className="text-white/70 mt-4 text-lg max-w-xl mx-auto leading-relaxed">
            Plan projects, collaborate with your team, automate repetitive work
            and understand progress from one workspace.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <button className="w-full sm:w-auto bg-white text-[var(--primary)] font-bold px-8 py-4 rounded-full hover:bg-gray-50 active:scale-[0.98] transition-all shadow-lg text-base">
              Start for free
            </button>
            <button className="w-full sm:w-auto border-2 border-white/30 text-white font-semibold px-8 py-4 rounded-full hover:bg-white/10 transition-all text-base">
              Explore FlowForge
            </button>
          </div>
          <p className="text-white/50 text-sm mt-4">
            No credit card required.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
