import { query } from '../database';
import { eventLogService } from './eventLogService';

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

export interface CreateVersionInput {
  derivativeId: number;
  content: string;
  changeSummary?: string;
  changeType: 'created' | 'edited' | 'ai_regenerated' | 'rollback';
  changedBy?: string;
  changeReason?: string;
}

export interface VersionComparison {
  version1: DerivativeVersion;
  version2: DerivativeVersion;
  added: string;
  removed: string;
  modified: boolean;
}

export class VersionControlService {
  /**
   * Create a new version of a derivative
   */
  async createVersion(input: CreateVersionInput): Promise<DerivativeVersion> {
    const {
      derivativeId,
      content,
      changeSummary,
      changeType,
      changedBy,
      changeReason
    } = input;

    const characterCount = content.length;

    // Get the next version number
    const versionResult = await query(
      `SELECT COALESCE(MAX(version_number), 0) + 1 as next_version
       FROM derivative_versions
       WHERE derivative_id = $1`,
      [derivativeId]
    );

    const versionNumber = versionResult.rows[0].next_version;

    // Mark all current versions as non-current
    await query(
      `UPDATE derivative_versions
       SET is_current = FALSE
       WHERE derivative_id = $1 AND is_current = TRUE`,
      [derivativeId]
    );

    // Create new version
    const result = await query(
      `INSERT INTO derivative_versions (
        derivative_id,
        version_number,
        content,
        character_count,
        change_summary,
        change_type,
        changed_by,
        change_reason,
        is_current
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, TRUE)
      RETURNING *`,
      [
        derivativeId,
        versionNumber,
        content,
        characterCount,
        changeSummary || null,
        changeType,
        changedBy || null,
        changeReason || null
      ]
    );

    const version = result.rows[0] as DerivativeVersion;

    // Log the version creation
    await eventLogService.logEvent({
      eventType: 'derivative.version.created',
      entityType: 'derivative_version',
      entityId: version.id,
      userId: changedBy || 'system',
      metadata: {
        derivativeId,
        versionNumber,
        changeType,
        changeSummary
      },
      status: 'success'
    });

    return version;
  }

  /**
   * Get all versions of a derivative
   */
  async getDerivativeVersions(derivativeId: number): Promise<DerivativeVersion[]> {
    const result = await query(
      `SELECT * FROM derivative_versions
       WHERE derivative_id = $1
       ORDER BY version_number DESC`,
      [derivativeId]
    );

    return result.rows as DerivativeVersion[];
  }

  /**
   * Get a specific version
   */
  async getVersion(versionId: number): Promise<DerivativeVersion | null> {
    const result = await query(
      `SELECT * FROM derivative_versions WHERE id = $1`,
      [versionId]
    );

    return result.rows[0] || null;
  }

  /**
   * Get current version of a derivative
   */
  async getCurrentVersion(derivativeId: number): Promise<DerivativeVersion | null> {
    const result = await query(
      `SELECT * FROM derivative_versions
       WHERE derivative_id = $1 AND is_current = TRUE`,
      [derivativeId]
    );

    return result.rows[0] || null;
  }

  /**
   * Rollback to a specific version
   */
  async rollbackToVersion(
    derivativeId: number,
    targetVersionId: number,
    userId?: string
  ): Promise<DerivativeVersion> {
    // Get the target version
    const targetVersion = await this.getVersion(targetVersionId);
    if (!targetVersion || targetVersion.derivative_id !== derivativeId) {
      throw new Error('Target version not found or does not belong to this derivative');
    }

    // Create a new version with rollback type
    const rollbackVersion = await this.createVersion({
      derivativeId,
      content: targetVersion.content,
      changeType: 'rollback',
      changeSummary: `Rolled back to version ${targetVersion.version_number}`,
      changeReason: `Restored from version ${targetVersion.version_number} created on ${targetVersion.created_at}`,
      changedBy: userId
    });

    // Log rollback event
    await eventLogService.logEvent({
      eventType: 'derivative.version.rollback',
      entityType: 'derivative',
      entityId: derivativeId,
      userId: userId || 'system',
      metadata: {
        fromVersionId: targetVersionId,
        toVersionId: rollbackVersion.id,
        fromVersionNumber: targetVersion.version_number,
        toVersionNumber: rollbackVersion.version_number
      },
      status: 'success'
    });

    return rollbackVersion;
  }

