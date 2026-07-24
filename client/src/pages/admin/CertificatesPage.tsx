'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Plus, Pencil, Trash2, Search, Loader2, Award } from 'lucide-react';
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
import { useAdminCertificates } from '@/hooks/admin';
import type { Certificate } from '@/types';
import { cn } from '@/utils/helpers';

const certificateSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  issuer: z.string().min(1, 'Issuer is required'),
  date: z.string().min(1, 'Date is required'),
  credentialUrl: z.string().optional().default(''),
  image: z.string().optional().default(''),
  description: z.string().optional().default(''),
  order: z.coerce.number().int().min(0).default(0),
});

type CertificateFormData = z.infer<typeof certificateSchema>;

function CertificatesContent() {
  const toast = useToast();
  const {
    certificates,
    isLoading,
    error,
    fetchCertificates,
    createCertificate,
    updateCertificate,
    deleteCertificate,
  } = useAdminCertificates();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCertificate, setEditingCertificate] = useState<Certificate | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Certificate | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CertificateFormData>({
    resolver: zodResolver(certificateSchema),
    defaultValues: {
      title: '',
      issuer: '',
      date: '',
      credentialUrl: '',
      image: '',
      description: '',
      order: 0,
    },
  });

  useEffect(() => {
    fetchCertificates();
  }, [fetchCertificates]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const openCreateModal = useCallback(() => {
    setEditingCertificate(null);
    reset({
      title: '',
      issuer: '',
      date: '',
      credentialUrl: '',
      image: '',
      description: '',
      order: 0,
    });
    setModalOpen(true);
  }, [reset]);

  const openEditModal = useCallback(
    (certificate: Certificate) => {
      setEditingCertificate(certificate);
      reset({
        title: certificate.title,
        issuer: certificate.issuer,
        date: certificate.date,
        credentialUrl: certificate.credentialUrl ?? '',
        image: certificate.image ?? '',
        description: certificate.description ?? '',
        order: certificate.order,
      });
      setModalOpen(true);
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: CertificateFormData) => {
      setIsSubmitting(true);
      try {
        const payload: Partial<Certificate> = {
          title: data.title,
          issuer: data.issuer,
          date: data.date,
          credentialUrl: data.credentialUrl || undefined,
          image: data.image || undefined,
          description: data.description || undefined,
          order: data.order,
        };

        if (editingCertificate) {
          await updateCertificate(editingCertificate._id, payload);
          toast.success('Certificate Updated', `"${data.title}" has been updated.`);
        } else {
          await createCertificate(payload);
          toast.success('Certificate Created', `"${data.title}" has been added.`);
        }

        setModalOpen(false);
        fetchCertificates();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save certificate.';
        toast.error('Error', message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingCertificate, createCertificate, updateCertificate, fetchCertificates, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteCertificate(deleteTarget._id);
      toast.success('Deleted', `"${deleteTarget.title}" has been removed.`);
      setDeleteTarget(null);
      fetchCertificates();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete certificate.';
      toast.error('Error', message);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteCertificate, fetchCertificates, toast]);

  const filteredCertificates = certificates.filter((c) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      c.title.toLowerCase().includes(query) ||
      c.issuer.toLowerCase().includes(query)
    );
  });

  const columns: Column<Certificate>[] = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (_val, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-8 shrink-0 overflow-hidden rounded-md bg-white/[0.04]">
            {row.image && (
              <img
                src={row.image}
                alt={row.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <span className="font-medium text-white/85 truncate max-w-[200px]">
            {row.title}
          </span>
        </div>
      ),
    },
    {
      key: 'issuer',
      header: 'Issuer',
      sortable: true,
      render: (val) => (
        <span className="text-white/60">{String(val)}</span>
      ),
    },
    {
      key: 'date',
      header: 'Date',
      sortable: true,
      width: '130px',
      render: (val) => (
        <span className="text-white/40 text-xs">{String(val)}</span>
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

  if (isLoading && certificates.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Certificates"
        description="Manage your certificates and achievements"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Certificates' },
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
            Add Certificate
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
            placeholder="Search certificates..."
            className={cn(
              'w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-4',
              'text-sm text-white/90 placeholder:text-white/30',
              'transition-colors focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/20',
            )}
          />
        </div>
      </div>

      {/* Table or Empty */}
      {filteredCertificates.length === 0 && !isLoading ? (
        <EmptyState
          icon={Award}
          title="No certificates found"
          description={
            searchQuery
              ? 'Try adjusting your search query.'
              : 'Get started by adding your first certificate.'
          }
          action={
            !searchQuery
              ? { label: 'Add Certificate', onClick: openCreateModal, icon: Plus }
              : undefined
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredCertificates}
          keyExtractor={(row) => row._id}
          loading={isLoading}
          searchKeys={['title', 'issuer']}
          rowActions={(row) => {
            const certificate = row;
            return (
              <>
                <button
                  onClick={() => openEditModal(certificate)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white/90 transition-colors rounded-md"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(certificate)}
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
        title={editingCertificate ? 'Edit Certificate' : 'Add New Certificate'}
        description={
          editingCertificate
            ? 'Update certificate details below.'
            : 'Fill in the details for your new certificate.'
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
              ) : editingCertificate ? (
                'Update Certificate'
              ) : (
                'Create Certificate'
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
            label="Title"
            required
            error={errors.title?.message}
            {...register('title')}
            placeholder="AWS Solutions Architect"
          />

          <FormField
            label="Issuer"
            required
            error={errors.issuer?.message}
            {...register('issuer')}
            placeholder="Amazon Web Services"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Date"
              required
              error={errors.date?.message}
              {...register('date')}
              type="text"
              placeholder="January 2024"
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

          <FormField
            label="Credential URL"
            error={errors.credentialUrl?.message}
            {...register('credentialUrl')}
            placeholder="https://www.credential.net/verify/abc123"
          />

          <FormField
            label="Image URL"
            error={errors.image?.message}
            {...register('image')}
            placeholder="https://example.com/certificate-badge.png"
          />

          <FormField
            label="Description"
            error={errors.description?.message}
            {...register('description')}
            rows={3}
            placeholder="Brief description of the certificate and skills validated"
          />
        </form>
      </Modal>

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Certificate"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}

export default function CertificatesPage() {
  return (
    <ToastProvider>
      <CertificatesContent />
    </ToastProvider>
  );
}