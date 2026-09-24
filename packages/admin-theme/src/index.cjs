const fs = require('fs');
const path = require('path');
const postcss = require('postcss');
const { createSharedUiSafelist } = require('./runtime-safelist.cjs');
const ADMIN_COLORS = {
  bg: '#f4f6f8',
  surface: '#ffffff',
  surfaceSoft: '#f8fafc',
  surfaceMuted: '#f1f5f9',
  muted: '#5f6b7a',
  text: '#151922',
  border: '#dfe5ec',
  borderStrong: '#c9d3df',
  brand: '#6b4be8',
  brandStrong: '#5232c8',
  brandSoft: '#f3f0ff',
  accent: '#ff8a1f',
  accentStrong: '#e66f00',
  accentSoft: '#fff3e7',
  accentBorder: '#ffd3a8',
  accentText: '#4a2500',
  brandBorder: '#d9d1ff',
  action: '#58c322',
  actionStrong: '#43a616',
  actionSoft: '#f0fbe9',
  actionBorder: '#bfeaa8',
  actionText: '#113b08',
  danger: '#b42318',
  dangerBg: '#fff5f5',
  dangerBorder: '#f0b8b2',
  dangerText: '#8f1d14',
  infoBg: '#eef7ff',
  infoBorder: '#b9daf8',
  infoText: '#174a7c',
  warningBg: '#fff8ef',
  warningBorder: '#f2c28f',
  warningText: '#9a4a12',
  successBg: '#ecf9d5',
  successBorder: '#d9f2aa',
  successText: '#4f7412',
};

const PRODUCT_NAMESPACES = {
  blog: 'cci-blog',
  niceMenu: 'cci-nm',
  wpCarousel: 'cci-wpc',
};

const ADMIN_COLOR_KEYS = [
  'border',
  'borderStrong',
  'brand',
  'brandStrong',
  'brandSoft',
  'brandBorder',
  'action',
  'actionStrong',
  'actionSoft',
  'actionBorder',
  'actionText',
  'danger',
  'dangerBg',
  'dangerBorder',
  'dangerText',
  'infoBg',
  'infoBorder',
  'infoText',
  'warningBg',
  'warningBorder',
  'warningText',
  'successBg',
  'successBorder',
  'successText',
  'muted',
  'text',
];

const ADMIN_STATE_PREFIXES = [
  '',
  'hover:',
  'focus:',
  'focus-visible:',
  'focus-within:',
  'disabled:',
  'read-only:',
  'placeholder:',
  'data-[state=checked]:',
  'data-[state=active]:',
  'data-[highlighted]:',
  'data-[checked=true]:',
];

