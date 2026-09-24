# Forms and feedback

Use the product's themed entry point for all controls in a screen. Keep labels, errors and persistence in the product so the same components work on both platforms.

## Save a setting

This component accepts `saveSettings({ title, period })`, a function returning a promise that rejects when saving fails. It demonstrates a field error, a form error and a toast without creating a second alert style.

```jsx
import React, { useId, useState } from 'react';
import {
  Button, Card, CardHeader, CardTitle, CardContent, Field,
  FieldLabel, FieldError, Input, Select, InfoCallout, Notice,
} from '@cci/admin-ui/blog';

export function ReportSettings({ saveSettings }) {
  const id = useId();
  const [title, setTitle] = useState('');
  const [period, setPeriod] = useState('30');
  const [fieldError, setFieldError] = useState('');
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);
  const [notices, setNotices] = useState([]);
  const closeNotice = (noticeId) => setNotices(items => items.filter(item => item.id !== noticeId));
  const notify = (type, message) => setNotices([{ id: Date.now(), type, message }]);

  async function submit(event) {
    event.preventDefault();
    if (saving) return;
    setFormError('');
    if (!title.trim()) {
      const message = 'Enter a report title.';
      setFieldError(message);
      notify('error', message);
      event.currentTarget.elements.namedItem('title').focus();
      return;
    }
    setFieldError('');
    setSaving(true);
    try {
      await saveSettings({ title: title.trim(), period });
      notify('success', 'Settings saved.');
    } catch (error) {
      const message = error.details || error.message || 'Settings could not be saved.';
      setFormError(message);
      notify('error', message);
    } finally {
      setSaving(false);
    }
  }

  return (
    <>
      <Notice notices={notices} onClose={closeNotice} />
      <Card>
        <CardHeader><CardTitle>Report settings</CardTitle></CardHeader>
        <CardContent>
          <form onSubmit={submit} noValidate className="tw-grid tw-gap-4">
            <Field>
              <FieldLabel htmlFor={`${id}-title`}>Report title</FieldLabel>
              <Input id={`${id}-title`} name="title" value={title}
                onChange={event => { setTitle(event.target.value); setFieldError(''); }}
                aria-invalid={Boolean(fieldError)}
                aria-describedby={fieldError ? `${id}-error` : undefined} />
              {fieldError && <FieldError id={`${id}-error`}>{fieldError}</FieldError>}
            </Field>
            <Field>
              <FieldLabel htmlFor={`${id}-period`}>Report period</FieldLabel>
              <Select id={`${id}-period`} value={period} onValueChange={setPeriod}
                options={[{ value: '7', label: 'Last 7 days' }, { value: '30', label: 'Last 30 days' }]} />
            </Field>
            {formError && <InfoCallout tone="error" role="alert" title="Save failed">{formError}</InfoCallout>}
            <Button type="submit" variant="primary" disabled={saving}>
              {saving ? 'Saving...' : 'Save settings'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </>
  );
}
```

Replace literal copy with the product's translation function in a localized screen. Show backend failures as form errors unless the backend identifies a specific invalid field. Use the same message in the persistent alert and toast. An empty required value is a field error; a revoked license or unavailable API is not.

## Controls and feedback contract

| Component | Main inputs and behavior |
| --- | --- |
| `Button` | Native button props; `type` defaults to `button`; `variant`, `size`, `asChild`. Returns a button or styles its single child via Radix Slot. Use `type="submit"` for submission. |
| `Input`, `Textarea` | Forward native attributes and refs. Connect `id`, `htmlFor`, `aria-invalid` and `aria-describedby` yourself. |
| `Select` | Controlled `value: string`, `onValueChange(value: string)`, `options: Array<{value: string, label: ReactNode, disabled?: boolean}>`; optional `id`, `placeholder`, `disabled`, `invalid`, `ariaLabel`, `className`. Returns a Radix trigger and portalled list. Submit the controlled value explicitly; there is no public `name` prop. |
| `Field`, `FieldLabel`, `FieldError` | Compose a labelled field. `Field` also accepts `note`, `error` and `orientation`; an explicit `FieldLabel htmlFor` connects a control. |
| `InfoCallout` | `tone` is `error`, `warning`, `info` or `success`; accepts `title`, `children`, `icon`, `actions`, native div attributes. Persistent content; no dismissal timer. Add `role="alert"` for a new error. |
| `Notice` | `notices: Array<{id, type, message, duration?, sticky?}>`, `onClose(id)`, optional `closeLabel`. Displays shared toasts. Default durations: error/warning 8000 ms, info 6500 ms, success 4500 ms; `sticky: true` disables automatic dismissal. |

## Links use the button contract too

```jsx
import React from 'react';
import { Button } from '@cci/admin-ui/blog';

export function ArticleLinks({ url, title, excerpt }) {
  return (
    <Button asChild variant="cardLink">
      <a href={url} className="tw-p-4">
        <strong data-card-link-title>{title}</strong>
        <p>{excerpt}</p>
      </a>
    </Button>
  );
}
```

Supply a validated article URL. The card gets shared hover/focus styling and title underlining. Do not nest a second link or button inside it. For a standalone action link use `variant="outlineAccent"` with `asChild` and an anchor. Use `primary` for the main brand action and `add` for creation (the same brand colors and interaction states), `outlineInverse` on a brand surface, and `danger` for deactivation/deletion. Do not recolor these controls with local CSS.


## Controls inside an imperative dialog

An existing DOM-based integration can mount the same controls through `createLocalMediaLibraryUiBridge`. Pass components from the product theme and React's `flushSync` so a newly mounted input is available before focusing it.

```jsx
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import {
  Button, Input, InfoCallout, Select, LoadingState,
  createLocalMediaLibraryUiBridge,
} from '@cci/admin-ui/blog';

const ui = createLocalMediaLibraryUiBridge({
  createRoot, flushSync, Button, Input, InfoCallout, Select, LoadingState,
});
const action = ui.mountButton(buttonHost, {
  children: 'Use image', variant: 'primary', disabled: true,
  onClick: selectImage,
});
// Update complete props when selection changes.
action.update({ children: 'Use image', variant: 'primary', onClick: selectImage });
// Unmount each control before removing the dialog's DOM.
action.destroy();
```

`mountInput`, `mountSelect`, `mountLoading` and `mountFeedback` follow the same `{ update, destroy }` contract and accept their respective component props. `mountInput` also exposes `node` for focus and uncontrolled input access. Use `mountFeedback` with `tone="error"` and `role="alert"` for request failures. Keep transport and access checks in the owning product; the bridge only renders controls.