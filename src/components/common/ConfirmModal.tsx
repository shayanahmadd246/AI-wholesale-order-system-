import React from 'react';
import { AlertTriangle, CheckCircle2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title: string;
  description: string;
  highlightText?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title,
  description,
  highlightText,
  confirmLabel = 'Confirm Action',
  cancelLabel = 'Cancel',
  variant = 'warning',
  isLoading = false,
  onConfirm,
  onCancel
}) => {
  if (!isOpen) return null;

  const bgColors = {
    danger: 'bg-red-600 hover:bg-red-500 text-white shadow-red-900/20',
    warning: 'bg-amber-600 hover:bg-amber-500 text-white shadow-amber-900/20',
    primary: 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-900/20'
  };

  const iconColors = {
    danger: 'text-red-500 bg-red-500/10 border-red-500/20',
    warning: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    primary: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-2xl">
        <button
          onClick={onCancel}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 rounded-lg"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-start gap-4 mb-4">
          <div className={`p-3 rounded-xl border ${iconColors[variant]} shrink-0`}>
            {variant === 'primary' ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <AlertTriangle className="w-6 h-6" />
            )}
          </div>
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">
              {title}
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              {description}
            </p>
          </div>
        </div>

        {highlightText && (
          <div className="my-4 p-3 bg-slate-100 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700/60 rounded-xl text-xs font-mono font-semibold text-slate-800 dark:text-slate-200 tracking-wide">
            {highlightText}
          </div>
        )}

        <div className="flex items-center justify-end gap-3 mt-6">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2.5 text-sm font-medium text-slate-700 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-xl transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-5 py-2.5 text-sm font-semibold rounded-xl transition-all shadow-md flex items-center gap-2 ${bgColors[variant]}`}
          >
            {isLoading && (
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
};
