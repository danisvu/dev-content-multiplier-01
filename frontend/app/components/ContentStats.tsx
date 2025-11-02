'use client';

import { useEffect, useState } from 'react';
import { BarChart3, Clock, CheckCircle, AlertCircle } from 'lucide-react';

interface ContentStatsProps {
  content: string;
  status?: 'draft' | 'in-progress' | 'completed' | 'archived';
  className?: string;
  sticky?: boolean;
}

export function ContentStats({
  content,
  status = 'draft',
  className = '',
  sticky = true,
}: ContentStatsProps) {
  const [wordCount, setWordCount] = useState(0);
  const [displayedWordCount, setDisplayedWordCount] = useState(0);
  const [readingTime, setReadingTime] = useState(0);
  const [prevWordCount, setPrevWordCount] = useState(0);

  // Calculate stats
  useEffect(() => {
    const words = content
      .trim()
      .split(/\s+/)
      .filter((word) => word.length > 0).length;

    setWordCount(words);
    setReadingTime(Math.max(1, Math.ceil(words / 200))); // Average 200 words per minute
    setPrevWordCount(displayedWordCount);
  }, [content, displayedWordCount]);

  // Animated counter for word count
  useEffect(() => {
    if (displayedWordCount === wordCount) return;

    const difference = wordCount - displayedWordCount;
    const steps = Math.min(Math.abs(difference), 10);
    const increment = Math.ceil(difference / steps);

    const timer = setInterval(() => {
      setDisplayedWordCount((prev) => {
        if (difference > 0) {
          return Math.min(prev + increment, wordCount);
        } else {
          return Math.max(prev + increment, wordCount);
        }
      });
    }, 30);

    return () => clearInterval(timer);
  }, [wordCount, displayedWordCount]);

  // Status config
  const statusConfig = {
    draft: {
      icon: AlertCircle,
      bg: 'bg-gray-100',
      text: 'text-gray-700',
      border: 'border-gray-300',
      label: 'Draft',
      badge: 'bg-gray-100 text-gray-700',
    },
    'in-progress': {
      icon: BarChart3,
      bg: 'bg-blue-100',
      text: 'text-blue-700',
      border: 'border-blue-300',
      label: 'In Progress',
      badge: 'bg-blue-100 text-blue-700',
    },
    completed: {
      icon: CheckCircle,
      bg: 'bg-green-100',
      text: 'text-green-700',
      border: 'border-green-300',
      label: 'Completed',
      badge: 'bg-green-100 text-green-700',
    },
    archived: {
      icon: BarChart3,
      bg: 'bg-purple-100',
      text: 'text-purple-700',
      border: 'border-purple-300',
      label: 'Archived',
      badge: 'bg-purple-100 text-purple-700',
    },
  };

  const config = statusConfig[status];
  const StatusIcon = config.icon;

  const stickyClasses = sticky
    ? 'sticky top-20 z-40 shadow-sm'
    : '';

  return (
    <div
      className={`flex flex-wrap items-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg ${stickyClasses} ${className}`}
    >
      {/* Word Count Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold">
        <BarChart3 className="w-3.5 h-3.5" />
        <span>{displayedWordCount.toLocaleString()} words</span>
      </div>

      {/* Reading Time Badge */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-orange-100 text-orange-700 rounded-full text-xs font-semibold">
        <Clock className="w-3.5 h-3.5" />
        <span>{readingTime} min read</span>
      </div>

      {/* Status Badge */}
      <div
        className={`flex items-center gap-2 px-3 py-1.5 ${config.badge} rounded-full text-xs font-semibold border`}
      >
        <StatusIcon className="w-3.5 h-3.5" />
        <span>{config.label}</span>
      </div>

      {/* Character Count (subtle) */}
      {content && (
        <div className="ml-auto flex items-center gap-1 px-3 py-1.5 text-gray-500 text-xs border border-gray-200 rounded-full bg-gray-50">
          <span>{content.length.toLocaleString()} chars</span>
        </div>
      )}

      {/* Status Indicator Dot */}
      {content && (
        <div
          className={`ml-2 w-2 h-2 rounded-full ${
            status === 'completed'
              ? 'bg-green-500'
              : status === 'in-progress'
              ? 'bg-blue-500 animate-pulse'
              : status === 'draft'
              ? 'bg-gray-400'
              : 'bg-purple-500'
          }`}
          title={`Status: ${config.label}`}
        />
      )}
    </div>
  );
}
