import { query } from '../database';
import { Idea, CreateIdeaInput, UpdateIdeaInput, GenerateIdeasRequest, GeneratedIdea } from '../types';
import { LLMClient } from './LLMClient';
import Ajv from 'ajv';

const ajv = new Ajv();

const generatedIdeaSchema = {
  type: 'array',
  items: {
    type: 'object',
    properties: {
      title: { type: 'string', minLength: 1 },
      description: { type: 'string', minLength: 1 },
      rationale: { type: 'string', minLength: 1 }
    },
    required: ['title', 'description', 'rationale'],
    additionalProperties: false
  },
  minItems: 10,
  maxItems: 10
};

const validateGeneratedIdeas = ajv.compile(generatedIdeaSchema);

export class IdeaService {
  private llmClient: LLMClient;

  constructor() {
    this.llmClient = new LLMClient();
  }

  async generateIdeas(request: GenerateIdeasRequest): Promise<GeneratedIdea[]> {
    const { persona, industry, model = 'gemini', temperature = 0.7 } = request;
    
    const prompt = `Generate 10 content ideas for a ${persona} in ${industry}. Format as JSON array with fields: title, description, rationale.

Requirements:
- Title: Catchy and specific (max 100 characters)
- Description: Detailed explanation of the content idea (max 300 characters)
- Rationale: Why this idea would work for the target audience (max 200 characters)
- All ideas should be practical and actionable
- Ideas should be diverse and cover different content types

Example format:
[
  {
    "title": "5 Common Mistakes Every ${persona} Makes",
    "description": "A detailed guide covering the most frequent errors and how to avoid them",
    "rationale": "Educational content that helps the audience improve their skills"
  }
]

Please generate exactly 10 ideas and return ONLY the JSON array:`;

    let lastError: Error | null = null;
    const maxRetries = 3;
    
    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const delay = Math.pow(2, attempt) * 1000; // Exponential backoff: 1s, 2s, 4s
        if (attempt > 0) {
          await this.sleep(delay);
        }

        const response = await this.llmClient.generateCompletion(prompt, model, temperature);
        
        console.log('LLM Response length:', response.content.length);
        console.log('LLM Response:', response.content);
        
        // Clean the response to extract JSON
        const jsonContent = this.extractJsonFromResponse(response.content);
        
        console.log('Extracted JSON:', jsonContent);
        
        let parsedIdeas: GeneratedIdea[];
        try {
          parsedIdeas = JSON.parse(jsonContent);
          console.log('Parsed successfully:', parsedIdeas.length, 'ideas');
        } catch (parseError) {
          console.error('JSON Parse Error:', parseError);
          throw new Error(`Failed to parse JSON: ${parseError instanceof Error ? parseError.message : 'Unknown error'}`);
        }

        // Validate the structure
        if (!validateGeneratedIdeas(parsedIdeas)) {
          const errors = validateGeneratedIdeas.errors || [];
          throw new Error(`Invalid JSON structure: ${JSON.stringify(errors)}`);
        }

        // Save to database
        await this.saveGeneratedIdeas(parsedIdeas, persona, industry);
        
        return parsedIdeas;
        
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        console.error(`Attempt ${attempt + 1} failed:`, lastError.message);
        
        if (attempt === maxRetries - 1) {
          throw lastError;
        }
      }
    }
    
    throw lastError || new Error('Failed to generate ideas after all retries');
  }

  private extractJsonFromResponse(content: string): string {
    console.log('Raw response length:', content.length);
    console.log('Raw response preview:', content.substring(0, 200));
    
    // Remove markdown code blocks more carefully
    let cleaned = content;
    
    // Remove ```json at the start
    if (cleaned.startsWith('```json')) {
      cleaned = cleaned.substring(7);
    }
    
    // Remove ``` at the end
    if (cleaned.endsWith('```')) {
      cleaned = cleaned.substring(0, cleaned.length - 3);
    }
    
    // Remove any remaining ``` patterns
    cleaned = cleaned.replace(/```/g, '').trim();
    
    console.log('Cleaned content preview:', cleaned.substring(0, 200));
    
    // Find JSON array boundaries
    const startIndex = cleaned.indexOf('[');
    const endIndex = cleaned.lastIndexOf(']');
    
    if (startIndex === -1 || endIndex === -1 || endIndex <= startIndex) {
      console.error('No JSON array found. Cleaned content:', cleaned);
      throw new Error('No valid JSON array found in response');
    }
    
    const jsonContent = cleaned.substring(startIndex, endIndex + 1);
    console.log('Extracted JSON length:', jsonContent.length);
    
    return jsonContent;
  }

  private async saveGeneratedIdeas(ideas: GeneratedIdea[], persona: string, industry: string): Promise<void> {
    for (const idea of ideas) {
      await this.createIdea({
        title: idea.title,
        description: idea.description,
        rationale: idea.rationale,
        persona,
        industry,
        status: 'generated'
      });
    }
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getAllIdeas(): Promise<Idea[]> {
    const result = await query(
      'SELECT * FROM ideas ORDER BY created_at DESC'
    );
    return result.rows;
  }

  async getIdeaById(id: number): Promise<Idea | null> {
    const result = await query('SELECT * FROM ideas WHERE id = $1', [id]);
    return result.rows[0] || null;
  }

  async createIdea(data: CreateIdeaInput): Promise<Idea> {
    const { title, description, rationale, persona, industry, status = 'pending' } = data;
    const result = await query(
      `INSERT INTO ideas (title, description, rationale, persona, industry, status) 
       VALUES ($1, $2, $3, $4, $5, $6) 
       RETURNING *`,
      [title, description, rationale, persona, industry, status]
    );
    return result.rows[0];
  }

  async updateIdea(id: number, data: UpdateIdeaInput): Promise<Idea | null> {
    const fields: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined) {
        fields.push(`${key} = $${paramIndex}`);
        values.push(value);
        paramIndex++;
      }
    });

    if (fields.length === 0) {
      return this.getIdeaById(id);
    }

    values.push(id);
    const result = await query(
      `UPDATE ideas SET ${fields.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result.rows[0] || null;
  }

  async deleteIdea(id: number): Promise<boolean> {
    const result = await query('DELETE FROM ideas WHERE id = $1', [id]);
    return result.rowCount > 0;
  }
}

export const ideaService = new IdeaService();
