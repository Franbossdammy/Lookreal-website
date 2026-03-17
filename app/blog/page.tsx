'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.lookreal.com'

interface BlogPost {
  _id: string
  title: string
  excerpt: string
  slug: string
  coverImage?: string
  category: string
  tags: string[]
  keywords: string[]
  author: {
    firstName: string
    lastName: string
    avatar?: string
  }
  publishedAt: string
  views: number
  likesCount: number
  commentsCount: number
  isFeatured: boolean
}

interface PaginationMeta {
  currentPage: number
  totalPages: number
  totalItems: number
  hasNextPage: boolean
  hasPrevPage: boolean
}

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState<PaginationMeta | null>(null)
  const [page, setPage] = useState(1)
  const [categories, setCategories] = useState<string[]>([])
  const [keywords, setKeywords] = useState<string[]>([])
  const [activeCategory, setActiveCategory] = useState<string>('')
  const [activeKeyword, setActiveKeyword] = useState<string>('')
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    fetchCategories()
    fetchKeywords()
  }, [])

  useEffect(() => {
    fetchPosts()
  }, [page, activeCategory, activeKeyword, searchQuery])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '9',
      })
      if (activeCategory) params.set('category', activeCategory)
      if (activeKeyword) params.set('keyword', activeKeyword)
      if (searchQuery) params.set('search', searchQuery)

      const res = await fetch(`${API_URL}/api/v1/blog?${params}`)
      const data = await res.json()

      if (data.success) {
        setPosts(data.data)
        setPagination(data.meta?.pagination)
      }
    } catch (err) {
      console.error('Failed to fetch posts:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchCategories = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/blog/categories`)
      const data = await res.json()
      if (data.success) setCategories(data.data.categories)
    } catch {}
  }

  const fetchKeywords = async () => {
    try {
      const res = await fetch(`${API_URL}/api/v1/blog/keywords`)
      const data = await res.json()
      if (data.success) setKeywords(data.data.keywords)
    } catch {}
  }

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  return (
    <main className="relative bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white min-h-screen">
      {/* Background */}
      <div className="fixed inset-0 gradient-mesh pointer-events-none opacity-60" />
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] animate-float" />
        <div className="absolute bottom-20 right-10 w-[600px] h-[600px] bg-primary-light/10 rounded-full blur-[120px] animate-float" style={{ animationDelay: '3s' }} />
      </div>

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
            <Link href="/#features" className="hover:text-primary transition-colors font-medium">Features</Link>
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

      {/* Hero */}
      <section className="relative pt-32 pb-16 px-6">
        <div className="container mx-auto max-w-7xl relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-display font-bold mb-4">
              Our <span className="text-gradient">Blog</span>
            </h1>
            <p className="text-xl text-slate-300 max-w-2xl mx-auto">
              Tips, insights, and stories about local services, beauty, and entrepreneurship.
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-xl mx-auto mb-8"
          >
            <div className="relative">
              <input
                type="text"
                placeholder="Search articles..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setPage(1)
                }}
                className="w-full bg-slate-800/50 border border-slate-700 rounded-full px-6 py-4 text-white placeholder-slate-400 focus:outline-none focus:border-primary/50 focus:ring-2 focus:ring-primary/20"
              />
              <svg className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </motion.div>

          {/* Categories */}
          {categories.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-wrap gap-3 justify-center mb-8"
            >
              <button
                onClick={() => { setActiveCategory(''); setPage(1) }}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  !activeCategory
                    ? 'bg-primary text-white'
                    : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setActiveCategory(cat); setPage(1) }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                    activeCategory === cat
                      ? 'bg-primary text-white'
                      : 'bg-slate-800/50 text-slate-300 hover:bg-slate-700/50'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </motion.div>
          )}

          {/* Keywords */}
          {keywords.length > 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.35 }}
              className="flex flex-wrap gap-2 justify-center mb-12"
            >
              {keywords.slice(0, 15).map((kw) => (
                <button
                  key={kw}
                  onClick={() => {
                    setActiveKeyword(activeKeyword === kw ? '' : kw)
                    setPage(1)
                  }}
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all border ${
                    activeKeyword === kw
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-slate-700 text-slate-400 hover:border-slate-500'
                  }`}
                >
                  #{kw}
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="relative pb-20 px-6">
        <div className="container mx-auto max-w-7xl relative z-10">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No articles found. Check back soon!</p>
            </div>
          ) : (
            <>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {posts.map((post, index) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="group"
                  >
                    <Link href={`/blog/${post.slug}`}>
                      <div className="bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-2xl overflow-hidden hover:border-primary/30 transition-all hover:shadow-lg hover:shadow-primary/10">
                        {/* Cover Image */}
                        <div className="relative h-48 overflow-hidden">
                          {post.coverImage ? (
                            <img
                              src={post.coverImage}
                              alt={post.title}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full bg-gradient-to-br from-primary/20 to-primary-light/20 flex items-center justify-center">
                              <svg className="w-12 h-12 text-primary/40" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                              </svg>
                            </div>
                          )}
                          {post.isFeatured && (
                            <span className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full">
                              Featured
                            </span>
                          )}
                          <span className="absolute top-3 right-3 bg-slate-900/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                            {post.category}
                          </span>
                        </div>

                        {/* Content */}
                        <div className="p-6">
                          <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors line-clamp-2">
                            {post.title}
                          </h2>
                          <p className="text-slate-400 text-sm mb-4 line-clamp-3">
                            {post.excerpt}
                          </p>

                          {/* Tags */}
                          {post.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 mb-4">
                              {post.tags.slice(0, 3).map((tag) => (
                                <span key={tag} className="text-xs text-primary/70 bg-primary/10 px-2 py-0.5 rounded-full">
                                  #{tag}
                                </span>
                              ))}
                            </div>
                          )}

                          {/* Meta */}
                          <div className="flex items-center justify-between text-xs text-slate-500">
                            <div className="flex items-center gap-2">
                              {post.author.avatar ? (
                                <img src={post.author.avatar} alt="" className="w-6 h-6 rounded-full" />
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center text-primary text-xs font-bold">
                                  {post.author.firstName?.[0]}
                                </div>
                              )}
                              <span>{post.author.firstName} {post.author.lastName}</span>
                            </div>
                            <span>{formatDate(post.publishedAt)}</span>
                          </div>

                          {/* Engagement */}
                          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-slate-700/50 text-xs text-slate-500">
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                                <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                              </svg>
                              {post.views}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                              </svg>
                              {post.likesCount}
                            </span>
                            <span className="flex items-center gap-1">
                              <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                              </svg>
                              {post.commentsCount}
                            </span>
                          </div>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {/* Pagination */}
              {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-3 mt-12">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={!pagination.hasPrevPage}
                    className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm disabled:opacity-30 hover:border-primary/50 transition-colors"
                  >
                    Previous
                  </button>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter(p => Math.abs(p - page) <= 2)
                    .map(p => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-lg text-sm font-medium transition-all ${
                          p === page
                            ? 'bg-primary text-white'
                            : 'bg-slate-800/50 border border-slate-700 hover:border-primary/50'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!pagination.hasNextPage}
                    className="px-4 py-2 rounded-lg bg-slate-800/50 border border-slate-700 text-sm disabled:opacity-30 hover:border-primary/50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="relative border-t border-slate-800 py-12 px-6">
        <div className="container mx-auto max-w-7xl relative z-10 text-center text-slate-500 text-sm">
          <p>&copy; {new Date().getFullYear()} LookReal. All rights reserved.</p>
        </div>
      </footer>
    </main>
  )
}
