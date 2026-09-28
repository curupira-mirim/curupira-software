import { handleLeadPost } from '../functions/api/lead.js';

const BASE_HOST = 'curupirasoftware.com';
const WWW_HOST = `www.${BASE_HOST}`;

function siteFromHostname(hostname) {
  const suffix = `.${BASE_HOST}`;

  if (!hostname.endsWith(suffix)) return null;

  const site = hostname.slice(0, -suffix.length);
  // Each landing lives in dist/<subdomain>/. Do not turn a nested hostname
  // into a filesystem-like path.
  return /^[a-z0-9-]+$/.test(site) ? site : null;
}

function assetResponse(request, env, target) {
  const assetUrl = new URL(request.url);
  assetUrl.pathname = target;
  return env.ASSETS.fetch(new Request(assetUrl, request));
}

function mainAssetPath(path) {
  if (path === '/' || path === '/index.html') return '/index.html';
  if (path.endsWith('/')) return `${path}index.html`;
  return path;
}

function subdomainAssetPath(site, path) {
  if (path === '/' || path === '/index.html') return `/${site}/index.html`;
  if (path.startsWith('/assets/')) return `/${site}${path}`;
  // Existing landings may use an absolute /<subdomain>/assets URL.
  if (path.startsWith(`/${site}/assets/`)) return path;
  if (['/robots.txt', '/sitemap.xml', '/favicon.ico'].includes(path)) return `/${site}${path}`;
  return null;
}

export default {
  async fetch(request, env, context) {
    const url = new URL(request.url);
    const hostname = url.hostname.toLowerCase();

    if (hostname === WWW_HOST) {
      url.hostname = BASE_HOST;
      return Response.redirect(url, 301);
    }

    if (hostname === BASE_HOST) {
      if (url.pathname === '/api/lead') {
        if (request.method !== 'POST') return new Response('Método não permitido.', { status: 405 });
        return handleLeadPost(request, env, context);
      }

      return assetResponse(request, env, mainAssetPath(url.pathname));
    }

    const site = siteFromHostname(hostname);
    if (!site) return new Response('Subdomínio inválido.', { status: 400 });

    const target = subdomainAssetPath(site, url.pathname);

    if (!target) return new Response('Página não encontrada.', { status: 404 });
    return assetResponse(request, env, target);
  }
};
