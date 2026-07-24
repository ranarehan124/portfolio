import { useCallback } from 'react';
import { motion } from 'framer-motion';
import { FiMenu, FiDownload, FiGithub, FiLinkedin } from 'react-icons/fi';
import { NAV_LINKS, SOCIALS } from '@/constants';
import { useAppContext } from '@/contexts/AppContext';
import { useScroll, useLenisScroll, useIsMobile } from '@/hooks';
import { cn } from '@/utils/helpers';
import { navbarVariants, navItemVariants, springTransition } from '@/animations';
import MobileMenu from './MobileMenu';
import profilePic from '@/assets/images/profile.jpg';

function Navbar() {
  const { state, dispatch } = useAppContext();
  const { scrollY, direction, isAtTop } = useScroll(10);
  const { scrollTo } = useLenisScroll();
  const isMobile = useIsMobile();

  const toggleMobileMenu = useCallback(() => {
    dispatch({ type: 'TOGGLE_MOBILE_MENU' });
  }, [dispatch]);

  const closeMobileMenu = useCallback(() => {
    dispatch({ type: 'SET_MOBILE_MENU_OPEN', payload: false });
  }, [dispatch]);

  const handleNavClick = useCallback(
    (href: string) => {
      scrollTo(href);
    },
    [scrollTo],
  );

  const isHidden = !isAtTop && direction === 'down' && scrollY > 100;
  const isScrolled = scrollY > 50;

  return (
    <>
      <motion.header
        className={cn(
          'fixed top-0 left-0 right-0 z-[100] transition-all duration-500',
          isHidden && '-translate-y-full',
        )}
        variants={navbarVariants}
        initial="hidden"
        animate="visible"
      >
        <div
          className={cn(
            'mx-4 mt-4 rounded-2xl transition-all duration-500',
            isScrolled ? 'glass-heavy shadow-glass-lg' : 'bg-transparent',
          )}
        >
          <nav className="flex items-center justify-between h-20 px-8">
            <motion.a
              href="#hero"
              onClick={(e) => {
                e.preventDefault();
                handleNavClick('#hero');
              }}
              className="relative z-10 flex items-center gap-3 text-white font-bold tracking-tight text-lg"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={springTransition}
            >
              <div className="w-10 h-10 rounded-xl overflow-hidden ring-2 ring-white/15">
                <img src={profilePic} alt="Rehan Tahir" className="w-full h-full object-cover" />
              </div>
              <span className="hidden sm:block">Rehan</span>
            </motion.a>

            {!isMobile && (
              <div className="hidden md:flex items-center gap-1.5">
                {NAV_LINKS.map((link, i) => {
                  const isActive = state.activeSection === link.href.replace('#', '');
                  return (
                    <motion.a
                      key={link.href}
                      href={link.href}
                      onClick={(e) => {
                        e.preventDefault();
                        handleNavClick(link.href);
                      }}
                      custom={i}
                      variants={navItemVariants}
                      initial="hidden"
                      animate="visible"
                      className={cn(
                        'relative px-4 py-2.5 text-[15px] font-semibold tracking-wide transition-colors rounded-xl',
                        isActive ? 'text-white' : 'text-white/50 hover:text-white/80',
                      )}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {link.label}
                      {isActive && (
                        <motion.div
                          layoutId="nav-active-indicator"
                          className="absolute inset-0 rounded-xl bg-white/5 border border-white/5"
                          transition={{ type: 'spring', stiffness: 350, damping: 30 }}
                        />
                      )}
                    </motion.a>
                  );
                })}
              </div>
            )}

            <div className="flex items-center gap-4">
              {!isMobile && (
                <motion.a
                  href={`${import.meta.env.BASE_URL}resume.pdf`}
                  className="hidden md:flex items-center gap-2 px-5 py-2.5 text-sm font-semibold tracking-wide text-black bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 border border-amber-300/50 rounded-xl shadow-[0_0_15px_rgba(251,191,36,0.3)] hover:shadow-[0_0_25px_rgba(251,191,36,0.55)] transition-all cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  transition={springTransition}
                >
                  <FiDownload size={15} />
                  Resume
                </motion.a>
              )}

              {!isMobile && (
                <div className="hidden md:flex items-center gap-2.5 ml-2 pl-4 border-l border-white/10">
                  <a
                    href={SOCIALS.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-white/40 hover:text-white transition-colors"
                    aria-label="GitHub"
                  >
                    <FiGithub size={17} />
                  </a>
                  <a
                    href={SOCIALS.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2.5 text-white/40 hover:text-primary transition-colors"
                    aria-label="LinkedIn"
                  >
                    <FiLinkedin size={17} />
                  </a>
                </div>
              )}

              {isMobile && (
                <motion.button
                  onClick={toggleMobileMenu}
                  className="relative z-10 w-11 h-11 flex items-center justify-center rounded-xl border border-white/10 text-white/60 hover:text-white hover:border-white/20 transition-colors cursor-pointer"
                  whileTap={{ scale: 0.9 }}
                  aria-label="Toggle menu"
                >
                  <FiMenu size={19} />
                </motion.button>
              )}
            </div>
          </nav>
        </div>
      </motion.header>

      {isMobile && state.isMobileMenuOpen && (
        <MobileMenu
          isOpen={state.isMobileMenuOpen}
          onClose={closeMobileMenu}
          activeSection={state.activeSection}
        />
      )}
    </>
  );
}

export default Navbar;