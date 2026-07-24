'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Upload, FileText, Download, Loader2, CheckCircle } from 'lucide-react';
import { ToastProvider, useToast, PageHeader } from '@/components/admin/ui';
import apiClient from '@/api/client';
import { cn } from '@/utils/helpers';

function ResumeContent() {
  const toast = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentResume, setCurrentResume] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fetchCurrentResume = useCallback(async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: { resumeUrl?: string } }>('/settings');
      if (response.data.data?.resumeUrl) {
        setCurrentResume(response.data.data.resumeUrl);
      }
    } catch {
      // Settings might not exist yet
    }
  }, []);

  const fetchHeroResume = useCallback(async () => {
    try {
      const response = await apiClient.get<{ success: boolean; data: { resumeUrl?: string } }>('/hero');
      if (response.data.data?.resumeUrl) {
        setCurrentResume(response.data.data.resumeUrl);
      }
    } catch {
      // Hero might not exist yet
    }
  }, []);

  useEffect(() => {
    fetchCurrentResume().catch(() => {});
    fetchHeroResume().catch(() => {});
  }, []);

  const uploadResume = useCallback(async (file: File) => {
    const allowedTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    ];

    if (!allowedTypes.includes(file.type)) {
      toast.error('Invalid File', 'Please upload a PDF or Word document.');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File Too Large', 'Maximum file size is 5MB.');
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);

      const response = await apiClient.post<{ success: boolean; data: { url: string } }>(
        '/admin/resume',
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } },
      );

      const url = response.data.data.url;
      setCurrentResume(url);
      toast.success('Resume Uploaded', 'Your resume has been uploaded successfully.');
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to upload resume.';
      toast.error('Upload Error', message);
    } finally {
      setIsUploading(false);
    }
  }, [toast]);

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const file = e.target.files?.[0];
      if (file) {
        uploadResume(file);
      }
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [uploadResume],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) {
        uploadResume(file);
      }
    },
    [uploadResume],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Resume"
        description="Upload and manage your resume"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Resume' },
        ]}
      />

      <div className="mx-auto w-full max-w-2xl">
        {/* Upload Card */}
        <div
          className={cn(
            'overflow-hidden rounded-xl border backdrop-blur-xl transition-colors duration-200',
            'bg-[#0a0a0a]/80 border-white/[0.08]',
            isDragging && 'border-purple-500/40 bg-purple-500/5',
          )}
        >
          <div className="border-b border-white/[0.06] px-6 py-4">
            <h3 className="text-sm font-semibold text-white/90">Upload Resume</h3>
            <p className="mt-1 text-xs text-white/40">
              Supports PDF, DOC, DOCX. Maximum size: 5MB.
            </p>
          </div>

          <div className="p-6">
            {/* Drop Zone */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center gap-4 rounded-xl border-2 border-dashed p-10 transition-colors',
                isDragging
                  ? 'border-purple-500/40 bg-purple-500/5'
                  : 'border-white/[0.12] hover:border-white/[0.2] hover:bg-white/[0.02]',
                isUploading && 'pointer-events-none opacity-60',
              )}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  fileInputRef.current?.click();
                }
              }}
            >
              {isUploading ? (
                <>
                  <Loader2 className="h-10 w-10 animate-spin text-purple-400" />
                  <p className="text-sm font-medium text-white/60">Uploading...</p>
                </>
              ) : (
                <>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-purple-500/10">
                    <Upload className="h-6 w-6 text-purple-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-white/70">
                      Drag and drop your resume here
                    </p>
                    <p className="mt-1 text-xs text-white/35">
                      or click to browse files
                    </p>
                  </div>
                </>
              )}
            </div>

            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
          </div>
        </div>

        {/* Current Resume */}
        {currentResume && (
          <div className="mt-6 overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl">
            <div className="border-b border-white/[0.06] px-6 py-4">
              <h3 className="text-sm font-semibold text-white/90">Current Resume</h3>
            </div>
            <div className="flex items-center gap-4 p-6">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-emerald-500/10">
                <FileText className="h-6 w-6 text-emerald-400" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <p className="truncate text-sm font-medium text-white/85">Resume</p>
                  <CheckCircle className="h-4 w-4 shrink-0 text-emerald-400" />
                </div>
                <p className="mt-0.5 truncate text-xs text-white/40">
                  {currentResume}
                </p>
              </div>
              <div className="flex shrink-0 gap-2">
                <a
                  href={currentResume}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(
                    'flex items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.04] px-3 py-2',
                    'text-xs font-medium text-white/70 transition-colors',
                    'hover:bg-white/[0.08] hover:text-white/90',
                  )}
                >
                  <Download className="h-3.5 w-3.5" />
                  View
                </a>
              </div>
            </div>
          </div>
        )}

        {/* Info Card */}
        <div className="mt-6 rounded-xl border border-blue-500/15 bg-blue-500/5 p-4">
          <p className="text-xs leading-relaxed text-blue-300/70">
            Your resume URL is automatically linked in the Hero section and About section.
            Uploading a new resume here will update it across your entire portfolio.
          </p>
        </div>
      </div>
    </div>
  );
}

export default function ResumePage() {
  return (
    <ToastProvider>
      <ResumeContent />
    </ToastProvider>
  );
}