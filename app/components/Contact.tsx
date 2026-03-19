'use client'

import { useEffect } from 'react'

export default function Contact() {
  useEffect(() => {
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } }) }, { threshold: 0.07 })
    document.querySelectorAll('#contact .fu').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <>
      <section id="contact" style={{ background: 'var(--bg-2)' }}>
        <div className="eyebrow">07 — Contact</div>
        <h2 className="fu" style={{ fontFamily: 'var(--font-d)', fontSize: 'clamp(2.5rem,6vw,5.5rem)', fontWeight: 700, lineHeight: 1.0, letterSpacing: '-0.04em', marginBottom: '1.5rem' }}>
          Let&apos;s<br /><em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>talk.</em>
        </h2>
        <p className="fu s1" style={{ fontSize: '0.94rem', fontWeight: 400, color: 'var(--fg-dim)', maxWidth: 350, lineHeight: 1.72, marginBottom: '2.2rem' }}>
          Targeting AI Platform PM and Consumer AI PM roles. Open to conversations about roles, AI product problems worth solving, or the right way to design an LLM eval layer.
        </p>
        <div className="fu s2" style={{ display: 'flex', gap: '1.1rem', flexWrap: 'wrap' }}>
          {[
            { label: 'Email ↗', href: 'mailto:shubhsankalp@gmail.com' },
            { label: 'LinkedIn ↗', href: 'https://linkedin.com/in/shubhsankalpd' },
            { label: 'GitHub ↗', href: 'https://github.com/shubhsd' },
          ].map(link => (
            <a key={link.label} href={link.href} target={link.href.startsWith('http') ? '_blank' : undefined} style={{
              display: 'inline-flex', alignItems: 'center', gap: '0.4rem',
              fontFamily: 'var(--font-m)', fontSize: '0.67rem', letterSpacing: '0.1em', textTransform: 'uppercase',
              color: 'var(--fg-dim)', borderBottom: '1px solid var(--border-2)', paddingBottom: '0.22rem',
            }}>
              {link.label}
            </a>
          ))}
        </div>
      </section>

      <footer style={{ padding: '1.75rem 4rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border)' }}>
        <span style={{ fontFamily: 'var(--font-m)', fontSize: '0.59rem', color: 'var(--fg-dimmer)', letterSpacing: '0.1em' }}>Shubh Sankalp Das — 2026</span>
        <span style={{ fontFamily: 'var(--font-m)', fontSize: '0.59rem', color: 'var(--fg-dimmer)', letterSpacing: '0.1em' }}>Next.js · Supabase · Vercel</span>
      </footer>
    </>
  )
}