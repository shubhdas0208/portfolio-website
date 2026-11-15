'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion, useVisibleLoop } from '../lib/hooks'
import FitStage from './FitStage'

// The chat loop: message, search, options in your size, add to cart, pay on the brand's checkout.
// Times are ms from the start of a loop; each step adds one class to the stage.
const STEPS: [string, number][] = [
  ['m', 300], ['s', 1100], ['a', 1800], ['b', 2350], ['c', 2900], ['p1', 4300], ['p2', 4900], ['pay', 5600], ['co', 6500],
]
const STEP_CLASSES = STEPS.map(([name]) => name)
const LOOP_MS = 10500
const FIRST_HOLD_MS = 2600

// Phones get the chat alone at near full size; wider screens add the checkout it hands off to.
const NARROW_QUERY = '(max-width:760px)'
const WIDE = { w: 560, h: 440 }
const SOLO = { w: 336, h: 412 }

// Illustrated garments and a made-up brand: no real product photos or store names.
const BRAND = 'Northloom'
const ITEMS = [
  { key: 'A1', name: 'Grey turtleneck', price: '₹1,499', size: 'Size M', short: 'Turtleneck · M' },
  { key: 'B1', name: 'Blue slim jeans', price: '₹1,497', size: 'Waist 32', short: 'Jeans · 32' },
]
const TOTAL = '₹2,996'

const turtleneck = (
  <svg viewBox="0 0 120 96" aria-hidden="true">
    <path d="M49 8h22v12l23 9 15 36-15 7-9-19v37H34V53l-9 19-15-7 15-36 24-9z" fill="#8F959E" />
    <path d="M49 8h22v12c-6 4-16 4-22 0z" fill="#A9AEB6" />
    <path d="M49 14h22M34 84h52" stroke="#737982" strokeWidth="2" fill="none" />
  </svg>
)
const jeans = (
  <svg viewBox="0 0 120 96" aria-hidden="true">
    <path d="M38 6h44l8 86H66l-6-56-6 56H30z" fill="#4E78C4" />
    <path d="M38 6h44l1 10H37z" fill="#3D62A6" />
    <path d="M43 22c2 8 8 11 14 11M77 22c-2 8-8 11-14 11M60 16v20" stroke="#34558F" strokeWidth="1.6" fill="none" strokeLinecap="round" />
  </svg>
)
const PHOTOS = [turtleneck, jeans]

/** DrapeFit as a chat: an illustration of the bot's loop, not a recording. */
export default function DrapeFitChat() {
  const ref = useRef<HTMLDivElement>(null)
  const stage = useRef<HTMLDivElement>(null)
  const timers = useRef<number[]>([])
  const running = useRef(false)
  const reduced = usePrefersReducedMotion()
  const [solo, setSolo] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia(NARROW_QUERY)
    const update = () => setSolo(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])
  const size = solo ? SOLO : WIDE

  const later = (fn: () => void, ms: number) => { timers.current.push(window.setTimeout(fn, ms)) }
  const clear = () => { timers.current.forEach(clearTimeout); timers.current = [] }

  const cycle = useCallback(() => {
    const el = stage.current
    if (!el || !running.current) return
    clear()
    el.classList.remove(...STEP_CLASSES)
    el.classList.add('run')
    STEPS.forEach(([name, at]) => later(() => el.classList.add(name), at))
    later(cycle, LOOP_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  // The first frame is the finished cart; the loop replays it from the first message.
  const start = useCallback(() => {
    running.current = true
    if (!timers.current.length) later(cycle, FIRST_HOLD_MS)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cycle])
  const stop = useCallback(() => { running.current = false; clear() }, [])
  useVisibleLoop(ref, start, stop, !reduced)
  useEffect(() => stop, [stop])

  return (
    <div ref={ref} role="img" aria-label={`Illustration of a DrapeFit chat in Telegram: one message asks for a grey turtleneck and blue jeans, the bot replies with two in-stock options in the right size, both are added to the cart, and a Pay on ${BRAND} button opens the brand's own checkout with a total of ${TOTAL}`}>
      <FitStage w={size.w} h={size.h}>
        <div ref={stage} className={solo ? 'dc solo' : 'dc'}>
          <div className="dc-phone">
            <div className="dc-hd">
              <span className="av">D</span>
              <div><b>DrapeFit</b><small>bot</small></div>
            </div>
            <div className="dc-body">
              <div className="dc-msg me">grey turtleneck M and blue jeans waist 32, under ₹2,000 each</div>
              <div className="dc-msg bot">
                <span>Searching 2 items…</span>
                <span className="tick a">A ✓</span>
                <span className="tick b">B ✓</span>
              </div>
              <div className="dc-cards">
                {ITEMS.map((item, i) => (
                  <div key={item.key} className="dc-card">
                    <div className="dc-ph">{PHOTOS[i]}<span>{item.key}</span></div>
                    <div className="dc-cap">
                      <b>{item.name}</b>
                      {BRAND}<br />
                      <strong>{item.price}</strong> · {item.size}
                    </div>
                    <div className={`dc-add k${i + 1}`}>
                      <span className="t0">🛒 Add to cart</span>
                      <span className="t1">🛒 In cart ✓</span>
                    </div>
                  </div>
                ))}
              </div>
              <div className="dc-pay">Pay on {BRAND} · {TOTAL} ↗</div>
            </div>
          </div>
          <svg className="dc-link" viewBox="0 0 560 440" aria-hidden="true">
            <path d="M326 390H450V352" />
            <path className="hd" d="M443 361l7-9 7 9" />
          </svg>
          <span className="dc-lab">The brand&apos;s own checkout</span>
          <div className="dc-co">
            <div className="bar"><i /><i /><i /><span>{BRAND.toLowerCase()}.in/cart</span></div>
            {ITEMS.map(item => (
              <div key={item.key} className="ln"><span>{item.short}</span><b>{item.price}</b></div>
            ))}
            <div className="ln tot"><span>Total</span><b>{TOTAL}</b></div>
            <div className="go">Checkout</div>
          </div>
          <span className="dc-note">Stock and price re-checked live</span>
        </div>
      </FitStage>
    </div>
  )
}
