import React from 'react';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';

export function createFieldComponents(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);

  const Field = React.forwardRef(function Field(
    { label, note, error, children, className = '', orientation = 'vertical', ...props },
    ref
  ) {
    return (
      <div
        ref={ref}
        data-slot='field'
        data-orientation={orientation}
        className={cn(
          orientation === 'horizontal' ? 'tw-flex tw-min-w-0 tw-items-center tw-gap-2' : 'tw-grid tw-min-w-0 tw-content-start tw-gap-1.5',
          className
        )}
        {...props}
      >
        {label && <FieldLabel>{label}</FieldLabel>}
        {children}
        {note && <FieldDescription>{note}</FieldDescription>}
        {error && <FieldError>{error}</FieldError>}
      </div>
    );
  });

  const FieldLabel = React.forwardRef(function FieldLabel({ className = '', ...props }, ref) {
    return <label ref={ref} data-slot='field-label' className={cn(theme.fieldLabel, className)} {...props} />;
  });

  const FieldDescription = React.forwardRef(function FieldDescription({ className = '', ...props }, ref) {
    return <p ref={ref} data-slot='field-description' className={cn(`tw-m-0 tw-break-words tw-text-sm tw-leading-5 ${theme.textMuted}`, className)} {...props} />;
  });

  const FieldError = React.forwardRef(function FieldError({ className = '', ...props }, ref) {
    return <p ref={ref} data-slot='field-error' className={cn(`tw-m-0 tw-text-sm tw-font-semibold tw-leading-5 ${theme.textDanger}`, className)} {...props} />;
  });

  const FieldGroup = React.forwardRef(function FieldGroup({ className = '', ...props }, ref) {
    return <div ref={ref} data-slot='field-group' className={cn('tw-grid tw-gap-3', className)} {...props} />;
  });

  const FieldSet = React.forwardRef(function FieldSet({ className = '', ...props }, ref) {
    return <fieldset ref={ref} data-slot='field-set' className={cn('tw-min-w-0 tw-border-0 tw-p-0', className)} {...props} />;
  });

  const FieldLegend = React.forwardRef(function FieldLegend({ className = '', ...props }, ref) {
    return <legend ref={ref} data-slot='field-legend' className={cn(`tw-text-sm tw-font-semibold tw-leading-5 ${theme.text}`, className)} {...props} />;
  });

  const FieldSeparator = React.forwardRef(function FieldSeparator({ className = '', ...props }, ref) {
    return <div ref={ref} data-slot='field-separator' className={cn(`tw-h-px tw-w-full ${theme.bgBorder || `tw-bg-${theme.namespace}-border`}`, className)} {...props} />;
  });

  return { Field, FieldLabel, FieldDescription, FieldError, FieldGroup, FieldSet, FieldLegend, FieldSeparator };
}
