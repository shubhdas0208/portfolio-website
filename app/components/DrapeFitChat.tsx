'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { usePrefersReducedMotion, useVisibleLoop } from '../lib/hooks'
import FitStage from './FitStage'

// The chat loop: message, what the bot understood, options in your size, add to cart, pay on the brand's checkout.
// Times are ms from the start of a loop; each step adds one class to the stage.
const STEPS: [string, number][] = [
  ['m', 210], ['s', 630], ['a', 980], ['b', 1260], ['c', 1610], ['p1', 2520], ['p2', 2940], ['pay', 3430], ['co', 3990],
]
const STEP_CLASSES = STEPS.map(([name]) => name)
const LOOP_MS = 7350
const FIRST_HOLD_MS = 1820

// Phones get the chat alone at near full size; wider screens add the checkout it hands off to.
const NARROW_QUERY = '(max-width:760px)'
const WIDE = { w: 560, h: 440 }
const SOLO = { w: 336, h: 412 }

// Stock photos and a made-up brand: no real store products or store names.
const BRAND = 'Northloom'
const ITEMS = [
  { key: 'A1', name: 'Black crew tee', price: '₹1,499', size: 'Size M', short: 'T-shirt · M', kind: 'T-shirt', asked: 'black · M · ≤ ₹2,000' },
  { key: 'B1', name: 'Blue slim jeans', price: '₹1,497', size: 'Waist 32', short: 'Jeans · 32', kind: 'Jeans', asked: 'blue · 32 · ≤ ₹2,000' },
]
const TOTAL = '₹2,996'
// The checkout total as the cart fills: empty, one item, both.
const RUNNING_TOTALS = ['₹0', ITEMS[0].price, TOTAL]
const TICKS = ['a', 'b']

// Two stock photos cropped to the product tile (Unsplash: Ryan Hoffman, TuanAnh Blue).
const PHOTO_W = 438
const PHOTO_H = 264
const PHOTOS = ['/images/projects/drapefit-tshirt.jpg', '/images/projects/drapefit-jeans.jpg']

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
    <div ref={ref} role="img" aria-label={`Illustration of a DrapeFit chat in Telegram: one message asks for a black t-shirt and blue jeans, the bot reads back the colour, size and budget it understood, replies with two in-stock options in the right size, both are added to the cart, and a Pay on ${BRAND} button opens the brand's own checkout with a total of ${TOTAL}`}>
      <FitStage w={size.w} h={size.h}>
        <div ref={stage} className={solo ? 'dc solo' : 'dc'}>
          <div className="dc-phone">
            <div className="dc-hd">
              <span className="av">D</span>
              <div><b>DrapeFit</b><small>bot</small></div>
            </div>
            <div className="dc-body">
              <div className="dc-msg me">black t-shirt M and blue jeans waist 32, under ₹2,000 each</div>
              <div className="dc-msg bot">
                <span>Searching 2 items…</span>
                <span className="tick a">A ✓</span>
                <span className="tick b">B ✓</span>
              </div>
              <div className="dc-cards">
                {ITEMS.map((item, i) => (
                  <div key={item.key} className="dc-card">
                    <div className="dc-ph"><img src={PHOTOS[i]} alt="" width={PHOTO_W} height={PHOTO_H} loading="lazy" /><span>{item.key}</span></div>
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
            <path d="M332 390H452V352" />
            <path className="hd" d="M445 361l7-9 7 9" />
          </svg>
          <span className="dc-lab u">What it understood</span>
          <div className="dc-parse">
            {ITEMS.map((item, i) => (
              <div key={item.key} className="row">
                <span className="k">{item.key[0]}</span>
                <div><b>{item.kind}</b><small>{item.asked}</small></div>
                <span className={`tick ${TICKS[i]}`}>✓</span>
              </div>
            ))}
          </div>
          <span className="dc-lab k">The brand&apos;s own checkout</span>
          <div className="dc-co">
            <div className="bar"><i /><i /><i /><span>{BRAND.toLowerCase()}.in/cart</span></div>
            {ITEMS.map((item, i) => (
              <div key={item.key} className={`ln l${i + 1}`}><span>{item.short}</span><b>{item.price}</b></div>
            ))}
            <div className="ln tot">
              <span>Total</span>
              <b className="tv">{RUNNING_TOTALS.map((value, i) => <span key={value} className={`v${i}`}>{value}</span>)}</b>
            </div>
            <div className="go">Checkout</div>
          </div>
          <span className="dc-note">Stock and price re-checked live</span>
        </div>
      </FitStage>
    </div>
  )
}
