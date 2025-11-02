import { GoogleGenerativeAI } from '@google/generative-ai';
import { OpenAI } from 'openai';

export interface LLMResponse {
  content: string;
  model: string;
}

export class LLMClient {
  private geminiClient: GoogleGenerativeAI;
  private openaiClient: OpenAI;

  constructor() {
    if (!process.env.GEMINI_API_KEY) {
      throw new Error('GEMINI_API_KEY environment variable is required');
    }
    if (!process.env.DEEPSEEK_API_KEY) {
      throw new Error('DEEPSEEK_API_KEY environment variable is required');
    }

    this.geminiClient = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    this.openaiClient = new OpenAI({
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseURL: 'https://api.deepseek.com/v1'
    });
  }

  async generateCompletion(
    prompt: string,
    model: 'gemini' | 'deepseek',
    temperature: number = 0.7
  ): Promise<LLMResponse> {
    try {
      if (model === 'gemini') {
        return await this.generateGeminiCompletion(prompt, temperature);
      } else if (model === 'deepseek') {
        return await this.generateDeepseekCompletion(prompt, temperature);
      } else {
        throw new Error(`Unsupported model: ${model}`);
      }
    } catch (error) {
      console.error(`Error generating completion with ${model}:`, error);
      throw error;
    }
  }

  private async generateGeminiCompletion(
    prompt: string,
    temperature: number
  ): Promise<LLMResponse> {
    const model = this.geminiClient.getGenerativeModel({
      model: 'gemini-2.0-flash',
      generationConfig: {
        temperature,
        maxOutputTokens: 2048,
      }
    });

    const result = await model.generateContent(prompt);
    const response = result.response;
    const content = response.text();

    return {
      content,
      model: 'gemini-2.0-flash'
    };
  }

  private async generateDeepseekCompletion(
    prompt: string,
    temperature: number
  ): Promise<LLMResponse> {
    const completion = await this.openaiClient.chat.completions.create({
      model: 'deepseek-chat',
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content || '';
    
    return {
      content,
      model: 'deepseek-chat'
    };
  }
}
