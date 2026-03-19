'use client'

import { useEffect, useRef } from 'react'

const POSTS = [
  {
    title: "What Uber's Vector Search Blog Doesn't Tell PMs",
    desc: "The engineering post explains ANN search at scale. It doesn't explain the PM decision it forced — and most PMs will miss the recall-latency tradeoff entirely.",
    img: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=640&q=80',
    href: '#',
    status: 'live' as const,
  },
  {
    title: "Why Your LLM Feature Isn't a Product",
    desc: "A GPT-4 wrapper is not a strategy. Most AI features fail not because the model is wrong, but because there's no feedback loop and no defensible wedge.",
    img: 'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=640&q=80',
    href: '#',
    status: 'live' as const,
  },
  {
    title: 'The Hidden PM Decision in Every Embedding Choice',
    desc: "When you pick Ada-002 over a fine-tuned model, you're making a product bet on update frequency and acceptable recall thresholds — not a technical choice.",
    img: null,
    href: '#',
    status: 'soon' as const,
  },
]

function addGlow(el: HTMLElement, e: MouseEvent) {
  const r = el.getBoundingClientRect()
  el.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%')
  el.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%')
  el.style.setProperty('--ga', (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * (180 / Math.PI) + 90) + 'deg')
}

export default function Blog() {
  const cardRefs = useRef<(HTMLAnchorElement | null)[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } }) }, { threshold: 0.07 })
    document.querySelectorAll('#blog .fu').forEach(el => obs.observe(el))

    const handlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = []
    cardRefs.current.forEach(el => {
      if (!el) return
      const fn = (e: MouseEvent) => addGlow(el, e)
      el.addEventListener('mousemove', fn)
      handlers.push({ el, fn })
    })
    return () => {
      obs.disconnect()
      handlers.forEach(({ el, fn }) => el.removeEventListener('mousemove', fn))
    }
  }, [])

  return (
    <section id="blog">
      <div className="eyebrow">03 — Writing</div>

      <div className="fu" style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 'clamp(2.2rem,4.5vw,3.5rem)', fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05 }}>
          Read my <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>Blogs</em>
        </h2>
        <p style={{ fontSize: '0.9rem', color: 'var(--fg-dim)', marginTop: '0.75rem', maxWidth: 400, marginInline: 'auto', lineHeight: 1.68 }}>
          One argued position per post. Engineering posts decoded for what they actually force PMs to decide.
        </p>
      </div>

      <div className="fu s1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.5rem' }}>
        {POSTS.map((post, i) => (
          <a
            key={i}
            href={post.href}
            ref={el => { cardRefs.current[i] = el }}
            className="glow-card"
            style={{
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              borderRadius: 10, overflow: 'hidden',
              display: 'flex', flexDirection: 'column',
              cursor: 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              textDecoration: 'none',
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.4)' }}
            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
          >
            {/* Image */}
            <div style={{ overflow: 'hidden', aspectRatio: '4/3', position: 'relative' }}>
              {post.img ? (
                <img
                  src={post.img}
                  alt={post.title}
                  loading="lazy"
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = '' }}
                />
              ) : (
                <div style={{ width: '100%', height: '100%', background: 'var(--bg-3)', animation: 'shimmer 1.5s ease-in-out infinite alternate' }} />
              )}
              <style>{`@keyframes shimmer{from{opacity:0.5}to{opacity:1}}`}</style>
            </div>

            {/* Body */}
            <div style={{ padding: '1.4rem 1.5rem 1.6rem', display: 'flex', flexDirection: 'column', gap: '0.85rem', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-d)', fontSize: '1.05rem', fontWeight: 600, lineHeight: 1.28, letterSpacing: '-0.02em', color: 'var(--fg)' }}>
                {post.title}
              </div>
              <div style={{ fontSize: '0.83rem', color: 'var(--fg-dim)', lineHeight: 1.62, flex: 1 }}>
                {post.desc}
              </div>
              <span style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: 'var(--font-b)', fontSize: '0.82rem', fontStyle: 'italic',
                color: post.status === 'soon' ? 'var(--fg-dimmer)' : 'var(--fg-dim)',
                border: `1px solid ${post.status === 'soon' ? 'var(--border)' : 'var(--border-2)'}`,
                padding: '0.5rem 1.2rem', borderRadius: '100px', width: 'fit-content',
              }}>
                {post.status === 'soon' ? 'Coming Soon' : 'Read Now'}
              </span>
            </div>
          </a>
        ))}
      </div>
    </section>
  )
}