# Landings em subdomínios

As landings ficam em diretórios com o nome do subdomínio. Por exemplo,
`contabil/` é copiado para `dist/contabil/` a cada `npm run build` e é servido
em `https://contabil.curupirasoftware.com/`.

O Worker em `workers/subdomain-router.js` descobre o primeiro rótulo do host e
serve `dist/<subdomínio>/`. Assim, uma nova landing requer apenas um diretório
novo no repositório e um deploy — não uma nova configuração de domínio.

## Configuração única no Cloudflare

Cloudflare Pages não suporta domínios customizados curinga. Mantenha o Pages
para `curupirasoftware.com` e configure uma vez o Worker de subdomínios:

1. Em **DNS**, crie um registro `A` com nome `*`, destino `192.0.2.1` e proxy
   **Proxied** (nuvem laranja). O endereço não recebe tráfego: a rota do Worker
   responde antes de qualquer origem.
2. Em **Workers & Pages → curupira-subdomains → Settings → Builds**, conecte
   este repositório e a branch `main`. O Cloudflare Workers Builds publica a
   cada push, como o antigo Pages, sem token salvo no repositório. Use
   `npm test` como comando de build.
3. Confirme que a rota `*.curupirasoftware.com/*` está associada ao Worker
   `curupira-subdomains`.
4. Acesse `https://contabil.curupirasoftware.com/`.

Registros DNS específicos continuam tendo precedência sobre o curinga. Para
adicionar `financeiro.curupirasoftware.com`, crie `financeiro/` com o
`index.html` e os assets necessários e envie para a `main`.
