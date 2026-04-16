'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import ResultCard from '@/components/ResultCard';
import { decodeAnswers } from '@/lib/shareUtils';
import { getRecommendation } from '@/lib/certifications';
import { Recommendation, QuizState } from '@/lib/types';
import { situationDescriptions } from '@/lib/personas';

function ResultContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [result, setResult] = useState<Recommendation | null>(null);
  const [answers, setAnswers] = useState<QuizState | null>(null);
  const [formData, setFormData] = useState({ name: '', phone: '', email: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

  useEffect(() => {
    const encoded = searchParams.get('a');
    if (!encoded) {
      router.push('/');
      return;
    }

    const decodedAnswers = decodeAnswers(encoded);
    if (!decodedAnswers) {
      router.push('/');
      return;
    }

    setAnswers(decodedAnswers);
    const recommendation = getRecommendation(decodedAnswers);
    setResult(recommendation);
  }, [searchParams, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus('idle');

    try {
      const sheetsUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEETS_URL;

      if (!sheetsUrl) {
        throw new Error('Google Sheets URL이 설정되지 않았습니다.');
      }

      const payload = {
        name: formData.name,
        phone: formData.phone,
        email: formData.email,
        certification: result?.main.code || '',
        persona: result?.persona || '',
        track: result?.personaBadge.track || '',
      };

      await fetch(sheetsUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      // no-cors 모드에서는 응답을 받을 수 없으므로 성공으로 간주
      setSubmitStatus('success');
      setFormData({ name: '', phone: '', email: '' });
    } catch (error) {
      console.error('폼 제출 에러:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!result) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
        <div className="w-16 h-16 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 py-8 md:py-12" style={{ background: 'var(--background)' }}>
      {/* Logo - Top Left */}
      <motion.div
        className="absolute top-6 left-6 z-20"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Link href="/">
          <Image
            src="/logo.png"
            alt="이세계길드"
            width={120}
            height={67}
            className="hover:opacity-80 transition-opacity"
          />
        </Link>
      </motion.div>

      <div className="max-w-5xl mx-auto px-4 md:px-0">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-8 md:mb-12"
        >
          {/* Persona Badges */}
          <div className="flex flex-wrap justify-center gap-2 md:gap-3 mb-4 md:mb-6">
            <span className="inline-block px-3 py-1 text-xs md:text-sm font-medium rounded-full"
              style={{
                background: 'var(--surface-soft)',
                color: 'var(--primary)',
                border: '1px solid var(--primary)'
              }}>
              {situationDescriptions[result.personaBadge.situation]}
            </span>
            <span className="inline-block px-3 py-1 text-xs md:text-sm font-medium rounded-full"
              style={{
                background: 'var(--surface-soft)',
                color: 'var(--secondary)',
                border: '1px solid var(--secondary)'
              }}>
              {result.personaBadge.track} 트랙
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold">
            그대는{' '}
            <span className="gradient-text">
              {result.persona}
            </span>
          </h2>
        </motion.div>

        {/* Main Recommendation */}
        <div className="mb-8 md:mb-12">
          <ResultCard certification={result.main} isMain={true} delay={0.15} />
        </div>

        {/* Next Step Recommendations */}
        {(result.nextStep.associate || result.nextStep.expert) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mb-8 md:mb-12"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6" style={{ color: 'var(--foreground)' }}>
              ▶ 다음 단계 자격증
            </h2>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {result.nextStep.associate && (
                <ResultCard
                  certification={result.nextStep.associate}
                  isNextStep={true}
                  delay={0.3}
                />
              )}
              {result.nextStep.expert && (
                <ResultCard
                  certification={result.nextStep.expert}
                  isNextStep={true}
                  isExpert={true}
                  delay={0.45}
                />
              )}
            </div>
          </motion.div>
        )}

        {/* Sub Fundamentals */}
        {result.subFundamentals.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.45 }}
            className="mb-8 md:mb-12"
          >
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4" style={{ color: 'var(--foreground)' }}>
              ▶ 함께 고려해볼 Fundamentals
            </h2>
            <p className="mb-4 md:mb-6 text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>
              그대의 2위 관심 분야입니다 (점수 70% 이상)
            </p>
            <div className="grid md:grid-cols-2 gap-4 md:gap-6">
              {result.subFundamentals.map((cert, index) => (
                <ResultCard
                  key={cert.code}
                  certification={cert}
                  delay={0.45 + (index * 0.15)}
                />
              ))}
            </div>
          </motion.div>
        )}

        {/* Content Hooks */}
        {result.contentHooks.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="card mb-6 md:mb-8 p-5 md:p-8"
          >
            <h3 className="text-lg md:text-xl font-semibold mb-4" style={{ color: 'var(--primary)' }}>
              ▶ 멋진 그대를 위한 추천
            </h3>
            <ul className="space-y-3">
              {result.contentHooks.map((hook, index) => (
                <li key={index} className="flex items-start text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>
                  <span className="mr-3 font-bold" style={{ color: 'var(--primary)' }}>[{index + 1}]</span>
                  <span>{hook}</span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}

        {/* Contact Form Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.75 }}
          className="card mb-6 md:mb-8 p-5 md:p-8"
        >
          <h3 className="text-lg md:text-xl font-semibold mb-3 md:mb-4" style={{ color: 'var(--foreground)' }}>
            정보 남기기
          </h3>
          <p className="mb-6 md:mb-8 text-xs md:text-sm leading-relaxed" style={{ color: 'var(--text-muted)' }}>
            정보를 남겨주시면 이메일로 <span style={{ color: 'var(--primary)' }}>개인 맞춤 로드맵 PDF</span>, <span style={{ color: 'var(--primary)' }}>교안 모듈</span>, 그리고 <span style={{ color: 'var(--primary)' }}>프로모션 정보</span>를 보내드립니다.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                이름
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="이름을 입력해주세요"
                required
                className="w-full px-4 py-3 text-sm border transition-colors focus:outline-none focus:border-primary"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                전화번호
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                placeholder="010-0000-0000"
                required
                className="w-full px-4 py-3 text-sm border transition-colors focus:outline-none focus:border-primary"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                이메일
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="email@example.com"
                required
                className="w-full px-4 py-3 text-sm border transition-colors focus:outline-none focus:border-primary"
                style={{
                  background: 'var(--surface)',
                  borderColor: 'var(--border)',
                  color: 'var(--foreground)'
                }}
              />
            </div>

            {submitStatus === 'success' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-2"
                style={{
                  borderColor: 'var(--primary)',
                  background: 'rgba(31, 232, 234, 0.1)',
                }}
              >
                <p className="text-sm font-semibold text-center" style={{ color: 'var(--primary)' }}>
                  ✓ 정보가 성공적으로 제출되었습니다! 곧 이메일을 확인해주세요.
                </p>
              </motion.div>
            )}

            {submitStatus === 'error' && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 border-2"
                style={{
                  borderColor: 'var(--warning)',
                  background: 'rgba(255, 184, 0, 0.1)',
                }}
              >
                <p className="text-sm font-semibold text-center" style={{ color: 'var(--warning)' }}>
                  제출 중 오류가 발생했습니다. 다시 시도해주세요.
                </p>
              </motion.div>
            )}

            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={!isSubmitting ? { scale: 1.02 } : {}}
              whileTap={!isSubmitting ? { scale: 0.98 } : {}}
              className={`w-full text-sm md:text-base py-3 font-bold ${
                isSubmitting ? 'opacity-50 cursor-not-allowed' : 'btn-gradient'
              }`}
            >
              {isSubmitting ? '제출 중...' : '정보 제출하기'}
            </motion.button>
          </form>
        </motion.div>

        {/* Restart Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.9 }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-block px-6 md:px-8 py-3 font-semibold rounded-lg transition-colors text-sm md:text-base"
            style={{
              background: 'var(--surface-soft)',
              color: 'var(--foreground)',
              border: '1px solid var(--border)'
            }}
          >
            처음부터 다시 하기
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

export default function ResultPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--background)' }}>
          <div className="w-16 h-16 border-t-2 border-b-2 border-primary rounded-full animate-spin"></div>
        </div>
      }
    >
      <ResultContent />
    </Suspense>
  );
}