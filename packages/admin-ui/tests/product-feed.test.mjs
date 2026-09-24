import test from 'node:test';
import assert from 'node:assert/strict';
import {fetchProductFeed, normalizeProductNews} from '../src/product-feed.js';
test('public news feed has one validated success cache and never treats an error as empty news', async () => {
  const original=globalThis.fetch;
  const calls=[];let response=new Response(JSON.stringify({news:[],product:{slug:'one'}}));
  globalThis.fetch=async (url,options)=>{calls.push({url,options});return response.clone();};
  try {
    const a=await fetchProductFeed('https://cci.example/products/one');
    const b=await fetchProductFeed('https://cci.example/products/one');
    assert.deepEqual(a,b);assert.equal(calls.length,1);assert.equal(calls[0].options.credentials,'omit');
    await fetchProductFeed('https://cci.example/products/two');assert.equal(calls.length,2);
    response=new Response('{}',{status:403});
    await assert.rejects(fetchProductFeed('https://cci.example/products/one',true),/403/);
    response=new Response(JSON.stringify({product:{slug:'one'}}));
    await assert.rejects(fetchProductFeed('https://cci.example/products/one'),/current news feed/);
    response=new Response(JSON.stringify({news:[],_meta:{source:'empty'}}));
    await assert.rejects(fetchProductFeed('https://cci.example/products/one',true),/current news feed/);
    response=new Response(JSON.stringify({news:[{title:'Published news'}]}));
    assert.equal((await fetchProductFeed('https://cci.example/products/one',true)).news[0].title,'Published news');
    assert.deepEqual(normalizeProductNews([null,{title:'News',publishedAt:'invalid'}],'en'),[{id:'News',title:'News',excerpt:'',date:'',kind:'news',url:'',content:''}]);
  } finally {globalThis.fetch=original;}
});

test('news links retain the specific announcement destination', () => {
  const announcementUrl = 'https://coolcatideas.com/news/carousel-update?source=plugin#details';
  const [item] = normalizeProductNews(
    [{ title: 'Carousel update', kind: 'release', url: announcementUrl }],
    'en',
  );

  assert.equal(item.kind, 'release');
  assert.equal(item.url, announcementUrl);
  assert.equal(Object.hasOwn(item, 'productLink'), false);
});

test('news without an announcement URL never substitutes the product page', () => {
  const productUrl = 'https://coolcatideas.com/products/wp-posts-carousel-all-in-one';
  const items = normalizeProductNews(
    [{ title: 'No URL' }, { title: 'Empty URL', url: '' }],
    'en',
    undefined,
    productUrl,
  );

  for (const item of items) {
    assert.equal(item.url, '');
    assert.equal(Object.hasOwn(item, 'productLink'), false);
  }
});

test('only absolute HTTP and HTTPS URLs become news links', () => {
  const invalidUrls = [
    'javascript:alert(1)',
    'data:text/html,<h1>Unexpected page</h1>',
    'mailto:support@example.com',
    '/products/carousel',
    '//example.com/news',
    'not a URL',
  ];

  for (const url of invalidUrls) {
    const [unlinked] = normalizeProductNews([{ title: 'News', url }], 'en');
    assert.equal(unlinked.url, '', `Unsafe or relative URL must be rejected: ${url}`);

    const productUrl = 'https://coolcatideas.com/products/wp-posts-carousel-all-in-one';
    const [withoutFallback] = normalizeProductNews([{ title: 'News', url }], 'en', undefined, productUrl);
    assert.equal(withoutFallback.url, '');
  }

  for (const url of ['https://example.com/news', 'http://localhost:3000/news']) {
    const [item] = normalizeProductNews([{ title: 'News', url }], 'en');
    assert.equal(item.url, url);
  }
});

test('news kinds follow the feed contract and unknown values use the generic news kind', () => {
  for (const kind of ['news', 'release', 'security', 'maintenance']) {
    const [item] = normalizeProductNews([{ title: 'News', kind }], 'en');
    assert.equal(item.kind, kind);
  }

  for (const kind of ['unexpected', '', null, undefined]) {
    const [item] = normalizeProductNews([{ title: 'News', kind }], 'en');
    assert.equal(item.kind, 'news');
    assert.equal(item.url, '');
    assert.equal(item.content, '');
  }
});

test('news preserves the full announcement as plain text', () => {
  const content = '# Release details\n\nNew features and fixes.\n\n<strong>Plain text, not HTML rendering.</strong>';
  const [item] = normalizeProductNews(
    [{ title: 'Release', excerpt: 'A short preview.', content }],
    'en',
  );

  assert.equal(item.excerpt, 'A short preview.');
  assert.equal(item.content, content);
  assert.equal(item.url, '');

  for (const content of [undefined, null, 42, { text: 'Unsupported rich text' }, ['Unsupported array']]) {
    const [item] = normalizeProductNews([{ title: 'News', content }], 'en');
    assert.equal(item.content, '');
  }
});

test('news keeps at most four valid entries in feed order', () => {
  const items = normalizeProductNews(
    [null, { excerpt: 'Missing title' }, ...Array.from({ length: 6 }, (_, index) => ({
      id: `news-${index + 1}`,
      title: `News ${index + 1}`,
      content: `Full text ${index + 1}`,
    }))],
    'en',
  );

  assert.deepEqual(items.map(item => item.id), ['news-1', 'news-2', 'news-3', 'news-4']);
  assert.equal(items[3].content, 'Full text 4');
});
