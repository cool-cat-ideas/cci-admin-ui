import React, { useId, useLayoutEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Save, X } from 'lucide-react';
import { CaptchaSettingsFields } from './SettingsFields';

export function CaptchaSettingsDialog({
  controls,
  current,
  draft,
  setDraft,
  setupUrl,
  disabled,
  error,
  onSave,
  portal,
  busy,
  onClose,
  initialFocusRef,
  returnFocusRef,
  note,
  t,
}) {
  const { Button, InfoCallout } = controls;
  const dialog = useRef(null);
  const id = useId();
  useLayoutEffect(() => {
    const previous = document.activeElement;
    const element = dialog.current;
    element.showModal();
    initialFocusRef?.current?.focus();
    return () => {
      element.close();
      const target = returnFocusRef?.current || previous;
      if (target?.isConnected) target.focus();
    };
  }, [initialFocusRef, returnFocusRef]);
  return createPortal(
    <dialog
      ref={dialog}
      className="cci-captcha-dialog"
      aria-labelledby={`${id}-title`}
      onCancel={(event) => {
        event.preventDefault();
        if (!busy) onClose();
      }}
      onClick={(event) => {
        if (event.target !== event.currentTarget || busy) return;
        const box = event.currentTarget.getBoundingClientRect();
        if (
          event.clientX < box.left ||
          event.clientX > box.right ||
          event.clientY < box.top ||
          event.clientY > box.bottom
        )
          onClose();
      }}
    >
      <header className="cci-captcha-dialog-header">
        <div>
          <h2 id={`${id}-title`}>{current.title}</h2>
        </div>
        <Button
          type="button"
          variant="secondary"
          size="iconSm"
          className="tw-shrink-0"
          aria-label={t('Close')}
          disabled={busy}
          onClick={onClose}
        >
          <X aria-hidden="true" />
        </Button>
      </header>
      <form onSubmit={onSave}>
        <div className="cci-captcha-dialog-fields">
          {error && <InfoCallout tone="warning" role="alert">{t(error)}</InfoCallout>}
          <CaptchaSettingsFields
            controls={controls}
            current={current}
            draft={draft}
            setDraft={setDraft}
            disabled={disabled || busy}
            siteKeyInput={initialFocusRef}
            setupUrl={setupUrl}
            t={t}
            note={note}
          />
        </div>
        <footer className="cci-captcha-dialog-footer">
          <Button type="button" variant="secondary" disabled={busy} onClick={onClose}>
            {t('Cancel')}
          </Button>
          <Button type="submit" variant="save" disabled={disabled || busy}>
            <Save aria-hidden="true" />
            {t(busy ? 'Saving…' : 'Save')}
          </Button>
        </footer>
      </form>
    </dialog>,
    portal(),
  );
}
