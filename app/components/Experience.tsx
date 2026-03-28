'use client'

import { useEffect } from 'react'

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
  useEffect(() => {
    const obs = new IntersectionObserver(es => { es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('vis'); obs.unobserve(e.target) } }) }, { threshold: 0.07 })
    document.querySelectorAll('#experience .fu').forEach(el => obs.observe(el))
    return () => obs.disconnect()
  }, [])

  return (
    <section id="experience">
      <div className="eyebrow">06 — Work Experience</div>
      <div className="fu">
        <h2 className="sec-title">Where I&apos;ve<br /><em>worked.</em></h2>
      </div>
      <a href="/resume.pdf" className="fu s1" style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.45rem',
        fontFamily: 'var(--font-m)', fontSize: '0.65rem', letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--accent)', marginBottom: '2.25rem',
      }}>
        Download full resume ↗
      </a>
      <div className="fu s2" style={{ borderLeft: '1px solid var(--border-2)', paddingLeft: '2.5rem', marginLeft: '0.5rem' }}>
        {EXP.map((exp, i) => (
          <div key={i} style={{ position: 'relative', paddingBottom: '3.5rem' }}>
            {/* Timeline dot — scaled up to stay proportional with large titles */}
            <div style={{
              position: 'absolute', left: '-2.75rem', top: '0.6rem',
              width: 10, height: 10, borderRadius: '50%',
              background: 'var(--fg-dimmer)', border: '2px solid var(--bg)',
            }} />

            {/* Dates */}
            <div style={{
              fontFamily: 'var(--font-m)', fontSize: '0.6rem',
              color: 'var(--fg-dimmer)', letterSpacing: '0.08em', marginBottom: '0.4rem',
            }}>
              {exp.dates}
            </div>

            {/* Role — editorial scale, Clash Display headline */}
            <div style={{
              fontFamily: 'var(--font-d)',
              fontSize: 'clamp(1.9rem, 3.5vw, 3.2rem)',
              fontWeight: 700,
              letterSpacing: '-0.03em',
              lineHeight: 1.0,
              color: 'var(--fg)',
              marginBottom: '0.45rem',
            }}>
              {exp.role}
            </div>

            {/* Company — accent color, small, three-tier hierarchy */}
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
        ))}
      </div>
    </section>
  )
}
