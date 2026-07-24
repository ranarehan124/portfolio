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
  Wrench,
  X,
  GripVertical,
  CheckCircle,
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
import { useAdminServices } from '@/hooks/admin';
import type { Service } from '@/types';
import { cn } from '@/utils/helpers';

const serviceSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  icon: z.string().optional().default(''),
  features: z.array(z.string()).default([]),
  order: z.coerce.number().int().min(0).default(0),
  isActive: z.boolean().default(true),
});

type ServiceFormData = z.infer<typeof serviceSchema>;

function ServicesContent() {
  const toast = useToast();
  const {
    services,
    isLoading,
    error,
    fetchServices,
    createService,
    updateService,
    deleteService,
  } = useAdminServices();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingService, setEditingService] = useState<Service | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Service | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ServiceFormData>({
    resolver: zodResolver(serviceSchema),
    defaultValues: {
      title: '',
      description: '',
      icon: '',
      features: [''],
      order: 0,
      isActive: true,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'features',
  } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const openCreateModal = useCallback(() => {
    setEditingService(null);
    reset({
      title: '',
      description: '',
      icon: '',
      features: [''],
      order: 0,
      isActive: true,
    });
    setModalOpen(true);
  }, [reset]);

  const openEditModal = useCallback(
    (service: Service) => {
      setEditingService(service);
      reset({
        title: service.title,
        description: service.description,
        icon: service.icon ?? '',
        features:
          service.features.length > 0 ? service.features : [''],
        order: service.order,
        isActive: true,
      });
      setModalOpen(true);
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: ServiceFormData) => {
      setIsSubmitting(true);
      try {
        const payload: Partial<Service> = {
          title: data.title,
          description: data.description,
          icon: data.icon || undefined,
          features: data.features.filter((f) => f.trim() !== ''),
          order: data.order,
        };

        if (editingService) {
          await updateService(editingService._id, payload);
          toast.success('Service Updated', `"${data.title}" has been updated.`);
        } else {
          await createService(payload);
          toast.success('Service Created', `"${data.title}" has been added.`);
        }

        setModalOpen(false);
        fetchServices();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save service.';
        toast.error('Error', message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingService, createService, updateService, fetchServices, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteService(deleteTarget._id);
      toast.success('Deleted', `"${deleteTarget.title}" has been removed.`);
      setDeleteTarget(null);
      fetchServices();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete service.';
      toast.error('Error', message);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteService, fetchServices, toast]);

  const columns: Column<Service>[] = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (val) => (
        <span className="font-medium text-white/85">{String(val)}</span>
      ),
    },
    {
      key: 'features',
      header: 'Features Count',
      width: '140px',
      render: (val) => {
        const count = Array.isArray(val) ? val.length : 0;
        return (
          <span className="inline-flex items-center gap-1.5 text-white/50">
            <span className="flex h-5 w-5 items-center justify-center rounded-md bg-purple-500/10 text-xs font-semibold text-purple-400">
              {count}
            </span>
            {count === 1 ? 'feature' : 'features'}
          </span>
        );
      },
    },
    {
      key: 'order',
      header: 'Active',
      width: '100px',
      render: () => (
        <span className="inline-flex items-center gap-1 text-emerald-400">
          <CheckCircle className="h-3.5 w-3.5" />
          <span className="text-xs">Yes</span>
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

  if (isLoading && services.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Services"
        description="Manage your service offerings"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Services' },
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
            Add Service
          </button>
        }
      />

      {services.length === 0 && !isLoading ? (
        <EmptyState
          icon={Wrench}
          title="No services yet"
          description="Get started by adding your first service offering."
          action={{
            label: 'Add Service',
            onClick: openCreateModal,
            icon: Plus,
          }}
        />
      ) : (
        <DataTable
          columns={columns}
          data={services}
          keyExtractor={(row) => row._id}
          loading={isLoading}
          searchKeys={['title', 'description']}
          rowActions={(row) => {
            const service = row;
            return (
              <>
                <button
                  onClick={() => openEditModal(service)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white/90 transition-colors rounded-md"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(service)}
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
        title={editingService ? 'Edit Service' : 'Add New Service'}
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
              ) : editingService ? (
                'Update Service'
              ) : (
                'Create Service'
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
              label="Title"
              required
              error={errors.title?.message}
              {...register('title')}
              placeholder="e.g. Web Development"
            />

            <div className="flex gap-4">
              <FormField
                label="Icon"
                error={errors.icon?.message}
                {...register('icon')}
                placeholder="e.g. SiReact"
                className="flex-1"
              />
              <FormField
                label="Order"
                error={errors.order?.message}
                {...register('order')}
                type="number"
                min={0}
                placeholder="0"
                className="w-24"
              />
            </div>
          </div>

          <FormField
            label="Description"
            required
            error={errors.description?.message}
            {...register('description')}
            rows={3}
            placeholder="Describe what this service includes"
          />

          {/* Dynamic Features List */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/60">
                Features
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
                    {...register(`features.${index}`)}
                    placeholder={`Feature ${index + 1}`}
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
            {errors.features && (
              <p className="text-xs text-red-400">
                {errors.features.message}
              </p>
            )}
          </div>

          <Controller
            name="isActive"
            control={control}
            render={({ field }) => (
              <Toggle
                checked={field.value ?? true}
                onChange={field.onChange}
                label="Active"
                description="Show this service on your portfolio"
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
        title="Delete Service"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}

export default function ServicesPage() {
  return (
    <ToastProvider>
      <ServicesContent />
    </ToastProvider>
  );
}