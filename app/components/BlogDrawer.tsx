'use client'

import { useEffect, useRef } from 'react'
import type { Post } from '../lib/post'
import { useDrawerScrollLock } from '../lib/useDrawerScrollLock'

interface Props {
  post: Post | null
  onClose: () => void
}

export default function BlogDrawer({ post, onClose }: Props) {
  const isOpen = !!post
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
        aria-label={post?.title ?? 'Blog post'}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      >
        <div className="detail-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
            <span
              style={{
                fontFamily: 'var(--font-m)',
                fontSize: '0.62rem',
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
                color: 'var(--fg-dimmer)',
              }}
            >
              {post?.label ?? 'Writing'}
            </span>
            {post?.status === 'soon' && (
              <span
                style={{
                  fontFamily: 'var(--font-m)',
                  fontSize: '0.58rem',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  color: 'var(--accent)',
                  border: '1px solid var(--accent-b)',
                  padding: '0.15rem 0.5rem',
                  borderRadius: '100px',
                }}
              >
                Coming Soon
              </span>
            )}
          </div>

          <button
            onClick={onClose}
            className="detail-drawer-close"
            aria-label="Close blog drawer"
          >
            &times;
          </button>
        </div>

        <div ref={scrollRef} className="detail-drawer-scroll" tabIndex={-1}>
          {post && (
            <>
              <div className="detail-drawer-media-shell">
                <div className="detail-drawer-media">
                  {post.img ? (
                    <img
                      src={post.img}
                      alt={post.title}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        display: 'block',
                      }}
                    />
                  ) : (
                    <span
                      style={{
                        fontFamily: 'var(--font-m)',
                        fontSize: '0.62rem',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase',
                        color: 'var(--fg-dimmer)',
                      }}
                    >
                      No cover image
                    </span>
                  )}
                </div>
              </div>

              <div
                style={{
                  padding: '2rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '1.5rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      color: 'var(--fg-dimmer)',
                    }}
                  >
                    {post.publishDate}
                  </span>
                  <span
                    style={{
                      width: 3,
                      height: 3,
                      borderRadius: '50%',
                      background: 'var(--fg-dimmer)',
                    }}
                  />
                  <span
                    style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.6rem',
                      letterSpacing: '0.1em',
                      color: 'var(--fg-dimmer)',
                    }}
                  >
                    {post.readTime}
                  </span>
                  {post.tags.map(tag => (
                    <span
                      key={tag}
                      style={{
                        fontFamily: 'var(--font-m)',
                        fontSize: '0.58rem',
                        letterSpacing: '0.08em',
                        textTransform: 'uppercase',
                        color: 'var(--accent)',
                        border: '1px solid var(--accent-b)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '100px',
                        background: 'rgba(255,255,255,0.34)',
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                <div>
                  <h2
                    style={{
                      fontFamily: 'var(--font-d)',
                      fontSize: '1.6rem',
                      fontWeight: 700,
                      letterSpacing: '-0.03em',
                      lineHeight: 1.15,
                      color: 'var(--fg)',
                    }}
                  >
                    {post.title}
                  </h2>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div
                  style={{
                    background: 'linear-gradient(180deg, rgba(255,255,255,0.32), rgba(255,255,255,0.16))',
                    border: '1px solid var(--border)',
                    borderRadius: '18px',
                    padding: '1.1rem 1.3rem',
                    boxShadow: '0 10px 26px rgba(0,0,0,0.06)',
                  }}
                >
                  <div
                    style={{
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.58rem',
                      letterSpacing: '0.2em',
                      textTransform: 'uppercase',
                      color: 'var(--accent)',
                      marginBottom: '0.5rem',
                    }}
                  >
                    TL;DR
                  </div>
                  <p
                    style={{
                      fontSize: '0.88rem',
                      color: 'var(--fg-dim)',
                      lineHeight: 1.7,
                      fontStyle: 'italic',
                    }}
                  >
                    {post.tldr}
                  </p>
                </div>

                <div style={{ height: 1, background: 'var(--border)' }} />

                {post.sections.map((section, i) => (
                  <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                    <h3
                      style={{
                        fontFamily: 'var(--font-d)',
                        fontSize: '1.05rem',
                        fontWeight: 600,
                        letterSpacing: '-0.02em',
                        lineHeight: 1.2,
                        color: 'var(--fg)',
                      }}
                    >
                      {section.heading}
                    </h3>
                    <p
                      style={{
                        fontSize: '0.89rem',
                        color: 'var(--fg-dim)',
                        lineHeight: 1.78,
                      }}
                    >
                      {section.body}
                    </p>
                  </div>
                ))}

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
                    Takeaway
                  </div>
                  <p
                    style={{
                      fontSize: '0.89rem',
                      color: 'var(--fg-dim)',
                      lineHeight: 1.75,
                    }}
                  >
                    {post.takeaway}
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
