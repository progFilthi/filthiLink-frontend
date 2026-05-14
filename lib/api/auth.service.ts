import { fetchClient } from './client';
import type { 
  RegisterRequestDto, 
  AuthResponseDto, 
  LoginRequestDto 
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
};
