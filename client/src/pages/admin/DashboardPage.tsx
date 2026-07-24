'use client';

import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Layers,
  Code,
  Mail,
  Eye,
  Plus,
  MessageSquare,
  Sparkles,
  Cpu,
  ArrowRight,
  Loader2,
  AlertCircle,
} from 'lucide-react';
import { ToastProvider, useToast, StatCard, EmptyState } from '@/components/admin/ui';
import { useAdminDashboard, useAdminMessages } from '@/hooks/admin';
import { cn } from '@/utils/helpers';

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const staggerItem = {
  hidden: { opacity: 0, y: 16, scale: 0.97 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function DashboardContent() {
  const navigate = useNavigate();
  const toast = useToast();
  const { stats, isLoading, error, fetchDashboardStats } = useAdminDashboard();
  const { messages, fetchMessages } = useAdminMessages();

  useEffect(() => {
    fetchDashboardStats();
    fetchMessages({ limit: 5 });
  }, [fetchDashboardStats, fetchMessages]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const recentMessages = messages.slice(0, 5);

  const quickActions = [
    {
      label: 'Add Project',
      icon: Plus,
      href: '/admin/projects',
      color: 'text-purple-400',
      bg: 'bg-purple-500/10',
      borderHover: 'hover:border-purple-500/20',
    },
    {
      label: 'View Messages',
      icon: MessageSquare,
      href: '/admin/messages',
      color: 'text-amber-400',
      bg: 'bg-amber-500/10',
      borderHover: 'hover:border-amber-500/20',
    },
    {
      label: 'Edit Hero',
      icon: Sparkles,
      href: '/admin/hero',
      color: 'text-emerald-400',
      bg: 'bg-emerald-500/10',
      borderHover: 'hover:border-emerald-500/20',
    },
    {
      label: 'Manage Skills',
      icon: Cpu,
      href: '/admin/skills',
      color: 'text-cyan-400',
      bg: 'bg-cyan-500/10',
      borderHover: 'hover:border-cyan-500/20',
    },
  ];

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error && !stats) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Failed to load dashboard"
        description="Could not fetch dashboard statistics. Please try again."
        action={{
          label: 'Retry',
          onClick: () => fetchDashboardStats(),
        }}
      />
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-8"
    >
      {/* Stat Cards */}
      <motion.div variants={staggerItem}>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Layers}
            label="Total Projects"
            value={stats?.totalProjects ?? 0}
            iconColor="text-purple-400"
            iconBg="bg-purple-500/10"
          />
          <StatCard
            icon={Code}
            label="Total Skills"
            value={stats?.totalSkills ?? 0}
            iconColor="text-blue-400"
            iconBg="bg-blue-500/10"
          />
          <StatCard
            icon={Mail}
            label="Unread Messages"
            value={stats?.unreadMessages ?? 0}
            iconColor="text-amber-400"
            iconBg="bg-amber-500/10"
          />
          <StatCard
            icon={Eye}
            label="Profile Views"
            value={0}
            iconColor="text-emerald-400"
            iconBg="bg-emerald-500/10"
          />
        </div>
      </motion.div>

      {/* Recent Messages */}
      <motion.div
        variants={staggerItem}
        className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl"
      >
        <div className="flex items-center justify-between border-b border-white/[0.06] px-6 py-4">
          <div>
            <h2 className="text-base font-semibold text-white">Recent Messages</h2>
            <p className="mt-0.5 text-xs text-white/40">
              Latest contact form submissions
            </p>
          </div>
          <button
            onClick={() => navigate('/admin/messages')}
            className={cn(
              'flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium',
              'text-white/50 transition-colors hover:bg-white/[0.04] hover:text-white/70',
            )}
          >
            View all
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {recentMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center px-6 py-12">
            <Mail className="mb-3 h-8 w-8 text-white/15" />
            <p className="text-sm text-white/40">No messages yet</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.04]">
            {recentMessages.map((msg) => (
              <button
                key={msg._id}
                onClick={() => navigate('/admin/messages')}
                className={cn(
                  'flex w-full items-start gap-4 px-6 py-4 text-left transition-colors',
                  'hover:bg-white/[0.02]',
                )}
              >
                <div className="relative mt-1.5 shrink-0">
                  <div
                    className={cn(
                      'flex h-9 w-9 items-center justify-center rounded-full text-sm font-semibold',
                      msg.read
                        ? 'bg-white/[0.04] text-white/40'
                        : 'bg-purple-500/15 text-purple-400',
                    )}
                  >
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  {!msg.read && (
                    <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-[#0a0a0a] bg-purple-500" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center justify-between gap-4">
                    <p
                      className={cn(
                        'text-sm font-medium truncate',
                        msg.read ? 'text-white/50' : 'text-white/90',
                      )}
                    >
                      {msg.name}
                    </p>
                    <span className="shrink-0 text-[11px] text-white/30">
                      {formatTimeAgo(msg.createdAt)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-white/40 truncate">
                    {msg.subject}
                  </p>
                  <p className="mt-1 text-xs text-white/25 truncate max-w-md">
                    {msg.message}
                  </p>
                </div>
              </button>
            ))}
          </div>
        )}
      </motion.div>

      {/* Quick Actions */}
      <motion.div variants={staggerItem}>
        <h2 className="mb-4 text-base font-semibold text-white/70">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <motion.button
                key={action.label}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(action.href)}
                className={cn(
                  'group flex flex-col items-center gap-3 rounded-xl p-5',
                  'border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl',
                  'transition-colors',
                  action.borderHover,
                )}
              >
                <div
                  className={cn(
                    'flex h-10 w-10 items-center justify-center rounded-xl transition-transform',
                    'group-hover:scale-110',
                    action.bg,
                  )}
                >
                  <Icon className={cn('h-5 w-5', action.color)} />
                </div>
                <span className="text-xs font-medium text-white/60 group-hover:text-white/80 transition-colors">
                  {action.label}
                </span>
              </motion.button>
            );
          })}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function DashboardPage() {
  return (
    <ToastProvider>
      <DashboardContent />
    </ToastProvider>
  );
}