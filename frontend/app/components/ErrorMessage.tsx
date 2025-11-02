import { AlertCircle, X } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  onDismiss?: () => void;
}

export function ErrorMessage({
  message,
  onRetry,
  onDismiss
}: ErrorMessageProps) {
  return (
    <div className="flex gap-3 bg-red-50 border-l-4 border-red-500 p-4 rounded-r-md">
      {/* Icon */}
      <div className="flex-shrink-0 pt-0.5">
        <AlertCircle className="w-5 h-5 text-red-600" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-red-700 font-medium">
          {message}
        </p>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-2 flex-shrink-0">
        {onRetry && (
          <button
            onClick={onRetry}
            className="px-3 py-1.5 text-xs font-semibold text-red-600 bg-red-100 hover:bg-red-200 rounded-md transition-colors"
            title="Thử lại"
          >
            Retry
          </button>
        )}
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="p-1 text-red-500 hover:text-red-700 hover:bg-red-100 rounded-md transition-colors"
            title="Đóng"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
