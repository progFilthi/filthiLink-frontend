'use client';

import { GoogleOAuthProvider } from '@react-oauth/google';

const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;

// Suppress noisy GSI_LOGGER warnings in development
// (caused by React Strict Mode double-rendering the provider)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  const _origWarn = console.warn.bind(console);
  console.warn = (...args: unknown[]) => {
    if (typeof args[0] === 'string' && args[0].includes('GSI_LOGGER')) return;
    _origWarn(...args);
  };
}

export function GoogleOAuthWrapper({ children }: { children: React.ReactNode }) {
  if (!clientId) {
    return <>{children}</>;
  }

  return (
    <GoogleOAuthProvider clientId={clientId}>
      {children}
    </GoogleOAuthProvider>
  );
}
