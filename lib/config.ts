export const config = {
  api: {
    get baseUrl() {
      return (
        process.env.NEXT_PUBLIC_API_URL ||
        (process.env.NODE_ENV === 'production'
          ? 'https://api.filthilink.store'
          : 'http://localhost:8080')
      );
    },
  },
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
  },
} as const;
