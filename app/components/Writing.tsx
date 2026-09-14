import Link from 'next/link'
import { POSTS } from '../lib/content'

const monthYear = (iso: string) => new Date(iso).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })

export default function Writing() {
  return (
    <section className="sec wrap" id="writing">
      <h2 className="h2">PM lens on <em>engineering.</em></h2>
      <div className="wl">
        {POSTS.map(post =>
          post.coming_soon ? (
            <div key={post.slug} className="wr draft">
              <p className="meta">In draft</p>
              <h3>{post.title}</h3>
            </div>
          ) : (
            <Link key={post.slug} className="wr" href={`/writing/${post.slug}`}>
              <div>
                <p className="meta"><b>{post.tag}</b> · {monthYear(post.created_at)} · {post.reading_time}</p>
                <h3>{post.title}</h3>
                <p>{post.summary}</p>
              </div>
              <span className="ar" aria-hidden="true">→</span>
              {post.cover_image_url && <span className="peek" aria-hidden="true"><img src={post.cover_image_url} alt="" /></span>}
            </Link>
          ),
        )}
      </div>
    </section>
  )
}
