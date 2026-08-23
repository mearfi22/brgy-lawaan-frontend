import apiClient from './client';
import type { LoginCredentials, LoginResponse } from '../types/auth';

export const login = async (credentials: LoginCredentials): Promise<LoginResponse> => {
  const response = await apiClient.post<LoginResponse>('/login', credentials);
  return response.data;
};

export const logout = async (): Promise<void> => {
  await apiClient.post('/logout');
};