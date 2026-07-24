'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Briefcase,
  X,
  GripVertical,
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
import { useAdminExperience } from '@/hooks/admin';
import type { Experience } from '@/types';
import { cn, formatDateRange } from '@/utils/helpers';

const experienceSchema = z.object({
  company: z.string().min(1, 'Company is required'),
  role: z.string().min(1, 'Role is required'),
  location: z.string().min(1, 'Location is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().default(''),
  current: z.boolean().default(false),
  description: z.string().min(1, 'Description is required'),
  highlights: z.array(z.string()).default([]),
  order: z.coerce.number().int().min(0).default(0),
});

type ExperienceFormData = z.infer<typeof experienceSchema>;

function ExperienceContent() {
  const toast = useToast();
  const {
    experience,
    isLoading,
    error,
    fetchExperience,
    createExperience,
    updateExperience,
    deleteExperience,
  } = useAdminExperience();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEntry, setEditingEntry] = useState<Experience | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Experience | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    reset,
    formState: { errors },
  } = useForm<ExperienceFormData>({
    resolver: zodResolver(experienceSchema),
    defaultValues: {
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [''],
      order: 0,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'highlights',
  } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

  const isCurrent = watch('current');

  useEffect(() => {
    fetchExperience();
  }, [fetchExperience]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const openCreateModal = useCallback(() => {
    setEditingEntry(null);
    reset({
      company: '',
      role: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      highlights: [''],
      order: 0,
    });
    setModalOpen(true);
  }, [reset]);

  const openEditModal = useCallback(
    (entry: Experience) => {
      setEditingEntry(entry);
      reset({
        company: entry.company,
        role: entry.role,
        location: entry.location,
        startDate: entry.startDate,
        endDate: entry.endDate ?? '',
        current: entry.current,
        description: entry.description,
        highlights:
          entry.highlights.length > 0 ? entry.highlights : [''],
        order: entry.order,
      });
      setModalOpen(true);
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: ExperienceFormData) => {
      setIsSubmitting(true);
      try {
        const payload: Partial<Experience> = {
          company: data.company,
          role: data.role,
          location: data.location,
          startDate: data.startDate,
          endDate: data.current ? null : data.endDate || null,
          current: data.current,
          description: data.description,
          highlights: data.highlights.filter((h) => h.trim() !== ''),
          order: data.order,
        };

        if (editingEntry) {
          await updateExperience(editingEntry._id, payload);
          toast.success('Experience Updated', `"${data.role}" at ${data.company} has been updated.`);
        } else {
          await createExperience(payload);
          toast.success('Experience Created', `"${data.role}" at ${data.company} has been added.`);
        }

        setModalOpen(false);
        fetchExperience();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save experience.';
        toast.error('Error', message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingEntry, createExperience, updateExperience, fetchExperience, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteExperience(deleteTarget._id);
      toast.success('Deleted', `"${deleteTarget.role}" has been removed.`);
      setDeleteTarget(null);
      fetchExperience();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete experience.';
      toast.error('Error', message);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteExperience, fetchExperience, toast]);

  const columns: Column<Experience>[] = [
    {
      key: 'company',
      header: 'Company',
      sortable: true,
      render: (val) => (
        <span className="font-medium text-white/85">{String(val)}</span>
      ),
    },
    {
      key: 'role',
      header: 'Role',
      sortable: true,
      render: (val) => (
        <span className="text-white/70">{String(val)}</span>
      ),
    },
    {
      key: 'location',
      header: 'Location',
      sortable: true,
      width: '140px',
      render: (val) => (
        <span className="text-white/50">{String(val)}</span>
      ),
    },
    {
      key: 'startDate',
      header: 'Date Range',
      width: '200px',
      render: (_val, row) => (
        <span className="text-xs text-white/50">
          {formatDateRange(row.startDate, row.endDate)}
        </span>
      ),
    },
    {
      key: 'current',
      header: 'Current',
      width: '100px',
      render: (val) =>
        Boolean(val) ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/15 px-2 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
            Active
          </span>
        ) : (
          <span className="text-xs text-white/30">Past</span>
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

  if (isLoading && experience.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Experience"
        description="Manage your work experience"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Experience' },
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
            Add Experience
          </button>
        }
      />

      {experience.length === 0 && !isLoading ? (
        <EmptyState
          icon={Briefcase}
          title="No experience entries"
          description="Get started by adding your work experience."
          action={{
            label: 'Add Experience',
            onClick: openCreateModal,
            icon: Plus,
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={experience}
          keyExtractor={(row) => row._id}
          loading={isLoading}
          searchKeys={['company', 'role', 'location']}
          rowActions={(row) => {
            const entry = row;
            return (
              <>
                <button
                  onClick={() => openEditModal(entry)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white/90 transition-colors rounded-md"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(entry)}
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
        title={editingEntry ? 'Edit Experience' : 'Add New Experience'}
        size="lg"
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
              ) : editingEntry ? (
                'Update Experience'
              ) : (
                'Create Experience'
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
              label="Company"
              required
              error={errors.company?.message}
              {...register('company')}
              placeholder="e.g. Google"
            />

            <FormField
              label="Role"
              required
              error={errors.role?.message}
              {...register('role')}
              placeholder="e.g. Senior Developer"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Location"
              required
              error={errors.location?.message}
              {...register('location')}
              placeholder="e.g. San Francisco, CA"
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

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Start Date"
              required
              error={errors.startDate?.message}
              {...register('startDate')}
              type="month"
            />

            <div className="flex flex-col gap-1.5">
              <Controller
                name="current"
                control={control}
                render={({ field }) => (
                  <Toggle
                    checked={field.value ?? false}
                    onChange={field.onChange}
                    label="Currently Working Here"
                    description="Set end date to Present"
                  />
                )}
              />
              {!isCurrent && (
                <FormField
                  label="End Date"
                  error={errors.endDate?.message}
                  {...register('endDate')}
                  type="month"
                  className="mt-2"
                />
              )}
            </div>
          </div>

          <FormField
            label="Description"
            required
            error={errors.description?.message}
            {...register('description')}
            rows={3}
            placeholder="Brief description of your role and responsibilities"
          />

          {/* Dynamic Highlights */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/60">
                Key Highlights
              </label>
              <button
                type="button"
                onClick={() => append('')}
                className={cn(
                  'inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs font-medium',
                  'text-purple-400 transition-colors',
                  'hover:bg-purple-500/10',
                )}
              >
                <Plus className="h-3 w-3" />
                Add
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 shrink-0 text-white/20" />
                  <input
                    {...register(`highlights.${index}`)}
                    placeholder={`Highlight ${index + 1}`}
                    className={cn(
                      'w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2',
                      'text-sm text-white/90 placeholder:text-white/25',
                      'transition-colors focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/20',
                    )}
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-md',
                        'text-white/30 transition-colors',
                        'hover:bg-red-500/10 hover:text-red-400',
                      )}
                    >
                      <X className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            {errors.highlights && (
              <p className="text-xs text-red-400">
                {errors.highlights.message}
              </p>
            )}
          </div>
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Experience"
        description={`Are you sure you want to delete "${deleteTarget?.role}" at "${deleteTarget?.company}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}

export default function ExperiencePage() {
  return (
    <ToastProvider>
      <ExperienceContent />
    </ToastProvider>
  );
}