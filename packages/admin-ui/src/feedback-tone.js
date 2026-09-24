import { AlertCircle, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

// Alerts and toasts share semantic colors across every product and host platform.
const FEEDBACK_TONES = {
  error: {
    name: 'error',
    Icon: AlertCircle,
    surface: '!tw-border-red-300 !tw-bg-red-100 !tw-text-red-900',
    progress: 'tw-bg-red-600',
  },
  info: {
    name: 'info',
    Icon: Info,
    surface: '!tw-border-blue-300 !tw-bg-blue-100 !tw-text-blue-900',
    progress: 'tw-bg-blue-600',
  },
  success: {
    name: 'success',
    Icon: CheckCircle2,
    // Reuse the status badge palette from admin-theme instead of a second green scale.
    surface: '!tw-border-cci-nm-successBorder !tw-bg-cci-nm-successBg !tw-text-cci-nm-successText',
    progress: 'tw-bg-cci-nm-successText',
  },
  warning: {
    name: 'warning',
    Icon: AlertTriangle,
    surface: '!tw-border-amber-300 !tw-bg-amber-100 !tw-text-amber-900',
    progress: 'tw-bg-amber-600',
  },
};

export function getFeedbackTone(type = 'info') {
  return FEEDBACK_TONES[type === 'danger' ? 'error' : type] || FEEDBACK_TONES.info;
}
