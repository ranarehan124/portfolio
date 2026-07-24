'use client';

import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Home,
  Star,
  Layers,
  Code,
  Briefcase,
  Settings,
  MessageSquare,
  Link2,
  Mail,
  Globe,
  User,
  LogOut,
} from 'lucide-react';
import { cn } from '@/utils/helpers';

interface NavItem {
  label: string;
  icon: React.ElementType;
  path: string;
  badge?: boolean;
  badgeCount?: number;
}

const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', icon: Home, path: '/admin/dashboard' },
  { label: 'Hero', icon: Star, path: '/admin/hero' },
  { label: 'Projects', icon: Layers, path: '/admin/projects' },
  { label: 'Skills', icon: Code, path: '/admin/skills' },
  { label: 'Experience', icon: Briefcase, path: '/admin/experience' },
  { label: 'Services', icon: Settings, path: '/admin/services' },
  { label: 'Testimonials', icon: MessageSquare, path: '/admin/testimonials' },
  { label: 'Social Links', icon: Link2, path: '/admin/socials' },
  { label: 'Messages', icon: Mail, path: '/admin/messages', badge: true, badgeCount: 3 },
  { label: 'Settings', icon: Globe, path: '/admin/settings' },
  { label: 'Profile', icon: User, path: '/admin/profile' },
];

const BOTTOM_ITEMS: NavItem[] = [
  { label: 'Logout', icon: LogOut, path: '/admin/logout' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
  className?: string;
  unreadCount?: number;
  onLogout?: () => void;
}

const sidebarVariants = {
  closed: {
    x: '-100%',
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 35,
    },
  },
  open: {
    x: 0,
    transition: {
      type: 'spring',
      stiffness: 400,
      damping: 35,
    },
  },
};

const overlayVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { duration: 0.2 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};

const navItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: 0.15 + i * 0.03,
      duration: 0.3,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  }),
};

export function Sidebar({
  open,
  onClose,
  className,
  unreadCount,
  onLogout,
}: SidebarProps) {
  const location = useLocation();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 1024;

  const isActive = (path: string) => {
    if (path === '/admin/dashboard') return location.pathname === path;
    return location.pathname.startsWith(path);
  };

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    if (onLogout) {
      onLogout();
    }
  };

  const sidebarContent = (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-white/[0.06] px-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10 shadow-[0_0_16px_rgba(139,92,246,0.15)]">
          <span className="text-lg font-bold text-primary">R</span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="truncate text-sm font-semibold text-white/90">
            Rehan Tahir
          </h2>
          <p className="truncate text-[11px] text-white/30">Admin Panel</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4">
        <div className="space-y-1">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-white/20">
            Main
          </p>
          {NAV_ITEMS.map((item, idx) => {
            const Icon = item.icon;
            const active = isActive(item.path);
            const badgeCount =
              item.path === '/admin/messages' && unreadCount != null
                ? unreadCount
                : item.badgeCount;

            return (
              <motion.div
                key={item.path}
                custom={idx}
                variants={isMobile ? navItemVariants : undefined}
                initial={isMobile ? 'hidden' : undefined}
                animate={isMobile ? 'visible' : undefined}
              >
                <NavLink
                  to={item.path}
                  onClick={isMobile ? onClose : undefined}
                  className={cn(
                    'group relative flex items-center gap-3 rounded-lg px-3 py-2.5',
                    'text-sm font-medium transition-colors duration-150',
                    active
                      ? 'text-white'
                      : 'text-white/45 hover:bg-white/[0.04] hover:text-white/70',
                  )}
                >
                  {active && (
                    <motion.div
                      layoutId="sidebar-active-indicator"
                      className="absolute inset-0 rounded-lg bg-primary/10 border border-primary/20"
                      transition={{
                        type: 'spring',
                        stiffness: 400,
                        damping: 30,
                      }}
                    />
                  )}

                  <Icon
                    className={cn(
                      'relative z-10 h-[18px] w-[18px] shrink-0 transition-colors',
                      active ? 'text-primary' : 'text-white/35 group-hover:text-white/55',
                    )}
                  />

                  <span className="relative z-10 truncate">{item.label}</span>

                  {(item.badge || badgeCount) && (badgeCount ?? 0) > 0 && (
                    <span
                      className={cn(
                        'relative z-10 ml-auto flex h-5 min-w-5 items-center justify-center',
                        'rounded-full px-1.5 text-[10px] font-bold',
                        active
                          ? 'bg-primary text-white'
                          : 'bg-white/[0.08] text-white/50',
                      )}
                    >
                      {badgeCount}
                    </span>
                  )}
                </NavLink>
              </motion.div>
            );
          })}
        </div>
      </nav>

      {/* Bottom section */}
      <div className="shrink-0 border-t border-white/[0.06] px-3 py-3">
        {BOTTOM_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <button
              key={item.path}
              onClick={item.label === 'Logout' ? handleLogout : undefined}
              className={cn(
                'flex w-full items-center gap-3 rounded-lg px-3 py-2.5',
                'text-sm font-medium text-white/40 transition-colors',
                'hover:bg-red-500/[0.06] hover:text-red-400',
              )}
            >
              <Icon className="h-[18px] w-[18px] shrink-0" />
              <span>{item.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={cn(
          'hidden lg:flex lg:shrink-0 lg:flex-col',
          'fixed inset-y-0 left-0 z-40 w-64',
          'border-r border-white/[0.06]',
          'bg-[#050505]/90 backdrop-blur-xl',
          className,
        )}
      >
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      {isMobile && (
        <>
          <motion.div
            variants={overlayVariants}
            initial="hidden"
            animate={open ? 'visible' : 'hidden'}
            exit="exit"
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={onClose}
          />
          <motion.aside
            variants={sidebarVariants}
            initial="closed"
            animate={open ? 'open' : 'closed'}
            className={cn(
              'fixed inset-y-0 left-0 z-50 w-72 lg:hidden',
              'border-r border-white/[0.06]',
              'bg-[#050505] shadow-glass-lg',
              className,
            )}
          >
            {sidebarContent}
          </motion.aside>
        </>
      )}
    </>
  );
}