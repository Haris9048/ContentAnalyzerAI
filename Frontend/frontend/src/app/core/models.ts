export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
  user: User;
}

export interface Metrics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  followers_gained: number;
}

export interface Video {
  id: string;
  title: string;
  notes: string;
  filename: string;
  original_filename: string;
  file_size: number;
  metrics: Metrics;
  engagement_rate: number;
  created_at: string;
}

export interface Summary {
  videos: number;
  views: number;
  likes: number;
  comments: number;
  shares: number;
  saves: number;
  reach: number;
  followers_gained: number;
  engagement_rate: number;
}

export interface AnalysisResult {
  overall_score: number;
  performance_summary: string;
  what_worked: string[];
  what_didnt_work: string[];
  audience_insights: string[];
  improvements: string[];
  hook_analysis: string;
  content_strategy: string;
  next_steps: string[];
}

export interface HistoryItem {
  id: string;
  type: string;
  video_id?: string;
  video_title?: string;
  topic?: string;
  result: any;
  created_at: string;
}