'use client'

import { useEffect, useRef, useState } from 'react'

const SHOW_AFTER = 0.04 // past the meta row
const DONE_AT = 0.98

/** "n min left" for a reading fraction f, or "Done" at the end. */
export const minutesLeft = (minutes: number, f: number) => (f > DONE_AT ? 'Done' : `${Math.max(1, Math.ceil(minutes * (1 - f)))} min left`)

export default function ReadingProgress({ minutes }: { minutes: number }) {
  const barRef = useRef<HTMLDivElement>(null)
  const [left, setLeft] = useState(`${minutes} min left`)
  const [on, setOn] = useState(false)

  useEffect(() => {
    let lastText = ''
    let pending = 0
    const update = () => {
      pending = 0
      const max = document.documentElement.scrollHeight - window.innerHeight
      const f = max > 0 ? Math.min(1, window.scrollY / max) : 1
      if (barRef.current) barRef.current.style.transform = `scaleX(${f})`
      const text = minutesLeft(minutes, f)
      if (text !== lastText) { lastText = text; setLeft(text) }
      setOn(f > SHOW_AFTER)
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
      <span className={`left${on ? ' on' : ''}`} aria-hidden="true">{left}</span>
    </>
  )
}
