import React from 'react';

/** Product navigation and content are slots; geometry belongs to this package. */
export function AdminShell({ collapsed = false, className = '', children }) {
  return (
    <div data-sidebar-collapsed={collapsed} data-collapsed={collapsed}
      className={`cci-admin-layout-shell tw-grid tw-min-w-0 tw-w-full tw-min-h-[calc(100vh-32px)] tw-items-stretch tw-bg-[#f4f6f8] ${collapsed ? 'tw-grid-cols-[76px_minmax(0,1fr)]' : 'tw-grid-cols-[270px_minmax(0,1fr)]'} max-[960px]:tw-grid-cols-1 ${className}`}>
      {children}
    </div>
  );
}
export function AdminWorkspace({ children, className = '', as: Element = 'main' }) {
  return <Element className={`cci-admin-layout-workspace tw-min-w-0 tw-px-[34px] tw-pt-[30px] tw-pb-[42px] max-[960px]:tw-px-5 max-[960px]:tw-pt-6 max-[960px]:tw-pb-[34px] ${className}`}>{children}</Element>;
}
export function AdminPageHeader({ children, className = '' }) {
  return <header className={`cci-admin-layout-header tw-mb-5 tw-flex tw-items-end tw-justify-between tw-gap-4 max-[1279px]:tw-flex-wrap ${className}`}>{children}</header>;
}
export function AdminColumns({ children, className = '', fullWidth = false }) {
  return <div className={`cci-admin-layout-columns tw-grid tw-min-w-0 tw-grid-cols-1 tw-items-start tw-gap-4 ${fullWidth ? '' : 'xl:tw-grid-cols-[minmax(0,1fr)_320px]'} ${className}`}>{children}</div>;
}
