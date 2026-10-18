import React, { useLayoutEffect, useRef } from 'react';

/** Product navigation and content are slots; geometry belongs to this package. */
export function AdminShell({ collapsed = false, className = '', children }) {
  const shellRef = useRef(null);
  useLayoutEffect(() => {
    const shell = shellRef.current;
    const host = shell.parentElement;
    const desktop = window.matchMedia('(min-width: 961px)');
    let frame;
    let disposed = false;
    const measure = () => {
      if (disposed) return;
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        shell.toggleAttribute('data-cci-viewport', desktop.matches);
        host.toggleAttribute('data-cci-viewport-host', desktop.matches);
        if (!desktop.matches) {
          shell.style.removeProperty('--cci-admin-viewport-height');
          return;
        }
        const pageTop = shell.getBoundingClientRect().top + window.scrollY;
        // Symfony's optional debug toolbar reserves space at the bottom in dev shops.
        const bottomInset = document.querySelector('.sf-toolbar-clearer')?.getBoundingClientRect().height || 0;
        const height = `${Math.max(0, window.innerHeight - pageTop - bottomInset)}px`;
        if (shell.style.getPropertyValue('--cci-admin-viewport-height') !== height) {
          shell.style.setProperty('--cci-admin-viewport-height', height);
        }
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(host);
    observer.observe(document.body);
    const debugToolbar = document.querySelector('.sf-toolbar');
    if (debugToolbar) observer.observe(debugToolbar);
    window.addEventListener('resize', measure);
    document.fonts?.ready.then(measure);
    measure();
    return () => {
      disposed = true;
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener('resize', measure);
      shell.removeAttribute('data-cci-viewport');
      host.removeAttribute('data-cci-viewport-host');
      shell.style.removeProperty('--cci-admin-viewport-height');
    };
  }, []);
  return (
    <div ref={shellRef} data-sidebar-collapsed={collapsed} data-collapsed={collapsed}
      className={`cci-admin-layout-shell tw-grid tw-min-w-0 tw-w-full tw-min-h-[calc(100vh-32px)] tw-items-stretch tw-bg-[#f4f6f8] ${collapsed ? 'tw-grid-cols-[76px_minmax(0,1fr)]' : 'tw-grid-cols-[270px_minmax(0,1fr)]'} max-[960px]:tw-grid-cols-1 ${className}`}>
      {children}
    </div>
  );
}
export function AdminWorkspace({ children, className = '', as: Element = 'main', scrollKey }) {
  const workspaceRef = useRef(null);
  useLayoutEffect(() => {
    if (scrollKey !== undefined) window.scrollTo(0, 0);
  }, [scrollKey]);
  return <Element ref={workspaceRef} className={`cci-admin-layout-workspace tw-min-w-0 tw-px-[34px] tw-pt-[30px] tw-pb-[42px] max-[960px]:tw-px-5 max-[960px]:tw-pt-6 max-[960px]:tw-pb-[34px] ${className}`}>{children}</Element>;
}
export function AdminPageHeader({ children, className = '' }) {
  return <header className={`cci-admin-layout-header tw-mb-5 tw-flex tw-items-end tw-justify-between tw-gap-4 max-[1279px]:tw-flex-wrap ${className}`}>{children}</header>;
}
export function AdminColumns({ children, className = '', fullWidth = false }) {
  return <div className={`cci-admin-layout-columns tw-grid tw-min-w-0 tw-grid-cols-1 tw-items-start tw-gap-4 ${fullWidth ? '' : 'xl:tw-grid-cols-[minmax(0,1fr)_320px]'} ${className}`}>{children}</div>;
}
