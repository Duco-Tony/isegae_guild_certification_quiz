'use client';

import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
}

export default function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = (current / total) * 100;

  return (
    <div className="w-full mb-4 md:mb-6">
      <div className="flex justify-between items-center mb-2 md:mb-3">
        <div className="flex items-center gap-2 md:gap-3">
          <span className="text-xs md:text-sm font-bold tracking-widest border border-primary px-2 py-1" style={{ color: 'var(--primary)' }}>
            진행률
          </span>
          <span className="text-xs md:text-sm font-mono" style={{ color: 'var(--text-muted)' }}>
            [{percentage.toFixed(0)}%]
          </span>
        </div>
        <div className="text-lg md:text-xl font-bold font-mono" style={{ color: 'var(--foreground)' }}>
          <span className="gradient-text">{current}</span>
          <span style={{ color: 'var(--text-subtle)' }}>/</span>
          {total}
        </div>
      </div>

      <div className="progress-bar">
        <motion.div
          className="progress-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.6, ease: "easeOut" }}
        />
      </div>

      {/* Step indicators */}
      <div className="flex justify-between mt-2">
        {Array.from({ length: total }, (_, i) => (
          <div
            key={i}
            className="w-2 h-2 transition-all duration-300"
            style={{
              background: i < current ? 'var(--primary)' : 'var(--border)',
              boxShadow: i < current ? '0 0 8px rgba(31, 232, 234, 0.6)' : 'none',
            }}
          />
        ))}
      </div>
    </div>
  );
}