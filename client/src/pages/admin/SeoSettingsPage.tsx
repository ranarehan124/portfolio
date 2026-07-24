'use client';

import { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Loader2, Save } from 'lucide-react';
import { ToastProvider, useToast, PageHeader, FormField, Toggle } from '@/components/admin/ui';
import { useSeo } from '@/hooks/admin';
import { cn } from '@/utils/helpers';

const seoSchema = z.object({
  metaTitle: z.string().min(1, 'Meta title is required'),
  metaDescription: z.string().min(1, 'Meta description is required'),
  ogTitle: z.string().min(1, 'OG title is required'),
  ogDescription: z.string().min(1, 'OG description is required'),
  ogImage: z.string().optional().default(''),
  twitterHandle: z.string().optional().default(''),
  canonicalUrl: z.string().optional().default(''),
  robotsIndex: z.boolean().default(true),
  robotsFollow: z.boolean().default(true),
});

type SeoFormData = z.infer<typeof seoSchema>;

function SeoContent() {
  const toast = useToast();
  const { seo, isLoading, error, fetchSeo, updateSeo } = useSeo();
  const [isSaving, setIsSaving] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<SeoFormData>({
    resolver: zodResolver(seoSchema),
    defaultValues: {
      metaTitle: '',
      metaDescription: '',
      ogTitle: '',
      ogDescription: '',
      ogImage: '',
      twitterHandle: '',
      canonicalUrl: '',
      robotsIndex: true,
      robotsFollow: true,
    },
  });

  useEffect(() => {
    fetchSeo();
  }, [fetchSeo]);

  useEffect(() => {
    if (seo) {
      reset({
        metaTitle: seo.metaTitle,
        metaDescription: seo.metaDescription,
        ogTitle: seo.ogTitle,
        ogDescription: seo.ogDescription,
        ogImage: seo.ogImage ?? '',
        twitterHandle: seo.twitterHandle ?? '',
        canonicalUrl: seo.canonicalUrl ?? '',
        robotsIndex: seo.robotsIndex ?? true,
        robotsFollow: seo.robotsFollow ?? true,
      });
    }
  }, [seo, reset]);

  useEffect(() => {
    if (error) {
      toast.error('Error', error);
    }
  }, [error, toast]);

  const onSubmit = useCallback(
    async (data: SeoFormData) => {
      setIsSaving(true);
      try {
        await updateSeo(data);
        toast.success('SEO Settings Updated', 'Your SEO settings have been saved successfully.');
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to update SEO settings.';
        toast.error('Error', message);
      } finally {
        setIsSaving(false);
      }
    },
    [updateSeo, toast],
  );

  if (isLoading && !seo) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="SEO Settings"
        description="Configure search engine optimization"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'SEO' },
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
          {/* General Meta */}
          <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 mt-0">
            General Meta
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <FormField
                label="Meta Title"
                required
                error={errors.metaTitle?.message}
                {...register('metaTitle')}
                placeholder="e.g. Rehan Tahir - Full Stack Developer"
              />
            </div>

            <div className="sm:col-span-2">
              <FormField
                label="Meta Description"
                required
                error={errors.metaDescription?.message}
                {...register('metaDescription')}
                rows={3}
                placeholder="A brief description of your website for search engines"
              />
            </div>

            {/* Open Graph */}
            <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 mt-6 sm:col-span-2">
              Open Graph
            </p>

            <div className="sm:col-span-2">
              <FormField
                label="OG Title"
                required
                error={errors.ogTitle?.message}
                {...register('ogTitle')}
                placeholder="e.g. Rehan Tahir - Full Stack Developer"
              />
            </div>

            <div className="sm:col-span-2">
              <FormField
                label="OG Description"
                required
                error={errors.ogDescription?.message}
                {...register('ogDescription')}
                rows={3}
                placeholder="Description shown when your site is shared on social media"
              />
            </div>

            <div className="sm:col-span-2">
              <FormField
                label="OG Image URL"
                error={errors.ogImage?.message}
                {...register('ogImage')}
                placeholder="https://example.com/og-image.jpg"
                helperText="Recommended size: 1200x630 pixels"
              />
            </div>

            {/* Social & Links */}
            <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 mt-6 sm:col-span-2">
              Social &amp; Links
            </p>

            <div className="sm:col-span-2">
              <FormField
                label="Twitter Handle"
                error={errors.twitterHandle?.message}
                {...register('twitterHandle')}
                placeholder="e.g. rehantahir"
                helperText="Enter without the @ symbol"
              />
            </div>

            <div className="sm:col-span-2">
              <FormField
                label="Canonical URL"
                error={errors.canonicalUrl?.message}
                {...register('canonicalUrl')}
                placeholder="https://example.com"
              />
            </div>

            {/* Robots */}
            <p className="text-sm font-semibold text-white/60 uppercase tracking-wider mb-4 mt-6 sm:col-span-2">
              Robots
            </p>

            <div className="sm:col-span-2">
              <Controller
                name="robotsIndex"
                control={control}
                render={({ field }) => (
                  <Toggle
                    id="robotsIndex"
                    checked={field.value}
                    onChange={field.onChange}
                    label="Allow Search Engine Indexing"
                    description="Enable this to allow search engines to index your site"
                  />
                )}
              />
            </div>

            <div className="sm:col-span-2">
              <Controller
                name="robotsFollow"
                control={control}
                render={({ field }) => (
                  <Toggle
                    id="robotsFollow"
                    checked={field.value}
                    onChange={field.onChange}
                    label="Allow Link Following"
                    description="Enable this to allow search engines to follow links on your site"
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

export default function SeoSettingsPage() {
  return (
    <ToastProvider>
      <SeoContent />
    </ToastProvider>
  );
}