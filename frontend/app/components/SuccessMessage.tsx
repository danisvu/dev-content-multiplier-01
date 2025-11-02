'use client';

import { useEffect, useState } from 'react';
import { CheckCircle, X } from 'lucide-react';

interface SuccessMessageProps {
  message: string;
  onDismiss?: () => void;
  autoDismissDelay?: number; // in milliseconds, default 5000
}

export function SuccessMessage({
  message,
  onDismiss,
  autoDismissDelay = 5000
}: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isFading, setIsFading] = useState(false);

  useEffect(() => {
    if (!autoDismissDelay || autoDismissDelay <= 0) return;

    const timer = setTimeout(() => {
      setIsFading(true);
      // Wait for fade animation to complete before calling onDismiss
      const fadeTimer = setTimeout(() => {
        setIsVisible(false);
        onDismiss?.();
      }, 300); // Match animation duration

      return () => clearTimeout(fadeTimer);
    }, autoDismissDelay);

    return () => clearTimeout(timer);
  }, [autoDismissDelay, onDismiss]);

  if (!isVisible) return null;

  return (
    <div
      className={`flex gap-3 bg-green-50 border-l-4 border-green-500 p-4 rounded-r-md transition-opacity duration-300 ${
        isFading ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Icon */}
      <div className="flex-shrink-0 pt-0.5">
        <CheckCircle className="w-5 h-5 text-green-600" />
      </div>

      {/* Content */}
      <div className="flex-1">
        <p className="text-sm text-green-700 font-medium">
          {message}
        </p>
      </div>

      {/* Dismiss Button */}
      <button
        onClick={() => {
          setIsVisible(false);
          onDismiss?.();
        }}
        className="p-1 text-green-500 hover:text-green-700 hover:bg-green-100 rounded-md transition-colors flex-shrink-0"
        title="Đóng"
      >
        <X className="w-4 h-4" />
      </button>

      {/* Progress Bar - shows remaining time before auto-dismiss */}
      {autoDismissDelay && autoDismissDelay > 0 && (
        <div className="absolute bottom-0 left-0 right-0 h-1 bg-green-200 rounded-b-md overflow-hidden">
          <div
            className="h-full bg-green-500 rounded-b-md transition-all duration-100"
            style={{
              animation: isFading
                ? 'none'
                : `shrink ${autoDismissDelay}ms linear forwards`
            }}
          />
          <style jsx>{`
            @keyframes shrink {
              from {
                width: 100%;
              }
              to {
                width: 0%;
              }
            }
          `}</style>
        </div>
      )}
    </div>
  );
}
