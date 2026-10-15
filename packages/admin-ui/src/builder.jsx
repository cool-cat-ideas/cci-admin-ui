import React, { useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { GripVertical } from 'lucide-react';
import { createButton } from './button.jsx';

// Structural builder controls shared by Menu and Inquiry. Product code owns
// selection, drag scopes and actions; the visual contract lives in builder.css.
function BuilderDialogFrame({ children, labelledBy, onClose, portalContainer, className = '' }) {
  const dialog = useRef(null);
  const close = useRef(onClose); close.current = onClose;
  useLayoutEffect(() => {
    const previous = document.activeElement, overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const focusable = () => [...dialog.current.querySelectorAll('button:not(:disabled),input:not(:disabled),textarea:not(:disabled),[tabindex="0"]')].filter(n => n.getClientRects().length);
    focusable()[0]?.focus();
    const keys = event => {
      if (event.defaultPrevented || document.querySelector('dialog[open]') || event.target.closest('[role="listbox"]')) return;
      if (event.key === 'Escape') { event.preventDefault(); close.current?.(); }
      if (event.key !== 'Tab') return;
      const controls = focusable(), first = controls[0], last = controls.at(-1);
      if (!first) { event.preventDefault(); return; }
      if (!dialog.current.contains(document.activeElement) || (event.shiftKey ? document.activeElement === first : document.activeElement === last)) {
        event.preventDefault(); (event.shiftKey ? last : first).focus();
      }
    };
    document.addEventListener('keydown', keys);
    return () => {
      document.removeEventListener('keydown', keys); document.body.style.overflow = overflow;
      if (previous?.isConnected) previous.focus();
    };
  }, []);
  if (typeof document === 'undefined') return null;
  return createPortal(<div data-cci-builder-dialog-overlay="" onClick={event => { if (event.target === event.currentTarget) close.current?.(); }}>
    <div ref={dialog} role="dialog" aria-modal="true" aria-labelledby={labelledBy} data-cci-builder-dialog-frame="" className={className}>{children}</div>
  </div>, portalContainer || document.body);
}

export function createBuilderComponents(themeName = 'niceMenu') {
  const Button = createButton(themeName);
  const element = (name, tag = 'div') => React.forwardRef(function BuilderElement({ as: Tag = tag, ...props }, ref) {
    return <Tag ref={ref} {...props} {...{ [`data-cci-builder-${name}`]: '' }} />;
  });
  const BuilderHeading = React.forwardRef(function BuilderHeading({ variant, ...props }, ref) {
    return <Button ref={ref} {...props} variant="unstyled" data-cci-builder-heading="" />;
  });
  const BuilderItemMain = React.forwardRef(function BuilderItemMain({ variant, ...props }, ref) {
    return <Button ref={ref} {...props} variant="unstyled" data-cci-builder-item-main="" />;
  });
  const BuilderRuler = (props) => <div {...props} data-cci-builder-ruler="">
    {Array.from({ length: 12 }, (_, index) => <span key={index}>{index + 1}</span>)}
  </div>;
  const BuilderMetric = ({ kind = 'size', ...props }) => <span {...props} data-cci-builder-metric={kind} />;
  const BuilderGrip = (props) => <GripVertical {...props} aria-hidden="true" data-cci-builder-grip="" />;
  return {
    BuilderDialogFrame, BuilderDialogHeader: element('dialog-header'),
    BuilderDialogBody: element('dialog-body'), BuilderDialogFooter: element('dialog-footer'),
    BuilderCanvas: element('canvas'), BuilderPanel: element('panel'),
    BuilderHeader: element('header'), BuilderActions: element('actions'),
    BuilderItem: element('item'), BuilderItemCopy: element('item-copy', 'span'),
    BuilderItemTitle: element('item-title', 'strong'),
    BuilderItemDescription: element('item-description', 'span'),
    BuilderHeading, BuilderItemMain, BuilderMetric, BuilderGrip, BuilderRuler,
  };
}
