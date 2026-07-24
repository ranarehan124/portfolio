'use client';

import { useState, useCallback, useRef } from 'react';
import { Upload, Image as ImageIcon, Trash2, Copy, Check, Loader2, X } from 'lucide-react';
import { ToastProvider, useToast, PageHeader, ConfirmDialog, EmptyState } from '@/components/admin/ui';
import { useAdminUpload } from '@/hooks/admin';
import { cn } from '@/utils/helpers';

function MediaLibraryContent() {
  const toast = useToast();
  const { uploadedImages, uploadProgress, isUploading, error, uploadImages, deleteImage } =
    useAdminUpload();

  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{ url: string; publicId: string } | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Compute overall upload progress from the progress map
  const progressEntries = Object.values(uploadProgress);
  const overallProgress =
    progressEntries.length > 0
      ? Math.round(progressEntries.reduce((sum, p) => sum + p, 0) / progressEntries.length)
      : 0;

  const handleFileSelect = useCallback(
    async (files: FileList | null) => {
      if (!files || files.length === 0) return;
      try {
        await uploadImages(Array.from(files));
        toast.success('Upload Complete', `${files.length} image${files.length > 1 ? 's' : ''} uploaded successfully.`);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Failed to upload images.';
        toast.error('Upload Failed', message);
      }
      // Reset the file input so the same files can be re-selected
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    },
    [uploadImages, toast],
  );

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragOver(false);
      handleFileSelect(e.dataTransfer.files);
    },
    [handleFileSelect],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragOver(false);
  }, []);

  const handleCopyUrl = useCallback(async (url: string, publicId: string) => {
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(publicId);
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      toast.error('Copy Failed', 'Could not copy URL to clipboard.');
    }
  }, [toast]);

  const handleDelete = useCallback(async () => {
    if (!deleteTarget) return;
    setIsDeleting(true);
    try {
      await deleteImage(deleteTarget.publicId);
      toast.success('Image Deleted', 'The image has been permanently removed.');
      setDeleteTarget(null);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Failed to delete image.';
      toast.error('Delete Failed', message);
    } finally {
      setIsDeleting(false);
    }
  }, [deleteTarget, deleteImage, toast]);

  const openFilePicker = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Media Library"
        description="Upload and manage images"
        breadcrumbs={[
          { label: 'Admin', href: '/admin/dashboard' },
          { label: 'Media Library' },
        ]}
        actions={
          <button
            onClick={openFilePicker}
            className={cn(
              'inline-flex items-center gap-2 rounded-lg px-4 py-2.5',
              'bg-purple-600 text-sm font-medium text-white transition-all',
              'hover:bg-purple-500 shadow-[0_0_16px_rgba(139,92,246,0.2)]',
              'hover:shadow-[0_0_24px_rgba(139,92,246,0.3)]',
              'focus:outline-none focus:ring-2 focus:ring-purple-500/40',
            )}
          >
            <Upload className="h-4 w-4" />
            Upload Images
          </button>
        }
      />

      {/* Hidden file input */}
      <input
        type="file"
        ref={fileInputRef}
        multiple
        accept="image/*"
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Drop Zone */}
      <div
        onClick={openFilePicker}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            openFilePicker();
          }
        }}
        className={cn(
          'relative flex flex-col items-center justify-center gap-3 rounded-xl px-6 py-14',
          'border-2 border-dashed cursor-pointer transition-all duration-200',
          isDragOver
            ? 'border-purple-500/40 bg-purple-500/5'
            : 'border-white/[0.12] bg-white/[0.02] hover:border-white/[0.20] hover:bg-white/[0.03]',
          isUploading && 'pointer-events-none opacity-60',
        )}
      >
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
            isDragOver ? 'bg-purple-500/10 text-purple-400' : 'bg-white/[0.06] text-white/40',
          )}
        >
          <Upload className="h-6 w-6" />
        </div>
        <div className="text-center">
          <p className="text-sm font-medium text-white/70">
            Drag and drop images here, or click to browse
          </p>
          <p className="mt-1 text-xs text-white/30">Supports JPG, PNG, GIF, WebP, and SVG</p>
        </div>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="flex flex-col gap-2.5 rounded-xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl p-4">
          <div className="flex items-center gap-3">
            <Loader2 className="h-4 w-4 animate-spin text-purple-400" />
            <span className="text-sm font-medium text-white/80">
              Uploading {progressEntries.length} image{progressEntries.length !== 1 ? 's' : ''}...
            </span>
            <span className="ml-auto text-xs tabular-nums text-white/40">{overallProgress}%</span>
          </div>
          <div className="h-1.5 w-full overflow-hidden rounded-full bg-white/[0.06]">
            <div
              className="h-full rounded-full bg-purple-500 transition-all duration-300 ease-out"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Error display */}
      {error && !isUploading && (
        <div className="flex items-center gap-3 rounded-xl border border-red-500/20 bg-red-500/[0.06] px-4 py-3">
          <X className="h-4 w-4 shrink-0 text-red-400" />
          <p className="text-sm text-red-300/80">{error}</p>
        </div>
      )}

      {/* Image Grid or Empty State */}
      {uploadedImages.length === 0 && !isUploading ? (
        <EmptyState
          icon={ImageIcon}
          title="No images uploaded yet"
          description="Upload your first image using the drop zone above or the Upload button."
          action={{ label: 'Upload Images', onClick: openFilePicker }}
        />
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {uploadedImages.map((img) => (
            <div
              key={img.publicId}
              className="relative overflow-hidden rounded-xl border border-white/[0.08] bg-[#0a0a0a]/80 backdrop-blur-xl group"
            >
              <img
                src={img.url}
                alt="Uploaded media"
                className="h-full w-full object-cover aspect-square"
              />

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopyUrl(img.url, img.publicId);
                  }}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                    'bg-white/[0.12] backdrop-blur-sm hover:bg-white/[0.22]',
                    'text-white/80 hover:text-white',
                    'focus:outline-none focus:ring-2 focus:ring-purple-500/40',
                  )}
                  title="Copy URL"
                >
                  {copiedId === img.publicId ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Copy className="h-4 w-4" />
                  )}
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setDeleteTarget({ url: img.url, publicId: img.publicId });
                  }}
                  className={cn(
                    'flex h-9 w-9 items-center justify-center rounded-lg transition-all',
                    'bg-white/[0.12] backdrop-blur-sm hover:bg-red-500/20',
                    'text-red-400 hover:text-red-300',
                    'focus:outline-none focus:ring-2 focus:ring-red-500/40',
                  )}
                  title="Delete image"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete Confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Image"
        description="Are you sure you want to delete this image? This action cannot be undone and the image will be permanently removed from Cloudinary."
        confirmLabel="Delete"
        destructive
        loading={isDeleting}
      />
    </div>
  );
}

export default function MediaLibraryPage() {
  return (
    <ToastProvider>
      <MediaLibraryContent />
    </ToastProvider>
  );
}