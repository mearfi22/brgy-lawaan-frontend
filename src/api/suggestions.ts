import apiClient from './client';
import type { Suggestion, SuggestionSubmission, SuggestionStatus } from '../types/suggestion';
import type { PaginatedResponse } from '../types/announcement';

export const submitSuggestion = async (data: SuggestionSubmission): Promise<Suggestion> => {
  const response = await apiClient.post<Suggestion>('/suggestions', data);
  return response.data;
};

export const getSuggestions = async (status?: SuggestionStatus): Promise<PaginatedResponse<Suggestion>> => {
  const params = status ? { status } : {};
  const response = await apiClient.get<PaginatedResponse<Suggestion>>('/suggestions', { params });
  return response.data;
};

export const updateSuggestion = async (
  id: number,
  data: Partial<Pick<Suggestion, 'status' | 'admin_notes'>>
): Promise<Suggestion> => {
  const response = await apiClient.put<Suggestion>(`/suggestions/${id}`, data);
  return response.data;
};