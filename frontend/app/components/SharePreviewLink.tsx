'use client';

import React, { useState, useEffect } from 'react';
import {
  Share2,
  Copy,
  Lock,
  Clock,
  Eye,
  MessageSquare,
  Download,
  Trash2,
  Check,
  X,
  Plus,
} from 'lucide-react';
import { toast } from 'sonner';

export interface SharePreviewLinkProps {
  briefId: number;
  onShareCreated?: (shareLink: any) => void;
  className?: string;
}

interface ShareLink {
  id: number;
  token: string;
  brief_id: number;
  preview_type: 'full' | 'derivatives_only' | 'version_history';
  expires_at?: string;
  require_password: boolean;
  view_count: number;
  max_views?: number;
  allow_comments: boolean;
  allow_downloads: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  shareUrl?: string;
}

export function SharePreviewLink({
  briefId,
  onShareCreated,
  className = '',
}: SharePreviewLinkProps) {
  const [shareLinks, setShareLinks] = useState<ShareLink[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [copiedToken, setCopiedToken] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    previewType: 'full' as 'full' | 'derivatives_only' | 'version_history',
    password: '',
    expiresIn: 7 * 24 * 60, // 7 days in minutes
    maxViews: undefined as number | undefined,
    allowComments: false,
    allowDownloads: true,
  });

  // Load existing share links
  useEffect(() => {
    loadShareLinks();
  }, [briefId]);

  const loadShareLinks = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/sharing/brief/${briefId}`);

      if (!response.ok) throw new Error('Failed to load share links');

      const data = await response.json();
      setShareLinks(data.shareLinks || []);
    } catch (error) {
      console.error('Failed to load share links:', error);
      toast.error('Failed to load share links');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateShareLink = async () => {
    try {
      setIsLoading(true);

      const response = await fetch('/api/sharing/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          briefId,
          previewType: formData.previewType,
          password: formData.password || undefined,
          expiresIn: formData.expiresIn,
          maxViews: formData.maxViews,
          allowComments: formData.allowComments,
          allowDownloads: formData.allowDownloads,
        }),
      });

      if (!response.ok) throw new Error('Failed to create share link');

      const data = await response.json();

      // Add to list
      setShareLinks([data.shareLink, ...shareLinks]);

      // Reset form
      setFormData({
        previewType: 'full',
        password: '',
        expiresIn: 7 * 24 * 60,
        maxViews: undefined,
        allowComments: false,
        allowDownloads: true,
      });

      setShowCreateForm(false);
      toast.success('Share link created successfully');
      onShareCreated?.(data.shareLink);
    } catch (error) {
      console.error('Failed to create share link:', error);
      toast.error('Failed to create share link');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyLink = (token: string) => {
    const shareUrl = `${window.location.origin}/shared/${token}`;
    navigator.clipboard.writeText(shareUrl);
    setCopiedToken(token);
    toast.success('Link copied to clipboard');

    setTimeout(() => setCopiedToken(null), 2000);
  };

  const handleRevokeLink = async (linkId: number) => {
    try {
      const response = await fetch(`/api/sharing/${linkId}/revoke`, {
        method: 'POST',
      });

      if (!response.ok) throw new Error('Failed to revoke link');

      setShareLinks(shareLinks.filter((link) => link.id !== linkId));
      toast.success('Share link revoked');
    } catch (error) {
      console.error('Failed to revoke link:', error);
      toast.error('Failed to revoke share link');
    }
  };

  const handleDeleteLink = async (linkId: number) => {
    if (!confirm('Are you sure you want to delete this share link?')) return;

    try {
      const response = await fetch(`/api/sharing/${linkId}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete link');

      setShareLinks(shareLinks.filter((link) => link.id !== linkId));
      toast.success('Share link deleted');
    } catch (error) {
      console.error('Failed to delete link:', error);
      toast.error('Failed to delete share link');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const isLinkExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Share2 className="w-5 h-5 text-blue-600" />
          <h3 className="text-lg font-semibold">Share Preview Links</h3>
        </div>
        {!showCreateForm && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="text-sm">New Link</span>
          </button>
        )}
      </div>

      {/* Create Form */}
      {showCreateForm && (
        <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 border-2 border-blue-200 dark:border-blue-800 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Preview Type */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Preview Type
              </label>
              <select
                value={formData.previewType}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    previewType: e.target.value as any,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                <option value="full">Full Preview</option>
                <option value="derivatives_only">Derivatives Only</option>
                <option value="version_history">Version History</option>
              </select>
            </div>

            {/* Expiration */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Expires In (days)
              </label>
              <select
                value={Math.floor(formData.expiresIn / (24 * 60))}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    expiresIn: parseInt(e.target.value) * 24 * 60,
                  })
                }
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              >
                <option value="1">1 day</option>
                <option value="7">7 days</option>
                <option value="30">30 days</option>
                <option value="90">90 days</option>
              </select>
            </div>

            {/* Max Views */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Max Views (optional)
              </label>
              <input
                type="number"
                value={formData.maxViews || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxViews: e.target.value ? parseInt(e.target.value) : undefined,
                  })
                }
                placeholder="Unlimited"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>

            {/* Password Protection */}
            <div>
              <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                Password (optional)
              </label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    password: e.target.value,
                  })
                }
                placeholder="Leave blank for public"
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600"
              />
            </div>
          </div>

          {/* Options */}
          <div className="space-y-2 pt-2 border-t border-gray-200 dark:border-gray-700">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowComments}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allowComments: e.target.checked,
                  })
                }
                className="rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Allow comments
              </span>
            </label>

            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={formData.allowDownloads}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    allowDownloads: e.target.checked,
                  })
                }
                className="rounded"
              />
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Allow downloads
              </span>
            </label>
          </div>

          {/* Actions */}
          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCreateShareLink}
              disabled={isLoading}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              Create Link
            </button>
            <button
              onClick={() => setShowCreateForm(false)}
              className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-900 dark:text-white px-4 py-2 rounded-lg hover:bg-gray-400 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Share Links List */}
      <div className="space-y-3">
        {shareLinks.length === 0 ? (
          <div className="text-center py-8 text-gray-500 dark:text-gray-400">
            <Share2 className="w-12 h-12 mx-auto mb-3 opacity-20" />
            <p>No share links yet. Create one to share with your team.</p>
          </div>
        ) : (
          shareLinks.map((link) => {
            const expired = isLinkExpired(link.expires_at);
            const shareUrl = `${window.location.origin}/shared/${link.token}`;

            return (
              <div
                key={link.id}
                className={`p-4 rounded-lg border-2 ${
                  expired
                    ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700'
                }`}
              >
                {/* Status Badge */}
                {expired && (
                  <div className="mb-2">
                    <span className="inline-block px-2 py-1 bg-red-200 dark:bg-red-900 text-red-800 dark:text-red-200 text-xs rounded font-semibold">
                      Expired
                    </span>
                  </div>
                )}

                {/* Link Info */}
                <div className="space-y-2 mb-3">
                  {/* Type and Created */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-xs bg-gray-200 dark:bg-gray-700 px-2 py-1 rounded">
                        {link.preview_type.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        Created {formatDate(link.created_at)}
                      </span>
                    </div>
                  </div>

                  {/* URL */}
                  <div className="bg-gray-100 dark:bg-gray-700 rounded px-3 py-2 font-mono text-xs text-gray-700 dark:text-gray-300 break-all">
                    {shareUrl}
                  </div>

                  {/* Features Row */}
                  <div className="flex items-center gap-2 text-xs text-gray-600 dark:text-gray-400">
                    {link.require_password && (
                      <div className="flex items-center gap-1">
                        <Lock className="w-3 h-3" />
                        <span>Protected</span>
                      </div>
                    )}
                    {link.expires_at && (
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>Expires {formatDate(link.expires_at)}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Eye className="w-3 h-3" />
                      <span>
                        {link.view_count}{' '}
                        {link.max_views ? `/ ${link.max_views}` : ''} views
                      </span>
                    </div>
                    {link.allow_comments && (
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        <span>Comments</span>
                      </div>
                    )}
                    {link.allow_downloads && (
                      <div className="flex items-center gap-1">
                        <Download className="w-3 h-3" />
                        <span>Downloads</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => handleCopyLink(link.token)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 rounded hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors text-sm"
                  >
                    {copiedToken === link.token ? (
                      <>
                        <Check className="w-4 h-4" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-4 h-4" />
                        <span>Copy</span>
                      </>
                    )}
                  </button>

                  {!expired && (
                    <button
                      onClick={() => handleRevokeLink(link.id)}
                      className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-yellow-50 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400 rounded hover:bg-yellow-100 dark:hover:bg-yellow-900/40 transition-colors text-sm"
                    >
                      <X className="w-4 h-4" />
                      <span>Revoke</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleDeleteLink(link.id)}
                    className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded hover:bg-red-100 dark:hover:bg-red-900/40 transition-colors text-sm"
                  >
                    <Trash2 className="w-4 h-4" />
                    <span>Delete</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Info Box */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
        <p className="text-xs text-blue-800 dark:text-blue-200">
          Share preview links allow team members to review derivatives and briefs
          without requiring an account. Links can be password protected and have
          optional view limits.
        </p>
      </div>
    </div>
  );
}
