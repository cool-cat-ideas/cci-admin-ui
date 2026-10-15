import React, { createContext, useContext, useId } from "react";
import { useProductFeed, normalizeProductNews } from "./product-feed.js";
import { Bell, ArrowUpRight, RefreshCw } from "lucide-react";
import { createCardComponents } from "./card.jsx";
import { createLoadingState } from "./loading-state.jsx";
import { createButton } from "./button.jsx";
import { createInfoCallout } from "./info-callout.jsx";
/** One complete News view; platform adapters supply feed data and translations only. */

const { Card, CardHeader } = createCardComponents();
const LoadingState = createLoadingState();
const Button = createButton();
const InfoCallout = createInfoCallout();
export function ProductNewsView({
  t,
  news = [],
  loading = false,
  error = "",
  retrying = false,
  onRefresh,
}) {
  return (
    <Card className="cci-admin-product-news">
      <CardHeader>
        <div className="tw-flex tw-items-center tw-gap-3">
          <span
            className="tw-inline-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid tw-border-cci-nm-brandBorder tw-bg-cci-nm-brandSoft tw-text-cci-nm-brand [&_svg]:tw-h-4 [&_svg]:tw-w-4"
            aria-hidden="true"
          >
            <Bell />
          </span>
          <div className="tw-min-w-0">
            <h2 className="tw-m-0 tw-grid tw-gap-0.5 tw-leading-tight">
              <span className="tw-text-sm tw-font-normal tw-leading-tight tw-text-cci-nm-text">
                {t("News")}
              </span>
              <span className="tw-text-base tw-font-semibold tw-leading-6 tw-text-cci-nm-brand">
                Cool Cat Ideas
              </span>
            </h2>
          </div>
        </div>
      </CardHeader>

      {loading ? (
        <LoadingState label={t("Loading updates...")} variant="news" />
      ) : (
        <div className="tw-grid tw-gap-3 tw-p-4">
          <MarketplaceStatus
            t={t}
            error={error}
            retrying={retrying}
            onRefresh={onRefresh}
            label={t("Product updates could not be loaded.")}
            description={t(
              "News from Cool Cat Ideas is temporarily unavailable. Please try again.",
            )}
            showDetails={false}
          />
          {!error && !retrying && news.length ? (
            news.map((item, index) => (
              <ProductNewsItem key={item.id || item.title} item={item} separated={index > 0} t={t} />
            ))
          ) : !error && !retrying ? (
            <div className="tw-grid tw-min-h-32 tw-place-items-center tw-gap-2 tw-p-6 tw-text-center">
              <strong className="tw-text-sm tw-font-semibold tw-text-cci-nm-text">
                {t("No product updates yet.")}
              </strong>
              <p className="tw-m-0 tw-text-sm tw-text-cci-nm-muted">
                {t("Product news from Cool Cat Ideas will appear here.")}
              </p>
            </div>
          ) : null}
        </div>
      )}
    </Card>
  );
}
function ProductNewsItem({ item, separated, t }) {
  const titleId = useId();
  const content = (
    <div className="tw-grid tw-min-w-0 tw-gap-2">
      {item.kind && item.kind !== 'news' && (
        <span className="tw-text-xs tw-leading-4 tw-text-cci-nm-muted">
          {t({ release: 'Release', security: 'Security', maintenance: 'Maintenance' }[item.kind])}
        </span>
      )}
      <h3 id={titleId} data-card-link-title className="!tw-m-0 !tw-text-base !tw-font-semibold !tw-leading-6 !tw-text-cci-nm-text">
        {item.title}
      </h3>
      {item.excerpt && <p className="!tw-m-0 tw-text-sm tw-leading-6 tw-text-cci-nm-muted">{item.excerpt}</p>}
      <div className="tw-flex tw-flex-wrap tw-items-center tw-justify-between tw-gap-2">
        {item.date && <time className="tw-tabular-nums tw-text-xs tw-leading-5 tw-text-cci-nm-muted">{item.date}</time>}
        {item.url && (
          <Button variant="outlineAccent" size="default" asChild>
            <span data-card-link-action aria-hidden="true">
              {t('Read more')}
              <ArrowUpRight aria-hidden="true" />
            </span>
          </Button>
        )}
      </div>
    </div>
  );

  return (
    <article className={`tw-min-w-0 tw-break-words ${separated ? 'tw-border-0 tw-border-t tw-border-solid tw-border-cci-nm-border tw-pt-3' : ''}`}>
      {item.url ? (
        <Button variant="cardLink" asChild className="-tw-m-2 tw-p-2">
          <a href={item.url} target="_blank" rel="noopener noreferrer" aria-labelledby={titleId}>
            {content}
          </a>
        </Button>
      ) : content}
    </article>
  );
}

function MarketplaceStatus({
  t,
  error = "",
  retrying = false,
  onRefresh,
  label,
  description = "",
  retryingDescription = "",
  showDetails = true,
}) {
  if (!error && !retrying) {
    return null;
  }

  const message = retrying
    ? retryingDescription ||
      t("Trying again in the background without interrupting your work.")
    : description ||
      t(
        "The plugin will retry automatically. Installed items remain available.",
      );

  return (
    <InfoCallout
      title={label || t("Store data is temporarily unavailable.")}
      role="status"
      aria-live="polite"
      actions={onRefresh ? (
        <Button className="tw-w-full" onClick={onRefresh} disabled={retrying}>
          <RefreshCw aria-hidden="true" />
          {t("Retry now")}
        </Button>
      ) : null}
    >
        <p className="tw-m-0 tw-text-sm tw-leading-6">{message}</p>
        {showDetails && error && (
          <small className="tw-mt-1 tw-block tw-text-xs tw-leading-5">
            {error}
          </small>
        )}
    </InfoCallout>
  );
}

const NewsLocale = createContext({t: text => text, locale: 'en'});
export function ProductNewsProvider({t, locale = 'en', adminDate, children}) { return <NewsLocale.Provider value={{t, locale, adminDate}}>{children}</NewsLocale.Provider>; }
/** The only product-specific input is its public feed URL. */
export function ProductNewsPanel({endpoint}) {
 const {t, locale, adminDate} = useContext(NewsLocale);
 const feed = useProductFeed(endpoint);
 const news = normalizeProductNews(feed.data?.news || [], locale, adminDate);
 return <ProductNewsView t={t} news={news} loading={feed.loading} error={feed.error} onRefresh={feed.refresh} />;
}
