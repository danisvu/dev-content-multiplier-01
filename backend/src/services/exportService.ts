export interface ExportOptions {
  format: 'csv' | 'ics' | 'json';
  includePlatforms?: string[];
  includeVersionHistory?: boolean;
  includeMetadata?: boolean;
  dateRange?: {
    startDate: Date;
    endDate: Date;
  };
}

export class ExportService {
  constructor(private db: any) {}

  /**
   * Export derivatives as CSV
   * Columns: Derivative ID, Brief ID, Platform, Content, Status, Character Count, Created At, Published At
   */
  async exportDerivativesAsCSV(briefId: number, options?: {
    platforms?: string[];
  }): Promise<string> {
    try {
      let query = `
        SELECT
          d.id,
          d.brief_id,
          d.platform,
          d.content,
          d.status,
          d.character_count,
          d.created_at,
          d.published_at
        FROM derivatives d
        WHERE d.brief_id = $1
      `;

      const params: any[] = [briefId];

      if (options?.platforms && options.platforms.length > 0) {
        query += ` AND d.platform = ANY($2)`;
        params.push(options.platforms);
      }

      query += ` ORDER BY d.platform, d.created_at`;

      const result = await this.db.query(query, params);

      // Create CSV content
      const headers = [
        'ID',
        'Brief ID',
        'Platform',
        'Content',
        'Status',
        'Characters',
        'Created',
        'Published',
      ];

      const rows = result.rows.map((row) => [
        row.id,
        row.brief_id,
        row.platform,
        this.escapeCSVField(row.content),
        row.status,
        row.character_count,
        row.created_at,
        row.published_at || '',
      ]);

      return this.generateCSV(headers, rows);
    } catch (error) {
      console.error('Failed to export derivatives as CSV:', error);
      throw error;
    }
  }

  /**
   * Export derivatives as iCalendar format
   * Creates calendar events for published derivatives
   */
  async exportDerivativesAsICS(briefId: number): Promise<string> {
    try {
      const result = await this.db.query(
        `SELECT
          d.id,
          d.platform,
          d.content,
          d.published_at,
          b.title as brief_title
        FROM derivatives d
        JOIN briefs b ON d.brief_id = b.id
        WHERE d.brief_id = $1 AND d.status = 'published'
        ORDER BY d.published_at DESC`,
        [briefId]
      );

      const icsLines: string[] = [
        'BEGIN:VCALENDAR',
        'VERSION:2.0',
        'PRODID:-//Content Multiplier//EN',
        'CALSCALE:GREGORIAN',
        'METHOD:PUBLISH',
        `X-WR-CALNAME:Content Publishing Schedule`,
        `X-WR-TIMEZONE:UTC`,
      ];

      result.rows.forEach((row) => {
        const eventDate = new Date(row.published_at);
        const formattedDate = this.formatICSDate(eventDate);
        const eventId = `derivative-${row.id}@content-multiplier`;
        const summary = `Publish to ${row.platform} - ${row.brief_title}`;
        const description = this.escapeICSField(row.content.substring(0, 200));

        icsLines.push('BEGIN:VEVENT');
        icsLines.push(`UID:${eventId}`);
        icsLines.push(`DTSTAMP:${this.formatICSDate(new Date())}`);
        icsLines.push(`DTSTART:${formattedDate}`);
        icsLines.push(`DTEND:${formattedDate}`);
        icsLines.push(`SUMMARY:${summary}`);
        icsLines.push(`DESCRIPTION:${description}`);
        icsLines.push(`URL:https://content-multiplier.app/briefs/${briefId}`);
        icsLines.push(`CATEGORIES:${row.platform.toUpperCase()}`);
        icsLines.push('STATUS:CONFIRMED');
        icsLines.push('END:VEVENT');
      });

      icsLines.push('END:VCALENDAR');

      return icsLines.join('\r\n');
    } catch (error) {
      console.error('Failed to export derivatives as ICS:', error);
      throw error;
    }
  }

