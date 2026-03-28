'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import BlogDrawer from './BlogDrawer'

export interface Post {
  id: string
  slug: string
  title: string
  summary: string
  tag: string
  body: string
  reading_time: string
  cover_image_url?: string
  hero_image_url?: string
  coming_soon?: boolean
  is_published: boolean
  created_at: string
}

function trackGlow(el: HTMLElement, e: MouseEvent) {
  const r = el.getBoundingClientRect()
  el.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%')
  el.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%')
}

export default function Blog() {
  const [posts, setPosts] = useState<Post[]>([])
  const [activePost, setActivePost] = useState<Post | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setPosts(data) })
  }, [])

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
  }, [posts])

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

        {posts.length === 0 ? (
          <p style={{ fontSize: '0.88rem', color: 'var(--fg-dimmer)' }}>No posts published yet.</p>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '1.25rem' }}>
            {posts.map((post, i) => (
              <div
                key={post.slug}
                ref={el => { cardRefs.current[i] = el }}
                className="glow-card blog-card fu"
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
                  opacity: post.coming_soon ? 0.55 : 1,
                }}
                onMouseEnter={post.coming_soon ? undefined : e => {
                  e.currentTarget.style.boxShadow = '0 0 0 1px var(--accent-b), 0 8px 32px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={post.coming_soon ? undefined : e => {
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div style={{ overflow: 'hidden', aspectRatio: '4/3', position: 'relative', flexShrink: 0 }}>
                  {post.coming_soon && (
                    <div style={{
                      position: 'absolute',
                      top: '0.75rem',
                      left: '0.75rem',
                      padding: '0.25rem 0.65rem',
                      borderRadius: 999,
                      background: 'var(--accent-b)',
                      border: '1px solid var(--accent)',
                      color: 'var(--accent)',
                      fontSize: '0.6rem',
                      fontFamily: 'var(--font-m)',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      zIndex: 2,
                    }}>
                      Coming soon
                    </div>
                  )}
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
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

                <div style={{
                  padding: '1.3rem 1.4rem 1.5rem',
                  display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1,
                  position: 'relative', zIndex: 1,
                }}>
                  {post.tag && (
                    <span style={{
                      fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--accent)', border: '1px solid var(--accent-b)',
                      padding: '0.15rem 0.5rem', borderRadius: '100px',
                      alignSelf: 'flex-start',
                    }}>
                      {post.tag}
                    </span>
                  )}
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
                    {post.summary}
                  </div>
                  {post.reading_time && (
                    <span style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.08em',
                      color: 'var(--fg-dimmer)',
                      textTransform: 'uppercase',
                    }}>
                      {post.reading_time}
                    </span>
                  )}
                  <span className="blog-arrow">
                    <span style={{ fontFamily: 'var(--font-m)', fontSize: '0.68rem', letterSpacing: '0.06em' }}>
                      Read
                    </span>
                    <span style={{ fontSize: '0.85rem' }}>→</span>
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        <style>{`
          .blog-card:hover .blog-img { transform: scale(1.04); }
        `}</style>
      </section>

      <BlogDrawer post={activePost} onClose={() => setActivePost(null)} />
    </>
  )
}
