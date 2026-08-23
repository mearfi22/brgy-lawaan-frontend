import apiClient from './client';
import type { Resident, ResidentRegistration } from '../types/resident';
import type { PaginatedResponse } from '../types/announcement';

export const registerResident = async (
  data: ResidentRegistration
): Promise<Resident> => {
  const response = await apiClient.post<Resident>('/residents/register', data);
  return response.data;
};

export const getResidents = async (): Promise<PaginatedResponse<Resident>> => {
  const response = await apiClient.get<PaginatedResponse<Resident>>('/residents');
  return response.data;
};

export const deleteResident = async (id: number): Promise<void> => {
  await apiClient.delete(`/residents/${id}`);
};