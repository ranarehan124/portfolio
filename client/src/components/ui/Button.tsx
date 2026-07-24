import { forwardRef } from 'react';
import { motion, type HTMLMotionProps } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { useMagnetic } from '@/hooks';
import { springTransition } from '@/animations';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'premium';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps extends Omit<HTMLMotionProps<'a'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  magnetic?: boolean;
  href?: string;
  children: React.ReactNode;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  glow?: boolean;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-primary text-white border border-primary/50 shadow-glow-purple hover:shadow-[0_0_60px_rgba(139,92,246,0.5)]',
  secondary:
    'bg-white/5 text-white border border-white/10 hover:bg-white/10 hover:border-white/20',
  outline:
    'bg-transparent text-primary border border-primary/40 hover:bg-primary/10 hover:border-primary/60',
  ghost:
    'bg-transparent text-white/70 border border-transparent hover:text-white hover:bg-white/5',
  premium:
    'bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 text-black border border-amber-300/50 font-semibold tracking-wide shadow-[0_0_25px_rgba(251,191,36,0.35)] hover:shadow-[0_0_45px_rgba(251,191,36,0.6)] hover:scale-[1.02]',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-4 py-2 text-sm gap-1.5 rounded-lg',
  md: 'px-6 py-3 text-sm gap-2 rounded-xl',
  lg: 'px-8 py-4 text-base gap-2.5 rounded-xl',
};

const Button = forwardRef<HTMLAnchorElement, ButtonProps>(
  function Button(
    {
      variant = 'primary',
      size = 'md',
      magnetic = true,
      href,
      children,
      icon,
      iconPosition = 'right',
      glow = false,
      className,
      ...motionProps
    },
    ref,
  ) {
    const { ref: magneticRef, onMouseMove, onMouseLeave, reset } =
      useMagnetic({ strength: 0.25, radius: 150 });

    const setRef = (el: HTMLAnchorElement | null) => {
      (magneticRef as React.MutableRefObject<HTMLAnchorElement | null>).current = el;
      if (typeof ref === 'function') ref(el);
      else if (ref) (ref as React.MutableRefObject<HTMLAnchorElement | null>).current = el;
    };

    return (
      <motion.a
        ref={setRef}
        href={href}
        className={cn(
          'relative inline-flex items-center justify-center font-medium',
          'transition-all duration-300 ease-out',
          'cursor-pointer select-none',
          'backdrop-blur-sm',
          variantStyles[variant],
          sizeStyles[size],
          glow && variant === 'primary' && 'animate-pulse-glow',
          className,
        )}
        onMouseMove={magnetic ? onMouseMove : undefined}
        onMouseLeave={magnetic ? onMouseLeave : undefined}
        onHoverStart={magnetic ? undefined : undefined}
        onHoverEnd={magnetic ? () => reset() : undefined}
        whileHover={{ scale: magnetic ? 1.05 : 1.02 }}
        whileTap={{ scale: 0.97 }}
        transition={springTransition}
        {...motionProps}
      >
        {icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        <span className="relative z-10">{children}</span>
        {icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">{icon}</span>
        )}
        {variant === 'primary' && (
          <span className="absolute inset-0 rounded-[inherit] bg-gradient-to-r from-primary/20 via-transparent to-accent/20 opacity-0 hover:opacity-100 transition-opacity duration-500" />
        )}
      </motion.a>
    );
  },
);

export default Button;
export type { ButtonProps, ButtonVariant, ButtonSize };