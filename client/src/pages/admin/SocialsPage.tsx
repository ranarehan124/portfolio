'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Share2,
  ExternalLink,
} from 'lucide-react';
import {
  ToastProvider,
  useToast,
  PageHeader,
  Modal,
  DataTable,
  FormField,
  ConfirmDialog,
  EmptyState,
} from '@/components/admin/ui';
import type { Column } from '@/components/admin/ui';
import { useAdminSocials } from '@/hooks/admin';
import type { SocialLink } from '@/types';
import { cn, truncate } from '@/utils/helpers';

const socialSchema = z.object({
  platform: z.string().min(1, 'Platform is required'),
  url: z.string().min(1, 'URL is required').url('Must be a valid URL'),
  icon: z.string().optional().default(''),
  order: z.coerce.number().int().min(0).default(0),
});

type SocialFormData = z.infer<typeof socialSchema>;

const platformOptions = [
  { value: 'github', label: 'GitHub' },
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'email', label: 'Email' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'twitter', label: 'Twitter/X' },
  { value: 'behance', label: 'Behance' },
  { value: 'dribbble', label: 'Dribbble' },
  { value: 'youtube', label: 'YouTube' },
];

const platformColors: Record<string, string> = {
  github: 'bg-white/[0.06] text-white/70',
  linkedin: 'bg-blue-500/15 text-blue-400',
  instagram: 'bg-pink-500/15 text-pink-400',
  email: 'bg-amber-500/15 text-amber-400',
  facebook: 'bg-blue-600/15 text-blue-300',
  twitter: 'bg-sky-500/15 text-sky-400',
  behance: 'bg-blue-500/15 text-blue-300',
  dribbble: 'bg-pink-500/15 text-pink-300',
  youtube: 'bg-red-500/15 text-red-400',
};

