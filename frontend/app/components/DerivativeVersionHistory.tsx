'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, Button, Badge } from './ui';
import { toast } from 'sonner';
import {
  Clock,
  RotateCcw,
  Trash2,
  Eye,
  GitBranch,
  Check,
  AlertCircle,
  Loader2
} from 'lucide-react';

export interface DerivativeVersion {
  id: number;
  derivative_id: number;
  version_number: number;
  content: string;
  character_count: number;
  change_summary?: string;
  change_type: 'created' | 'edited' | 'ai_regenerated' | 'rollback';
  changed_by?: string;
  change_reason?: string;
  is_current: boolean;
  created_at: string;
}

interface DerivativeVersionHistoryProps {
  derivativeId: number;
  platform?: string;
  onRollback?: (version: DerivativeVersion) => void;
}

const CHANGE_TYPE_COLORS: Record<string, string> = {
  created: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  edited: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  ai_regenerated: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
  rollback: 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200'
};

const CHANGE_TYPE_ICONS: Record<string, React.ReactNode> = {
  created: '✨',
  edited: '✏️',
  ai_regenerated: '🤖',
  rollback: '↩️'
};

export const DerivativeVersionHistory: React.FC<DerivativeVersionHistoryProps> = ({
  derivativeId,
  platform,
  onRollback
}) => {
  const [versions, setVersions] = useState<DerivativeVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [expandedVersionId, setExpandedVersionId] = useState<number | null>(null);
  const [selectedVersions, setSelectedVersions] = useState<Set<number>>(new Set());
  const [isRollingBack, setIsRollingBack] = useState(false);
  const [compareMode, setCompareMode] = useState(false);

  // Load versions on mount
  useEffect(() => {
    loadVersions();
  }, [derivativeId]);

  const loadVersions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/versions/${derivativeId}`);
      if (!response.ok) throw new Error('Failed to fetch versions');
      const data = await response.json();
      setVersions(data);
    } catch (error) {
      console.error('Error loading versions:', error);
      toast.error('Failed to load version history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRollback = async (version: DerivativeVersion) => {
    if (!version) return;

    setIsRollingBack(true);
    try {
      const response = await fetch('/api/versions/rollback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetVersionId: version.id,
          userId: 'current-user'
        })
      });

      if (!response.ok) throw new Error('Failed to rollback');
      const result = await response.json();

      // Update versions list
      await loadVersions();

      toast.success(`Rolled back to version ${version.version_number}`);
      onRollback?.(result.version);
    } catch (error) {
      console.error('Error rolling back:', error);
      toast.error('Failed to rollback to this version');
    } finally {
      setIsRollingBack(false);
    }
  };

  const handleDeleteVersion = async (versionId: number, versionNumber: number) => {
    try {
      const response = await fetch(`/api/version/${versionId}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to delete version');

      setVersions(prev => prev.filter(v => v.id !== versionId));
      toast.success(`Deleted version ${versionNumber}`);
    } catch (error) {
      console.error('Error deleting version:', error);
      toast.error('Failed to delete version');
    }
  };

  if (isLoading) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Version History
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

  const currentVersion = versions.find(v => v.is_current);

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <GitBranch className="w-5 h-5" />
              Version History
            </CardTitle>
            <CardDescription>
              {versions.length} versions available
              {currentVersion && ` • Current: v${currentVersion.version_number}`}
            </CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={loadVersions}
              variant="outline"
              size="sm"
            >
              Refresh
            </Button>
            {compareMode && (
              <Button
                onClick={() => {
                  setCompareMode(false);
                  setSelectedVersions(new Set());
                }}
                variant="outline"
                size="sm"
              >
                Exit Compare
              </Button>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {versions.length === 0 ? (
          <div className="rounded-lg border border-dashed p-8 text-center">
            <AlertCircle className="mx-auto h-12 w-12 text-muted-foreground mb-2" />
            <p className="text-muted-foreground">No versions found</p>
          </div>
        ) : (
          <>
            {/* Timeline */}
            <div className="space-y-3">
              <AnimatePresence>
                {versions.map((version, index) => (
                  <motion.div
                    key={version.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ delay: index * 0.05 }}
                  >
                    <div
                      className={`rounded-lg border p-4 transition-all ${
                        version.is_current
                          ? 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-950'
                          : 'bg-card'
                      } ${
                        selectedVersions.has(version.id)
                          ? 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-950'
                          : ''
                      }`}
                    >
                      <div className="flex items-start gap-4">
                        {/* Version Number & Type */}
                        <div className="flex-shrink-0">
                          <div className="flex flex-col items-center gap-1">
                            <div className="text-sm font-bold text-muted-foreground">
                              v{version.version_number}
                            </div>
                            <span className="text-lg">
                              {CHANGE_TYPE_ICONS[version.change_type] || '📝'}
                            </span>
                          </div>
                        </div>

                        {/* Content Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2 flex-wrap">
                            <Badge
                              className={CHANGE_TYPE_COLORS[version.change_type] || ''}
                            >
                              {version.change_type.replace('_', ' ')}
                            </Badge>
                            {version.is_current && (
                              <Badge className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200 flex items-center gap-1">
                                <Check className="w-3 h-3" />
                                Current
                              </Badge>
                            )}
                            <Badge variant="outline" className="text-xs">
                              {version.character_count} chars
                            </Badge>
                          </div>

                          {version.change_summary && (
                            <p className="text-sm font-medium mb-1">
                              {version.change_summary}
                            </p>
                          )}

                          <p className="text-xs text-muted-foreground">
                            {new Date(version.created_at).toLocaleString()}
                            {version.changed_by && ` • by ${version.changed_by}`}
                          </p>

                          {/* Content Preview */}
                          <div
                            className={`mt-2 text-sm cursor-pointer transition-colors ${
                              expandedVersionId === version.id ? '' : 'line-clamp-2'
                            }`}
                            onClick={() =>
                              setExpandedVersionId(
                                expandedVersionId === version.id ? null : version.id
                              )
                            }
                          >
                            {version.content}
                          </div>

                          {version.change_reason && (
                            <p className="text-xs text-muted-foreground mt-2 italic">
                              Reason: {version.change_reason}
                            </p>
                          )}
                        </div>

                        {/* Actions */}
                        <div className="flex flex-col gap-2 flex-shrink-0">
                          {!version.is_current && (
                            <>
                              <Button
                                onClick={() => handleRollback(version)}
                                disabled={isRollingBack}
                                size="sm"
                                variant="outline"
                                className="text-xs"
                                title="Restore this version"
                              >
                                {isRollingBack ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <RotateCcw className="w-3 h-3" />
                                )}
                              </Button>
                              <Button
                                onClick={() => handleDeleteVersion(version.id, version.version_number)}
                                size="sm"
                                variant="ghost"
                                className="text-destructive hover:text-destructive text-xs"
                                title="Delete this version"
                              >
                                <Trash2 className="w-3 h-3" />
                              </Button>
                            </>
                          )}
                          <Button
                            onClick={() =>
                              setExpandedVersionId(
                                expandedVersionId === version.id ? null : version.id
                              )
                            }
                            size="sm"
                            variant="ghost"
                            className="text-xs"
                            title="Preview"
                          >
                            <Eye className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Stats */}
            <div className="mt-4 rounded-lg border p-4 bg-muted/50 space-y-2">
              <p className="text-sm font-medium">Version Statistics</p>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div>
                  <span className="text-muted-foreground">Total versions:</span>
                  <span className="ml-2 font-bold">{versions.length}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Current:</span>
                  <span className="ml-2 font-bold">v{currentVersion?.version_number || 'N/A'}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default DerivativeVersionHistory;
