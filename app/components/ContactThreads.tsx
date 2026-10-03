/* Five slow orange threads behind the Contact band (SVG version of React Bits "Threads"). Decorative only. */

const THREADS = [
  { d: 'M-40 420 C 260 300, 520 520, 820 380 S 1300 260, 1480 360', color: '#FF8533', opacity: 0.9, t: '7s' },
  { d: 'M-40 470 C 300 380, 560 600, 860 450 S 1280 330, 1480 430', color: '#E0600F', opacity: 0.6, t: '9s' },
  { d: 'M-40 360 C 220 250, 600 460, 900 320 S 1260 220, 1480 300', color: '#FFB37A', opacity: 0.35, t: '11s', flow: true },
  { d: 'M-40 520 C 340 450, 620 640, 940 500 S 1320 400, 1480 490', color: '#FF8533', opacity: 0.45, t: '8s' },
  { d: 'M-40 300 C 280 210, 640 400, 980 270 S 1300 200, 1480 250', color: '#E0600F', opacity: 0.5, t: '10s', flow: true },
]

/** One SVG per thread, so each drift is a composited transform instead of a repaint of one full-band SVG. */
export default function ContactThreads() {
  return (
    <>
      {THREADS.map((th, i) => (
        <svg key={i} className="threads" viewBox="0 0 1440 640" preserveAspectRatio="none" aria-hidden="true" style={{ ['--t' as string]: th.t }}>
          <path d={th.d} stroke={th.color} strokeOpacity={th.opacity} className={th.flow ? 'flow' : undefined} />
        </svg>
      ))}
    </>
  )
}
