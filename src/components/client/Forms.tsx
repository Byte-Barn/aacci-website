'use client';

import { useRef, useState, type ReactNode } from 'react';
import { SITE } from '@/content/data';
import { asset } from '@/lib/base';

const SENT: Record<string, string> = {
  membership: 'Application sent. The membership team will contact you by email about the next steps and payment.',
  contact: 'Message sent. The secretariat will reply by email.',
  careers: 'Application sent. We will reply by email if your profile fits the role.',
  newsletter: 'You are subscribed. Look out for the next chamber newsletter.',
};
const WHAT: Record<string, string> = { membership: 'membership application', contact: 'message', careers: 'job application', newsletter: 'subscription' };

// FORMS_PROVIDER: "netlify" (default) or "formspree:<form id>". Set NEXT_PUBLIC_FORMS_PROVIDER at build time.
const PROVIDER = process.env.NEXT_PUBLIC_FORMS_PROVIDER || 'netlify';
// With Formspree, every form posts to one endpoint; a subject line tells the four forms apart in the inbox.
const FORMSPREE = PROVIDER.startsWith('formspree:') ? `https://formspree.io/f/${PROVIDER.split(':')[1]}` : '';
// Hidden field that only bots fill in. Each provider looks for its own field name.
const HONEYPOT = FORMSPREE ? '_gotcha' : 'bot-field';

function labelOf(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  const lab = input.closest('.field') ?? input.labels?.[0];
  const span = lab?.querySelector('span');
  return ((span?.firstChild?.textContent ?? lab?.textContent) || 'details').trim();
}

function problemWith(input: HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement) {
  if (input instanceof HTMLInputElement && input.type === 'checkbox') return input.required && !input.checked ? 'Tick this box to continue.' : '';
  if (input instanceof HTMLInputElement && input.type === 'file') {
    const f = input.files?.[0];
    if (input.required && !f) return 'Attach your CV.';
    if (f && f.size > 5 * 1024 * 1024) return 'Choose a file under 5 MB.';
    return '';
  }
  if (input.required && !input.value.trim()) return input.tagName === 'SELECT' ? `Choose ${labelOf(input).toLowerCase()}.` : `Enter your ${labelOf(input).toLowerCase()}.`;
  if (input instanceof HTMLInputElement && input.type === 'email' && input.value && !input.checkValidity()) return 'Enter an email address like name@company.com.';
  return '';
}

function showError(input: HTMLElement, text: string) {
  const wrap = input.closest('.field, .check');
  let err = wrap?.querySelector<HTMLElement>('.field-error') ?? null;
  if (text) {
    input.setAttribute('aria-invalid', 'true');
    if (wrap && !err) {
      err = document.createElement('span');
      err.className = 'field-error';
      err.id = `err-${(input as HTMLInputElement).name}`;
      wrap.appendChild(err);
      input.setAttribute('aria-describedby', err.id);
    }
    if (err) err.textContent = text;
  } else {
    input.removeAttribute('aria-invalid');
    err?.remove();
  }
}

async function send(form: HTMLFormElement) {
  const local = location.protocol === 'file:' || /^(localhost|127\.0\.0\.1|\[::1\])$/.test(location.hostname);
  if (local) return { ok: true, preview: true };
  const data = new FormData(form);
  if (FORMSPREE) {
    const r = await fetch(FORMSPREE, { method: 'POST', body: data, headers: { Accept: 'application/json' } });
    return { ok: r.ok };
  }
  const multipart = form.enctype === 'multipart/form-data';
  const body = multipart ? data : new URLSearchParams(data as unknown as Record<string, string>).toString();
  const r = await fetch(asset('/'), { method: 'POST', body, ...(multipart ? {} : { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }) });
  return { ok: r.ok };
}

