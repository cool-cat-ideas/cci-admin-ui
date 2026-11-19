import React from "react";
import { Crown, ShieldCheck, Download, CheckCircle2, Info } from "lucide-react";
import { formatAdminDateTime } from "./date-format.js";
import { cn } from "./cn.js";
import { createCardComponents } from "./card.jsx";
import { createInfoCallout } from "./info-callout.jsx";
import { createButton } from "./button.jsx";
import { StatusBadge } from "./status-badge.jsx";
import { createTooltipComponents } from "./tooltip.jsx";
const { Card, CardHeader } = createCardComponents();
const InfoCallout = createInfoCallout();
const Button = createButton();
const { TooltipProvider, TooltipHelp } = createTooltipComponents();
export function ProductStatusPanel({
  t,
  productName,
  editions,
  isPro = false,
  licenseStatus,
  licenseMessage,
  installedVersion,
  latestVersion,
  updateUrl,
  description,
  checkedAt,
  nextCheckAt,
  expires,
  adminDate,
  versionFeedStale = false,
}) {
  const isExpired = licenseStatus === "expired";
  const rows = editions ? ["free", "pro"].filter(edition => edition in editions).map(edition => {
    const versions = editions[edition];
    const installed = versions?.installedVersion;
    const latest = versions?.latestVersion;
    const comparison = compareProductVersions(latest, installed);
    return {
      edition,
      label: t(edition === "pro" ? "Pro" : "Free"),
      installed,
      latest: comparison < 0 ? installed : latest,
      hasUpdate: comparison > 0,
      updateUrl: versions?.updateUrl,
    };
  }) : [];
  const installedRows = rows.filter(row => row.installed);
  const hasVersionFeed = editions
    ? installedRows.length > 0 && installedRows.every(row => row.latest)
    : normalizeVersion(installedVersion).length > 0 && normalizeVersion(latestVersion).length > 0;
  const updates = rows.filter(row => row.hasUpdate);
  const lastCheck = formatAdminDateTime(checkedAt, adminDate);
  const nextCheck = formatAdminDateTime(nextCheckAt, adminDate);
  const expiry = formatAdminDateTime(expires, adminDate, false);
  const numericNextCheck = typeof nextCheckAt === "number" || /^\d{10,13}$/.test(String(nextCheckAt || ""));
  const nextCheckTime = numericNextCheck
    ? Number(nextCheckAt) * (Number(nextCheckAt) < 1e12 ? 1000 : 1)
    : Date.parse(nextCheckAt || "");
  const verificationOverdue = Number.isFinite(nextCheckTime) && nextCheckTime > 0 && nextCheckTime < Date.now();
  const hasUpdate = editions ? updates.length > 0 : compareProductVersions(latestVersion, installedVersion) > 0;
  return (
    <Card className="cci-admin-product-updates">
      <CardHeader className="tw-py-3">
        <div className="tw-flex tw-items-center tw-gap-3">
          <span
            className={cn(
              "tw-inline-flex tw-h-9 tw-w-9 tw-items-center tw-justify-center tw-rounded-md tw-border tw-border-solid",
              isPro || isExpired
                ? "tw-border-amber-200 tw-bg-amber-50 tw-text-amber-700 [&_svg]:tw-h-5 [&_svg]:tw-w-5"
                : "tw-border-cci-nm-brandBorder tw-bg-cci-nm-brandSoft tw-text-cci-nm-brand",
            )}
            aria-hidden="true"
          >
            {isPro || isExpired ? <Crown /> : <ShieldCheck />}
          </span>
          <div>
            <span className="tw-inline-flex tw-items-center tw-gap-1.5 tw-text-sm tw-text-cci-nm-text">
              {productName || t("Module status")}
            </span>
            <h2>{isExpired ? t("Pro license expired") : isPro ? t("Pro") : t("Free")}</h2>
          </div>
        </div>
      </CardHeader>

      <div className="tw-grid tw-gap-3 tw-p-4">
        <InfoCallout
          tone={isExpired || versionFeedStale ? "warning" : hasVersionFeed && !hasUpdate ? "success" : "info"}
          icon={
            hasUpdate ? (
              <Download aria-hidden="true" />
            ) : (
              hasVersionFeed ? <CheckCircle2 aria-hidden="true" /> : <Info aria-hidden="true" />
            )
          }
          title={
            isExpired
              ? t("Renew your Pro license")
              : versionFeedStale
              ? t("Version information needs refreshing")
              : hasUpdate
              ? t("New version available")
              : hasVersionFeed
                ? t(editions ? "Congratulations, you are using the latest version." : "You are up to date")
                : t("Version feed is unavailable")
          }
        >
          {isExpired ? licenseMessage || t("Published content remains visible. Renew your license to save Pro settings.") : versionFeedStale ? t("Showing saved version information. The product catalog could not be reached.") : hasUpdate ? description || t("Review and install the latest release when you are ready.") : !hasVersionFeed ? t("Version information is temporarily unavailable. Please try again later.") : description || (!editions && t("Your installed version is current."))}
        </InfoCallout>

        <div className="tw-grid tw-grid-cols-2 tw-gap-2">
          {editions && (
            <div className="tw-col-span-2 tw-flex tw-items-center tw-gap-1.5">
              <h3 className="!tw-m-0 !tw-border-0 !tw-p-0 !tw-text-sm !tw-font-semibold !tw-leading-5 tw-text-cci-nm-text">
                {t("Version")}
              </h3>
              <TooltipProvider>
                <TooltipHelp text={t("Version information from the product catalog.")} />
              </TooltipProvider>
            </div>
          )}
          <VersionStat
            label={t("Installed")}
            value={installedVersion || "-"}
            rows={editions ? rows.map(row => ({ ...row, value: row.installed || t("Not installed") })) : undefined}
          />
          <VersionStat
            label={t("Latest")}
            value={latestVersion || "-"}
            active={hasUpdate}
            rows={editions ? rows.map(row => ({ ...row, value: row.latest || "-" })) : undefined}
          />
        </div>
        {!editions && (
          <p className="!tw-m-0 tw-text-xs tw-leading-5 tw-text-cci-nm-muted">
            {t("Version information from the product catalog.")}
          </p>
        )}

        {(editions ? updates : hasUpdate ? [{ updateUrl }] : []).filter(update => update.updateUrl).map(update => (
          <Button key={update.edition || "update"} variant="outlineAccent" size="sm" className="tw-w-full" asChild>
            <a href={update.updateUrl} target="_blank" rel="noreferrer">
              <Download aria-hidden="true" />
              {t("View update")}{update.label && ` · ${update.label}`}
            </a>
          </Button>
        ))}

        {(!editions || isPro || isExpired) && (lastCheck || nextCheck || expiry) && <div className={cn(
          "tw-grid tw-gap-2",
          !editions && "tw-border-0 tw-border-t tw-border-solid tw-border-cci-nm-border tw-pt-3",
        )}>
          <h3 className="!tw-m-0 !tw-border-0 !tw-p-0 !tw-text-sm !tw-font-semibold !tw-leading-5 tw-text-cci-nm-text">{t("License verification")}</h3>
          {lastCheck && (
            <CompactMeta label={t("License last verified")} value={lastCheck} />
          )}
          {nextCheck && (
            <CompactMeta label={verificationOverdue ? t("License verification due") : t("Next license verification")} value={nextCheck} />
          )}
          {verificationOverdue && <p role="status" className="!tw-m-0 tw-text-xs tw-leading-5 tw-text-cci-nm-muted">{t("Automatic license verification is overdue. Check the license in License settings.")}</p>}
          {expiry && <CompactMeta label={t("License expires")} value={expiry} />}
        </div>}
      </div>
    </Card>
  );
}
function VersionStat({ label, value, rows, active = false }) {
  return (
    <div
      className={cn(
        "tw-min-w-0 tw-rounded-md tw-border tw-border-solid tw-p-3",
        active
          ? "tw-border-cci-nm-brandBorder tw-bg-cci-nm-brandSoft"
          : "tw-border-cci-nm-border tw-bg-cci-nm-surfaceSoft",
      )}
    >
      <span className={cn(
        "tw-block tw-text-xs tw-font-bold tw-leading-none tw-text-cci-nm-muted",
        rows ? "tw-normal-case" : "tw-uppercase",
      )}>
        {label}
      </span>
      {rows ? (
        <dl className="!tw-m-0 tw-grid tw-gap-1 tw-pt-2">
          {rows.map(row => (
            <div key={row.edition} className="tw-grid tw-grid-cols-[auto_minmax(0,1fr)] tw-items-center tw-gap-2">
              <dt className="!tw-m-0">
                <StatusBadge
                  tone="success"
                  className={cn(
                    "!tw-rounded-md !tw-py-0.5 !tw-normal-case",
                    row.edition === "pro" && "!tw-border-amber-200 !tw-bg-amber-50 !tw-text-amber-700",
                  )}
                >
                  {row.label}
                </StatusBadge>
              </dt>
              <dd className="!tw-m-0 tw-break-words tw-text-sm tw-font-semibold tw-tabular-nums tw-text-cci-nm-text">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      ) : (
        <strong className="tw-mt-2 tw-block tw-text-base tw-font-semibold tw-text-cci-nm-text">
          {value}
        </strong>
      )}
    </div>
  );
}

function CompactMeta({ label, value }) {
  return (
    <div className="tw-grid tw-grid-cols-[minmax(0,1fr)_auto] tw-items-center tw-gap-2 tw-rounded-md tw-border tw-border-solid tw-border-cci-nm-border tw-bg-white tw-px-3 tw-py-2">
      <span className="tw-text-xs tw-text-cci-nm-muted">{label}</span>
      <strong className="tw-min-w-0 tw-break-words tw-tabular-nums tw-text-right tw-text-xs tw-font-semibold tw-text-cci-nm-text">
        {value}
      </strong>
    </div>
  );
}

export function compareProductVersions(nextVersion, currentVersion) {
  const next = normalizeVersion(nextVersion);
  const current = normalizeVersion(currentVersion);

  if (!next.length || !current.length) {
    return 0;
  }

  const length = Math.max(next.length, current.length);

  for (let index = 0; index < length; index += 1) {
    const nextPart = next[index] || 0;
    const currentPart = current[index] || 0;

    if (nextPart > currentPart) {
      return 1;
    }

    if (nextPart < currentPart) {
      return -1;
    }
  }

  return 0;
}

function normalizeVersion(version) {
  const value = String(version || "").match(/\d+(?:\.\d+)*/)?.[0] || "";

  if (!value) {
    return [];
  }

  return value.split(".").map((part) => Number(part) || 0);
}
