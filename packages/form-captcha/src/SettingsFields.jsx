import React from 'react';
import { ExternalLink } from 'lucide-react';

export function CaptchaSettingsFields({
  controls, current, draft, setDraft, disabled, siteKeyInput, setupUrl, t, note,
}) {
  const { Button, CheckboxField, Field, Input, InfoCallout } = controls;
  return (
    <>
      <InfoCallout tone="info">
        {t('Only one CAPTCHA provider can be enabled. Enabling this integration disables the other provider and keeps its keys.')}{' '}
        {note}
      </InfoCallout>
      <CheckboxField
        checked={draft.enabled}
        disabled={disabled}
        onCheckedChange={(enabled) => setDraft((value) => ({ ...value, enabled: !!enabled }))}
      >
        {t('Enable form protection')}
      </CheckboxField>
      <Field label={t('Site key')}>
        <Input
          ref={siteKeyInput}
          autoComplete="off"
          value={draft.siteKey}
          disabled={disabled}
          onChange={(event) => setDraft((value) => ({ ...value, siteKey: event.target.value.trim() }))}
        />
      </Field>
      <Field
        label={t('Secret key')}
        hint={t(current.hasSecret
          ? 'A secret key is stored. Leave this field empty to keep it.'
          : 'Copy the secret key from the provider. It is never shown to visitors.')}
      >
        <Input
          type="password"
          autoComplete="new-password"
          value={draft.secret}
          disabled={disabled}
          onChange={(event) => setDraft((value) => ({ ...value, secret: event.target.value.trim() }))}
        />
      </Field>
      <InfoCallout
        tone="info"
        actions={setupUrl && (
          <Button asChild variant="outlineAccent" size="sm">
            <a href={setupUrl} target="_blank" rel="noopener noreferrer">
              <ExternalLink aria-hidden="true" />
              {t('Get service keys')}
            </a>
          </Button>
        )}
      >
        {t("Add every domain where your forms run in the provider's settings. For Google choose reCAPTCHA v2: I'm not a robot checkbox.")}
      </InfoCallout>
    </>
  );
}
