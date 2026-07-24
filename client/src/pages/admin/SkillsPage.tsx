'use client';

import { useEffect, useState, useCallback, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Plus,
  Pencil,
  Trash2,
  Loader2,
  Cpu,
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
import { useAdminSkills } from '@/hooks/admin';
import type { Skill, SkillCategory } from '@/types';
import { cn } from '@/utils/helpers';

const skillSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  category: z.enum(['frontend', 'backend', 'tools', 'design', 'other']),
  icon: z.string().optional().default(''),
  level: z.coerce.number().int().min(0).max(100).default(50),
  featured: z.boolean().default(false),
  order: z.coerce.number().int().min(0).default(0),
});

type SkillFormData = z.infer<typeof skillSchema>;

const categoryOptions: { value: SkillCategory; label: string }[] = [
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'tools', label: 'Tools' },
  { value: 'design', label: 'Design' },
  { value: 'other', label: 'Other' },
];

const categoryTabs = [
  { value: '', label: 'All' },
  { value: 'frontend', label: 'Frontend' },
  { value: 'backend', label: 'Backend' },
  { value: 'tools', label: 'Tools' },
  { value: 'design', label: 'Design' },
  { value: 'other', label: 'Other' },
];

const categoryBadgeColors: Record<SkillCategory, string> = {
  frontend: 'bg-blue-500/15 text-blue-400 border-blue-500/20',
  backend: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/20',
  tools: 'bg-amber-500/15 text-amber-400 border-amber-500/20',
  design: 'bg-pink-500/15 text-pink-400 border-pink-500/20',
  other: 'bg-white/[0.06] text-white/50 border-white/[0.08]',
};

function LevelBar({ level }: { level: number }) {
  const color =
    level >= 80
      ? 'bg-emerald-400'
      : level >= 60
        ? 'bg-blue-400'
        : level >= 40
          ? 'bg-amber-400'
          : 'bg-red-400';

  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-20 overflow-hidden rounded-full bg-white/[0.06]">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${level}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs tabular-nums text-white/50">{level}%</span>
    </div>
  );
}

