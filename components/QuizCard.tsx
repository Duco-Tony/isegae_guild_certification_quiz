'use client';

import { motion } from 'framer-motion';
import { Question } from '@/lib/types';

interface QuizCardProps {
  question: Question;
  selected: string | null;
  onSelect: (optionId: string) => void;
  onBack?: () => void;
  onNext: () => void;
  canGoBack: boolean;
}

export default function QuizCard({
  question,
  selected,
  onSelect,
  onBack,
  onNext,
  canGoBack,
}: QuizCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className="w-full max-w-3xl mx-auto"
    >
      <div className="card p-4 md:p-8 cyber-border">
        {/* Question Header */}
        <div className="mb-4 md:mb-6">
          <div className="inline-block px-2 py-0.5 mb-2 md:mb-3 border border-primary text-xs md:text-sm font-bold tracking-wider" style={{ color: 'var(--primary)' }}>
            질문 #{question.id.replace('q', '')}
          </div>
          <h2 className="text-lg md:text-2xl font-bold mb-2 md:mb-3 leading-tight" style={{ color: 'var(--foreground)' }}>
            {question.text}
          </h2>
        </div>

        {/* Options with proper spacing and labels */}
        <div className="space-y-2 md:space-y-2.5 mb-6 md:mb-8">
          {question.options.map((option, index) => {
            const isSelected = selected === option.id;

            return (
              <motion.button
                key={option.id}
                onClick={() => onSelect(option.id)}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                whileHover={{ x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={`option-card ${isSelected ? 'selected' : ''}`}
              >
                {/* Option letter badge */}
                <span className="option-label">
                  {String.fromCharCode(65 + index)}
                </span>

                {/* Option text */}
                <span className="text-sm md:text-base flex-1 text-left">
                  {option.text}
                </span>
              </motion.button>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex gap-3 md:gap-4">
          {canGoBack && onBack && (
            <motion.button
              onClick={onBack}
              whileHover={{ x: -4 }}
              whileTap={{ scale: 0.95 }}
              className="btn-secondary text-sm md:text-base"
            >
              &lt; 이전
            </motion.button>
          )}
          <motion.button
            onClick={onNext}
            disabled={!selected}
            whileHover={selected ? { scale: 1.02 } : {}}
            whileTap={selected ? { scale: 0.98 } : {}}
            className={`flex-1 text-sm md:text-base ${
              selected
                ? 'btn-gradient'
                : 'btn-secondary opacity-50 cursor-not-allowed'
            }`}
          >
            {selected ? '다음 >' : '답변을 선택해주세요'}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}