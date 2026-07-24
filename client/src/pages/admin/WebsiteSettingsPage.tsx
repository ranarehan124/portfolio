'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import { ToastProvider, useToast, PageHeader, FormField, Toggle } from '@/components/admin/ui';
import { useSettings } from '@/hooks/admin';
import { cn } from '@/utils/helpers';

const settingsSchema = z.object({
  siteName: z.string().min(1, 'Site name is required'),
  siteDescription: z.string().min(1, 'Site description is required'),
  siteUrl: z.string().url('Invalid URL').min(1, 'Site URL is required'),
  email: z.string().email('Invalid email').min(1, 'Email is required'),
  phone: z.string().optional().default(''),
  location: z.string().optional().default(''),
  resumeUrl: z.string().optional().default(''),
  maintenanceMode: z.boolean().default(false),
});

type SettingsFormData = z.infer<typeof settingsSchema>;

function SettingsContent() {
  const toast = useToast();
  const { settings, isLoading, error, fetchSettings, updateSettings } = useSettings();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SettingsFormData>({
    resolver: zodResolver(settingsSchema),
    defaultValues: {
      siteName: '',
      siteDescription: '',
      siteUrl: '',
      email: '',
      phone: '',
      location: '',
      resumeUrl: '',
      maintenanceMode: false,
    },
  });

  useEffect(() => {
    fetchSettings();
  }, [fetchSettings]);

  useEffect(() => {
    if (settings) {
      reset({
        siteName: settings.siteName,
        siteDescription: settings.siteDescription,
        siteUrl: settings.siteUrl,
        email: settings.email,
        phone: settings.phone ?? '',
        location: settings.location ?? '',
        resumeUrl: settings.resumeUrl ?? '',
        maintenanceMode: settings.maintenanceMode ?? false,
      });
    }
  }, [settings, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const onSubmit = useCallback(
    async (data: SettingsFormData) => {
      setIsSaving(true);
      try {
        await updateSettings(data);
        toast.success('Settings Updated', 'Your website settings have been saved successfully.');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to update settings.';
        toast.error('Error', message);
      } finally {
        setIsSaving(false);
      }
    },
    [updateSettings, toast],
  );

  if (isLoading && !settings) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Website Settings"
        description="Configure your website settings"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Settings' },
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
          {/* General */}
          <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 mt-0">
            General
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField
                label="Site Name"
                required
                error={errors.siteName?.message}
                {...register('siteName')}
                placeholder="e.g. Rehan Tahir"
              />
            </div>

            <div className="sm:col-span-2">
              <FormField
                label="Site Description"
                required
                error={errors.siteDescription?.message}
                {...register('siteDescription')}
                rows={2}
                placeholder="A brief description of your website"
              />
            </div>

            <div className="sm:col-span-2">
              <FormField
                label="Site URL"
                required
                error={errors.siteUrl?.message}
                {...register('siteUrl')}
                placeholder="https://example.com"
              />
            </div>

            {/* Contact Information */}
            <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 mt-6 sm:col-span-2">
              Contact Information
            </p>

            <div className="sm:col-span-2">
              <FormField
                label="Email"
                required
                error={errors.email?.message}
                {...register('email')}
                placeholder="e.g. you@example.com"
              />
            </div>

            <div className="sm:col-span-2">
              <FormField
                label="Phone"
                error={errors.phone?.message}
                {...register('phone')}
                placeholder="e.g. +1 234 567 8900"
              />
            </div>

            <div className="sm:col-span-2">
              <FormField
                label="Location"
                error={errors.location?.message}
                {...register('location')}
                placeholder="e.g. Lahore, Pakistan"
              />
            </div>

            {/* Resume */}
            <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 mt-6 sm:col-span-2">
              Resume
            </p>

            <div className="sm:col-span-2">
              <FormField
                label="Resume URL"
                error={errors.resumeUrl?.message}
                {...register('resumeUrl')}
                placeholder="https://example.com/resume.pdf"
                helperText="Upload a resume from the Resume page or paste a direct URL"
              />
            </div>

            {/* Advanced */}
            <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 mt-6 sm:col-span-2">
              Advanced
            </p>

            <div className="sm:col-span-2">
              <Controller
                name="maintenanceMode"
                control={control}
                render={({ field }) => (
                  <Toggle
                    id="maintenanceMode"
                    checked={field.value}
                    onChange={field.onChange}
                    label="Maintenance Mode"
                    description="Enable to show a maintenance page to visitors. You will still have access to the admin panel."
                  />
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function WebsiteSettingsPage() {
  return (
    <ToastProvider>
      <SettingsContent />
    </ToastProvider>
  );
}