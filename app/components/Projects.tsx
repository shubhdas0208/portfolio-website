'use client'

import { useEffect, useRef, useState } from 'react'
import { PROJECTS, type Project } from '../lib/projects'
import ProjectDrawer from './ProjectDrawer'

function addGlow(el: HTMLElement, e: MouseEvent) {
  const r = el.getBoundingClientRect()
  el.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%')
  el.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%')
  el.style.setProperty('--ga', (Math.atan2(e.clientY - r.top - r.height / 2, e.clientX - r.left - r.width / 2) * (180 / Math.PI) + 90) + 'deg')
}

const CARD_STYLES: Record<number, { gridColumn: string; gridRow: string; background: string }> = {
  0: { gridColumn: 'span 2', gridRow: 'span 2', background: 'var(--bg-3)' },
  1: { gridColumn: 'span 1', gridRow: 'span 1', background: 'var(--bg-card)' },
  2: { gridColumn: 'span 1', gridRow: 'span 1', background: 'var(--bg-card)' },
  3: { gridColumn: 'span 2', gridRow: 'span 1', background: 'var(--bg-card)' },
}

export default function Projects() {
  const [active, setActive] = useState<Project | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    // Scroll reveal
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } }) }, { threshold: 0.07 })
    document.querySelectorAll('#projects .fu').forEach(el => obs.observe(el))

    // Glow on cards
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
    <>
      <section id="projects">
        <div className="eyebrow">02 — Selected Work</div>

        <div className="fu" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{ fontFamily: 'var(--font-d)', fontSize: 'clamp(2rem,4vw,3.4rem)', fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em' }}>
            Projects that <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>shipped.</em>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--fg-dim)', marginTop: '0.6rem', maxWidth: 420, lineHeight: 1.65 }}>
            Real products, real constraints, real things that broke. Click any card to open the full case study.
          </p>
        </div>

        <div className="fu s1" style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gridAutoRows: 220, gap: 10 }}>
          {PROJECTS.map((project, i) => (
            <div
              key={project.slug}
              ref={el => { cardRefs.current[i] = el }}
              className="glow-card"
              onClick={() => setActive(project)}
              onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setActive(project) }}
              tabIndex={0}
              role="button"
              aria-label={`Open ${project.title} case study`}
              style={{
                ...CARD_STYLES[i],
                borderRadius: 'var(--r)',
                border: '1px solid var(--border)',
                cursor: 'pointer',
                overflow: 'hidden',
                position: 'relative',
                transition: 'transform 0.22s, box-shadow 0.22s',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.45)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
            >
              <div style={{ position: 'relative', zIndex: 1, height: '100%', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ fontFamily: 'var(--font-m)', fontSize: '0.59rem', color: 'var(--fg-dimmer)', letterSpacing: '0.08em' }}>{project.label}</div>
                  <span style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', fontSize: '0.95rem', color: 'var(--fg-dimmer)' }}>↗</span>
                  <h3 style={{
                    fontFamily: 'var(--font-d)',
                    fontSize: i === 0 ? '1.3rem' : '1.05rem',
                    fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.02em', marginTop: '0.5rem',
                  }}>{project.title}</h3>
                  <p style={{ fontSize: '0.82rem', color: 'var(--fg-dim)', lineHeight: 1.58, marginTop: '0.4rem' }}>
                    {i === 0
                      ? 'Engineers spent 3+ hrs/week triaging 400+ internal docs. Built a semantic retrieval pipeline using OpenAI embeddings + Pinecone. Reduced search time by 70%.'
                      : project.tags.join(' · ')}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <ProjectDrawer project={active} onClose={() => setActive(null)} />
    </>
  )
}