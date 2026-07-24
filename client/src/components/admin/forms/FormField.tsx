import { forwardRef } from 'react';
import type { UseFormRegisterReturn } from 'react-hook-form';
import { cn } from '@/utils/helpers';

type FieldType = 'text' | 'email' | 'password' | 'textarea' | 'select' | 'number' | 'url';

interface SelectOption {
  value: string;
  label: string;
}

interface FormFieldProps {
  label: string;
  name: string;
  type?: FieldType;
  placeholder?: string;
  error?: string;
  register?: UseFormRegisterReturn;
  options?: SelectOption[];
  rows?: number;
  required?: boolean;
  className?: string;
  disabled?: boolean;
}

const baseClasses = cn(
  'admin-input w-full',
  'disabled:cursor-not-allowed disabled:opacity-50',
);

export const FormField = forwardRef<
  HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement,
  FormFieldProps
>(function FormField(
  {
    label,
    name,
    type = 'text',
    placeholder,
    error,
    register,
    options,
    rows = 4,
    required = false,
    className,
    disabled = false,
  },
  ref,
) {
  const id = name;
  const errorId = error ? `${id}-error` : undefined;

  const inputClasses = cn(
    baseClasses,
    error && 'error',
    className,
  );

  const renderField = () => {
    if (type === 'textarea') {
      return (
        <textarea
          id={id}
          ref={ref as React.Ref<HTMLTextAreaElement>}
          placeholder={placeholder}
          rows={rows}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(inputClasses, 'admin-textarea')}
          {...register}
        />
      );
    }

    if (type === 'select') {
      return (
        <select
          id={id}
          ref={ref as React.Ref<HTMLSelectElement>}
          disabled={disabled}
          aria-invalid={!!error}
          aria-describedby={errorId}
          className={cn(inputClasses, 'appearance-none cursor-pointer')}
          defaultValue=""
          {...register}
        >
          <option value="" disabled>
            {placeholder || 'Select an option'}
          </option>
          {options?.map((opt) => (
            <option key={opt.value} value={opt.value} className="bg-[#0a0a0a] text-white/90">
              {opt.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        id={id}
        ref={ref as React.Ref<HTMLInputElement>}
        type={type}
        placeholder={placeholder}
        disabled={disabled}
        aria-invalid={!!error}
        aria-describedby={errorId}
        className={inputClasses}
        {...register}
      />
    );
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-sm font-medium text-white/60">
        {label}
        {required && <span className="ml-1 text-red-400">*</span>}
      </label>

      {renderField()}

      {error && (
        <p
          id={errorId}
          role="alert"
          className="flex items-center gap-1 text-xs text-red-400"
        >
          <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
          {error}
        </p>
      )}
    </div>
  );
});

export default FormField;