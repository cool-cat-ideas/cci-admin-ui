import { loadSdk } from '../sdk';

export async function mount(container, config, operation, onToken, onError) {
  const api = await loadSdk('recaptcha');
  if (!container.isConnected) return () => {};
  const id = api.render(container, {
    sitekey: config.siteKey,
    size: container.getBoundingClientRect().width < 304 ? 'compact' : 'normal',
    callback: onToken,
    'expired-callback': () => onToken(''),
    'error-callback': () => {
      onToken('');
      onError();
    },
  });
  // reCAPTCHA v2 has no remove API. Reset only our widget, then remove our own host.
  return () => {
    api.reset(id);
    container.replaceChildren();
  };
}
