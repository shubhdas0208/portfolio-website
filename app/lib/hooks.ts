'use client'

import { useCallback, useEffect, useRef, useState, type RefObject } from 'react'

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

export const SECTION_EVENT = 'sectionchange'

/**
 * One observer over the home sections: marks each section [data-arrived] the first time it crosses
 * the reading line, and broadcasts the current section id for FloatNav.
 */
export function useSectionArrival() {
  useEffect(() => {
    const sections = Array.from(document.querySelectorAll<HTMLElement>('main section[id]'))
    if (!sections.length) return
    // The current section is the last one in DOM order that touches the reading line.
    const onLine = new Set<HTMLElement>()
    let current = ''
    const io = new IntersectionObserver(entries => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        if (entry.isIntersecting) { onLine.add(el); el.dataset.arrived = '' } else onLine.delete(el)
      }
      const top = sections.filter(s => onLine.has(s)).pop()
      const id = top?.id ?? ''
      if (id !== current) { current = id; window.dispatchEvent(new CustomEvent(SECTION_EVENT, { detail: id })) }
    }, { rootMargin: '-40% 0px -55% 0px' })
    sections.forEach(s => io.observe(s))
    return () => io.disconnect()
  }, [])
}

/** Adds .paused to home bands while they are off screen, so their background loops stop. */
export function useBandPause() {
  useEffect(() => {
    const bands = Array.from(document.querySelectorAll<HTMLElement>("main > section.band"))
    const io = new IntersectionObserver(entries => {
      for (const e of entries) (e.target as HTMLElement).classList.toggle("paused", !e.isIntersecting)
    })
    bands.forEach(b => io.observe(b))
    return () => io.disconnect()
  }, [])
}

/** Desktop query under which Projects and Experience pin and step through their items on scroll. */
export const STEP_QUERY = "(min-width:1025px) and (min-height:640px) and (prefers-reduced-motion:no-preference)"
const STEP_LEAD = 0.25 // open the next item a quarter-step before its slot

/**
 * Pinned scroll-stepping for a section with `count` items. On desktop the track is tall and its stage sticky;
 * scroll position picks the open item, and select(i) scrolls to that item's slot so click and scroll agree.
 * Elsewhere (phones, reduced motion) it is plain click-to-open state.
 */
export function useStepScroll(count: number) {
  const trackRef = useRef<HTMLDivElement>(null)
  const [active, setActive] = useState(0)
  const [pinned, setPinned] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(STEP_QUERY)
    const sync = () => setPinned(mq.matches)
    sync()
    mq.addEventListener("change", sync)
    return () => mq.removeEventListener("change", sync)
  }, [])

  const stepPx = useCallback(() => {
    const el = trackRef.current
    if (!el || count < 2) return 0
    return (el.offsetHeight - (window.innerHeight - 64)) / (count - 1)
  }, [count])

  useEffect(() => {
    if (!pinned) return
    let raf = 0
    const update = () => {
      raf = 0
      const el = trackRef.current
      const step = stepPx()
      if (!el || !step) return
      const top = el.getBoundingClientRect().top - 64
      const i = Math.min(count - 1, Math.max(0, Math.floor(-top / step + STEP_LEAD)))
      setActive(prev => (prev === i ? prev : i))
    }
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    update()
    window.addEventListener("scroll", onScroll, { passive: true })
    window.addEventListener("resize", onScroll)
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf) }
  }, [pinned, count, stepPx])

  const select = useCallback((i: number) => {
    setActive(i)
    const el = trackRef.current
    if (!pinned || !el) return
    const y = el.getBoundingClientRect().top + window.scrollY - 64 + i * stepPx() + 2
    window.scrollTo({ top: y, behavior: "smooth" })
  }, [pinned, stepPx])

  return { trackRef, active, select, pinned }
}

export function istTime(): string {
  try {
    return new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', hour12: false, timeZone: 'Asia/Kolkata' })
  } catch {
    return ''
  }
}
