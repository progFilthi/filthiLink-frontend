import { fetchClient } from './client';
import type {
  ApiKeyListItemDto,
  CreateApiKeyRequestDto,
  ApiKeyResponseDto,
} from '@/types/api';

export const ApiKeysService = {
  getKeys: () => {
    return fetchClient<ApiKeyListItemDto[]>('/api/v1/keys', {
      method: 'GET',
    });
  },

  createKey: (data: CreateApiKeyRequestDto) => {
    return fetchClient<ApiKeyResponseDto>('/api/v1/keys', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  deleteKey: (id: number) => {
    return fetchClient<void>('/api/v1/keys/' + id, {
      method: 'DELETE',
    });
  },
};
