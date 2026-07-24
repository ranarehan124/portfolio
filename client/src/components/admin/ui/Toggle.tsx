'use client';

import React, { useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface ToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  description?: string;
  disabled?: boolean;
  size?: 'sm' | 'md';
  className?: string;
  id?: string;
}

export function Toggle({
  checked,
  onChange,
  label,
  description,
  disabled = false,
  size = 'md',
  className,
  id,
}: ToggleProps) {
  const handleToggle = useCallback(() => {
    if (!disabled) onChange(!checked);
  }, [disabled, onChange, checked]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        handleToggle();
      }
    },
    [handleToggle],
  );

  const trackSize = size === 'sm' ? 'h-5 w-9' : 'h-6 w-11';
  const thumbSize = size === 'sm' ? 'h-3.5 w-3.5' : 'h-4.5 w-4.5';
  const thumbTranslate = size === 'sm' ? 'translate-x-4' : 'translate-x-5';

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <button
        id={id}
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex shrink-0 items-center rounded-full p-0.5 transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-1 focus:ring-offset-[#050505]',
          trackSize,
          checked
            ? 'bg-primary shadow-[0_0_12px_rgba(139,92,246,0.3)]'
            : 'bg-white/[0.08]',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <motion.span
          layout
          transition={{
            type: 'spring',
            stiffness: 500,
            damping: 30,
          }}
          className={cn(
            'inline-block rounded-full bg-white shadow-sm',
            thumbSize,
            checked ? thumbTranslate : 'translate-x-0',
          )}
        />
      </button>

      {(label || description) && (
        <div className="min-w-0 flex-1 pt-0.5">
          {label && (
            <p className="text-sm font-medium text-white/80">{label}</p>
          )}
          {description && (
            <p className="mt-0.5 text-xs text-white/40">{description}</p>
          )}
        </div>
      )}
    </div>
  );
}