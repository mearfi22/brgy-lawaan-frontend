export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'bhw';
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface LoginResponse {
  user: User;
  token: string;
}