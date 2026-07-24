'use client';

import { useEffect, useState, useCallback } from 'react';
import {
  Search,
  Loader2,
  Mail,
  MailOpen,
  Trash2,
  Eye,
  EyeOff,
  Inbox,
  ExternalLink,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import {
  ToastProvider,
  useToast,
  PageHeader,
  ConfirmDialog,
  EmptyState,
} from '@/components/admin/ui';
import { useAdminMessages } from '@/hooks/admin';
import type { ContactMessage } from '@/types';
import { cn } from '@/utils/helpers';

type FilterTab = 'all' | 'unread' | 'read';

function formatTimeAgo(dateString: string): string {
  const now = new Date();
  const date = new Date(dateString);
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);
  const diffWeeks = Math.floor(diffDays / 7);
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffDays / 365);

  if (diffSeconds < 60) return 'just now';
  if (diffMinutes < 60) return `${diffMinutes}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  if (diffWeeks < 4) return `${diffWeeks}w ago`;
  if (diffMonths < 12) return `${diffMonths}mo ago`;
  return `${diffYears}y ago`;
}

function formatFullDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

const FILTER_TABS: { key: FilterTab; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'unread', label: 'Unread' },
  { key: 'read', label: 'Read' },
];

function MessagesContent() {
  const toast = useToast();
  const {
    messages,
    isLoading,
    error,
    pagination,
    fetchMessages,
    markAsRead,
    markAsUnread,
    deleteMessage,
    searchMessages,
  } = useAdminMessages();

  const [filterTab, setFilterTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ContactMessage | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchQuery.trim());
    }, 400);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Fetch messages when filter tab or search changes
  useEffect(() => {
    if (selectedMessage) return;

    if (debouncedSearch) {
      searchMessages(debouncedSearch, 1);
    } else {
      const filters: Record<FilterTab, boolean | null> = {
        all: null,
        unread: false,
        read: true,
      };
      fetchMessages({ page: 1, read: filters[filterTab] });
    }
  }, [filterTab, debouncedSearch, fetchMessages, searchMessages, selectedMessage]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const unreadCount = messages.filter((m) => !m.read).length;

  const handlePageChange = useCallback(
    (newPage: number) => {
      if (debouncedSearch) {
        searchMessages(debouncedSearch, newPage);
      } else {
        const filters: Record<FilterTab, boolean | null> = {
          all: null,
          unread: false,
          read: true,
        };
        fetchMessages({ page: newPage, read: filters[filterTab] });
      }
    },
    [debouncedSearch, filterTab, fetchMessages, searchMessages],
  );

  const handleToggleRead = useCallback(
    async (msg: ContactMessage) => {
      try {
        if (msg.read) {
          await markAsUnread(msg._id);
          toast.success('Marked as unread', `"${msg.subject}" marked as unread.`);
        } else {
          await markAsRead(msg._id);
          toast.success('Marked as read', `"${msg.subject}" marked as read.`);
        }
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to update message status.';
        toast.error('Error', message);
      }
    },
    [markAsRead, markAsUnread, toast],
  );

  const handleSelectMessage = useCallback(
    async (msg: ContactMessage) => {
      setSelectedMessage(msg);
      if (!msg.read) {
        try {
          await markAsRead(msg._id);
        } catch {
          // Silently handle read status update failure on selection
        }
      }
    },
    [markAsRead],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteMessage(deleteTarget._id);
      toast.success('Deleted', `Message from "${deleteTarget.name}" has been removed.`);
      setDeleteTarget(null);
      if (selectedMessage?._id === deleteTarget._id) {
        setSelectedMessage(null);
      }
      // Re-fetch current page
      if (debouncedSearch) {
        searchMessages(debouncedSearch, pagination.page);
      } else {
        const filters: Record<FilterTab, boolean | null> = {
          all: null,
          unread: false,
          read: true,
        };
        fetchMessages({ page: pagination.page, read: filters[filterTab] });
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete message.';
      toast.error('Error', message);
    } finally {
      setIsDeleting(false);
    }
  }, [
    deleteTarget,
    selectedMessage,
    deleteMessage,
    toast,
    debouncedSearch,
    pagination.page,
    filterTab,
    searchMessages,
    fetchMessages,
  ]);

  const handleBackToList = useCallback(() => {
    setSelectedMessage(null);
  }, []);

  // --- Detail View ---
  if (selectedMessage) {
    return (
      <div className="flex flex-col gap-6">
        <PageHeader
          title="Messages"
          description="View and manage contact form submissions"
          breadcrumbs={[
            { label: 'Admin', href: '/admin/dashboard' },
            { label: 'Messages' },
            { label: selectedMessage.name },
          ]}
        />

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <button
            onClick={handleBackToList}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-3.5 py-2',
              'border border-white/[0.08] bg-white/[0.04] text-sm font-medium text-white/70',
              'transition-colors hover:bg-white/[0.08] hover:text-white/90',
              'focus:outline-none focus:ring-1 focus:ring-purple-500/20',
            )}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Messages
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleToggleRead(selectedMessage)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3.5 py-2',
                'border border-white/[0.08] bg-white/[0.04] text-sm font-medium text-white/70',
                'transition-colors hover:bg-white/[0.08] hover:text-white/90',
                'focus:outline-none focus:ring-1 focus:ring-purple-500/20',
              )}
            >
              {selectedMessage.read ? (
                <>
                  <EyeOff className="h-4 w-4" />
                  Mark Unread
                </>
              ) : (
                <>
                  <Eye className="h-4 w-4" />
                  Mark Read
                </>
              )}
            </button>

            <button
              onClick={() => setDeleteTarget(selectedMessage)}
              className={cn(
                'inline-flex items-center gap-2 rounded-lg px-3.5 py-2',
                'border border-red-500/20 bg-red-500/[0.06] text-sm font-medium text-red-400/80',
                'transition-colors hover:bg-red-500/10 hover:text-red-400',
                'focus:outline-none focus:ring-1 focus:ring-red-500/20',
              )}
            >
              <Trash2 className="h-4 w-4" />
              Delete
            </button>
          </div>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl p-6">
          {/* Header */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between mb-6">
            <div className="flex items-start gap-4 min-w-0">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-lg font-semibold text-purple-400">
                {selectedMessage.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0">
                <h2 className="text-xl font-semibold text-white/90 truncate">
                  {selectedMessage.name}
                </h2>
                <a
                  href={`mailto:${selectedMessage.email}`}
                  className="mt-1 text-sm text-purple-400 hover:text-purple-300 transition-colors truncate block"
                >
                  {selectedMessage.email}
                </a>
                <p className="mt-1 text-xs text-white/30">
                  {formatFullDate(selectedMessage.createdAt)}
                </p>
              </div>
            </div>
            <span
              className={cn(
                'shrink-0 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium',
                selectedMessage.read
                  ? 'bg-white/[0.04] text-white/40'
                  : 'bg-purple-500/15 text-purple-400',
              )}
            >
              {selectedMessage.read ? (
                <>
                  <MailOpen className="h-3 w-3" />
                  Read
                </>
              ) : (
                <>
                  <Mail className="h-3 w-3" />
                  Unread
                </>
              )}
            </span>
          </div>

          {/* Divider */}
          <div className="border-t border-white/[0.06] mb-6" />

          {/* Subject */}
          <h3 className="text-lg font-semibold text-white/85 mb-4">
            {selectedMessage.subject}
          </h3>

          {/* Message Body */}
          <div className="rounded-lg border border-white/[0.06] bg-white/[0.02] p-5">
            <p className="text-sm text-white/70 leading-relaxed whitespace-pre-wrap">
              {selectedMessage.message}
            </p>
          </div>
        </div>

        <ConfirmDialog
          open={!!deleteTarget}
          onClose={() => setDeleteTarget(null)}
          onConfirm={handleDelete}
          title="Delete Message"
          description={`Are you sure you want to delete the message from "${deleteTarget?.name}"? This action cannot be undone.`}
          confirmLabel="Delete"
          destructive
          loading={isDeleting}
        />
      </div>
    );
  }

  // --- List View ---
  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Messages"
        description="View and manage contact form submissions"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Messages' },
        ]}
      />

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        {FILTER_TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFilterTab(tab.key)}
            className={cn(
              'rounded-lg px-3.5 py-2 text-sm font-medium transition-all border',
              filterTab === tab.key
                ? 'bg-purple-500/15 text-purple-400 border-purple-500/20'
                : 'text-white/45 border-transparent hover:bg-white/[0.04] hover:text-white/60',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search messages..."
          className={cn(
            'w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-4',
            'text-sm text-white/90 placeholder:text-white/30',
            'transition-colors focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/20',
          )}
        />
      </div>

      {/* Stats Bar */}
      <div className="text-xs text-white/40">
        {pagination.totalItems} total messages · {unreadCount} unread
      </div>

      {/* Loading State */}
      {isLoading && messages.length === 0 ? (
        <div className="flex h-64 items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
        </div>
      ) : messages.length === 0 ? (
        <EmptyState
          icon={Inbox}
          title="No messages found"
          description={
            searchQuery
              ? 'Try adjusting your search query.'
              : filterTab !== 'all'
                ? `No ${filterTab} messages at the moment.`
                : 'No contact form submissions yet.'
          }
        />
      ) : (
        <>
          {/* Message List */}
          <div className="flex flex-col gap-2">
            {messages.map((msg) => (
              <div
                key={msg._id}
                onClick={() => handleSelectMessage(msg)}
                className={cn(
                  'group relative flex items-center gap-4 rounded-xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl p-4',
                  'cursor-pointer transition-all hover:border-white/[0.12] hover:bg-[#0f0f0f]/80',
                  'focus:outline-none focus:ring-1 focus:ring-purple-500/20',
                  !msg.read && 'border-purple-500/[0.08]',
                )}
              >
                {/* Avatar */}
                <div className="relative shrink-0">
                  <div
                    className={cn(
                      'flex h-10 w-10 items-center justify-center rounded-full text-sm font-semibold',
                      !msg.read
                        ? 'bg-purple-500/15 text-purple-400'
                        : 'bg-white/[0.04] text-white/40',
                    )}
                  >
                    {msg.name.charAt(0).toUpperCase()}
                  </div>
                  {/* Unread dot */}
                  {!msg.read && (
                    <div className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-purple-500 border-2 border-[#0a0a0a]" />
                  )}
                </div>

                {/* Content */}
                <div className="flex min-w-0 flex-1 flex-col gap-0.5">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        'text-sm font-medium truncate',
                        !msg.read ? 'text-white/85' : 'text-white/50',
                      )}
                    >
                      {msg.name}
                    </span>
                    <span className="text-[11px] text-white/30 shrink-0">
                      {formatTimeAgo(msg.createdAt)}
                    </span>
                  </div>
                  <span className="text-xs text-white/40 truncate">
                    {msg.subject}
                  </span>
                  <span className="text-xs text-white/25 truncate max-w-md">
                    {msg.message}
                  </span>
                </div>

                {/* Actions */}
                <div
                  className="flex shrink-0 items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={() => handleToggleRead(msg)}
                    className={cn(
                      'flex items-center justify-center rounded-lg p-2 transition-colors',
                      'text-white/40 hover:text-white/70 hover:bg-white/[0.06]',
                      'focus:outline-none focus:ring-1 focus:ring-purple-500/20',
                    )}
                    title={msg.read ? 'Mark as unread' : 'Mark as read'}
                  >
                    {msg.read ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>

                  <button
                    onClick={() => setDeleteTarget(msg)}
                    className={cn(
                      'flex items-center justify-center rounded-lg p-2 transition-colors',
                      'text-white/40 hover:text-red-400 hover:bg-red-500/10',
                      'focus:outline-none focus:ring-1 focus:ring-red-500/20',
                    )}
                    title="Delete message"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => handleSelectMessage(msg)}
                    className={cn(
                      'flex items-center justify-center rounded-lg p-2 transition-colors',
                      'text-white/40 hover:text-purple-400 hover:bg-purple-500/10',
                      'focus:outline-none focus:ring-1 focus:ring-purple-500/20',
                    )}
                    title="View message"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination */}
          {pagination.totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-white/30">
                Showing {(pagination.page - 1) * 10 + 1}
                {'–'}
                {Math.min(pagination.page * 10, pagination.totalItems)} of{' '}
                {pagination.totalItems}
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handlePageChange(pagination.page - 1)}
                  disabled={pagination.page <= 1 || isLoading}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg border border-white/[0.08]',
                    'bg-white/[0.04] px-3 py-1.5 text-sm text-white/60',
                    'transition-colors hover:bg-white/[0.08] hover:text-white/80',
                    'disabled:cursor-not-allowed disabled:opacity-30',
                    'focus:outline-none focus:ring-1 focus:ring-purple-500/20',
                  )}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                  Prev
                </button>
                <button
                  onClick={() => handlePageChange(pagination.page + 1)}
                  disabled={pagination.page >= pagination.totalPages || isLoading}
                  className={cn(
                    'inline-flex items-center gap-1 rounded-lg border border-white/[0.08]',
                    'bg-white/[0.04] px-3 py-1.5 text-sm text-white/60',
                    'transition-colors hover:bg-white/[0.08] hover:text-white/80',
                    'disabled:cursor-not-allowed disabled:opacity-30',
                    'focus:outline-none focus:ring-1 focus:ring-purple-500/20',
                  )}
                >
                  Next
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          )}
        </>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Message"
        description={`Are you sure you want to delete the message from "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}

export default function MessagesPage() {
  return (
    <ToastProvider>
      <MessagesContent />
    </ToastProvider>
  );
}