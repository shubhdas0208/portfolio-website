import Link from 'next/link'

export default function NotFound() {
  return (
    <main className="nfbox">
      <h1>4<em>0</em>4</h1>
      <p>Page not found.</p>
      <div><Link className="btn ghost" href="/">Back home →</Link></div>
    </main>
  )
}
