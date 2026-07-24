import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';

interface ToggleFieldProps {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export default function ToggleField({
  label,
  description,
  checked,
  onChange,
  disabled = false,
}: ToggleFieldProps) {
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

  return (
    <div className="flex items-start gap-3">
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        disabled={disabled}
        onClick={handleToggle}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative inline-flex h-6 w-11 shrink-0 items-center rounded-full p-0.5 transition-colors duration-200',
          'focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30 focus:ring-offset-1 focus:ring-offset-[#050505]',
          checked
            ? 'bg-[#8B5CF6] shadow-[0_0_12px_rgba(139,92,246,0.3)]'
            : 'bg-white/[0.08]',
          disabled && 'cursor-not-allowed opacity-50',
        )}
      >
        <motion.span
          layout
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className={cn(
            'inline-block h-[18px] w-[18px] rounded-full bg-white shadow-sm',
            checked ? 'translate-x-5' : 'translate-x-0',
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