function SocialsContent() {
  const toast = useToast();
  const {
    socials,
    isLoading,
    error,
    fetchSocials,
    createSocial,
    updateSocial,
    deleteSocial,
  } = useAdminSocials();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSocial, setEditingSocial] = useState<SocialLink | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SocialLink | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SocialFormData>({
    resolver: zodResolver(socialSchema),
    defaultValues: {
      platform: 'github',
      url: '',
      icon: '',
      order: 0,
    },
  });

  useEffect(() => {
    fetchSocials();
  }, [fetchSocials]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const openCreateModal = useCallback(() => {
    setEditingSocial(null);
    reset({
      platform: 'github',
      url: '',
      icon: '',
      order: 0,
    });
    setModalOpen(true);
  }, [reset]);

  const openEditModal = useCallback(
    (social: SocialLink) => {
      setEditingSocial(social);
      reset({
        platform: social.platform,
        url: social.url,
        icon: social.icon ?? '',
        order: social.order,
      });
      setModalOpen(true);
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: SocialFormData) => {
      setIsSubmitting(true);
      try {
        const payload: Partial<SocialLink> = {
          platform: data.platform,
          url: data.url,
          icon: data.icon || undefined,
          order: data.order,
        };

        if (editingSocial) {
          await updateSocial(editingSocial._id, payload);
          toast.success('Social Link Updated', `${data.platform} link has been updated.`);
        } else {
          await createSocial(payload);
          toast.success('Social Link Created', `${data.platform} link has been added.`);
        }

        setModalOpen(false);
        fetchSocials();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save social link.';
        toast.error('Error', message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingSocial, createSocial, updateSocial, fetchSocials, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteSocial(deleteTarget._id);
      toast.success('Deleted', `${deleteTarget.platform} link has been removed.`);
      setDeleteTarget(null);
      fetchSocials();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete social link.';
      toast.error('Error', message);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteSocial, fetchSocials, toast]);

  const columns: Column<SocialLink>[] = [
    {
      key: 'platform',
      header: 'Platform',
      sortable: true,
      render: (val) => {
        const platform = String(val).toLowerCase();
        const colorClass =
          platformColors[platform] ?? 'bg-white/[0.06] text-white/50';
        return (
          <span
            className={cn(
              'inline-flex rounded-md border border-white/[0.06] px-2.5 py-1 text-xs font-medium capitalize',
              colorClass,
            )}
          >
            {String(val)}
          </span>
        );
      },
    },
    {
      key: 'url',
      header: 'URL',
      render: (val) => (
        <div className="flex items-center gap-2">
          <span className="max-w-[200px] truncate text-white/50 text-xs font-mono">
            {truncate(String(val), 40)}
          </span>
          <a
            href={String(val)}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="shrink-0 text-white/20 hover:text-white/50 transition-colors"
          >
            <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      ),
    },
    {
      key: 'icon',
      header: 'Icon',
      width: '100px',
      render: (val) => (
        <span className="font-mono text-xs text-white/40">
          {val ? String(val) : '—'}
        </span>
      ),
    },
    {
      key: 'order',
      header: 'Order',
      sortable: true,
      width: '80px',
      render: (val) => (
        <span className="text-white/50 tabular-nums">{String(val)}</span>
      ),
    },
  ];

  if (isLoading && socials.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Social Links"
        description="Manage your social media and contact links"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Socials' },
        ]}
        actions={
          <button
            onClick={openCreateModal}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2.5',
              'bg-purple-600 text-sm font-medium text-white transition-all',
              'hover:bg-purple-500 shadow-[0_0_16px_rgba(139,92,246,0.2)]',
              'hover:shadow-[0_0_24px_rgba(139,92,246,0.3)]',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/40',
            )}
          >
            <Plus className="h-4 w-4" />
            Add Social Link
          </button>
        }
      />

      {socials.length === 0 && !isLoading ? (
        <EmptyState
          icon={Share2}
          title="No social links yet"
          description="Add your social media profiles and contact links."
          action={{
            label: 'Add Social Link',
            onClick: openCreateModal,
            icon: Plus,
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={socials}
          keyExtractor={(row) => row._id}
          loading={isLoading}
          searchKeys={['platform', 'url']}
          rowActions={(row) => {
            const social = row;
            return (
              <>
                <button
                  onClick={() => openEditModal(social)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white/90 transition-colors rounded-md"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(social)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-400/70 hover:bg-red-500/10 hover:text-red-400 transition-colors rounded-md"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </button>
              </>
            );
          }}
        />
      )}

      {/* Create / Edit Modal */}
      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingSocial ? 'Edit Social Link' : 'Add New Social Link'}
        size="md"
        footer={
          <>
            <button
              onClick={() => setModalOpen(false)}
              disabled={isSubmitting}
              className={cn(
                'rounded-lg border border-white/[0.08] bg-white/[0.04] px-4 py-2',
                'text-sm font-medium text-white/70 transition-colors',
                'hover:bg-white/[0.08] hover:text-white/90',
                'disabled:cursor-not-allowed disabled:opacity-50',
              )}
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit(onSubmit)}
              disabled={isSubmitting}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium text-white transition-all',
                'bg-purple-600 hover:bg-purple-500',
                'shadow-[0_0_16px_rgba(139,92,246,0.2)]',
                'disabled:cursor-not-allowed disabled:opacity-50',
                'focus:outline-none focus:ring-2 focus:ring-purple-500/40',
              )}
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Saving...
                </span>
              ) : editingSocial ? (
                'Update Link'
              ) : (
                'Create Link'
              )}
            </button>
          </>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit(onSubmit)();
          }}
          className="flex flex-col gap-4"
        >
          <FormField
            label="Platform"
            required
            error={errors.platform?.message}
            {...register('platform')}
            options={platformOptions}
          />

          <FormField
            label="URL"
            required
            error={errors.url?.message}
            {...register('url')}
            placeholder="https://github.com/username"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Icon"
              error={errors.icon?.message}
              {...register('icon')}
              placeholder="e.g. SiGithub"
              helperText="React-icons class name"
            />

            <FormField
              label="Order"
              error={errors.order?.message}
              {...register('order')}
              type="number"
              min={0}
              placeholder="0"
            />
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Social Link"
        description={`Are you sure you want to delete the "${deleteTarget?.platform}" link? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}

export default function SocialsPage() {
  return (
    <ToastProvider>
      <SocialsContent />
    </ToastProvider>
  );
}