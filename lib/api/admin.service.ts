import { fetchClient } from './client';
import type {
  AdminUserResponseDto,
  AdminStatsResponseDto,
} from '@/types/api';

export const AdminService = {
  getUsers: () => {
    return fetchClient<AdminUserResponseDto[]>('/api/v1/admin/users', {
      method: 'GET',
    });
  },

  getUserById: (id: number) => {
    return fetchClient<AdminUserResponseDto>('/api/v1/admin/users/' + id, {
      method: 'GET',
    });
  },

  getStats: () => {
    return fetchClient<AdminStatsResponseDto>('/api/v1/admin/stats', {
      method: 'GET',
    });
  },
};