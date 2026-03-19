'use client'

import { useEffect } from 'react'

const EXP = [
  {
    dates: 'Jan 2024 — Present',
    role: '[ Your Current Role ]',
    company: '[ Company Name ] · Full-time',
    bullets: [
      { bold: '[ Metric first ]', rest: ' — then the how. Example: Reduced P95 latency by 40% by redesigning retrieval from sequential to parallel fetch, cutting avg response from 3.2s to 1.9s.' },
      { bold: '[ Metric first ]', rest: ' — lead with a number or before/after, never a responsibility statement.' },
      { bold: '[ Metric first ]', rest: ' — third bullet only if it adds different signal than the first two.' },
    ],
  },
  {
    dates: 'Jun 2022 — Dec 2023',
    role: '[ Previous Role ]',
    company: '[ Company Name ] · Full-time',
    bullets: [
      { bold: '[ Metric first ]', rest: ' — what moved because of you. Revenue, retention, latency, error rate.' },
      { bold: '[ Metric first ]', rest: ' — different outcome type than bullet one.' },
    ],
  },
  {
    dates: '2021 — 2022',
    role: '[ Earlier Role / Internship ]',
    company: '[ Company Name ] · Internship',
    bullets: [
      { bold: '[ Metric first ]', rest: ' — even internship bullets need outcome-first framing. No number? Use a clear before/after.' },
    ],
  },
]

export default function Experience() {
  useEffect(() => {
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } }) }, { threshold: 0.07 })
    document.querySelectorAll('#experience .fu').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="experience">
      <div className="eyebrow">06 — Work Experience</div>
      <div className="fu">
        <h2 className="sec-title">Where I&apos;ve<br /><em>worked.</em></h2>
      </div>
      <a href="/resume.pdf" className="fu s1" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
        fontFamily: 'var(--font-m)', fontSize: '0.65rem', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '2.25rem',
      }}>
        Download full resume ↗
      </a>
      <div className="fu s2" style={{ borderLeft: '1px solid var(--border-2)', paddingLeft: '2.5rem', marginLeft: '0.5rem' }}>
        {EXP.map((exp, i) => (
          <div key={i} style={{ position: 'relative', paddingBottom: '2.5rem' }}>
            {/* Timeline dot */}
            <div style={{
              position: 'absolute', left: '-2.86rem', top: '0.3rem',
              width: 6, height: 6, borderRadius: '50%',
              background: 'var(--fg-dimmer)', border: '2px solid var(--bg)',
            }} />
            <div style={{ fontFamily: 'var(--font-m)', fontSize: '0.6rem', color: 'var(--fg-dimmer)', letterSpacing: '0.08em', marginBottom: '0.3rem' }}>{exp.dates}</div>
            <div style={{ fontFamily: 'var(--font-d)', fontSize: '1.05rem', fontWeight: 600, letterSpacing: '-0.02em', marginBottom: '0.18rem' }}>{exp.role}</div>
            <div style={{ fontSize: '0.83rem', color: 'var(--fg-dim)', fontWeight: 400, marginBottom: '0.85rem' }}>{exp.company}</div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
              {exp.bullets.map((b, j) => (
                <li key={j} style={{ fontSize: '0.86rem', fontWeight: 400, color: 'var(--fg-dim)', lineHeight: 1.65, paddingLeft: '1.1rem', position: 'relative' }}>
                  <span style={{ position: 'absolute', left: 0, color: 'var(--fg-dimmer)', fontSize: '0.75rem' }}>—</span>
                  <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{b.bold}</strong>{b.rest}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </section>
  )
}