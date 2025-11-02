'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  className?: string;
}

export function Breadcrumb({ items, className = '' }: BreadcrumbProps) {
  if (!items || items.length === 0) return null;

  return (
    <nav
      className={`flex items-center gap-2 text-sm ${className}`}
      aria-label="Breadcrumb"
    >
      {items.map((item, index) => {
        const isLast = index === items.length - 1;

        return (
          <div key={`${item.label}-${index}`} className="flex items-center gap-2">
            {/* Breadcrumb Item */}
            {item.href && !isLast ? (
              <Link
                href={item.href}
                className="text-gray-600 hover:text-blue-600 transition-colors"
              >
                {item.label}
              </Link>
            ) : (
              <span
                className={`${
                  isLast
                    ? 'text-gray-900 font-bold'
                    : 'text-gray-600'
                }`}
              >
                {item.label}
              </span>
            )}

            {/* Separator - Only show if not last item */}
            {!isLast && (
              <ChevronRight className="w-4 h-4 text-gray-400 flex-shrink-0" />
            )}
          </div>
        );
      })}
    </nav>
  );
}
