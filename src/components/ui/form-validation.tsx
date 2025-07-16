'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FormValidationProps {
  isValid?: boolean;
  isInvalid?: boolean;
  message?: string;
  className?: string;
  show?: boolean;
}

export function FormValidation({ 
  isValid, 
  isInvalid, 
  message, 
  className = '',
  show = false 
}: FormValidationProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (show) {
      setIsVisible(true);
    } else {
      const timer = setTimeout(() => setIsVisible(false), 300);
      return () => clearTimeout(timer);
    }
  }, [show]);

  if (!isValid && !isInvalid) return null;

  const getIcon = () => {
    if (isValid) return <CheckCircle className="h-4 w-4 text-green-500" />;
    if (isInvalid) return <XCircle className="h-4 w-4 text-red-500" />;
    return <AlertCircle className="h-4 w-4 text-yellow-500" />;
  };

  const getColor = () => {
    if (isValid) return 'text-green-600 bg-green-50 border-green-200';
    if (isInvalid) return 'text-red-600 bg-red-50 border-red-200';
    return 'text-yellow-600 bg-yellow-50 border-yellow-200';
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
          className={cn(
            'flex items-center gap-2 px-3 py-2 rounded-md border text-sm font-medium',
            getColor(),
            className
          )}
        >
          {getIcon()}
          <span>{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface InputValidationProps {
  children: React.ReactNode;
  isValid?: boolean;
  isInvalid?: boolean;
  message?: string;
  show?: boolean;
}

export function InputValidation({ 
  children, 
  isValid, 
  isInvalid, 
  message, 
  show 
}: InputValidationProps) {
  return (
    <div className="space-y-2">
      {children}
      <FormValidation
        isValid={isValid}
        isInvalid={isInvalid}
        message={message}
        show={show}
      />
    </div>
  );
} 