/** A form that validates in the browser and posts to Netlify Forms (or Formspree). Works without JS too: it then lands on /thanks/. */
export function SmartForm({ name, className = 'form', multipart = false, submitLabel, children, msgClass = 'form-msg' }: {
  name: string; className?: string; multipart?: boolean; submitLabel: string; children: ReactNode; msgClass?: string;
}) {
  const ref = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<{ kind: '' | 'ok' | 'error'; text: string }>({ kind: '', text: '' });
  const [busy, setBusy] = useState(false);

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    let first: HTMLElement | null = null;
    form.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((input) => {
      if (input.type === 'hidden' || input.name === HONEYPOT) return;
      const p = problemWith(input);
      showError(input, p);
      if (p && !first) first = input;
    });
    if (first) {
      setState({ kind: 'error', text: name === 'newsletter' ? 'Enter an email address like name@company.com.' : 'Check the highlighted fields and try again.' });
      (first as HTMLElement).focus();
      return;
    }
    setBusy(true);
    let result: { ok: boolean; preview?: boolean };
    try { result = await send(form); } catch { result = { ok: false }; }
    setBusy(false);
    if (!result.ok) setState({ kind: 'error', text: 'Your form could not be sent. Try again, or email info@asianafrican.org.' });
    else if (result.preview) setState({ kind: 'ok', text: `Preview: on the live site this sends your ${WHAT[name] ?? 'form'} to the AACCI secretariat.` });
    else { setState({ kind: 'ok', text: SENT[name] ?? 'Sent.' }); form.reset(); }
  };

  const onFieldChange = (e: React.FormEvent<HTMLFormElement>) => {
    const t = e.target as HTMLInputElement;
    if (t.getAttribute('aria-invalid')) showError(t, problemWith(t));
  };

  return (
    <form ref={ref} className={className} name={name} method="POST" action={FORMSPREE || asset('/thanks/')} encType={multipart ? 'multipart/form-data' : undefined}
      {...(FORMSPREE ? {} : { 'data-netlify': 'true', 'netlify-honeypot': HONEYPOT })} noValidate onSubmit={onSubmit} onChange={onFieldChange} onBlur={onFieldChange}>
      <input type="hidden" name="form-name" value={name} />
      {FORMSPREE ? (
        <>
          <input type="hidden" name="_subject" value={`AACCI website: ${WHAT[name] ?? name}`} />
          {/* Where Formspree sends the visitor after a submission made without JavaScript. */}
          <input type="hidden" name="_next" value={`${SITE.url}/thanks/`} />
        </>
      ) : null}
      <p className="hp" aria-hidden="true"><label>Leave this empty <input name={HONEYPOT} tabIndex={-1} autoComplete="off" /></label></p>
      {children}
      {name !== 'newsletter' ? (
        <button className="btn btn--primary" type="submit" disabled={busy}><span>{busy ? 'Sending…' : submitLabel}</span></button>
      ) : null}
      <p className={`${msgClass}${state.kind ? ` is-${state.kind}` : ''}`} role="status" aria-live="polite">{state.text}</p>
    </form>
  );
}

/** Footer newsletter sign-up. */
export function Newsletter() {
  return (
    <SmartForm name="newsletter" className="subscribe" submitLabel="Subscribe" msgClass="subscribe-msg form-msg">
      <label htmlFor="sub-email">Email address</label>
      <div className="subscribe-row">
        <input id="sub-email" name="email" type="email" autoComplete="email" required placeholder="you@company.com" />
        <button className="btn btn--primary" type="submit"><span>Subscribe</span></button>
      </div>
    </SmartForm>
  );
}

/** A link that jumps to a form and pre-selects an option, e.g. "Apply for this role". */
export function PickLink({ href, select, value, className = 'btn btn--primary', children }: {
  href: string; select: string; value: string; className?: string; children: ReactNode;
}) {
  return (
    <a className={className} href={asset(href)} onClick={() => {
      const el = document.querySelector<HTMLSelectElement>(select);
      if (!el) return;
      const opt = Array.from(el.options).find((o) => o.text.trim().toLowerCase() === value.toLowerCase());
      if (opt) { el.value = opt.value; el.dispatchEvent(new Event('change', { bubbles: true })); }
    }}><span>{children}</span></a>
  );
}
