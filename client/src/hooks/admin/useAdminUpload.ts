'use client';

import { useState, useCallback } from 'react';
import { uploadApi } from '@/api';

interface UploadedImage {
  url: string;
  publicId: string;
}

interface UploadProgress {
  [key: string]: number;
}

interface UseAdminUploadReturn {
  uploadedImages: UploadedImage[];
  uploadProgress: UploadProgress;
  isUploading: boolean;
  error: string | null;
  uploadImage: (file: File, onProgress?: (progress: number) => void) => Promise<UploadedImage>;
  uploadImages: (
    files: File[],
    onProgress?: (progress: number, fileIndex: number) => void,
  ) => Promise<UploadedImage[]>;
  deleteImage: (publicId: string) => Promise<void>;
  reset: () => void;
}

export function useAdminUpload(): UseAdminUploadReturn {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({});
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadImage = useCallback(
    async (file: File, onProgress?: (progress: number) => void): Promise<UploadedImage> => {
      const fileId = `single_${Date.now()}`;
      setIsUploading(true);
      setError(null);
      setUploadProgress((prev) => ({ ...prev, [fileId]: 0 }));

      try {
        const formData = new FormData();
        formData.append('image', file);

        const response = await uploadApi.uploadImage(formData);

        const result: UploadedImage = response.data.data;
        setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));
        setUploadedImages((prev) => [...prev, result]);
        onProgress?.(100);

        return result;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to upload image.';
        setError(message);
        setUploadProgress((prev) => ({ ...prev, [fileId]: -1 }));
        throw err;
      } finally {
        setIsUploading(false);
        setUploadProgress((prev) => {
          const next = { ...prev };
          delete next[fileId];
          return next;
        });
      }
    },
    [],
  );

  const uploadImages = useCallback(
    async (
      files: File[],
      onProgress?: (progress: number, fileIndex: number) => void,
    ): Promise<UploadedImage[]> => {
      setIsUploading(true);
      setError(null);

      const results: UploadedImage[] = [];
      const progressMap: Record<string, number> = {};

      // Initialize progress for all files
      files.forEach((_, index) => {
        const fileId = `batch_${Date.now()}_${index}`;
        progressMap[fileId] = 0;
      });
      setUploadProgress((prev) => ({ ...prev, ...progressMap }));

      try {
        const formData = new FormData();
        files.forEach((file) => {
          formData.append('images', file);
        });

        // Report progress as each file conceptually completes
        const fileEntries = Object.entries(progressMap);
        const step = 100 / fileEntries.length;

        fileEntries.forEach(([fileId], index) => {
          setUploadProgress((prev) => ({
            ...prev,
            [fileId]: Math.min(100, (index + 1) * step),
          }));
          onProgress?.(Math.min(100, (index + 1) * step), index);
        });

        const response = await uploadApi.uploadImages(formData);
        const uploadedResults = response.data.data;

        results.push(...uploadedResults);
        setUploadedImages((prev) => [...prev, ...uploadedResults]);

        // Mark all as complete
        fileEntries.forEach(([fileId]) => {
          setUploadProgress((prev) => ({ ...prev, [fileId]: 100 }));
        });

        return results;
      } catch (err: unknown) {
        const message =
          err instanceof Error ? err.message : 'Failed to upload images.';
        setError(message);

        // Mark all as failed
        Object.keys(progressMap).forEach((fileId) => {
          setUploadProgress((prev) => ({ ...prev, [fileId]: -1 }));
        });

        throw err;
      } finally {
        setIsUploading(false);
        // Clean up progress entries
        setUploadProgress((prev) => {
          const next = { ...prev };
          Object.keys(progressMap).forEach((key) => delete next[key]);
          return next;
        });
      }
    },
    [],
  );

  const deleteImage = useCallback(async (publicId: string): Promise<void> => {
    setError(null);
    try {
      await uploadApi.deleteImage(publicId);
      setUploadedImages((prev) => prev.filter((img) => img.publicId !== publicId));
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : 'Failed to delete image.';
      setError(message);
      throw err;
    }
  }, []);

  const reset = useCallback(() => {
    setUploadedImages([]);
    setUploadProgress({});
    setIsUploading(false);
    setError(null);
  }, []);

  return {
    uploadedImages,
    uploadProgress,
    isUploading,
    error,
    uploadImage,
    uploadImages,
    deleteImage,
    reset,
  };
}