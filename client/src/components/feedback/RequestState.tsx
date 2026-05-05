import type { ReactNode } from "react";

type LoadingStateProps = {
  message?: string;
};

type ErrorStateProps = {
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

type EmptyStateProps = {
  title: string;
  description: string;
  action?: ReactNode;
};

export const LoadingState = ({ message = "Loading..." }: LoadingStateProps) => (
  <div className="rounded-2xl border border-slate-200 bg-white p-6 text-sm text-slate-500 shadow-sm">
    <div className="flex items-center gap-3">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-stone-200 border-t-slate-800" />
      <span>{message}</span>
    </div>
  </div>
);

export const ErrorState = ({
  message,
  actionLabel,
  onAction,
}: ErrorStateProps) => (
  <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-sm text-red-700 shadow-sm">
    <p className="font-medium">Something went wrong.</p>
    <p className="mt-1">{message}</p>
    {actionLabel && onAction && (
      <button
        type="button"
        onClick={onAction}
        className="mt-4 rounded-xl bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
      >
        {actionLabel}
      </button>
    )}
  </div>
);

export const EmptyState = ({ title, description, action }: EmptyStateProps) => (
  <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center shadow-sm">
    <h2 className="text-lg font-semibold text-slate-900">{title}</h2>
    <p className="mt-2 text-sm text-slate-500">{description}</p>
    {action && <div className="mt-5">{action}</div>}
  </div>
);
