'use client'

import { useEffect, useRef, useState } from 'react'

const EXP = [
  {
    dates: 'Jul 2025 — Dec 2025',
    role: 'Product Intern',
    company: 'Dezerv Investments Pvt. Ltd. · Internship · Bengaluru, India',
    bullets: [
      { bold: 'M1 retention lifted from 38% to 51%', rest: ' by conducting user research on weekly portfolio tracking needs and shipping the Portfolio Snapshot feature.' },
      { bold: 'Status misclassification reduced from 94% to 2%', rest: ' by engineering a client call status identifier that analysed transcripts using classification rules.' },
      { bold: '18% more conversions with the same RM capacity', rest: ' by developing an affluent user model using salary, spend, and investment patterns.' },
      { bold: 'Session time increased 40% in a controlled cohort', rest: ' by discovering the need for actionable insights and integrating Thurro AI into the stocks page.' },
    ],
  },
  {
    dates: 'Apr 2024 — Apr 2025',
    role: 'Investment Analyst Intern',
    company: '91Ventures · Internship · Remote',
    bullets: [
      { bold: 'Portfolio review time reduced by 83%', rest: ' (30 to 5 minutes) by consolidating MIS reports into curated summaries for 200+ LPs.' },
      { bold: 'Quarterly LP reporting effort cut by 98.9%', rest: ' (48 hours to 60 minutes) by programming Excel automation for the reporting workflow.' },
      { bold: 'Deal closure time cut by 50%', rest: ' (60 days to 30 days) by establishing standardised deal documentation and communication workflows.' },
    ],
  },
  {
    dates: 'May 2024 — Jul 2024',
    role: 'Business Analyst Intern',
    company: 'Multigraphics Group · Internship · Delhi, India',
    bullets: [
      { bold: 'Dealership inquiries increased 3x in 30 days', rest: ' (33 to 95) by identifying user drop-off due to lack of product context and redesigning the inquiry flow.' },
      { bold: 'Conversion rate increased from under 1% to 1.8% in 60 days', rest: ' by analysing data identifying delivery drivers as the highest-intent cohort and restructuring outreach.' },
      { bold: 'Bounce rate reduced from 92% to 27% within 45 days', rest: ' by restructuring homepage CTAs with product categories and test drive options.' },
    ],
  },
  {
    dates: 'Mar 2024 — Apr 2024',
    role: 'Product Intern',
    company: 'Product Space · Internship · Remote',
    bullets: [
      { bold: '+15% signups within 2 weeks', rest: ' by restructuring the website with testimonials and sample decks to address the trust barrier, validated via A/B testing.' },
      { bold: '22% higher conversion rate than other traffic sources', rest: ' achieved by releasing a monthly Product Newsletter to drive cohort awareness.' },
      { bold: 'Lead attribution time cut by 1 week, cost per signup reduced 25-30%', rest: ' by implementing a UTM-linked conversion dashboard tracking 9 sources.' },
    ],
  },
]

