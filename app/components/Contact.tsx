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
    const formData = new FormData(form)

    setSendState('sending')

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.get('name'),
          email: formData.get('email'),
          message: formData.get('message'),
        }),
      })

      if (!response.ok) throw new Error('Failed')

      form.reset()
      setSendState('sent')
      if (resetTimerRef.current) clearTimeout(resetTimerRef.current)
      resetTimerRef.current = setTimeout(() => setSendState('idle'), 3000)
    } catch {
      setSendState('idle')
      alert('Something went wrong. Please email me directly at dasshriyans2802@gmail.com')
    }
  }

  return (
    <>
      <section id="contact" style={{ background: 'var(--bg-2)' }}>
        <div className="eyebrow">06 - Contact</div>

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

            <div className="fu s2 contact-socials">
              {[
                {
                  label: 'LinkedIn',
                  href: 'https://www.linkedin.com/in/shubhsankalpdas/',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/>
                    </svg>
                  ),
                },
                {
                  label: 'GitHub',
                  href: 'https://github.com/shubhdas0208',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0112 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z"/>
                    </svg>
                  ),
                },
                {
                  label: 'X',
                  href: 'https://x.com/shubh_das02',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  ),
                },
                {
                  label: 'Email',
                  href: 'https://mail.google.com/mail/?view=cm&to=dasshriyans2802@gmail.com',
                  icon: (
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <rect x="2" y="4" width="20" height="16" rx="2"/>
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
                    </svg>
                  ),
                },
              ].map(link => (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="contact-social-icon"
                  aria-label={link.label}
                >
                  {link.icon}
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
                    style={{
                      border: '1px solid var(--border-2)',
                      borderRadius: 6,
                      padding: '0.45rem 1rem',
                      background: 'transparent',
                      color: 'var(--fg-dim)',
                      fontFamily: 'var(--font-m)',
                      fontSize: '0.78rem',
                      letterSpacing: '0.06em',
                      cursor: sendState === 'sending' ? 'wait' : 'pointer',
                      transition: 'border-color 0.2s, color 0.2s',
                    }}
                    onMouseEnter={e => {
                      if (sendState === 'idle') {
                        (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--accent)'
                        ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--accent)'
                      }
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLButtonElement).style.borderColor = 'var(--border-2)'
                      ;(e.currentTarget as HTMLButtonElement).style.color = 'var(--fg-dim)'
                    }}
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

        [data-theme=light] .send-btn {
          border-color: rgba(26,26,26,0.18);
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

        .contact-socials {
          display: flex;
          gap: 0.75rem;
        }

        .contact-social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 48px;
          height: 48px;
          border-radius: 10px;
          border: 1px solid var(--border-2);
          background: transparent;
          color: var(--fg-dimmer);
          text-decoration: none;
          transition: color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease, transform 0.2s ease;
        }

        .contact-social-icon:hover {
          color: var(--accent);
          border-color: var(--accent-b);
          box-shadow: 0 0 18px rgba(255, 107, 0, 0.25), 0 0 6px rgba(255, 107, 0, 0.15);
          transform: translateY(-2px);
        }

        [data-theme=light] .contact-social-icon:hover {
          box-shadow: 0 0 18px rgba(255, 107, 0, 0.2), 0 0 6px rgba(255, 107, 0, 0.1);
        }

        @media (max-width: 980px) {
          .contact-wrap {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .contact-grid-2 {
            grid-template-columns: 1fr;
          }

          .contact-socials {
            flex-wrap: wrap;
          }
        }
      `}</style>
    </>
  )
}
