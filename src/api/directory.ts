import apiClient from './client';
import type { DirectoryEntry, DirectoryType } from '../types/directory';

export const getDirectory = async (type?: DirectoryType): Promise<DirectoryEntry[]> => {
  const params = type ? { type } : {};
  const response = await apiClient.get<DirectoryEntry[]>('/directory', { params });
  return response.data;
};

export const createDirectoryEntry = async (data: Partial<DirectoryEntry>): Promise<DirectoryEntry> => {
  const response = await apiClient.post<DirectoryEntry>('/directory', data);
  return response.data;
};

export const updateDirectoryEntry = async (id: number, data: Partial<DirectoryEntry>): Promise<DirectoryEntry> => {
  const response = await apiClient.put<DirectoryEntry>(`/directory/${id}`, data);
  return response.data;
};

export const deleteDirectoryEntry = async (id: number): Promise<void> => {
  await apiClient.delete(`/directory/${id}`);
};