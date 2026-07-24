import { motion } from 'framer-motion';
import { useCountUp } from '@/hooks';
import { fadeInUp } from '@/animations';

interface StatCardProps {
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
  index: number;
}

function StatCard({ label, value, suffix = '', prefix = '', index }: StatCardProps) {
  const { ref, display } = useCountUp({
    end: value,
    suffix,
    prefix,
    duration: 2.5,
  });

  return (
    <motion.div
      className="relative group"
      variants={fadeInUp}
      custom={index}
    >
      <div className="relative glass rounded-2xl p-6 sm:p-8 text-center overflow-hidden transition-all duration-500 hover:bg-white/[0.07] hover:border-white/[0.15]">
        <span
          ref={ref}
          className="stat-value text-4xl sm:text-5xl font-bold text-gradient block"
        >
          {display}
        </span>
        <p className="mt-3 text-sm sm:text-base text-white/40 font-medium leading-snug">
          {label}
        </p>
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>
    </motion.div>
  );
}

export default StatCard;