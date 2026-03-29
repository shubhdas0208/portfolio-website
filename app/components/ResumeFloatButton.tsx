'use client'
import { useEffect, useState } from 'react'

export default function ResumeFloatButton() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const hero = document.getElementById('hero')
    if (!hero) return
    const obs = new IntersectionObserver(
      ([entry]) => setVisible(!entry.isIntersecting),
      { threshold: 0.1 }
    )
    obs.observe(hero)
    return () => obs.disconnect()
  }, [])

  if (!visible) return null

  return (
    <a
      href="https://drive.google.com/file/d/1BA4IKjQMZAQbHeRM5nver6vW0qQF7s7Y/view"
      target="_blank"
      rel="noreferrer"
      style={{
        position: 'fixed',
        bottom: '1.75rem',
        right: '1.75rem',
        zIndex: 99,
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.55rem 1rem',
        borderRadius: '100px',
        background: 'var(--accent)',
        color: '#fff',
        fontFamily: 'var(--font-m)',
        fontSize: '0.62rem',
        letterSpacing: '0.07em',
        textTransform: 'uppercase',
        textDecoration: 'none',
        boxShadow: '0 4px 20px rgba(249,115,22,0.35)',
        transition: 'transform 0.2s, box-shadow 0.2s',
      }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'scale(1.05)'
        e.currentTarget.style.boxShadow = '0 6px 28px rgba(249,115,22,0.5)'
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'scale(1)'
        e.currentTarget.style.boxShadow = '0 4px 20px rgba(249,115,22,0.35)'
      }}
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/>
        <polyline points="7 10 12 15 17 10"/>
        <line x1="12" y1="15" x2="12" y2="3"/>
      </svg>
      Resume
    </a>
  )
}
