export interface CreateLinkRequestDto {
  originalUrl: string;
}

export interface LinkResponseDto {
  id: number;
  shortUrl: string;
  originalUrl: string;
  clickCount: number;
  expiresAt: string | null;
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
  password?: string;
}

export interface GrantedAuthority {
  authority: string;
}

export interface User {
  id: number;
  email: string;
  password?: string;
  createdAt: string;
  username: string;
  authorities: GrantedAuthority[];
  accountNonExpired: boolean;
  credentialsNonExpired: boolean;
  accountNonLocked: boolean;
  enabled: boolean;
}

export interface RefreshToken {
  id: number;
  user: User;
  refreshTokenHash: string;
  expiresAt: string;
  createdAt: string;
  revoked: boolean;
}

export interface AuthResponseDto {
  accessToken: string;
  refreshToken: string;
  email: string;
}

export interface GoogleAuthRequestDto {
  idToken: string;
}

export interface RefreshRequestDto {
  refreshToken: string;
}

export interface LoginRequestDto {
  email: string;
  password?: string;
}

export interface Pageable {
  page?: number;
  size?: number;
  sort?: string[];
}

export interface PageMetadata {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

export interface PagedModelLinkResponseDto {
  content: LinkResponseDto[];
  page: PageMetadata;
}

export interface ApiKeyListItemDto {
  id: number;
  name: string;
  keyPrefix: string;
  lastUsedAt: string | null;
  createdAt: string;
}

export interface CheckoutRequest {
  billingCycle: 'MONTHLY' | 'YEARLY';
}

export interface CheckoutResponse {
  checkoutUrl: string;
  sessionId: string;
}

export interface SubscriptionResponseDto {
  plan: 'FREE' | 'PREMIUM';
  status: 'ACTIVE' | 'CANCELLED' | 'ON_HOLD' | 'FAILED' | 'EXPIRED';
  currentPeriodEnd: string | null;
  isPremium: boolean;
}

