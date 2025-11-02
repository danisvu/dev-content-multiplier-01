'use client';

import { Trash2, Edit2 } from 'lucide-react';

interface Idea {
  id: number;
  title: string;
  description?: string;
  rationale?: string;
  persona?: string;
  industry?: string;
  status: string;
  created_at: string;
}

interface IdeaCardProps {
  idea: Idea;
  onEdit?: (idea: Idea) => void;
  onDelete?: (id: number) => void;
  formatDate?: (date: string) => string;
}

const statusConfig = {
  completed: {
    bg: 'bg-gray-100',
    text: 'text-gray-700',
    icon: '✅',
  },
  'in-progress': {
    bg: 'bg-yellow-100',
    text: 'text-yellow-700',
    icon: '🔄',
  },
  pending: {
    bg: 'bg-blue-100',
    text: 'text-blue-700',
    icon: '⏳',
  },
};

export function IdeaCard({
  idea,
  onEdit,
  onDelete,
  formatDate,
}: IdeaCardProps) {
  const status = (statusConfig as any)[idea.status] || statusConfig.pending;
  const displayDate = formatDate ? formatDate(idea.created_at) : new Date(idea.created_at).toLocaleDateString();

  return (
    <div className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300 bg-white flex flex-col h-full">
      {/* Card Header */}
      <div className="flex justify-between items-start gap-3 mb-3">
        <h3 className="text-lg font-semibold text-gray-900 truncate flex-1">
          {idea.title}
        </h3>
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${status.bg} ${status.text}`}
        >
          {status.icon}
          <span className="capitalize">{idea.status}</span>
        </span>
      </div>

      {/* Card Body */}
      <div className="flex-1 mb-4">
        {idea.description && (
          <p className="text-sm text-gray-600 line-clamp-3 mb-2">
            {idea.description}
          </p>
        )}

        {idea.rationale && (
          <p className="text-xs text-purple-600 italic line-clamp-2">
            <strong>Why:</strong> {idea.rationale}
          </p>
        )}
      </div>

      {/* Card Footer - Chips */}
      <div className="flex flex-wrap gap-2 mb-4">
        {idea.persona && (
          <span className="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs font-medium px-2.5 py-1 rounded-full">
            👤 <span className="truncate">{idea.persona}</span>
          </span>
        )}
        {idea.industry && (
          <span className="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs font-medium px-2.5 py-1 rounded-full">
            🏢 <span className="truncate">{idea.industry}</span>
          </span>
        )}
      </div>

      {/* Card Footer - Meta & Actions */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
        <span className="text-xs text-gray-500">
          {displayDate}
        </span>

        <div className="flex gap-2">
          {onEdit && (
            <button
              onClick={() => onEdit(idea)}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
              title="Edit idea"
              aria-label="Edit idea"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
          {onDelete && (
            <button
              onClick={() => onDelete(idea.id)}
              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Delete idea"
              aria-label="Delete idea"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
