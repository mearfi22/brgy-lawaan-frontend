import apiClient from './client';
import type { Announcement, AnnouncementCategory, PaginatedResponse } from '../types/announcement';

export const getAnnouncements = async (
  category?: AnnouncementCategory
): Promise<PaginatedResponse<Announcement>> => {
  const params = category ? { category } : {};
  const response = await apiClient.get<PaginatedResponse<Announcement>>('/announcements', {
    params,
  });
  return response.data;
};

export const getCalendarAnnouncements = async (): Promise<Announcement[]> => {
  const response = await apiClient.get<Announcement[]>('/announcements/calendar');
  return response.data;
};

export const getAnnouncement = async (id: number): Promise<Announcement> => {
  const response = await apiClient.get<Announcement>(`/announcements/${id}`);
  return response.data;
};

export const createAnnouncement = async (
  data: Partial<Announcement>
): Promise<Announcement> => {
  const response = await apiClient.post<Announcement>('/announcements', data);
  return response.data;
};

export const updateAnnouncement = async (
  id: number,
  data: Partial<Announcement>
): Promise<Announcement> => {
  const response = await apiClient.put<Announcement>(`/announcements/${id}`, data);
  return response.data;
};

export const deleteAnnouncement = async (id: number): Promise<void> => {
  await apiClient.delete(`/announcements/${id}`);
};