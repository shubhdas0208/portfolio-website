'use client'

import { useEffect, useRef } from 'react'
import type { Post } from '../lib/post'
import { useDrawerScrollLock } from '../lib/useDrawerScrollLock'

interface Props {
  post: Post | null
  onClose: () => void
}

export default function BlogDrawer({ post, onClose }: Props) {
  const isOpen    = !!post
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
        aria-label={post?.title ?? 'Blog post'}
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <span style={{
              fontFamily: 'var(--font-m)', fontSize: '0.62rem',
              letterSpacing: '0.15em', textTransform: 'uppercase',
              color: 'var(--fg-dimmer)',
            }}>
              {post?.label ?? 'Writing'}
            </span>
            {post?.status === 'soon' && (
              <span style={{
                fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                letterSpacing: '0.1em', textTransform: 'uppercase',
                color: 'var(--accent)', border: '1px solid var(--accent-b)',
                padding: '0.15rem 0.5rem', borderRadius: '100px',
              }}>Coming Soon</span>
            )}
          </div>
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
          {post && (
            <>
              {/* Hero image or placeholder */}
              {post.img ? (
                <div style={{
                  width: '100%',
                  height: '55vh',
                  minHeight: 220,
                  overflow: 'hidden', flexShrink: 0,
                  borderBottom: '1px solid var(--border)',
                }}>
                  <img
                    src={post.img}
                    alt={post.title}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  />
                </div>
              ) : (
                <div style={{
                  width: '100%',
                  height: '55vh',
                  minHeight: 220,
                  background: 'var(--bg-3)',
                  borderBottom: '1px solid var(--border)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <span style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.62rem',
                    letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'var(--fg-dimmer)',
                  }}>No cover image</span>
                </div>
              )}

              {/* Content */}
              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                {/* Meta row */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.6rem',
                    letterSpacing: '0.1em', color: 'var(--fg-dimmer)',
                  }}>{post.publishDate}</span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--fg-dimmer)' }} />
                  <span style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.6rem',
                    letterSpacing: '0.1em', color: 'var(--fg-dimmer)',
                  }}>{post.readTime}</span>
                  {post.tags.map(tag => (
                    <span key={tag} style={{
                      fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                      letterSpacing: '0.08em', textTransform: 'uppercase',
                      color: 'var(--accent)',
                      border: '1px solid var(--accent-b)',
                      padding: '0.15rem 0.5rem', borderRadius: '100px',
                    }}>{tag}</span>
                  ))}
                </div>

                {/* Title */}
                <div>
                  <h2 style={{
                    fontFamily: 'var(--font-d)', fontSize: '1.6rem',
                    fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15,
                    color: 'var(--fg)',
                  }}>{post.title}</h2>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                {/* TL;DR */}
                <div style={{
                  background: 'var(--bg-3)',
                  border: '1px solid var(--border)',
                  borderRadius: 'var(--r)',
                  padding: '1.1rem 1.3rem',
                }}>
                  <div style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--accent)', marginBottom: '0.5rem',
                  }}>TL;DR</div>
                  <p style={{
                    fontSize: '0.88rem', color: 'var(--fg-dim)',
                    lineHeight: 1.7, fontStyle: 'italic',
                  }}>{post.tldr}</p>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                {/* Sections */}
                {post.sections.map((section, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <h3 style={{
                      fontFamily: 'var(--font-d)', fontSize: '1.05rem',
                      fontWeight: 600, letterSpacing: '-0.02em', lineHeight: 1.2,
                      color: 'var(--fg)',
                    }}>{section.heading}</h3>
                    <p style={{
                      fontSize: '0.89rem', color: 'var(--fg-dim)',
                      lineHeight: 1.78,
                    }}>{section.body}</p>
                  </div>
                ))}

                <div style={{ height: 1, background: 'var(--border)' }} />

                {/* Takeaway */}
                <div style={{ paddingBottom: '2rem' }}>
                  <div style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.58rem',
                    letterSpacing: '0.2em', textTransform: 'uppercase',
                    color: 'var(--fg-dimmer)', marginBottom: '0.55rem',
                  }}>Takeaway</div>
                  <p style={{
                    fontSize: '0.89rem', color: 'var(--fg-dim)',
                    lineHeight: 1.75,
                  }}>{post.takeaway}</p>
                </div>

              </div>
            </>
          )}
        </div>
      </div>
    </>
  )
}