  /**
   * Compare two versions
   */
  async compareVersions(version1Id: number, version2Id: number): Promise<VersionComparison> {
    const v1 = await this.getVersion(version1Id);
    const v2 = await this.getVersion(version2Id);

    if (!v1 || !v2) {
      throw new Error('One or both versions not found');
    }

    const content1 = v1.content;
    const content2 = v2.content;

    // Simple text diff
    const added = content2
      .split(' ')
      .filter(word => !content1.includes(word))
      .join(' ');

    const removed = content1
      .split(' ')
      .filter(word => !content2.includes(word))
      .join(' ');

    return {
      version1: v1,
      version2: v2,
      added,
      removed,
      modified: content1 !== content2
    };
  }

  /**
   * Delete a specific version (only non-current versions)
   */
  async deleteVersion(versionId: number, userId?: string): Promise<boolean> {
    // Prevent deleting current version
    const version = await this.getVersion(versionId);
    if (!version) {
      throw new Error('Version not found');
    }

    if (version.is_current) {
      throw new Error('Cannot delete the current version');
    }

    const result = await query(
      `DELETE FROM derivative_versions WHERE id = $1`,
      [versionId]
    );

    if (result.rowCount > 0) {
      await eventLogService.logEvent({
        eventType: 'derivative.version.deleted',
        entityType: 'derivative_version',
        entityId: versionId,
        userId: userId || 'system',
        metadata: {
          derivativeId: version.derivative_id,
          versionNumber: version.version_number
        },
        status: 'success'
      });
    }

    return result.rowCount > 0;
  }

  /**
   * Get version history with detailed info
   */
  async getVersionHistory(derivativeId: number, limit: number = 50): Promise<DerivativeVersion[]> {
    const result = await query(
      `SELECT * FROM derivative_versions
       WHERE derivative_id = $1
       ORDER BY created_at DESC
       LIMIT $2`,
      [derivativeId, limit]
    );

    return result.rows as DerivativeVersion[];
  }

  /**
   * Get version statistics for a derivative
   */
  async getVersionStats(derivativeId: number): Promise<Record<string, any>> {
    const result = await query(
      `SELECT
        COUNT(*) as total_versions,
        change_type,
        COUNT(CASE WHEN is_current = TRUE THEN 1 END) as current_version_count
       FROM derivative_versions
       WHERE derivative_id = $1
       GROUP BY change_type`,
      [derivativeId]
    );

    return {
      totalVersions: result.rows.reduce((sum, row) => sum + parseInt(row.total_versions || 0), 0),
      byChangeType: result.rows
    };
  }

  /**
   * Purge old versions keeping only last N versions
   */
  async purgeOldVersions(derivativeId: number, keepCount: number = 10): Promise<number> {
    const result = await query(
      `DELETE FROM derivative_versions
       WHERE derivative_id = $1 AND is_current = FALSE
       AND version_number NOT IN (
         SELECT version_number FROM derivative_versions
         WHERE derivative_id = $1
         ORDER BY version_number DESC
         LIMIT $2
       )`,
      [derivativeId, keepCount - 1]
    );

    return result.rowCount || 0;
  }

  /**
   * Get version timeline for a derivative
   */
  async getVersionTimeline(derivativeId: number): Promise<any[]> {
    const result = await query(
      `SELECT
        id,
        version_number,
        change_summary,
        change_type,
        changed_by,
        created_at,
        is_current,
        character_count
       FROM derivative_versions
       WHERE derivative_id = $1
       ORDER BY version_number ASC`,
      [derivativeId]
    );

    return result.rows;
  }
}

export const versionControlService = new VersionControlService();
