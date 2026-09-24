const identityFields = [
  'id',
  'key',
  'slug',
  'name',
  'module',
  'moduleName',
  'templateName',
  'template_name',
  'title',
  'label',
];

const genericIdentityTokens = new Set([
  'addon',
  'all',
  'blog',
  'carousel',
  'cci',
  'extension',
  'free',
  'in',
  'integration',
  'menu',
  'module',
  'nice',
  'one',
  'posts',
  'pro',
  'template',
  'templates',
  'wordpress',
  'wp',
]);

export function reconcileCatalogItems(storeItems = [], installedItems = []) {
  const installedEntries = installedItems.map((item) => ({
    item,
    keys: catalogIdentityKeys(item),
  }));

  return storeItems.map((storeItem) => {
    const storeKeys = catalogIdentityKeys(storeItem);
    const installedEntry = installedEntries.find((entry) => keysOverlap(storeKeys, entry.keys));

    if (!installedEntry) {
      return { ...storeItem, installed: Boolean(storeItem.installed) };
    }

    return {
      ...storeItem,
      installed: true,
      screenshot: storeItem.screenshot || installedEntry.item.screenshot || '',
    };
  });
}

export function catalogIdentityKeys(item = {}) {
  const values = identityFields.map((field) => item?.[field]);

  if (Array.isArray(item.catalogKeys)) {
    values.push(...item.catalogKeys);
  }

  const keys = new Set();

  values.forEach((value) => {
    const normalized = normalizeCatalogIdentity(value);
    if (!normalized) {
      return;
    }

    keys.add(normalized);

    const significant = normalized
      .split('-')
      .filter((token) => token && !genericIdentityTokens.has(token))
      .join('-');

    if (significant) {
      keys.add(significant);
    }
  });

  return keys;
}

function normalizeCatalogIdentity(value) {
  const normalized = String(value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/&/g, ' and ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

  return /^\d+$/.test(normalized) ? '' : normalized;
}

function keysOverlap(firstKeys, secondKeys) {
  for (const key of firstKeys) {
    if (secondKeys.has(key)) {
      return true;
    }
  }

  return false;
}
