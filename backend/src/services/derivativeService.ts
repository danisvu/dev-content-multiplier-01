import { query } from '../database';
import { LLMClient } from './LLMClient';
import { eventLogService } from './eventLogService';
import Ajv from 'ajv';

const ajv = new Ajv();

export interface CreateDerivativeInput {
  briefId: number;
  platform: string;
  content: string;
}

export interface UpdateDerivativeInput {
  content?: string;
  status?: string;
}

export interface Derivative {
  id: number;
  brief_id: number;
  platform: string;
  content: string;
  character_count: number;
  status: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface GenerateDerivativesRequest {
  briefId: number;
  platforms: string[];
  model?: 'gemini' | 'deepseek';
  temperature?: number;
}

export interface PublishDerivativeInput {
  id: number;
  userId?: string;
}

const derivativeSchema = {
  type: 'object',
  properties: {
    twitter: { type: 'string' },
    linkedin: { type: 'string' },
    facebook: { type: 'string' },
    instagram: { type: 'string' },
    tiktok: { type: 'string' }
  },
  minProperties: 1
};

const validateDerivatives = ajv.compile(derivativeSchema);

export class DerivativeService {
  private llmClient: LLMClient;

  constructor() {
    this.llmClient = new LLMClient();
  }

  async createDerivative(input: CreateDerivativeInput): Promise<Derivative> {
    const { briefId, platform, content } = input;
    const characterCount = content.length;

    const result = await query(
      `INSERT INTO derivatives (brief_id, platform, content, character_count)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (brief_id, platform) DO UPDATE
       SET content = $3, character_count = $4, updated_at = CURRENT_TIMESTAMP
       RETURNING *`,
      [briefId, platform, content, characterCount]
    );

    return result.rows[0] as Derivative;
  }

  async getDerivative(id: number): Promise<Derivative | null> {
    const result = await query(
      `SELECT * FROM derivatives WHERE id = $1`,
      [id]
    );

    return result.rows[0] || null;
  }

  async getDerivativesByBrief(briefId: number): Promise<Derivative[]> {
    const result = await query(
      `SELECT * FROM derivatives
       WHERE brief_id = $1
       ORDER BY platform ASC`,
      [briefId]
    );

    return result.rows as Derivative[];
  }

  async generateDerivatives(request: GenerateDerivativesRequest): Promise<Derivative[]> {
    const { briefId, platforms, model = 'gemini', temperature = 0.7 } = request;

    // Get brief content
    const briefResult = await query(
      `SELECT b.*, i.title as idea_title FROM briefs b
       JOIN ideas i ON b.idea_id = i.id
       WHERE b.id = $1`,
      [briefId]
    );

    if (briefResult.rows.length === 0) {
      throw new Error(`Brief with ID ${briefId} not found`);
    }

    const brief = briefResult.rows[0];

    // Create platform-specific prompts
    const prompt = `You are an expert content strategist. Adapt this brief into concise, platform-optimized content.

Brief Title: ${brief.title}
Brief Content: ${brief.content_plan}
Target Audience: ${brief.target_audience || 'General'}
Tone: ${brief.tone || 'Professional'}
Keywords: ${brief.keywords?.join(', ') || 'None'}

Generate content for these platforms: ${platforms.join(', ')}

Platform Guidelines:
- twitter: Max 280 characters, casual and engaging
- linkedin: Max 3000 characters, professional and insightful
- facebook: Max 63206 characters, conversational and community-focused
- instagram: Max 2200 characters, visual storytelling with emojis
- tiktok: Max 2200 characters, trendy, energetic, relatable

Return ONLY a valid JSON object with platform keys and content values. Example:
{
  "twitter": "content here",
  "linkedin": "content here"
}

Important: Return ONLY the JSON object, no explanation or markdown formatting.`;

    try {
      const response = await this.llmClient.generateContent(prompt, model, temperature);

      // Extract JSON from response
      const jsonMatch = response.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No JSON found in response');
      }

      const parsed = JSON.parse(jsonMatch[0]);

      if (!validateDerivatives(parsed)) {
        throw new Error('Invalid derivatives format');
      }

      const derivatives: Derivative[] = [];

      for (const [platform, content] of Object.entries(parsed)) {
        if (platforms.includes(platform)) {
          const derivative = await this.createDerivative({
            briefId,
            platform,
            content: content as string
          });
          derivatives.push(derivative);
        }
      }

      return derivatives;
    } catch (error) {
      console.error('Error generating derivatives:', error);
      throw error;
    }
  }

  async updateDerivative(id: number, input: UpdateDerivativeInput): Promise<Derivative> {
    const { content, status } = input;
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    if (content !== undefined) {
      updates.push(`content = $${paramCount}`);
      values.push(content);
      paramCount++;

      updates.push(`character_count = $${paramCount}`);
      values.push(content.length);
      paramCount++;
    }

    if (status !== undefined) {
      updates.push(`status = $${paramCount}`);
      values.push(status);
      paramCount++;
    }

    if (updates.length === 0) {
      const result = await query(`SELECT * FROM derivatives WHERE id = $1`, [id]);
      return result.rows[0] as Derivative;
    }

    updates.push('updated_at = CURRENT_TIMESTAMP');
    values.push(id);

    const result = await query(
      `UPDATE derivatives SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING *`,
      values
    );

    return result.rows[0] as Derivative;
  }

  async publishDerivative(id: number, userId?: string): Promise<Derivative> {
    const derivative = await this.updateDerivative(id, {
      status: 'published',
    });

    // Get updated derivative with published_at
    const result = await query(
      `UPDATE derivatives SET published_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING *`,
      [id]
    );

    const published = result.rows[0];

    // Log the event
    await eventLogService.logEvent({
      eventType: 'derivative.published',
      entityType: 'derivative',
      entityId: id,
      userId: userId || 'system',
      metadata: {
        platform: published.platform,
        briefId: published.brief_id,
        characterCount: published.character_count
      },
      status: 'success'
    });

    return published as Derivative;
  }

  async publishDerivatives(ids: number[], userId?: string): Promise<{ published: Derivative[], failed: number[] }> {
    const published: Derivative[] = [];
    const failed: number[] = [];

    for (const id of ids) {
      try {
        const derivative = await this.publishDerivative(id, userId);
        published.push(derivative);
      } catch (error) {
        failed.push(id);
        console.error(`Failed to publish derivative ${id}:`, error);

        // Log failed event
        await eventLogService.logEvent({
          eventType: 'derivative.published',
          entityType: 'derivative',
          entityId: id,
          userId: userId || 'system',
          status: 'failed',
          errorMessage: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    return { published, failed };
  }

  async deleteDerivative(id: number): Promise<boolean> {
    const result = await query(`DELETE FROM derivatives WHERE id = $1`, [id]);
    return result.rowCount > 0;
  }

  async getDerivativeStats(): Promise<Record<string, any>> {
    const result = await query(
      `SELECT
        platform,
        status,
        COUNT(*) as count,
        AVG(character_count) as avg_characters
       FROM derivatives
       GROUP BY platform, status
       ORDER BY platform, status`
    );

    return result.rows;
  }
}

export const derivativeService = new DerivativeService();
