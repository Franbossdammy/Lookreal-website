'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { useParams } from 'next/navigation'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.lookreal.com'

interface Author {
  firstName: string
  lastName: string
  avatar?: string
}

interface Comment {
  _id: string
  user: Author & { _id?: string }
  content: string
  isHidden: boolean
  createdAt: string
}

interface Reaction {
  user: string
  type: 'like' | 'love' | 'insightful' | 'helpful'
}

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

  useEffect(() => {
    if (slug) fetchPost()
  }, [slug])

  // Update page title and meta dynamically
  useEffect(() => {
    if (post) {
      document.title = post.metaTitle || `${post.title} | LookReal Blog`

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
    }
  }, [post])

  const fetchPost = async () => {
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/v1/blog/post/${slug}`)
      const data = await res.json()
      if (data.success) {
        setPost(data.data.post)
      } else {
        setError('Post not found')
      }
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
      if (!token) {
        alert('Please sign in to the LookReal app to react to posts.')
        return
      }
      const res = await fetch(`${API_URL}/api/v1/blog/${post._id}/react`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ type }),
      })
      const data = await res.json()
      if (data.success) {
        setPost(prev => prev ? {
          ...prev,
          likesCount: data.data.likesCount,
          reactions: data.data.reactions,
        } : null)
      }
    } catch {}
  }

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!post || !commentText.trim()) return

    setSubmitting(true)
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        alert('Please sign in to the LookReal app to comment.')
        setSubmitting(false)
        return
      }
      const res = await fetch(`${API_URL}/api/v1/blog/${post._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ content: commentText }),
      })
      const data = await res.json()
      if (data.success) {
        setPost(prev => prev ? {
          ...prev,
          comments: data.data.comments,
          commentsCount: data.data.commentsCount,
        } : null)
        setCommentText('')
      }
    } catch {} finally {
      setSubmitting(false)
    }
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const getReactionCount = (type: string) => {
    return post?.reactions.filter(r => r.type === type).length || 0
  }

  if (loading) {
    return (
      <main className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
      </main>
    )
  }

  if (error || !post) {
    return (
      <main className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-slate-400 mb-6">{error || 'The article you are looking for does not exist.'}</p>
          <Link href="/blog" className="text-primary hover:underline">Back to Blog</Link>
        </div>
      </main>
    )
  }

  return (
    <main className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-60" />

      {/* Navigation */}
      <motion.nav
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-slate-950/80 border-b border-primary/20"
      >
        <div className="container mx-auto px-6 py-5 flex justify-between items-center max-w-7xl">
          <Link href="/" className="flex items-center gap-3">
            <img src="/assets/logo.png" alt="LookReal Logo" className="w-10 h-10 rounded-xl" />
            <span className="text-2xl font-display font-bold">LookReal</span>
          </Link>
          <div className="hidden md:flex gap-8 items-center">
            <Link href="/blog" className="text-primary font-medium">Blog</Link>
            <Link href="/contact" className="hover:text-primary transition-colors font-medium">Contact</Link>
            <motion.a
              href="/#download"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gradient-to-r from-primary to-primary-light px-6 py-2.5 rounded-full font-semibold hover:shadow-lg hover:shadow-primary/50 transition-all"
            >
              Get Started
            </motion.a>
          </div>
        </div>
      </motion.nav>

      {/* Article */}
      <article className="relative pt-28 pb-20 px-6">
        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-sm text-slate-400 mb-8">
            <Link href="/" className="hover:text-white">Home</Link>
            <span>/</span>
            <Link href="/blog" className="hover:text-white">Blog</Link>
            <span>/</span>
            <span className="text-primary">{post.category}</span>
          </nav>

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {post.isFeatured && (
              <span className="inline-block bg-primary text-white text-xs font-bold px-3 py-1 rounded-full mb-4">
                Featured
              </span>
            )}
            <h1 className="text-4xl md:text-5xl font-display font-bold mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author & Meta */}
            <div className="flex flex-wrap items-center gap-4 mb-8 text-sm text-slate-400">
              <div className="flex items-center gap-2">
                {post.author.avatar ? (
                  <img src={post.author.avatar} alt="" className="w-8 h-8 rounded-full" />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold">
                    {post.author.firstName?.[0]}
                  </div>
                )}
                <span className="text-white font-medium">
                  {post.author.firstName} {post.author.lastName}
                </span>
              </div>
              <span>{formatDate(post.publishedAt)}</span>
              <span>{post.views} views</span>
              <span>{post.likesCount} reactions</span>
              <span>{post.commentsCount} comments</span>
            </div>

            {/* Cover Image */}
            {post.coverImage && (
              <div className="rounded-2xl overflow-hidden mb-10">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full max-h-[500px] object-cover"
                />
              </div>
            )}
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="prose prose-invert prose-lg max-w-none mb-12
              prose-headings:font-display prose-headings:text-white
              prose-p:text-slate-300 prose-p:leading-relaxed
              prose-a:text-primary prose-a:no-underline hover:prose-a:underline
              prose-strong:text-white
              prose-ul:text-slate-300 prose-ol:text-slate-300
              prose-blockquote:border-primary prose-blockquote:text-slate-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* Tags & Keywords */}
          <div className="border-t border-b border-slate-800 py-6 mb-10">
            <div className="flex flex-wrap gap-2 mb-3">
              {post.tags.map((tag) => (
                <Link
                  key={tag}
                  href={`/blog?tag=${tag}`}
                  className="text-sm text-primary/70 bg-primary/10 px-3 py-1 rounded-full hover:bg-primary/20 transition-colors"
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
                    className="text-xs text-slate-500 border border-slate-700 px-2 py-0.5 rounded-full hover:border-slate-500 transition-colors"
                  >
                    {kw}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Reactions */}
          <div className="mb-12">
            <h3 className="text-lg font-bold mb-4">React to this article</h3>
            <div className="flex flex-wrap gap-3">
              {(Object.keys(reactionEmojis) as Array<keyof typeof reactionEmojis>).map((type) => (
                <button
                  key={type}
                  onClick={() => handleReaction(type)}
                  className="flex items-center gap-2 bg-slate-800/50 hover:bg-slate-700/50 border border-slate-700 hover:border-primary/30 rounded-full px-4 py-2 transition-all"
                >
                  <span className="text-lg">{reactionEmojis[type].emoji}</span>
                  <span className="text-sm font-medium">{reactionEmojis[type].label}</span>
                  <span className="text-xs text-slate-400 bg-slate-900/50 rounded-full px-2 py-0.5">
                    {getReactionCount(type)}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div>
            <h3 className="text-xl font-bold mb-6">
              Comments ({post.commentsCount})
            </h3>

            {/* Comment Form */}
            <form onSubmit={handleComment} className="mb-8">
              <textarea
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Share your thoughts..."
                rows={3}
                maxLength={2000}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-white placeholder-slate-500 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20 resize-none"
              />
              <div className="flex justify-between items-center mt-2">
                <span className="text-xs text-slate-500">{commentText.length}/2000</span>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  disabled={!commentText.trim() || submitting}
                  className="bg-gradient-to-r from-primary to-primary-light px-6 py-2 rounded-full font-semibold text-sm disabled:opacity-50 hover:shadow-lg hover:shadow-primary/50 transition-all"
                >
                  {submitting ? 'Posting...' : 'Post Comment'}
                </motion.button>
              </div>
            </form>

            {/* Comment List */}
            <div className="space-y-6">
              {post.comments
                .filter(c => !c.isHidden)
                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .map((comment) => (
                  <motion.div
                    key={comment._id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-slate-800/30 border border-slate-700/50 rounded-xl p-4"
                  >
                    <div className="flex items-center gap-3 mb-3">
                      {comment.user.avatar ? (
                        <img src={comment.user.avatar} alt="" className="w-8 h-8 rounded-full" />
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-primary text-sm font-bold">
                          {comment.user.firstName?.[0]}
                        </div>
                      )}
                      <div>
                        <span className="font-medium text-sm">
                          {comment.user.firstName} {comment.user.lastName}
                        </span>
                        <span className="text-xs text-slate-500 ml-2">
                          {formatDate(comment.createdAt)}
                        </span>
                      </div>
                    </div>
                    <p className="text-slate-300 text-sm leading-relaxed">{comment.content}</p>
                  </motion.div>
                ))}

              {post.comments.filter(c => !c.isHidden).length === 0 && (
                <p className="text-center text-slate-500 py-8">
                  No comments yet. Be the first to share your thoughts!
                </p>
              )}
            </div>
          </div>
        </div>
      </article>

      {/* Structured Data (JSON-LD) for SEO */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.title,
            description: post.metaDescription || post.excerpt,
            image: post.coverImage,
            author: {
              '@type': 'Person',
              name: `${post.author.firstName} ${post.author.lastName}`,
            },
            publisher: {
              '@type': 'Organization',
              name: 'LookReal',
              logo: {
                '@type': 'ImageObject',
                url: 'https://lookreal.beauty/assets/logo.png',
              },
            },
            datePublished: post.publishedAt,
            keywords: post.keywords.join(', '),
            articleSection: post.category,
            interactionStatistic: [
              {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/LikeAction',
                userInteractionCount: post.likesCount,
              },
              {
                '@type': 'InteractionCounter',
                interactionType: 'https://schema.org/CommentAction',
                userInteractionCount: post.commentsCount,
              },
            ],
          }),
        }}
      />

      {/* Footer */}
      <footer className="relative border-t border-slate-800 py-12 px-6">
        <div className="container mx-auto max-w-7xl relative z-10 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} LookReal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