  /**
   * Export derivatives as JSON with full metadata
   */
  async exportDerivativesAsJSON(briefId: number, options?: {
    includeVersionHistory?: boolean;
    includeMetadata?: boolean;
  }): Promise<string> {
    try {
      // Get brief info
      const briefResult = await this.db.query(
        `SELECT id, title, content, status, created_at FROM briefs WHERE id = $1`,
        [briefId]
      );

      if (briefResult.rows.length === 0) {
        throw new Error('Brief not found');
      }

      const brief = briefResult.rows[0];

      // Get derivatives
      const derivResult = await this.db.query(
        `SELECT * FROM derivatives WHERE brief_id = $1 ORDER BY platform, created_at`,
        [briefId]
      );

      const derivatives = derivResult.rows;

      // Get version history if requested
      let versionHistory: any = {};
      if (options?.includeVersionHistory) {
        for (const deriv of derivatives) {
          const versionResult = await this.db.query(
            `SELECT * FROM derivative_versions WHERE derivative_id = $1 ORDER BY version_number`,
            [deriv.id]
          );
          versionHistory[deriv.id] = versionResult.rows;
        }
      }

      // Get costs if metadata requested
      let costs: any = {};
      if (options?.includeMetadata) {
        for (const deriv of derivatives) {
          const costResult = await this.db.query(
            `SELECT
              COALESCE(SUM(cost_amount), 0) as total_cost,
              COUNT(*) as transaction_count
            FROM cost_tracking
            WHERE derivative_id = $1`,
            [deriv.id]
          );
          costs[deriv.id] = costResult.rows[0];
        }
      }

      // Build export object
      const exportData = {
        exportDate: new Date().toISOString(),
        brief: {
          id: brief.id,
          title: brief.title,
          content: brief.content,
          status: brief.status,
          created_at: brief.created_at,
        },
        derivatives: derivatives.map((deriv) => ({
          id: deriv.id,
          platform: deriv.platform,
          content: deriv.content,
          status: deriv.status,
          character_count: deriv.character_count,
          created_at: deriv.created_at,
          published_at: deriv.published_at,
          ...(options?.includeVersionHistory && {
            versions: versionHistory[deriv.id],
          }),
          ...(options?.includeMetadata && {
            cost: costs[deriv.id],
          }),
        })),
      };

      return JSON.stringify(exportData, null, 2);
    } catch (error) {
      console.error('Failed to export derivatives as JSON:', error);
      throw error;
    }
  }

  /**
   * Export version history as CSV
   */
  async exportVersionHistoryAsCSV(derivativeId: number): Promise<string> {
    try {
      const result = await this.db.query(
        `SELECT
          id,
          derivative_id,
          version_number,
          content,
          character_count,
          change_summary,
          change_type,
          changed_by,
          created_at
        FROM derivative_versions
        WHERE derivative_id = $1
        ORDER BY version_number ASC`,
        [derivativeId]
      );

      const headers = [
        'Version',
        'Type',
        'Summary',
        'Characters',
        'Changed By',
        'Created',
      ];

      const rows = result.rows.map((row) => [
        row.version_number,
        row.change_type,
        row.change_summary || '',
        row.character_count,
        row.changed_by || '',
        row.created_at,
      ]);

      return this.generateCSV(headers, rows);
    } catch (error) {
      console.error('Failed to export version history as CSV:', error);
      throw error;
    }
  }

  /**
   * Helper: Escape CSV fields
   */
  private escapeCSVField(field: string): string {
    if (!field) return '';

    // Escape quotes and wrap in quotes if contains special chars
    if (
      field.includes(',') ||
      field.includes('"') ||
      field.includes('\n') ||
      field.includes('\r')
    ) {
      return `"${field.replace(/"/g, '""')}"`;
    }
    return field;
  }

  /**
   * Helper: Generate CSV from headers and rows
   */
  private generateCSV(headers: string[], rows: any[][]): string {
    const csvLines = [
      headers.map((h) => this.escapeCSVField(h)).join(','),
      ...rows.map((row) =>
        row.map((cell) => this.escapeCSVField(String(cell))).join(',')
      ),
    ];

    return csvLines.join('\n');
  }

  /**
   * Helper: Format date for iCalendar format
   */
  private formatICSDate(date: Date): string {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  }

  /**
   * Helper: Escape text for iCalendar format
   */
  private escapeICSField(text: string): string {
    return text
      .replace(/\\/g, '\\\\')
      .replace(/,/g, '\\,')
      .replace(/;/g, '\\;')
      .replace(/\n/g, '\\n')
      .replace(/\r/g, '\\r');
  }
}
