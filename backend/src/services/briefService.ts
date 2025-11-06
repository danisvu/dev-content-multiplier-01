import { query } from '../database';
import { Brief, CreateBriefInput, UpdateBriefInput, GenerateBriefRequest, GeneratedBriefContent, Idea } from '../types';
import { LLMClient } from './LLMClient';
import Ajv from 'ajv';

const ajv = new Ajv();

const generatedBriefSchema = {
  type: 'object',
  properties: {
    title: { type: 'string', minLength: 1 },
    content_plan: { type: 'string', minLength: 1 },
    target_audience: { type: 'string', minLength: 1 },
    key_points: { 
      type: 'array',
      items: { type: 'string' },
      minItems: 3,
      maxItems: 10
    },
    tone: { type: 'string', minLength: 1 },
    word_count: { type: 'number', minimum: 100 },
    keywords: {
      type: 'array',
      items: { type: 'string' },
      minItems: 3
    }
  },
  required: ['title', 'content_plan', 'target_audience', 'key_points', 'tone', 'word_count', 'keywords'],
  additionalProperties: false
};

const validateGeneratedBrief = ajv.compile(generatedBriefSchema);

export class BriefService {
  private llmClient: LLMClient;

  constructor() {
    this.llmClient = new LLMClient();
  }
  // Get all briefs
  async getAllBriefs(): Promise<Brief[]> {
    const result = await query(`
      SELECT 
        b.*,
        i.title as idea_title
      FROM briefs b
      LEFT JOIN ideas i ON b.idea_id = i.id
      ORDER BY b.created_at DESC
    `);
    return result.rows;
  }

  // Get brief by ID
  async getBriefById(id: number): Promise<Brief | null> {
    const result = await query(`
      SELECT 
        b.*,
        i.title as idea_title,
        i.description as idea_description,
        i.rationale as idea_rationale,
        i.persona as idea_persona,
        i.industry as idea_industry,
        i.status as idea_status,
        i.created_at as idea_created_at
      FROM briefs b
      LEFT JOIN ideas i ON b.idea_id = i.id
      WHERE b.id = $1
    `, [id]);
    
    return result.rows[0] || null;
  }

  // Get briefs by idea ID
  async getBriefsByIdeaId(ideaId: number): Promise<Brief[]> {
    const result = await query(`
      SELECT * FROM briefs
      WHERE idea_id = $1
      ORDER BY created_at DESC
    `, [ideaId]);
    
    return result.rows;
  }

  // Create new brief
  async createBrief(briefData: CreateBriefInput): Promise<Brief> {
    const {
      idea_id,
      title,
      content_plan,
      target_audience,
      key_points,
      tone,
      word_count,
      keywords,
      reference_links,
      status = 'draft'
    } = briefData;

    const result = await query(`
      INSERT INTO briefs (
        idea_id, title, content_plan, target_audience, 
        key_points, tone, word_count, keywords, reference_links, status
      )
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING *
    `, [
      idea_id,
      title,
      content_plan,
      target_audience || null,
      key_points || null,
      tone || null,
      word_count || null,
      keywords || null,
      reference_links || null,
      status
    ]);

    return result.rows[0];
  }

  // Update brief
  async updateBrief(id: number, briefData: UpdateBriefInput): Promise<Brief | null> {
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 1;

    // Build dynamic UPDATE query
    if (briefData.title !== undefined) {
      updates.push(`title = $${paramCount++}`);
      values.push(briefData.title);
    }
    if (briefData.content_plan !== undefined) {
      updates.push(`content_plan = $${paramCount++}`);
      values.push(briefData.content_plan);
    }
    if (briefData.target_audience !== undefined) {
      updates.push(`target_audience = $${paramCount++}`);
      values.push(briefData.target_audience);
    }
    if (briefData.key_points !== undefined) {
      updates.push(`key_points = $${paramCount++}`);
      values.push(briefData.key_points);
    }
    if (briefData.tone !== undefined) {
      updates.push(`tone = $${paramCount++}`);
      values.push(briefData.tone);
    }
    if (briefData.word_count !== undefined) {
      updates.push(`word_count = $${paramCount++}`);
      values.push(briefData.word_count);
    }
    if (briefData.keywords !== undefined) {
      updates.push(`keywords = $${paramCount++}`);
      values.push(briefData.keywords);
    }
    if (briefData.reference_links !== undefined) {
      updates.push(`reference_links = $${paramCount++}`);
      values.push(briefData.reference_links);
    }
    if (briefData.status !== undefined) {
      updates.push(`status = $${paramCount++}`);
      values.push(briefData.status);
    }

    if (updates.length === 0) {
      return this.getBriefById(id);
    }

    values.push(id);
    
    const result = await query(`
      UPDATE briefs
      SET ${updates.join(', ')}
      WHERE id = $${paramCount}
      RETURNING *
    `, values);

    return result.rows[0] || null;
  }

  // Delete brief
  async deleteBrief(id: number): Promise<boolean> {
    const result = await query(
      'DELETE FROM briefs WHERE id = $1 RETURNING id',
      [id]
    );
    return result.rowCount > 0;
  }

