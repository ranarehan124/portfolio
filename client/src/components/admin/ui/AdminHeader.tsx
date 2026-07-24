'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, Search, Settings, User, LogOut, Bell } from 'lucide-react';
import { cn } from '@/utils/helpers';

interface AdminHeaderProps {
  onMenuToggle: () => void;
  title?: string;
  searchValue?: string;
  onSearchChange?: (value: string) => void;
  searchPlaceholder?: string;
  notificationCount?: number;
  onNotificationClick?: () => void;
  onProfileClick?: () => void;
  onSettingsClick?: () => void;
  onLogoutClick?: () => void;
  className?: string;
}

export function AdminHeader({
  onMenuToggle,
  title,
  searchValue = '',
  onSearchChange,
  searchPlaceholder = 'Search...',
  notificationCount = 0,
  onNotificationClick,
  onProfileClick,
  onSettingsClick,
  onLogoutClick,
  className,
}: AdminHeaderProps) {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

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

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === 'k' &&
        (e.metaKey || e.ctrlKey) &&
        searchInputRef.current
      ) {
        e.preventDefault();
        searchInputRef.current.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header
      className={cn(
        'sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 px-4 sm:px-6',
        'border-b border-white/[0.06]',
        'bg-[#050505]/80 backdrop-blur-xl',
        className,
      )}
    >
      {/* Hamburger (mobile) */}
      <button
        onClick={onMenuToggle}
        className={cn(
          'flex h-9 w-9 items-center justify-center rounded-lg lg:hidden',
          'text-white/50 transition-colors',
          'hover:bg-white/[0.06] hover:text-white/80',
          'focus:outline-none focus:ring-1 focus:ring-primary/50',
        )}
        aria-label="Toggle sidebar"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Title area */}
      {title && (
        <div className="hidden sm:block min-w-0 flex-1">
          <h1 className="truncate text-sm font-semibold text-white/80">
            {title}
          </h1>
        </div>
      )}

      {/* Search */}
      {onSearchChange && (
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/25" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchValue}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder={searchPlaceholder}
            className={cn(
              'w-full rounded-lg border border-white/[0.06] bg-white/[0.03] py-2 pl-9 pr-16',
              'text-sm text-white/90 placeholder:text-white/25',
              'transition-colors focus:border-primary/30 focus:bg-white/[0.05] focus:outline-none focus:ring-1 focus:ring-primary/15',
            )}
          />
          <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden sm:inline-flex h-5 items-center gap-1 rounded border border-white/[0.08] bg-white/[0.04] px-1.5 text-[10px] font-medium text-white/25">
            <span className="text-xs">⌘</span>K
          </kbd>
        </div>
      )}

      {/* Spacer if no search */}
      {!onSearchChange && <div className="flex-1" />}

      {/* Actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell */}
        <button
          onClick={onNotificationClick}
          className={cn(
            'relative flex h-9 w-9 items-center justify-center rounded-lg',
            'text-white/50 transition-colors',
            'hover:bg-white/[0.06] hover:text-white/80',
            'focus:outline-none focus:ring-1 focus:ring-primary/50',
          )}
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          {notificationCount > 0 && (
            <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-primary px-1 text-[10px] font-bold text-white shadow-[0_0_8px_rgba(139,92,246,0.4)]">
              {notificationCount > 9 ? '9+' : notificationCount}
            </span>
          )}
        </button>

        {/* Avatar dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className={cn(
              'flex h-9 w-9 items-center justify-center rounded-full',
              'bg-gradient-to-br from-primary/30 to-accent/30',
              'border border-white/[0.1]',
              'text-sm font-semibold text-white/80',
              'transition-all hover:border-white/[0.2]',
              'focus:outline-none focus:ring-2 focus:ring-primary/30',
            )}
            aria-label="User menu"
            aria-expanded={dropdownOpen}
            aria-haspopup="true"
          >
            RT
          </button>

          <AnimatePresence>
            {dropdownOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -4 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -4 }}
                transition={{ duration: 0.15 }}
                className={cn(
                  'absolute right-0 top-full mt-2 w-48 overflow-hidden rounded-xl',
                  'border border-white/[0.08] bg-[#111]/95 shadow-glass-lg',
                  'backdrop-blur-xl py-1',
                )}
              >
                <div className="border-b border-white/[0.06] px-3 py-2.5">
                  <p className="text-sm font-medium text-white/80">Rehan Tahir</p>
                  <p className="text-xs text-white/35">admin@rehantahir.com</p>
                </div>

                <button
                  onClick={() => {
                    closeDropdown();
                    onProfileClick?.();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-sm',
                    'text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80',
                  )}
                >
                  <User className="h-4 w-4" />
                  Profile
                </button>

                <button
                  onClick={() => {
                    closeDropdown();
                    onSettingsClick?.();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-sm',
                    'text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/80',
                  )}
                >
                  <Settings className="h-4 w-4" />
                  Settings
                </button>

                <div className="mx-2 my-1 border-t border-white/[0.06]" />

                <button
                  onClick={() => {
                    closeDropdown();
                    onLogoutClick?.();
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 px-3 py-2 text-sm',
                    'text-red-400/70 transition-colors hover:bg-red-500/[0.06] hover:text-red-400',
                  )}
                >
                  <LogOut className="h-4 w-4" />
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