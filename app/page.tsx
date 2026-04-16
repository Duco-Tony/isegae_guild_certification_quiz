'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden" style={{ background: 'var(--background)' }}>
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
            width={120}
            height={67}
            className="hover:opacity-80 transition-opacity md:w-[160px] md:h-[89px]"
            priority
          />
        </Link>
      </motion.div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Main Hero Section */}
        <motion.div
          className="text-center mb-20"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <motion.h1
            className="mb-8 md:mb-12 neon-glow leading-tight text-4xl md:text-6xl"
            style={{ color: 'var(--foreground)' }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <span className="gradient-text">내가 따야할</span>
            <br />
            <span className="gradient-text">자격증은?</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-2xl mb-10 md:mb-12"
            style={{ color: 'var(--text-muted)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            내 진로와 성향에 맞는 <br className="md:hidden" />
            <span style={{ color: 'var(--primary)' }}>국제 자격증</span> 찾기
          </motion.p>

          {/* CTA Button */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.6 }}
            className="mb-16 md:mb-20"
          >
            <Link href="/quiz" className="btn-gradient inline-block">
              시작하기 →
            </Link>
          </motion.div>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-center p-3 md:p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--primary)' }}>3분</div>
            <div className="text-xs md:text-sm" style={{ color: 'var(--text-subtle)' }}>소요시간</div>
          </div>
          <div className="text-center p-3 md:p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--primary)' }}>7개</div>
            <div className="text-xs md:text-sm" style={{ color: 'var(--text-subtle)' }}>질문</div>
          </div>
          <div className="text-center p-3 md:p-4" style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <div className="text-xl md:text-2xl font-bold" style={{ color: 'var(--primary)' }}>21종</div>
            <div className="text-xs md:text-sm" style={{ color: 'var(--text-subtle)' }}>자격증</div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}