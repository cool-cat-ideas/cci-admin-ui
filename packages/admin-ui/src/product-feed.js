import { formatAdminDateTime } from './date-format.js';
import { useCallback, useEffect, useState } from 'react';
const requests = new Map();
const cache = new Map();
const retryDelay = 120000;
/** Public product feeds share transport, validation and cache semantics across platforms. */
export function fetchProductFeed(endpoint, force = false) {
  if (!endpoint) return Promise.reject(new Error('Missing product feed endpoint.'));
  if (requests.has(endpoint)) return requests.get(endpoint);
  const cached = cache.get(endpoint);
  if (!force && cached && Date.now() - cached.at < retryDelay) return Promise.resolve(cached.data);
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const request = fetch(endpoint, { credentials: 'omit', headers: { Accept: 'application/json' }, cache: 'no-store', signal: controller.signal })
    .then(async response => {
      if (!response.ok) throw new Error(`Product feed request failed (${response.status}).`);
      const data = await response.json();
      if (!data || !Array.isArray(data.news) || data.success === false || data._meta?.ok === false || data._meta?.stale || data._meta?.source === 'empty') throw new Error('The product service did not return a current news feed.');
      cache.set(endpoint, { data, at: Date.now() });
      return data;
    }).catch(error => { cache.delete(endpoint); throw error; }).finally(() => { clearTimeout(timeout); requests.delete(endpoint); });
  requests.set(endpoint, request);
  return request;
}
export function useProductFeed(endpoint) {
  const [attempt, setAttempt] = useState(0);
  const [state, setState] = useState({ data: null, loading: true, error: '' });
  useEffect(() => {
    let active = true, timer;
    setState({ data: null, loading: true, error: '' });
    fetchProductFeed(endpoint, attempt > 0).then(data => {
      if (active) setState({ data, loading: false, error: '' });
    }).catch(error => {
      if (!active) return;
      setState({ data: null, loading: false, error: error.message });
      timer = setTimeout(() => setAttempt(value => value + 1), retryDelay);
    });
    return () => { active = false; clearTimeout(timer); };
  }, [endpoint, attempt]);
  const refresh = useCallback(() => setAttempt(value => value + 1), []);
  return { ...state, refresh };
}
function safeNewsUrl(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value);
    return ['http:', 'https:'].includes(url.protocol) && !url.username && !url.password ? url.href : '';
  } catch {
    return '';
  }
}

export function normalizeProductNews(items, locale, adminDate) {
  return (Array.isArray(items) ? items : []).filter(item => item && typeof item.title === 'string').slice(0, 4).map(item => {
    const articleUrl = safeNewsUrl(item.url);
    const kind = ['news', 'release', 'security', 'maintenance'].includes(item.kind) ? item.kind : 'news';
    return {
      id: item.id || item.title,
      title: item.title,
      excerpt: typeof item.excerpt === 'string' ? item.excerpt : '',
      date: formatAdminDateTime(item.publishedAt, adminDate || { locale }, false),
      kind,
      url: articleUrl,
      content: typeof item.content === 'string' ? item.content : '',
    };
  });
}
