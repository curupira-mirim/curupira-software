const BASE_HOST = 'curupirasoftware.com';

function siteFromHostname(hostname) {
  const suffix = `.${BASE_HOST}`;

  if (!hostname.endsWith(suffix)) return null;

  const site = hostname.slice(0, -suffix.length);
  // Each landing lives in dist/<subdomain>/. Do not turn a nested hostname
  // into a filesystem-like path.
  return /^[a-z0-9-]+$/.test(site) ? site : null;
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const site = siteFromHostname(url.hostname.toLowerCase());

    if (!site) return new Response('Subdomínio inválido.', { status: 400 });

    const path = url.pathname;
    const target = path === '/' || path === '/index.html'
      ? `/${site}/index.html`
      : path.startsWith('/assets/')
        ? `/${site}${path}`
        : ['/robots.txt', '/sitemap.xml', '/favicon.ico'].includes(path)
          ? `/${site}${path}`
          : null;

    if (!target) return new Response('Página não encontrada.', { status: 404 });

    const assetUrl = new URL(request.url);
    assetUrl.pathname = target;
    return env.ASSETS.fetch(new Request(assetUrl, request));
  }
};
