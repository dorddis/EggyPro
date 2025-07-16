'use client';

import { motion, easeInOut } from 'framer-motion';
import { useScrollAnimation } from '@/hooks/use-scroll-animation';
import { ReactNode } from 'react';

interface ScrollAnimationProps {
  children: ReactNode;
  className?: string;
  threshold?: number;
  animation?: 'fade-up' | 'fade-in' | 'slide-left' | 'slide-right' | 'scale-up';
  delay?: number;
}

const animationVariants = {
  'fade-up': {
    initial: { opacity: 0, y: 50 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, ease: easeInOut }
  },
  'fade-in': {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.4, ease: easeInOut }
  },
  'slide-left': {
    initial: { opacity: 0, x: 50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: easeInOut }
  },
  'slide-right': {
    initial: { opacity: 0, x: -50 },
    animate: { opacity: 1, x: 0 },
    transition: { duration: 0.5, ease: easeInOut }
  },
  'scale-up': {
    initial: { opacity: 0, scale: 0.9 },
    animate: { opacity: 1, scale: 1 },
    transition: { duration: 0.4, ease: easeInOut }
  }
};

export function ScrollAnimation({ 
  children, 
  className = '', 
  threshold = 0.1,
  animation = 'fade-up',
  delay = 0
}: ScrollAnimationProps) {
  const { ref, isVisible } = useScrollAnimation(threshold);
  const variant = animationVariants[animation];

  return (
    <motion.div
      ref={ref}
      initial={variant.initial}
      animate={isVisible ? variant.animate : variant.initial}
      transition={{
        ...variant.transition,
        delay: delay
      }}
      className={className}
    >
      {children}
    </motion.div>
  );
} 