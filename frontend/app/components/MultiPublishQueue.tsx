'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from './ui';
import { toast } from 'sonner';
import { CheckCircle2, AlertCircle, Loader2, Share2, Trash2, Eye } from 'lucide-react';

export interface DerivativeItem {
  id: number;
  brief_id: number;
  platform: string;
  content: string;
  character_count: number;
  status: 'draft' | 'scheduled' | 'published';
  published_at?: string;
  created_at: string;
  updated_at: string;
}

interface MultiPublishQueueProps {
  briefId: number;
  onPublishComplete?: (publishedCount: number) => void;
  autoLoadDerivatives?: boolean;
}

const PLATFORM_COLORS: Record<string, string> = {
  twitter: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  linkedin: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
  facebook: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
  instagram: 'bg-pink-100 text-pink-800 dark:bg-pink-900 dark:text-pink-200',
  tiktok: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200'
};

const PLATFORM_LIMITS: Record<string, number> = {
  twitter: 280,
  linkedin: 3000,
  facebook: 63206,
  instagram: 2200,
  tiktok: 2200
};

export const MultiPublishQueue: React.FC<MultiPublishQueueProps> = ({
  briefId,
  onPublishComplete,
  autoLoadDerivatives = true
}) => {
  const [derivatives, setDerivatives] = useState<DerivativeItem[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  // Load derivatives on mount
  useEffect(() => {
    if (autoLoadDerivatives && briefId) {
      loadDerivatives();
    }
  }, [briefId, autoLoadDerivatives]);

  const loadDerivatives = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/derivatives/brief/${briefId}`);
      if (!response.ok) throw new Error('Failed to fetch derivatives');
      const data = await response.json();
      setDerivatives(data);
    } catch (error) {
      console.error('Error loading derivatives:', error);
      toast.error('Failed to load derivatives');
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSelection = (id: number) => {
    const newSelected = new Set(selectedIds);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedIds(newSelected);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === derivatives.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(derivatives.map(d => d.id)));
    }
  };

  const handlePublish = async () => {
    if (selectedIds.size === 0) {
      toast.error('Please select at least one derivative to publish');
      return;
    }

    setIsPublishing(true);
    try {
      const response = await fetch('/api/publishing/derivatives', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          derivativeIds: Array.from(selectedIds),
          userId: 'current-user'
        })
      });

      if (!response.ok) throw new Error('Failed to publish derivatives');
      const result = await response.json();

      // Update local state
      setDerivatives(prevDerivatives =>
        prevDerivatives.map(d => ({
          ...d,
          status: result.published.some((p: DerivativeItem) => p.id === d.id)
            ? 'published'
            : d.status,
          published_at: result.published.find((p: DerivativeItem) => p.id === d.id)?.published_at
        }))
      );

      setSelectedIds(new Set());

      if (result.failed.length === 0) {
        toast.success(`Successfully published ${result.summary.successCount} derivatives`);
      } else {
        toast.warning(
          `Published ${result.summary.successCount}/${result.summary.total} derivatives. ${result.summary.failureCount} failed.`
        );
      }

      onPublishComplete?.(result.summary.successCount);
    } catch (error) {
      console.error('Error publishing derivatives:', error);
      toast.error('Failed to publish derivatives');
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      const response = await fetch(`/api/derivatives/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete derivative');

      setDerivatives(prev => prev.filter(d => d.id !== id));
      setSelectedIds(prev => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });

      toast.success('Derivative deleted');
    } catch (error) {
      console.error('Error deleting derivative:', error);
      toast.error('Failed to delete derivative');
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Publishing Queue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const draftDerivatives = derivatives.filter(d => d.status === 'draft');
  const publishedDerivatives = derivatives.filter(d => d.status === 'published');

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Share2 className="w-5 h-5" />
              Publishing Queue
            </CardTitle>
            <CardDescription>
              Select derivatives to publish and log to database
            </CardDescription>
          </div>
          <Button
            onClick={loadDerivatives}
            variant="outline"
            size="sm"
          >
            Refresh
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="rounded-lg border p-4">
            <p className="text-sm font-medium text-muted-foreground">Total</p>
            <p className="text-2xl font-bold">{derivatives.length}</p>
          </div>
          <div className="rounded-lg border p-4 border-yellow-200 dark:border-yellow-800">
            <p className="text-sm font-medium text-yellow-700 dark:text-yellow-300">Draft</p>
            <p className="text-2xl font-bold text-yellow-700 dark:text-yellow-200">{draftDerivatives.length}</p>
          </div>
          <div className="rounded-lg border p-4 border-green-200 dark:border-green-800">
            <p className="text-sm font-medium text-green-700 dark:text-green-300">Published</p>
            <p className="text-2xl font-bold text-green-700 dark:text-green-200">{publishedDerivatives.length}</p>
          </div>
        </div>

        {/* Content */}
        {derivatives.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No derivatives found</p>
            <Button variant="outline" size="sm" onClick={loadDerivatives} className="mt-2">
              Try again
            </Button>
          </div>
        ) : (
          <>
            {/* Toolbar */}
            {draftDerivatives.length > 0 && (
              <div className="flex items-center justify-between rounded-lg border p-4 bg-muted/50">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.size > 0 && selectedIds.size === draftDerivatives.length}
                    onChange={toggleSelectAll}
                    className="w-4 h-4 rounded"
                  />
                  <span className="text-sm font-medium">
                    Select All ({selectedIds.size}/{draftDerivatives.length})
                  </span>
                </label>

                <Button
                  onClick={handlePublish}
                  disabled={selectedIds.size === 0 || isPublishing}
                  className="gap-2"
                >
                  {isPublishing && <Loader2 className="w-4 h-4 animate-spin" />}
                  Publish {selectedIds.size > 0 && `(${selectedIds.size})`}
                </Button>
              </div>
            )}

            {/* Derivatives List */}
            <div className="space-y-3">
              <AnimatePresence>
                {derivatives.map((derivative, index) => (
                  <motion.div
                    key={derivative.id}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={`rounded-lg border p-4 transition-colors ${
                        selectedIds.has(derivative.id)
                          ? 'bg-blue-50 border-blue-300 dark:bg-blue-950 dark:border-blue-700'
                          : 'bg-card'
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Checkbox */}
                        {derivative.status === 'draft' && (
                          <input
                            type="checkbox"
                            checked={selectedIds.has(derivative.id)}
                            onChange={() => toggleSelection(derivative.id)}
                            className="w-4 h-4 rounded mt-1"
                          />
                        )}
                        {derivative.status === 'published' && (
                          <CheckCircle2 className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                        )}

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={PLATFORM_COLORS[derivative.platform] || ''}>
                              {derivative.platform.charAt(0).toUpperCase() + derivative.platform.slice(1)}
                            </Badge>
                            <Badge variant="outline" className="text-xs">
                              {derivative.character_count}/{PLATFORM_LIMITS[derivative.platform]} chars
                            </Badge>
                            {derivative.status === 'published' && (
                              <Badge variant="outline" className="text-xs bg-green-50 text-green-700 dark:bg-green-950 dark:text-green-300">
                                Published
                              </Badge>
                            )}
                          </div>

                          {/* Content Preview */}
                          <div
                            className={`text-sm cursor-pointer transition-colors ${
                              expandedId === derivative.id ? '' : 'line-clamp-2'
                            }`}
                            onClick={() => setExpandedId(expandedId === derivative.id ? null : derivative.id)}
                          >
                            {derivative.content}
                          </div>

                          {derivative.published_at && (
                            <p className="text-xs text-muted-foreground mt-2">
                              Published: {new Date(derivative.published_at).toLocaleDateString()}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setExpandedId(expandedId === derivative.id ? null : derivative.id)}
                            title="Preview"
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDelete(derivative.id)}
                            className="text-destructive hover:text-destructive"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default MultiPublishQueue;
