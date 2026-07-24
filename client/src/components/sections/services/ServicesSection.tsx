import { useRef, useState } from 'react';
import {
  FiMonitor,
  FiBox,
  FiLayout,
  FiCpu,
  FiUser,
  FiGlobe,
  FiPenTool,
  FiArrowUpRight,
} from 'react-icons/fi';
import { motion } from 'framer-motion';
import { SectionHeading } from '@ui';
import { SERVICES_DATA } from '@/data';
import { fadeInUp, staggerContainer } from '@/animations';

const SERVICE_ICON_MAP: Record<string, React.ReactNode> = {
  frontend: <FiMonitor />,
  '3d': <FiBox />,
  landing: <FiLayout />,
  ai: <FiCpu />,
  portfolio: <FiUser />,
  business: <FiGlobe />,
  ui: <FiPenTool />,
};

function ServiceCard({
  icon,
  title,
  description,
  index,
}: {
  icon: string;
  title: string;
  description: string;
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ x: py * -6, y: px * 6 });
  };

  const resetTilt = () => setTilt({ x: 0, y: 0 });

  return (
    <motion.div
      ref={cardRef}
      className="relative glass rounded-2xl p-7 sm:p-8 group cursor-default overflow-hidden"
      variants={fadeInUp}
      custom={index}
      onMouseMove={handleMouseMove}
      onMouseLeave={resetTilt}
      animate={{ rotateX: tilt.x, rotateY: tilt.y }}
      transition={{ type: 'spring', stiffness: 200, damping: 20 }}
      style={{ transformStyle: 'preserve-3d', transformPerspective: 800 }}
      whileHover={{ y: -6 }}
    >
      {/* Border glow on hover */}
      <div className="absolute inset-0 rounded-2xl border border-white/[0.06] group-hover:border-primary/30 transition-colors duration-500 pointer-events-none" />

      {/* Corner gradient glow */}
      <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-transparent opacity-0 group-hover:opacity-100 blur-2xl transition-opacity duration-700 pointer-events-none" />

      {/* Index number */}
      <span className="absolute top-6 right-7 text-[11px] font-mono text-white/15 group-hover:text-primary/50 transition-colors duration-500">
        {String(index + 1).padStart(2, '0')}
      </span>

      <div className="relative z-10">
        <div className="w-13 h-13 w-[52px] h-[52px] rounded-2xl bg-gradient-to-br from-primary/15 to-accent/10 border border-primary/20 flex items-center justify-center text-primary text-2xl mb-6 group-hover:scale-110 group-hover:border-primary/40 group-hover:shadow-glow-soft transition-all duration-500">
          {SERVICE_ICON_MAP[icon] ?? <FiLayout />}
        </div>

        <h3 className="text-lg font-bold text-white mb-3 group-hover:text-gradient transition-all duration-300 pr-6">
          {title}
        </h3>

        <p className="text-sm text-white/45 leading-relaxed group-hover:text-white/60 transition-colors duration-300 mb-5">
          {description}
        </p>

        <div className="flex items-center gap-1.5 text-xs font-medium text-white/20 group-hover:text-primary/70 transition-all duration-500">
          <span className="group-hover:translate-x-0.5 transition-transform duration-300">
            Learn more
          </span>
          <FiArrowUpRight
            size={13}
            className="group-hover:translate-x-1 group-hover:-translate-y-0.5 transition-transform duration-300"
          />
        </div>
      </div>
    </motion.div>
  );
}

function ServicesSection() {
  return (
    <section id="services" className="relative py-section-lg overflow-hidden">
      <div className="section-container">
        <SectionHeading
          label="Services"
          title="What I Can Build For You"
          description="As a freelance creative developer, I bring ideas to life through code. Here's what I can help you with."
        />

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {SERVICES_DATA.map((service, i) => (
            <ServiceCard
              key={service.id}
              icon={service.icon}
              title={service.title}
              description={service.description}
              index={i}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default ServicesSection;