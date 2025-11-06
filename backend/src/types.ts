// Type definitions for the application

// ===== Idea Types =====
export interface Idea {
  id: number;
  title: string;
  description?: string;
  rationale?: string;
  persona?: string;
  industry?: string;
  status: string;
  created_at: string;
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

// ===== Brief Types =====

export interface Brief {
  id: number;
  idea_id: number;
  title: string;
  content_plan: string;
  target_audience?: string;
  key_points?: string[];
  tone?: string;
  word_count?: number;
  keywords?: string[];
  reference_links?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface CreateBriefInput {
  idea_id: number;
  title: string;
  content_plan: string;
  target_audience?: string;
  key_points?: string[];
  tone?: string;
  word_count?: number;
  keywords?: string[];
  reference_links?: string;
  status?: string;
}

export interface UpdateBriefInput {
  title?: string;
  content_plan?: string;
  target_audience?: string;
  key_points?: string[];
  tone?: string;
  word_count?: number;
  keywords?: string[];
  reference_links?: string;
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

export interface GenerateBriefRequest {
  idea_id: number;
  model?: 'gemini' | 'deepseek';
  temperature?: number;
  additional_context?: string;
}

export interface GeneratedBriefContent {
  title: string;
  content_plan: string;
  target_audience: string;
  key_points: string[];
  tone: string;
  word_count: number;
  keywords: string[];
}
