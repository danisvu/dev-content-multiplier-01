export interface FunnelMetrics {
  stage: 'draft' | 'derivative' | 'published';
  count: number;
  percentage: number;
  platform_breakdown?: Record<string, number>;
}

export interface FunnelAnalytics {
  total_ideas: number;
  total_briefs: number;
  total_derivatives: number;
  total_published: number;
  funnel: FunnelMetrics[];
  conversion_rates: {
    ideas_to_briefs: number; // %
    briefs_to_derivatives: number; // %
    derivatives_to_published: number; // %
  };
}

export interface PlatformAnalytics {
  platform: string;
  total_derivatives: number;
  draft: number;
  scheduled: number;
  published: number;
  average_character_count: number;
  average_engagement_potential: number;
}

export interface DerivativeAnalytics {
  total_count: number;
  by_status: Record<string, number>;
  by_platform: Record<string, number>;
  average_character_count: number;
  character_count_by_platform: Record<string, number>;
  creation_trend: Array<{
    date: string;
    count: number;
  }>;
}

export interface TimeSeriesData {
  date: string;
  count: number;
  published_count?: number;
}

export class AnalyticsService {
  constructor(private db: any) {}

  /**
   * Get funnel analytics from ideas → briefs → derivatives → published
   */
  async getFunnelAnalytics(options?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<FunnelAnalytics> {
    try {
      let dateFilter = '';
      const params: any[] = [];

      if (options?.startDate) {
        params.push(options.startDate);
        dateFilter += ` AND i.created_at >= $${params.length}`;
      }

      if (options?.endDate) {
        params.push(options.endDate);
        dateFilter += ` AND i.created_at <= $${params.length}`;
      }

      // Count ideas
      const ideasResult = await this.db.query(
        `SELECT COUNT(*) as count FROM ideas WHERE 1=1 ${dateFilter}`,
        params
      );
      const totalIdeas = parseInt(ideasResult.rows[0].count);

      // Count briefs
      const briefsResult = await this.db.query(
        `SELECT COUNT(DISTINCT b.id) as count FROM briefs b
         JOIN ideas i ON b.idea_id = i.id
         WHERE 1=1 ${dateFilter}`,
        params
      );
      const totalBriefs = parseInt(briefsResult.rows[0].count);

      // Count derivatives (draft stage)
      const draftResult = await this.db.query(
        `SELECT COUNT(DISTINCT d.id) as count FROM derivatives d
         JOIN briefs b ON d.brief_id = b.id
         JOIN ideas i ON b.idea_id = i.id
         WHERE 1=1 ${dateFilter}`,
        params
      );
      const totalDerivatives = parseInt(draftResult.rows[0].count);

      // Count published derivatives
      const publishedResult = await this.db.query(
        `SELECT COUNT(DISTINCT d.id) as count FROM derivatives d
         JOIN briefs b ON d.brief_id = b.id
         JOIN ideas i ON b.idea_id = i.id
         WHERE d.status = 'published' ${dateFilter}`,
        params
      );
      const totalPublished = parseInt(publishedResult.rows[0].count);

      // Get platform breakdown for derivatives
      const platformResult = await this.db.query(
        `SELECT d.platform, COUNT(*) as count FROM derivatives d
         WHERE 1=1 ${dateFilter}
         GROUP BY d.platform`,
        params
      );

      const platformBreakdown: Record<string, number> = {};
      platformResult.rows.forEach((row) => {
        platformBreakdown[row.platform] = parseInt(row.count);
      });

      // Calculate funnel stages
      const funnel: FunnelMetrics[] = [
        {
          stage: 'draft',
          count: totalBriefs,
          percentage: totalIdeas > 0 ? (totalBriefs / totalIdeas) * 100 : 0,
        },
        {
          stage: 'derivative',
          count: totalDerivatives,
          percentage: totalBriefs > 0 ? (totalDerivatives / totalBriefs) * 100 : 0,
          platform_breakdown: platformBreakdown,
        },
        {
          stage: 'published',
          count: totalPublished,
          percentage:
            totalDerivatives > 0
              ? (totalPublished / totalDerivatives) * 100
              : 0,
        },
      ];

      return {
        total_ideas: totalIdeas,
        total_briefs: totalBriefs,
        total_derivatives: totalDerivatives,
        total_published: totalPublished,
        funnel,
        conversion_rates: {
          ideas_to_briefs:
            totalIdeas > 0 ? (totalBriefs / totalIdeas) * 100 : 0,
          briefs_to_derivatives:
            totalBriefs > 0 ? (totalDerivatives / totalBriefs) * 100 : 0,
          derivatives_to_published:
            totalDerivatives > 0
              ? (totalPublished / totalDerivatives) * 100
              : 0,
        },
      };
    } catch (error) {
      console.error('Failed to get funnel analytics:', error);
      throw error;
    }
  }

  /**
   * Get platform-specific analytics
   */
  async getPlatformAnalytics(): Promise<PlatformAnalytics[]> {
    try {
      const result = await this.db.query(
        `SELECT
          d.platform,
          COUNT(*) as total_derivatives,
          SUM(CASE WHEN d.status = 'draft' THEN 1 ELSE 0 END) as draft,
          SUM(CASE WHEN d.status = 'scheduled' THEN 1 ELSE 0 END) as scheduled,
          SUM(CASE WHEN d.status = 'published' THEN 1 ELSE 0 END) as published,
          AVG(d.character_count)::INT as average_character_count
        FROM derivatives d
        GROUP BY d.platform
        ORDER BY d.platform`
      );

      // Platform engagement potentials (predefined scoring)
      const engagementScores: Record<string, number> = {
        twitter: 7.5, // High engagement, real-time
        linkedin: 8.0, // Professional engagement, algorithmic boost
        facebook: 6.5, // Community-driven
        instagram: 8.5, // Visual platform, high engagement
        tiktok: 9.0, // Algorithm-favored, high viral potential
      };

      return result.rows.map((row) => ({
        platform: row.platform,
        total_derivatives: parseInt(row.total_derivatives),
        draft: parseInt(row.draft || 0),
        scheduled: parseInt(row.scheduled || 0),
        published: parseInt(row.published || 0),
        average_character_count: parseInt(row.average_character_count || 0),
        average_engagement_potential:
          engagementScores[row.platform.toLowerCase()] || 5.0,
      }));
    } catch (error) {
      console.error('Failed to get platform analytics:', error);
      throw error;
    }
  }

  /**
   * Get derivative analytics with trends
   */
  async getDerivativeAnalytics(options?: {
    startDate?: Date;
    endDate?: Date;
  }): Promise<DerivativeAnalytics> {
    try {
      let dateFilter = '';
      const params: any[] = [];

      if (options?.startDate) {
        params.push(options.startDate);
        dateFilter += ` AND d.created_at >= $${params.length}`;
      }

      if (options?.endDate) {
        params.push(options.endDate);
        dateFilter += ` AND d.created_at <= $${params.length}`;
      }

      // Total count
      const countResult = await this.db.query(
        `SELECT COUNT(*) as count FROM derivatives d WHERE 1=1 ${dateFilter}`,
        params
      );
      const totalCount = parseInt(countResult.rows[0].count);

      // Status breakdown
      const statusResult = await this.db.query(
        `SELECT status, COUNT(*) as count FROM derivatives d
         WHERE 1=1 ${dateFilter}
         GROUP BY status`,
        params
      );

      const byStatus: Record<string, number> = {};
      statusResult.rows.forEach((row) => {
        byStatus[row.status] = parseInt(row.count);
      });

      // Platform breakdown
      const platformResult = await this.db.query(
        `SELECT platform, COUNT(*) as count FROM derivatives d
         WHERE 1=1 ${dateFilter}
         GROUP BY platform`,
        params
      );

      const byPlatform: Record<string, number> = {};
      platformResult.rows.forEach((row) => {
        byPlatform[row.platform] = parseInt(row.count);
      });

      // Character count stats
      const charCountResult = await this.db.query(
        `SELECT
          AVG(character_count)::INT as average_count
        FROM derivatives d
        WHERE 1=1 ${dateFilter}`,
        params
      );

      const averageCharCount =
        parseInt(charCountResult.rows[0].average_count || 0);

      // Character count by platform
      const charByPlatformResult = await this.db.query(
        `SELECT
          platform,
          AVG(character_count)::INT as average_count
        FROM derivatives d
        WHERE 1=1 ${dateFilter}
        GROUP BY platform`,
        params
      );

      const characterCountByPlatform: Record<string, number> = {};
      charByPlatformResult.rows.forEach((row) => {
        characterCountByPlatform[row.platform] = parseInt(row.average_count);
      });

      // Creation trend (last 30 days by default)
      const trendResult = await this.db.query(
        `SELECT
          DATE(created_at) as date,
          COUNT(*) as count
        FROM derivatives d
        WHERE created_at >= CURRENT_DATE - INTERVAL '30 days' ${dateFilter}
        GROUP BY DATE(created_at)
        ORDER BY date ASC`,
        params
      );

      const creationTrend: TimeSeriesData[] = trendResult.rows.map((row) => ({
        date: row.date,
        count: parseInt(row.count),
      }));

      return {
        total_count: totalCount,
        by_status: byStatus,
        by_platform: byPlatform,
        average_character_count: averageCharCount,
        character_count_by_platform: characterCountByPlatform,
        creation_trend: creationTrend,
      };
    } catch (error) {
      console.error('Failed to get derivative analytics:', error);
      throw error;
    }
  }

  /**
   * Get time series data for a specific period
   */
  async getTimeSeriesData(options: {
    groupBy?: 'day' | 'week' | 'month'; // default 'day'
    startDate?: Date;
    endDate?: Date;
  }): Promise<TimeSeriesData[]> {
    try {
      const groupBy = options.groupBy || 'day';
      const groupFormat =
        groupBy === 'day'
          ? 'DATE'
          : groupBy === 'week'
            ? 'DATE_TRUNC(\'week\''
            : 'DATE_TRUNC(\'month\'';

      let dateFilter = '';
      const params: any[] = [];

      if (options.startDate) {
        params.push(options.startDate);
        dateFilter += ` AND d.created_at >= $${params.length}`;
      }

      if (options.endDate) {
        params.push(options.endDate);
        dateFilter += ` AND d.created_at <= $${params.length}`;
      }

      const query =
        groupBy === 'day'
          ? `SELECT
              DATE(d.created_at) as date,
              COUNT(*) as count,
              SUM(CASE WHEN d.status = 'published' THEN 1 ELSE 0 END) as published_count
            FROM derivatives d
            WHERE 1=1 ${dateFilter}
            GROUP BY DATE(d.created_at)
            ORDER BY date ASC`
          : `SELECT
              DATE_TRUNC('${groupBy}', d.created_at)::DATE as date,
              COUNT(*) as count,
              SUM(CASE WHEN d.status = 'published' THEN 1 ELSE 0 END) as published_count
            FROM derivatives d
            WHERE 1=1 ${dateFilter}
            GROUP BY DATE_TRUNC('${groupBy}', d.created_at)
            ORDER BY date ASC`;

      const result = await this.db.query(query, params);

      return result.rows.map((row) => ({
        date: row.date,
        count: parseInt(row.count),
        published_count: parseInt(row.published_count || 0),
      }));
    } catch (error) {
      console.error('Failed to get time series data:', error);
      throw error;
    }
  }

  /**
   * Get detailed conversion funnel with step-by-step metrics
   */
  async getConversionFunnel(options?: {
    platform?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<{
    steps: Array<{
      step: number;
      name: string;
      count: number;
      drop_off: number;
      drop_off_percentage: number;
    }>;
    total_conversion_rate: number;
  }> {
    try {
      let dateFilter = '';
      const params: any[] = [];

      if (options?.startDate) {
        params.push(options.startDate);
        dateFilter += ` AND i.created_at >= $${params.length}`;
      }

      if (options?.endDate) {
        params.push(options.endDate);
        dateFilter += ` AND i.created_at <= $${params.length}`;
      }

      // Step 1: Ideas
      const ideasResult = await this.db.query(
        `SELECT COUNT(*) as count FROM ideas i WHERE 1=1 ${dateFilter}`,
        params
      );
      const ideasCount = parseInt(ideasResult.rows[0].count);

      // Step 2: Briefs (from selected ideas)
      const briefsResult = await this.db.query(
        `SELECT COUNT(DISTINCT b.id) as count FROM briefs b
         JOIN ideas i ON b.idea_id = i.id
         WHERE i.status = 'selected' ${dateFilter}`,
        params
      );
      const briefsCount = parseInt(briefsResult.rows[0].count);

      // Step 3: Derivatives generated
      const derivResult = await this.db.query(
        `SELECT COUNT(DISTINCT d.id) as count FROM derivatives d
         JOIN briefs b ON d.brief_id = b.id
         JOIN ideas i ON b.idea_id = i.id
         WHERE 1=1 ${dateFilter}`,
        params
      );
      const derivCount = parseInt(derivResult.rows[0].count);

      // Step 4: Scheduled for publishing
      const scheduledResult = await this.db.query(
        `SELECT COUNT(DISTINCT d.id) as count FROM derivatives d
         JOIN briefs b ON d.brief_id = b.id
         JOIN ideas i ON b.idea_id = i.id
         WHERE d.status IN ('scheduled', 'published') ${dateFilter}`,
        params
      );
      const scheduledCount = parseInt(scheduledResult.rows[0].count);

      // Step 5: Published
      const publishedResult = await this.db.query(
        `SELECT COUNT(DISTINCT d.id) as count FROM derivatives d
         JOIN briefs b ON d.brief_id = b.id
         JOIN ideas i ON b.idea_id = i.id
         WHERE d.status = 'published' ${dateFilter}`,
        params
      );
      const publishedCount = parseInt(publishedResult.rows[0].count);

      const steps = [
        {
          step: 1,
          name: 'Ideas Generated',
          count: ideasCount,
          drop_off: 0,
          drop_off_percentage: 0,
        },
        {
          step: 2,
          name: 'Selected for Brief',
          count: briefsCount,
          drop_off: ideasCount - briefsCount,
          drop_off_percentage:
            ideasCount > 0 ? ((ideasCount - briefsCount) / ideasCount) * 100 : 0,
        },
        {
          step: 3,
          name: 'Derivatives Generated',
          count: derivCount,
          drop_off: briefsCount - derivCount,
          drop_off_percentage:
            briefsCount > 0
              ? ((briefsCount - derivCount) / briefsCount) * 100
              : 0,
        },
        {
          step: 4,
          name: 'Scheduled/Published',
          count: scheduledCount,
          drop_off: derivCount - scheduledCount,
          drop_off_percentage:
            derivCount > 0
              ? ((derivCount - scheduledCount) / derivCount) * 100
              : 0,
        },
        {
          step: 5,
          name: 'Published',
          count: publishedCount,
          drop_off: scheduledCount - publishedCount,
          drop_off_percentage:
            scheduledCount > 0
              ? ((scheduledCount - publishedCount) / scheduledCount) * 100
              : 0,
        },
      ];

      return {
        steps,
        total_conversion_rate:
          ideasCount > 0 ? (publishedCount / ideasCount) * 100 : 0,
      };
    } catch (error) {
      console.error('Failed to get conversion funnel:', error);
      throw error;
    }
  }
}
