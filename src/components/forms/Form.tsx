'use client';

import { useEffect, useRef, useState, type FormEvent } from 'react';
import { EMAIL, PHONE, PHONE_HREF } from '@/lib/links';
import s from './Form.module.css';

export type Field = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'radio' | 'checkboxes';
  required?: boolean;
  options?: string[];
  wide?: boolean; // full row on desktop
  autoComplete?: string;
  placeholder?: string;
};
export type FormSection = { title?: string; fields: Field[] };

type Props = {
  form: string; // which form, sent with the entry
  sections: FormSection[];
  submitLabel: string;
  success: string;
  prefillFromQuery?: string[]; // field names that can be filled from ?name=value
};

type Status = 'idle' | 'sending' | 'sent' | 'error';

export default function Form({ form, sections, submitLabel, success, prefillFromQuery = [] }: Props) {
  const [status, setStatus] = useState<Status>('idle');
  const ref = useRef<HTMLFormElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  // e.g. /custom-order-form/?style=ER9289 from a product page
  useEffect(() => {
    if (!prefillFromQuery.length || !ref.current) return;
    const q = new URLSearchParams(window.location.search);
    for (const name of prefillFromQuery) {
      const value = q.get(name);
      const el = ref.current.elements.namedItem(name);
      if (value && el instanceof HTMLInputElement) el.value = value.slice(0, 100);
    }
  }, [prefillFromQuery]);

  async function submit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, string> = {};
    for (const [key, value] of fd.entries()) {
      if (typeof value !== 'string') continue;
      data[key] = data[key] ? `${data[key]}, ${value}` : value;
    }
    setStatus('sending');
    try {
      const res = await fetch('/api/forms/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ form, data }),
      });
      setStatus(res.ok ? 'sent' : 'error');
      if (res.ok) ref.current?.reset();
    } catch {
      setStatus('error');
    }
    requestAnimationFrame(() => statusRef.current?.focus());
  }

  return (
    <form ref={ref} className={s.form} onSubmit={submit} noValidate={false}>
      {sections.map((section, i) => (
        <fieldset key={section.title ?? i} className={s.section}>
          {section.title && <legend className={s.legend}>{section.title}</legend>}
          <div className={s.grid}>
            {section.fields.map((f) => (
              <FieldInput key={f.name} field={f} />
            ))}
          </div>
        </fieldset>
      ))}

      {/* spam trap: hidden from people, filled in by bots */}
      <div className={s.trap} aria-hidden>
        <label>
          Leave this empty
          <input type="text" name="website_hp" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <div className={s.footer}>
        <button type="submit" className="btn btn-sm btn-dark" disabled={status === 'sending'}>
          {status === 'sending' ? 'Sending…' : submitLabel}
        </button>
        <p className={s.required}>
          <span aria-hidden>*</span> Required
        </p>
      </div>

      <div ref={statusRef} tabIndex={-1} role="status" className={s.status}>
        {status === 'sent' && <p className={s.ok}>{success}</p>}
        {status === 'error' && (
          <p className={s.err}>
            We couldn’t send the form just now. Please call us at <a href={PHONE_HREF}>{PHONE}</a> or email{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        )}
      </div>
    </form>
  );
}

function FieldInput({ field: f }: { field: Field }) {
  const id = `f-${f.name}`;
  const label = (
    <>
      {f.label}
      {f.required && <span className={s.star}> *</span>}
    </>
  );
  const cls = `${s.field} ${f.wide || f.type === 'textarea' || f.type === 'radio' || f.type === 'checkboxes' ? s.wide : ''}`;

  if (f.type === 'radio' || f.type === 'checkboxes') {
    return (
      <fieldset className={cls}>
        <legend className={s.label}>{label}</legend>
        <div className={s.choices}>
          {f.options?.map((o, i) => (
            <label key={o} className={s.choice}>
              <input
                type={f.type === 'radio' ? 'radio' : 'checkbox'}
                name={f.name}
                value={o}
                required={f.type === 'radio' && f.required && i === 0}
              />
              {o}
            </label>
          ))}
        </div>
      </fieldset>
    );
  }

  return (
    <div className={cls}>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      {f.type === 'textarea' ? (
        <textarea id={id} name={f.name} required={f.required} rows={5} maxLength={4000} placeholder={f.placeholder} />
      ) : f.type === 'select' ? (
        <select id={id} name={f.name} required={f.required} defaultValue="">
          <option value="" disabled>
            Select…
          </option>
          {f.options?.map((o) => (
            <option key={o}>{o}</option>
          ))}
        </select>
      ) : (
        <input
          id={id}
          name={f.name}
          type={f.type ?? 'text'}
          required={f.required}
          autoComplete={f.autoComplete}
          placeholder={f.placeholder}
          maxLength={300}
        />
      )}
    </div>
  );
}
