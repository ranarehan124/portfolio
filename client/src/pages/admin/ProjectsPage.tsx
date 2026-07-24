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
  FolderOpen,
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
import { useAdminProjects } from '@/hooks/admin';
import type { Project } from '@/types';
import { cn } from '@/utils/helpers';

const projectSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  longDescription: z.string().optional().default(''),
  category: z.string().min(1, 'Category is required'),
  tags: z.string().optional().default(''),
  liveUrl: z.string().optional().default(''),
  githubUrl: z.string().optional().default(''),
  thumbnail: z.string().min(1, 'Thumbnail URL is required'),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
});

type ProjectFormData = z.infer<typeof projectSchema>;

const categoryOptions = [
  { value: 'web', label: 'Web App' },
  { value: 'mobile', label: 'Mobile App' },
  { value: 'desktop', label: 'Desktop App' },
  { value: 'design', label: 'Design' },
  { value: 'other', label: 'Other' },
];

const categoryBadgeColors: Record<string, string> = {
  web: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  mobile: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  desktop: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  design: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  other: 'bg-white/[0.06] text-white/50 border-white/[0.08]',
};

function ProjectsContent() {
  const toast = useToast();
  const {
    projects,
    isLoading,
    error,
    fetchProjects,
    createProject,
    updateProject,
    deleteProject,
  } = useAdminProjects();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Project | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCategory, setFilterCategory] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<ProjectFormData>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      title: '',
      description: '',
      longDescription: '',
      category: 'web',
      tags: '',
      liveUrl: '',
      githubUrl: '',
      thumbnail: '',
      featured: false,
      order: 0,
    },
  });

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const openCreateModal = useCallback(() => {
    setEditingProject(null);
    reset({
      title: '',
      description: '',
      longDescription: '',
      category: 'web',
      tags: '',
      liveUrl: '',
      githubUrl: '',
      thumbnail: '',
      featured: false,
      order: 0,
    });
    setModalOpen(true);
  }, [reset]);

  const openEditModal = useCallback(
    (project: Project) => {
      setEditingProject(project);
      reset({
        title: project.title,
        description: project.description,
        longDescription: project.longDescription ?? '',
        category: project.category,
        tags: project.tags.join(', '),
        liveUrl: project.liveUrl ?? '',
        githubUrl: project.githubUrl ?? '',
        thumbnail: project.thumbnail,
        featured: project.featured,
        order: project.order,
      });
      setModalOpen(true);
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: ProjectFormData) => {
      setIsSubmitting(true);
      try {
        const payload: Partial<Project> = {
          title: data.title,
          description: data.description,
          longDescription: data.longDescription || undefined,
          category: data.category,
          tags: data.tags
            .split(',')
            .map((t) => t.trim())
            .filter(Boolean),
          liveUrl: data.liveUrl || undefined,
          githubUrl: data.githubUrl || undefined,
          thumbnail: data.thumbnail,
          featured: data.featured,
          order: data.order,
          images: editingProject?.images ?? [],
        };

        if (editingProject) {
          await updateProject(editingProject._id, payload);
          toast.success('Project Updated', `"${data.title}" has been updated.`);
        } else {
          await createProject(payload);
          toast.success('Project Created', `"${data.title}" has been added.`);
        }

        setModalOpen(false);
        fetchProjects();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save project.';
        toast.error('Error', message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingProject, createProject, updateProject, fetchProjects, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteProject(deleteTarget._id);
      toast.success('Deleted', `"${deleteTarget.title}" has been removed.`);
      setDeleteTarget(null);
      fetchProjects();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete project.';
      toast.error('Error', message);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteProject, fetchProjects, toast]);

  const handleToggleFeatured = useCallback(
    async (project: Project, checked: boolean) => {
      try {
        await updateProject(project._id, { featured: checked });
      } catch {
        toast.error('Error', 'Failed to update featured status.');
      }
    },
    [updateProject, toast],
  );

  const filteredProjects = projects.filter((p) => {
    const matchesSearch =
      !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.category.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const columns: Column<Project>[] = [
    {
      key: 'title',
      header: 'Title',
      sortable: true,
      render: (_val, row) => (
        <div className="flex items-center gap-3">
          <div className="h-8 w-12 shrink-0 overflow-hidden rounded-md bg-white/[0.04]">
            {row.thumbnail && (
              <img
                src={row.thumbnail}
                alt={row.title}
                className="h-full w-full object-cover"
              />
            )}
          </div>
          <span className="font-medium text-white/85 truncate max-w-[180px]">
            {row.title}
          </span>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      width: '130px',
      render: (val) => {
        const category = String(val);
        return (
          <span
            className={cn(
              'inline-flex rounded-md border px-2 py-0.5 text-xs font-medium',
              categoryBadgeColors[category] ?? categoryBadgeColors.other,
            )}
          >
            {category}
          </span>
        );
      },
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

  if (isLoading && projects.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Projects"
        description="Manage your portfolio projects"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Projects' },
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
            Add Project
          </button>
        }
      />

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-white/30" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search projects..."
            className={cn(
              'w-full rounded-lg border border-white/[0.08] bg-white/[0.03] py-2.5 pl-9 pr-4',
              'text-sm text-white/90 placeholder:text-white/30',
              'transition-colors focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/20',
            )}
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className={cn(
            'rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5',
            'text-sm text-white/70 transition-colors',
            'focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/20',
            'appearance-none cursor-pointer',
          )}
        >
          <option value="" className="bg-[#0a0a0a]">
            All Categories
          </option>
          {categoryOptions.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0a0a0a]">
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Table or Empty */}
      {filteredProjects.length === 0 && !isLoading ? (
        <EmptyState
          icon={FolderOpen}
          title="No projects found"
          description={
            searchQuery || filterCategory
              ? 'Try adjusting your search or filter.'
              : 'Get started by adding your first project.'
          }
          action={
            !searchQuery && !filterCategory
              ? { label: 'Add Project', onClick: openCreateModal, icon: Plus }
              : undefined
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredProjects}
          keyExtractor={(row) => row._id}
          loading={isLoading}
          searchKeys={['title', 'category']}
          rowActions={(row) => {
            const project = row;
            return (
              <>
                <button
                  onClick={() => openEditModal(project)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white/90 transition-colors rounded-md"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(project)}
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
        title={editingProject ? 'Edit Project' : 'Add New Project'}
        description={
          editingProject
            ? 'Update project details below.'
            : 'Fill in the details for your new project.'
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
              ) : editingProject ? (
                'Update Project'
              ) : (
                'Create Project'
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
            placeholder="My Awesome Project"
          />

          <FormField
            label="Description"
            required
            error={errors.description?.message}
            {...register('description')}
            placeholder="Brief description"
          />

          <FormField
            label="Long Description"
            error={errors.longDescription?.message}
            {...register('longDescription')}
            rows={4}
            placeholder="Detailed project description"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Category"
              required
              error={errors.category?.message}
              {...register('category')}
              options={categoryOptions}
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
            label="Tags"
            error={errors.tags?.message}
            {...register('tags')}
            placeholder="React, TypeScript, Node.js (comma-separated)"
            helperText="Separate tags with commas"
          />

          <FormField
            label="Thumbnail URL"
            required
            error={errors.thumbnail?.message}
            {...register('thumbnail')}
            placeholder="https://example.com/image.png"
          />

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <FormField
              label="Live URL"
              error={errors.liveUrl?.message}
              {...register('liveUrl')}
              placeholder="https://myproject.com"
            />

            <FormField
              label="GitHub URL"
              error={errors.githubUrl?.message}
              {...register('githubUrl')}
              placeholder="https://github.com/user/repo"
            />
          </div>

          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Toggle
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Featured Project"
                description="Display this project in the featured section"
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
        title="Delete Project"
        description={`Are you sure you want to delete "${deleteTarget?.title}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}

export default function ProjectsPage() {
  return (
    <ToastProvider>
      <ProjectsContent />
    </ToastProvider>
  );
}