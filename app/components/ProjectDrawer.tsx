'use client'

import { useEffect, useRef } from 'react'
import type { Project } from '../lib/projects'
import { useDrawerScrollLock } from '../lib/useDrawerScrollLock'

interface Props {
  project: Project | null
  onClose: () => void
}

export default function ProjectDrawer({ project, onClose }: Props) {
  const isOpen = !!project
  const scrollRef = useRef<HTMLDivElement>(null)

  useDrawerScrollLock(isOpen, scrollRef)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }

    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div
        className="detail-drawer-overlay"
        onClick={onClose}
        style={{
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
        }}
      />

      <div
        className="detail-drawer-panel"
        data-open={isOpen}
        role="dialog"
        aria-modal="true"
        aria-label={project?.title ?? 'Project case study'}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="detail-drawer-header">
          <span
            style={{
              fontFamily: 'var(--font-m)',
              fontSize: '0.62rem',
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              color: 'var(--fg-dimmer)',
            }}
          >
            {project?.label ?? 'Case Study'}
          </span>

          <button
            onClick={onClose}
            className="detail-drawer-close"
            aria-label="Close project drawer"
          >
            &times;
          </button>
        </div>

        <div ref={scrollRef} className="detail-drawer-scroll" tabIndex={-1}>
          {project && (
            <>
              <div className="detail-drawer-media-shell">
                <div className="detail-drawer-media">
                  {project.demoImg ? (
                    <>
                      <img
                        src={project.demoImg}
                        alt="Project demo"
                        style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      />
                      <span
                        style={{
                          position: 'absolute',
                          right: '1rem',
                          bottom: '1rem',
                          fontFamily: 'var(--font-m)',
                          fontSize: '0.58rem',
                          letterSpacing: '0.1em',
                          textTransform: 'uppercase',
                          color: 'var(--accent)',
                          border: '1px solid var(--accent-b)',
                          background: 'rgba(15,15,15,0.58)',
                          backdropFilter: 'blur(10px)',
                          padding: '0.28rem 0.7rem',
                          borderRadius: '100px',
                          boxShadow: '0 10px 24px rgba(0,0,0,0.18)',
                        }}
                      >
                        60s walkthrough &rarr;
                      </span>
                    </>
                  ) : (
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: '0.75rem',
                      }}
                    >
                      <div style={{ fontSize: '2rem', opacity: 0.2 }}>&#9654;</div>
                      <div
                        style={{
                          fontFamily: 'var(--font-m)',
                          fontSize: '0.63rem',
                          letterSpacing: '0.15em',
                          textTransform: 'uppercase',
                          color: 'var(--fg-dimmer)',
                        }}
                      >
                        Add Loom embed here
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.75rem',
                }}
              >
                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.15em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-dimmer)',
                      marginBottom: '0.45rem',
                    }}
                  >
                    {project.label}
                  </div>
                  <div
                    style={{
                      fontFamily: 'var(--font-d)',
                      fontSize: '1.7rem',
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.1,
                      color: 'var(--fg)',
                    }}
                  >
                    {project.title}
                  </div>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-dimmer)',
                      marginBottom: '0.55rem',
                    }}
                  >
                    Problem
                  </div>
                  <p
                    style={{ fontSize: '0.89rem', color: 'var(--fg-dim)', lineHeight: 1.75 }}
                    dangerouslySetInnerHTML={{ __html: project.problem }}
                  />
                </div>

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-dimmer)',
                      marginBottom: '0.55rem',
                    }}
                  >
                    Decision
                  </div>
                  <p
                    style={{ fontSize: '0.89rem', color: 'var(--fg-dim)', lineHeight: 1.75 }}
                    dangerouslySetInnerHTML={{ __html: project.decision }}
                  />
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-dimmer)',
                      marginBottom: '0.75rem',
                    }}
                  >
                    Metrics
                  </div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(3,1fr)',
                      gap: 1,
                      background: 'var(--border)',
                      borderRadius: '18px',
                      overflow: 'hidden',
                      boxShadow: '0 10px 26px rgba(0,0,0,0.06)',
                    }}
                  >
                    {project.metrics.map(m => (
                      <div
                        key={m.label}
                        style={{ background: 'var(--bg-3)', padding: '1rem 1.2rem' }}
                      >
                        <div
                          style={{
                            fontFamily: 'var(--font-d)',
                            fontSize: '1.75rem',
                            fontWeight: 700,
                            letterSpacing: '-0.03em',
                            color: 'var(--accent)',
                            lineHeight: 1,
                          }}
                        >
                          {m.val}
                        </div>
                        <div
                          style={{
                            fontFamily: 'var(--font-m)',
                            fontSize: '0.58rem',
                            letterSpacing: '0.12em',
                            textTransform: 'uppercase',
                            color: 'var(--fg-dimmer)',
                            marginTop: '0.3rem',
                          }}
                        >
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-dimmer)',
                      marginBottom: '0.55rem',
                    }}
                  >
                    What broke and how I fixed it
                  </div>
                  {project.broke.map(b => (
                    <div
                      key={b.id}
                      style={{
                        display: 'flex',
                        gap: '1rem',
                        padding: '0.7rem 0',
                        borderBottom: '1px solid var(--border)',
                      }}
                    >
                      <span
                        style={{
                          fontFamily: 'var(--font-m)',
                          fontSize: '0.6rem',
                          color: 'var(--fg-dimmer)',
                          flexShrink: 0,
                          width: '1.5rem',
                          paddingTop: '0.05rem',
                        }}
                      >
                        {b.id}
                      </span>
                      <div
                        style={{ fontSize: '0.87rem', color: 'var(--fg-dim)', lineHeight: 1.68 }}
                        dangerouslySetInnerHTML={{ __html: b.text }}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div>
                  <div
                    style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-dimmer)',
                      marginBottom: '0.55rem',
                    }}
                  >
                    Technical tradeoffs
                  </div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {project.tradeoffs.map(t => (
                        <tr key={t.key} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td
                            style={{
                              fontFamily: 'var(--font-m)',
                              fontSize: '0.6rem',
                              letterSpacing: '0.1em',
                              textTransform: 'uppercase',
                              color: 'var(--fg-dimmer)',
                              width: 110,
                              paddingRight: '1.25rem',
                              paddingTop: '0.6rem',
                              paddingBottom: '0.6rem',
                              verticalAlign: 'top',
                            }}
                          >
                            {t.key}
                          </td>
                          <td
                            style={{
                              fontSize: '0.84rem',
                              color: 'var(--fg-dim)',
                              lineHeight: 1.65,
                              paddingTop: '0.6rem',
                              paddingBottom: '0.6rem',
                            }}
                          >
                            {t.value}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div style={{ paddingBottom: '2rem' }}>
                  <div
                    style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--fg-dimmer)',
                      marginBottom: '0.55rem',
                    }}
                  >
                    Retrospective
                  </div>
                  <p style={{ fontSize: '0.89rem', color: 'var(--fg-dim)', lineHeight: 1.75 }}>
                    {project.retro}
                  </p>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
