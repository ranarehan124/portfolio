import Modal from './Modal';
import { cn } from '@/utils/helpers';
import { FiAlertTriangle, FiHelpCircle } from 'react-icons/fi';

type ConfirmVariant = 'danger' | 'primary';

interface ConfirmDialogProps {
  isOpen?: boolean;
  open?: boolean;
  onClose: () => void;
  onConfirm: () => void | Promise<void>;
  title: string;
  message?: string;
  description?: string;
  confirmText?: string;
  confirmLabel?: string;
  variant?: ConfirmVariant;
  destructive?: boolean;
  loading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  open,
  onClose,
  onConfirm,
  title,
  message,
  description,
  confirmText = 'Confirm',
  confirmLabel,
  variant = 'primary',
  destructive,
  loading = false,
}: ConfirmDialogProps) {
  const showModal = open ?? isOpen ?? false;
  const displayMessage = description ?? message ?? '';
  const displayConfirmText = confirmLabel ?? confirmText;
  const resolvedVariant = destructive ? 'danger' : variant;

  const handleConfirm = async () => {
    await onConfirm();
  };

  const isDanger = resolvedVariant === 'danger';

  return (
    <Modal
      isOpen={showModal}
      onClose={loading ? () => {} : onClose}
      size="sm"
    >
      <div className="flex flex-col items-center py-4 text-center">
        <div
          className={cn(
            'mb-4 flex h-14 w-14 items-center justify-center rounded-2xl',
            isDanger ? 'bg-red-500/10 text-red-400' : 'bg-[#8B5CF6]/10 text-[#8B5CF6]',
          )}
        >
          {isDanger ? (
            <FiAlertTriangle className="h-7 w-7" />
          ) : (
            <FiHelpCircle className="h-7 w-7" />
          )}
        </div>

        <h3 className="text-lg font-semibold text-white">{title}</h3>
        <p className="mt-2 max-w-xs text-sm leading-relaxed text-white/50">
          {displayMessage}
        </p>
      </div>

      <div className="flex items-center justify-end gap-3 border-t border-white/[0.06] px-6 py-4">
        <button
          onClick={onClose}
          disabled={loading}
          className={cn(
            'rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2',
            'text-sm font-medium text-white/70 transition-colors',
            'hover:bg-white/[0.08] hover:text-white/90',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'focus:outline-none focus:ring-2 focus:ring-white/10',
          )}
        >
          Cancel
        </button>
        <button
          onClick={handleConfirm}
          disabled={loading}
          className={cn(
            'rounded-lg px-4 py-2 text-sm font-medium text-white transition-all',
            'disabled:cursor-not-allowed disabled:opacity-50',
            'focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-[#050505]',
            isDanger
              ? 'bg-red-600 hover:bg-red-500 focus:ring-red-500/50 shadow-[0_0_16px_rgba(239,68,68,0.2)]'
              : 'bg-[#8B5CF6] hover:bg-[#7C3AED] focus:ring-[#8B5CF6]/50 shadow-[0_0_16px_rgba(139,92,246,0.2)]',
          )}
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Processing...
            </span>
          ) : (
            displayConfirmText
          )}
        </button>
      </div>
    </Modal>
  );
}