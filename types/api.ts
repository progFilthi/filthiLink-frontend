export interface CreateLinkRequestDto {
  originalUrl: string;
}

export interface LinkResponseDto {
  id: number;
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
  expiresAt: string;
}

export interface PageLinkResponseDto {
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  numberOfElements: number;
  size: number;
  content: LinkResponseDto[];
  number: number;
  empty: boolean;
}

export interface CreateApiKeyRequestDto {
  name: string;
}

export interface ApiKeyResponseDto {
  id: number;
  name: string;
  keyPrefix: string;
  rawKey: string;
  createdAt: string;
}

export interface RegisterRequestDto {
  email: string;
  password: string;
}

export interface AuthResponseDto {
  token: string;
  email: string;
}

export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface ApiKeyListItemDto {
  id: number;
  name: string;
  keyPrefix: string;
  lastUsedAt: string;
  createdAt: string;
}
