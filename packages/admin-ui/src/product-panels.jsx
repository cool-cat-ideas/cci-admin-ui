import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { createButton } from "./button.jsx";
const Button = createButton();

export function DiagnosticCard({ label, values }) {
  return (
    <div className="tw-rounded-md tw-border tw-border-solid tw-border-cci-nm-border tw-bg-white tw-p-4">
      <strong className="tw-text-sm tw-font-semibold tw-text-cci-nm-text">
        {label}
      </strong>
      <dl className="tw-m-0 tw-mt-3 tw-grid tw-gap-2">
        {values.map(([name, value]) => (
          <div
            className="tw-flex tw-items-center tw-justify-between tw-gap-3"
            key={name}
          >
            <dt className="tw-text-xs tw-text-cci-nm-muted">{name}</dt>
            <dd className="tw-m-0 tw-text-right tw-text-xs tw-font-semibold tw-text-cci-nm-text">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

export function DiagnosticList({ title, items, empty }) {
  return (
    <div className="tw-grid tw-gap-3">
      <div className="tw-text-sm tw-font-semibold tw-text-cci-nm-text">
        {title}
      </div>
      {items.length ? (
        <ul className="tw-m-0 tw-grid tw-list-none tw-gap-2 tw-p-0">
          {items.map((item, index) => (
            <li
              className="tw-grid tw-gap-1 tw-rounded-md tw-border tw-border-solid tw-border-cci-nm-border tw-bg-cci-nm-surfaceSoft tw-p-3"
              key={`${item.title}-${index}`}
            >
              <strong className="tw-text-sm tw-font-semibold tw-text-cci-nm-text">
                {item.title}
              </strong>
              <span className="tw-text-xs tw-leading-5 tw-text-cci-nm-muted">
                {item.message}
              </span>
            </li>
          ))}
        </ul>
      ) : (
        <p className="tw-m-0 tw-text-sm tw-text-cci-nm-muted">{empty}</p>
      )}
    </div>
  );
}

/** Navigation markup and classes extracted from CCI Nice Menu DashboardSidebar. */
export function ProductNavigation({
  logo,
  items,
  activeSection,
  collapsed,
  onSelect,
  onCollapsedChange,
  labels,
  children,
}) {
  return (
    <aside
      className={`cci-admin-product-sidebar tw-grid tw-h-auto tw-min-h-full tw-self-stretch tw-grid-rows-[auto_minmax(0,1fr)] tw-overflow-hidden tw-border-0 tw-border-r tw-border-solid tw-border-cci-nm-border tw-bg-white ${collapsed ? "tw-gap-4 tw-px-3 tw-py-5" : "tw-gap-5 tw-px-4 tw-py-6"} max-[960px]:tw-min-h-0 max-[960px]:tw-grid-rows-[auto_auto] max-[960px]:tw-border-r-0 max-[960px]:tw-border-b max-[960px]:tw-p-4`}
    >
      <div
        className={`${collapsed ? "tw-grid tw-min-h-[42px] tw-justify-items-center tw-gap-2" : "tw-flex tw-min-h-[103px] tw-items-start tw-justify-between tw-gap-2"} max-[960px]:tw-min-h-[42px] max-[960px]:tw-flex max-[960px]:tw-items-center max-[960px]:tw-justify-center`}
      >
        {logo}
        <Button
          variant="builder"
          size="iconSm"
          aria-label={collapsed ? labels.expand : labels.collapse}
          title={collapsed ? labels.expand : labels.collapse}
          onClick={() => onCollapsedChange(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight aria-hidden="true" />
          ) : (
            <ChevronLeft aria-hidden="true" />
          )}
        </Button>
      </div>
      <div className="tw-grid tw-min-h-0 tw-content-start tw-gap-2.5 tw-overflow-y-auto tw-pr-1 max-[960px]:tw-overflow-x-auto max-[960px]:tw-overflow-y-hidden max-[960px]:tw-pr-0">
        {!collapsed && (
          <span className="tw-px-2.5 tw-text-[11px] tw-font-bold tw-uppercase tw-leading-none tw-tracking-normal tw-text-cci-nm-muted max-[960px]:tw-hidden">
            {labels.menu}
          </span>
        )}
        <nav
          aria-label={labels.menu}
          className="tw-grid tw-content-start tw-gap-1.5 max-[960px]:tw-grid-flow-col max-[960px]:tw-auto-cols-[42px] max-[960px]:tw-justify-center"
        >
          {items.map(({ id, label, icon: Icon }) => (
            <Button
              key={id}
              variant="unstyled"
              aria-label={label}
              title={collapsed ? label : undefined}
              aria-current={activeSection === id ? "page" : undefined}
              onClick={() => onSelect(id)}
              className={`!tw-appearance-none !tw-shadow-none !tw-outline-none !tw-no-underline !tw-m-0 tw-flex tw-min-h-[42px] tw-w-full tw-cursor-pointer tw-items-center tw-gap-2.5 tw-rounded-md !tw-border tw-border-solid tw-px-3 tw-py-0 tw-text-left tw-text-sm tw-font-semibold tw-leading-none tw-transition-colors tw-duration-150 [&_svg]:tw-h-[18px] [&_svg]:tw-w-[18px] [&_svg]:tw-shrink-0 ${collapsed ? "tw-justify-center tw-gap-0 tw-px-0" : ""} ${activeSection === id ? "!tw-border-cci-nm-brandBorder !tw-bg-cci-nm-brandSoft !tw-text-cci-nm-brandStrong hover:!tw-border-cci-nm-brand hover:!tw-bg-white" : "!tw-border-transparent !tw-bg-transparent !tw-text-slate-700 hover:!tw-border-cci-nm-brandBorder hover:!tw-bg-cci-nm-brandSoft hover:!tw-text-cci-nm-brandStrong"} max-[960px]:tw-justify-center max-[960px]:tw-gap-0 max-[960px]:tw-px-0`}
            >
              <Icon aria-hidden="true" />
              {!collapsed && (
                <span className="tw-min-w-0 tw-flex-1 tw-truncate max-[960px]:tw-hidden">
                  {label}
                </span>
              )}
            </Button>
          ))}
        </nav>
        {children}
      </div>
    </aside>
  );
}

export { ProductNewsPanel, ProductNewsProvider, ProductNewsView } from './product-news.jsx';

export { ProductStatusPanel, compareProductVersions } from './product-status.jsx';

export { useProductFeed, normalizeProductNews } from './product-feed.js';
