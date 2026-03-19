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
      <div className="fu s1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '2.5rem', marginTop: '0.5rem' }}>
        {NOW_ITEMS.map(item => (
          <div key={item.label} style={{ borderLeft: '2px solid var(--border-2)', paddingLeft: '1.2rem' }}>
            <div style={{ fontFamily: 'var(--font-m)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '0.7rem' }}>{item.label}</div>
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
    </section>
  )
}