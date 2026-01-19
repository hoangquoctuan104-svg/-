export type NavigationTab = 'intel' | 'chat' | 'diagnosis';

export interface IntelItem {
  id: string;
  title: string;
  summary: string;
  date: string;
  link: string;
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isError?: boolean;
}

export interface DiagnosisResult {
  hasViolation: boolean;
  message: string;
  details?: string[];
}
