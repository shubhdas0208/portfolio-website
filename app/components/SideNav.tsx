'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'

const NAV_ITEMS = [
  { id: 'hero',       label: '01 — Intro' },
  { id: 'projects',   label: '02 — Projects' },
  { id: 'blog',       label: '03 — Writing' },
  { id: 'about',      label: '04 — About' },
  { id: 'now',        label: '05 — Now' },
  { id: 'experience', label: '06 — Work Exp' },
  { id: 'contact',    label: '07 — Contact' },
]

const DOT_GAP = 28 // px between dot centres

export default function SideNav() {
  const [activeId, setActiveId] = useState('hero')
  const [hoverId, setHoverId] = useState<string | null>(null)
  const [fillPct, setFillPct] = useState(0)

  useEffect(() => {
    const sections = NAV_ITEMS.map(n => document.getElementById(n.id)).filter(Boolean) as HTMLElement[]

    function onScroll() {
      let current = 'hero'
      sections.forEach(sec => {
        if (sec.getBoundingClientRect().top <= window.innerHeight * 0.5) current = sec.id
      })
      setActiveId(current)
      const idx = NAV_ITEMS.findIndex(n => n.id === current)
      setFillPct(idx >= 0 ? (idx / (NAV_ITEMS.length - 1)) * 100 : 0)
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const trackHeight = (NAV_ITEMS.length - 1) * DOT_GAP

  return (
    <aside style={{
      position: 'fixed',
      left: '1.5rem',
      top: '50%',
      transform: 'translateY(-50%)',
      zIndex: 90,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>

      {/* Dot track */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: `${DOT_GAP - 12}px` }}>

        {/* Background track line */}
        <div style={{
          position: 'absolute',
          left: '50%', transform: 'translateX(-50%)',
          top: 6, width: 1,
          height: trackHeight,
          background: 'var(--border-2)',
          zIndex: 0,
        }} />

        {/* Accent fill line */}
        <motion.div
          style={{
            position: 'absolute',
            left: '50%', transform: 'translateX(-50%)',
            top: 6, width: 1,
            background: 'var(--accent)',
            zIndex: 1,
            transformOrigin: 'top',
          }}
          animate={{ height: `${(fillPct / 100) * trackHeight}px` }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        />

        {NAV_ITEMS.map(item => {
          const isActive = activeId === item.id
          const isHovered = hoverId === item.id

          return (
            <a
              key={item.id}
              href={`#${item.id}`}
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId(null)}
              style={{
                position: 'relative', zIndex: 2,
                display: 'flex', alignItems: 'center',
                gap: '10px',
                width: 32, // accessible hitbox
                justifyContent: 'center',
                textDecoration: 'none',
              }}
            >
              {/* Dot — morphs to pill when active */}
              <motion.span
                layoutId={isActive ? 'active-dot' : undefined}
                animate={{
                  width: isActive ? 4 : 4,
                  height: isActive ? 16 : 4,
                  backgroundColor: isActive
                    ? 'var(--accent)'
                    : isHovered
                      ? 'var(--fg-dim)'
                      : 'var(--border-2)',
                  borderRadius: isActive ? 4 : 50,
                }}
                transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                style={{ display: 'block', flexShrink: 0 }}
              />

              {/* Slide-out label on hover */}
              <motion.span
                animate={{
                  opacity: isHovered ? 1 : 0,
                  x: isHovered ? 0 : -4,
                  pointerEvents: isHovered ? 'none' : 'none',
                }}
                transition={{ duration: 0.1, ease: [0.16, 1, 0.3, 1] }}
                style={{
                  position: 'absolute',
                  left: '100%',
                  marginLeft: 10,
                  fontFamily: 'var(--font-m)',
                  fontSize: '0.65rem',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  color: 'var(--fg-dim)',
                  whiteSpace: 'nowrap',
                  background: 'var(--bg-card)',
                  border: '1px solid var(--border)',
                  padding: '3px 8px',
                  borderRadius: 4,
                }}
              >
                {item.label}
              </motion.span>
            </a>
          )
        })}
      </div>

      {/* Mobile: hide entire sidenav below 768px via CSS */}
      <style>{`
        @media (max-width: 768px) {
          aside { display: none !important; }
        }
      `}</style>
    </aside>
  )
}
