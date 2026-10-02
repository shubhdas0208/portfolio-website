import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Article from '../../components/Article'
import { getCaseStudies, getDraft, getPublished as published, postToPile, projectToPile } from '../../lib/posts'

const MAX_OTHER_POSTS = 2

export function generateStaticParams() {
  return published().map(p => ({ slug: p.slug }))
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const post = published().find(p => p.slug === params.slug)
  if (!post) return {}
  const title = `${post.title} · Shubh Sankalp Das`
  return {
    title,
    description: post.summary,
    openGraph: { title, description: post.summary, type: 'article', images: post.cover_image_url ? [post.cover_image_url] : undefined },
  }
}

export default function PostPage({ params }: { params: { slug: string } }) {
  const post = published().find(p => p.slug === params.slug)
  if (!post || !post.body) notFound()
  const minutes = parseInt(post.reading_time ?? '', 10) || Math.max(3, Math.round(post.body.split(/\s+/).length / 230))
  const date = new Date(post.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric', timeZone: 'Asia/Kolkata' })
  // Next on the desk: other essays newest first, then the newest case study, then the draft.
  const caseStudy = getCaseStudies()[0]
  const pile = [
    ...published().filter(p => p.slug !== post.slug).slice(0, MAX_OTHER_POSTS).map(postToPile),
    ...(caseStudy ? [projectToPile(caseStudy)] : []),
  ]
  return (
    <Article
      kind="Essay"
      slug={post.slug}
      annot={post}
      reply="Disagree? Tell me why."
      pile={pile}
      draft={getDraft()}
      backHref="/#writing"
      backLabel="Home"
      title={post.title}
      subtitle={post.summary}
      minutes={minutes}
      cover={post.cover_image_url}
      body={post.body}
      meta={<span>{[post.tag, date].filter(Boolean).join(' · ')}</span>}
    />
  )
}
