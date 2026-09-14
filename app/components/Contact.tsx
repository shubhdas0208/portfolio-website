'use client'

import { useRef, useState, type FormEvent } from 'react'
import { EMAIL, SOCIALS } from '../lib/site'

type Field = 'name' | 'email' | 'message'
type Status = 'idle' | 'sending' | 'sent' | 'failed'

const RULES: Record<Field, (v: string) => string> = {
  name: v => (v.trim() ? '' : "Add your name so I know who's writing."),
  email: v => (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()) ? '' : 'Add an email so I can reply.'),
  message: v => (v.trim().length >= 10 ? '' : 'Say a little more, at least a sentence.'),
}

const ICONS = {
  linkedin: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" /></svg>,
  github: <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" /></svg>,
  x: <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>,
  email: <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="2" /><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" /></svg>,
}

export default function Contact() {
  const [values, setValues] = useState<Record<Field, string>>({ name: '', email: '', message: '' })
  const [errors, setErrors] = useState<Record<Field, string>>({ name: '', email: '', message: '' })
  const [status, setStatus] = useState<Status>('idle')
  const [sentPreview, setSentPreview] = useState('')
  const [copied, setCopied] = useState(false)
  const formRef = useRef<HTMLFormElement>(null)

  const validate = (field: Field, value = values[field]) => {
    const msg = RULES[field](value)
    setErrors(prev => ({ ...prev, [field]: msg }))
    return !msg
  }

  const copyEmail = async () => {
    try { await navigator.clipboard.writeText(EMAIL) } catch { /* clipboard blocked; still confirm */ }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1600)
  }

  const submit = async (e?: FormEvent) => {
    e?.preventDefault()
    const ok = (Object.keys(RULES) as Field[]).map(f => validate(f)).every(Boolean)
    if (!ok) { (formRef.current?.querySelector('.invalid') as HTMLElement | null)?.focus(); return }
    setStatus('sending')
    try {
      const res = await fetch('/api/contact', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(values) })
      if (!res.ok) throw new Error(String(res.status))
      setSentPreview(values.message.trim().split(/\s+/).slice(0, 5).join(' '))
      setStatus('sent')
    } catch {
      setStatus('failed')
    }
  }

  const input = (field: Field, props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input
      {...props}
      name={field}
      value={values[field]}
      className={errors[field] ? 'invalid' : undefined}
      aria-invalid={!!errors[field]}
      onChange={e => setValues(v => ({ ...v, [field]: e.target.value }))}
      onBlur={e => e.target.value && validate(field, e.target.value)}
    />
  )

  return (
    <section className="sec wrap" id="contact">
      <div className="ct">
        <div>
          <h2 className="big h2" style={{ display: 'block' }}>Let&apos;s <em>talk.</em></h2>
          <div className="mail">
            <a className="addr" href={`mailto:${EMAIL}`}>{EMAIL}</a>
            <button className={`copyb${copied ? ' done' : ''}`} type="button" onClick={copyEmail}>{copied ? 'Copied' : 'Copy email'}</button>
          </div>
          <span className="sr" aria-live="polite">{copied ? 'Email address copied' : ''}</span>
          <div className="socials">
            <a href={SOCIALS.linkedin} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" title="LinkedIn">{ICONS.linkedin}</a>
            <a href={SOCIALS.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub" title="GitHub">{ICONS.github}</a>
            <a href={SOCIALS.x} target="_blank" rel="noopener noreferrer" aria-label="X" title="X">{ICONS.x}</a>
            <a href={`mailto:${EMAIL}`} aria-label="Email" title="Email">{ICONS.email}</a>
          </div>
        </div>

        <form ref={formRef} className="form" onSubmit={submit} noValidate>
          {status === 'sent' ? (
            <div className="sent on" role="status">
              <span className="tick">✓</span>
              <span>Sent: <q>“{sentPreview}…”</q><br />I&apos;ll reply from {EMAIL}.</span>
            </div>
          ) : (
            <>
              <div className="two">
                <label>Name{input('name', { autoComplete: 'name', placeholder: 'Your name' })}<span className="err">{errors.name}</span></label>
                <label>Email{input('email', { type: 'email', autoComplete: 'email', placeholder: 'you@company.com' })}<span className="err">{errors.email}</span></label>
              </div>
              <label>
                What&apos;s on your mind?
                <textarea
                  name="message"
                  rows={5}
                  placeholder="A role, a problem worth solving, or a disagreement with my P99 post."
                  value={values.message}
                  className={errors.message ? 'invalid' : undefined}
                  aria-invalid={!!errors.message}
                  onChange={e => setValues(v => ({ ...v, message: e.target.value }))}
                  onBlur={e => e.target.value && validate('message', e.target.value)}
                />
                <span className="err">{errors.message}</span>
              </label>
              <div className="row">
                {status === 'failed' && (
                  <span className="fail" role="alert">
                    That didn&apos;t send. <a href="#" onClick={e => { e.preventDefault(); submit() }}>Try again</a>, or email <a href={`mailto:${EMAIL}`}>{EMAIL}</a>.
                  </span>
                )}
                <button className="btn" type="submit" disabled={status === 'sending'}>{status === 'sending' ? 'Sending…' : 'Send message'}</button>
              </div>
            </>
          )}
        </form>
      </div>
    </section>
  )
}
