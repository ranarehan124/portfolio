import { motion } from 'framer-motion';
import { NAV_LINKS, SOCIALS, ROUTES } from '@/constants';
import { useLenisScroll } from '@/hooks';
import { cn } from '@/utils/helpers';
import { mobileMenuVariants, mobileMenuItemVariants } from '@/animations';
import { FiGithub, FiLinkedin, FiInstagram, FiX } from 'react-icons/fi';

interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  activeSection: string;
}

function MobileMenu({ isOpen, onClose, activeSection }: MobileMenuProps) {
  const { scrollTo } = useLenisScroll();

  const handleNavClick = (href: string) => {
    scrollTo(href);
    onClose();
  };

  return (
    <motion.div
      className="fixed inset-0 z-[200] flex flex-col"
      variants={mobileMenuVariants}
      initial="closed"
      animate={isOpen ? 'open' : 'closed'}
    >
      {/* Backdrop */}
      <motion.div
        className="absolute inset-0 bg-[#050505]/95 backdrop-blur-xl"
        onClick={onClose}
      />

      {/* Content */}
      <div className="relative z-10 flex flex-col h-full px-8 pt-24 pb-8">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-6 right-6 w-10 h-10 flex items-center justify-center rounded-full border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors cursor-pointer"
        >
          <FiX size={18} />
        </button>

        {/* Navigation links */}
        <nav className="flex-1 flex flex-col justify-center gap-2">
          {NAV_LINKS.map((link, i) => {
            const isActive = activeSection === link.href.replace('#', '');
            return (
              <motion.div
                key={link.href}
                custom={i}
                variants={mobileMenuItemVariants}
              >
                <button
                  onClick={() => handleNavClick(link.href)}
                  className={cn(
                    'group relative w-full text-left py-4 px-4 rounded-xl',
                    'text-2xl md:text-3xl font-semibold transition-colors cursor-pointer',
                    isActive
                      ? 'text-white'
                      : 'text-white/40 hover:text-white/80',
                  )}
                >
                  <span className="relative z-10 flex items-center gap-4">
                    <span className="font-mono text-sm text-primary/60">
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    {link.label}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="mobile-nav-indicator"
                      className="absolute inset-0 rounded-xl bg-white/5 border border-white/5"
                      transition={{
                        type: 'spring',
                        stiffness: 350,
                        damping: 30,
                      }}
                    />
                  )}
                </button>
              </motion.div>
            );
          })}
        </nav>

        {/* Bottom section */}
        <motion.div
          className="flex items-center justify-between pt-8 border-t border-white/5"
          variants={mobileMenuItemVariants}
        >
          <div className="flex items-center gap-4">
            <a
              href={SOCIALS.github}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <FiGithub size={20} />
            </a>
            <a
              href={SOCIALS.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-primary transition-colors"
              aria-label="LinkedIn"
            >
              <FiLinkedin size={20} />
            </a>
            <a
              href={SOCIALS.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white/30 hover:text-accent transition-colors"
              aria-label="Instagram"
            >
              <FiInstagram size={20} />
            </a>
          </div>
          <a
            href={ROUTES.admin.login}
            className="font-mono text-xs text-white/20 hover:text-white/50 transition-colors"
          >
            Admin
          </a>
        </motion.div>
      </div>
    </motion.div>
  );
}

export default MobileMenu;