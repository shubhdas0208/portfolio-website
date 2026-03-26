'use client'

import { useEffect } from 'react'

const NOW_ITEMS = [
  {
    label: 'Building',
    text: 'A RAG-based document filter using OpenAI embeddings + Pinecone. Currently solving cold-start latency — first request after idle takes 4s, target sub-800ms. Testing a Vercel cron pre-warm strategy.',
    bold: 'RAG-based document filter',
  },
  {
    label: 'Reading',
    text: 'Building ML Powered Applications by Emmanuel Ameisen — specifically the chapter on product iteration loops. Also working through Anthropic\'s model cards to understand how safety constraints become product constraints.',
    bold: 'Building ML Powered Applications',
  },
  {
    label: 'Thinking About',
    text: 'Why LLM evals fail silently in production. Offline evals pass, but user behavior signals something different. How should a PM design a feedback loop that catches this gap before it becomes a retention problem?',
    bold: 'LLM evals fail silently in production.',
  },
]

export default function Now() {
  useEffect(() => {
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } }) }, { threshold: 0.07 })
    document.querySelectorAll('#now .fu').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

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
        {NOW_ITEMS.map(item => (
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
              {item.text.includes(item.bold)
                ? <>
                    {item.text.split(item.bold)[0]}
                    <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{item.bold}</strong>
                    {item.text.split(item.bold)[1]}
                  </>
                : item.text}
            </p>
          </div>
        ))}
      </div>
      <p className="fu s2" style={{ fontFamily: 'var(--font-m)', fontSize: '0.6rem', color: 'var(--fg-dimmer)', marginTop: '2.25rem', letterSpacing: '0.1em' }}>
        Last updated: <span style={{ color: 'var(--accent)' }}>March 2026</span>
      </p>
      <style>{`
        @media (max-width: 900px) {
          #now .now-grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
