import { motion } from 'framer-motion';
import { FiGithub, FiLinkedin, FiInstagram, FiMail, FiArrowUp, FiArrowRight } from 'react-icons/fi';
import { MagneticWrapper } from '@ui';
import { useLenisScroll, useScroll } from '@/hooks';
import { fadeInUp, staggerContainer } from '@/animations';
import { SOCIALS } from '@/constants';

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <FiGithub size={18} />,
  linkedin: <FiLinkedin size={18} />,
  instagram: <FiInstagram size={18} />,
};

const FOOTER_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Services', href: '#services' },
  { label: 'Contact', href: '#contact' },
];

function BackToTopButton() {
  const { isAtTop } = useScroll();
  const { scrollToTop } = useLenisScroll();

  if (isAtTop) return null;

  return (
    <MagneticWrapper strength={0.3}>
      <motion.button
        onClick={scrollToTop}
        className="w-11 h-11 rounded-full glass border border-white/[0.08] flex items-center justify-center text-white/40 hover:text-primary hover:border-primary/30 hover:shadow-[0_0_20px_rgba(139,92,246,0.15)] transition-all duration-500 cursor-pointer"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        whileHover={{ y: -3 }}
        whileTap={{ scale: 0.9 }}
        aria-label="Back to top"
      >
        <FiArrowUp size={18} />
      </motion.button>
    </MagneticWrapper>
  );
}

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative border-t border-white/[0.04] overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />

      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] pointer-events-none opacity-20"
        style={{
          background: 'radial-gradient(ellipse at center, rgba(139,92,246,0.4) 0%, transparent 70%)',
          filter: 'blur(60px)',
        }}
      />

      <div className="section-container relative">
        <motion.div
          className="py-14 sm:py-20 border-b border-white/[0.05] text-center"
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
        >
          <p className="text-xs font-mono uppercase tracking-widest text-primary/60 mb-4">
            Got a project in mind?
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-8 leading-tight">
            Let&rsquo;s build something
            <br className="hidden sm:block" /> <span className="text-gradient">exceptional together.</span>
          </h2>
          <MagneticWrapper strength={0.25}>
            <a
              href="#contact"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full bg-white text-dark-primary font-semibold text-sm hover:shadow-[0_0_35px_rgba(255,255,255,0.25)] transition-all duration-500"
            >
              Start a Conversation
              <FiArrowRight
                size={16}
                className="group-hover:translate-x-1 transition-transform duration-300"
              />
            </a>
          </MagneticWrapper>
        </motion.div>

        <motion.div
          className="py-12 sm:py-16 grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-8"
          variants={staggerContainer}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-30px' }}
        >
          <motion.div variants={fadeInUp} className="md:col-span-5 flex flex-col items-start">
            <a href="#hero" className="inline-flex items-center gap-2.5 group mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shadow-[0_0_25px_rgba(139,92,246,0.3)] group-hover:shadow-[0_0_40px_rgba(139,92,246,0.5)] transition-shadow duration-500">
                <span className="text-white font-bold text-lg">R</span>
              </div>
              <span className="text-xl font-bold text-white/80 group-hover:text-white transition-colors duration-300">
                Rehan<span className="text-primary">.</span>
              </span>
            </a>
            <p className="text-sm text-white/35 leading-relaxed max-w-xs mb-6">
              Creative frontend developer crafting immersive digital experiences at the intersection of design and engineering.
            </p>
            <div className="flex items-center gap-3">
              {Object.entries(SOCIALS).map(([platform, url]) => (
                <MagneticWrapper key={platform} strength={0.2}>
                  <a
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-lg bg-white/[0.03] border border-white/[0.05] flex items-center justify-center text-white/30 hover:text-primary hover:bg-primary/10 hover:border-primary/30 hover:shadow-[0_0_15px_rgba(139,92,246,0.12)] transition-all duration-500"
                    aria-label={platform}
                  >
                    {SOCIAL_ICONS[platform] ?? <FiMail size={18} />}
                  </a>
                </MagneticWrapper>
              ))}
            </div>
          </motion.div>

          <div className="hidden md:block md:col-span-1" />

          <motion.div variants={fadeInUp} className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Navigation
            </p>
            <nav className="flex flex-col gap-3">
              {FOOTER_LINKS.map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  className="text-sm text-white/45 hover:text-white hover:translate-x-1 transition-all duration-300 w-fit"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </motion.div>

          <motion.div variants={fadeInUp} className="md:col-span-3">
            <p className="text-xs font-semibold uppercase tracking-widest text-white/30 mb-5">
              Get In Touch
            </p>
            <div className="flex flex-col gap-3">
              <p className="text-sm text-white/45">Lahore, Pakistan</p>
              <a
                href="#contact"
                className="text-sm text-white/45 hover:text-primary transition-colors duration-300 w-fit"
              >
                Send a message &rarr;
              </a>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={fadeInUp}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="py-6 border-t border-white/[0.04] flex flex-col sm:flex-row items-center justify-between gap-3"
        >
          <p className="text-xs text-white/20 font-mono">
            &copy; {currentYear} Rehan Tahir. All rights reserved.
          </p>
          <p className="text-xs text-white/15 font-mono">
            Built with passion &amp; code
          </p>
        </motion.div>
      </div>

      <div className="fixed bottom-8 right-8 z-50">
        <BackToTopButton />
      </div>
    </footer>
  );
}

export default Footer;