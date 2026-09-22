const MAX_LENGTH = {
  nome: 120,
  email: 254,
  empresa: 160,
  cargo: 120,
  contato: 120,
  frente: 120,
  dor: 3000,
  submissionId: 120
};

const clean = (value, max) => String(value || '').trim().slice(0, max);
const escapeHtml = (value) => value.replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#39;');
const json = (body, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' }
});

export async function onRequestPost(context) {
  let input;

  try {
    input = await context.request.json();
  } catch {
    return json({ error: 'Não foi possível ler suas informações. Tente novamente.' }, 400);
  }

  if (clean(input.website, 200)) return json({ ok: true });

  const lead = Object.fromEntries(Object.entries(MAX_LENGTH).map(([key, max]) => [key, clean(input[key], max)]));

  if (!lead.nome || !lead.email || !lead.dor) {
    return json({ error: 'Preencha seu nome, e-mail e o desafio que você quer resolver.' }, 400);
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(lead.email)) {
    return json({ error: 'Confira o seu e-mail para continuar.' }, 400);
  }

  const apiKey = context.env.RESEND_API_KEY;
  const from = context.env.LEAD_EMAIL_FROM;
  const recipient = context.env.LEAD_EMAIL_TO || 'alisson.winter@curupirasoftware.com';

  if (!apiKey || !from) {
    return json({ error: 'O envio está sendo configurado. Tente novamente em alguns minutos.' }, 503);
  }

  const fields = [
    ['Nome', lead.nome],
    ['E-mail', lead.email],
    ['Empresa', lead.empresa || 'Não informado'],
    ['Papel na empresa', lead.cargo || 'Não informado'],
    ['Frente de interesse', lead.frente || 'Ainda estou entendendo'],
    ['Telefone ou WhatsApp', lead.contato || 'Não informado']
  ];
  const text = [
    'Novo lead pelo site da Curupira Software',
    '',
    ...fields.map(([label, value]) => `${label}: ${value}`),
    '',
    'Onde o fluxo trava hoje:',
    lead.dor
  ].join('\n');
  const rows = fields.map(([label, value]) => `<tr><td style="padding:6px 18px 6px 0;color:#52675d;font-weight:700;vertical-align:top">${escapeHtml(label)}</td><td style="padding:6px 0;color:#0b1f16">${escapeHtml(value)}</td></tr>`).join('');
  const html = `<main style="max-width:680px;margin:0 auto;padding:32px;font-family:Arial,sans-serif;color:#0b1f16"><p style="margin:0 0 12px;color:#b23c02;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase">Novo lead pelo site</p><h1 style="margin:0 0 24px;font-size:28px;line-height:1.15">${escapeHtml(lead.empresa || lead.nome)}</h1><table style="border-collapse:collapse;margin-bottom:28px">${rows}</table><h2 style="margin:0 0 10px;font-size:18px">Onde o fluxo trava hoje</h2><p style="margin:0;white-space:pre-wrap;color:#3d5147;line-height:1.6">${escapeHtml(lead.dor)}</p></main>`;

  const sendEmail = fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'Idempotency-Key': lead.submissionId || crypto.randomUUID(),
      'User-Agent': 'curupira-software-lead-form/1.0'
    },
    body: JSON.stringify({
      from,
      to: recipient.split(',').map((email) => email.trim()).filter(Boolean),
      reply_to: lead.email,
      subject: `Novo lead — ${lead.empresa || lead.nome}`,
      text,
      html
    })
  });

  const reportFailure = (response) => {
    if (!response.ok) console.error('Lead email failed', response.status);
  };

  if (typeof context.waitUntil === 'function') {
    context.waitUntil(sendEmail.then(reportFailure).catch((error) => console.error('Lead email failed', error)));
    return json({ ok: true }, 202);
  }

  const response = await sendEmail;
  if (!response.ok) return json({ error: 'Não foi possível enviar agora. Tente novamente em alguns minutos.' }, 502);

  return json({ ok: true });
}
