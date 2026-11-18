'use client';

import { useEffect, useRef, useState, type ChangeEvent, type DragEvent, type FormEvent, type ReactNode } from 'react';
import { EMAIL, PHONE, PHONE_HREF } from '@/lib/links';
import s from './Form.module.css';

export type Field = {
  name: string;
  label: string;
  type?: 'text' | 'email' | 'tel' | 'url' | 'textarea' | 'select' | 'radio' | 'checkboxes' | 'file';
  required?: boolean;
  options?: string[];
  wide?: boolean; // full row on desktop
  autoComplete?: string;
  placeholder?: string;
  accept?: string; // file fields: allowed types, e.g. "image/*,.pdf"
};
export type FormSection = { title?: string; fields: Field[] };

type Props = {
  form: string; // which form, sent with the entry
  sections: FormSection[];
  submitLabel: string;
  success: string;
  prefillFromQuery?: string[]; // field names that can be filled from ?name=value
};

type Status = 'idle' | 'sending' | 'sent' | 'error' | 'too-big';

/** An attached file as sent to /api/forms */
type Attachment = { name: string; type: string; size: number; data: string };

// Requests to the site's server are capped at about 4.5 MB, so attachments are kept under 3 MB in all
// (they grow by a third when encoded). Photos are scaled down in the browser first, which keeps most well under.
const MAX_FILES = 5;
const MAX_TOTAL = 3 * 1024 * 1024;

const toBase64 = (blob: Blob) =>
  new Promise<string>((resolve, reject) => {
    const r = new FileReader();
    r.onload = () => resolve(String(r.result).split(',')[1] ?? '');
    r.onerror = () => reject(r.error);
    r.readAsDataURL(blob);
  });

// large photos → JPEG at most 2000px on the long side; other files as they are
async function shrink(file: File): Promise<Blob> {
  if (!/^image\/(jpeg|png|webp|heic|heif)$/i.test(file.type) || file.size < 400 * 1024) return file;
  try {
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, 2000 / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext('2d')!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    const out = await new Promise<Blob | null>((r) => canvas.toBlob(r, 'image/jpeg', 0.85));
    return out && out.size < file.size ? out : file;
  } catch {
    return file;
  }
}

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
    const data: Record<string, string | Attachment[]> = {};
    const files: [string, File][] = [];
    for (const [key, value] of fd.entries()) {
      if (typeof value !== 'string') {
        if (value.size > 0) files.push([key, value]);
        continue;
      }
      data[key] = data[key] ? `${data[key]}, ${value}` : value;
    }
    setStatus('sending');
    try {
      let total = 0;
      for (const [key, file] of files.slice(0, MAX_FILES)) {
        const blob = await shrink(file);
        total += blob.size;
        const name = blob === file ? file.name : file.name.replace(/\.[^.]+$/, '') + '.jpg';
        const list = (data[key] as Attachment[] | undefined) ?? [];
        list.push({ name, type: blob.type || file.type, size: blob.size, data: await toBase64(blob) });
        data[key] = list;
      }
      if (total > MAX_TOTAL) {
        setStatus('too-big');
        requestAnimationFrame(() => statusRef.current?.focus());
        return;
      }
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
        {status === 'too-big' && (
          <p className={s.err}>
            The attachments are too large to send (3 MB in all). Please attach fewer or smaller files, or email them to{' '}
            <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
          </p>
        )}
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

  if (f.type === 'file') return <FileDrop field={f} label={label} className={`${s.field} ${s.wide}`} />;

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

/** Drag-and-drop file picker; the chosen files stay on a real file input so the form sends them */
function FileDrop({ field: f, label, className }: { field: Field; label: ReactNode; className: string }) {
  const input = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>([]);
  const [over, setOver] = useState(false);
  const id = `f-${f.name}`;

  // keep the input's file list in step with what is shown
  const sync = (next: File[]) => {
    const list = next.slice(0, MAX_FILES);
    setFiles(list);
    if (!input.current) return;
    const dt = new DataTransfer();
    list.forEach((file) => dt.items.add(file));
    input.current.files = dt.files;
  };

  // the form's reset (after sending) clears the list too
  useEffect(() => {
    const form = input.current?.form;
    const clear = () => setFiles([]);
    form?.addEventListener('reset', clear);
    return () => form?.removeEventListener('reset', clear);
  }, []);

  const add = (list: FileList | null) => list && sync([...files, ...Array.from(list)]);
  const kb = (n: number) => (n > 1024 * 1024 ? `${(n / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(n / 1024))} KB`);

  return (
    <div className={className}>
      <label htmlFor={id} className={s.label}>
        {label}
      </label>
      <div
        className={`${s.drop} ${over ? s.dropOver : ''}`}
        onDragOver={(e: DragEvent) => {
          e.preventDefault();
          setOver(true);
        }}
        onDragLeave={() => setOver(false)}
        onDrop={(e: DragEvent) => {
          e.preventDefault();
          setOver(false);
          add(e.dataTransfer.files);
        }}
      >
        <svg width="28" height="28" viewBox="0 0 28 28" aria-hidden>
          <path d="M14 18V5m0 0l-5 5m5-5l5 5M5 18v3a2 2 0 002 2h14a2 2 0 002-2v-3" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <p>Drop files here or</p>
        <button type="button" className="btn btn-sm btn-outline" onClick={() => input.current?.click()}>
          Select Files
        </button>
        <input
          ref={input}
          id={id}
          name={f.name}
          type="file"
          multiple
          accept={f.accept}
          className={s.fileInput}
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            const picked = Array.from(e.target.files ?? []);
            // the picker replaces the input's list; add to what was already chosen
            sync([...files.filter((x) => !picked.includes(x)), ...picked]);
          }}
        />
      </div>
      <p className={s.hint}>Up to {MAX_FILES} files (photos, sketches or PDFs), 3 MB in all. Large photos are reduced automatically.</p>
      {files.length > 0 && (
        <ul className={s.files}>
          {files.map((file, i) => (
            <li key={`${file.name}-${i}`}>
              <span className={s.fileName}>{file.name}</span>
              <span className={s.fileSize}>{kb(file.size)}</span>
              <button type="button" aria-label={`Remove ${file.name}`} onClick={() => sync(files.filter((_, j) => j !== i))}>
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
