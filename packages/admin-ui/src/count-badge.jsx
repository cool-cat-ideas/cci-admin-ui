import React from "react";
import { cn } from "./cn.js";

/** Neutral counters share the pill shape used in CCI catalog and settings tabs. */
export function CountBadge({ children, className = "", ...props }) {
  return (
    <span
      className={cn(
        "tw-inline-flex tw-h-5 tw-min-w-10 tw-shrink-0 tw-items-center tw-justify-center tw-rounded-full tw-border tw-border-solid tw-border-slate-200 tw-bg-white tw-px-2 tw-text-xs tw-font-normal tw-leading-none tw-text-slate-600 tw-tabular-nums",
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
