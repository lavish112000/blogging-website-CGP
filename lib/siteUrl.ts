export function getRequestBaseUrl(headers: Headers): string {
  const forwardedHost = headers.get('x-forwarded-host');
  const host = forwardedHost || headers.get('host');
  const forwardedProto = headers.get('x-forwarded-proto');
  const proto = forwardedProto || 'https';

  if (host) {
    return `${proto}://${host}`;
  }

  const netlifyUrl = process.env.URL;
  if (netlifyUrl) return netlifyUrl;

  const publicUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (publicUrl) return publicUrl;

  return 'http://localhost:3000';
}
