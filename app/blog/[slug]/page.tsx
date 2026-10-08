'use client'

import { useState, useEffect, Suspense } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import Nav from '../../_components/Nav'
import Footer from '../../_components/Footer'
import { Reveal } from '../../_components/Primitives'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.lookreal.com'

interface Author { firstName: string; lastName: string; avatar?: string }
interface Comment { _id: string; user: Author & { _id?: string }; content: string; isHidden: boolean; createdAt: string }
interface Reaction { user: string; type: 'like' | 'love' | 'insightful' | 'helpful' }
interface BlogPost {
  _id: string
  title: string
  content: string
  excerpt: string
  slug: string
  coverImage?: string
  category: string
  tags: string[]
  keywords: string[]
  metaTitle?: string
  metaDescription?: string
  author: Author
  publishedAt: string
  views: number
  likesCount: number
  commentsCount: number
  reactions: Reaction[]
  comments: Comment[]
  isFeatured: boolean
}

const reactionEmojis = {
  like: { emoji: '👍', label: 'Like' },
  love: { emoji: '❤️', label: 'Love' },
  insightful: { emoji: '💡', label: 'Insightful' },
  helpful: { emoji: '🙌', label: 'Helpful' },
}

export default function BlogPostPage() {
  const params = useParams()
  const slug = params?.slug as string

  const [post, setPost] = useState<BlogPost | null>(null)
  const [loading, setLoading] = useState(true)
  const [commentText, setCommentText] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    if (slug) fetchPost()
  }, [slug])

  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement
      const total = h.scrollHeight - h.clientHeight
      setProgress(total > 0 ? (window.scrollY / total) * 100 : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (!post) return
    document.title = post.metaTitle || `${post.title} | LookReal Journal`
    const updateMeta = (name: string, content: string, property?: boolean) => {
      const attr = property ? 'property' : 'name'
      let el = document.querySelector(`meta[${attr}="${name}"]`)
      if (!el) {
        el = document.createElement('meta')
        el.setAttribute(attr, name)
        document.head.appendChild(el)
      }
      el.setAttribute('content', content)
    }
    updateMeta('description', post.metaDescription || post.excerpt)
    updateMeta('keywords', post.keywords.join(', '))
    updateMeta('og:title', post.metaTitle || post.title, true)
    updateMeta('og:description', post.metaDescription || post.excerpt, true)
    updateMeta('og:type', 'article', true)
    if (post.coverImage) updateMeta('og:image', post.coverImage, true)
    updateMeta('twitter:card', 'summary_large_image')
    updateMeta('twitter:title', post.metaTitle || post.title)
    updateMeta('twitter:description', post.metaDescription || post.excerpt)
    updateMeta('article:published_time', post.publishedAt, true)
    updateMeta('article:section', post.category, true)
    post.tags.forEach((tag) => updateMeta('article:tag', tag, true))
  }, [post])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/blog/post/${slug}`)
      const data = await res.json()
      if (data.success) setPost(data.data.post)
      else setError('Post not found')
    } catch {
      setError('Failed to load article')
    } finally {
      setLoading(false)
    }
  }

  const handleReaction = async (type: 'like' | 'love' | 'insightful' | 'helpful') => {
    if (!post) return
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) { alert('Please sign in to the LookReal app to react.'); return }
      const res = await fetch(`${API_URL}/api/v1/blog/${post._id}/react`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ type }),
      })
      const data = await res.json()
      if (data.success) setPost((prev) => prev ? { ...prev, likesCount: data.data.likesCount, reactions: data.data.reactions } : null)
    } catch {}
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post || !commentText.trim()) return
    setSubmitting(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) { alert('Please sign in to the LookReal app to comment.'); setSubmitting(false); return }
      const res = await fetch(`${API_URL}/api/v1/blog/${post._id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ content: commentText }),
      })
      const data = await res.json()
      if (data.success) {
        setPost((prev) => prev ? { ...prev, comments: data.data.comments, commentsCount: data.data.commentsCount } : null)
        setCommentText('')
      }
    } catch {} finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const getReactionCount = (type: string) => post?.reactions.filter((r) => r.type === type).length || 0

  if (loading) {
    return (
      <main className="min-h-screen bg-canvas flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-line border-t-ink rounded-full animate-spin" />
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="min-h-screen bg-canvas flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <p className="eyebrow mb-5">404</p>
          <h1 className="font-display text-5xl md:text-6xl font-light tracking-tightest">Article not found</h1>
          <p className="mt-5 text-ink/60">{error || 'The article you are looking for does not exist.'}</p>
          <Link href="/blog" className="mt-8 inline-flex items-center gap-2 btn-pill btn-primary">← Back to Journal</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative bg-canvas text-ink min-h-screen">
      {/* Read progress */}
      <div className="fixed top-0 inset-x-0 h-[2px] bg-line z-[60]">
        <div className="h-full bg-primary origin-left transition-[width] duration-100" style={{ width: `${progress}%` }} />
      </div>

      <Nav
        links={[
          { href: '/#features', label: 'Features' },
          { href: '/blog', label: 'Journal' },
          { href: '/contact', label: 'Contact' },
        ]}
      />

      <article className="relative pt-32 md:pt-40 pb-20 px-6 lg:px-10">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <nav className="flex items-center gap-2 text-sm text-ink/50 mb-10">
              <Link href="/" className="hover:text-ink transition-colors">Home</Link>
              <span>/</span>
              <Link href="/blog" className="hover:text-ink transition-colors">Journal</Link>
              <span>/</span>
              <span className="text-primary">{post.category}</span>
            </nav>
          </Reveal>

          <Reveal delay={0.05}>
            {post.isFeatured && (
              <span className="inline-block bg-ink text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-6">
                Featured
              </span>
            )}
            <h1 className="font-display text-4xl md:text-6xl font-light leading-[1.05] tracking-tightest">
              {post.title}
            </h1>
          </Reveal>

          <Reveal delay={0.15}>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-sm text-ink/50">
              <div className="flex items-center gap-2.5">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt="" className="w-9 h-9 rounded-full border border-line" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-primary/10 border border-primary/20 text-primary font-semibold flex items-center justify-center">
                    {post.author.firstName?.[0]}
                  </div>
                )}
                <span className="text-ink font-medium">{post.author.firstName} {post.author.lastName}</span>
              </div>
              <span>·</span>
              <span>{formatDate(post.publishedAt)}</span>
              <span>·</span>
              <span>{post.views} views</span>
            </div>
          </Reveal>

          {post.coverImage && (
            <Reveal delay={0.25}>
              <div className="mt-12 rounded-3xl overflow-hidden border border-line">
                <img src={post.coverImage} alt={post.title} className="w-full max-h-[600px] object-cover" />
              </div>
            </Reveal>
          )}

          <Reveal delay={0.3}>
            <div
              className="mt-14 prose-light"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />
          </Reveal>

          {/* Tags */}
          <div className="mt-16 pt-10 border-t border-line">
            <div className="flex flex-wrap gap-2 mb-4">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="text-xs text-ink/60 bg-canvas-soft border border-line px-3 py-1.5 rounded-full hover:border-ink/40 hover:text-ink transition-colors"
                >
                  #{tag}
                </Link>
              ))}
            </div>
            {post.keywords.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.keywords.map((kw) => (
                  <Link
                    key={kw}
                    href={`/blog?keyword=${kw}`}
                    className="text-[10px] text-ink/40 uppercase tracking-widest px-2 py-1 border border-transparent hover:border-line transition-colors rounded-full"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reactions */}
          <div className="mt-12">
            <h3 className="font-display text-2xl mb-5 tracking-tight">React to this piece</h3>
            <div className="flex flex-wrap gap-2">
              {(Object.keys(reactionEmojis) as Array<keyof typeof reactionEmojis>).map((type) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  className="flex items-center gap-2.5 bg-canvas-soft border border-line hover:border-ink/40 rounded-full px-4 py-2.5 transition-all hover:scale-[1.02]"
                >
                  <span className="text-base">{reactionEmojis[type].emoji}</span>
                  <span className="text-sm font-medium">{reactionEmojis[type].label}</span>
                  <span className="text-xs text-ink/50 bg-white border border-line rounded-full px-2 py-0.5 font-mono">
                    {getReactionCount(type)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="mt-16 pt-10 border-t border-line">
            <h3 className="font-display text-3xl mb-8 tracking-tight">Comments <span className="text-ink/30 font-mono text-xl">({post.commentsCount})</span></h3>

            <form onSubmit={handleComment} className="mb-10">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts…"
                rows={3}
                maxLength={2000}
                className="field resize-none"
              />
              <div className="mt-3 flex justify-between items-center">
                <span className="text-xs text-ink/40 font-mono">{commentText.length}/2000</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!commentText.trim() || submitting}
                  className="btn-pill btn-primary disabled:opacity-40"
                >
                  {submitting ? 'Posting…' : 'Post Comment'}
                </motion.button>
              </div>
            </form>

            <div className="space-y-6">
              {post.comments
                .filter((c) => !c.isHidden)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-canvas-soft border border-line rounded-2xl p-5"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {comment.user.avatar ? (
                        <img src={comment.user.avatar} alt="" className="w-8 h-8 rounded-full border border-line" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-semibold flex items-center justify-center">
                          {comment.user.firstName?.[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-sm">{comment.user.firstName} {comment.user.lastName}</span>
                        <span className="text-xs text-ink/40 ml-2">{formatDate(comment.createdAt)}</span>
                      </div>
                    </div>
                    <p className="text-sm text-ink/80 leading-relaxed">{comment.content}</p>
                  </motion.div>
                ))}

              {post.comments.filter((c) => !c.isHidden).length === 0 && (
                <p className="text-center text-ink/40 py-10 border border-dashed border-line rounded-2xl">
                  No comments yet. Be the first.
                </p>
              )}
            </div>
          </div>
        </div>
      </article>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.metaDescription || post.excerpt,
            image: post.coverImage,
            author: { '@type': 'Person', name: `${post.author.firstName} ${post.author.lastName}` },
            publisher: { '@type': 'Organization', name: 'LookReal', logo: { '@type': 'ImageObject', url: 'https://lookreal.beauty/assets/logo.png' } },
            datePublished: post.publishedAt,
            keywords: post.keywords.join(', '),
            articleSection: post.category,
            interactionStatistic: [
              { '@type': 'InteractionCounter', interactionType: 'https://schema.org/LikeAction', userInteractionCount: post.likesCount },
              { '@type': 'InteractionCounter', interactionType: 'https://schema.org/CommentAction', userInteractionCount: post.commentsCount },
            ],
          }),
        }}
      />

      <Footer />
    </main>
  )
}
