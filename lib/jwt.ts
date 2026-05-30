export function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    return JSON.parse(atob(payload));
  } catch {
    return null;
  }
}

export function isAdmin(): boolean {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('accessToken');
  if (!token) return false;
  const payload = decodeJwt(token);
  if (!payload) return false;
  const authorities = payload.authorities ?? payload.roles ?? payload.role;
  if (Array.isArray(authorities)) {
    return authorities.some(
      (a: unknown) => typeof a === 'string' && (a === 'ROLE_ADMIN' || a === 'ADMIN')
    );
  }
  if (typeof authorities === 'string') {
    return authorities === 'ROLE_ADMIN' || authorities === 'ADMIN';
  }
  return false;
}