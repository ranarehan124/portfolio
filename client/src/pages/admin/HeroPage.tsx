'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import {
  Loader2,
  Sparkles,
  Plus,
  X,
  GripVertical,
  Save,
  AlertCircle,
} from 'lucide-react';
import {
  ToastProvider,
  useToast,
  PageHeader,
  FormField,
  EmptyState,
} from '@/components/admin/ui';
import { useAdminHero } from '@/hooks/admin';
import type { HeroContent } from '@/types';
import { cn } from '@/utils/helpers';

const heroSchema = z.object({
  greeting: z.string().min(1, 'Greeting is required'),
  name: z.string().min(1, 'Name is required'),
  titles: z.array(z.string()).min(1, 'At least one title is required'),
  tagline: z.string().min(1, 'Tagline is required'),
  resumeUrl: z.string().optional().default(''),
});

type HeroFormData = z.infer<typeof heroSchema>;

const containerVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { staggerChildren: 0.06, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring', stiffness: 300, damping: 24 },
  },
};

function HeroContentForm() {
  const toast = useToast();
  const { hero, isLoading, error, fetchHero, updateHero } = useAdminHero();
  const [isSaving, setIsSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isDirty },
  } = useForm<HeroFormData>({
    resolver: zodResolver(heroSchema),
    defaultValues: {
      greeting: '',
      name: '',
      titles: [''],
      tagline: '',
      resumeUrl: '',
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'titles',
  } as any); // eslint-disable-line @typescript-eslint/no-explicit-any

  useEffect(() => {
    fetchHero();
  }, [fetchHero]);

  useEffect(() => {
    if (hero) {
      reset({
        greeting: hero.greeting,
        name: hero.name,
        titles: hero.titles.length > 0 ? hero.titles : [''],
        tagline: hero.tagline,
        resumeUrl: hero.resumeUrl ?? '',
      });
    }
  }, [hero, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  useEffect(() => {
    setHasChanges(isDirty);
  }, [isDirty]);

  const onSubmit = useCallback(
    async (data: HeroFormData) => {
      setIsSaving(true);
      try {
        const payload: Partial<HeroContent> = {
          greeting: data.greeting,
          name: data.name,
          titles: data.titles.filter((t) => t.trim() !== ''),
          tagline: data.tagline,
          resumeUrl: data.resumeUrl || undefined,
        };

        await updateHero(payload);
        setHasChanges(false);
        toast.success('Hero Updated', 'Your hero section has been saved successfully.');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to update hero content.';
        toast.error('Error', message);
      } finally {
        setIsSaving(false);
      }
    },
    [updateHero, toast],
  );

  if (isLoading && !hero) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  if (error && !hero) {
    return (
      <EmptyState
        icon={AlertCircle}
        title="Failed to load hero content"
        description="Could not fetch hero data. Please try again."
        action={{
          label: 'Retry',
          onClick: () => fetchHero(),
        }}
      />
    );
  }

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="flex flex-col gap-6"
    >
      <PageHeader
        title="Edit Hero Section"
        description="Customize your portfolio's hero area"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Hero' },
        ]}
      />

      {/* Inline Form */}
      <motion.form
        variants={itemVariants}
        onSubmit={handleSubmit(onSubmit)}
        className={cn(
          'overflow-hidden rounded-xl border border-white/[0.08]',
          'bg-[#0a0a0a]/80 backdrop-blur-xl',
        )}
      >
        <div className="border-b border-white/[0.06] px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-purple-500/10">
              <Sparkles className="h-4.5 w-4.5 text-purple-400" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white">Hero Content</h2>
              <p className="text-xs text-white/40">
                {hasChanges
                  ? 'You have unsaved changes'
                  : `Last updated ${hero?.updatedAt ? new Date(hero.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A'}`}
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-6 p-6">
          {/* Greeting */}
          <FormField
            label="Greeting"
            required
            error={errors.greeting?.message}
            {...register('greeting')}
            placeholder="e.g. Hello, I'm"
          />

          {/* Name */}
          <FormField
            label="Name"
            required
            error={errors.name?.message}
            {...register('name')}
            placeholder="e.g. Rehan Tahir"
          />

          {/* Titles (dynamic list) */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium text-white/60">
                Titles
                <span className="ml-1 text-red-400">*</span>
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
                Add Title
              </button>
            </div>

            <div className="flex flex-col gap-2">
              {fields.map((field, index) => (
                <div key={field.id} className="flex items-center gap-2">
                  <GripVertical className="h-4 w-4 shrink-0 text-white/20" />
                  <input
                    {...register(`titles.${index}`)}
                    placeholder={
                      index === 0
                        ? 'e.g. Full Stack Developer'
                        : `Title ${index + 1}`
                    }
                    className={cn(
                      'w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5',
                      'text-sm text-white/90 placeholder:text-white/25',
                      'transition-colors focus:border-purple-500/40 focus:outline-none focus:ring-1 focus:ring-purple-500/20',
                    )}
                  />
                  {fields.length > 1 && (
                    <button
                      type="button"
                      onClick={() => remove(index)}
                      className={cn(
                        'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg',
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
            {errors.titles && (
              <p className="text-xs text-red-400">{errors.titles.message}</p>
            )}
            <p className="text-xs text-white/30">
              These titles will rotate in your hero section
            </p>
          </div>

          {/* Tagline */}
          <FormField
            label="Tagline"
            required
            error={errors.tagline?.message}
            {...register('tagline')}
            rows={3}
            placeholder="A brief tagline that describes you"
          />

          {/* Resume URL */}
          <FormField
            label="Resume URL"
            error={errors.resumeUrl?.message}
            {...register('resumeUrl')}
            placeholder="https://example.com/resume.pdf"
            helperText="Link to your downloadable resume"
          />
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between border-t border-white/[0.06] px-6 py-4">
          <p className="text-xs text-white/30">
            {hasChanges && 'Changes will be saved'}
          </p>
          <button
            type="submit"
            disabled={isSaving || !hasChanges}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5',
              'text-sm font-medium text-white transition-all',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/40',
              isSaving || !hasChanges
                ? 'bg-purple-600/50 cursor-not-allowed'
                : 'bg-purple-600 hover:bg-purple-500 shadow-[0_0_16px_rgba(139,92,246,0.2)] hover:shadow-[0_0_24px_rgba(139,92,246,0.3)]',
            )}
          >
            {isSaving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Save Changes
              </>
            )}
          </button>
        </div>
      </motion.form>
    </motion.div>
  );
}

export default function HeroPage() {
  return (
    <ToastProvider>
      <HeroContentForm />
    </ToastProvider>
  );
}