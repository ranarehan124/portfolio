import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiExternalLink } from 'react-icons/fi';
import { SectionHeading } from '@ui';
import { Button } from '@ui';
import { PROJECTS_DATA, type ProjectItem } from '@/data';
import { fadeInUp, staggerContainer } from '@/animations';
import { cn } from '@/utils/helpers';

const CATEGORY_COLORS: Record<string, string> = {
  'Game Development': 'from-orange-500/20 to-orange-500/5 border-orange-500/20 text-orange-400/80',
  'AI Voice Assistant': 'from-cyan-400/20 to-cyan-400/5 border-cyan-400/20 text-cyan-400/80',
  'Link Management Tool': 'from-cyan-400/20 to-cyan-400/5 border-cyan-400/20 text-cyan-400/80',
  '3D Product Website': 'from-primary/20 to-primary/5 border-primary/20 text-primary/80',
  'Interactive Brand Website': 'from-accent/20 to-accent/5 border-accent/20 text-accent/80',
  'Utility Platform': 'from-emerald-400/20 to-emerald-400/5 border-emerald-400/20 text-emerald-400/80',
  'Writing Platform': 'from-pink-400/20 to-pink-400/5 border-pink-400/20 text-pink-400/80',
  'Real Estate Website': 'from-amber-400/20 to-amber-400/5 border-amber-400/20 text-amber-400/80',
};

const CATEGORY_GRADIENTS: Record<string, string> = {
  'Game Development': 'from-orange-500/10 via-transparent to-transparent',
  'AI Voice Assistant': 'from-cyan-400/10 via-transparent to-transparent',
  'Link Management Tool': 'from-cyan-400/10 via-transparent to-transparent',
  '3D Product Website': 'from-primary/10 via-transparent to-transparent',
  'Interactive Brand Website': 'from-accent/10 via-transparent to-transparent',
  'Utility Platform': 'from-emerald-400/10 via-transparent to-transparent',
  'Writing Platform': 'from-pink-400/10 via-transparent to-transparent',
  'Real Estate Website': 'from-amber-400/10 via-transparent to-transparent',
};

function ProjectCard({ project, index }: { project: ProjectItem; index: number }) {
  const [isHovered, setIsHovered] = useState(false);
  const colors = CATEGORY_COLORS[project.category] ?? 'from-primary/20 to-primary/5 border-primary/20 text-primary/80';
  const gradient = CATEGORY_GRADIENTS[project.category] ?? 'from-primary/10 via-transparent to-transparent';

  const hasLive = !!project.liveUrl;

  const cardRef = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);

  useEffect(() => {
    const el = cardRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        'project-card group relative glass rounded-2xl overflow-hidden',
        'transition-colors duration-300',
        project.featured ? 'sm:col-span-2' : '',
      )}
      variants={fadeInUp}
      custom={index}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      {/* Soft glow layer — opacity transition only, cheap on the GPU */}
      <div
        className="pointer-events-none absolute -inset-px rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          boxShadow: '0 20px 60px -20px rgba(139, 92, 246, 0.35)',
        }}
      />

      {/* Top gradient background */}
      <div
        className={cn(
          'absolute inset-0 bg-gradient-to-b opacity-50 pointer-events-none transition-opacity duration-500',
          gradient,
          isHovered && 'opacity-80',
        )}
      />

      <div className="relative z-10 flex flex-col h-full">
        {/* Image / Visual area */}
        <div className="relative h-48 sm:h-56 overflow-hidden bg-dark-200/50">
          {project.liveUrl && isInView ? (
            <>
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <iframe
                  src={project.liveUrl}
                  title={project.title}
                  loading="lazy"
                  className="border-0"
                  style={{
                    width: '400%',
                    height: '400%',
                    transform: 'scale(0.25)',
                    transformOrigin: 'top left',
                  }}
                />
              </div>
              {/* Subtle dark overlay for text readability */}
              <div className="absolute inset-0 bg-gradient-to-t from-dark-300/70 via-transparent to-dark-300/10" />
            </>
          ) : (
            <>
              <div
                className={cn(
                  'project-card-image absolute inset-0 bg-gradient-to-br',
                  gradient,
                )}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <motion.div
                  animate={isHovered ? { scale: 1.1, rotate: 3 } : { scale: 1, rotate: 0 }}
                  transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                  className="w-16 h-16 rounded-2xl glass border border-white/10 flex items-center justify-center"
                >
                  <span className="text-2xl font-bold text-gradient">
                    {project.title.charAt(0)}
                  </span>
                </motion.div>
              </div>
            </>
          )}

          {/* Category badge */}
          <div className="absolute top-4 left-4">
            <span
              className={cn(
                'inline-flex px-3 py-1 rounded-lg text-xs font-medium bg-gradient-to-r border backdrop-blur-sm',
                colors,
              )}
            >
              {project.category}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 p-6 sm:p-7 flex flex-col">
          <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-gradient transition-colors duration-300">
            {project.title}
          </h3>
          <p className="text-sm text-white/45 leading-relaxed mb-5 flex-1 group-hover:text-white/60 transition-colors duration-300">
            {project.description}
          </p>

          {/* Tags */}
          <div className="flex flex-wrap gap-2 mb-6">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className="px-2.5 py-1 text-[11px] font-mono text-white/30 border border-white/5 rounded-md bg-white/[0.02]"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Actions */}
          {hasLive && (
            <div className="flex items-center gap-3 pt-4 border-t border-white/5">
              <Button
                variant="primary"
                size="sm"
                href={project.liveUrl}
                magnetic={false}
                icon={<FiExternalLink size={14} />}
                iconPosition="right"
              >
                Live Demo
              </Button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function ProjectsSection() {
  const featured = PROJECTS_DATA.filter((p) => p.featured);
  const other = PROJECTS_DATA.filter((p) => !p.featured);

  return (
    <section id="projects" className="relative py-section-lg overflow-hidden">
      <div className="section-container">
        <SectionHeading
          label="Projects"
          title="Featured Work"
          description="A selection of projects that showcase my range — from games and AI experiments to cinematic brand experiences and full-stack applications."
        />

        {/* Featured projects */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 gap-6 sm:gap-7 mb-7"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {featured.map((project, i) => (
            <ProjectCard key={project.id} project={project} index={i} />
          ))}
        </motion.div>

        {/* Other projects */}
        {other.length > 0 && (
          <>
            <motion.h3
              className="text-lg font-semibold text-white/50 mb-6 font-mono text-sm tracking-wider"
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
            >
              OTHER PROJECTS
            </motion.h3>
            <motion.div
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7"
              variants={staggerContainer}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
            >
              {other.map((project, i) => (
                <ProjectCard key={project.id} project={project} index={i} />
              ))}
            </motion.div>
          </>
        )}
      </div>
    </section>
  );
}

export default ProjectsSection;