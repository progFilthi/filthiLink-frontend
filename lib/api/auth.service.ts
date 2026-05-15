import { fetchClient } from './client';
import type { 
  RegisterRequestDto, 
  AuthResponseDto, 
  LoginRequestDto,
  RefreshRequestDto
} from '@/types/api';

export const AuthService = {
  register: (data: RegisterRequestDto) => {
    return fetchClient<AuthResponseDto>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  login: (data: LoginRequestDto) => {
    return fetchClient<AuthResponseDto>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  refresh: (data: RefreshRequestDto) => {
    return fetchClient<AuthResponseDto>('/api/v1/auth/refresh', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  logout: () => {
    return fetchClient<void>('/api/v1/auth/logout', {
      method: 'POST',
    });
  },
};