const SHARED_UI_SAFELIST = [
  'tw-absolute',
  'tw-block',
  'tw-break-words',
  'tw-cursor-default',
  'tw-cursor-not-allowed',
  'tw-cursor-pointer',
  'tw-flex',
  'tw-grid',
  'tw-hidden',
  'tw-inline-flex',
  'tw-left-2',
  'tw-m-0',
  'tw-min-w-0',
  'tw-normal-case',
  'tw-overflow-hidden',
  'tw-p-0',
  'tw-p-1',
  'tw-pb-0',
  'tw-relative',
  'tw-select-none',
  'tw-shrink-0',
  'tw-tracking-normal',
  'tw-transition-colors',
  'tw-w-full',
  'tw-z-[100000]',

  'tw-items-center',
  'tw-justify-center',
  'tw-justify-between',
  'tw-gap-0',
  'tw-gap-1.5',
  'tw-gap-2',
  'tw-gap-3',

  'tw-h-3',
  'tw-h-3.5',
  'tw-h-4',
  'tw-h-6',
  'tw-h-7',
  'tw-h-8',
  'tw-h-9',
  'tw-h-10',
  'tw-h-11',
  'tw-h-px',
  'tw-min-h-8',
  'tw-min-h-9',
  'tw-min-h-10',
  'tw-min-h-24',
  'tw-w-3',
  'tw-w-3.5',
  'tw-w-4',
  'tw-w-6',
  'tw-w-7',
  'tw-w-8',
  'tw-w-9',
  'tw-max-h-[var(--radix-select-content-available-height)]',
  'tw-min-w-[var(--radix-select-trigger-width)]',

  'tw-rounded',
  'tw-rounded-md',
  'tw-border',
  'tw-border-0',
  'tw-border-solid',
  'tw-border-transparent',
  'tw-border-slate-300',
  'tw-bg-slate-50',
  'tw-bg-slate-100',
  'tw-bg-transparent',
  'tw-bg-white',
  'tw-text-slate-400',
  'tw-text-slate-500',
  'tw-text-slate-700',
  'tw-text-white',

  'tw-px-0',
  'tw-px-2',
  'tw-px-2.5',
  'tw-px-3',
  'tw-px-3.5',
  'tw-px-4',
  'tw-py-1',
  'tw-py-1.5',
  'tw-py-2',
  'tw-pl-8',
  'tw-pr-2',

  'tw-text-xs',
  'tw-text-sm',
  'tw-font-bold',
  'tw-font-medium',
  'tw-font-semibold',
  'tw-leading-5',
  'tw-leading-none',
  'tw-no-underline',

  'tw-duration-150',
  'tw-outline-none',
  'tw-outline-2',
  'tw-outline-offset-0',
  'tw-outline-offset-1',
  'tw-shadow-md',
  'tw-shadow-none',

  '!tw-appearance-none',
  '!tw-bg-slate-100',
  '!tw-bg-transparent',
  '!tw-bg-white',
  '!tw-border',
  '!tw-border-slate-300',
  '!tw-border-transparent',
  '!tw-no-underline',
  '!tw-outline',
  '!tw-outline-2',
  '!tw-outline-none',
  '!tw-p-0',
  '!tw-rounded-md',
  '!tw-shadow-none',
  '!tw-text-white',

  '!tw-h-6',
  '!tw-h-7',
  '!tw-h-8',
  '!tw-h-9',
  '!tw-h-10',
  '!tw-h-11',
  '!tw-w-6',
  '!tw-w-7',
  '!tw-w-8',
  '!tw-w-9',
  '!tw-px-0',
  '!tw-px-2',
  '!tw-px-2.5',
  '!tw-px-3.5',
  '!tw-px-4',
  '!tw-text-xs',
  '!tw-text-sm',
  '!tw-leading-none',

  'active:!tw-outline-none',
  'active:!tw-rounded-md',
  'active:!tw-shadow-none',
  'active:!tw-text-white',
  'data-[disabled]:tw-pointer-events-none',
  'data-[disabled]:tw-text-slate-400',
  'disabled:!tw-bg-slate-100',
  'disabled:tw-cursor-not-allowed',
  'disabled:tw-opacity-50',
  'disabled:tw-text-slate-500',
  'focus:!tw-bg-white',
  'focus:!tw-outline',
  'focus:!tw-outline-2',
  'focus:!tw-outline-none',
  'focus:!tw-rounded-md',
  'focus:!tw-shadow-none',
  'focus:!tw-text-white',
  'focus:tw-outline-offset-0',
  'focus-visible:!tw-outline',
  'focus-visible:!tw-outline-2',
  'focus-visible:!tw-text-white',
  'focus-visible:tw-outline-offset-1',
  'focus-visible:tw-outline-offset-0',
  'focus-within:tw-outline',
  'focus-within:tw-outline-2',
  'focus-within:tw-outline-offset-1',
  'hover:!tw-bg-slate-50',
  'hover:!tw-bg-white',
  'hover:!tw-border-slate-300',
  'hover:!tw-rounded-md',
  'hover:!tw-shadow-none',
  'hover:!tw-text-white',
  'hover:tw-bg-slate-50',
  'hover:tw-border-slate-300',
  'read-only:!tw-bg-slate-100',
  'read-only:tw-text-slate-500',
  'visited:!tw-text-white',

  '[&_svg]:tw-h-3.5',
  '[&_svg]:tw-w-3.5',
  '[&_svg]:tw-shrink-0',
];

