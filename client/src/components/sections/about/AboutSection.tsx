import { motion } from 'framer-motion';
import { SectionHeading } from '@ui';
import { GlowOrb } from '@ui';
import { ABOUT_STATS } from '@/data';
import { fadeInLeft, fadeInRight, staggerContainer } from '@/animations';
import StatCard from './StatCard';
import profilePic from '@/assets/images/profile.jpg';

function AboutSection() {
  return (
    <section id="about" className="relative py-section-lg overflow-hidden">
      <GlowOrb color="purple" size="lg" className="-top-20 -right-20 opacity-20" style={{ filter: 'blur(80px)' }} />
      <GlowOrb color="blue" size="md" className="bottom-20 -left-10 opacity-15" style={{ filter: 'blur(60px)' }} />

      <div className="section-container">
        <SectionHeading
          label="About Me"
          title="Turning Curiosity Into Code"
          description="A 19-year-old developer from Lahore, Pakistan, building the kind of web experiences that make people pause and take a second look."
        />

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left — Text content */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <motion.div
              variants={fadeInLeft}
              className="space-y-6"
            >
              <p className="text-body-md text-white/60 leading-relaxed">
                My journey into web development started with simple curiosity — I opened a text editor one afternoon and wrote my first HTML page. That single moment of seeing code turn into something visual on a screen changed everything for me. What began as casual exploration quickly became a deep passion for creating digital experiences that feel alive.
              </p>
              <p className="text-body-md text-white/60 leading-relaxed">
                Over the past two years, I have immersed myself in modern frontend development — learning React, mastering TypeScript, diving into Three.js for 3D web experiences, and exploring how AI can be woven into user interfaces. I enjoy building modern frontend applications, AI-powered tools, interactive 3D websites, games, and premium user experiences that push the boundaries of what browsers can deliver.
              </p>
              <p className="text-body-md text-white/60 leading-relaxed">
                Currently, I work at Royal Care Pvt Ltd in the LinkedIn Outreach and Export Department. This experience in professional communication, lead generation, and understanding client requirements has been invaluable — it taught me that great development is not just about writing clean code, but about understanding what people actually need and translating those needs into intuitive, effective solutions.
              </p>
            </motion.div>

            {/* Floating glass info cards — desktop only */}
            <motion.div
              className="hidden lg:flex gap-4 mt-10"
              variants={fadeInLeft}
            >
              <div className="floating-card glass rounded-xl px-5 py-4 flex-1">
                <p className="text-xs font-mono text-primary/70 mb-1">Location</p>
                <p className="text-sm text-white/80 font-medium">Lahore, Pakistan</p>
              </div>
              <div className="floating-card-delayed glass rounded-xl px-5 py-4 flex-1">
                <p className="text-xs font-mono text-accent/70 mb-1">Current Role</p>
                <p className="text-sm text-white/80 font-medium">Creative Developer</p>
              </div>
              <div className="floating-card glass rounded-xl px-5 py-4 flex-1">
                <p className="text-xs font-mono text-primary/70 mb-1">Languages</p>
                <p className="text-sm text-white/80 font-medium">EN / UR / PA</p>
              </div>
            </motion.div>
          </motion.div>

          {/* Right — Profile image */}
          <motion.div
            className="relative flex justify-center"
            variants={fadeInRight}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-80px' }}
          >
            <div className="relative w-72 h-72 sm:w-80 sm:h-80 lg:w-96 lg:h-96">
              {/* Glow behind image */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/20 via-transparent to-accent/20 blur-2xl scale-110" />

              {/* Glass card frame */}
              <div className="relative w-full h-full rounded-3xl glass-heavy overflow-hidden flex items-center justify-center">
                <img
                  src={profilePic}
                  alt="Rehan Tahir"
                  className="absolute inset-0 w-full h-full object-cover"
                />
                {/* Subtle bottom gradient for readability/style */}
                <div className="absolute inset-0 bg-gradient-to-t from-dark-primary/40 via-transparent to-transparent" />
              </div>

              {/* Decorative floating elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 rounded-xl glass border border-primary/20 flex items-center justify-center floating-card">
                <span className="text-2xl">{'</>'}</span>
              </div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-xl glass border border-accent/20 flex items-center justify-center floating-card-delayed">
                <span className="text-lg">{'{ }'}</span>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mt-20"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          {ABOUT_STATS.map((stat, i) => (
            <StatCard
              key={stat.label}
              label={stat.label}
              value={stat.value}
              suffix={stat.suffix}
              prefix={stat.prefix}
              index={i}
            />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

export default AboutSection;