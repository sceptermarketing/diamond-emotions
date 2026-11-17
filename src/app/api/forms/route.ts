// Receives the site's forms (contact, retailer application, custom order, find a jeweler).
// Entries are forwarded as JSON to FORMS_WEBHOOK_URL (e.g. a Zapier/Make hook, a CRM or an email service).
// Until that is set, the endpoint answers 503 and the form asks people to call or email instead.

const FORMS = new Set(['contact', 'become-a-retailer', 'custom-order', 'find-a-jeweler']);
const MAX_BYTES = 20_000;

export async function POST(req: Request) {
  const raw = await req.text();
  if (raw.length > MAX_BYTES) return Response.json({ ok: false }, { status: 413 });

  let body: { form?: unknown; data?: unknown };
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ ok: false }, { status: 400 });
  }
  const { form, data } = body;
  if (typeof form !== 'string' || !FORMS.has(form) || !data || typeof data !== 'object') {
    return Response.json({ ok: false }, { status: 400 });
  }
  const fields = Object.fromEntries(
    Object.entries(data as Record<string, unknown>)
      .filter(([, v]) => typeof v === 'string')
      .map(([k, v]) => [k.slice(0, 60), (v as string).slice(0, 4000)]),
  );

  // spam trap filled in: pretend it worked
  if (fields.website_hp) return Response.json({ ok: true });
  delete fields.website_hp;

  const hook = process.env.FORMS_WEBHOOK_URL;
  if (!hook) return Response.json({ ok: false, error: 'not-configured' }, { status: 503 });

  const res = await fetch(hook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ form, fields, submittedAt: new Date().toISOString() }),
  }).catch(() => null);

  return res?.ok ? Response.json({ ok: true }) : Response.json({ ok: false }, { status: 502 });
}
