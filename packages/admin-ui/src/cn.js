import { clsx } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

// Product styles use the Tailwind prefix; overrides must resolve by class order.
const mergeClasses = extendTailwindMerge({ prefix: 'tw-' });

export function cn(...inputs) {
  return mergeClasses(clsx(inputs));
}
