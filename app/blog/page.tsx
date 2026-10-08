'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import Nav from '../_components/Nav'
import Footer from '../_components/Footer'
import { Reveal, Eyebrow } from '../_components/Primitives'

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
  author: { firstName: string; lastName: string; avatar?: string }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, activeCategory, activeKeyword, searchQuery])

  const fetchPosts = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams({ page: page.toString(), limit: '9' })
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

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })

  const featured = posts.find((p) => p.isFeatured) || posts[0]
  const rest = featured ? posts.filter((p) => p._id !== featured._id) : posts

  return (
    <main className="relative bg-canvas text-ink min-h-screen">
      <Nav
        links={[
          { href: '/#features', label: 'Features' },
          { href: '/blog', label: 'Blog' },
          { href: '/contact', label: 'Contact' },
        ]}
      />

      <section className="relative pt-36 md:pt-44 pb-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          <Eyebrow>Journal</Eyebrow>
          <Reveal delay={0.1}>
            <h1 className="mt-5 font-display text-5xl md:text-8xl font-light leading-[0.95] tracking-tightest">
              Stories, tips &amp; <span className="serif-italic text-primary">signals.</span>
            </h1>
          </Reveal>
          <Reveal delay={0.2}>
            <p className="mt-6 max-w-2xl text-lg md:text-xl text-ink/60 leading-relaxed">
              Field notes on local commerce, beauty, entrepreneurship, and the vendors making it all work in Lagos and beyond.
            </p>
          </Reveal>

          {/* Search */}
          <Reveal delay={0.3}>
            <div className="mt-10 max-w-xl relative">
              <input
                type="text"
                placeholder="Search articles…"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setPage(1) }}
                className="field pr-12"
              />
              <svg className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-ink/40" fill="none" stroke="currentColor" strokeWidth={1.75} viewBox="0 0 24 24">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.3-4.3" strokeLinecap="round" />
              </svg>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Filters */}
      <section className="px-6 lg:px-10">
        <div className="max-w-7xl mx-auto space-y-4 pb-10 border-b border-line">
          {categories.length > 0 && (
            <Reveal delay={0.1}>
              <div className="flex flex-wrap gap-2">
                <FilterPill
                  active={!activeCategory}
                  onClick={() => { setActiveCategory(''); setPage(1) }}
                >
                  All
                </FilterPill>
                {categories.map((c) => (
                  <FilterPill
                    key={c}
                    active={activeCategory === c}
                    onClick={() => { setActiveCategory(c); setPage(1) }}
                  >
                    {c}
                  </FilterPill>
                ))}
              </div>
            </Reveal>
          )}
          {keywords.length > 0 && (
            <Reveal delay={0.15}>
              <div className="flex flex-wrap gap-2">
                {keywords.slice(0, 15).map((k) => (
                  <button
                    key={k}
                    onClick={() => { setActiveKeyword(activeKeyword === k ? '' : k); setPage(1) }}
                    className={`text-xs px-3 py-1 rounded-full border transition-all ${
                      activeKeyword === k
                        ? 'bg-primary/10 border-primary/40 text-primary'
                        : 'border-line text-ink/50 hover:border-ink/40 hover:text-ink'
                    }`}
                  >
                    #{k}
                  </button>
                ))}
              </div>
            </Reveal>
          )}
        </div>
      </section>

      {/* Posts */}
      <section className="py-16 px-6 lg:px-10">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="py-24 flex justify-center">
              <div className="w-10 h-10 border-2 border-line border-t-ink rounded-full animate-spin" />
            </div>
          ) : posts.length === 0 ? (
            <div className="py-24 text-center">
              <p className="font-display text-3xl text-ink/60">No articles yet.</p>
              <p className="mt-3 text-ink/40">Check back soon — we publish weekly.</p>
            </div>
          ) : (
            <>
              {/* Featured */}
              {featured && (
                <Reveal>
                  <Link href={`/blog/${featured.slug}`} className="group block mb-16">
                    <div className="grid md:grid-cols-5 gap-8 items-center">
                      <div className="md:col-span-3 aspect-[4/3] overflow-hidden rounded-3xl bg-canvas-soft border border-line relative">
                        {featured.coverImage ? (
                          <img
                            src={featured.coverImage}
                            alt={featured.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-primary/40">
                            <svg className="w-24 h-24" viewBox="0 0 24 24" fill="currentColor"><path d="M4 4h16v16H4z" opacity="0.1" /></svg>
                          </div>
                        )}
                        <span className="absolute top-5 left-5 bg-ink text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full">Featured</span>
                      </div>
                      <div className="md:col-span-2">
                        <p className="eyebrow mb-4">{featured.category} · {formatDate(featured.publishedAt)}</p>
                        <h2 className="font-display text-3xl md:text-5xl font-light leading-tight tracking-tight group-hover:text-primary transition-colors">
                          {featured.title}
                        </h2>
                        <p className="mt-5 text-ink/60 leading-relaxed">{featured.excerpt}</p>
                        <div className="mt-6 flex items-center gap-3 text-sm text-ink/50">
                          <span>{featured.author.firstName} {featured.author.lastName}</span>
                          <span>·</span>
                          <span>{featured.views} views</span>
                        </div>
                        <div className="mt-6 inline-flex items-center gap-2 text-sm font-semibold ulink">
                          Read story
                          <svg className="w-4 h-4 transition-transform group-hover:translate-x-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}><path d="M5 12h14M13 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" /></svg>
                        </div>
                      </div>
                    </div>
                  </Link>
                </Reveal>
              )}

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-14">
                {rest.map((post, i) => (
                  <motion.article
                    key={post._id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-50px' }}
                    transition={{ delay: i * 0.05, duration: 0.6 }}
                  >
                    <Link href={`/blog/${post.slug}`} className="group block">
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-canvas-soft border border-line">
                        {post.coverImage ? (
                          <img
                            src={post.coverImage}
                            alt={post.title}
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="font-display text-5xl text-ink/10">lookreal</span>
                          </div>
                        )}
                      </div>
                      <div className="mt-5">
                        <p className="eyebrow mb-3">{post.category} · {formatDate(post.publishedAt)}</p>
                        <h3 className="font-display text-2xl md:text-[1.75rem] font-normal leading-tight tracking-tight group-hover:text-primary transition-colors">
                          {post.title}
                        </h3>
                        <p className="mt-3 text-sm text-ink/60 leading-relaxed line-clamp-3">{post.excerpt}</p>
                        <div className="mt-4 flex items-center justify-between text-xs text-ink/40">
                          <span>{post.author.firstName} {post.author.lastName}</span>
                          <span className="flex items-center gap-3">
                            <span>♥ {post.likesCount}</span>
                            <span>💬 {post.commentsCount}</span>
                          </span>
                        </div>
                      </div>
                    </Link>
                  </motion.article>
                ))}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-20 flex justify-center items-center gap-2">
                  <PageButton onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!pagination.hasPrevPage}>
                    ← Previous
                  </PageButton>
                  {Array.from({ length: pagination.totalPages }, (_, i) => i + 1)
                    .filter((p) => Math.abs(p - page) <= 2)
                    .map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-10 h-10 rounded-full text-sm font-medium transition-all ${
                          p === page
                            ? 'bg-ink text-white'
                            : 'border border-line text-ink hover:border-ink'
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                  <PageButton onClick={() => setPage((p) => p + 1)} disabled={!pagination.hasNextPage}>
                    Next →
                  </PageButton>
                </div>
              )}
            </>
          )}
        </div>
      </section>

      <Footer />
    </main>
  )
}

function FilterPill({ active, children, onClick }: { active: boolean; children: React.ReactNode; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all border ${
        active
          ? 'bg-ink text-white border-ink'
          : 'border-line text-ink/70 hover:border-ink hover:text-ink'
      }`}
    >
      {children}
    </button>
  )
}

function PageButton({ onClick, disabled, children }: { onClick: () => void; disabled: boolean; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className="px-4 py-2 rounded-full text-sm border border-line hover:border-ink hover:bg-ink hover:text-white disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-ink disabled:hover:border-line transition-colors"
    >
      {children}
    </button>
  )
}
