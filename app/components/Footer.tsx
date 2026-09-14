import { RESUME_URL } from '../lib/site'

export default function Footer() {
  const sha = process.env.VERCEL_GIT_COMMIT_SHA?.slice(0, 7) ?? 'local'
  const branch = process.env.VERCEL_GIT_COMMIT_REF ?? 'dev'
  const built = new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
  return (
    <footer className="foot">
      <span className="commit" title="Build that is currently live"><i />{branch} · {sha} · deployed {built}</span>
      <div className="links">
        <a href={RESUME_URL} target="_blank" rel="noopener noreferrer">Resume ↗</a>
        <span>© {new Date().getFullYear()} Shubh Sankalp Das</span>
      </div>
    </footer>
  )
}
