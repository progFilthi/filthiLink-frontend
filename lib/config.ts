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
  shortUrl: {
    get baseDomain() {
      return (
        process.env.NEXT_PUBLIC_SHORT_URL_DOMAIN ||
        'https://filthi.link'
      );
    },
  },
  google: {
    clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
  },
} as const;
