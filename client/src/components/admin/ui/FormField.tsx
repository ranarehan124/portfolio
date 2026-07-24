'use client';

import React, { forwardRef, type InputHTMLAttributes, type TextareaHTMLAttributes, type SelectHTMLAttributes } from 'react';
import { cn } from '@/utils/helpers';

type FieldElement =
  | HTMLInputElement
  | HTMLTextAreaElement
  | HTMLSelectElement;

type BaseFieldProps = {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
};

type InputFieldProps = BaseFieldProps &
  Omit<InputHTMLAttributes<HTMLInputElement>, 'size'>;

type TextareaFieldProps = BaseFieldProps &
  Omit<TextareaHTMLAttributes<HTMLTextAreaElement>, 'size'>;

type SelectFieldProps = BaseFieldProps &
  Omit<SelectHTMLAttributes<HTMLSelectElement>, 'size'> & {
    options: { value: string; label: string }[];
    placeholder?: string;
  };

type FormFieldProps = InputFieldProps | TextareaFieldProps | SelectFieldProps;

type FormFieldType = 'input' | 'textarea' | 'select';

function getFieldType(props: FormFieldProps): FormFieldType {
  if ('options' in props) return 'select';
  if ('type' in props && props.type === 'textarea') return 'textarea';
  if ('rows' in props && props.rows != null) return 'textarea';
  return 'input';
}

const baseInputClasses = cn(
  'w-full rounded-lg border border-white/[0.08] bg-white/[0.03] px-3 py-2.5',
  'text-sm text-white/90 placeholder:text-white/25',
  'transition-all duration-200',
  'focus:border-primary/40 focus:bg-white/[0.05] focus:outline-none focus:ring-2 focus:ring-primary/20',
  'disabled:cursor-not-allowed disabled:opacity-50',
);

export const FormField = forwardRef<FieldElement, FormFieldProps>(
  (props, ref) => {
    const { label, error, helperText, required, className, ...rest } = props;
    const fieldType = getFieldType(props);
    const id = props.id || props.name;

    const fieldMarkup = () => {
      if (fieldType === 'select') {
        const selectProps = rest as SelectFieldProps;
        return (
          <select
            ref={ref as React.Ref<HTMLSelectElement>}
            id={id}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            className={cn(
              baseInputClasses,
              error && 'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20',
              'appearance-none cursor-pointer',
              className,
            )}
            {...selectProps}
          >
            {selectProps.placeholder && (
              <option value="" disabled>
                {selectProps.placeholder}
              </option>
            )}
            {selectProps.options.map((opt) => (
              <option
                key={opt.value}
                value={opt.value}
                className="bg-[#0a0a0a] text-white/90"
              >
                {opt.label}
              </option>
            ))}
          </select>
        );
      }

      if (fieldType === 'textarea') {
        const textareaProps = rest as TextareaFieldProps;
        return (
          <textarea
            ref={ref as React.Ref<HTMLTextAreaElement>}
            id={id}
            rows={3}
            aria-invalid={!!error}
            aria-describedby={
              error ? `${id}-error` : helperText ? `${id}-helper` : undefined
            }
            className={cn(
              baseInputClasses,
              error &&
                'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20',
              'resize-y min-h-[80px]',
              className,
            )}
            {...textareaProps}
          />
        );
      }

      const inputProps = rest as InputFieldProps;
      return (
        <input
          ref={ref as React.Ref<HTMLInputElement>}
          id={id}
          aria-invalid={!!error}
          aria-describedby={
            error ? `${id}-error` : helperText ? `${id}-helper` : undefined
          }
          className={cn(
            baseInputClasses,
            error &&
              'border-red-500/40 focus:border-red-500/60 focus:ring-red-500/20',
            className,
          )}
          {...inputProps}
        />
      );
    };

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={id}
            className="text-sm font-medium text-white/60"
          >
            {label}
            {required && <span className="ml-1 text-red-400">*</span>}
          </label>
        )}

        {fieldMarkup()}

        {error && (
          <p
            id={`${id}-error`}
            role="alert"
            className="flex items-center gap-1 text-xs text-red-400"
          >
            <span className="inline-block h-1 w-1 rounded-full bg-red-400" />
            {error}
          </p>
        )}

        {!error && helperText && (
          <p
            id={`${id}-helper`}
            className="text-xs text-white/30"
          >
            {helperText}
          </p>
        )}
      </div>
    );
  },
);

FormField.displayName = 'FormField';