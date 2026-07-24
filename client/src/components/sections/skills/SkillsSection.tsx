import { motion } from 'framer-motion';
import { SectionHeading, GlowOrb } from '@ui';
import { SKILL_CATEGORIES } from '@/data';
import { fadeInUp, staggerContainer } from '@/animations';

function SkillBar({ name, level, index }: { name: string; level: number; index: number }) {
  return (
    <motion.div
      className="mb-5 last:mb-0"
      initial={{ opacity: 0, x: -10 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-white/80">{name}</span>
        <span className="text-xs font-mono text-primary/70">{level}%</span>
      </div>
      <div className="h-1.5 w-full rounded-full bg-white/[0.06] overflow-hidden">
        <motion.div
          className="h-full rounded-full bg-gradient-to-r from-primary via-primary/90 to-accent"
          initial={{ width: 0 }}
          whileInView={{ width: `${level}%` }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 1, delay: index * 0.05 + 0.15, ease: 'easeOut' }}
        />
      </div>
    </motion.div>
  );
}

function SkillCategoryCard({
  title,
  skills,
  index,
}: {
  title: string;
  skills: { name: string; icon: string; level: number }[];
  index: number;
}) {
  return (
    <motion.div
      className="glass rounded-2xl p-6 sm:p-8 transition-all duration-500 hover:bg-white/[0.04] hover:border-white/[0.12]"
      variants={fadeInUp}
      custom={index}
    >
      <div className="flex items-center gap-2 mb-6">
        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
        <h3 className="text-sm font-semibold uppercase tracking-wider text-primary/80">
          {title}
        </h3>
      </div>
      <div>
        {skills.map((skill, i) => (
          <SkillBar key={skill.name} name={skill.name} level={skill.level} index={i} />
        ))}
      </div>
    </motion.div>
  );
}

function SkillsSection() {
  return (
    <section id="skills" className="relative py-section-lg overflow-hidden">
      <GlowOrb
        color="blue"
        size="lg"
        className="-top-10 -left-20 opacity-15"
        style={{ filter: 'blur(80px)' }}
      />

      <div className="section-container">
        <SectionHeading
          label="Skills"
          title="Tools & Technologies I Work With"
          description="A growing toolkit spanning frontend engineering, backend fundamentals, dev tooling, and AI-assisted workflows."
        />

        <motion.div
          className="grid grid-cols-1 gap-5 sm:grid-cols-2"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-80px' }}
        >
          {SKILL_CATEGORIES.map((category, index) => (
            <SkillCategoryCard
              key={category.title}
              title={category.title}
              skills={category.skills}
              index={index}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default SkillsSection;