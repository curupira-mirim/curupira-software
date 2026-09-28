# Landing de Contabilidade

A landing está em `contabil/` e é copiada para `dist/contabil/` a cada `npm run build`.

O middleware em `functions/_middleware.js` identifica o host `contabil.curupirasoftware.com` e entrega essa landing na raiz do subdomínio. Ele também disponibiliza os assets, o `robots.txt` e o sitemap específicos dela.

## Publicação no Cloudflare Pages

1. Faça o deploy normal deste projeto no Cloudflare Pages.
2. Em **Custom domains**, adicione `contabil.curupirasoftware.com` ao mesmo projeto.
3. No provedor DNS, crie o registro indicado pelo Cloudflare para o subdomínio e aguarde a validação do certificado.
4. Confirme que `https://contabil.curupirasoftware.com/` abre a landing e que o CTA aponta para `https://curupirasoftware.com/contato/`.

O subdomínio depende dessa configuração de DNS/Cloudflare; ela não pode ser criada somente a partir dos arquivos do repositório.
