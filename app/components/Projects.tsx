'use client'

import { useEffect, useRef, useState } from 'react'
import { supabase } from '../lib/supabase'
import ProjectDrawer from './ProjectDrawer'

export interface Project {
  id: string
  slug: string
  title: string
  summary: string
  tags: string[]
  body: string
  cover_image_url?: string
  diagram_url?: string
  is_published: boolean
  created_at: string
  label?: string
}

function trackGlow(el: HTMLElement, e: MouseEvent) {
  const r = el.getBoundingClientRect()
  el.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100) + '%')
  el.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100) + '%')
}

const CARD_STYLES: Record<number, { gridColumn: string; gridRow: string }> = {
  0: { gridColumn: 'span 2', gridRow: 'span 2' },
  1: { gridColumn: 'span 1', gridRow: 'span 1' },
  2: { gridColumn: 'span 1', gridRow: 'span 1' },
  3: { gridColumn: 'span 2', gridRow: 'span 1' },
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [active, setActive] = useState<Project | null>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .eq('is_published', true)
      .order('created_at', { ascending: false })
      .then(({ data }) => { if (data) setProjects(data) })
  }, [])

  useEffect(() => {
    const obs = new IntersectionObserver(es => {
      es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } })
    }, { threshold: 0.07 })
    document.querySelectorAll('#projects .fu').forEach(el => obs.observe(el))

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
  }, [projects])

  return (
    <>
      <section id="projects">
        <div className="eyebrow">02 — Projects</div>

        <div className="fu" style={{ marginBottom: '2.5rem' }}>
          <h2 style={{
            fontFamily: 'var(--font-d)', fontSize: 'clamp(2rem,4vw,3.4rem)',
            fontWeight: 700, lineHeight: 1.05, letterSpacing: '-0.03em',
          }}>
            Projects that <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>shipped.</em>
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--fg-dim)', marginTop: '0.6rem', maxWidth: 420, lineHeight: 1.65 }}>
            Real products, real constraints, real things that broke. Click any card to open the full case study.
          </p>
        </div>

        {projects.length === 0 ? (
          <p style={{ fontSize: '0.88rem', color: 'var(--fg-dimmer)' }}>No projects published yet.</p>
        ) : (
          <div className="fu s1" style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gridAutoRows: 220,
            gap: 10,
          }}>
            {projects.map((project, i) => (
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
                  ...(CARD_STYLES[i] ?? {}),
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: i === 0 ? 'var(--bg-3)' : 'var(--bg-card)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.boxShadow = '0 0 0 1px var(--accent-b), 0 8px 32px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div style={{
                  position: 'relative', zIndex: 1, height: '100%',
                  padding: '1.5rem',
                  display: 'flex', flexDirection: 'column', justifyContent: 'space-between',
                }}>
                  <div>
                    <div style={{
                      fontFamily: 'var(--font-m)', fontSize: '0.59rem',
                      color: 'var(--fg-dimmer)', letterSpacing: '0.08em',
                    }}>
                      {project.tags?.[0] ?? 'Project'}
                    </div>
                    <span style={{
                      position: 'absolute', top: '1.5rem', right: '1.5rem',
                      fontSize: '0.95rem', color: 'var(--fg-dimmer)',
                      transition: 'color 0.2s, transform 0.2s cubic-bezier(0.16,1,0.3,1)',
                    }}
                      onMouseEnter={e => {
                        (e.currentTarget as HTMLSpanElement).style.color = 'var(--accent)'
                        ;(e.currentTarget as HTMLSpanElement).style.transform = 'translate(2px,-2px)'
                      }}
                      onMouseLeave={e => {
                        (e.currentTarget as HTMLSpanElement).style.color = 'var(--fg-dimmer)'
                        ;(e.currentTarget as HTMLSpanElement).style.transform = ''
                      }}
                    >↗</span>
                    <h3 style={{
                      fontFamily: 'var(--font-d)',
                      fontSize: i === 0 ? '1.3rem' : '1.05rem',
                      fontWeight: 600, lineHeight: 1.2,
                      letterSpacing: '-0.02em', marginTop: '0.5rem',
                      color: 'var(--fg)',
                    }}>
                      {project.title}
                    </h3>
                    <p style={{
                      fontSize: '0.82rem', color: 'var(--fg-dim)',
                      lineHeight: 1.58, marginTop: '0.4rem',
                    }}>
                      {i === 0 ? project.summary : project.tags.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      <ProjectDrawer project={active} onClose={() => setActive(null)} />
    </>
  )
}
