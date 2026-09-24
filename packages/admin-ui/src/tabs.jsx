import React from 'react';
import * as TabsPrimitive from '@radix-ui/react-tabs';
import { cn } from './cn.js';
import { resolveTheme } from './theme.js';

export function createTabsComponents(themeName = 'niceMenu') {
  const theme = resolveTheme(themeName);

  function Tabs({ className = '', value, onValueChange, children }) {
    return (
      <TabsPrimitive.Root value={value} onValueChange={onValueChange} className={cn('tw-grid tw-min-w-0 tw-grid-cols-1 tw-gap-0', className)}>
        {children}
      </TabsPrimitive.Root>
    );
  }

  function TabsList({ className = '', children, flush = false, ...props }) {
    return (
      <TabsPrimitive.List
        data-slot='tabs-list'
        className={cn(
          flush
            ? 'tw-inline-flex tw-min-w-0 tw-overflow-x-auto tw-items-end tw-justify-start tw-gap-1 tw-border-0 tw-bg-transparent tw-p-0'
            : `tw-inline-flex tw-min-w-0 tw-overflow-x-auto tw-items-center tw-justify-start tw-gap-1 tw-border-0 tw-border-b tw-border-solid ${theme.border} tw-bg-transparent tw-p-0`,
          className
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.List>
    );
  }

  function TabsTrigger({ active, value, className = '', children, ...props }) {
    return (
      <TabsPrimitive.Trigger
        data-slot='tabs-trigger'
        value={value}
        className={cn(
          `tw-inline-flex !tw-h-11 tw-shrink-0 tw-cursor-pointer tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded-none tw-border-0 tw-border-b-2 tw-border-solid tw-border-transparent tw-bg-transparent tw-px-4 !tw-text-sm tw-font-semibold !tw-leading-none ${theme.textMuted} tw-shadow-none tw-outline-none tw-transition-colors tw-duration-150`,
          `hover:tw-bg-transparent ${theme.textBrandStrongHover}`,
          `focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-1 ${theme.outlineBrand}`,
          'disabled:tw-pointer-events-none disabled:tw-opacity-50',
          theme.activeTab,
          active && `tw-border-current tw-bg-transparent ${theme.textBrandStrong}`,
          className
        )}
        {...props}
      >
        {children}
      </TabsPrimitive.Trigger>
    );
  }

  function TabsPanel({ value, className = '', children, transparent = false }) {
    return (
      <TabsPrimitive.Content
        data-slot='tabs-panel'
        value={value}
        className={cn(
          transparent
            ? 'tw-border-0 tw-bg-transparent'
            : `tw-rounded-md tw-border tw-border-solid ${theme.border} tw-bg-white`,
          className
        )}
      >
        {children}
      </TabsPrimitive.Content>
    );
  }

  return { Tabs, TabsList, TabsTrigger, TabsPanel };
}
