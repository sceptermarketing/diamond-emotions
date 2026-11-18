// Receives the site's forms (contact, retailer application, custom order, find a jeweler).
// Entries are forwarded as JSON to FORMS_WEBHOOK_URL (e.g. a Zapier/Make hook, a CRM or an email service),
// with any attachments as base64 ({ name, type, size, data }). Until that is set, the endpoint answers 503
// and the form asks people to call or email instead.

const FORMS = new Set(['contact', 'become-a-retailer', 'custom-order', 'find-a-jeweler']);
const MAX_BYTES = 4_400_000; // just under Vercel's 4.5 MB request limit
const MAX_FILES = 5;

type Attachment = { name: string; type: string; size: number; data: string };

const isAttachment = (v: unknown): v is Attachment =>
  !!v &&
  typeof v === 'object' &&
  typeof (v as Attachment).name === 'string' &&
  typeof (v as Attachment).type === 'string' &&
  typeof (v as Attachment).size === 'number' &&
  typeof (v as Attachment).data === 'string' &&
  /^[A-Za-z0-9+/=]*$/.test((v as Attachment).data);

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

  const fields: Record<string, string> = {};
  const attachments: (Attachment & { field: string })[] = [];
  for (const [k, v] of Object.entries(data as Record<string, unknown>)) {
    const key = k.slice(0, 60);
    if (typeof v === 'string') fields[key] = v.slice(0, 4000);
    else if (Array.isArray(v) && form === 'custom-order') {
      for (const f of v.filter(isAttachment).slice(0, MAX_FILES - attachments.length)) {
        attachments.push({ field: key, name: f.name.slice(0, 200), type: f.type.slice(0, 100), size: f.size, data: f.data });
      }
    }
  }

  // spam trap filled in: pretend it worked
  if (fields.website_hp) return Response.json({ ok: true });
  delete fields.website_hp;

  const hook = process.env.FORMS_WEBHOOK_URL;
  if (!hook) return Response.json({ ok: false, error: 'not-configured' }, { status: 503 });

  const res = await fetch(hook, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ form, fields, attachments, submittedAt: new Date().toISOString() }),
  }).catch(() => null);

  return res?.ok ? Response.json({ ok: true }) : Response.json({ ok: false }, { status: 502 });
}
