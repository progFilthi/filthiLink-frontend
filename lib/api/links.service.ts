import { fetchClient } from './client';
import type { 
  CreateLinkRequestDto, 
  LinkResponseDto,
  PagedModelLinkResponseDto
} from '@/types/api';

export const LinksService = {
  createLink: (data: CreateLinkRequestDto) => {
    return fetchClient<LinkResponseDto>('/api/v1/links/shorten', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },
  
  getLinks: (page = 0, size = 100) => {
    return fetchClient<PagedModelLinkResponseDto>('/api/v1/links?page=' + page + '&size=' + size, {
      method: 'GET',
    });
  }
};
