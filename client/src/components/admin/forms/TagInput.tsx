import { useCallback, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiX } from 'react-icons/fi';
import { cn } from '@/utils/helpers';

interface TagInputProps {
  label: string;
  tags: string[];
  onAdd: (tag: string) => void;
  onRemove: (tag: string) => void;
  placeholder?: string;
}

export default function TagInput({
  label,
  tags,
  onAdd,
  onRemove,
  placeholder = 'Type and press Enter...',
}: TagInputProps) {
  const [inputValue, setInputValue] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Enter' || e.key === ',') {
        e.preventDefault();
        const trimmed = inputValue.trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed)) {
          onAdd(trimmed);
          setInputValue('');
        }
      } else if (e.key === 'Backspace' && inputValue === '' && tags.length > 0) {
        const lastTag = tags[tags.length - 1];
        if (lastTag !== undefined) onRemove(lastTag);
      }
    },
    [inputValue, tags, onAdd, onRemove],
  );

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      if (value.endsWith(',')) {
        const trimmed = value.slice(0, -1).trim().toLowerCase();
        if (trimmed && !tags.includes(trimmed)) {
          onAdd(trimmed);
          setInputValue('');
          return;
        }
      }
      setInputValue(value);
    },
    [tags, onAdd],
  );

  const removeTag = useCallback(
    (tag: string) => {
      onRemove(tag);
      inputRef.current?.focus();
    },
    [onRemove],
  );

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-white/60">{label}</label>

      <div
        onClick={() => inputRef.current?.focus()}
        className={cn(
          'flex min-h-[42px] flex-wrap items-center gap-1.5 rounded-lg',
          'border border-white/[0.08] bg-white/[0.03] px-3 py-2',
          'transition-colors cursor-text',
          'focus-within:border-[#8B5CF6]/40 focus-within:bg-white/[0.05] focus-within:ring-2 focus-within:ring-[#8B5CF6]/20',
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          {tags.map((tag) => (
            <motion.span
              key={tag}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className={cn(
                'inline-flex items-center gap-1 rounded-md px-2 py-0.5',
                'bg-[#8B5CF6]/10 text-xs font-medium text-[#A78BFA]',
                'border border-[#8B5CF6]/20',
              )}
            >
              {tag}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeTag(tag);
                }}
                className="ml-0.5 rounded-sm text-[#A78BFA]/60 transition-colors hover:text-[#A78BFA] hover:bg-[#8B5CF6]/20"
                aria-label={`Remove tag ${tag}`}
              >
                <FiX className="h-3 w-3" />
              </button>
            </motion.span>
          ))}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          placeholder={tags.length === 0 ? placeholder : ''}
          className={cn(
            'min-w-[100px] flex-1 border-0 bg-transparent p-0 text-sm text-white/90 outline-none',
            'placeholder:text-white/25',
          )}
        />
      </div>

      {tags.length > 0 && (
        <p className="text-xs text-white/30">
          {tags.length} tag{tags.length !== 1 ? 's' : ''} added
        </p>
      )}
    </div>
  );
}