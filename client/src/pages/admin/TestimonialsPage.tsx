'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  Loader2,
  MessageSquareQuote,
} from 'lucide-react';
import {
  ToastProvider,
  useToast,
  PageHeader,
  Modal,
  DataTable,
  FormField,
  Toggle,
  ConfirmDialog,
  EmptyState,
} from '@/components/admin/ui';
import type { Column } from '@/components/admin/ui';
import { useAdminTestimonials } from '@/hooks/admin';
import type { Testimonial } from '@/types';
import { cn } from '@/utils/helpers';

const testimonialSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  role: z.string().min(1, 'Role is required'),
  company: z.string().optional().default(''),
  avatar: z.string().optional().default(''),
  content: z.string().min(1, 'Testimonial content is required'),
  rating: z.coerce.number().int().min(1).max(5).default(5),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
});

type TestimonialFormData = z.infer<typeof testimonialSchema>;

function TestimonialsContent() {
  const toast = useToast();
  const {
    testimonials,
    isLoading,
    error,
    fetchTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial,
  } = useAdminTestimonials();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<Testimonial | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Testimonial | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<TestimonialFormData>({
    resolver: zodResolver(testimonialSchema),
    defaultValues: {
      name: '',
      role: '',
      company: '',
      avatar: '',
      content: '',
      rating: 5,
      featured: false,
      order: 0,
    },
  });

  useEffect(() => {
    fetchTestimonials();
  }, [fetchTestimonials]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const openCreateModal = useCallback(() => {
    setEditingTestimonial(null);
    reset({
      name: '',
      role: '',
      company: '',
      avatar: '',
      content: '',
      rating: 5,
      featured: false,
      order: 0,
    });
    setModalOpen(true);
  }, [reset]);

  const openEditModal = useCallback(
    (testimonial: Testimonial) => {
      setEditingTestimonial(testimonial);
      reset({
        name: testimonial.name,
        role: testimonial.role,
        company: testimonial.company ?? '',
        avatar: testimonial.avatar ?? '',
        content: testimonial.content,
        rating: testimonial.rating,
        featured: testimonial.featured,
        order: testimonial.order,
      });
      setModalOpen(true);
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: TestimonialFormData) => {
      setIsSubmitting(true);
      try {
        const payload: Partial<Testimonial> = {
          name: data.name,
          role: data.role,
          company: data.company || undefined,
          avatar: data.avatar || undefined,
          content: data.content,
          rating: data.rating,
          featured: data.featured,
          order: data.order,
        };

        if (editingTestimonial) {
          await updateTestimonial(editingTestimonial._id, payload);
          toast.success('Testimonial Updated', `"${data.name}" has been updated.`);
        } else {
          await createTestimonial(payload);
          toast.success('Testimonial Created', `"${data.name}" has been added.`);
        }

        setModalOpen(false);
        fetchTestimonials();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save testimonial.';
        toast.error('Error', message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingTestimonial, createTestimonial, updateTestimonial, fetchTestimonials, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteTestimonial(deleteTarget._id);
      toast.success('Deleted', `"${deleteTarget.name}" has been removed.`);
      setDeleteTarget(null);
      fetchTestimonials();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete testimonial.';
      toast.error('Error', message);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteTestimonial, fetchTestimonials, toast]);

  const handleToggleFeatured = useCallback(
    async (testimonial: Testimonial, checked: boolean) => {
      try {
        await updateTestimonial(testimonial._id, { featured: checked });
      } catch {
        toast.error('Error', 'Failed to update featured status.');
      }
    },
    [updateTestimonial, toast],
  );

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {Array.from({ length: 5 }, (_, i) => (
          <span
            key={i}
            className={cn(
              'text-sm',
              i < rating ? 'text-amber-400' : 'text-gray-600',
            )}
          >
            ★
          </span>
        ))}
      </div>
    );
  };

  const filteredTestimonials = testimonials.filter((t) => {
    const matchesSearch =
      !searchQuery ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (t.company ?? '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSearch;
  });

  const columns: Column<Testimonial>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (_val, row) => (
        <div className="flex items-center gap-3">
          {row.avatar ? (
            <div className="h-8 w-8 shrink-0 overflow-hidden rounded-full bg-white/[0.04]">
              <img
                src={row.avatar}
                alt={row.name}
                className="h-full w-full object-cover"
              />
            </div>
          ) : (
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-500/15 text-xs font-medium text-purple-400">
              {row.name.charAt(0).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-medium text-white/85 truncate max-w-[180px]">
              {row.name}
            </span>
            <span className="text-xs text-white/40 truncate max-w-[180px]">
              {row.role}
            </span>
          </div>
        </div>
      ),
    },
    {
      key: 'rating',
      header: 'Rating',
      width: '120px',
      render: (val) => renderStars(Number(val)),
    },
    {
      key: 'featured',
      header: 'Featured',
      width: '100px',
      render: (val, row) => (
        <Toggle
          checked={Boolean(val)}
          onChange={(checked) => handleToggleFeatured(row, checked)}
          size="sm"
        />
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

  if (isLoading && testimonials.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Testimonials"
        description="Manage client testimonials"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Testimonials' },
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
            Add Testimonial
          </button>
        }
      />

      {/* Search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search testimonials..."
            className={cn(
              'w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-4',
              'text-sm text-white/90 placeholder:text-white/30',
              'transition-colors focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/20',
            )}
          />
        </div>
      </div>

      {/* Table or Empty */}
      {filteredTestimonials.length === 0 && !isLoading ? (
        <EmptyState
          icon={MessageSquareQuote}
          title="No testimonials found"
          description={
            searchQuery
              ? 'Try adjusting your search query.'
              : 'Get started by adding your first testimonial.'
          }
          action={
            !searchQuery
              ? { label: 'Add Testimonial', onClick: openCreateModal, icon: Plus }
              : undefined
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredTestimonials}
          keyExtractor={(row) => row._id}
          loading={isLoading}
          searchKeys={['name', 'role', 'content']}
          rowActions={(row) => {
            const testimonial = row;
            return (
              <>
                <button
                  onClick={() => openEditModal(testimonial)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white/90 transition-colors rounded-md"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(testimonial)}
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
        title={editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
        description={
          editingTestimonial
            ? 'Update testimonial details below.'
            : 'Fill in the details for the new testimonial.'
        }
        size="xl"
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
              ) : editingTestimonial ? (
                'Update Testimonial'
              ) : (
                'Create Testimonial'
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
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Name"
              required
              error={errors.name?.message}
              {...register('name')}
              placeholder="John Doe"
            />

            <FormField
              label="Role"
              required
              error={errors.role?.message}
              {...register('role')}
              placeholder="Software Engineer"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Company"
              error={errors.company?.message}
              {...register('company')}
              placeholder="Acme Inc."
            />

            <FormField
              label="Avatar URL"
              error={errors.avatar?.message}
              {...register('avatar')}
              placeholder="https://example.com/avatar.jpg"
            />
          </div>

          <FormField
            label="Content"
            required
            error={errors.content?.message}
            {...register('content')}
            rows={4}
            placeholder="Write the testimonial content here..."
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Rating"
              error={errors.rating?.message}
              {...register('rating')}
              type="number"
              min={1}
              max={5}
              placeholder="5"
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

          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Toggle
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Featured Testimonial"
                description="Display this testimonial in the featured section"
              />
            )}
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Testimonial"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}

export default function TestimonialsPage() {
  return (
    <ToastProvider>
      <TestimonialsContent />
    </ToastProvider>
  );
}