function SkillsContent() {
  const toast = useToast();
  const {
    skills,
    isLoading,
    error,
    fetchSkills,
    createSkill,
    updateSkill,
    deleteSkill,
  } = useAdminSkills();

  const [modalOpen, setModalOpen] = useState(false);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Skill | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [activeTab, setActiveTab] = useState('');

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SkillFormData>({
    resolver: zodResolver(skillSchema),
    defaultValues: {
      name: '',
      category: 'frontend',
      icon: '',
      level: 50,
      featured: false,
      order: 0,
    },
  });

  const currentLevel = watch('level');

  useEffect(() => {
    fetchSkills();
  }, [fetchSkills]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const openCreateModal = useCallback(() => {
    setEditingSkill(null);
    reset({
      name: '',
      category: 'frontend',
      icon: '',
      level: 50,
      featured: false,
      order: 0,
    });
    setModalOpen(true);
  }, [reset]);

  const openEditModal = useCallback(
    (skill: Skill) => {
      setEditingSkill(skill);
      reset({
        name: skill.name,
        category: skill.category,
        icon: skill.icon ?? '',
        level: skill.level,
        featured: skill.featured,
        order: skill.order,
      });
      setModalOpen(true);
    },
    [reset],
  );

  const onSubmit = useCallback(
    async (data: SkillFormData) => {
      setIsSubmitting(true);
      try {
        const payload: Partial<Skill> = {
          name: data.name,
          category: data.category,
          icon: data.icon || undefined,
          level: data.level,
          featured: data.featured,
          order: data.order,
        };

        if (editingSkill) {
          await updateSkill(editingSkill._id, payload);
          toast.success('Skill Updated', `"${data.name}" has been updated.`);
        } else {
          await createSkill(payload);
          toast.success('Skill Created', `"${data.name}" has been added.`);
        }

        setModalOpen(false);
        fetchSkills();
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to save skill.';
        toast.error('Error', message);
      } finally {
        setIsSubmitting(false);
      }
    },
    [editingSkill, createSkill, updateSkill, fetchSkills, toast],
  );

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteSkill(deleteTarget._id);
      toast.success('Deleted', `"${deleteTarget.name}" has been removed.`);
      setDeleteTarget(null);
      fetchSkills();
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete skill.';
      toast.error('Error', message);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteSkill, fetchSkills, toast]);

  const handleToggleFeatured = useCallback(
    async (skill: Skill, checked: boolean) => {
      try {
        await updateSkill(skill._id, { featured: checked });
      } catch {
        toast.error('Error', 'Failed to update featured status.');
      }
    },
    [updateSkill, toast],
  );

  const filteredSkills = useMemo(() => {
    if (!activeTab) return skills;
    return skills.filter((s) => s.category === activeTab);
  }, [skills, activeTab]);

  const columns: Column<Skill>[] = [
    {
      key: 'name',
      header: 'Name',
      sortable: true,
      render: (val) => (
        <span className="font-medium text-white/85">{String(val)}</span>
      ),
    },
    {
      key: 'category',
      header: 'Category',
      sortable: true,
      width: '120px',
      render: (val) => {
        const cat = String(val) as SkillCategory;
        return (
          <span
            className={cn(
              'inline-flex rounded-md border px-2 py-0.5 text-xs font-medium',
              categoryBadgeColors[cat] ?? categoryBadgeColors.other,
            )}
          >
            {cat}
          </span>
        );
      },
    },
    {
      key: 'level',
      header: 'Level',
      sortable: true,
      width: '160px',
      render: (val) => <LevelBar level={Number(val) ?? 0} />,
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

  if (isLoading && skills.length === 0) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Skills"
        description="Manage your technical skills"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Skills' },
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
            Add Skill
          </button>
        }
      />

      {/* Category Tabs */}
      <div className="flex gap-1 overflow-x-auto rounded-lg border border-white/[0.06] bg-white/[0.02] p-1">
        {categoryTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            className={cn(
              'whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-all',
              activeTab === tab.value
                ? 'bg-purple-600/90 text-white shadow-sm'
                : 'text-white/40 hover:text-white/60 hover:bg-white/[0.04]',
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Table or Empty */}
      {filteredSkills.length === 0 && !isLoading ? (
        <EmptyState
          icon={Cpu}
          title="No skills found"
          description={
            activeTab
              ? 'No skills in this category. Try another tab.'
              : 'Get started by adding your first skill.'
          }
          action={
            !activeTab
              ? { label: 'Add Skill', onClick: openCreateModal, icon: Plus }
              : undefined
          }
        />
      ) : (
        <DataTable
          columns={columns}
          data={filteredSkills}
          keyExtractor={(row) => row._id}
          loading={isLoading}
          searchKeys={['name', 'category']}
          rowActions={(row) => {
            const skill = row;
            return (
              <>
                <button
                  onClick={() => openEditModal(skill)}
                  className="flex w-full items-center gap-2 px-3 py-2 text-sm text-white/60 hover:bg-white/[0.06] hover:text-white/90 transition-colors rounded-md"
                >
                  <Pencil className="h-3.5 w-3.5" />
                  Edit
                </button>
                <button
                  onClick={() => setDeleteTarget(skill)}
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
        title={editingSkill ? 'Edit Skill' : 'Add New Skill'}
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
              ) : editingSkill ? (
                'Update Skill'
              ) : (
                'Create Skill'
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
            label="Name"
            required
            error={errors.name?.message}
            {...register('name')}
            placeholder="e.g. React, Node.js, Figma"
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
            label="Icon Class"
            error={errors.icon?.message}
            {...register('icon')}
            placeholder="e.g. SiReact, SiTypescript"
            helperText="React-icons class name for the skill icon"
          />

          {/* Level Slider */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/60">
                Skill Level
              </label>
              <span className="text-sm font-semibold text-purple-400 tabular-nums">
                {currentLevel}%
              </span>
            </div>
            <input
              type="range"
              min={0}
              max={100}
              step={5}
              value={currentLevel}
              onChange={(e) => setValue('level', Number(e.target.value))}
              className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/[0.08] accent-purple-500
                [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-purple-500 [&::-webkit-slider-thumb]:shadow-[0_0_8px_rgba(139,92,246,0.4)]
                [&::-moz-range-thumb]:h-4 [&::-moz-range-thumb]:w-4 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-0 [&::-moz-range-thumb]:bg-purple-500 [&::-moz-range-thumb]:shadow-[0_0_8px_rgba(139,92,246,0.4)]"
            />
            <div className="flex justify-between text-[10px] text-white/25">
              <span>Beginner</span>
              <span>Intermediate</span>
              <span>Expert</span>
            </div>
            {errors.level && (
              <p className="text-xs text-red-400">{errors.level.message}</p>
            )}
          </div>

          <Controller
            name="featured"
            control={control}
            render={({ field }) => (
              <Toggle
                checked={field.value ?? false}
                onChange={field.onChange}
                label="Featured Skill"
                description="Highlight this skill on your portfolio"
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
        title="Delete Skill"
        description={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}

export default function SkillsPage() {
  return (
    <ToastProvider>
      <SkillsContent />
    </ToastProvider>
  );
}