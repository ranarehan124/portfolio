import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { charReveal, letterStaggerContainer } from '@/animations';

interface AnimatedTextProps {
  text: string;
  className?: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  delay?: number;
  stagger?: number;
  once?: boolean;
}

function AnimatedText({
  text,
  className,
  as: Tag = 'p',
  delay = 0,
  stagger = 0.03,
  once = true,
}: AnimatedTextProps) {
  const MotionTag = motion[Tag];
  const letters = text.split('');

  return (
    <MotionTag
      className={cn('flex flex-wrap', className)}
      variants={{
        ...letterStaggerContainer,
        visible: {
          transition: { staggerChildren: stagger, delayChildren: delay },
        },
      }}
      initial="hidden"
      whileInView="visible"
      viewport={once ? { once: true } : undefined}
      aria-label={text}
    >
      {letters.map((letter, i) => (
        <motion.span
          key={`${letter}-${i}`}
          variants={charReveal}
          className="inline-block"
          style={{ whiteSpace: letter === ' ' ? 'pre' : 'normal' }}
        >
          {letter === ' ' ? '\u00A0' : letter}
        </motion.span>
      ))}
    </MotionTag>
  );
}

export default AnimatedText;