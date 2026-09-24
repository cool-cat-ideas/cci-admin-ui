import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import { cn } from './cn.js';
import { createButton } from './button.jsx';
import { getFeedbackTone } from './feedback-tone.js';

const AUTO_CLOSE_DELAY = {
  error: 8000,
  success: 4500,
  info: 6500,
  warning: 8000,
};

export function createNotice(themeName = 'niceMenu') {
  const Button = createButton(themeName);

  function ToastItem({ notice, onClose, closeLabel }) {
    const feedback = getFeedbackTone(notice.type);
    const type = feedback.name;
    const Icon = feedback.Icon;
    const delay = Number(notice.duration || AUTO_CLOSE_DELAY[type] || 0);
    const shouldAutoClose = !notice.sticky && delay > 0;
    const [draining, setDraining] = React.useState(false);

    useEffect(() => {
      if (!shouldAutoClose) {
        return undefined;
      }

      const frame = window.requestAnimationFrame(() => setDraining(true));
      const timeout = window.setTimeout(() => {
        onClose(notice.id);
      }, delay);

      return () => {
        window.cancelAnimationFrame(frame);
        window.clearTimeout(timeout);
      };
    }, [delay, notice.id, onClose, shouldAutoClose]);

    return (
      <div
        className={cn(
          '!tw-box-border tw-relative tw-grid tw-w-[min(420px,calc(100vw-32px))] tw-grid-cols-[auto_minmax(0,1fr)_auto] tw-gap-3 tw-overflow-hidden tw-rounded-md tw-border tw-border-solid tw-p-3 tw-pr-2',
          feedback.surface
        )}
        data-cci-toast={type}
        role={type === 'error' ? 'alert' : undefined}
      >
        <div
          className='tw-inline-flex tw-h-8 tw-w-8 tw-items-center tw-justify-center [&_svg]:tw-h-4 [&_svg]:tw-w-4'
          aria-hidden='true'
        >
          <Icon />
        </div>
        <div className='tw-grid tw-min-w-0 tw-gap-1 tw-break-words !tw-text-inherit'>
          <strong className='tw-text-sm tw-font-semibold !tw-text-inherit'>{notice.message}</strong>
          {notice.details && <span className='tw-text-sm tw-leading-6'>{notice.details}</span>}
        </div>
        <Button
          variant='unstyled'
          type='button'
          className='tw-inline-flex tw-h-8 tw-w-8 tw-cursor-pointer tw-items-center tw-justify-center tw-rounded-md tw-border-0 tw-bg-transparent tw-p-0 tw-text-current tw-opacity-75 hover:tw-bg-white/70 hover:tw-opacity-100 [&_svg]:tw-h-4 [&_svg]:tw-w-4'
          onClick={() => onClose(notice.id)}
          aria-label={closeLabel}
        >
          <X aria-hidden='true' />
        </Button>
        {shouldAutoClose && (
          <div className='tw-absolute tw-inset-x-0 tw-bottom-0 tw-h-1 tw-bg-black/5' aria-hidden='true'>
            <div
              className={cn('tw-h-full tw-transition-[width] tw-ease-linear', feedback.progress)}
              style={{
                width: draining ? '0%' : '100%',
                transitionDuration: `${delay}ms`,
              }}
            />
          </div>
        )}
      </div>
    );
  }

  return function Notice({ notices = [], onClose, closeLabel = 'Close notification' }) {
    if (!notices.length) {
      return null;
    }

    return (
      <div className='tw-fixed tw-right-6 tw-top-12 tw-z-[100000] tw-grid tw-gap-3' role='status' aria-live='polite'>
        {notices.map((notice) => (
          <ToastItem key={notice.id} notice={notice} onClose={onClose} closeLabel={closeLabel} />
        ))}
      </div>
    );
  };
}
