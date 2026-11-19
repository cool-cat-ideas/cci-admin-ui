const pending = new Map();
const providers = {
  turnstile: {
    global: 'turnstile',
    url: 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit',
    matches: (url) =>
      url.hostname === 'challenges.cloudflare.com' && url.pathname === '/turnstile/v0/api.js',
  },
  recaptcha: {
    global: 'grecaptcha',
    url: 'https://www.google.com/recaptcha/api.js?render=explicit',
    matches: (url) =>
      ['www.google.com', 'www.recaptcha.net'].includes(url.hostname) &&
      ['/recaptcha/api.js', '/recaptcha/enterprise.js'].includes(url.pathname),
  },
};
const loadError =
  'The security check could not load. Check for a conflicting CAPTCHA plugin or a blocked script, then refresh the page.';

const compatible = (api, id) =>
  typeof api?.render === 'function' &&
  typeof api?.reset === 'function' &&
  (id !== 'turnstile' || typeof api.remove === 'function');

function ready(api, id) {
  if (id !== 'recaptcha' || typeof api.ready !== 'function') return Promise.resolve(api);
  return new Promise((resolve, reject) => {
    const timeout = setTimeout(() => reject(new Error(loadError)), 15000);
    api.ready(() => {
      clearTimeout(timeout);
      resolve(api);
    });
  });
}

export function loadSdk(id) {
  const provider = providers[id];
  if (!provider)
    return Promise.reject(new Error('The form protection is unavailable. Contact the shop.'));
  if (compatible(window[provider.global], id)) return ready(window[provider.global], id);
  if (pending.has(id)) return pending.get(id);
  const promise = new Promise((resolve, reject) => {
    let script = [...document.scripts].find((node) => {
      try {
        return provider.matches(new URL(node.src, location.href));
      } catch {
        return false;
      }
    });
    // An existing plugin owns this API. Wait for it instead of replacing it or its callbacks.
    const owned = !script && !window[provider.global];
    if (owned) {
      script = document.createElement('script');
      script.src = provider.url;
      script.async = true;
      script.defer = true;
      script.dataset.cciInquirySdk = id;
      document.head.append(script);
    }
    const start = Date.now();
    const timer = setInterval(() => {
      if (compatible(window[provider.global], id)) {
        clearInterval(timer);
        resolve(ready(window[provider.global], id));
      } else if (Date.now() - start > 15000) {
        clearInterval(timer);
        if (owned) script?.remove();
        reject(new Error(loadError));
      }
    }, 50);
  });
  pending.set(id, promise);
  promise.catch(() => pending.delete(id));
  return promise;
}
