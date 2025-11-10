import crypto from 'crypto';

export interface SharedPreview {
  id: number;
  brief_id: number;
  token: string;
  preview_type: 'full' | 'derivatives_only' | 'version_history';
  expires_at?: string;
  password_hash?: string;
  require_password: boolean;
  view_count: number;
  max_views?: number;
  allow_comments: boolean;
  allow_downloads: boolean;
  created_by?: string;
  created_at: string;
  updated_at: string;
  last_accessed_at?: string;
}

export interface PreviewAccessLog {
  id: number;
  shared_preview_id: number;
  accessed_at: string;
  ip_address?: string;
  user_agent?: string;
  country?: string;
  city?: string;
}

export class SharingService {
  constructor(private db: any) {}

  /**
   * Generate a secure shareable token
   */
  private generateToken(): string {
    return crypto.randomBytes(32).toString('hex');
  }

  /**
   * Hash password for storage
   */
  private hashPassword(password: string): string {
    return crypto.createHash('sha256').update(password).digest('hex');
  }

  /**
   * Verify password
   */
  private verifyPassword(password: string, hash: string): boolean {
    return this.hashPassword(password) === hash;
  }

  /**
   * Create a new shareable preview link
   */
  async createShareLink(input: {
    briefId: number;
    previewType?: 'full' | 'derivatives_only' | 'version_history';
    password?: string;
    expiresIn?: number; // minutes
    maxViews?: number;
    allowComments?: boolean;
    allowDownloads?: boolean;
    createdBy?: string;
  }): Promise<SharedPreview> {
    try {
      const token = this.generateToken();
      const previewType = input.previewType || 'full';
      const requirePassword = !!input.password;
      const passwordHash = input.password
        ? this.hashPassword(input.password)
        : null;

      let expiresAt = null;
      if (input.expiresIn) {
        expiresAt = new Date(
          Date.now() + input.expiresIn * 60 * 1000
        ).toISOString();
      }

      const result = await this.db.query(
        `INSERT INTO shared_previews
        (brief_id, token, preview_type, expires_at, password_hash, require_password, max_views, allow_comments, allow_downloads, created_by)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *`,
        [
          input.briefId,
          token,
          previewType,
          expiresAt,
          passwordHash,
          requirePassword,
          input.maxViews || null,
          input.allowComments ?? false,
          input.allowDownloads ?? false,
          input.createdBy || null,
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Failed to create share link:', error);
      throw error;
    }
  }

  /**
   * Get a share link by token and verify access
   */
  async getShareLink(token: string, password?: string): Promise<SharedPreview> {
    try {
      const result = await this.db.query(
        `SELECT * FROM shared_previews WHERE token = $1`,
        [token]
      );

      if (result.rows.length === 0) {
        throw new Error('Share link not found');
      }

      const preview = result.rows[0] as SharedPreview;

      // Check if expired
      if (
        preview.expires_at &&
        new Date(preview.expires_at) < new Date()
      ) {
        throw new Error('Share link has expired');
      }

      // Check view limit
      if (preview.max_views && preview.view_count >= preview.max_views) {
        throw new Error('Share link view limit exceeded');
      }

      // Check password if required
      if (preview.require_password) {
        if (!password) {
          throw new Error('Password required for this share link');
        }
        if (!this.verifyPassword(password, preview.password_hash || '')) {
          throw new Error('Invalid password');
        }
      }

      // Increment view count
      await this.db.query(
        `UPDATE shared_previews SET view_count = view_count + 1, last_accessed_at = NOW() WHERE id = $1`,
        [preview.id]
      );

      return preview;
    } catch (error) {
      console.error('Failed to get share link:', error);
      throw error;
    }
  }

  /**
   * Log preview access for analytics
   */
  async logPreviewAccess(input: {
    sharedPreviewId: number;
    ipAddress?: string;
    userAgent?: string;
    country?: string;
    city?: string;
  }): Promise<PreviewAccessLog> {
    try {
      const result = await this.db.query(
        `INSERT INTO preview_access_logs
        (shared_preview_id, ip_address, user_agent, country, city)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
          input.sharedPreviewId,
          input.ipAddress || null,
          input.userAgent || null,
          input.country || null,
          input.city || null,
        ]
      );

      return result.rows[0];
    } catch (error) {
      console.error('Failed to log preview access:', error);
      throw error;
    }
  }

  /**
   * Get all share links for a brief
   */
  async getBriefShareLinks(briefId: number): Promise<SharedPreview[]> {
    try {
      const result = await this.db.query(
        `SELECT * FROM shared_previews WHERE brief_id = $1 ORDER BY created_at DESC`,
        [briefId]
      );

      return result.rows;
    } catch (error) {
      console.error('Failed to get brief share links:', error);
      throw error;
    }
  }

  /**
   * Get access statistics for a share link
   */
  async getShareLinkStats(
    sharedPreviewId: number
  ): Promise<{
    total_views: number;
    unique_ips: number;
    countries: Record<string, number>;
    cities: Record<string, number>;
    recent_accesses: PreviewAccessLog[];
  }> {
    try {
      // Get share link info
      const shareResult = await this.db.query(
        `SELECT view_count FROM shared_previews WHERE id = $1`,
        [sharedPreviewId]
      );

      if (shareResult.rows.length === 0) {
        throw new Error('Share link not found');
      }

      const totalViews = shareResult.rows[0].view_count;

      // Get access logs
      const logsResult = await this.db.query(
        `SELECT * FROM preview_access_logs WHERE shared_preview_id = $1 ORDER BY accessed_at DESC LIMIT 100`,
        [sharedPreviewId]
      );

      const accessLogs = logsResult.rows;

      // Calculate stats
      const uniqueIps = new Set(
        accessLogs
          .map((log) => log.ip_address)
          .filter((ip) => ip !== null)
      ).size;

      const countries: Record<string, number> = {};
      const cities: Record<string, number> = {};

      accessLogs.forEach((log) => {
        if (log.country) {
          countries[log.country] = (countries[log.country] || 0) + 1;
        }
        if (log.city) {
          cities[log.city] = (cities[log.city] || 0) + 1;
        }
      });

      return {
        total_views: totalViews,
        unique_ips: uniqueIps,
        countries,
        cities,
        recent_accesses: accessLogs,
      };
    } catch (error) {
      console.error('Failed to get share link stats:', error);
      throw error;
    }
  }

  /**
   * Update share link settings
   */
  async updateShareLink(
    id: number,
    input: {
      expiresIn?: number;
      maxViews?: number;
      allowComments?: boolean;
      allowDownloads?: boolean;
    }
  ): Promise<SharedPreview> {
    try {
      let expiresAt = null;
      if (input.expiresIn) {
        expiresAt = new Date(
          Date.now() + input.expiresIn * 60 * 1000
        ).toISOString();
      }

      const updates: string[] = [];
      const values: any[] = [];
      let paramCount = 1;

      if (expiresAt) {
        updates.push(`expires_at = $${paramCount++}`);
        values.push(expiresAt);
      }

      if (input.maxViews !== undefined) {
        updates.push(`max_views = $${paramCount++}`);
        values.push(input.maxViews || null);
      }

      if (input.allowComments !== undefined) {
        updates.push(`allow_comments = $${paramCount++}`);
        values.push(input.allowComments);
      }

      if (input.allowDownloads !== undefined) {
        updates.push(`allow_downloads = $${paramCount++}`);
        values.push(input.allowDownloads);
      }

      updates.push(`updated_at = NOW()`);
      values.push(id);

      const result = await this.db.query(
        `UPDATE shared_previews SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
        values
      );

      return result.rows[0];
    } catch (error) {
      console.error('Failed to update share link:', error);
      throw error;
    }
  }

  /**
   * Revoke a share link (soft delete)
   */
  async revokeShareLink(id: number): Promise<void> {
    try {
      await this.db.query(
        `UPDATE shared_previews SET expires_at = NOW() WHERE id = $1`,
        [id]
      );
    } catch (error) {
      console.error('Failed to revoke share link:', error);
      throw error;
    }
  }

  /**
   * Delete a share link permanently
   */
  async deleteShareLink(id: number): Promise<void> {
    try {
      // Delete access logs first
      await this.db.query(
        `DELETE FROM preview_access_logs WHERE shared_preview_id = $1`,
        [id]
      );

      // Delete share link
      await this.db.query(
        `DELETE FROM shared_previews WHERE id = $1`,
        [id]
      );
    } catch (error) {
      console.error('Failed to delete share link:', error);
      throw error;
    }
  }
}
