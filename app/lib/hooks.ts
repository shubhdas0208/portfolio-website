'use client'

import { useEffect, useState, type RefObject } from 'react'

export function usePrefersReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  return reduced
}

/** Calls start/stop as the element enters/leaves the viewport and as the tab is shown/hidden. */
export function useVisibleLoop(ref: RefObject<Element>, start: () => void, stop: () => void, enabled = true) {
  useEffect(() => {
    const el = ref.current
    if (!el || !enabled) return
    let visible = false
    const sync = () => (visible && !document.hidden ? start() : stop())
    const io = new IntersectionObserver(([entry]) => {
      visible = entry.isIntersecting
      el.classList.toggle('paused', !visible)
      sync()
    }, { threshold: 0.05 })
    io.observe(el)
    document.addEventListener('visibilitychange', sync)
    return () => {
      io.disconnect()
      document.removeEventListener('visibilitychange', sync)
      stop()
    }
    // start/stop are expected to be stable (refs inside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref, enabled])
}

/** True once the element has scrolled into view (fires once). */
export function useInViewOnce(ref: RefObject<Element>, threshold = 0.2): boolean {
  const [seen, setSeen] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el || seen) return
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setSeen(true); io.disconnect() }
    }, { threshold })
    io.observe(el)
    return () => io.disconnect()
  }, [ref, threshold, seen])
  return seen
}

export function istTime(): string {
  try {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
  } catch {
    return ''
  }
}
