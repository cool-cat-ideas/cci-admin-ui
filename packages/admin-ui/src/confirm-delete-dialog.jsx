import React, { useEffect, useId, useRef } from "react";
import { createPortal } from "react-dom";
import { Trash2 } from "lucide-react";
import { createButton } from "./button.jsx";
const Button = createButton();

/** Native modal focus containment with CCI Nice Menu's destructive-action layout. */
export function ConfirmDeleteDialog({
  open,
  title,
  description,
  cancelLabel,
  confirmLabel,
  onCancel,
  onConfirm,
  disabled = false,
  returnFocusRef,
}) {
  const dialog = useRef(null);
  const cancel = useRef(null);
  const id = useId();
  useEffect(() => {
    if (!open) return;
    const previous = document.activeElement;
    const element = dialog.current;
    element.showModal();
    cancel.current?.focus();
    return () => {
      element.close();
      if (previous?.isConnected) previous.focus();
      else returnFocusRef?.current?.focus();
    };
  }, [open]);
  if (!open) return null;
  return createPortal(
    <dialog
      ref={dialog}
      style={{ width: "calc(100% - 32px)" }}
      role="alertdialog"
      aria-labelledby={`${id}-title`}
      aria-describedby={`${id}-description`}
      onCancel={(event) => {
        event.preventDefault();
        if (!disabled) onCancel();
      }}
      className="tw-m-auto tw-w-full tw-max-w-md tw-overflow-hidden tw-rounded-lg tw-border tw-border-solid tw-border-slate-200 tw-bg-white tw-p-0 tw-text-slate-800 tw-shadow-2xl backdrop:tw-bg-slate-950/35"
    >
      <div className="tw-border-0 tw-border-b tw-border-solid tw-border-slate-200 tw-px-5 tw-py-4">
        <h2
          id={`${id}-title`}
          className="!tw-m-0 !tw-text-lg tw-font-semibold tw-leading-tight"
        >
          {title}
        </h2>
        <p
          id={`${id}-description`}
          className="!tw-m-0 tw-mt-2 !tw-text-sm tw-leading-6 tw-text-slate-600"
        >
          {description}
        </p>
      </div>
      <div className="tw-flex tw-flex-wrap tw-justify-end tw-gap-2 tw-p-5">
        <Button
          ref={cancel}
          variant="secondary"
          onClick={onCancel}
          disabled={disabled}
        >
          {cancelLabel}
        </Button>
        <Button variant="danger" onClick={onConfirm} disabled={disabled}>
          <Trash2 aria-hidden="true" />
          {confirmLabel}
        </Button>
      </div>
    </dialog>,
    document.body,
  );
}
