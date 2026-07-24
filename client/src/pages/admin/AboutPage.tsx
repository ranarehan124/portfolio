'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import { ToastProvider, useToast, PageHeader, FormField } from '@/components/admin/ui';
import { useAdminAbout } from '@/hooks/admin';
import { cn } from '@/utils/helpers';

const aboutSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  title: z.string().min(1, 'Title is required'),
  bio: z.string().min(1, 'Bio is required'),
  longBio: z.string().optional().default(''),
  avatar: z.string().optional().default(''),
  resumeUrl: z.string().optional().default(''),
  dateOfBirth: z.string().optional().default(''),
  location: z.string().optional().default(''),
  email: z.string().email().optional().or(z.literal('')).default(''),
  phone: z.string().optional().default(''),
});

type AboutFormData = z.infer<typeof aboutSchema>;

function AboutContent() {
  const toast = useToast();
  const { about, isLoading, error, fetchAbout, updateAbout } = useAdminAbout();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AboutFormData>({
    resolver: zodResolver(aboutSchema),
    defaultValues: {
      name: '',
      title: '',
      bio: '',
      longBio: '',
      avatar: '',
      resumeUrl: '',
      dateOfBirth: '',
      location: '',
      email: '',
      phone: '',
    },
  });

  useEffect(() => {
    fetchAbout();
  }, [fetchAbout]);

  useEffect(() => {
    if (about) {
      reset({
        name: about.name,
        title: about.title,
        bio: about.bio,
        longBio: about.longBio ?? '',
        avatar: about.avatar ?? '',
        resumeUrl: about.resumeUrl ?? '',
        dateOfBirth: about.dateOfBirth ?? '',
        location: about.location ?? '',
        email: about.email ?? '',
        phone: about.phone ?? '',
      });
    }
  }, [about, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const onSubmit = useCallback(
    async (data: AboutFormData) => {
      setIsSaving(true);
      try {
        await updateAbout(data);
        toast.success('About Updated', 'Your about section has been saved successfully.');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to update about content.';
        toast.error('Error', message);
      } finally {
        setIsSaving(false);
      }
    },
    [updateAbout, toast],
  );

  if (isLoading && !about) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="About"
        description="Edit your about section content"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'About' },
        ]}
        actions={
          <button
            type="button"
            onClick={handleSubmit(onSubmit)}
            disabled={isSaving}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-5 py-2.5',
              'text-sm font-medium text-white transition-all',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/40',
              isSaving
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
                Save
              </>
            )}
          </button>
        }
      />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl p-6">
          <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4">
            Personal Information
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Name - full width */}
            <div className="sm:col-span-2">
              <FormField
                label="Name"
                required
                error={errors.name?.message}
                {...register('name')}
                placeholder="e.g. Rehan Tahir"
              />
            </div>

            {/* Title - full width */}
            <div className="sm:col-span-2">
              <FormField
                label="Title"
                required
                error={errors.title?.message}
                {...register('title')}
                placeholder="e.g. Full Stack Developer"
              />
            </div>

            {/* Email */}
            <FormField
              label="Email"
              error={errors.email?.message}
              {...register('email')}
              placeholder="e.g. you@example.com"
            />

            {/* Phone */}
            <FormField
              label="Phone"
              error={errors.phone?.message}
              {...register('phone')}
              placeholder="e.g. +1 234 567 8900"
            />

            {/* Location */}
            <FormField
              label="Location"
              error={errors.location?.message}
              {...register('location')}
              placeholder="e.g. Lahore, Pakistan"
            />

            {/* Date of Birth */}
            <FormField
              label="Date of Birth"
              error={errors.dateOfBirth?.message}
              {...register('dateOfBirth')}
              type="date"
            />

            {/* Avatar URL - full width */}
            <div className="sm:col-span-2">
              <FormField
                label="Avatar URL"
                error={errors.avatar?.message}
                {...register('avatar')}
                placeholder="https://example.com/avatar.jpg"
                helperText="Direct link to your profile photo"
              />
            </div>

            {/* Resume URL - full width */}
            <div className="sm:col-span-2">
              <FormField
                label="Resume URL"
                error={errors.resumeUrl?.message}
                {...register('resumeUrl')}
                placeholder="https://example.com/resume.pdf"
                helperText="Link to your downloadable resume"
              />
            </div>

            {/* Bio - full width */}
            <div className="sm:col-span-2">
              <FormField
                label="Bio"
                required
                error={errors.bio?.message}
                {...register('bio')}
                rows={3}
                placeholder="A short introduction about yourself"
              />
            </div>

            {/* Long Bio - full width */}
            <div className="sm:col-span-2">
              <FormField
                label="Long Bio"
                error={errors.longBio?.message}
                {...register('longBio')}
                rows={6}
                placeholder="A detailed biography or about me section"
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function AboutPage() {
  return (
    <ToastProvider>
      <AboutContent />
    </ToastProvider>
  );
}