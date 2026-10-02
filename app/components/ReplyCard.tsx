'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'

const MIN_CHARS = 12
const MAX_CHARS = 280
const SETTLE_MS = 120
const CHIP_GAP = 10
const PROSE = '.ms-body .prose'

interface Chip { x: number; y: number; below: boolean }

const REPLY_ICON = <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M6 3 L2 7 L6 11 M2 7 H10 C12.5 7 14 8.5 14 11 V13" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" /></svg>

const cleanQuote = (text: string) => text.replace(/\s+/g, ' ').trim()

/**
 * The end-of-article index card. It quotes the pull quote by default; selecting any line of the prose
 * offers a "Reply to this line" chip that swaps the quote in, and the button carries both to Contact.
 */
export default function ReplyCard({ heading, title, quote }: { heading: string; title: string; quote: string }) {
  const [current, setCurrent] = useState(quote)
  const [chip, setChip] = useState<Chip | null>(null)
  const selected = useRef('')
  const range = useRef<Range | null>(null)
  const cardRef = useRef<HTMLElement>(null)
  const talkRef = useRef<HTMLAnchorElement>(null)

  useEffect(() => {
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let timer = 0
    const place = () => {
      const r = range.current?.getBoundingClientRect()
      if (!r || (!r.width && !r.height)) return setChip(null)
      setChip({ x: r.left + r.width / 2, y: coarse ? r.bottom + CHIP_GAP : r.top - CHIP_GAP, below: coarse })
    }
    const read = () => {
      const sel = window.getSelection()
      const text = sel ? cleanQuote(sel.toString()) : ''
      const inProse = (n: Node | null | undefined) => !!(n && (n instanceof Element ? n : n.parentElement)?.closest(PROSE))
      if (!sel || sel.isCollapsed || text.length < MIN_CHARS || text.length > MAX_CHARS || !inProse(sel.anchorNode) || !inProse(sel.focusNode)) {
        range.current = null
        return setChip(null)
      }
      selected.current = text
      range.current = sel.getRangeAt(0)
      place()
    }
    const onSelection = () => { window.clearTimeout(timer); timer = window.setTimeout(read, SETTLE_MS) }
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') { range.current = null; setChip(null) } }
    const onScroll = () => { if (range.current) place() }
    document.addEventListener('selectionchange', onSelection)
    document.addEventListener('keydown', onKey)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('selectionchange', onSelection)
      document.removeEventListener('keydown', onKey)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const reply = () => {
    setCurrent(selected.current)
    setChip(null)
    range.current = null
    window.getSelection()?.removeAllRanges()
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    cardRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' })
    talkRef.current?.focus({ preventScroll: true })
  }

  const href = `/?re=${encodeURIComponent(title)}&q=${encodeURIComponent(current)}#contact`

  return (
    <>
      <section ref={cardRef} className="rcard" aria-labelledby="reply-h">
        <span className="tape" aria-hidden="true" />
        <h2 id="reply-h">{heading}</h2>
        <p className="rt">Your reply will quote</p>
        <blockquote key={current} className="rq">{current}</blockquote>
        <div className="act">
          <Link ref={talkRef} className="btn" href={href}>Reply with this quote →</Link>
          <small>Or select any line above to quote that instead</small>
        </div>
      </section>
      {chip && (
        <button
          type="button"
          className={`rchip${chip.below ? ' below' : ''}`}
          style={{ left: chip.x, top: chip.y }}
          onMouseDown={e => e.preventDefault()}
          onClick={reply}
        >
          {REPLY_ICON}Reply to this line
        </button>
      )}
    </>
  )
}
