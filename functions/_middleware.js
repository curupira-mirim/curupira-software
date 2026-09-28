const CONTABIL_HOST = 'contabil.curupirasoftware.com';
const CONTABIL_PREFIX = '/contabil';

export async function onRequest(context) {
  const requestUrl = new URL(context.request.url);

  if (requestUrl.hostname.toLowerCase() !== CONTABIL_HOST) {
    return context.next();
  }

  const path = requestUrl.pathname;
  const target = path === '/' || path === '/index.html'
    ? `${CONTABIL_PREFIX}/index.html`
    : path.startsWith('/assets/')
      ? `${CONTABIL_PREFIX}${path}`
      : path.startsWith(`${CONTABIL_PREFIX}/`)
        ? path
        : ['/robots.txt', '/sitemap.xml'].includes(path)
          ? `${CONTABIL_PREFIX}${path}`
          : null;

  if (!target) {
    return Response.redirect(new URL('/', requestUrl), 302);
  }

  const assetUrl = new URL(context.request.url);
  assetUrl.pathname = target;
  return context.next(new Request(assetUrl, context.request));
}
