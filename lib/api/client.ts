import { useAuthStore } from '@/store/auth-store';

export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: unknown) => void;
}> = [];

const processQueue = (error: unknown, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (token) resolve(token);
    else reject(error);
  });
  failedQueue = [];
};

export async function fetchClient<T>(
  endpoint: string,
  options: RequestInit = {},
  isRetry = false
): Promise<T> {
  const accessToken =
    typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;

  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');

  if (accessToken) {
    headers.set('Authorization', 'Bearer ' + accessToken);
  }

  const response = await fetch(API_BASE_URL + endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    if (response.status === 401 && !isRetry && typeof window !== 'undefined') {
      if (isRefreshing) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          
          const newHeaders = new Headers(options.headers);
          newHeaders.set('Content-Type', 'application/json');
          newHeaders.set('Authorization', 'Bearer ' + token);
          
          return fetchClient<T>(endpoint, { ...options, headers: newHeaders }, true);
        } catch (err) {
          throw err;
        }
      }

      isRefreshing = true;
      const refreshToken = useAuthStore.getState().getRefreshToken();

      if (!refreshToken) {
        useAuthStore.getState().logout();
        window.dispatchEvent(new Event('unauthorized'));
        throw new ApiError(401, 'Unauthorized');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (!refreshResponse.ok) {
          throw new Error('Refresh token expired or invalid');
        }

        const data = await refreshResponse.json();
        const newRefreshToken = typeof data.refreshToken === 'object' && data.refreshToken !== null 
          ? data.refreshToken.refreshTokenHash 
          : data.refreshToken;

        useAuthStore.getState().setAuth(data.accessToken, newRefreshToken, data.email);
        processQueue(null, data.accessToken);

        const newHeaders = new Headers(options.headers);
        newHeaders.set('Content-Type', 'application/json');
        newHeaders.set('Authorization', 'Bearer ' + data.accessToken);
        
        return fetchClient<T>(endpoint, { ...options, headers: newHeaders }, true);
      } catch (refreshError) {
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.dispatchEvent(new Event('unauthorized'));
        throw new ApiError(401, 'Unauthorized');
      } finally {
        isRefreshing = false;
      }
    }

    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      // Ignore JSON parse error, fallback to statusText
    }

    throw new ApiError(response.status, errorMessage);
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}
