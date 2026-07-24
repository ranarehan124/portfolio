import { motion } from 'framer-motion';
import { cn } from '@/utils/helpers';
import { fadeInUp, staggerContainer } from '@/animations';

interface SectionHeadingProps {
  label?: string;
  title: string;
  description?: string;
  align?: 'left' | 'center';
  className?: string;
}

function SectionHeading({
  label,
  title,
  description,
  align = 'center',
  className,
}: SectionHeadingProps) {
  return (
    <motion.div
      className={cn(
        'mb-16',
        align === 'center' && 'text-center',
        className,
      )}
      variants={staggerContainer}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: '-100px' }}
    >
      {label && (
        <motion.span
          className="inline-block mb-4 px-4 py-1.5 text-xs font-mono font-medium uppercase tracking-[0.2em] text-primary/80 border border-primary/20 rounded-full bg-primary/5"
          variants={fadeInUp}
        >
          {label}
        </motion.span>
      )}
      <motion.h2
        className={cn(
          'text-section-xl font-bold text-white',
          align === 'center' && 'mx-auto max-w-3xl',
        )}
        variants={fadeInUp}
      >
        {title}
      </motion.h2>
      {description && (
        <motion.p
          className={cn(
            'mt-6 text-body-md text-white/50 max-w-2xl',
            align === 'center' && 'mx-auto',
          )}
          variants={fadeInUp}
        >
          {description}
        </motion.p>
      )}
    </motion.div>
  );
}

export default SectionHeading;