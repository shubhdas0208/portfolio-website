'use client'

import { useEffect, useRef } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Post } from './Blog'
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
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <>
      <div
        className="detail-drawer-overlay"
        onClick={onClose}
        style={{ opacity: isOpen ? 1 : 0, pointerEvents: isOpen ? 'all' : 'none' }}
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
            {post?.tag && (
              <span style={{
                fontFamily: 'var(--font-m)',
                fontSize: '0.58rem',
                letterSpacing: '0.1em',
                textTransform: 'uppercase',
                color: 'var(--accent)',
                border: '1px solid var(--accent-b)',
                padding: '0.15rem 0.5rem',
                borderRadius: '100px',
              }}>
                {post.tag}
              </span>
            )}
          </div>
          <button onClick={onClose} className="detail-drawer-close" aria-label="Close blog drawer">
            &times;
          </button>
        </div>

        <div ref={scrollRef} className="detail-drawer-scroll" tabIndex={-1}>
          {post && (
            <>
              <div className="detail-drawer-media-shell">
                <div className="detail-drawer-media">
                  {post.cover_image_url ? (
                    <img
                      src={post.cover_image_url}
                      alt={post.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', background: 'var(--bg-3)' }} />
                  )}
                </div>
              </div>

              <div style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  <span style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.6rem',
                    letterSpacing: '0.1em', color: 'var(--fg-dimmer)',
                  }}>
                    {new Date(post.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}
                  </span>
                  <span style={{ width: 3, height: 3, borderRadius: '50%', background: 'var(--fg-dimmer)' }} />
                  <span style={{
                    fontFamily: 'var(--font-m)', fontSize: '0.6rem',
                    letterSpacing: '0.1em', color: 'var(--fg-dimmer)',
                  }}>
                    {post.reading_time}
                  </span>
                </div>

                <h2 style={{
                  fontFamily: 'var(--font-d)',
                  fontSize: '1.6rem', fontWeight: 700,
                  letterSpacing: '-0.03em', lineHeight: 1.15,
                  color: 'var(--fg)',
                }}>
                  {post.title}
                </h2>

                <div style={{ height: 1, background: 'var(--border)' }} />

                <div className="drawer-markdown" style={{ paddingBottom: '2rem' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{post.body ?? ''}</ReactMarkdown>
                </div>

              </div>
            </>
          )}
        </div>
      </div>

      <style>{`
        .drawer-markdown { font-size: 0.89rem; color: var(--fg-dim); line-height: 1.78; }
        .drawer-markdown h1, .drawer-markdown h2, .drawer-markdown h3 {
          font-family: var(--font-d); color: var(--fg);
          font-weight: 600; letter-spacing: -0.02em; margin: 1.5rem 0 0.5rem;
        }
        .drawer-markdown h1 { font-size: 1.3rem; }
        .drawer-markdown h2 { font-size: 1.1rem; }
        .drawer-markdown h3 { font-size: 0.95rem; }
        .drawer-markdown p { margin: 0 0 1rem; }
        .drawer-markdown strong { color: var(--fg); font-weight: 500; }
        .drawer-markdown ul, .drawer-markdown ol { padding-left: 1.5rem; margin: 0 0 1rem; }
        .drawer-markdown li { margin-bottom: 0.35rem; }
        .drawer-markdown code {
          font-family: var(--font-m); font-size: 0.82rem;
          background: var(--bg-3); padding: 0.15rem 0.4rem;
          border-radius: 4px; color: var(--accent);
        }
        .drawer-markdown blockquote {
          border-left: 2px solid var(--accent);
          margin: 1rem 0; padding: 0.5rem 1rem;
          color: var(--fg-dim); font-style: italic;
        }
        .drawer-markdown hr { border: none; border-top: 1px solid var(--border); margin: 1.5rem 0; }
        .drawer-markdown table { width: 100%; border-collapse: collapse; margin: 1rem 0; font-size: 0.84rem; }
        .drawer-markdown th { font-family: var(--font-m); font-size: 0.6rem; letter-spacing: 0.1em; text-transform: uppercase; color: var(--fg-dimmer); padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); text-align: left; }
        .drawer-markdown td { padding: 0.5rem 0.75rem; border-bottom: 1px solid var(--border); color: var(--fg-dim); }
      `}</style>
    </>
  )
}
