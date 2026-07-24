'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Loader2, GraduationCap } from 'lucide-react';
import { ToastProvider, useToast, PageHeader, Modal, DataTable, FormField, Toggle, ConfirmDialog, EmptyState } from '@/components/admin/ui';
import type { Column } from '@/components/admin/ui';
import { useAdminEducation } from '@/hooks/admin';
import type { Education } from '@/types';
import { cn } from '@/utils/helpers';

const educationSchema = z.object({
  institution: z.string().min(1, 'Institution is required'),
  degree: z.string().min(1, 'Degree is required'),
  field: z.string().min(1, 'Field of study is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().optional().default(''),
  current: z.boolean().default(false),
  description: z.string().optional().default(''),
  grade: z.string().optional().default(''),
  image: z.string().optional().default(''),
  order: z.coerce.number().int().min(0).default(0),
});

type EducationFormData = z.infer<typeof educationSchema>;

function EducationContent() {
  const toast = useToast();
  const {
    educationList,
    isLoading,
    error,
    fetchEducation,
    createEducation,
    updateEducation,
    deleteEducation,
  } = useAdminEducation();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Education | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    reset,
    formState: { errors },
  } = useForm<EducationFormData>({
    resolver: zodResolver(educationSchema),
    defaultValues: {
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      grade: '',
      image: '',
      order: 0,
    },
  });

  const isCurrent = watch('current');

  useEffect(() => {
    fetchEducation();
  }, [fetchEducation]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const openCreateModal = useCallback(() => {
    setEditingEducation(null);
    reset({
      institution: '',
      degree: '',
      field: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      grade: '',
      image: '',
      order: 0,
    });
    setModalOpen(true);
  }, [reset]);

  const openEditModal = useCallback(
    (entry: Education) => {
      setEditingEducation(entry);
      reset({
        institution: entry.institution,
        degree: entry.degree,
        field: entry.field,
        startDate: entry.startDate,
        endDate: entry.endDate ?? '',
        current: entry.current,
        description: entry.description ?? '',
        grade: entry.grade ?? '',
        image: entry.image ?? '',
        order: entry.order,
      });
      setModalOpen(true);
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: EducationFormData) => {
      setIsSubmitting(true);
      try {
        const payload: Partial<Education> = {
          institution: data.institution,
          degree: data.degree,
          field: data.field,
          startDate: data.startDate,
          endDate: data.current ? null : data.endDate || null,
          current: data.current,
          description: data.description || undefined,
          grade: data.grade || undefined,
          image: data.image || undefined,
          order: data.order,
        };

        if (editingEducation) {
          await updateEducation(editingEducation._id, payload);
          toast.success('Education Updated', `"${data.degree}" at ${data.institution} has been updated.`);
        } else {
          await createEducation(payload);
          toast.success('Education Created', `"${data.degree}" at ${data.institution} has been added.`);
        }

        setModalOpen(false);
        fetchEducation();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save education entry.';
        toast.error('Error', message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingEducation, createEducation, updateEducation, fetchEducation, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteEducation(deleteTarget._id);
      toast.success('Deleted', `"${deleteTarget.degree}" at "${deleteTarget.institution}" has been removed.`);
      setDeleteTarget(null);
      fetchEducation();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete education entry.';
      toast.error('Error', message);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteEducation, fetchEducation, toast]);

  const handleCurrentToggle = useCallback(
    (checked: boolean) => {
      setValue('current', checked);
      if (checked) {
        setValue('endDate', '');
      }
    },
    [setValue],
  );

  const columns: Column<Education>[] = [
    {
      key: 'institution',
      header: 'Institution',
      sortable: true,
      render: (val) => (
        <span className="font-medium text-white/85">{String(val)}</span>
      ),
    },
    {
      key: 'degree',
      header: 'Degree',
      sortable: true,
      render: (_val, row) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-white/70">{row.degree}</span>
          <span className="text-xs text-white/40">{row.field}</span>
        </div>
      ),
    },
    {
      key: 'startDate',
      header: 'Period',
      width: '200px',
      render: (_val, row) => (
        <span className="text-xs text-white/40">
          {row.startDate}{row.current ? ' - Present' : row.endDate ? ` - ${row.endDate}` : ''}
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

  if (isLoading && educationList.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Education"
        description="Manage your education history"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Education' },
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
            Add Education
          </button>
        }
      />

      {educationList.length === 0 && !isLoading ? (
        <EmptyState
          icon={GraduationCap}
          title="No education entries found"
          description="Get started by adding your education history."
          action={{
            label: 'Add Education',
            onClick: openCreateModal,
            icon: Plus,
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={educationList}
          keyExtractor={(row) => row._id}
          loading={isLoading}
          searchKeys={['institution', 'degree', 'field']}
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
        title={editingEducation ? 'Edit Education' : 'Add New Education'}
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
              ) : editingEducation ? (
                'Update Education'
              ) : (
                'Create Education'
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
              label="Institution"
              required
              error={errors.institution?.message}
              {...register('institution')}
              placeholder="e.g. Massachusetts Institute of Technology"
            />

            <FormField
              label="Degree"
              required
              error={errors.degree?.message}
              {...register('degree')}
              placeholder="e.g. Bachelor of Science"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Field of Study"
              required
              error={errors.field?.message}
              {...register('field')}
              placeholder="e.g. Computer Science"
            />

            <FormField
              label="Grade"
              error={errors.grade?.message}
              {...register('grade')}
              placeholder="e.g. 3.8 GPA"
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

            <FormField
              label="End Date"
              error={errors.endDate?.message}
              {...register('endDate')}
              type="month"
              disabled={isCurrent}
              placeholder={isCurrent ? 'Currently studying' : 'Select end date'}
            />
          </div>

          <Controller
            name="current"
            control={control}
            render={({ field }) => (
              <Toggle
                checked={field.value ?? false}
                onChange={(checked) => {
                  field.onChange(checked);
                  handleCurrentToggle(checked);
                }}
                label="Currently studying here"
                description="Sets the end date to Present"
              />
            )}
          />

          <FormField
            label="Image URL"
            error={errors.image?.message}
            {...register('image')}
            placeholder="https://example.com/university-logo.png"
          />

          <FormField
            label="Description"
            error={errors.description?.message}
            {...register('description')}
            rows={3}
            placeholder="Brief description of your education, achievements, or activities"
          />

          <FormField
            label="Order"
            error={errors.order?.message}
            {...register('order')}
            type="number"
            min={0}
            placeholder="0"
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Education"
        description={`Are you sure you want to delete "${deleteTarget?.degree}" at "${deleteTarget?.institution}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}

export default function EducationPage() {
  return (
    <ToastProvider>
      <EducationContent />
    </ToastProvider>
  );
}