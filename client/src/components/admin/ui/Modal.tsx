import { useCallback, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { cn } from '@/utils/helpers';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
  size?: ModalSize;
  footer?: React.ReactNode;
}

const SIZE_CLASSES: Record<ModalSize, string> = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
};

const backdropVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.2, ease: 'easeOut' },
  },
  exit: {
    opacity: 0,
    transition: { duration: 0.15, ease: 'easeIn' },
  },
};

const panelVariants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 10,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    scale: 0.97,
    y: 5,
    transition: {
      duration: 0.15,
      ease: 'easeIn',
    },
  },
};

export default function Modal({
  isOpen,
  open,
  onClose,
  title,
  description,
  children,
  size = 'md',
  footer,
}: ModalProps) {
  const showModal = open ?? isOpen ?? false;
  const panelRef = useRef<HTMLDivElement>(null);

  const handleEscape = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    },
    [onClose],
  );

  useEffect(() => {
    if (showModal) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [showModal, handleEscape]);

  useEffect(() => {
    if (showModal && panelRef.current) {
      panelRef.current.focus();
    }
  }, [isOpen]);

  if (typeof document === 'undefined') return null;

  return createPortal(
    <AnimatePresence>
      {showModal && (
        <div className="fixed inset-0 z-[9998] flex items-center justify-center p-4">
          <motion.div
            variants={backdropVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />

          <motion.div
            ref={panelRef}
            variants={panelVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            role="dialog"
            aria-modal="true"
            aria-labelledby={title ? 'modal-title' : undefined}
            tabIndex={-1}
            className={cn(
              'relative z-10 w-full overflow-hidden rounded-2xl',
              'border border-white/[0.08]',
              'glass-heavy',
              SIZE_CLASSES[size],
            )}
          >
            {title && (
              <div className="flex items-start justify-between border-b border-white/[0.06] px-6 py-4">
                <div>
                  <h2
                    id="modal-title"
                    className="text-lg font-semibold text-white"
                  >
                    {title}
                  </h2>
                  {description && (
                    <p className="mt-1 text-sm text-white/40">{description}</p>
                  )}
                </div>
                <button
                  onClick={onClose}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    'text-white/40 transition-colors',
                    'hover:bg-white/[0.06] hover:text-white/70',
                    'focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/50',
                  )}
                  aria-label="Close modal"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}

            {!title && (
              <div className="absolute right-3 top-3 z-10">
                <button
                  onClick={onClose}
                  className={cn(
                    'flex h-8 w-8 shrink-0 items-center justify-center rounded-lg',
                    'text-white/40 transition-colors',
                    'hover:bg-white/[0.06] hover:text-white/70',
                    'focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/50',
                  )}
                  aria-label="Close modal"
                >
                  <FiX className="h-4 w-4" />
                </button>
              </div>
            )}

            <div className="max-h-[70vh] overflow-y-auto px-6 py-4">
              {children}
            </div>

            {footer && (
              <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
                {footer}
              </div>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>,
    document.body,
  );
}