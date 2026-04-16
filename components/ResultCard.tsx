'use client';

import { motion } from 'framer-motion';
import { Certification } from '@/lib/types';

interface ResultCardProps {
  certification: Certification;
  isMain?: boolean;
  isNextStep?: boolean;
  isExpert?: boolean;
  delay?: number;
}

export default function ResultCard({ certification, isMain = false, isNextStep = false, isExpert = false, delay = 0 }: ResultCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95, y: 20 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      transition={{
        duration: 0.4,
        delay: delay,
        ease: [0.4, 0, 0.2, 1],
      }}
      className={isMain ? 'card-main p-6 md:p-10 pixel-corners' : 'card p-5 md:p-8'}
    >
      {(isMain || isNextStep) && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: delay + 0.2 }}
          className="inline-block px-4 py-2 mb-6 border-2 font-bold text-sm tracking-wider"
          style={{
            borderColor: isExpert ? 'var(--secondary)' : 'var(--primary)',
            color: isExpert ? 'var(--secondary)' : 'var(--primary)',
            background: isExpert ? 'rgba(255, 46, 151, 0.1)' : 'rgba(31, 232, 234, 0.1)'
          }}
        >
          {isMain ? '가장 잘 맞는 자격증' :
           isExpert ? 'EXPERT 자격증' :
           'ASSOCIATE 자격증'}
        </motion.div>
      )}

      <div className="mb-6">
        <h3 className={`${isMain ? 'text-3xl md:text-5xl' : 'text-xl md:text-3xl'} mb-3 font-bold`}>
          <span className="gradient-text">{certification.code}</span>
        </h3>
        <p className={`${isMain ? 'text-lg md:text-xl' : 'text-sm md:text-base'} font-mono`} style={{ color: 'var(--text-muted)' }}>
          {certification.name}
        </p>

        {/* 한국어 시험 가능 배지 */}
        {certification.koreanExam && (
          <span className="inline-flex items-center gap-1 px-3 py-1 mt-3 text-xs font-bold rounded"
            style={{
              background: 'var(--surface-soft)',
              color: 'var(--primary)',
              border: '1px solid var(--primary)',
            }}>
            한국어 시험 가능
          </span>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {[
          { label: '난이도', value: '★'.repeat(certification.difficulty) + '☆'.repeat(5 - certification.difficulty) },
          { label: '학습시간', value: certification.studyHours },
          { label: '응시료', value: certification.price },
          { label: '유효기간', value: certification.validity },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.1 + index * 0.05 }}
            className="p-3 md:p-4 relative group transition-all"
            style={{
              background: 'var(--surface-soft)',
              border: '1px solid var(--border)'
            }}
          >
            <div className="flex flex-col gap-1">
              <div className="text-xs font-bold tracking-wider" style={{ color: 'var(--primary)' }}>
                {stat.label}
              </div>
              <div className={`${isMain ? 'text-lg md:text-xl' : 'text-base md:text-lg'} font-bold`} style={{ color: 'var(--foreground)' }}>
                {stat.value}
              </div>
            </div>

            {/* Hover effect */}
            <div className="absolute bottom-0 left-0 right-0 h-0.5 transition-all opacity-0 group-hover:opacity-100"
              style={{ background: 'var(--gradient-cyber)' }} />
          </motion.div>
        ))}
      </div>

      {/* Benefits Section */}
      <div className="mb-6 p-4 relative" style={{
        background: 'var(--surface)',
        border: '1px solid var(--border-light)'
      }}>
        <div className="absolute top-0 left-0 w-full h-1" style={{ background: 'var(--gradient-cyber)' }} />

        <h4 className="text-sm font-bold mb-4 tracking-wider" style={{ color: 'var(--primary)' }}>
          ▶ 이 자격증으로 얻을 수 있는 것
        </h4>
        <ul className="space-y-2.5">
          {certification.benefits.map((benefit, index) => (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: delay + 0.3 + index * 0.05 }}
              className="flex items-start text-xs md:text-sm"
              style={{ color: 'var(--text-muted)' }}
            >
              <span className="mr-3 font-bold" style={{ color: 'var(--primary)' }}>
                [{index + 1}]
              </span>
              <span>{benefit}</span>
            </motion.li>
          ))}
        </ul>
      </div>

      {/* Prerequisites for Expert Certs */}
      {certification.prerequisites && certification.prerequisites.length > 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.35 }}
          className="p-4 mb-6 border-2"
          style={{
            borderColor: 'var(--secondary)',
            background: 'rgba(255, 46, 151, 0.05)',
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg font-bold" style={{ color: 'var(--secondary)' }}>!</span>
            <div>
              <p className="text-sm font-bold mb-1" style={{ color: 'var(--secondary)' }}>
                선행 자격증 권장
              </p>
              <p className="text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>
                {certification.prerequisites.join(' 또는 ')} (필수 아님)
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Urgency Alert */}
      {certification.urgency && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: delay + 0.4 }}
          className="p-4 mb-6 border-2"
          style={{
            borderColor: 'var(--warning)',
            background: 'rgba(255, 184, 0, 0.1)',
          }}
        >
          <div className="flex items-start gap-3">
            <span className="text-lg font-bold" style={{ color: 'var(--warning)' }}>▲</span>
            <div className="flex-1">
              <p className="text-xs md:text-sm font-bold mb-2" style={{ color: 'var(--warning)' }}>
                {certification.urgency}
              </p>
              {certification.urgencyLink && (
                <p className="text-xs md:text-sm" style={{ color: 'var(--text-muted)' }}>
                  이와 관련{' '}
                  <a
                    href={certification.urgencyLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="underline hover:opacity-80 transition-opacity"
                    style={{ color: 'var(--primary)' }}
                  >
                    포스팅
                  </a>
                  {' '}읽기
                </p>
              )}
            </div>
          </div>
        </motion.div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <motion.a
          href={certification.notionUrl}
          target="_blank"
          rel="noopener noreferrer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex-1 text-center font-bold btn-gradient text-sm md:text-base py-3"
        >
          상세 가이드 보기
        </motion.a>
        {certification.mockExamUrl && (
          <motion.a
            href={certification.mockExamUrl}
            target="_blank"
            rel="noopener noreferrer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="btn-secondary text-center text-sm md:text-base py-3"
          >
            모의고사 체험
          </motion.a>
        )}
      </div>
    </motion.div>
  );
}