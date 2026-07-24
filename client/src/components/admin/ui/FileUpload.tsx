import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiUploadCloud, FiX, FiAlertCircle } from 'react-icons/fi';
import { cn } from '@/utils/helpers';

interface FileUploadProps {
  onUpload: (file: File) => void;
  accept?: string;
  maxSize?: number;
  preview?: boolean;
  multiple?: boolean;
  label?: string;
  className?: string;
}

interface FilePreview {
  file: File;
  url: string;
  name: string;
}

export default function FileUpload({
  onUpload,
  accept = 'image/*',
  maxSize = 5,
  preview = true,
  multiple = false,
  label = 'Upload file',
  className,
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [files, setFiles] = useState<FilePreview[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = useCallback(
    (file: File): string | null => {
      const sizeMB = file.size / (1024 * 1024);
      if (sizeMB > maxSize) {
        return `File "${file.name}" exceeds ${maxSize}MB limit (${sizeMB.toFixed(1)}MB)`;
      }

      if (accept && accept !== '*/*') {
        const acceptedTypes = accept.split(',').map((t) => t.trim());
        const fileExtension = `.${file.name.split('.').pop()}`;
        const fileType = file.type;

        const matches = acceptedTypes.some((type) => {
          if (type.endsWith('/*')) {
            return fileType.startsWith(type.replace('/*', '/'));
          }
          if (type.startsWith('.')) {
            return fileExtension.toLowerCase() === type.toLowerCase();
          }
          return fileType === type;
        });

        if (!matches) {
          return `File "${file.name}" is not an accepted file type`;
        }
      }

      return null;
    },
    [accept, maxSize],
  );

  const processFiles = useCallback(
    (fileList: FileList | File[]) => {
      setError(null);
      const fileArray = Array.from(fileList);
      const toProcess = multiple ? fileArray : fileArray.slice(0, 1);

      for (const file of toProcess) {
        const validationError = validateFile(file);
        if (validationError) {
          setError(validationError);
          continue;
        }

        onUpload(file);

        if (preview) {
          const url = URL.createObjectURL(file);
          setFiles((prev) =>
            multiple
              ? [...prev, { file, url, name: file.name }]
              : [{ file, url, name: file.name }],
          );
        }
      }
    },
    [validateFile, onUpload, preview, multiple],
  );

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setDragActive(false);
      if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
        processFiles(e.dataTransfer.files);
      }
    },
    [processFiles],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
        processFiles(e.target.files);
        e.target.value = '';
      }
    },
    [processFiles],
  );

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => {
      const file = prev[index];
      if (file) URL.revokeObjectURL(file.url);
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  const handleClick = useCallback(() => {
    inputRef.current?.click();
  }, []);

  return (
    <div className={cn('space-y-3', className)}>
      {/* Dropzone */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleClick();
          }
        }}
        className={cn(
          'relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors',
          dragActive
            ? 'border-[#8B5CF6]/60 bg-[#8B5CF6]/5'
            : 'border-white/[0.1] bg-white/[0.02] hover:border-white/[0.2] hover:bg-white/[0.04]',
          'focus:outline-none focus:ring-2 focus:ring-[#8B5CF6]/30',
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          onChange={handleChange}
          className="sr-only"
        />

        <div
          className={cn(
            'mb-3 flex h-12 w-12 items-center justify-center rounded-xl transition-colors',
            dragActive ? 'bg-[#8B5CF6]/20 text-[#8B5CF6]' : 'bg-white/[0.04] text-white/30',
          )}
        >
          <FiUploadCloud className="h-6 w-6" />
        </div>

        <p className="text-sm font-medium text-white/60">
          {label}
        </p>
        <p className="mt-1 text-xs text-white/30">
          Drag and drop, or click to browse
        </p>
        <p className="mt-0.5 text-[11px] text-white/20">
          Max {maxSize}MB{accept !== '*/*' ? ` · ${accept}` : ''}
        </p>
      </div>

      {/* Error */}
      <AnimatePresence>
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center gap-2 rounded-lg bg-red-500/10 px-3 py-2 text-xs text-red-400"
          >
            <FiAlertCircle className="h-4 w-4 shrink-0" />
            <span>{error}</span>
            <button
              onClick={() => setError(null)}
              className="ml-auto shrink-0 text-red-400/60 hover:text-red-400"
            >
              <FiX className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Previews */}
      <AnimatePresence>
        {files.length > 0 && preview && (
          <div className="flex flex-wrap gap-3">
            {files.map((f, i) => (
              <motion.div
                key={f.name + i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="group relative"
              >
                <div className="h-20 w-20 overflow-hidden rounded-lg border border-white/[0.08]">
                  {f.file.type.startsWith('image/') ? (
                    <img
                      src={f.url}
                      alt={f.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-white/[0.03]">
                      <FiUploadCloud className="h-6 w-6 text-white/20" />
                    </div>
                  )}
                </div>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(i);
                  }}
                  className={cn(
                    'absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full',
                    'bg-red-500 text-white opacity-0 shadow-sm transition-opacity',
                    'group-hover:opacity-100',
                  )}
                >
                  <FiX className="h-3 w-3" />
                </button>

                <p className="mt-1 max-w-[80px] truncate text-[10px] text-white/30">
                  {f.name}
                </p>
              </motion.div>
            ))}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}