'use client'

import { useEffect, useRef, useState, type FormEvent } from 'react'

export default function Contact() {
  const [sendState, setSendState] = useState<'idle' | 'sending' | 'sent'>('idle')
  const resetTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => {
        entries.forEach(entry => {
          if (!entry.isIntersecting) return
          entry.target.classList.add('vis')
          obs.unobserve(entry.target)
        })
      },
      { threshold: 0.07 }
    )

    document.querySelectorAll('#contact .fu').forEach(el => obs.observe(el))
    return () => {
      obs.disconnect()
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (sendState === 'sending') return

    const form = event.currentTarget
    setSendState('sending')
    // Frontend-only placeholder flow until backend mail integration is added.
    await new Promise(resolve => setTimeout(resolve, 1200))
    form.reset()
    setSendState('sent')
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
    resetTimerRef.current = setTimeout(() => setSendState('idle'), 1500)
  }

  return (
    <>
      <section id="contact" style={{ background: 'var(--bg-2)' }}>
        <div className="eyebrow">07 - Contact</div>

        <div className="contact-wrap">
          <div className="fu">
            <h2
              style={{
                fontFamily: 'var(--font-d)',
                fontSize: 'clamp(2.5rem,6vw,5.5rem)',
                fontWeight: 700,
                lineHeight: 1,
                letterSpacing: '-0.04em',
                marginBottom: '1.5rem',
              }}
            >
              Let&apos;s
              <br />
              <em style={{ fontStyle: 'italic', color: 'var(--accent)' }}>talk.</em>
            </h2>

            <p
              className="fu s1"
              style={{
                fontSize: '0.94rem',
                fontWeight: 400,
                color: 'var(--fg-dim)',
                maxWidth: 430,
                lineHeight: 1.72,
                marginBottom: '2.2rem',
              }}
            >
              Targeting AI Platform PM and Consumer AI PM roles. Open to conversations about
              roles, AI product problems worth solving, or the right way to design an LLM eval
              layer.
            </p>

            <div className="fu s2" style={{ display: 'flex', gap: '1.1rem', flexWrap: 'wrap' }}>
              {[
                { label: 'Email ->', href: 'mailto:shubhsankalp@gmail.com' },
                { label: 'LinkedIn ->', href: 'https://www.linkedin.com/in/shubhsankalpdas/' },
                { label: 'GitHub ->', href: 'https://github.com/shubhdas0208' },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target={link.href.startsWith('http') ? '_blank' : undefined}
                  rel={link.href.startsWith('http') ? 'noreferrer' : undefined}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.4rem',
                    fontFamily: 'var(--font-m)',
                    fontSize: '0.67rem',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase',
                    color: 'var(--fg-dim)',
                    borderBottom: '1px solid var(--border-2)',
                    paddingBottom: '0.22rem',
                  }}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          <div className="fu s1">
            <form
              onSubmit={handleSubmit}
              className="contact-shell"
              aria-label="Message form"
            >
              <div className="contact-shell-head">
                <div className="contact-dots">
                  <span className="dot red" />
                  <span className="dot yellow" />
                  <span className="dot green" />
                </div>
                <span className="contact-path">user@system:~/messages</span>
              </div>

              <div className="contact-shell-body">
                <div className="contact-command">{'-> '}~ write_message.sh</div>

                <div className="contact-grid-2">
                  <label className="field">
                    <span className="field-label">--NAME</span>
                    <input
                      type="text"
                      name="name"
                      placeholder="Jane Doe"
                      autoComplete="name"
                      required
                    />
                  </label>

                  <label className="field">
                    <span className="field-label">--EMAIL</span>
                    <input
                      type="email"
                      name="email"
                      placeholder="jane@example.com"
                      autoComplete="email"
                      required
                    />
                  </label>
                </div>

                <label className="field">
                  <span className="field-label">--MESSAGE</span>
                  <textarea
                    name="message"
                    rows={6}
                    placeholder="Let's build something..."
                    required
                  />
                </label>

                <div className="contact-actions">
                  <button
                    type="submit"
                    className={`send-btn ${sendState}`}
                    disabled={sendState === 'sending'}
                  >
                    {sendState === 'idle' && '-> ./execute_send'}
                    {sendState === 'sending' && '-> [ sending... ]'}
                    {sendState === 'sent' && '-> [ message_sent ✓ ]'}
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </section>

      <footer
        style={{
          padding: '1.75rem 4rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderTop: '1px solid var(--border)',
          gap: '1rem',
          flexWrap: 'wrap',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-m)',
            fontSize: '0.59rem',
            color: 'var(--fg-dimmer)',
            letterSpacing: '0.1em',
          }}
        >
          {'\u00A9'} 2026 Shubh Sankalp Das - All rights reserved.
        </span>
        <span
          style={{
            fontFamily: 'var(--font-m)',
            fontSize: '0.59rem',
            color: 'var(--fg-dimmer)',
            letterSpacing: '0.1em',
          }}
        >
          Next.js · Supabase · Vercel
        </span>
      </footer>

      <style>{`
        .contact-wrap {
          display: grid;
          grid-template-columns: minmax(300px, 430px) minmax(320px, 1fr);
          gap: 2.2rem;
          align-items: start;
        }

        .contact-shell {
          border: 1px solid var(--border-2);
          border-radius: 14px;
          background:
            radial-gradient(120% 90% at 0% 0%, rgba(255,255,255,0.06), transparent 60%),
            linear-gradient(180deg, rgba(0,0,0,0.28), rgba(0,0,0,0.32));
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          overflow: hidden;
        }

        .contact-shell-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-bottom: 1px solid var(--border-2);
          padding: 0.65rem 0.95rem;
        }

        .contact-dots {
          display: inline-flex;
          gap: 0.45rem;
        }

        .dot {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          display: inline-block;
        }

        .dot.red { background: #ff5f57; }
        .dot.yellow { background: #febc2e; }
        .dot.green { background: #28c840; }

        .contact-path {
          font-family: var(--font-m);
          font-size: 0.62rem;
          letter-spacing: 0.08em;
          color: var(--fg-dimmer);
        }

        .contact-shell-body {
          padding: 1.2rem 1rem 1rem;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .contact-command {
          font-family: var(--font-m);
          font-size: 0.75rem;
          color: #f2eee8;
          letter-spacing: 0.03em;
        }

        .contact-grid-2 {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 0.85rem;
        }

        .field {
          display: flex;
          flex-direction: column;
          gap: 0.4rem;
        }

        .field-label {
          font-family: var(--font-m);
          font-size: 0.62rem;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          color: var(--fg-dimmer);
        }

        .field input,
        .field textarea {
          width: 100%;
          border: 1px solid rgba(255,255,255,0.14);
          border-radius: 8px;
          background: rgba(255,255,255,0.05);
          color: #f4efe8;
          font-family: var(--font-m);
          font-size: 0.95rem;
          padding: 0.8rem 0.85rem;
          outline: none;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .field input::placeholder,
        .field textarea::placeholder {
          color: rgba(255,255,255,0.35);
        }

        .field input:focus,
        .field textarea:focus {
          border-color: var(--accent-b);
          box-shadow: 0 0 0 3px rgba(255,107,0,0.14);
        }

        .field textarea {
          resize: vertical;
          min-height: 140px;
        }

        .contact-actions {
          display: flex;
          justify-content: flex-end;
        }

        .send-btn {
          border: none;
          background: transparent;
          color: #f6f0e6;
          font-family: var(--font-m);
          font-size: 0.78rem;
          letter-spacing: 0.06em;
          text-transform: none;
          padding: 0.3rem 0;
          cursor: pointer;
        }

        .send-btn:hover {
          color: var(--accent);
        }

        .send-btn.sending {
          color: #ffbe69;
          cursor: wait;
        }

        .send-btn.sent {
          color: #56e57a;
        }

        [data-theme=light] .contact-shell {
          background:
            radial-gradient(120% 90% at 0% 0%, rgba(255,255,255,0.48), transparent 62%),
            linear-gradient(180deg, rgba(26,26,26,0.06), rgba(26,26,26,0.1));
        }

        [data-theme=light] .contact-command,
        [data-theme=light] .send-btn {
          color: #1f1f1f;
        }

        [data-theme=light] .field input,
        [data-theme=light] .field textarea {
          border: 1px solid rgba(26,26,26,0.14);
          background: rgba(255,255,255,0.5);
          color: #1f1f1f;
        }

        [data-theme=light] .field input::placeholder,
        [data-theme=light] .field textarea::placeholder {
          color: rgba(26,26,26,0.38);
        }

        @media (max-width: 980px) {
          .contact-wrap {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .contact-grid-2 {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </>
  )
}
