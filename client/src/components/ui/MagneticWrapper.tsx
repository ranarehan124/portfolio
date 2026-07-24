import { type ReactNode } from 'react';
import { motion } from 'framer-motion';
import { useMagnetic } from '@/hooks';
import { cn } from '@/utils/helpers';

interface MagneticWrapperProps {
  children: ReactNode;
  strength?: number;
  radius?: number;
  className?: string;
}

function MagneticWrapper({
  children,
  strength = 0.3,
  radius = 200,
  className,
}: MagneticWrapperProps) {
  const magnetic = useMagnetic({ strength, radius });

  return (
    <motion.div
      ref={magnetic.ref as React.RefObject<HTMLDivElement>}
      className={cn('inline-block', className)}
      onMouseMove={magnetic.onMouseMove}
      onMouseLeave={magnetic.onMouseLeave}
    >
      {children}
    </motion.div>
  );
}

export default MagneticWrapper;