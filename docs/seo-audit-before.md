# Auditoria SEO — estado inicial

Data: 2026-09-18. O projeto era uma landing page estática para Cloudflare Pages, sem framework, rotas de conteúdo, `package.json`, build, lint ou testes automatizados.

| Item | Estado encontrado |
| --- | --- |
| Páginas públicas | Apenas `/` |
| Title | Presente, mas não orientado a Juiz de Fora/Zona da Mata |
| Meta description | Presente; não trazia posicionamento regional |
| H1 | Um H1 presente |
| Canonical | Presente para a home |
| Indexabilidade | Home indexável |
| Schema | Organization, WebSite e FAQPage presentes |
| Sitemap | Existia, com apenas a home |
| Robots | Existia, sem regras para áreas privadas ou crawlers específicos |
| `llms.txt` / feed | Ausentes |
| Open Graph / Twitter | Presentes na home |
| Contato | E-mail público presente no HTML e schema |
| Imagens | Logo com `alt` no conteúdo; marca decorativa com `alt` vazio |
| Links internos | Somente âncoras na própria landing; sem cluster editorial |
| CTA | Presentes, mas sem eventos analíticos |

## Problemas e limitações observados

- Não havia páginas institucionais, de serviço, regiões, cases ou conteúdos indexáveis.
- O sitemap usava uma data futura que não correspondia a uma modificação documentada.
- Não havia página 404 dedicada nem mecanismo de validação de rotas/metadados.
- Não havia um pipeline de build/teste; portanto os comandos `npm run build`, `npm run lint` e `npm test` falharam por ausência de `package.json`.
- Não foi feita medição de Core Web Vitals em dispositivo/rede real nesta auditoria local. A fonte é remota e deve ser acompanhada em produção.
