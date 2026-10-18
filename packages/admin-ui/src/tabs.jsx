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
          'tw-box-border tw-flex tw-h-14 tw-min-h-14 tw-min-w-0 tw-flex-nowrap tw-items-stretch tw-justify-start tw-gap-1 tw-overflow-x-auto tw-overflow-y-hidden [scrollbar-width:none] [&::-webkit-scrollbar]:tw-hidden tw-rounded-none tw-border-0 tw-bg-white tw-p-0',
          !flush && `tw-border-b tw-border-solid ${theme.border}`,
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
          'tw-box-border tw-relative tw-inline-flex !tw-h-full tw-min-h-0 tw-flex-none tw-cursor-pointer tw-items-center tw-justify-center tw-gap-2 tw-whitespace-nowrap tw-rounded-none tw-border-0 tw-border-b-2 tw-border-solid tw-border-transparent tw-bg-transparent tw-px-4 tw-py-0 !tw-text-sm !tw-font-normal !tw-leading-5 !tw-text-slate-500 tw-shadow-none tw-outline-none tw-transition-colors tw-duration-150 [&>svg]:tw-block [&>svg]:tw-h-6 [&>svg]:tw-w-6 [&>svg]:tw-flex-none',
          `data-[state=inactive]:hover:!tw-bg-[#faf9ff] data-[state=inactive]:hover:!tw-border-[#c9c0ff] ${theme.textBrandStrongHoverImportant}`,
          `focus-visible:tw-outline focus-visible:tw-outline-2 focus-visible:tw-outline-offset-1 ${theme.outlineBrand}`,
          'disabled:tw-pointer-events-none disabled:tw-opacity-50',
          theme.activeTab,
          active && `${theme.borderBrandImportant} !tw-bg-white !${theme.textBrand}`,
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
