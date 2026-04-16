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
    <div className="min-h-screen flex flex-col p-4 py-8 md:py-12" style={{ background: 'var(--background)' }}>
      {/* Logo - Top Left */}
      <motion.div
        className="absolute top-4 left-4 md:top-6 md:left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="이세계길드"
            width={100}
            height={56}
            className="hover:opacity-80 transition-opacity md:w-[120px] md:h-[67px]"
          />
        </Link>
      </motion.div>

      {/* Main Content - Centered */}
      <div className="flex-1 flex items-center justify-center px-2 md:px-0">
        <div className="max-w-4xl w-full">
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