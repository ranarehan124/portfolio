import { useCallback, useEffect, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import Sidebar, { getInitialCollapsed, COLLAPSE_KEY } from './Sidebar';
import AdminHeader from './AdminHeader';
import { cn } from '@/utils/helpers';
import { authService } from '@/services';

const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] },
  },
  exit: {
    opacity: 0,
    y: -4,
    transition: { duration: 0.15 },
  },
};

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(getInitialCollapsed);

  const closeMobile = useCallback(() => setMobileOpen(false), []);
  const toggleMobile = useCallback(() => setMobileOpen((prev) => !prev), []);

  const toggleCollapse = useCallback(() => {
    setCollapsed((prev) => {
      const next = !prev;
      localStorage.setItem(COLLAPSE_KEY, String(next));
      return next;
    });
  }, []);

  const handleLogout = useCallback(() => {
    authService.logout();
    navigate('/admin/login');
  }, [navigate]);

  // Close mobile sidebar on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  // Fetch current user info on mount
  useEffect(() => {
    authService.fetchCurrentUser().catch(() => {});
  }, []);

  const sidebarWidth = collapsed ? 'lg:pl-[72px]' : 'lg:pl-[280px]';

  return (
    <div className="flex h-screen overflow-hidden bg-[#050505]">
      <Sidebar
        isOpen={mobileOpen}
        onClose={closeMobile}
        collapsed={collapsed}
        onToggleCollapse={toggleCollapse}
        onLogout={handleLogout}
      />

      <div
        className={cn(
          'flex flex-1 flex-col overflow-hidden transition-[padding] duration-300 ease-out',
          sidebarWidth,
        )}
      >
        <AdminHeader
          onMenuToggle={toggleMobile}
          onLogout={handleLogout}
        />

        <main className="flex-1 overflow-y-auto">
          <div className="admin-page-transition mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            <AnimatePresence mode="wait">
              <motion.div
                key={location.pathname}
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
              >
                <Outlet />
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}