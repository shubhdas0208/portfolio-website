'use client'

import { useEffect, useRef, useState } from 'react'

export default function ReadingProgress({ minutes }: { minutes: number }) {
  const barRef = useRef<HTMLDivElement>(null)
  const [left, setLeft] = useState(`${minutes} min left`)

  useEffect(() => {
    let lastText = ''
    let pending = 0
    const update = () => {
      pending = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const f = max > 0 ? Math.min(1, window.scrollY / max) : 1
      if (barRef.current) barRef.current.style.transform = `scaleX(${f})`
      const text = f > 0.98 ? 'Done' : `${Math.max(1, Math.ceil(minutes * (1 - f)))} min left`
      if (text !== lastText) { lastText = text; setLeft(text) }
    }
    const onScroll = () => { if (!pending) pending = requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => { window.removeEventListener('scroll', onScroll); window.removeEventListener('resize', onScroll); cancelAnimationFrame(pending) }
  }, [minutes])

  return (
    <>
      <div ref={barRef} className="progress" aria-hidden="true" />
      <span className="left" aria-hidden="true">{left}</span>
    </>
  )
}
