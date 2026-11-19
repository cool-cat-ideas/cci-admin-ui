import React, { useEffect, useRef, useState } from 'react';
import * as turnstile from './turnstile';
import * as recaptcha from './recaptcha';


const builtins = { turnstile, recaptcha };

export function Captcha({ config, operation, attempt, onToken, validationError, t, captchaAdapter, className = "cci-inquiry-captcha", errorClassName = "cci-inquiry-field-error" }) {
  const container = useRef(null),
    tokenHandler = useRef(onToken);
  const [error, setError] = useState('');
  tokenHandler.current = onToken;
  useEffect(() => {
    if (!config) return;
    let disposed = false,
      remove;
    setError('');
    tokenHandler.current('');
    // A separate element per attempt prevents a slow SDK from mounting into a newer widget.
    const host = document.createElement('div');
    container.current.append(host);
    const fail = () => {
      if (!disposed)
        setError(
          'The security check could not load. Check for a conflicting CAPTCHA plugin or a blocked script, then refresh the page.',
        );
    };
    Promise.resolve()
      .then(() => {
        const adapter = builtins[config.provider] || captchaAdapter?.(config.provider);
        if (!adapter) throw new Error('Missing CAPTCHA adapter.');
        return adapter.mount(
          host,
          config,
          operation,
          (token) => {
            if (!disposed) {
              if (token) setError('');
              tokenHandler.current(token);
            }
          },
          fail,
        );
      })
      .then((cleanup) => {
        if (disposed) cleanup?.();
        else remove = cleanup;
      })
      .catch(fail);
    return () => {
      disposed = true;
      tokenHandler.current('');
      try {
        remove?.();
      } catch {
        /* A provider cleanup must not break another form. */
      } finally {
        host.remove();
      }
    };
  }, [config?.provider, config?.siteKey, operation, attempt]);
  if (!config) return null;
  return (
    <div
      className={className}
      tabIndex={-1}
      data-field="captcha"
      role="group"
      aria-label={t('Security check')}
    >
      <div ref={container} />
      {error && (
        <p className={errorClassName} role="alert">
          {t(error)}
        </p>
      )}
      {validationError && !error && (
        <p className={errorClassName} role="alert">
          {t(validationError)}
        </p>
      )}
    </div>
  );
}
