'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';

interface ShareButtonsProps {
  shareUrl: string;
}

export default function ShareButtons({ shareUrl }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <div className="flex flex-col sm:flex-row gap-3">
      <motion.button
        onClick={handleCopyLink}
        whileTap={{ scale: 0.98 }}
        className={`flex-1 btn ${copied ? 'btn-primary' : 'btn-secondary'} flex items-center justify-center gap-2`}
      >
        {copied ? (
          <>
            <span className="geo-square"></span>
            <span>복사 완료</span>
          </>
        ) : (
          <>
            <span className="geo-chevron"></span>
            <span>링크 복사</span>
          </>
        )}
      </motion.button>
    </div>
  );
}