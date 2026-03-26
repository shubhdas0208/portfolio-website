'use client'

import { useEffect, useState } from 'react'

const NAV_ITEMS = [
  { id: 'hero',       label: 'Intro' },
  { id: 'projects',   label: 'Projects' },
  { id: 'blog',       label: 'Blogs' },
  { id: 'about',      label: 'About' },
  { id: 'now',        label: 'Now' },
  { id: 'experience', label: 'Work Exp' },
  { id: 'contact',    label: 'Contact' },
]

export default function SideNav() {
  const [activeId, setActiveId] = useState('hero')
  const [fillPct, setFillPct] = useState(0)

  useEffect(() => {
    const sections = NAV_ITEMS.map(item => document.getElementById(item.id)).filter(Boolean) as HTMLElement[]

    function onScroll() {
      const scrollY = window.scrollY
      const windowH = window.innerHeight
      let current = 'hero'
      sections.forEach(sec => {
        const top = sec.getBoundingClientRect().top + scrollY
        if (scrollY >= top - windowH * 0.4) current = sec.id
      })
      setActiveId(current)
      const idx = NAV_ITEMS.findIndex(n => n.id === current)
      setFillPct(idx >= 0 ? (idx / (NAV_ITEMS.length - 1)) * 100 : 0)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <aside style={{
      position: 'fixed', left: 0, top: 0, bottom: 0, width: 'var(--side-w)', zIndex: 90,
      display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-start',
      padding: '0 1.75rem',
      borderRight: '1px solid var(--border)',
      background: 'rgba(10,10,9,0.85)', backdropFilter: 'blur(18px)',
    }}>
      {/* Logo */}
      <a href="#hero" style={{ position: 'absolute', top: '1.6rem', left: '1.75rem', fontFamily: 'var(--font-d)', fontSize: '1rem', fontWeight: 700 }}>
        S<span style={{ color: 'var(--accent)' }}>.</span>D
      </a>

      {/* Track */}
      <nav style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', position: 'relative' }}>
        {/* Background line */}
        <div style={{ position: 'absolute', left: 5, top: 6, bottom: 6, width: 1, background: 'var(--border-2)', zIndex: 0 }} />
        {/* Accent fill line — orange rgba values */}
        <div style={{
          position: 'absolute', left: 5, top: 6, width: 1,
          height: `${fillPct}%`,
          background: 'linear-gradient(to bottom, var(--accent), rgba(249,115,22,0.3))',
          boxShadow: '0 0 6px var(--accent), 0 0 12px rgba(249,115,22,0.3)',
          zIndex: 1,
          transition: 'height 0.4s ease',
        }} />
        {NAV_ITEMS.map(item => {
          const isActive = activeId === item.id
          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.85rem',
                padding: '0.58rem 0', cursor: 'pointer', position: 'relative', zIndex: 2,
                textDecoration: 'none',
              }}
            >
              <span style={{
                width: 12, height: 12, borderRadius: '50%', flexShrink: 0,
                border: `1px solid ${isActive ? 'var(--accent)' : 'var(--fg-dimmer)'}`,
                background: isActive ? 'var(--accent)' : 'var(--bg)',
                boxShadow: isActive ? '0 0 8px var(--accent), 0 0 16px rgba(249,115,22,0.4)' : 'none',
                transition: 'all 0.25s',
                position: 'relative', zIndex: 2,
              }} />
              <span style={{
                fontFamily: 'var(--font-m)', fontSize: '0.63rem', letterSpacing: '0.12em',
                textTransform: 'uppercase', whiteSpace: 'nowrap',
                color: isActive ? 'var(--accent)' : 'var(--fg-dimmer)',
                fontWeight: isActive ? 500 : 400,
                transition: 'color 0.25s',
              }}>
                {item.label}
              </span>
            </a>
          )
        })}
      </nav>

      {/* Footer links */}
      <div style={{ position: 'absolute', bottom: '1.75rem', left: '1.75rem', display: 'flex', gap: '1rem' }}>
        {[
          { label: 'Li', href: 'https://linkedin.com/in/shubhsankalpd' },
          { label: 'Gh', href: 'https://github.com/shubhsd' },
          { label: 'Em', href: 'mailto:shubhsankalp@gmail.com' },
        ].map(l => (
          <a key={l.label} href={l.href} target={l.href.startsWith('http') ? '_blank' : undefined}
            style={{ fontFamily: 'var(--font-m)', fontSize: '0.58rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--fg-dimmer)' }}>
            {l.label}
          </a>
        ))}
      </div>
    </aside>
  )
}
