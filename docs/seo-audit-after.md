# Auditoria SEO — estado após implementação

Data: 2026-09-18.

## Arquitetura e renderização

O site passou a ter geração estática com Node (`scripts/build.mjs`) e saída em `dist/`, configurada no Cloudflare Pages. O conteúdo crítico é HTML estático, sem dependência de JavaScript para texto ou links relevantes. O build gera 27 URLs indexáveis, além de páginas municipais em revisão editorial e uma página 404.

## Cobertura implementada

| Área | Estado |
| --- | --- |
| Home | Metadata regional, links editoriais, serviços, produtos, FAQ e CTA |
| Empresa e contato | Criados, com entidade e sem endereço físico |
| Serviços | Sete páginas com `Service` e `BreadcrumbList` |
| Região | Zona da Mata, Juiz de Fora, Ubá e Muriaé indexáveis; Viçosa e Cataguases em `noindex,follow` até revisão humana |
| Case | Marque Rápido com `TechArticle` e sem métricas inventadas |
| Conteúdo | Hub e oito artigos iniciais com `BlogPosting` |
| Metadata | Title, description, canonical absoluto, Open Graph, Twitter e `lang=pt-BR` em todas as páginas |
| Schema | `WebSite`, `Organization`, `Service`, `BreadcrumbList`, `BlogPosting` e `TechArticle` |
| Crawl | `robots.txt`, `sitemap.xml`, `llms.txt` e `feed.xml` gerados no build |
| 404 | `404.html` com links úteis e `noindex` |
| Analytics | Eventos sem credenciais, enviados a `dataLayer` somente se ela já existir |

## Verificações locais

O teste automatizado verifica, para cada página indexável: idioma, title único, meta description, canonical, H1, OG, Twitter, JSON-LD parseável, link para home e presença no sitemap. Também verifica `robots.txt`, sitemap, `llms.txt` e feed.

Não foi possível validar HTTP de produção, Rich Results Test, Schema.org Validator, Core Web Vitals, Search Console, Bing ou regras de WAF localmente. Essas verificações devem ocorrer após o deploy, com as URLs públicas finais.

## Pendências de qualidade antes de indexar mais cidades

- Viçosa e Cataguases exigem exemplos e necessidades locais confirmados; por isso permanecem fora do sitemap e com `noindex,follow`.
- TODO: validar se o e-mail já publicado é o canal empresarial que deve permanecer público e fornecer telefone empresarial, se houver.
- TODO: adicionar links `sameAs`, autores reais e novos cases apenas após validação e autorização.
