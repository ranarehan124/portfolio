import { motion } from 'framer-motion';
import { FiBriefcase, FiMapPin, FiCalendar, FiArrowUpRight } from 'react-icons/fi';
import { SectionHeading } from '@ui';
import { EXPERIENCE_DATA } from '@/data';
import { fadeInUp, staggerContainer } from '@/animations';
import { formatDateRange, cn } from '@/utils/helpers';

/** Human-readable duration between two dates, e.g. "1 yr 4 mos" or "3 mos". */
function getDuration(start: string, end: string | null): string {
  const startDate = new Date(start);
  const endDate = end ? new Date(end) : new Date();

  let months =
    (endDate.getFullYear() - startDate.getFullYear()) * 12 +
    (endDate.getMonth() - startDate.getMonth());
  months = Math.max(months, 1);

  const years = Math.floor(months / 12);
  const remMonths = months % 12;

  const parts: string[] = [];
  if (years > 0) parts.push(`${years} yr${years > 1 ? 's' : ''}`);
  if (remMonths > 0 || years === 0) parts.push(`${remMonths || months} mo${remMonths === 1 ? '' : 's'}`);

  return parts.join(' ');
}

const highlightVariants = {
  hidden: { opacity: 0, x: -8 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: 0.08 * i, duration: 0.4, ease: 'easeOut' as const },
  }),
};

function TimelineItem({
  company,
  role,
  location,
  startDate,
  endDate,
  current,
  description,
  highlights,
  index,
}: {
  company: string;
  role: string;
  location: string;
  startDate: string;
  endDate: string | null;
  current: boolean;
  description: string;
  highlights: string[];
  index: number;
}) {
  const isEven = index % 2 === 0;

  return (
    <motion.div
      className="relative grid grid-cols-1 lg:grid-cols-2 lg:gap-x-16 pb-16 last:pb-0"
      variants={fadeInUp}
    >
      {/* Timeline icon badge — left on mobile/tablet, centered only on wide desktop */}
      <div className="absolute left-0 lg:left-1/2 top-0 -translate-x-1/2 lg:-translate-x-1/2 z-10">
        <div className="relative flex items-center justify-center w-9 h-9 sm:w-11 sm:h-11">
          <span
            className={`absolute inset-0 rounded-full blur-md transition-opacity duration-500 ${
              current ? 'bg-primary/60 opacity-100 animate-pulse' : 'bg-primary/30 opacity-60'
            }`}
          />
          <div
            className={`relative flex items-center justify-center w-full h-full rounded-full border backdrop-blur-sm transition-all duration-500 ${
              current
                ? 'bg-gradient-to-br from-primary/40 to-primary/10 border-primary/60 shadow-[0_0_20px_rgba(139,47,255,0.5)]'
                : 'bg-white/[0.04] border-white/[0.15] group-hover:border-primary/40'
            }`}
          >
            <FiBriefcase size={14} className={current ? 'text-white' : 'text-white/50'} />
          </div>
          {current && (
            <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-primary" />
            </span>
          )}
        </div>
      </div>

      {/* Connecting glow segment */}
      <span
        className="absolute left-[17px] sm:left-[21px] lg:left-1/2 top-9 sm:top-11 bottom-0 w-px lg:-translate-x-1/2 bg-gradient-to-b from-primary/25 via-primary/5 to-transparent"
        aria-hidden
      />

      {/* Spacer column so the grid keeps two tracks on wide desktop */}
      {isEven && <div className="hidden lg:block" />}

      {/* Content card */}
      <motion.div
        whileHover={{ y: -4 }}
        transition={{ type: 'spring', stiffness: 300, damping: 22 }}
        className={cn(
          'group relative glass rounded-2xl p-6 sm:p-8 overflow-hidden transition-all duration-500',
          'hover:bg-white/[0.07] hover:border-white/[0.15] hover:shadow-[0_8px_40px_rgba(139,47,255,0.18)]',
          'pl-12 lg:pl-0',
          isEven ? 'lg:col-start-1 lg:mr-4' : 'lg:col-start-2 lg:ml-4',
        )}
      >
        {/* Ghost index number, peeking from the edge nearest the timeline */}
        <span
          className={cn(
            'pointer-events-none absolute top-2 select-none font-mono text-7xl sm:text-8xl font-bold text-white/[0.04] leading-none',
            isEven ? 'right-4' : 'left-4',
          )}
          aria-hidden
        >
          {String(index + 1).padStart(2, '0')}
        </span>

        <div
          className={`pointer-events-none absolute -top-16 ${
            isEven ? '-right-16' : '-left-16'
          } w-48 h-48 rounded-full bg-primary/20 blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700`}
        />

        <div className="relative">
          {/* Meta */}
          <div className="flex flex-wrap items-center gap-2.5 mb-4">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/40">
              <FiCalendar size={12} />
              {formatDateRange(startDate, endDate)}
              <span className="text-white/25">·</span>
              <span className="text-primary/60">{getDuration(startDate, endDate)}</span>
            </span>
            {current && (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-primary/10 border border-primary/30 text-primary text-[11px] font-semibold tracking-wide uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Current
              </span>
            )}
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] text-xs font-mono text-white/40">
              <FiMapPin size={12} />
              {location}
            </span>
          </div>

          {/* Role + Company */}
          <div className="mb-4">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1.5 tracking-tight">
              {role}
            </h3>
            <p className="text-sm sm:text-[15px] text-primary/80 font-semibold flex items-center gap-2">
              {company}
              <FiArrowUpRight
                size={14}
                className="text-primary/40 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300"
              />
            </p>
          </div>

          {/* Description */}
          <p className="text-sm sm:text-base text-white/50 leading-relaxed mb-6">
            {description}
          </p>

          <div className="h-px w-full bg-gradient-to-r from-white/10 via-white/5 to-transparent mb-6" />

          {/* Highlights — staggered reveal on scroll */}
          <motion.ul
            className="space-y-3"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-40px' }}
          >
            {highlights.map((item, i) => (
              <motion.li
                key={i}
                custom={i}
                variants={highlightVariants}
                className="flex items-start gap-3 text-sm text-white/45 leading-relaxed"
              >
                <span className="mt-1.5 flex-shrink-0 relative w-3 h-3">
                  <span className="absolute inset-0 rounded-full bg-primary/20 blur-sm" />
                  <span className="absolute inset-[3px] rounded-full bg-primary/70" />
                </span>
                <span className="group-hover:text-white/60 transition-colors duration-300">
                  {item}
                </span>
              </motion.li>
            ))}
          </motion.ul>
        </div>
      </motion.div>

      {!isEven && <div className="hidden lg:block lg:col-start-1 lg:row-start-1" />}
    </motion.div>
  );
}

function ExperienceSection() {
  return (
    <section id="experience" className="relative py-section-lg overflow-hidden">
      <div className="pointer-events-none absolute top-1/3 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full bg-primary/[0.06] blur-[120px]" />

      <div className="section-container relative">
        <SectionHeading
          label="Experience"
          title="Where I've Been"
          description="My professional journey so far — from hands-on development to understanding the business side of digital communication."
        />

        <div className="relative max-w-5xl mx-auto">
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-50px' }}
          >
            {EXPERIENCE_DATA.map((exp, i) => (
              <TimelineItem key={exp.id} {...exp} index={i} />
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

export default ExperienceSection;