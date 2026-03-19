'use client'

import { useEffect } from 'react'

export default function About() {
  useEffect(() => {
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } }) }, { threshold: 0.07 })
    document.querySelectorAll('#about .fu').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="about">
      <div className="eyebrow">04 — About</div>
      <div className="fu" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '5rem', marginTop: '0.5rem' }}>
        <div>
          <div style={{ fontFamily: 'var(--font-d)', fontSize: 'clamp(1.3rem,2.3vw,1.8rem)', fontWeight: 600, lineHeight: 1.3, letterSpacing: '-0.025em', marginBottom: '1.35rem' }}>
            &ldquo;Good AI PM work is mostly{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>constraint mapping</em>
            {' '}— knowing what the model can&apos;t do and designing around it before anyone ships.&rdquo;
          </div>
          <p style={{ fontSize: '0.88rem', color: 'var(--fg-dim)', lineHeight: 1.72 }}>
            I came into product from a systems-thinking background. What drew me to AI specifically wasn&apos;t the hype — it was watching engineers make product decisions by default because no one else in the room understood the tradeoffs well enough to push back constructively.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.7rem' }}>
          {[
            {
              label: 'How I think about product',
              text: "Features are hypotheses. Metrics are feedback. The job is to run the fastest possible loop between the two. In AI products, model behavior is a product surface — every failure mode is a design decision you didn't make explicitly.",
            },
            {
              label: 'Why AI PM specifically',
              text: "Because AI is the first technology where the product and the system are the same thing. The model's limitations shape the UX, the latency shapes the pricing, the hallucination rate shapes trust. I want to sit in that intersection.",
            },
            {
              label: 'One more thing',
              text: "I debug things I don't understand until I understand them. Started with a motorcycle carburetor at 16. Now it's LLM context windows. Same instinct, different object.",
            },
          ].map(block => (
            <div key={block.label}>
              <div style={{ fontFamily: 'var(--font-m)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-dimmer)', marginBottom: '0.45rem' }}>{block.label}</div>
              <p style={{ fontSize: '0.89rem', fontWeight: 400, color: 'var(--fg-dim)', lineHeight: 1.72 }}>{block.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}