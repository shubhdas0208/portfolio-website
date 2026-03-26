'use client'

import { useEffect, useRef, useState } from 'react'
import { POSTS, type Post } from '../lib/post'
import BlogDrawer from './BlogDrawer'

function trackGlow(el: HTMLElement, e: MouseEvent) {
  const r = el.getBoundingClientRect()
  el.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%')
  el.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%')
}

export default function Blog() {
  const [activePost, setActivePost] = useState<Post | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } })
    }, { threshold: 0.07 })
    document.querySelectorAll('#blog .fu').forEach(el => obs.observe(el))

    const handlers: Array<{ el: HTMLElement; fn: (e: MouseEvent) => void }> = []
    cardRefs.current.forEach(el => {
      if (!el) return
      const fn = (e: MouseEvent) => trackGlow(el, e)
      el.addEventListener('mousemove', fn)
      handlers.push({ el, fn })
    })

    return () => {
      obs.disconnect()
      handlers.forEach(({ el, fn }) => el.removeEventListener('mousemove', fn))
    }
  }, [])

  return (
    <>
      <section id="blog">
        <div className="eyebrow">03 — Blogs</div>

        <div className="fu" style={{ marginBottom: '3rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-d)',
            fontSize: 'clamp(2rem,4vw,3.4rem)',
            fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.05,
          }}>
            PM lens on <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>engineering.</em>
          </h2>
          <p style={{
            fontSize: '0.9rem', color: 'var(--fg-dim)',
            marginTop: '0.75rem', maxWidth: 420, lineHeight: 1.68,
          }}>
            One argued position per post. Engineering posts decoded for what they actually force PMs to decide.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
          {POSTS.map((post, i) => (
            <div
              key={post.slug}
              ref={el => { cardRefs.current[i] = el }}
              className={`glow-card blog-card fu s${i}`}
              onClick={() => setActivePost(post)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setActivePost(post) }}
              tabIndex={0}
              role="button"
              aria-label={`Read ${post.title}`}
              style={{
                background: 'var(--bg-card)',
                border: '1px solid var(--border)',
                borderRadius: 10,
                overflow: 'hidden',
                display: 'flex', flexDirection: 'column',
                cursor: 'pointer',
                textDecoration: 'none',
                opacity: post.status === 'soon' ? 0.65 : 1,
                transition: 'opacity 0.2s',
              }}
            >
              {/* Thumbnail */}
              <div style={{ overflow: 'hidden', aspectRatio: '4/3', position: 'relative', flexShrink: 0 }}>
                {post.img ? (
                  <img
                    src={post.img}
                    alt={post.title}
                    loading="lazy"
                    style={{
                      width: '100%', height: '100%', objectFit: 'cover', display: 'block',
                      transition: 'transform 0.4s cubic-bezier(0.16,1,0.3,1)',
                    }}
                    className="blog-img"
                  />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'var(--bg-3)' }} />
                )}
              </div>

              {/* Body */}
              <div style={{
                padding: '1.3rem 1.4rem 1.5rem',
                display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1,
                position: 'relative', zIndex: 1,
              }}>
                <div style={{
                  fontFamily: 'var(--font-d)',
                  fontSize: '1rem', fontWeight: 600,
                  lineHeight: 1.28, letterSpacing: '-0.02em',
                  color: 'var(--fg)',
                }}>
                  {post.title}
                </div>
                <div style={{
                  fontSize: '0.82rem', color: 'var(--fg-dim)',
                  lineHeight: 1.62, flex: 1,
                }}>
                  {post.desc}
                </div>

                {/* Arrow CTA */}
                <span className="blog-arrow">
                  {post.status === 'soon' ? (
                    <span style={{
                      fontFamily: 'var(--font-m)', fontSize: '0.68rem',
                      letterSpacing: '0.06em', color: 'var(--fg-dimmer)',
                    }}>
                      Coming Soon
                    </span>
                  ) : (
                    <>
                      <span style={{ fontFamily: 'var(--font-m)', fontSize: '0.68rem', letterSpacing: '0.06em' }}>
                        Read
                      </span>
                      <span style={{ fontSize: '0.85rem' }}>→</span>
                    </>
                  )}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Image zoom on card hover */}
        <style>{`
          .blog-card:hover .blog-img { transform: scale(1.04); }
        `}</style>
      </section>

      <BlogDrawer post={activePost} onClose={() => setActivePost(null)} />
    </>
  )
}
