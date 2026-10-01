import P99Hint from './P99Hint'

export default function Footer() {
  const fullSha = process.env.VERCEL_GIT_COMMIT_SHA
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? 'main'
  const built = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
  return (
    <footer className="foot">
      {fullSha && <span className="commit" title="Build that is currently live"><i />{branch} · {fullSha.slice(0, 7)} · deployed {built}</span>}
      <div className="links">
        <P99Hint />
        <span>© {new Date().getFullYear()} Shubh Sankalp Das</span>
      </div>
    </footer>
  )
}
