'use client'

import { useEffect, useRef } from 'react'
import type { Project } from '../lib/projects'
import { useDrawerScrollLock } from '../lib/useDrawerScrollLock'

interface Props {
  project: Project | null
  onClose: () => void
}

export default function ProjectDrawer({ project, onClose }: Props) {
  const isOpen    = !!project
  const scrollRef = useRef<HTMLDivElement>(null)

  useDrawerScrollLock(isOpen, scrollRef)

  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(0,0,0,0.72)',
          backdropFilter: 'blur(6px)',
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'all' : 'none',
          transition: 'opacity 0.3s',
        }}
      />

      {/* Drawer panel */}
      <div
        role="dialog"
        aria-modal="true"
        style={{
          position: 'fixed', top: 0, right: 0, bottom: 0,
          width: 'min(75vw, 1200px)',
          zIndex: 201,
          background: 'var(--bg-2)',
          borderLeft: '1px solid var(--border-2)',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 0.38s cubic-bezier(0.32,0,0.18,1)',
          display: 'flex',
          flexDirection: 'column',
          // No overflow:hidden — that was preventing scroll
        }}
      >
        {/* Sticky header */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.2rem 2rem',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          background: 'var(--bg-2)',
          position: 'sticky', top: 0, zIndex: 10,
        }}>
          <span style={{
            fontFamily: 'var(--font-m)', fontSize: '0.62rem',
            letterSpacing: '0.15em', textTransform: 'uppercase',
            color: 'var(--fg-dimmer)',
          }}>
            {project?.label ?? 'Case Study'}
          </span>
          <button
            onClick={onClose}
            style={{
              width: 30, height: 30, borderRadius: '50%',
              border: '1px solid var(--border-2)',
              color: 'var(--fg-dim)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.9rem', cursor: 'pointer', background: 'none',
            }}
          >✕</button>
        </div>

        {/* Scrollable body */}
        <div ref={scrollRef} style={{
          flex: 1,
          minHeight: 0,
          overflowY: 'auto',
          overflowX: 'hidden',
          overscrollBehavior: 'contain',
          WebkitOverflowScrolling: 'touch',
        }} tabIndex={-1}>
          {project && (
            <>
              {/* Demo area */}
              <div style={{
                width: '100%',
                height: '55vh',
                minHeight: 220,
                background: 'var(--bg-3)',
                borderBottom: '1px solid var(--border)',
                position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                overflow: 'hidden',
                flexShrink: 0,
              }}>
                {project.demoImg ? (
                  <>
                    <img src={project.demoImg} alt="Project demo"
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    <span style={{
                      position: 'absolute', bottom: '1rem', right: '1rem',
                      fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                      letterSpacing: '0.1em', textTransform: 'uppercase',
                      color: 'var(--accent)', border: '1px solid var(--accent-b)',
                      padding: '0.22rem 0.55rem', borderRadius: '100px',
                    }}>60s walkthrough ↗</span>
                  </>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem' }}>
                    <div style={{ fontSize: '2rem', opacity: 0.2 }}>▶</div>
                    <div style={{
                      fontFamily: 'var(--font-m)', fontSize: '0.63rem',
                      letterSpacing: '0.15em', textTransform: 'uppercase',
                      color: 'var(--fg-dimmer)',
                    }}>Add Loom embed here</div>
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>

                <div>
                  <div style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'var(--fg-dimmer)', marginBottom: '0.45rem',
                  }}>{project.label}</div>
                  <div style={{
                    fontFamily: 'var(--font-d)', fontSize: '1.7rem',
                    fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.1,
                    color: 'var(--fg)',
                  }}>{project.title}</div>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div>
                  <div style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--fg-dimmer)', marginBottom: '0.55rem',
                  }}>Problem</div>
                  <p style={{ fontSize: '0.89rem', color: 'var(--fg-dim)', lineHeight: 1.75 }}
                    dangerouslySetInnerHTML={{ __html: project.problem }} />
                </div>

                <div>
                  <div style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--fg-dimmer)', marginBottom: '0.55rem',
                  }}>Decision</div>
                  <p style={{ fontSize: '0.89rem', color: 'var(--fg-dim)', lineHeight: 1.75 }}
                    dangerouslySetInnerHTML={{ __html: project.decision }} />
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div>
                  <div style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--fg-dimmer)', marginBottom: '0.75rem',
                  }}>Metrics</div>
                  <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3,1fr)',
                    gap: 1, background: 'var(--border)',
                    borderRadius: 'var(--r)', overflow: 'hidden',
                  }}>
                    {project.metrics.map(m => (
                      <div key={m.label} style={{ background: 'var(--bg-3)', padding: '1rem 1.2rem' }}>
                        <div style={{
                          fontFamily: 'var(--font-d)', fontSize: '1.75rem',
                          fontWeight: 700, letterSpacing: '-0.03em',
                          color: 'var(--accent)', lineHeight: 1,
                        }}>{m.val}</div>
                        <div style={{
                          fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                          letterSpacing: '0.12em', textTransform: 'uppercase',
                          color: 'var(--fg-dimmer)', marginTop: '0.3rem',
                        }}>{m.label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div>
                  <div style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--fg-dimmer)', marginBottom: '0.55rem',
                  }}>What broke — and how I fixed it</div>
                  {project.broke.map(b => (
                    <div key={b.id} style={{
                      display: 'flex', gap: '1rem',
                      padding: '0.7rem 0', borderBottom: '1px solid var(--border)',
                    }}>
                      <span style={{
                        fontFamily: 'var(--font-m)', fontSize: '0.6rem',
                        color: 'var(--fg-dimmer)', flexShrink: 0,
                        width: '1.5rem', paddingTop: '0.05rem',
                      }}>{b.id}</span>
                      <div style={{ fontSize: '0.87rem', color: 'var(--fg-dim)', lineHeight: 1.68 }}
                        dangerouslySetInnerHTML={{ __html: b.text }} />
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div>
                  <div style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--fg-dimmer)', marginBottom: '0.55rem',
                  }}>Technical tradeoffs</div>
                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <tbody>
                      {project.tradeoffs.map(t => (
                        <tr key={t.key} style={{ borderBottom: '1px solid var(--border)' }}>
                          <td style={{
                            fontFamily: 'var(--font-m)', fontSize: '0.6rem',
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            color: 'var(--fg-dimmer)', width: 110,
                            paddingRight: '1.25rem',
                            paddingTop: '0.6rem', paddingBottom: '0.6rem',
                            verticalAlign: 'top',
                          }}>{t.key}</td>
                          <td style={{
                            fontSize: '0.84rem', color: 'var(--fg-dim)',
                            lineHeight: 1.65,
                            paddingTop: '0.6rem', paddingBottom: '0.6rem',
                          }}>{t.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div style={{ paddingBottom: '2rem' }}>
                  <div style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--fg-dimmer)', marginBottom: '0.55rem',
                  }}>Retrospective</div>
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