export default function Experience() {
  const timelineRef = useRef<HTMLDivElement>(null)
  const [fillHeight, setFillHeight] = useState(0)

  useEffect(() => {
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } }) }, { threshold: 0.07 })
    document.querySelectorAll('#experience .fu').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      if (!timelineRef.current) return
      const rect = timelineRef.current.getBoundingClientRect()
      const totalHeight = timelineRef.current.scrollHeight
      const viewportMid = window.innerHeight * 0.6
      const scrolled = viewportMid - rect.top
      const pct = Math.max(0, Math.min(1, scrolled / totalHeight))
      setFillHeight(pct * 100)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section id="experience">
      <div className="eyebrow">05 — Work Experience</div>
      <div className="fu">
        <h2 className="sec-title">Where I&apos;ve<br /><em>worked.</em></h2>
      </div>
      <a
        href="https://drive.google.com/file/d/1BA4IKjQMZAQbHeRM5nver6vW0qQF7s7Y/view?usp=sharing"
        target="_blank"
        rel="noopener noreferrer"
        className="fu s1"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.6rem',
          padding: '0.65rem 1.2rem',
          fontFamily: 'var(--font-m)',
          fontSize: '0.7rem',
          letterSpacing: '0.08em',
          textTransform: 'uppercase',
          color: 'var(--bg)',
          backgroundColor: 'var(--accent)',
          border: 'none',
          borderRadius: '0.4rem',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          marginBottom: '2.25rem',
          fontWeight: 500,
          textDecoration: 'none',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.opacity = '0.85'
          e.currentTarget.style.transform = 'translateY(-1px)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.opacity = '1'
          e.currentTarget.style.transform = 'translateY(0)'
        }}
      >
        Download resume ↗
      </a>
      <div ref={timelineRef} className="fu s2 exp-timeline">
        {EXP.map((exp, i) => (
          <div key={i} className="exp-entry">
            <div className="exp-content">
              {/* Dates */}
              <div style={{
                fontFamily: 'var(--font-m)', fontSize: '0.6rem',
                color: 'var(--fg-dimmer)', letterSpacing: '0.08em', marginBottom: '0.4rem',
              }}>
                {exp.dates}
              </div>

              {/* Role with dot aligned to it */}
              <div className="exp-role-row">
                <div className="exp-dot-wrap">
                  <div className="exp-dot" />
                  <div className="exp-dot-ring" />
                </div>
                <div className="exp-role">
                  {exp.role}
                </div>
              </div>

              {/* Company */}
              <div style={{
                fontSize: '0.83rem',
                color: 'var(--accent)',
                fontWeight: 400,
                fontFamily: 'var(--font-m)',
                letterSpacing: '0.04em',
                marginBottom: '1.1rem',
                opacity: 0.85,
              }}>
                {exp.company}
              </div>

              {/* Bullets */}
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.42rem' }}>
                {exp.bullets.map((b, j) => (
                  <li key={j} style={{
                    fontSize: '0.86rem', fontWeight: 400,
                    color: 'var(--fg-dim)', lineHeight: 1.65,
                    paddingLeft: '1.1rem', position: 'relative',
                  }}>
                    <span style={{ position: 'absolute', left: 0, color: 'var(--fg-dimmer)', fontSize: '0.75rem' }}>—</span>
                    <strong style={{ color: 'var(--fg)', fontWeight: 500 }}>{b.bold}</strong>{b.rest}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}

        {/* Timeline track (background) */}
        <div className="exp-track" />
        {/* Timeline track (accent fill, animated) */}
        <div className="exp-track-fill" style={{ height: `${fillHeight}%` }} />
      </div>

      <style>{`
        .exp-timeline {
          position: relative;
          padding-left: 3rem;
          margin-left: 0.5rem;
        }

        .exp-track {
          position: absolute;
          left: 5px;
          top: 0;
          bottom: 0;
          width: 2px;
          background: var(--border-2);
          border-radius: 2px;
          z-index: 0;
        }

        .exp-track-fill {
          position: absolute;
          left: 5px;
          top: 0;
          width: 2px;
          background: var(--accent);
          border-radius: 2px;
          z-index: 1;
          transition: height 0.3s ease-out;
        }

        .exp-entry {
          position: relative;
          display: flex;
          gap: 0;
          padding-bottom: 3.5rem;
        }

        .exp-entry:last-child {
          padding-bottom: 0;
        }

        .exp-role-row {
          display: flex;
          align-items: center;
          position: relative;
        }

        .exp-dot-wrap {
          position: absolute;
          left: -3rem;
          width: 12px;
          height: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }

        .exp-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--accent);
          border: 2.5px solid var(--bg);
          box-shadow: 0 0 0 2px var(--accent);
          transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.3s ease;
          z-index: 2;
        }

        .exp-dot-ring {
          position: absolute;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          border: 1.5px solid var(--accent);
          opacity: 0;
          animation: exp-ring-pulse 3s ease-in-out infinite;
          z-index: 1;
        }

        .exp-entry:first-child .exp-dot-ring {
          opacity: 1;
        }

        .exp-entry:hover .exp-dot {
          transform: scale(1.3);
          box-shadow: 0 0 0 3px var(--accent), 0 0 12px rgba(255, 107, 0, 0.3);
        }

        .exp-content {
          flex: 1;
          min-width: 0;
        }

        .exp-role {
          font-family: var(--font-d);
          font-size: clamp(1.9rem, 3.5vw, 3.2rem);
          font-weight: 700;
          letter-spacing: -0.03em;
          line-height: 1.0;
          color: var(--fg);
          margin-bottom: 0.45rem;
        }

        @keyframes exp-ring-pulse {
          0%, 100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.6);
            opacity: 0;
          }
        }

        @media (max-width: 600px) {
          .exp-timeline {
            padding-left: 2rem;
            margin-left: 0.25rem;
          }

          .exp-track,
          .exp-track-fill {
            left: 4px;
          }

          .exp-dot-wrap {
            left: -2rem;
            width: 10px;
            height: 10px;
          }

          .exp-role {
            font-size: clamp(1.5rem, 6vw, 2rem);
            margin-bottom: 0.35rem;
          }

          .exp-dot {
            width: 10px;
            height: 10px;
            border-width: 2px;
          }

          .exp-dot-ring {
            width: 20px;
            height: 20px;
          }
        }
      `}</style>
    </section>
  )
}