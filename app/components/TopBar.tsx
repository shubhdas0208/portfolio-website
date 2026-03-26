'use client'

export default function TopBar() {
  return (
    <header style={{
      position: 'fixed', top: 0, left: 'var(--side-w)', right: 0,
      height: 'var(--nav-h)', zIndex: 80,
      display: 'flex', alignItems: 'center', justifyContent: 'flex-end',
      padding: '0 4rem', gap: '2rem',
      background: 'rgba(10,10,9,0.82)', backdropFilter: 'blur(14px)',
      borderBottom: '1px solid var(--border)',
    }}>
      {[
        { label: 'Work', href: '#projects' },
        { label: 'Writing', href: '#blog' },
        { label: 'About', href: '#about' },
      ].map(link => (
        <a key={link.label} href={link.href} style={{
          fontFamily: 'var(--font-m)', fontSize: '0.67rem', letterSpacing: '0.12em',
          textTransform: 'uppercase', color: 'var(--fg-dim)',
        }}>
          {link.label}
        </a>
      ))}
      <a href="mailto:shubhsankalp@gmail.com" style={{
        fontFamily: 'var(--font-m)', fontSize: '0.67rem', fontWeight: 500,
        letterSpacing: '0.08em', textTransform: 'uppercase',
        color: '#0a0a09', background: 'var(--accent)',
        padding: '0.44rem 1.1rem', borderRadius: 'var(--r)',
      }}>
        Get in touch
      </a>
    </header>
  )
}
