import { useEffect, useState } from 'react';
import { motion, useSpring } from 'framer-motion';
import { FiTrendingUp, FiTrendingDown, FiMinus } from 'react-icons/fi';
import { cn } from '@/utils/helpers';

type StatColor = 'purple' | 'blue' | 'emerald' | 'amber' | 'rose';
type ChangeType = 'up' | 'down' | 'neutral';

interface StatCardProps {
  label: string;
  value: string | number;
  change?: string;
  changeType?: ChangeType;
  icon: React.ComponentType<{ className?: string }>;
  iconColor?: string;
  iconBg?: string;
  color?: StatColor;
}

const COLOR_MAP: Record<StatColor, { border: string; iconBg: string; iconText: string; glow: string }> = {
  purple: {
    border: 'border-l-[#8B5CF6]',
    iconBg: 'bg-[#8B5CF6]/10',
    iconText: 'text-[#8B5CF6]',
    glow: 'bg-[#8B5CF6]/[0.04]',
  },
  blue: {
    border: 'border-l-[#60A5FA]',
    iconBg: 'bg-[#60A5FA]/10',
    iconText: 'text-[#60A5FA]',
    glow: 'bg-[#60A5FA]/[0.04]',
  },
  emerald: {
    border: 'border-l-emerald-400',
    iconBg: 'bg-emerald-400/10',
    iconText: 'text-emerald-400',
    glow: 'bg-emerald-400/[0.04]',
  },
  amber: {
    border: 'border-l-amber-400',
    iconBg: 'bg-amber-400/10',
    iconText: 'text-amber-400',
    glow: 'bg-amber-400/[0.04]',
  },
  rose: {
    border: 'border-l-rose-400',
    iconBg: 'bg-rose-400/10',
    iconText: 'text-rose-400',
    glow: 'bg-rose-400/[0.04]',
  },
};

const CHANGE_STYLES: Record<ChangeType, { bg: string; text: string; Icon: React.ElementType }> = {
  up: { bg: 'bg-emerald-500/10', text: 'text-emerald-400', Icon: FiTrendingUp },
  down: { bg: 'bg-red-500/10', text: 'text-red-400', Icon: FiTrendingDown },
  neutral: { bg: 'bg-white/[0.06]', text: 'text-white/50', Icon: FiMinus },
};

function useAnimatedNumber(target: number | string): string {
  const numericTarget = typeof target === 'number' ? target : parseFloat(String(target));
  const spring = useSpring(0, { duration: 1200, bounce: 0 });
  const [display, setDisplay] = useState('0');

  useEffect(() => {
    if (isNaN(numericTarget)) {
      setDisplay(String(target));
      return;
    }
    spring.set(numericTarget);
    const unsub = spring.on('change', (v) => {
      setDisplay(v.toLocaleString(undefined, { maximumFractionDigits: 1 }));
    });
    return unsub;
  }, [spring, numericTarget, target]);

  if (typeof target === 'string' && isNaN(numericTarget)) return target;
  return display;
}

export default function StatCard({
  label,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor,
  iconBg,
  color = 'purple',
}: StatCardProps) {
  const animatedValue = useAnimatedNumber(value);
  const colors = COLOR_MAP[color];
  const changeStyle = CHANGE_STYLES[changeType];
  const ChangeIcon = changeStyle.Icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ type: 'spring', stiffness: 300, damping: 24 }}
      className={cn(
        'admin-stat-card group relative',
        colors.border,
      )}
    >
      <div
        className={cn(
          'absolute -right-4 -top-4 h-24 w-24 rounded-full blur-2xl transition-all',
          'group-hover:opacity-150',
          colors.glow,
        )}
      />

      <div className="relative flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-xs font-medium uppercase tracking-wider text-white/40">
            {label}
          </p>
          <p className="mt-2 font-variant-numeric tabular-nums text-2xl font-bold tracking-tight text-white/90 sm:text-3xl">
            {animatedValue}
          </p>

          {change && (
            <div className="mt-2 flex items-center gap-1.5">
              <span
                className={cn(
                  'inline-flex items-center gap-0.5 rounded-md px-1.5 py-0.5 text-xs font-medium',
                  changeStyle.bg,
                  changeStyle.text,
                )}
              >
                <ChangeIcon className="h-3 w-3" />
                {change}
              </span>
            </div>
          )}
        </div>

        <div
          className={cn(
            'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
            iconBg ?? colors.iconBg,
            iconColor ?? colors.iconText,
          )}
        >
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </motion.div>
  );
}