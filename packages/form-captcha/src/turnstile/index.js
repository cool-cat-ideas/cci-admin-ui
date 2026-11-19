import { loadSdk } from '../sdk';

export async function mount(container, config, operation, onToken, onError) {
  const api = await loadSdk('turnstile');
  if (!container.isConnected) return () => {};
  const id = api.render(container, {
    sitekey: config.siteKey,
    size: container.getBoundingClientRect().width < 300 ? 'compact' : 'normal',
    action: config.action || `cci_inquiry_${operation}`,
    'response-field': false,
    callback: onToken,
    'expired-callback': () => onToken(''),
    'timeout-callback': () => onToken(''),
    'error-callback': () => {
      onToken('');
      onError();
    },
  });
  return () => {
    api.remove(id);
  };
}
