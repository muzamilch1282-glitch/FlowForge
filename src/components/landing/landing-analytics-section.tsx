'use client';

import { useRef, useState, useEffect } from 'react';
import { motion, useInView, useReducedMotion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

const KPI_DATA = [
  { label: 'Total Projects', value: 12, trend: '+2 this week' },
  { label: 'Total Tasks', value: 284, trend: '+18 today' },
  { label: 'Completed', value: 201, trend: '70.8%' },
  { label: 'Overdue', value: 8, trend: '-3 from last week' },
  { label: 'Team Members', value: 6, trend: 'Active now' },
  { label: 'Completion Rate', value: 71, trend: 'On track', isPercent: true },
];

const BAR_DATA = [
  { label: 'To Do', percent: 45, color: 'bg-gray-400' },
  { label: 'In Progress', percent: 65, color: 'bg-[var(--primary)]' },
  { label: 'Review', percent: 30, color: 'bg-amber-500' },
  { label: 'Done', percent: 80, color: 'bg-emerald-500' },
  { label: 'Cancelled', percent: 15, color: 'bg-gray-300' },
];

function AnimatedCounter({ value, inView }: { value: number; inView: boolean }) {
  const [count, setCount] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  useEffect(() => {
    if (shouldReduceMotion) { setCount(value); return; }
    if (!inView) return;
    let current = 0;
    const step = Math.max(1, Math.floor(value / 30));
    const timer = setInterval(() => {
      current += step;
      if (current >= value) { setCount(value); clearInterval(timer); }
      else setCount(current);
    }, 30);
    return () => clearInterval(timer);
  }, [value, inView, shouldReduceMotion]);

  return <>{count}</>;
}

export function LandingAnalyticsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-100px' });
  const shouldReduceMotion = useReducedMotion();

  const container = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
  };
  const item = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const animState = shouldReduceMotion ? 'visible' : isInView ? 'visible' : 'hidden';

  return (
    <section className="py-24 bg-[#FAFAFA] overflow-hidden" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">

        {/* Heading */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-block bg-[var(--primary-soft)] text-[var(--primary)] text-xs font-semibold px-3 py-1 rounded-full mb-5">
            Analytics
          </div>
          <h2 className="text-3xl sm:text-5xl font-bold text-gray-900 leading-tight">
            See the health of your work at a glance.
          </h2>
          <p className="text-gray-500 mt-4 text-lg max-w-xl mx-auto">
            Real-time metrics, project health scores, and team productivity insights.
          </p>
        </div>

        {/* KPI Grid */}
        <motion.div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4"
          variants={container}
          initial={shouldReduceMotion ? 'visible' : 'hidden'}
          animate={animState}
        >
          {KPI_DATA.map((kpi, idx) => (
            <motion.div
              key={idx}
              variants={item}
              className="rounded-2xl bg-white border border-gray-100 p-5 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="text-xs font-medium text-gray-500 mb-2">{kpi.label}</div>
              <div className="text-2xl font-bold text-gray-900 mb-1">
                <AnimatedCounter value={kpi.value} inView={isInView} />
                {kpi.isPercent ? '%' : ''}
              </div>
              <div className="text-xs text-emerald-600 flex items-center gap-1 font-medium">
                <TrendingUp className="h-3 w-3" />
                {kpi.trend}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Bottom Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 mt-12">

          {/* Bar Chart */}
          <motion.div
            variants={item}
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate={animState}
            className="rounded-2xl bg-white border border-gray-100 p-6 shadow-sm"
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-6">Tasks by Status</h3>
            <div className="space-y-4">
              {BAR_DATA.map((bar, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="text-xs text-gray-500 w-24 flex-shrink-0">{bar.label}</div>
                  <div className="flex-1 bg-gray-100 rounded-full h-2.5 overflow-hidden">
                    <motion.div
                      className={'h-full rounded-full ' + bar.color}
                      initial={{ width: shouldReduceMotion ? bar.percent + '%' : '0%' }}
                      animate={isInView ? { width: bar.percent + '%' } : {}}
                      transition={{ duration: 1, ease: 'easeOut', delay: idx * 0.1 }}
                    />
                  </div>
                  <div className="text-xs text-gray-500 w-8 text-right flex-shrink-0">{bar.percent}%</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Project Health */}
          <motion.div
            variants={item}
            initial={shouldReduceMotion ? 'visible' : 'hidden'}
            animate={animState}
          >
            <h3 className="text-sm font-semibold text-gray-700 mb-6">Project Health</h3>
            <div className="grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-white border border-gray-100 p-6 text-center shadow-sm flex flex-col items-center justify-center min-h-[160px]">
                <div className="text-4xl font-bold text-emerald-500 mb-2">
                  <AnimatedCounter value={8} inView={isInView} />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span className="text-xs text-gray-500 font-medium">On Track</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-gray-100 p-6 text-center shadow-sm flex flex-col items-center justify-center min-h-[160px]">
                <div className="text-4xl font-bold text-amber-500 mb-2">
                  <AnimatedCounter value={3} inView={isInView} />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500" />
                  <span className="text-xs text-gray-500 font-medium">At Risk</span>
                </div>
              </div>
              <div className="rounded-2xl bg-white border border-gray-100 p-6 text-center shadow-sm flex flex-col items-center justify-center min-h-[160px]">
                <div className="text-4xl font-bold text-red-500 mb-2">
                  <AnimatedCounter value={1} inView={isInView} />
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-red-500" />
                  <span className="text-xs text-gray-500 font-medium">Delayed</span>
                </div>
              </div>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
