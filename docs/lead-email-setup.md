# Envio interno de leads

O formulário da home envia os dados para a Pages Function `POST /api/lead`. A função usa a API do Resend e responde ao navegador sem abrir cliente de e-mail.

No Cloudflare Pages, em **Settings → Variables and Secrets**, configure estas variáveis nos ambientes de produção e preview:

| Variável | Tipo | Valor |
| --- | --- | --- |
| `RESEND_API_KEY` | Secret | Chave de envio do Resend, com permissão para enviar e-mails. |
| `LEAD_EMAIL_FROM` | Secret ou texto | Remetente verificado no Resend, por exemplo `Curupira Software <contato@curupirasoftware.com>`. |
| `LEAD_EMAIL_TO` | Secret ou texto | Destino dos leads. Se omitida, a função usa `alisson.winter@curupirasoftware.com`. |

O domínio do remetente precisa estar verificado no Resend. A chave fica somente no ambiente da Cloudflare, nunca no HTML ou no navegador.

Após salvar as variáveis, faça um novo deploy do projeto. A função recebe o lead, envia um único e-mail com os campos organizados e devolve uma confirmação para o formulário.
