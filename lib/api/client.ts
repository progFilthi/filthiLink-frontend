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

export async function fetchClient<T>(
  endpoint: string,
  options: RequestInit = {},
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
    let errorMessage = response.statusText;
    try {
      const errorData = await response.json();
      errorMessage =
        errorData.message || errorData.error || response.statusText;
    } catch {
      // Ignore JSON parse error, fallback to statusText
    }

    if (response.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
      window.dispatchEvent(new Event('unauthorized'));
    }

    throw new ApiError(response.status, errorMessage);
  }

  const text = await response.text();
  if (!text) {
    return {} as T;
  }

  return JSON.parse(text) as T;
}
