import { FastifyInstance } from 'fastify';

export interface CostTrackingRecord {
  id: number;
  derivative_id: number;
  cost_type: 'llm' | 'api_call' | 'storage' | 'processing';
  provider?: string;
  cost_amount: number;
  currency: string;
  tokens_used?: number;
  input_tokens?: number;
  output_tokens?: number;
  request_metadata?: Record<string, any>;
  created_at: string;
}

export interface CostSummary {
  brief_id: number;
  total_cost: number;
  llm_cost: number;
  api_cost: number;
  derivative_count: number;
  average_cost_per_derivative: number;
  last_updated: string;
}

export interface DerivativeCost {
  derivative_id: number;
  platform: string;
  total_cost: number;
  cost_breakdown: {
    llm: number;
    api: number;
    other: number;
  };
  tokens_used: number;
  created_at: string;
}

export class CostTrackingService {
  constructor(private db: any) {}

  /**
   * Log a cost transaction for a derivative
   */
  async recordCost(input: {
    derivativeId: number;
    costType: 'llm' | 'api_call' | 'storage' | 'processing';
    provider?: string;
    costAmount: number;
    tokensUsed?: number;
    inputTokens?: number;
    outputTokens?: number;
    requestMetadata?: Record<string, any>;
  }): Promise<CostTrackingRecord> {
    try {
      const result = await this.db.query(
        `INSERT INTO cost_tracking
        (derivative_id, cost_type, provider, cost_amount, tokens_used, input_tokens, output_tokens, request_metadata)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING *`,
        [
          input.derivativeId,
          input.costType,
          input.provider || null,
          input.costAmount,
          input.tokensUsed || null,
          input.inputTokens || null,
          input.outputTokens || null,
          input.requestMetadata ? JSON.stringify(input.requestMetadata) : null,
        ]
      );

      // Update cost summary cache
      await this.updateCostSummary(input.derivativeId);

      return result.rows[0];
    } catch (error) {
      console.error('Failed to record cost:', error);
      throw error;
    }
  }

