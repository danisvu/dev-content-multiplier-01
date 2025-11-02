export interface Idea {
  id: number;
  title: string;
  description?: string;
  rationale?: string;
  persona?: string;
  industry?: string;
  status: string;
  created_at: Date;
}

export interface CreateIdeaInput {
  title: string;
  description?: string;
  rationale?: string;
  persona?: string;
  industry?: string;
  status?: string;
}

export interface UpdateIdeaInput {
  title?: string;
  description?: string;
  rationale?: string;
  persona?: string;
  industry?: string;
  status?: string;
}

export interface GenerateIdeasRequest {
  persona: string;
  industry: string;
  model?: 'gemini' | 'deepseek';
  temperature?: number;
}

export interface GeneratedIdea {
  title: string;
  description: string;
  rationale: string;
}

export interface GenerateIdeasResponse {
  success: boolean;
  ideas?: GeneratedIdea[];
  error?: string;
}
