'use client';

import React, { useState } from 'react';
import { Download, FileText, Calendar, Code2 } from 'lucide-react';
import { toast } from 'sonner';

export interface ExportOptionsProps {
  briefId: number;
  onExportStart?: () => void;
  onExportComplete?: (format: string) => void;
  className?: string;
}

type ExportFormat = 'csv' | 'ics' | 'json';

interface ExportOption {
  format: ExportFormat;
  label: string;
  description: string;
  icon: React.ReactNode;
  color: string;
}

const EXPORT_OPTIONS: ExportOption[] = [
  {
    format: 'csv',
    label: 'CSV Export',
    description: 'Export all derivatives as spreadsheet',
    icon: <FileText className="w-5 h-5" />,
    color: 'bg-blue-50 border-blue-200',
  },
  {
    format: 'ics',
    label: 'Calendar Export',
    description: 'Export publishing schedule to calendar',
    icon: <Calendar className="w-5 h-5" />,
    color: 'bg-green-50 border-green-200',
  },
  {
    format: 'json',
    label: 'JSON Export',
    description: 'Export complete data with metadata',
    icon: <Code2 className="w-5 h-5" />,
    color: 'bg-purple-50 border-purple-200',
  },
];

export function ExportOptions({
  briefId,
  onExportStart,
  onExportComplete,
  className = '',
}: ExportOptionsProps) {
  const [isLoading, setIsLoading] = useState<ExportFormat | null>(null);
  const [options, setOptions] = useState({
    includeVersionHistory: false,
    includeMetadata: false,
    platforms: [] as string[],
  });

  const handleExport = async (format: ExportFormat) => {
    try {
      setIsLoading(format);
      onExportStart?.();

      const params = new URLSearchParams();

      if (format === 'csv' && options.platforms.length > 0) {
        params.append('platforms', options.platforms.join(','));
      }

      if (format === 'json') {
        params.append(
          'includeVersionHistory',
          String(options.includeVersionHistory)
        );
        params.append('includeMetadata', String(options.includeMetadata));
      }

      const queryString = params.toString();
      const url = `/api/exports/derivatives/${briefId}/${format}${queryString ? '?' + queryString : ''}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Export failed: ${response.statusText}`);
      }

      // Get filename from content-disposition header or use default
      const contentDisposition =
        response.headers.get('content-disposition');
      let filename = `derivatives-${briefId}-${Date.now()}.${format}`;

      if (contentDisposition) {
        const matches = contentDisposition.match(/filename="(.+?)"/);
        if (matches) {
          filename = matches[1];
        }
      }

      // Download file
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);

      toast.success(`Successfully exported as ${format.toUpperCase()}`);
      onExportComplete?.(format);
    } catch (error) {
      console.error(`Export error (${format}):`, error);
      toast.error(`Failed to export as ${format.toUpperCase()}`);
    } finally {
      setIsLoading(null);
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Options Section */}
      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border border-gray-200 dark:border-gray-700">
        <h3 className="font-semibold text-sm mb-4 text-gray-900 dark:text-gray-100">
          Export Options
        </h3>

        <div className="space-y-3">
          {/* Platforms Selection */}
          <div>
            <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
              Platforms (CSV only)
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                'twitter',
                'linkedin',
                'facebook',
                'instagram',
                'tiktok',
              ].map((platform) => (
                <label
                  key={platform}
                  className="flex items-center space-x-2 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={options.platforms.includes(platform)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setOptions({
                          ...options,
                          platforms: [...options.platforms, platform],
                        });
                      } else {
                        setOptions({
                          ...options,
                          platforms: options.platforms.filter(
                            (p) => p !== platform
                          ),
                        });
                      }
                    }}
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm capitalize text-gray-600 dark:text-gray-400">
                    {platform}
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* JSON Options */}
          <div className="pt-2 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeVersionHistory}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      includeVersionHistory: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Include Version History
                </span>
              </label>

              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={options.includeMetadata}
                  onChange={(e) =>
                    setOptions({
                      ...options,
                      includeMetadata: e.target.checked,
                    })
                  }
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  Include Cost Metadata
                </span>
              </label>
            </div>
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {EXPORT_OPTIONS.map((option) => (
          <button
            key={option.format}
            onClick={() => handleExport(option.format)}
            disabled={isLoading !== null}
            className={`p-4 rounded-lg border-2 transition-all hover:shadow-md ${option.color}
              ${isLoading === option.format ? 'opacity-75' : ''}
              ${isLoading !== null && isLoading !== option.format ? 'opacity-50' : ''}
              disabled:cursor-not-allowed`}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex items-center space-x-2">
                {option.icon}
                <span className="font-semibold text-sm">{option.label}</span>
              </div>
              {isLoading === option.format && (
                <div className="animate-spin">
                  <Download className="w-4 h-4" />
                </div>
              )}
              {isLoading !== option.format && (
                <Download className="w-4 h-4 opacity-0 group-hover:opacity-100" />
              )}
            </div>
            <p className="text-xs text-gray-600 dark:text-gray-500 text-left">
              {option.description}
            </p>
          </button>
        ))}
      </div>

      {/* Export Information */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          <span className="font-semibold">CSV:</span> Best for spreadsheet analysis
          and bulk operations. <span className="font-semibold">ICS:</span> Import
          publishing schedule into your calendar app. <span className="font-semibold">JSON:</span> Complete data export with all metadata
          for integrations.
        </p>
      </div>
    </div>
  );
}
