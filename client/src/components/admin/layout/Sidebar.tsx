import React, { useCallback } from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FiLayers,
  FiCode,
  FiBriefcase,
  FiStar,
  FiMessageSquare,
  FiLink,
  FiSearch,
  FiSettings,
  FiBarChart2,
  FiImage,
  FiFileText,
  FiUser,
  FiAward,
  FiLogOut,
  FiBook,
  FiGlobe,
  FiPenTool,
  FiEdit,
  FiChevronsLeft,
  FiChevronsRight,
} from 'react-icons/fi';
import { cn } from '@/utils/helpers';

interface MenuItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badgeCount?: number;
}

interface MenuGroup {
  title: string;
  items: MenuItem[];
}

const MENU_GROUPS: MenuGroup[] = [
  {
    title: 'MAIN',
    items: [
      { label: 'Dashboard', icon: FiBarChart2, path: '/admin/dashboard' },
      { label: 'Hero', icon: FiStar, path: '/admin/hero' },
      { label: 'About', icon: FiUser, path: '/admin/about' },
    ],
  },
  {
    title: 'CONTENT',
    items: [
      { label: 'Projects', icon: FiLayers, path: '/admin/projects' },
      { label: 'Skills', icon: FiCode, path: '/admin/skills' },
      { label: 'Experience', icon: FiBriefcase, path: '/admin/experience' },
      { label: 'Services', icon: FiPenTool, path: '/admin/services' },
      { label: 'Testimonials', icon: FiMessageSquare, path: '/admin/testimonials' },
      { label: 'Achievements', icon: FiAward, path: '/admin/achievements' },
      { label: 'Education', icon: FiBook, path: '/admin/education' },
    ],
  },
  {
    title: 'MEDIA',
    items: [
      { label: 'Images', icon: FiImage, path: '/admin/images' },
      { label: 'Resume', icon: FiFileText, path: '/admin/resume' },
    ],
  },
  {
    title: 'COMMUNICATION',
    items: [
      { label: 'Messages', icon: FiMessageSquare, path: '/admin/messages', badgeCount: 0 },
      { label: 'Social Links', icon: FiLink, path: '/admin/socials' },
    ],
  },
  {
    title: 'SETTINGS',
    items: [
      { label: 'SEO', icon: FiSearch, path: '/admin/seo' },
      { label: 'Website Settings', icon: FiSettings, path: '/admin/settings' },
      { label: 'Profile', icon: FiEdit, path: '/admin/profile' },
    ],
  },
];

const BOTTOM_ITEMS: MenuItem[] = [
  { label: 'Visit Site', icon: FiGlobe, path: '/' },
  { label: 'Logout', icon: FiLogOut, path: '/admin/logout' },
];

const COLLAPSE_KEY = 'admin_sidebar_collapsed';

function getInitialCollapsed(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(COLLAPSE_KEY) === 'true';
}

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const mobileSidebarVariants = {
  closed: {
    x: '-100%',
    transition: { type: 'spring', stiffness: 400, damping: 35 },
  },
  open: {
    x: 0,
    transition: { type: 'spring', stiffness: 400, damping: 35 },
  },
};

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void;
}

