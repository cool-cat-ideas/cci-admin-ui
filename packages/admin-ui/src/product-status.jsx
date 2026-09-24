import React from "react";
import { Crown, ShieldCheck, Download, CheckCircle2, Info } from "lucide-react";
import { formatAdminDateTime } from "./date-format.js";
import { cn } from "./cn.js";
import { createCardComponents } from "./card.jsx";
import { createInfoCallout } from "./info-callout.jsx";
import { createButton } from "./button.jsx";
const { Card, CardHeader } = createCardComponents();
const InfoCallout = createInfoCallout();
const Button = createButton();
export function ProductStatusPanel({
  t,
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
}) {
  const isExpired = licenseStatus === "expired";
  const hasVersionFeed = normalizeVersion(installedVersion).length > 0 && normalizeVersion(latestVersion).length > 0;
  const lastCheck = formatAdminDateTime(checkedAt, adminDate);
  const nextCheck = formatAdminDateTime(nextCheckAt, adminDate);
  const expiry = formatAdminDateTime(expires, adminDate, false);
  const hasUpdate = compareProductVersions(latestVersion, installedVersion) > 0;
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
              {t("Module status")}
            </span>
            <h2>{isExpired ? t("Pro license expired") : isPro ? t("Pro") : t("Free")}</h2>
          </div>
        </div>
      </CardHeader>

      <div className="tw-grid tw-gap-3 tw-p-4">
        <InfoCallout
          tone={isExpired ? "warning" : hasVersionFeed && !hasUpdate ? "success" : "info"}
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
              : hasUpdate
              ? t("New version available")
              : hasVersionFeed
                ? t("You are up to date")
                : t("Version feed is unavailable")
          }
        >
          {isExpired ? licenseMessage || t("Published content remains visible. Renew your license to save Pro settings.") : description || (hasUpdate ? t("Review and install the latest release when you are ready.") : !hasVersionFeed ? t("Version information is temporarily unavailable. Please try again later.") : isPro ? t("Pro access is active and premium features can be used on this site.") : t("Your installed version is current."))}
        </InfoCallout>

        <div className="tw-grid tw-grid-cols-2 tw-gap-2">
          <VersionStat label={t("Installed")} value={installedVersion || "-"} />
          <VersionStat
            label={t("Latest")}
            value={latestVersion || "-"}
            active={hasUpdate}
          />
        </div>

        {hasUpdate && updateUrl && (
          <Button
            variant="outlineAccent"
            size="sm"
            className="tw-w-full"
            asChild
          >
            <a href={updateUrl} target="_blank" rel="noreferrer">
              <Download aria-hidden="true" />
              {t("View update")}
            </a>
          </Button>
        )}

        <div className="tw-grid tw-gap-2">
          {lastCheck && (
            <CompactMeta label={t("Last check")} value={lastCheck} />
          )}
          {nextCheck && (
            <CompactMeta label={t("Next check")} value={nextCheck} />
          )}
          {expiry && <CompactMeta label={t("Expires")} value={expiry} />}
        </div>
      </div>
    </Card>
  );
}
function VersionStat({ label, value, active = false }) {
  return (
    <div
      className={cn(
        "tw-rounded-md tw-border tw-border-solid tw-p-3",
        active
          ? "tw-border-cci-nm-brandBorder tw-bg-cci-nm-brandSoft"
          : "tw-border-cci-nm-border tw-bg-cci-nm-surfaceSoft",
      )}
    >
      <span className="tw-block tw-text-xs tw-font-bold tw-uppercase tw-leading-none tw-text-cci-nm-muted">
        {label}
      </span>
      <strong className="tw-mt-2 tw-block tw-text-base tw-font-semibold tw-text-cci-nm-text">
        {value}
      </strong>
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
