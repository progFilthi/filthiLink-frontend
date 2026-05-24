import { useAuthStore } from '@/store/auth-store';
import { config } from '@/lib/config';

export const API_BASE_URL = config.api.baseUrl;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = 'ApiError';
    // Restore prototype chain
    Object.setPrototypeOf(this, ApiError.prototype);
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
  const store = useAuthStore.getState();
  const accessToken = store.accessToken;

  const headers = new Headers(options.headers);
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  // If we have a token and it's not already set (e.g. by a retry), set it
  if (accessToken && !headers.has('Authorization')) {
    headers.set('Authorization', `Bearer ${accessToken}`);
  }

  const response = await fetch(API_BASE_URL + endpoint, {
    ...options,
    headers,
  });

  if (!response.ok) {
    // Check for unauthorized/forbidden to trigger refresh
    if ((response.status === 401 || response.status === 403) && !isRetry && typeof window !== 'undefined') {
      
      if (isRefreshing) {
        try {
          // Wait for the existing refresh to complete
          await new Promise<string>((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          });
          
          // Retry with the NEW token from the store
          const newToken = useAuthStore.getState().accessToken;
          const retryHeaders = new Headers(options.headers);
          if (newToken) {
            retryHeaders.set('Authorization', `Bearer ${newToken}`);
          }
          return fetchClient<T>(endpoint, { ...options, headers: retryHeaders }, true);
        } catch (err) {
          throw err;
        }
      }

      isRefreshing = true;
      const refreshToken = useAuthStore.getState().getRefreshToken();

      if (!refreshToken) {
        useAuthStore.getState().logout();
        window.dispatchEvent(new Event('unauthorized'));
        throw new ApiError(response.status, 'Session expired');
      }

      try {
        const refreshResponse = await fetch(`${API_BASE_URL}/api/v1/auth/refresh`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ refreshToken })
        });

        if (!refreshResponse.ok) {
          throw new Error('Refresh failed');
        }

        const data = await refreshResponse.json();
        
        // Handle both string and object refresh token formats
        const newRefreshToken = typeof data.refreshToken === 'object' && data.refreshToken !== null 
          ? data.refreshToken.refreshTokenHash 
          : data.refreshToken;

        // Update the store (this also updates localStorage)
        useAuthStore.getState().setAuth(data.accessToken, newRefreshToken, data.email);
        
        // Notify the queue
        processQueue(null, data.accessToken);

        // Retry the original request with the new token
        const retryHeaders = new Headers(options.headers);
        retryHeaders.set('Authorization', `Bearer ${data.accessToken}`);
        
        return fetchClient<T>(endpoint, { ...options, headers: retryHeaders }, true);
      } catch (error) {
        processQueue(error, null);
        useAuthStore.getState().logout();
        window.dispatchEvent(new Event('unauthorized'));
        throw new ApiError(response.status, 'Authentication failed');
      } finally {
        isRefreshing = false;
      }
    }

    // Standard error handling
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorData.error || response.statusText;
    } catch {
      // Body might not be JSON
    }

    throw new ApiError(response.status, errorMessage);
  }

  // Handle empty responses
  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}
