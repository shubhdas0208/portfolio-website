'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

interface NowData {
  building: string
  reading: string
  thinking: string
  obsessing: string
  obsessing_label: string
  updated_at: string
}

interface Book {
  id: number
  title: string
  author: string
  cover_url: string
  display_order: number
}

interface GitHubDay {
  date: string
  contributionCount: number
}

export default function About() {
  const [now, setNow] = useState<NowData | null>(null)
  const [books, setBooks] = useState<Book[]>([])
  const [activeBook, setActiveBook] = useState(0)
  const [githubDays, setGithubDays] = useState<GitHubDay[]>([])

  useEffect(() => {
    supabase.from('now').select('*').eq('id', 1).single()
      .then(({ data }) => { if (data) setNow(data) })

    supabase.from('books').select('*').eq('is_active', true).order('display_order')
      .then(({ data }) => { if (data) setBooks(data) })

    fetch('/api/github').then(r => r.json()).then(d => {
      if (d.days) setGithubDays(d.days)
    })
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } })
    }, { threshold: 0.07 })
    document.querySelectorAll('#about .fu').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  const updatedAt = now?.updated_at
    ? new Date(now.updated_at).toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })
    : 'Recently'

  const maxContrib = Math.max(...githubDays.map(d => d.contributionCount), 1)

  const getColor = (count: number) => {
    if (count === 0) return 'var(--bg-3)'
    const intensity = count / maxContrib
    if (intensity < 0.25) return 'rgba(249,115,22,0.25)'
    if (intensity < 0.5) return 'rgba(249,115,22,0.5)'
    if (intensity < 0.75) return 'rgba(249,115,22,0.75)'
    return '#f97316'
  }

  return (
    <section id="about">
      <div className="eyebrow">04 — About</div>

      <div className="fu about-main-grid">

        {/* LEFT COLUMN -- static about text */}
        <div className="about-left">
          <div style={{
            fontFamily: 'var(--font-d)',
            fontSize: 'clamp(1.3rem,2.3vw,1.8rem)',
            fontWeight: 600,
            lineHeight: 1.3,
            letterSpacing: '-0.025em',
            marginBottom: '1.35rem',
          }}>
            &ldquo;The most interesting PM problems are really{' '}
            <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>people problems</em>
            {' '}— why do people use things the wrong way, and what does that tell you about what they actually needed?&rdquo;
          </div>

          <p style={{ fontSize: '0.88rem', color: 'var(--fg-dim)', lineHeight: 1.72, marginBottom: '1.75rem' }}>
            Final year Electronics and Instrumentation student at BITS Pilani Goa, with a Finance minor. I did not choose product — I drifted into it slowly, by noticing I kept asking questions no one else in the room was asking. At some point that instinct became a career direction.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.4rem' }}>
            {[
              {
                label: 'How I think about product',
                text: 'I connect dots across things that seem unrelated until they are not. Electronics taught me how systems fail. Finance taught me how incentives shape behavior. In AI products, model behavior is not a technical constraint — it is a design surface.',
              },
              {
                label: 'Why AI PM specifically',
                text: 'Because it is the first time in a while that the technology is genuinely ahead of the use cases. I want to be in the room figuring out what the new problems are.',
              },
              {
                label: 'One more thing',
                text: 'Outside of work I train, read, and travel when I can. Currently working through a mix of history and mythology — a surprisingly good lens for understanding why people and institutions behave the way they do.',
              },
            ].map(block => (
              <div key={block.label}>
                <div style={{ fontFamily: 'var(--font-m)', fontSize: '0.58rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--fg-dimmer)', marginBottom: '0.4rem' }}>{block.label}</div>
                <p style={{ fontSize: '0.89rem', color: 'var(--fg-dim)', lineHeight: 1.72, margin: 0 }}>{block.text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN -- live now panel */}
        <div className="about-right">

          {/* Book stack */}
          <div className="now-card">
            <div className="now-card-label">
              <span className="live-dot" />
              Currently reading
            </div>
            <div style={{ position: 'relative', height: 180, marginTop: '0.75rem' }}>
              {books.map((book, i) => {
                const offset = books.length - 1 - i
                const isActive = i === activeBook
                return (
                  <div
                    key={book.id}
                    onClick={() => setActiveBook((activeBook + 1) % books.length)}
                    style={{
                      position: 'absolute',
                      top: offset * 8,
                      left: offset * 8,
                      width: 'calc(100% - 24px)',
                      height: 160,
                      borderRadius: 8,
                      overflow: 'hidden',
                      cursor: 'pointer',
                      zIndex: isActive ? books.length : offset,
                      transition: 'all 0.4s cubic-bezier(0.16,1,0.3,1)',
                      border: '1px solid var(--border)',
                      background: 'var(--bg-3)',
                    }}
                  >
                    {book.cover_url ? (
                      <img src={book.cover_url} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', textAlign: 'center' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg)', marginBottom: '0.25rem' }}>{book.title}</div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--fg-dim)' }}>{book.author}</div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
            {books[activeBook] && (
              <div style={{ marginTop: '0.6rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 500, color: 'var(--fg)' }}>{books[activeBook].title}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--fg-dim)' }}>{books[activeBook].author}</div>
              </div>
            )}
          </div>

          {/* Thinking about */}
          <div className="now-card">
            <div className="now-card-label">Thinking about</div>
            <p style={{ fontSize: '0.88rem', fontStyle: 'italic', color: 'var(--fg-dim)', lineHeight: 1.65, margin: '0.6rem 0 0', borderLeft: '2px solid var(--accent)', paddingLeft: '0.85rem' }}>
              {now?.thinking ?? '...'}
            </p>
          </div>

          {/* Obsessing over */}
          <div className="now-card">
            <div className="now-card-label">Obsessing over</div>
            {now?.obsessing_label && (
              <div style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--fg)', marginTop: '0.5rem' }}>{now.obsessing_label}</div>
            )}
            <p style={{ fontSize: '0.84rem', color: 'var(--fg-dim)', lineHeight: 1.65, margin: '0.35rem 0 0' }}>
              {now?.obsessing ?? '...'}
            </p>
          </div>

          {/* GitHub contributions */}
          <div className="now-card">
            <div className="now-card-label">GitHub activity</div>
            <div style={{ display: 'flex', gap: 4, marginTop: '0.75rem', flexWrap: 'wrap' }}>
              {githubDays.length > 0 ? githubDays.map((day, i) => (
                <div
                  key={i}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                  style={{
                    width: 18,
                    height: 18,
                    borderRadius: 3,
                    background: getColor(day.contributionCount),
                    transition: 'transform 0.15s',
                    cursor: 'default',
                  }}
                />
              )) : Array.from({ length: 14 }).map((_, i) => (
                <div key={i} style={{ width: 18, height: 18, borderRadius: 3, background: 'var(--bg-3)' }} />
              ))}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--fg-dimmer)', marginTop: '0.5rem', fontFamily: 'var(--font-m)' }}>
              Last 14 days
            </div>
          </div>

          {/* Last updated */}
          <div style={{ fontFamily: 'var(--font-m)', fontSize: '0.6rem', color: 'var(--fg-dimmer)', letterSpacing: '0.1em', textAlign: 'right' }}>
            Last updated <span style={{ color: 'var(--accent)' }}>{updatedAt}</span>
          </div>

        </div>
      </div>

      <style>{`
        .about-main-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 4rem;
          align-items: start;
          margin-top: 0.5rem;
        }
        .about-right {
          display: flex;
          flex-direction: column;
          gap: 1rem;
          position: sticky;
          top: 6rem;
        }
        .now-card {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1.1rem 1.25rem;
        }
        .now-card-label {
          font-family: var(--font-m);
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          display: flex;
          align-items: center;
          gap: 6px;
        }
        .live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          display: inline-block;
          animation: pulse 2s ease-in-out infinite;
        }
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 900px) {
          .about-main-grid { grid-template-columns: 1fr; }
          .about-right { position: static; }
        }
      `}</style>
    </section>
  )
}