function createAdminTheme(namespace, colors = {}) {
  return {
    colors: {
      [namespace]: {
        ...ADMIN_COLORS,
        ...colors,
      },
    },
    borderRadius: {
      [namespace]: '8px',
    },
  };
}

function createAdminSafelist(namespace) {
  const classes = new Set();

  for (const key of ADMIN_COLOR_KEYS) {
    for (const state of ADMIN_STATE_PREFIXES) {
      classes.add(`${state}tw-border-${namespace}-${key}`);
      classes.add(`${state}!tw-border-${namespace}-${key}`);
      classes.add(`${state}tw-bg-${namespace}-${key}`);
      classes.add(`${state}!tw-bg-${namespace}-${key}`);
      classes.add(`${state}tw-text-${namespace}-${key}`);
      classes.add(`${state}!tw-text-${namespace}-${key}`);
      classes.add(`${state}tw-outline-${namespace}-${key}`);
      classes.add(`${state}!tw-outline-${namespace}-${key}`);
    }
  }

  return Array.from(classes);
}

function resolveAdminUiContentGlobs() {
  try {
    const packagePath = require.resolve('@cci/admin-ui/package.json');
    const packageDir = packagePath.replace(/[/\\]package\.json$/, '');

    return [
      `${packageDir}/src/**/*.{js,jsx}`,
      `${packageDir}/dist/**/*.js`,
    ];
  } catch (error) {
    return [];
  }
}

function createTailwindConfig({
  namespace,
  content = ['./src/admin-v2/**/*.{js,jsx}'],
  safelist = [],
  safelistMode = 'all-colors',
  colors = {},
  plugins = [],
} = {}) {
  if (!namespace) {
    throw new Error('createTailwindConfig requires a namespace.');
  }

  if (!['all-colors', 'shared-ui'].includes(safelistMode)) {
    throw new Error(`Unknown admin safelist mode: ${safelistMode}`);
  }

  const adminUiContent = resolveAdminUiContentGlobs();
  // Keep the broad public contract for unaudited consumers. Audited products
  // cover their own namespace and shared panels, which use cci-nm tokens.
  const colorSafelist = safelistMode === 'shared-ui'
    ? [...new Set([namespace, 'cci-nm'])].flatMap(createSharedUiSafelist)
    : createAdminSafelist(namespace);

  return {
    prefix: 'tw-',
    corePlugins: {
      preflight: false,
    },
    content: [...content, ...adminUiContent],
    safelist: [...SHARED_UI_SAFELIST, ...colorSafelist, ...safelist],
    theme: {
      extend: { ...createAdminTheme(namespace, colors), colors: { ...createAdminTheme(namespace, colors).colors, ...createAdminTheme('cci-nm', colors).colors } },
    },
    plugins: [({addBase, addComponents}) => {
      addBase({'.cci-admin-layout-shell': {'--cci-admin-brand': ADMIN_COLORS.brand, '--cci-admin-brand-hover': ADMIN_COLORS.brandStrong, '--cci-admin-brand-soft': ADMIN_COLORS.brandSoft, '--cci-admin-brand-border': ADMIN_COLORS.brandBorder, '--cci-admin-radius': '0.375rem'}});
      addBase(postcss.parse(fs.readFileSync(path.join(__dirname, 'admin-controls.css'), 'utf8')).nodes);
      // Host headings must use the panel font; authored editor content keeps its own typography.
      // Components also ship in consumers that deliberately omit Tailwind's base layer.
      addComponents({
        ':is(.cci-admin-layout-shell, .cci-wpc-admin-shell, .cci-cookie-consent-admin-shell) :is(h1, h2, h3, h4, h5, h6):not(.bn-container *)': { fontFamily: 'inherit' },
      }, { respectPrefix: false });
    }, ...plugins],
  };
}

module.exports = {
  ADMIN_COLORS,
  PRODUCT_NAMESPACES,
  createAdminTheme,
  createAdminSafelist,
  createSharedUiSafelist,
  createTailwindConfig,
  SHARED_UI_SAFELIST,
  resolveAdminUiContentGlobs,
};
