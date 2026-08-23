export type SuggestionCategory = 'housing' | 'sanitation' | 'fire_hazard' | 'health_concern' | 'general';
export type SuggestionStatus = 'new' | 'in_progress' | 'resolved';

export interface Suggestion {
  id: number;
  category: SuggestionCategory;
  message: string;
  submitter_name: string;
  submitter_phone: string;
  status: SuggestionStatus;
  admin_notes: string | null;
  resolved_at: string | null;
  created_at: string;
}

export interface SuggestionSubmission {
  category: SuggestionCategory;
  message: string;
  submitter_name: string;
  submitter_phone: string;
}