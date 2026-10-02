import type { Post } from '../lib/content'

/** The draft on the desk: title with a live caret and a half-written rule. */
export default function DraftCard({ post }: { post: Post }) {
  return (
    <div className="next">
      <small>In draft · not out yet</small>
      <p>{post.title}<span className="caret" aria-hidden="true" /></p>
      <i aria-hidden="true" />
    </div>
  )
}
