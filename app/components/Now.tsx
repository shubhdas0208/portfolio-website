'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface NowData {
  building: string
  reading: string
  thinking: string
  updated_at: string
}

export default function Now() {
  const [data, setData] = useState<NowData | null>(null)

  useEffect(() => {
    supabase
      .from('now')
      .select('*')
      .eq('id', 1)
      .single()
      .then(({ data }) => { if (data) setData(data) })
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } })
    }, { threshold: 0.07 })
    document.querySelectorAll('#now .fu').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const items = data ? [
    { label: 'Building', text: data.building },
    { label: 'Reading', text: data.reading },
    { label: 'Thinking About', text: data.thinking },
  ] : [
    { label: 'Building', text: '...' },
    { label: 'Reading', text: '...' },
    { label: 'Thinking About', text: '...' },
  ]

  const updatedAt = data?.updated_at
    ? new Date(data.updated_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : 'Recently'

  return (
    <section id="now" style={{ background: 'var(--bg-2)' }}>
      <div className="eyebrow">05 — Now</div>
      <div className="fu">
        <h2 className="sec-title">What I&apos;m doing<br /><em>right now.</em></h2>
      </div>
      <div
        className="fu s1 now-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
          gap: '1rem',
          marginTop: '0.75rem',
        }}
      >
        {items.map(item => (
          <div
            key={item.label}
            className="glow-card"
            style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--border)',
              borderRadius: 10,
              padding: '1.5rem',
              minHeight: 250,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div style={{
              fontFamily: 'var(--font-m)',
              fontSize: '0.58rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'var(--accent)',
              marginBottom: '1rem',
            }}>{item.label}</div>
            <p style={{ fontSize: '0.89rem', fontWeight: 400, color: 'var(--fg-dim)', lineHeight: 1.72 }}>
              {item.text}
            </p>
          </div>
        ))}
      </div>
      <p className="fu s2" style={{ fontFamily: 'var(--font-m)', fontSize: '0.6rem', color: 'var(--fg-dimmer)', marginTop: '2.25rem', letterSpacing: '0.1em' }}>
        Last updated: <span style={{ color: 'var(--accent)' }}>{updatedAt}</span>
      </p>
      <style>{`
        @media (max-width: 900px) {
          #now .now-grid { grid-template-columns: 1fr; }
        }
      `}</style>
    </section>
  )
}
