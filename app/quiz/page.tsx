'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import ProgressBar from '@/components/ProgressBar';
import QuizCard from '@/components/QuizCard';
import { questions } from '@/lib/questions';
import { QuizState } from '@/lib/types';
import { encodeAnswers } from '@/lib/shareUtils';

export default function QuizPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<QuizState>(Array(7).fill(''));

  const currentQuestion = questions[currentStep];
  const isLastQuestion = currentStep === questions.length - 1;

  const handleSelect = (optionId: string) => {
    const newAnswers = [...answers];
    newAnswers[currentStep] = optionId;
    setAnswers(newAnswers);
  };

  const handleNext = () => {
    if (!answers[currentStep]) return;

    if (isLastQuestion) {
      // 마지막 질문이면 결과 페이지로 이동
      const encoded = encodeAnswers(answers);
      router.push(`/result?a=${encoded}`);
    } else {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  return (
    <div className="min-h-screen flex flex-col p-3 py-6 md:py-8" style={{ background: 'var(--background)' }}>
      {/* Logo - Top Left - Smaller size to prevent overlap */}
      <motion.div
        className="absolute top-3 left-3 md:top-4 md:left-4 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="이세계길드"
            width={60}
            height={34}
            className="hover:opacity-80 transition-opacity md:w-[80px] md:h-[45px]"
          />
        </Link>
      </motion.div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-1 md:px-4">
        <div className="max-w-3xl w-full">
          <ProgressBar current={currentStep + 1} total={questions.length} />

          <AnimatePresence mode="wait">
            <QuizCard
              key={currentStep}
              question={currentQuestion}
              selected={answers[currentStep]}
              onSelect={handleSelect}
              onBack={handleBack}
              onNext={handleNext}
              canGoBack={currentStep > 0}
            />
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}