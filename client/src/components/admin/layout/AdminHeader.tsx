import { useCallback, useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FiMenu,
  FiSearch,
  FiSettings,
  FiUser,
  FiLogOut,
  FiChevronDown,
} from 'react-icons/fi';
import { cn } from '@/utils/helpers';
import { authService } from '@/services';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  onLogout?: () => void;
}

const ROUTE_TITLES: Record<string, string> = {
  '/admin/dashboard': 'Dashboard',
  '/admin/hero': 'Hero Section',
  '/admin/about': 'About',
  '/admin/projects': 'Projects',
  '/admin/skills': 'Skills',
  '/admin/experience': 'Experience',
  '/admin/services': 'Services',
  '/admin/testimonials': 'Testimonials',
  '/admin/achievements': 'Achievements',
  '/admin/education': 'Education',
  '/admin/images': 'Images',
  '/admin/resume': 'Resume',
  '/admin/messages': 'Messages',
  '/admin/socials': 'Social Links',
  '/admin/seo': 'SEO Settings',
  '/admin/settings': 'Website Settings',
  '/admin/profile': 'Profile',
};

function getPageTitle(pathname: string): string {
  if (ROUTE_TITLES[pathname]) return ROUTE_TITLES[pathname];
  const match = Object.keys(ROUTE_TITLES).find(
    (key) => key !== '/admin/dashboard' && pathname.startsWith(key),
  );
  return match ? (ROUTE_TITLES[match] ?? 'Admin') : 'Admin';
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((w) => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

const dropdownVariants = {
  hidden: { opacity: 0, scale: 0.95, y: -4 },
  visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.15 } },
  exit: { opacity: 0, scale: 0.95, y: -4, transition: { duration: 0.15 } },
};

export default function AdminHeader({ onMenuToggle, onLogout }: AdminHeaderProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const pageTitle = getPageTitle(location.pathname);
  const user = authService.currentUser;
  const displayName = user?.name ?? 'Admin';
  const safeName = displayName ?? '';
  const displayEmail = user?.email ?? 'admin@rehantahir.com';
  const initials = getInitials(safeName);

  const closeDropdown = useCallback(() => setDropdownOpen(false), []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        closeDropdown();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeDropdown]);

  const handleLogout = useCallback(() => {
    closeDropdown();
    if (onLogout) {
      onLogout();
    } else {
      authService.logout();
      navigate('/admin/login');
    }
  }, [onLogout, closeDropdown, navigate]);

  const handleProfileClick = useCallback(() => {
    closeDropdown();
    navigate('/admin/profile');
  }, [closeDropdown, navigate]);

  const handleSettingsClick = useCallback(() => {
    closeDropdown();
    navigate('/admin/settings');
  }, [closeDropdown, navigate]);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 px-4 sm:px-6',
        'border-b border-white/[0.06]',
        'bg-[#050505]/80 backdrop-blur-xl',
      )}
    >
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuToggle}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg lg:hidden',
          'text-white/50 transition-colors',
          'hover:bg-white/[0.06] hover:text-white/80',
          'focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/50',
        )}
        aria-label="Toggle sidebar"
      >
        <FiMenu className="h-5 w-5" />
      </button>

      {/* Page title */}
      <div className="hidden min-w-0 flex-1 sm:block">
        <h1 className="truncate text-sm font-semibold text-white/80">
          {pageTitle}
        </h1>
      </div>

      {/* Search placeholder (non-functional) */}
      <div className="relative hidden max-w-md flex-1 md:block">
        <FiSearch className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
        <input
          type="text"
          readOnly
          placeholder="Search anything..."
          className={cn(
            'w-full cursor-default rounded-lg border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-16',
            'text-sm text-white/90 placeholder:text-white/25',
            'transition-colors focus:outline-none',
          )}
        />
        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 text-[10px] font-medium text-white/25">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      {/* Spacer for mobile */}
      <div className="flex-1 md:hidden" />

      {/* Right actions */}
      <div className="flex items-center gap-3">
        {/* Avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={cn(
              'flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3',
              'border border-white/[0.1] transition-all',
              'hover:border-white/[0.2]',
              'focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30',
            )}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            <span
              className={cn(
                'flex h-8 w-8 items-center justify-center rounded-full',
                'bg-gradient-to-br from-[#8B5CF6]/30 to-[#60A5FA]/30',
                'text-xs font-semibold text-white/80',
              )}
            >
              {initials}
            </span>
            <span className="hidden text-sm font-medium text-white/70 sm:inline">
              {displayName}
            </span>
            <FiChevronDown className="hidden h-3.5 w-3.5 text-white/40 sm:block" />
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                variants={dropdownVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                className={cn(
                  'absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-xl',
                  'border border-white/[0.08] bg-[#111]/95 shadow-glass-lg',
                  'backdrop-blur-xl py-1',
                )}
              >
                <div className="border-b border-white/[0.06] px-4 py-3">
                  <p className="text-sm font-medium text-white/80">{displayName}</p>
                  <p className="mt-0.5 text-xs text-white/35">{displayEmail}</p>
                </div>

                <button
                  onClick={handleProfileClick}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm',
                    'text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80',
                  )}
                >
                  <FiUser className="h-4 w-4" />
                  Profile
                </button>

                <button
                  onClick={handleSettingsClick}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm',
                    'text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80',
                  )}
                >
                  <FiSettings className="h-4 w-4" />
                  Settings
                </button>

                <div className="mx-3 my-1 border-t border-white/[0.06]" />

                <button
                  onClick={handleLogout}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-4 py-2.5 text-sm',
                    'text-red-400/70 transition-colors hover:bg-red-500/[0.06] hover:text-red-400',
                  )}
                >
                  <FiLogOut className="h-4 w-4" />
                  Logout
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </header>
  );
}