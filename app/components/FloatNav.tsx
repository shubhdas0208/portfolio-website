'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from '../lib/ThemeContext'

const NAV_ITEMS = [
  {
    id: 'hero',
    label: (
      <svg
        width="17"
        height="17"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M3 10.5 12 3l9 7.5" />
        <path d="M5 9.5V21h14V9.5" />
        <path d="M9 21v-6h6v6" />
      </svg>
    ),
  },
  { id: 'projects', label: 'Projects' },
  { id: 'blog', label: 'Blogs' },
  { id: 'about', label: 'About' },
  { id: 'experience', label: 'Work Exp' },
  { id: 'contact', label: 'Contact' },
]

export default function FloatNav() {
  const [activeId, setActiveId] = useState('hero')
  const [hoverId, setHoverId] = useState<string | null>(null)
  const { theme, toggle } = useTheme()

  useEffect(() => {
    let rafId = 0

    const updateActive = () => {
      const probeLine = window.innerHeight * 0.66
      let nextActive = NAV_ITEMS[0].id

      NAV_ITEMS.forEach(({ id }) => {
        const el = document.getElementById(id)
        if (!el) return

        const rect = el.getBoundingClientRect()
        if (rect.top <= probeLine) nextActive = id
      })

      setActiveId(nextActive)
    }

    const queueUpdate = () => {
      if (rafId) return
      rafId = window.requestAnimationFrame(() => {
        rafId = 0
        updateActive()
      })
    }

    updateActive()
    window.addEventListener('scroll', queueUpdate, { passive: true })
    window.addEventListener('resize', queueUpdate)

    return () => {
      if (rafId) window.cancelAnimationFrame(rafId)
      window.removeEventListener('scroll', queueUpdate)
      window.removeEventListener('resize', queueUpdate)
    }
  }, [])

  const isDark = theme === 'dark'
  const navBg = isDark ? 'rgba(17,17,16,0.94)' : 'rgba(255,255,255,0.96)'
  const baseText = isDark ? 'rgba(255,255,255,0.82)' : 'rgba(17,17,16,0.8)'
  const dividerColor = isDark ? 'rgba(255,255,255,0.12)' : 'rgba(17,17,16,0.16)'
  const toggleBg = isDark ? 'rgba(255,255,255,0.07)' : 'rgba(17,17,16,0.08)'
  const toggleBgHover = isDark ? 'rgba(255,255,255,0.15)' : 'rgba(17,17,16,0.16)'
  const toggleColor = isDark ? 'rgba(255,255,255,0.6)' : 'rgba(17,17,16,0.62)'
  const hoverPill = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(17,17,16,0.08)'
  const homeIconColor = isDark ? '#ffffff' : 'rgba(17,17,16,0.85)'
  const homeBg = isDark ? 'rgba(255,255,255,0.10)' : 'rgba(17,17,16,0.08)'
  const navShadow = isDark
    ? '0 0 0 1px rgba(255,255,255,0.08), 0 0 28px rgba(255,255,255,0.12), 0 10px 36px rgba(0,0,0,0.42)'
    : '0 6px 26px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)'

  return (
    <nav
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        gap: '2px',
        background: navBg,
        borderRadius: '100px',
        padding: '5px',
        boxShadow: navShadow,
        backdropFilter: 'blur(14px)',
        border: isDark ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(17,17,16,0.08)',
        transition: 'background 0.35s cubic-bezier(0.16,1,0.3,1), box-shadow 0.35s',
      }}
    >
      {NAV_ITEMS.map(item => {
        const isActive = activeId === item.id
        const isHovered = hoverId === item.id
        const isHome = item.id === 'hero'

        return (
          <div
            key={item.id}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isHome ? '8px' : 0,
            }}
          >
            <a
              href={`#${item.id}`}
              onMouseEnter={() => setHoverId(item.id)}
              onMouseLeave={() => setHoverId(null)}
              onClick={() => setActiveId(item.id)}
              style={{
                position: 'relative',
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                height: isHome ? 48 : 36,
                width: isHome ? 48 : 'auto',
                minWidth: isHome ? 48 : undefined,
                padding: isHome ? 0 : '0 0.85rem',
                borderRadius: '100px',
                fontFamily: 'var(--font-m)',
                fontSize: '0.62rem',
                letterSpacing: '0.07em',
                textTransform: 'uppercase',
                fontWeight: isActive ? 500 : 400,
                textDecoration: 'none',
                whiteSpace: 'nowrap',
                color: isHome ? homeIconColor : isActive ? '#ffffff' : baseText,
                transition: 'color 0.2s cubic-bezier(0.16,1,0.3,1)',
                zIndex: 0,
                background: isHome ? homeBg : undefined,
              }}
            >
              {!isHome && isActive && (
                <motion.span
                  layoutId="float-active-pill"
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '100px',
                    background: 'var(--accent)',
                    zIndex: -1,
                  }}
                  transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                />
              )}

              {!isHome && !isActive && isHovered && (
                <motion.span
                  layoutId="float-hover-bg"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '100px',
                    background: hoverPill,
                    zIndex: -1,
                  }}
                />
              )}

              <span
                style={{
                  position: 'relative',
                  zIndex: 1,
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  lineHeight: 0,
                }}
              >
                {item.label}
              </span>
            </a>

            {isHome && (
              <span
                style={{
                  width: 1,
                  height: 18,
                  background: dividerColor,
                  flexShrink: 0,
                }}
              />
            )}
          </div>
        )
      })}

      <span
        style={{
          width: 1,
          height: 18,
          background: dividerColor,
          margin: '0 4px',
          flexShrink: 0,
        }}
      />

      <button
        onClick={toggle}
        aria-label="Toggle theme"
        style={{
          width: 36,
          height: 36,
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: toggleBg,
          border: 'none',
          cursor: 'pointer',
          color: toggleColor,
          transition: 'background 0.2s, transform 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = toggleBgHover
          e.currentTarget.style.transform = 'scale(1.1)'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = toggleBg
          e.currentTarget.style.transform = 'scale(1)'
        }}
      >
        <AnimatePresence mode="wait">
          {isDark ? (
            <motion.svg
              key="sun"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="1" x2="12" y2="3" />
              <line x1="12" y1="21" x2="12" y2="23" />
              <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
              <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
              <line x1="1" y1="12" x2="3" y2="12" />
              <line x1="21" y1="12" x2="23" y2="12" />
              <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
              <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
            </motion.svg>
          ) : (
            <motion.svg
              key="moon"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </motion.svg>
          )}
        </AnimatePresence>
      </button>
    </nav>
  )
}
