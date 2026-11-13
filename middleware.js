// Password gate (Vercel Routing Middleware). Every request needs the shared password.
// Set SITE_PASSWORD in Vercel → Project → Settings → Environment Variables. Any username works.
export const config = { matcher: '/:path*' };

export default function middleware(request) {
  const pass = process.env.SITE_PASSWORD;
  const auth = request.headers.get('authorization') || '';
  if (pass && auth.startsWith('Basic ')) {
    try {
      const decoded = atob(auth.slice(6));
      const pwd = decoded.slice(decoded.indexOf(':') + 1);
      if (pwd === pass) return;            // let the request through
    } catch (e) { /* fall through */ }
  }
  return new Response('ARCA: password required', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="ARCA", charset="UTF-8"', 'Cache-Control': 'no-store' },
  });
}
