'use client'

import { useRef, useEffect } from 'react'

export default function EyeTracker() {
  const eyesRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!eyesRef.current) return
      const eyeballs = eyesRef.current.querySelectorAll<HTMLElement>('.eyeball')
      const rect = eyesRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      const angle = Math.atan2(event.clientY - centerY, event.clientX - centerX)
      const dX = Math.cos(angle) * 6
      const dY = Math.sin(angle) * 4
      eyeballs.forEach(eyeball => {
        const pupil = eyeball.querySelector<HTMLElement>('.pupil')
        eyeball.style.transform = `translate(${dX}px, ${dY}px)`
        if (pupil) pupil.style.transform = `translate(${Math.cos(angle)}px, ${Math.sin(angle)}px)`
      })
    }

    const handleMouseLeave = () => {
      if (!eyesRef.current) return
      const eyeballs = eyesRef.current.querySelectorAll<HTMLElement>('.eyeball')
      eyeballs.forEach(eyeball => {
        const pupil = eyeball.querySelector<HTMLElement>('.pupil')
        eyeball.style.transition = 'transform 0.5s ease'
        eyeball.style.transform = 'translate(-6px, 0)'
        if (pupil) {
          pupil.style.transition = 'transform 0.5s ease'
          pupil.style.transform = 'translate(0px, 0px)'
        }
        setTimeout(() => {
          eyeball.style.transition = ''
          if (pupil) pupil.style.transition = ''
        }, 500)
      })
    }

    const aboutSection = document.getElementById('about')
    window.addEventListener('mousemove', handleMouseMove)
    aboutSection?.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      aboutSection?.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [])

  return (
    <div
      ref={eyesRef}
      style={{
        flex: 1,
        marginTop: '1rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 10,
        cursor: 'none',
      }}
    >
      {[0, 1].map(i => (
        <div key={i} style={{
          position: 'relative',
          width: 32,
          height: 56,
          borderRadius: '50%',
          background: 'white',
          overflow: 'hidden',
          boxShadow: '0px 0px 3px 1px rgba(0,0,0,0.25) inset, 0px 0px 4px 2px rgba(0,0,0,0.1) inset',
        }}>
          <div className="eyeball" style={{
            position: 'absolute',
            inset: 0,
            margin: 'auto',
            width: 19,
            height: 20,
            borderRadius: '50%',
            background: 'linear-gradient(138deg, #372a28 0%, #76514b 100%)',
            border: '0.5px solid rgba(0,0,0,0.2)',
            transform: 'translateX(-6px)',
          }}>
            <div className="pupil" style={{
              position: 'absolute',
              inset: 0,
              margin: 'auto',
              width: 12,
              height: 12,
              borderRadius: '50%',
              background: '#1f1f1f',
              boxShadow: '0px 0px 2px 1px #18181b inset',
            }} />
            <div style={{
              position: 'absolute',
              left: 2,
              top: 3,
              width: 4,
              height: 6,
              borderRadius: '50%',
              background: 'white',
              transform: 'rotate(30deg)',
              filter: 'blur(1px)',
            }} />
          </div>
        </div>
      ))}
    </div>
  )
}
