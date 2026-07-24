import { memo } from 'react';
import { cn } from '@/utils/helpers';

interface GlowOrbProps {
  color?: 'purple' | 'blue' | 'mixed';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  style?: React.CSSProperties;
}

const colorMap = {
  purple: {
    bg: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, transparent 70%)',
    border: 'rgba(139,92,246,0.1)',
  },
  blue: {
    bg: 'radial-gradient(circle, rgba(96,165,250,0.12) 0%, transparent 70%)',
    border: 'rgba(96,165,250,0.08)',
  },
  mixed: {
    bg: 'radial-gradient(circle, rgba(139,92,246,0.1) 0%, rgba(96,165,250,0.08) 40%, transparent 70%)',
    border: 'rgba(139,92,246,0.06)',
  },
};

const sizeMap = {
  sm: 'w-32 h-32',
  md: 'w-64 h-64',
  lg: 'w-96 h-96',
  xl: 'w-[500px] h-[500px]',
};

const GlowOrb = memo(function GlowOrb({
  color = 'purple',
  size = 'md',
  className,
  style,
}: GlowOrbProps) {
  return (
    <div
      className={cn(
        'pointer-events-none absolute rounded-full',
        'animate-float-slow',
        sizeMap[size],
        className,
      )}
      style={{
        background: colorMap[color].bg,
        border: `1px solid ${colorMap[color].border}`,
        ...style,
      }}
      aria-hidden="true"
    />
  );
});

export default GlowOrb;