  // Get briefs by status
  async getBriefsByStatus(status: string): Promise<Brief[]> {
    const result = await query(`
      SELECT 
        b.*,
        i.title as idea_title
      FROM briefs b
      LEFT JOIN ideas i ON b.idea_id = i.id
      WHERE b.status = $1
      ORDER BY b.created_at DESC
    `, [status]);
    
    return result.rows;
  }

  // Get brief statistics
  async getBriefStats(): Promise<any> {
    const result = await query(`
      SELECT 
        COUNT(*) as total_briefs,
        COUNT(CASE WHEN status = 'draft' THEN 1 END) as draft_count,
        COUNT(CASE WHEN status = 'review' THEN 1 END) as review_count,
        COUNT(CASE WHEN status = 'approved' THEN 1 END) as approved_count,
        COUNT(CASE WHEN status = 'published' THEN 1 END) as published_count
      FROM briefs
    `);
    
    return result.rows[0];
  }

  // Generate brief from idea using AI
  async generateBriefFromIdea(request: GenerateBriefRequest): Promise<Brief> {
    const { idea_id, model = 'gemini', temperature = 0.7, additional_context } = request;

    // 1. Get idea from database
    const ideaResult = await query('SELECT * FROM ideas WHERE id = $1', [idea_id]);
    const idea: Idea | null = ideaResult.rows[0] || null;

    if (!idea) {
      throw new Error(`Idea with ID ${idea_id} not found`);
    }

    // 2. Validate idea status - MUST be 'selected' to generate brief
    if (idea.status !== 'selected') {
      throw new Error(
        `Cannot generate brief: Idea status must be 'selected'. Current status: '${idea.status}'. ` +
        `Please update the idea status to 'selected' before generating a brief.`
      );
    }

    console.log(`✅ Idea status validated: ${idea.status}`);

    // 3. Create prompt for AI
    const prompt = this.createBriefPrompt(idea, additional_context);

    // 4. Call AI to generate brief
    console.log(`Generating brief for idea "${idea.title}" using ${model}...`);
    const aiResponse = await this.llmClient.generateCompletion(prompt, model, temperature);

    // 5. Parse AI response
    let briefContent: GeneratedBriefContent;
    try {
      // Extract JSON from response
      const jsonMatch = aiResponse.content.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('Could not extract JSON from AI response');
      }
      
      briefContent = JSON.parse(jsonMatch[0]);

      // Validate structure
      if (!validateGeneratedBrief(briefContent)) {
        console.error('Validation errors:', validateGeneratedBrief.errors);
        throw new Error('AI response does not match expected brief structure');
      }

    } catch (parseError) {
      console.error('Error parsing AI response:', parseError);
      console.error('Raw response:', aiResponse.content);
      throw new Error('Failed to parse AI-generated brief. Please try again.');
    }

    // 6. Save to database
    const createdBrief = await this.createBrief({
      idea_id,
      title: briefContent.title,
      content_plan: briefContent.content_plan,
      target_audience: briefContent.target_audience,
      key_points: briefContent.key_points,
      tone: briefContent.tone,
      word_count: briefContent.word_count,
      keywords: briefContent.keywords,
      status: 'draft'
    });

    console.log(`✅ Successfully generated brief ID: ${createdBrief.id}`);
    return createdBrief;
  }

  // Create prompt for brief generation
  private createBriefPrompt(idea: Idea, additionalContext?: string): string {
    const contextSection = additionalContext 
      ? `\n\nAdditional Context:\n${additionalContext}`
      : '';

    return `You are an expert content strategist. Based on the following content idea, create a detailed content brief.

CONTENT IDEA:
Title: ${idea.title}
Description: ${idea.description || 'N/A'}
Rationale: ${idea.rationale || 'N/A'}
Target Persona: ${idea.persona || 'General audience'}
Industry: ${idea.industry || 'General'}${contextSection}

TASK:
Create a comprehensive content brief with the following structure. Return ONLY a valid JSON object with these exact fields:

{
  "title": "A clear, engaging title for the content piece (max 100 characters)",
  "content_plan": "A detailed 3-5 paragraph plan describing: 1) Opening hook and introduction approach, 2) Main body structure with key sections, 3) Examples and case studies to include, 4) Call-to-action and conclusion strategy. Be specific and actionable.",
  "target_audience": "Detailed description of the target audience including: demographics, psychographics, pain points, and what they hope to achieve by reading this content (2-3 sentences)",
  "key_points": ["Main point 1 to cover", "Main point 2 to cover", "Main point 3 to cover", "...up to 7 key points"],
  "tone": "The writing tone (e.g., professional, conversational, authoritative, friendly, technical, casual)",
  "word_count": 1500,
  "keywords": ["keyword1", "keyword2", "keyword3", "...5-10 SEO keywords relevant to the content"]
}

IMPORTANT:
- Return ONLY the JSON object, no additional text or markdown
- Ensure all fields are present and properly formatted
- key_points must have 3-10 items
- keywords must have 5-10 items
- word_count should be between 500-3000 based on content complexity
- content_plan should be detailed and specific (minimum 200 words)

Generate the brief now:`;
  }
}

