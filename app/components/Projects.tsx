'use client'

import { useEffect, useState } from 'react'
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
  live_url?: string
  coming_soon?: boolean
  is_published: boolean
  created_at: string
  label?: string
}

export default function Projects() {
  const [projects, setProjects] = useState<Project[]>([])
  const [active, setActive] = useState<Project | null>(null)

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
    return () => { obs.disconnect() }
  }, [projects])

  return (
    <>
      <section id="projects">
        <div className="eyebrow">03 — Projects</div>

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
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: 16,
          }}>
            {projects.map((project) => (
              <div
                key={project.slug}
                className="glow-card"
                onClick={() => setActive(project)}
                onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') setActive(project) }}
                tabIndex={0}
                role="button"
                aria-label={`Open ${project.title} case study`}
                style={{
                  borderRadius: 10,
                  border: '1px solid var(--border)',
                  background: 'var(--bg-card)',
                  cursor: 'pointer',
                  overflow: 'hidden',
                  position: 'relative',
                  transition: 'box-shadow 0.3s cubic-bezier(0.16,1,0.3,1)',
                  ...(project.coming_soon ? { opacity: 0.6 } : {}),
                }}
                onMouseEnter={project.coming_soon ? undefined : e => {
                  e.currentTarget.style.boxShadow = '0 0 0 1px var(--accent-b), 0 8px 32px rgba(0,0,0,0.12)'
                }}
                onMouseLeave={project.coming_soon ? undefined : e => {
                  e.currentTarget.style.boxShadow = ''
                }}
              >
                <div style={{ display: 'flex', flexDirection: 'column' }}>

                  {/* Image area */}
                  <div style={{
                    width: '100%',
                    aspectRatio: '16/9',
                    overflow: 'hidden',
                    borderRadius: '8px 8px 0 0',
                    background: 'var(--bg-3)',
                    flexShrink: 0,
                    position: 'relative',
                  }}>
                    {project.coming_soon && (
                      <div style={{
                        position: 'absolute',
                        top: '0.75rem',
                        left: '0.75rem',
                        padding: '0.25rem 0.65rem',
                        borderRadius: 999,
                        background: 'rgba(249,115,22,0.15)',
                        border: '1px solid rgba(249,115,22,0.4)',
                        color: '#f97316',
                        fontSize: '0.6rem',
                        fontFamily: 'var(--font-m)',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        zIndex: 2,
                      }}>
                        Coming soon
                      </div>
                    )}
                    {project.cover_image_url ? (
                      <img
                        src={project.cover_image_url}
                        alt={project.title}
                        style={{
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          display: 'block',
                        }}
                      />
                    ) : (
                      <div style={{
                        width: '100%', height: '100%',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <span style={{
                          fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                          color: 'var(--fg-dimmer)',
                        }}>No image</span>
                      </div>
                    )}
                  </div>

                  {/* Text area */}
                  <div style={{
                    padding: '1rem 1.1rem 1.2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.3rem',
                    position: 'relative',
                  }}>
                    <div style={{
                      fontFamily: 'var(--font-m)', fontSize: '0.55rem',
                      color: 'var(--fg-dimmer)', letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                    }}>
                      {project.tags?.join(' · ') ?? 'Project'}
                    </div>
                    <h3 style={{
                      fontFamily: 'var(--font-d)',
                      fontSize: '1rem',
                      fontWeight: 600,
                      lineHeight: 1.25,
                      letterSpacing: '-0.02em',
                      color: 'var(--fg)',
                      margin: 0,
                    }}>
                      {project.title}
                    </h3>
                    <p style={{
                      fontSize: '0.8rem',
                      color: 'var(--fg-dim)',
                      lineHeight: 1.55,
                      margin: 0,
                    }}>
                      {project.summary}
                    </p>
                    <span style={{
                      position: 'absolute', top: '1rem', right: '1rem',
                      fontSize: '0.85rem', color: 'var(--fg-dimmer)',
                    }}>↗</span>
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
