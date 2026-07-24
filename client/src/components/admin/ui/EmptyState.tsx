import React from 'react';
import { motion } from 'framer-motion';
import { FiPlus } from 'react-icons/fi';
import { cn } from '@/utils/helpers';

interface EmptyStateProps {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: React.ComponentType<{ className?: string }>;
  };
}

const containerVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
  },
};

export default function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  const ActionIcon = action?.icon;
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/[0.04]">
        <Icon className="h-7 w-7 text-white/30" />
      </div>

      <h3 className="text-base font-semibold text-white/70">{title}</h3>

      {description && (
        <p className="mt-2 max-w-sm text-sm leading-relaxed text-white/35">
          {description}
        </p>
      )}

      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            'mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5',
            'bg-[#8B5CF6] text-sm font-medium text-white transition-all',
            'hover:bg-[#7C3AED] shadow-[0_0_16px_rgba(139,92,246,0.2)]',
            'hover:shadow-[0_0_24px_rgba(139,92,246,0.3)]',
            'focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/40',
          )}
        >
          {ActionIcon ? <ActionIcon className="h-4 w-4" /> : <FiPlus className="h-4 w-4" />}
          {action.label}
        </button>
      )}
    </motion.div>
  );
}