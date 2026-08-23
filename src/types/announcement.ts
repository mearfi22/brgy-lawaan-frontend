export type AnnouncementCategory =
  | 'vaccines'
  | 'medicines'
  | 'maternal_child'
  | 'senior_citizen'
  | 'general_advisory';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  category: AnnouncementCategory;
  event_date: string | null;
  event_time_start: string | null;
  event_time_end: string | null;
  location: string | null;
  is_urgent: boolean;
  created_by: number;
  created_at: string;
  updated_at: string;
  creator?: {
    id: number;
    name: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}