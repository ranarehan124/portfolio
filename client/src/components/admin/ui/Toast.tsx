import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiX,
  FiCheckCircle,
  FiAlertCircle,
  FiAlertTriangle,
  FiInfo,
} from 'react-icons/fi';
import { cn } from '@/utils/helpers';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: string;
  type: ToastType;
  title: string;
  description?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, 'id'>) => void;
  removeToast: (id: string) => void;
  success: (title: string, description?: string) => void;
  error: (title: string, description?: string) => void;
  warning: (title: string, description?: string) => void;
  info: (title: string, description?: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const TOAST_STYLES: Record<
  ToastType,
  {
    Icon: React.ElementType;
    iconColor: string;
    borderColor: string;
    progressColor: string;
  }
> = {
  success: {
    Icon: FiCheckCircle,
    iconColor: 'text-emerald-400',
    borderColor: 'border-emerald-500/30',
    progressColor: 'bg-emerald-400',
  },
  error: {
    Icon: FiAlertCircle,
    iconColor: 'text-red-400',
    borderColor: 'border-red-500/30',
    progressColor: 'bg-red-400',
  },
  warning: {
    Icon: FiAlertTriangle,
    iconColor: 'text-amber-400',
    borderColor: 'border-amber-500/30',
    progressColor: 'bg-amber-400',
  },
  info: {
    Icon: FiInfo,
    iconColor: 'text-[#60A5FA]',
    borderColor: 'border-[#60A5FA]/30',
    progressColor: 'bg-[#60A5FA]',
  },
};

const DEFAULT_DURATION = 4000;

const toastVariants = {
  initial: {
    opacity: 0,
    y: 20,
    x: 100,
    scale: 0.95,
    filter: 'blur(4px)',
  },
  animate: {
    opacity: 1,
    y: 0,
    x: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 30,
    },
  },
  exit: {
    opacity: 0,
    x: 100,
    scale: 0.95,
    filter: 'blur(4px)',
    transition: { duration: 0.2, ease: 'easeIn' },
  },
};

function ToastItem({
  toast,
  onRemove,
}: {
  toast: Toast;
  onRemove: (id: string) => void;
}) {
  const style = TOAST_STYLES[toast.type];
  const { Icon } = style;
  const duration = toast.duration ?? DEFAULT_DURATION;

  return (
    <motion.div
      layout
      variants={toastVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className={cn('admin-toast', style.borderColor)}
    >
      <div className={cn('mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center', style.iconColor)}>
        <Icon className="h-5 w-5" />
      </div>

      <div className="min-w-0 flex-1">
        <p className="text-sm font-medium text-white/95">{toast.title}</p>
        {toast.description && (
          <p className="mt-1 text-xs leading-relaxed text-white/50">
            {toast.description}
          </p>
        )}
      </div>

      <button
        onClick={() => onRemove(toast.id)}
        className={cn(
          'shrink-0 rounded-md p-1 text-white/30 transition-colors',
          'hover:bg-white/[0.06] hover:text-white/60',
          'focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/50',
        )}
      >
        <FiX className="h-3.5 w-3.5" />
      </button>

      <motion.div
        className={cn('absolute bottom-0 left-0 h-0.5', style.progressColor)}
        initial={{ width: '100%' }}
        animate={{ width: '0%' }}
        transition={{ duration: duration / 1000, ease: 'linear' }}
        onAnimationComplete={() => onRemove(toast.id)}
      />
    </motion.div>
  );
}

function ToastContainer({
  toasts,
  onRemove,
}: {
  toasts: Toast[];
  onRemove: (id: string) => void;
}) {
  if (typeof document === 'undefined') return null;

  return createPortal(
    <div
      aria-live="polite"
      aria-label="Notifications"
      className="admin-toast-container"
    >
      <AnimatePresence mode="popLayout" initial={false}>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={onRemove} />
        ))}
      </AnimatePresence>
    </div>,
    document.body,
  );
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(
    (toast: Omit<Toast, 'id'>) => {
      const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      const newToast: Toast = { id, duration: DEFAULT_DURATION, ...toast };
      setToasts((prev) => [...prev, newToast]);
    },
    [],
  );

  const success = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'success', title, description }),
    [addToast],
  );

  const error = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'error', title, description }),
    [addToast],
  );

  const info = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'info', title, description }),
    [addToast],
  );

  const warning = useCallback(
    (title: string, description?: string) =>
      addToast({ type: 'warning', title, description }),
    [addToast],
  );

  const value = useMemo<ToastContextValue>(
    () => ({
      toasts,
      addToast,
      removeToast,
      success,
      error,
      info,
      warning,
    }),
    [toasts, addToast, removeToast, success, error, info, warning],
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast(): ToastContextValue {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}

export type { ToastType, Toast };