import React from 'react';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';

export function createCardComponents(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);

  const Card = React.forwardRef(function Card({ as: Comp = 'div', className = '', transparent = false, ...props }, ref) {
    return (
      <Comp
        ref={ref}
        data-slot='card'
        className={cn(
          `tw-min-w-0 tw-rounded-md tw-border tw-border-solid ${theme.border}`,
          transparent ? 'tw-border-0 tw-bg-transparent' : 'tw-bg-white',
          className
        )}
        {...props}
      />
    );
  });

  const CardHeader = React.forwardRef(function CardHeader({ className = '', ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot='card-header'
        className={cn(
          `tw-flex tw-items-center tw-justify-between tw-gap-3 tw-border-0 tw-border-b tw-border-solid ${theme.border} tw-px-5 tw-py-4`,
          `[&_h2]:tw-m-0 [&_h2]:tw-text-lg [&_h2]:tw-font-semibold [&_h2]:tw-leading-tight [&_h2]:${theme.text}`,
          `[&_p]:tw-m-0 [&_p]:tw-mt-1 [&_p]:tw-text-sm [&_p]:tw-leading-5 [&_p]:${theme.textMuted}`,
          className
        )}
        {...props}
      />
    );
  });

  const CardTitle = React.forwardRef(function CardTitle({ className = '', ...props }, ref) {
    return <h2 ref={ref} data-slot='card-title' className={cn(`tw-m-0 tw-text-lg tw-font-semibold tw-leading-tight ${theme.text}`, className)} {...props} />;
  });

  const CardDescription = React.forwardRef(function CardDescription({ className = '', ...props }, ref) {
    return <p ref={ref} data-slot='card-description' className={cn(`tw-m-0 tw-mt-1 tw-text-sm tw-leading-5 ${theme.textMuted}`, className)} {...props} />;
  });

  const CardContent = React.forwardRef(function CardContent({ as: Comp = 'div', className = '', ...props }, ref) {
    return <Comp ref={ref} data-slot='card-content' className={cn('tw-p-5', className)} {...props} />;
  });

  const CardFooter = React.forwardRef(function CardFooter({ className = '', ...props }, ref) {
    return (
      <div
        ref={ref}
        data-slot='card-footer'
        className={cn(`tw-flex tw-items-center tw-gap-2 tw-border-0 tw-border-t tw-border-solid ${theme.border} tw-px-5 tw-py-4`, className)}
        {...props}
      />
    );
  });

  return { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter };
}