  /**
   * Get cost breakdown for a specific derivative
   */
  async getDerivativeCost(derivativeId: number): Promise<DerivativeCost | null> {
    try {
      const result = await this.db.query(
        `SELECT
          d.id,
          d.platform,
          SUM(ct.cost_amount) as total_cost,
          SUM(CASE WHEN ct.cost_type = 'llm' THEN ct.cost_amount ELSE 0 END) as llm_cost,
          SUM(CASE WHEN ct.cost_type = 'api_call' THEN ct.cost_amount ELSE 0 END) as api_cost,
          SUM(CASE WHEN ct.cost_type NOT IN ('llm', 'api_call') THEN ct.cost_amount ELSE 0 END) as other_cost,
          SUM(ct.tokens_used) as tokens_used,
          d.created_at
        FROM derivatives d
        LEFT JOIN cost_tracking ct ON d.id = ct.derivative_id
        WHERE d.id = $1
        GROUP BY d.id, d.platform, d.created_at`,
        [derivativeId]
      );

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        derivative_id: row.id,
        platform: row.platform,
        total_cost: parseFloat(row.total_cost || 0),
        cost_breakdown: {
          llm: parseFloat(row.llm_cost || 0),
          api: parseFloat(row.api_cost || 0),
          other: parseFloat(row.other_cost || 0),
        },
        tokens_used: row.tokens_used || 0,
        created_at: row.created_at,
      };
    } catch (error) {
      console.error('Failed to get derivative cost:', error);
      throw error;
    }
  }

  /**
   * Get cost breakdown for all derivatives in a brief
   */
  async getBriefCosts(briefId: number): Promise<DerivativeCost[]> {
    try {
      const result = await this.db.query(
        `SELECT
          d.id,
          d.platform,
          SUM(ct.cost_amount) as total_cost,
          SUM(CASE WHEN ct.cost_type = 'llm' THEN ct.cost_amount ELSE 0 END) as llm_cost,
          SUM(CASE WHEN ct.cost_type = 'api_call' THEN ct.cost_amount ELSE 0 END) as api_cost,
          SUM(CASE WHEN ct.cost_type NOT IN ('llm', 'api_call') THEN ct.cost_amount ELSE 0 END) as other_cost,
          SUM(ct.tokens_used) as tokens_used,
          d.created_at
        FROM derivatives d
        LEFT JOIN cost_tracking ct ON d.id = ct.derivative_id
        WHERE d.brief_id = $1
        GROUP BY d.id, d.platform, d.created_at
        ORDER BY d.created_at DESC`,
        [briefId]
      );

      return result.rows.map((row: any) => ({
        derivative_id: row.id,
        platform: row.platform,
        total_cost: parseFloat(row.total_cost || 0),
        cost_breakdown: {
          llm: parseFloat(row.llm_cost || 0),
          api: parseFloat(row.api_cost || 0),
          other: parseFloat(row.other_cost || 0),
        },
        tokens_used: row.tokens_used || 0,
        created_at: row.created_at,
      }));
    } catch (error) {
      console.error('Failed to get brief costs:', error);
      throw error;
    }
  }

  /**
   * Get aggregate cost summary for a brief
   */
  async getBriefCostSummary(briefId: number): Promise<CostSummary | null> {
    try {
      const result = await this.db.query(
        `SELECT
          b.id,
          COALESCE(SUM(ct.cost_amount), 0) as total_cost,
          COALESCE(SUM(CASE WHEN ct.cost_type = 'llm' THEN ct.cost_amount ELSE 0 END), 0) as llm_cost,
          COALESCE(SUM(CASE WHEN ct.cost_type = 'api_call' THEN ct.cost_amount ELSE 0 END), 0) as api_cost,
          COUNT(DISTINCT d.id) as derivative_count,
          COALESCE(SUM(ct.cost_amount) / NULLIF(COUNT(DISTINCT d.id), 0), 0) as avg_cost
        FROM briefs b
        LEFT JOIN derivatives d ON b.id = d.brief_id
        LEFT JOIN cost_tracking ct ON d.id = ct.derivative_id
        WHERE b.id = $1
        GROUP BY b.id`,
        [briefId]
      );

      if (result.rows.length === 0) return null;

      const row = result.rows[0];
      return {
        brief_id: row.id,
        total_cost: parseFloat(row.total_cost),
        llm_cost: parseFloat(row.llm_cost),
        api_cost: parseFloat(row.api_cost),
        derivative_count: parseInt(row.derivative_count),
        average_cost_per_derivative: parseFloat(row.avg_cost),
        last_updated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to get brief cost summary:', error);
      throw error;
    }
  }

  /**
   * Get cost statistics for a date range
   */
  async getCostStats(options: {
    startDate?: Date;
    endDate?: Date;
    provider?: string;
    costType?: string;
  }): Promise<{
    total_cost: number;
    average_cost: number;
    cost_by_provider: Record<string, number>;
    cost_by_type: Record<string, number>;
  }> {
    try {
      let query = `
        SELECT
          SUM(cost_amount) as total_cost,
          AVG(cost_amount) as average_cost,
          provider,
          cost_type
        FROM cost_tracking
        WHERE 1=1
      `;
      const params: any[] = [];

      if (options.startDate) {
        params.push(options.startDate);
        query += ` AND created_at >= $${params.length}`;
      }

      if (options.endDate) {
        params.push(options.endDate);
        query += ` AND created_at <= $${params.length}`;
      }

      query += ` GROUP BY provider, cost_type`;

      const result = await this.db.query(query, params);

      const costByProvider: Record<string, number> = {};
      const costByType: Record<string, number> = {};
      let totalCost = 0;
      let avgCost = 0;
      let count = 0;

      result.rows.forEach((row: any) => {
        const cost = parseFloat(row.total_cost || 0);
        totalCost += cost;

        if (row.provider) {
          costByProvider[row.provider] = (costByProvider[row.provider] || 0) + cost;
        }
        if (row.cost_type) {
          costByType[row.cost_type] = (costByType[row.cost_type] || 0) + cost;
        }

        avgCost += parseFloat(row.average_cost || 0);
        count++;
      });

      return {
        total_cost: totalCost,
        average_cost: count > 0 ? avgCost / count : 0,
        cost_by_provider: costByProvider,
        cost_by_type: costByType,
      };
    } catch (error) {
      console.error('Failed to get cost stats:', error);
      throw error;
    }
  }

  /**
   * Update cost summary cache for a derivative
   */
  private async updateCostSummary(derivativeId: number): Promise<void> {
    try {
      const briefResult = await this.db.query(
        `SELECT brief_id FROM derivatives WHERE id = $1`,
        [derivativeId]
      );

      if (briefResult.rows.length === 0) return;

      const briefId = briefResult.rows[0].brief_id;
      const summary = await this.getBriefCostSummary(briefId);

      if (!summary) return;

      await this.db.query(
        `INSERT INTO cost_summary_cache
        (brief_id, total_cost, llm_cost, api_cost, derivative_count, average_cost_per_derivative, last_updated)
        VALUES ($1, $2, $3, $4, $5, $6, NOW())
        ON CONFLICT (brief_id) DO UPDATE SET
          total_cost = $2,
          llm_cost = $3,
          api_cost = $4,
          derivative_count = $5,
          average_cost_per_derivative = $6,
          last_updated = NOW()`,
        [
          summary.brief_id,
          summary.total_cost,
          summary.llm_cost,
          summary.api_cost,
          summary.derivative_count,
          summary.average_cost_per_derivative,
        ]
      );
    } catch (error) {
      console.error('Failed to update cost summary:', error);
      // Don't throw - this is a background cache update
    }
  }

  /**
   * Export costs as CSV
   */
  async exportCostsAsCSV(briefId: number): Promise<string> {
    try {
      const costs = await this.getBriefCosts(briefId);

      const headers = [
        'Derivative ID',
        'Platform',
        'Total Cost (USD)',
        'LLM Cost',
        'API Cost',
        'Other Cost',
        'Tokens Used',
        'Created At',
      ].join(',');

      const rows = costs.map((cost) =>
        [
          cost.derivative_id,
          cost.platform,
          cost.total_cost.toFixed(6),
          cost.cost_breakdown.llm.toFixed(6),
          cost.cost_breakdown.api.toFixed(6),
          cost.cost_breakdown.other.toFixed(6),
          cost.tokens_used,
          cost.created_at,
        ].join(',')
      );

      return [headers, ...rows].join('\n');
    } catch (error) {
      console.error('Failed to export costs as CSV:', error);
      throw error;
    }
  }
}
