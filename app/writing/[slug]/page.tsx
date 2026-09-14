import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Article from '../../components/Article'
import { POSTS } from '../../lib/content'

const published = () => POSTS.filter(p => p.is_published && !p.coming_soon && p.body)

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
  return (
    <Article
      kind="Essay"
      backHref="/#writing"
      backLabel="Writing"
      title={post.title}
      subtitle={post.summary}
      minutes={minutes}
      cover={post.cover_image_url}
      body={post.body}
      meta={<span>{[post.tag, date].filter(Boolean).join(' · ')}</span>}
    />
  )
}
