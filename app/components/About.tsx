'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
interface NowData {
  thinking: string
  thinking_2: string
  thinking_3: string
  obsessing: string
  obsessing_label: string
  obsessing_image_url: string
  updated_at: string
}

interface Book {
  id: number
  title: string
  author: string
  cover_url: string
  note: string
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
    }).catch(() => {})
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

      <div className="fu about-bento">

        {/* ROW 1 COL 1-3: About Me */}
        <div className="about-card" style={{ gridColumn: 'span 3' }}>
          <h2 style={{
            fontFamily: 'var(--font-d)',
            fontSize: 'clamp(2rem,4vw,3.4rem)',
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: '-0.03em',
            marginBottom: '1rem',
            color: 'var(--fg)',
          }}>
            About <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>me.</em>
          </h2>
          <p style={{ fontSize: '0.9rem', color: 'var(--fg-dim)', lineHeight: 1.78, margin: '0 0 0.85rem' }}>
            I am a final year Electronics and Instrumentation student at BITS Pilani Goa, with a Finance minor. I did not choose product deliberately. I drifted into it slowly, by noticing the questions I kept asking were never really about technical output. They were always about people. Why did this feature work the way it did? What would I have been thinking if I had built this? What does the way someone uses something tell you about what they actually needed?
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--fg-dim)', lineHeight: 1.78, margin: 0 }}>
            At some point that pattern became a career direction.{' '}
            <span style={{ color: 'var(--accent)', fontWeight: 500 }}>The most interesting product problems are people problems.</span>
            {' '}Not what the system does, but why people behave the way they do around it, what would shift that behavior, and what that tells you about what actually needs to be built.
          </p>
        </div>

        {/* ROW 1 COL 4: Thinking About */}
        <div className="about-card" style={{ gridColumn: 4, gridRow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div className="about-label"><span className="about-live-dot" />Thinking about</div>
          <p style={{
            borderLeft: '2px solid var(--accent)',
            paddingLeft: '0.75rem',
            fontSize: '0.88rem',
            fontStyle: 'italic',
            color: 'var(--fg)',
            lineHeight: 1.65,
            margin: '0.5rem 0 0',
            fontWeight: 500,
          }}>
            {now?.thinking ?? '...'}
          </p>
          {now?.thinking_2 && (
            <p style={{
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '0.75rem',
              fontSize: '0.88rem',
              fontStyle: 'italic',
              color: 'var(--fg)',
              lineHeight: 1.65,
              margin: '1.5rem 0 0',
              fontWeight: 500,
            }}>
              {now.thinking_2}
            </p>
          )}
          {now?.thinking_3 && (
            <p style={{
              borderLeft: '2px solid var(--accent)',
              paddingLeft: '0.75rem',
              fontSize: '0.88rem',
              fontStyle: 'italic',
              color: 'var(--fg)',
              lineHeight: 1.65,
              margin: '1.5rem 0 0',
              fontWeight: 500,
            }}>
              {now.thinking_3}
            </p>
          )}
        </div>

        {/* ROW 1+2 COL 5: GitHub + Reading stacked */}
        <div style={{ gridRow: 'span 2', display: 'flex', flexDirection: 'column', gap: 10, alignSelf: 'start' }}>

          {/* Reading */}
          <div className="about-card" style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div className="about-label">
              <span className="about-live-dot" />
              Currently reading
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: '0.6rem', flex: 1 }}>
              {books.map((book, i) => (
                <div
                  key={book.id}
                  onClick={() => setActiveBook(i)}
                  style={{
                    flex: 1,
                    aspectRatio: '2/3',
                    borderRadius: 6,
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: activeBook === i ? '2px solid var(--accent)' : '1px solid var(--border)',
                    background: 'var(--bg-3)',
                    transition: 'border-color 0.2s',
                  }}
                >
                  {book.cover_url ? (
                    <img src={book.cover_url} alt={book.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.4rem', textAlign: 'center' }}>
                      <span style={{ fontSize: '0.65rem', color: 'var(--fg-dimmer)', lineHeight: 1.3 }}>{book.title}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
            {books[activeBook] && (
              <div style={{ marginTop: '0.6rem', paddingTop: '0.6rem', borderTop: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--fg)', marginBottom: '0.15rem' }}>{books[activeBook].title}</div>
                <div style={{ fontSize: '0.72rem', color: 'var(--fg-dim)', marginBottom: '0.25rem' }}>{books[activeBook].author}</div>
                {books[activeBook].note && (
                  <div style={{ fontSize: '0.72rem', color: 'var(--accent)', fontStyle: 'italic', lineHeight: 1.4 }}>{books[activeBook].note}</div>
                )}
              </div>
            )}
          </div>

          {/* GitHub */}
          <div className="about-card">
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <div className="about-label" style={{ margin: 0 }}>GitHub — 30 days</div>
              <a
                href="https://github.com/shubhdas0208"
                target="_blank"
                rel="noreferrer"
                style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.65rem', color: 'var(--accent)', fontFamily: 'var(--font-m)', letterSpacing: '0.06em', textDecoration: 'none' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 21.795 24 17.295 24 12c0-6.63-5.37-12-12-12"/>
                </svg>
                shubhdas0208 ↗
              </a>
            </div>
            <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
              {githubDays.length > 0 ? githubDays.map((day, i) => (
                <div
                  key={i}
                  title={`${day.date}: ${day.contributionCount} contributions`}
                  style={{ width: 14, height: 14, borderRadius: 3, background: getColor(day.contributionCount), cursor: 'default', transition: 'transform 0.15s' }}
                  onMouseEnter={e => (e.currentTarget.style.transform = 'scale(1.2)')}
                  onMouseLeave={e => (e.currentTarget.style.transform = 'scale(1)')}
                />
              )) : Array.from({ length: 30 }).map((_, i) => (
                <div key={i} style={{ width: 14, height: 14, borderRadius: 3, background: 'var(--bg-3)' }} />
              ))}
            </div>
          </div>

        </div>

        {/* ROW 2 COL 1: How I Think */}
        <div className="about-card" style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
          <div className="about-label"><span className="about-live-dot" />How I think</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--fg-dim)', lineHeight: 1.68, margin: 0 }}>
            Electronics taught me how systems fail. Finance taught me how incentives shape behavior. In AI products, model behavior is not a technical constraint — it is a design surface.
          </p>
        </div>

        {/* ROW 2 COL 2: Why AI PM */}
        <div className="about-card" style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
          <div className="about-label"><span className="about-live-dot" />Why AI PM</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--fg-dim)', lineHeight: 1.68, margin: 0 }}>
            The technology is genuinely ahead of the use cases. I want to be in the room figuring out what the new problems are.
          </p>
        </div>

        {/* ROW 2 COL 3: One More Thing */}
        <div className="about-card" style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
          <div className="about-label"><span className="about-live-dot" />Outside work</div>
          <p style={{ fontSize: '0.84rem', color: 'var(--fg-dim)', lineHeight: 1.68, margin: 0 }}>
            Outside of work I train, read, and travel when I can. Currently working through history and mythology — a surprisingly good lens for why people and institutions behave the way they do.
          </p>
        </div>

        {/* ROW 2 COL 4: Obsessing Over */}
        <div className="about-card" style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column' }}>
          <div className="about-label"><span className="about-live-dot" />Obsessing over</div>
          {now?.obsessing_image_url ? (
            <img
              src={now.obsessing_image_url}
              alt={now.obsessing_label ?? 'Obsessing over'}
              style={{ width: '100%', height: 72, objectFit: 'cover', borderRadius: 6, margin: '6px 0 5px', border: '1px solid var(--border)' }}
            />
          ) : (
            <div style={{ width: '100%', height: 72, borderRadius: 6, background: 'var(--bg-3)', margin: '6px 0 5px', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '0.6rem', color: 'var(--fg-dimmer)', fontFamily: 'var(--font-m)', letterSpacing: '0.1em' }}>image</span>
            </div>
          )}
          {now?.obsessing_label && (
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--fg)', marginBottom: '0.2rem' }}>{now.obsessing_label}</div>
          )}
          <p style={{ fontSize: '0.82rem', color: 'var(--fg-dim)', lineHeight: 1.65, margin: 0 }}>{now?.obsessing ?? '...'}</p>
        </div>

      </div>

      <p className="fu s2" style={{ fontFamily: 'var(--font-m)', fontSize: '0.6rem', color: 'var(--fg-dimmer)', marginTop: '1rem', letterSpacing: '0.1em', textAlign: 'right' }}>
        Last updated <span style={{ color: 'var(--accent)' }}>{updatedAt}</span>
      </p>

      <style>{`
        .about-bento {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr 1fr 1.5fr;
          grid-template-rows: auto auto;
          gap: 10px;
          margin-top: 0.5rem;
          align-items: stretch;
        }
        .about-card {
          background: var(--bg-2);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1rem 1.1rem;
        }
        .about-label {
          font-family: var(--font-m);
          font-size: 0.58rem;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: var(--accent);
          margin-bottom: 0.4rem;
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .about-live-dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: var(--accent);
          display: inline-block;
          animation: about-pulse 2s ease-in-out infinite;
        }
        @keyframes about-pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.5; transform: scale(0.85); }
        }
        @media (max-width: 1024px) {
          .about-bento {
            grid-template-columns: 1fr 1fr 1fr;
            grid-template-rows: unset;
          }
        }
        @media (max-width: 680px) {
          .about-bento {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  )
}
