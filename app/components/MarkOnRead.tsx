'use client'

import { useEffect } from 'react'

const MARKS = '.ms-body .mk, .ms-body .pen, .ms-body .mnote'
const NOTE_STACKS = '.ms-body .mnotes'
const NOTE_GAP_PX = 18

/**
 * Margin notes sit level with their paragraph; when a long note would run into the next paragraph's,
 * the later one is pushed down just enough to clear it. Only in the wide layout, where notes are absolute.
 */
function stackNotes() {
  let prevBottom = -Infinity
  for (const n of Array.from(document.querySelectorAll<HTMLElement>(NOTE_STACKS))) {
    n.style.marginTop = ''
    if (getComputedStyle(n).position !== 'absolute') continue
    const r = n.getBoundingClientRect()
    const shift = Math.max(0, prevBottom + NOTE_GAP_PX - r.top)
    if (shift) n.style.marginTop = `${shift}px`
    prevBottom = r.bottom + shift
  }
}

/** Draws each marker, pencil underline and margin note once, as it crosses the reading line (60% down). */
export default function MarkOnRead() {
  useEffect(() => {
    const els = Array.from(document.querySelectorAll<HTMLElement>(MARKS))
    const io = new IntersectionObserver(entries => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        ;(e.target as HTMLElement).dataset.read = ''
        io.unobserve(e.target)
      }
    }, { rootMargin: '0px 0px -40% 0px' })
    els.forEach(el => io.observe(el))

    let raf = 0
    const relayout = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(stackNotes) }
    relayout()
    document.fonts?.ready.then(relayout)
    window.addEventListener('resize', relayout)
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener('resize', relayout) }
  }, [])
  return null
}
