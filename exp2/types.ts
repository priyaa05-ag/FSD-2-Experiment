export type PlatformType = 'twitter' | 'linkedin' | 'instagram' | 'facebook' | 'youtube';

export type PostStatus = 'draft' | 'scheduled' | 'published' | 'failed';

export interface Post {
  id: string;
  title: string;
  content: string;
  platform: PlatformType;
  status: PostStatus;
  scheduledDate: string; // ISO string YYYY-MM-DD
  scheduledTime: string; // HH:mm
  tags: string[];
  likesCount: number;
  sharesCount: number;
  commentsCount: number;
  viewsCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface PlatformConfig {
  id: PlatformType;
  name: string;
  icon: string;
  connected: boolean;
  maxCharacterLimit: number;
  color: string;
  totalFollowers: number;
  monthlyGrowthRate: number;
  avgEngagementRate: number;
}

export type TabType = 
  | 'content' 
  | 'calendar' 
  | 'analytics' 
  | 'inspector' 
  | 'async' 
  | 'selectors' 
  | 'profiler' 
  | 'assignments' 
  | 'vscode';

export interface ActionLogItem {
  id: string;
  timestamp: string;
  actionType: string;
  payload: any;
  durationMs?: number;
}

export interface RecomputationMetric {
  selectorName: string;
  computationCount: number;
  cacheHits: number;
  lastRunTimeMs: number;
}

export interface AssignmentTask {
  id: string;
  title: string;
  description: string;
  points: number;
  passed: boolean;
  verificationDetails?: string;
}

export interface CodeFile {
  filename: string;
  path: string;
  language: string;
  description: string;
  content: string;
}