function SidebarContent({
  collapsed,
  onToggleCollapse,
  onLogout,
  onClose,
  isMobile,
}: {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLogout?: () => void;
  onClose?: () => void;
  isMobile: boolean;
}) {
  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.06] px-4">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/10 shadow-[0_0_16px_rgba(139,92,246,0.15)]">
          <span className="text-lg font-bold text-[#8B5CF6]">R</span>
        </div>
        <div className="sidebar-label min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-white/90">
            Rehan Tahir
          </h2>
          <p className="truncate text-[11px] text-white/30">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-4">
          {MENU_GROUPS.map((group) => (
            <div key={group.title}>
              {!collapsed && (
                <p className="sidebar-section-title mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/20">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <SidebarNavLink
                    key={item.path}
                    item={item}
                    collapsed={collapsed}
                    onClose={isMobile ? onClose : undefined}
                    isLogout={false}
                    onLogout={onLogout}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-white/[0.06] px-3 py-3">
        <div className="space-y-0.5">
          {BOTTOM_ITEMS.map((item) => (
            <SidebarNavLink
              key={item.path}
              item={item}
              collapsed={collapsed}
              onClose={isMobile ? onClose : undefined}
              isLogout={item.label === 'Logout'}
              onLogout={onLogout}
            />
          ))}
        </div>

        {/* Collapse toggle (desktop only) */}
        {!isMobile && (
          <button
            onClick={onToggleCollapse}
            className={cn(
              'mt-3 flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2',
              'text-xs font-medium text-white/30 transition-colors',
              'hover:bg-white/[0.04] hover:text-white/50',
              'focus:outline-none focus:ring-1 focus:ring-[#8B5CF6]/30',
            )}
            aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? (
              <FiChevronsRight className="h-4 w-4" />
            ) : (
              <>
                <FiChevronsLeft className="h-4 w-4" />
                <span className="sidebar-label">Collapse</span>
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}

function SidebarNavLink({
  item,
  collapsed,
  onClose,
  isLogout,
  onLogout,
}: {
  item: MenuItem;
  collapsed: boolean;
  onClose?: () => void;
  isLogout: boolean;
  onLogout?: () => void;
}) {
  const Icon = item.icon;

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      if (isLogout) {
        e.preventDefault();
        onLogout?.();
        return;
      }
      onClose?.();
    },
    [isLogout, onLogout, onClose],
  );

  return (
    <NavLink
      to={item.path}
      onClick={handleClick}
      className={({ isActive }) =>
        cn(
          'group relative flex items-center gap-3 rounded-lg px-3 py-2.5',
          'text-sm font-medium transition-colors duration-150',
          collapsed && 'justify-center px-0',
          isActive
            ? 'text-white'
            : 'text-white/45 hover:bg-white/[0.04] hover:text-white/70',
        )
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <motion.div
              layoutId="admin-sidebar-active"
              className="absolute inset-0 rounded-lg bg-[#8B5CF6]/10 border border-[#8B5CF6]/20"
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            />
          )}

          <Icon
            className={cn(
              'relative z-10 h-[18px] w-[18px] shrink-0 transition-colors',
              isActive
                ? 'text-[#8B5CF6]'
                : 'text-white/35 group-hover:text-white/55',
            )}
          />

          <span className="sidebar-label relative z-10 truncate">{item.label}</span>

          {item.badgeCount != null && item.badgeCount > 0 && !collapsed && (
            <span
              className={cn(
                'sidebar-label relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center',
                'rounded-full px-1.5 text-[10px] font-bold',
                isActive
                  ? 'bg-[#8B5CF6] text-white'
                  : 'bg-white/[0.08] text-white/50',
              )}
            >
              {item.badgeCount > 9 ? '9+' : item.badgeCount}
            </span>
          )}
        </>
      )}
    </NavLink>
  );
}

export default function Sidebar({
  isOpen,
  onClose,
  collapsed,
  onToggleCollapse,
  onLogout,
}: SidebarProps) {
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'admin-sidebar hidden lg:flex lg:flex-col',
          collapsed && 'collapsed',
        )}
      >
        <SidebarContent
          collapsed={collapsed}
          onToggleCollapse={onToggleCollapse}
          onLogout={onLogout}
          isMobile={false}
        />
      </aside>

      {/* Mobile overlay */}
      {isMobile && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate={isOpen ? 'visible' : 'hidden'}
            exit="exit"
            className="admin-mobile-overlay lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            variants={mobileSidebarVariants}
            initial="closed"
            animate={isOpen ? 'open' : 'closed'}
            className="fixed inset-y-0 left-0 z-50 w-[280px] glass-heavy lg:hidden"
          >
            <SidebarContent
              collapsed={false}
              onToggleCollapse={onToggleCollapse}
              onLogout={onLogout}
              onClose={onClose}
              isMobile={true}
            />
          </motion.aside>
        </>
      )}
    </>
  );
}

export { getInitialCollapsed, COLLAPSE_KEY };