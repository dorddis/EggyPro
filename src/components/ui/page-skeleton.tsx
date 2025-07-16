'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface PageSkeletonProps {
  children: React.ReactNode;
  isLoading?: boolean;
  skeleton?: React.ReactNode;
}

const PageSkeleton: React.FC<PageSkeletonProps> = ({
  children,
  isLoading = false,
  skeleton
}) => {
  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <motion.div
          key="skeleton"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
        >
          {skeleton}
        </motion.div>
      ) : (
        <motion.div
          key="content"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export { PageSkeleton }; 