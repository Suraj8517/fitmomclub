import React, { useEffect, useState } from 'react'
import { client, urlFor } from '../sanityclient'
import { Link } from 'react-router-dom'
const QUERY = `*[_type == "post"] | order(publishedAt desc) {
  _id, title, slug, publishedAt, excerpt, mainImage,
  "author": author->name,
  "category": category->title,
  "part": partNumber,
  "level": difficultyLevel
}`

const TEAL = '#0a6c58'
const TEAL_SOFT = '#e6f3f0'

function getReadTime(excerpt = '') {
  const words = excerpt.trim().split(/\s+/).length
  const mins = Math.max(1, Math.round(words / 200))
  return `${mins} min read`
}

/* Only the shimmer animation isn't expressible in Tailwind utilities */
const shimmerStyle = `
  @keyframes shimmer {
    0%   { background-position: -600px 0 }
    100% { background-position:  600px 0 }
  }
  .shimmer {
    background: linear-gradient(90deg, #eef6f4 25%, #e2efec 50%, #eef6f4 75%);
    background-size: 600px 100%;
    animation: shimmer 1.4s infinite linear;
  }
`

function SkeletonCard() {
  return (
    <div className="flex flex-col gap-3">
      <div className="shimmer rounded-xl w-full aspect-video" />
      <div className="shimmer rounded w-24 h-3" />
      <div className="shimmer rounded w-[85%] h-5" />
      <div className="shimmer rounded w-[70%] h-5" />
      <div className="shimmer rounded w-full h-3.5" />
      <div className="shimmer rounded w-[80%] h-3.5" />
      <div className="shimmer rounded w-28 h-3 mt-1" />
    </div>
  )
}

function PostCard({ post }) {
  const readTime = getReadTime(post.excerpt || '')

  return (
    <Link
      to={`/blogs/${post.slug.current}`}
      className="flex flex-col group no-underline text-inherit"
    >
      {/* Image */}
      <div className="mb-4 rounded-xl overflow-hidden">
        {post.mainImage ? (
          <img
            src={urlFor(post.mainImage).width(600).height(338).url()}
            alt={post.title}
            className="w-full aspect-video object-cover object-center block transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <div className="w-full aspect-video rounded-xl flex items-center justify-center" style={{ backgroundColor: TEAL_SOFT }}>
            <svg width="40" height="40" viewBox="0 0 48 48" fill="none">
              <rect x="6"  y="16" width="36" height="7" rx="3.5" fill="#9fc9c0" />
              <rect x="6"  y="26" width="36" height="7" rx="3.5" fill="#b7d9d1" />
              <rect x="12" y="6"  width="24" height="8" rx="4"   fill="#87bdb1" />
            </svg>
          </div>
        )}
      </div>

      {/* Category */}
      {post.category && (
        <span
          className="inline-block w-fit text-[11.5px] font-semibold mb-3 capitalize font-[Poppins] px-2.5 py-1 rounded-full tracking-wide"
          style={{ color: TEAL, backgroundColor: TEAL_SOFT }}
        >
          {post.category}
        </span>
      )}

      {/* Title */}
      <h2 className="font-[Poppins] text-[1.15rem] font-semibold leading-snug tracking-tight text-gray-900 mb-2 transition-colors duration-150" style={{ '--tw-hover-color': TEAL }}
        onMouseEnter={(e) => (e.currentTarget.style.color = TEAL)}
        onMouseLeave={(e) => (e.currentTarget.style.color = '')}
      >
        {post.title}
      </h2>

      {/* Excerpt */}
      {post.excerpt && (
        <p className="font-[Poppins] text-sm leading-relaxed text-gray-500 mb-3 line-clamp-3">
          {post.excerpt}
        </p>
      )}

      {/* Author + Read time */}
      <div className="flex items-center gap-1.5 mt-auto font-[Poppins] text-[13px] text-gray-400">
        {post.author && (
          <>
            <span className="text-gray-600 font-medium">{post.author}</span>
            <span className="text-gray-300">|</span>
          </>
        )}
        <span>{readTime}</span>
      </div>
    </Link>
  )
}

export default function Blog() {
  const [posts, setPosts]     = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    client.fetch(QUERY).then(data => {
      setPosts(data)
      setLoading(false)
    })
  }, [])

  return (
    <div className="bg-white min-h-screen font-[Poppins] mb-24">
      <style>{`
        ${shimmerStyle}
      `}</style>

      {/* ── Hero ── */}
      <div className="relative overflow-hidden">
        <div
          className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[900px] h-[900px] rounded-full opacity-60 blur-3xl"
          style={{ background: `radial-gradient(circle, ${TEAL_SOFT} 0%, transparent 65%)` }}
        />
        <div className="relative max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-12 pt-24 sm:pt-36 lg:pt-[150px] pb-16 sm:pb-20 lg:pb-24 text-center">
          <span
            className="inline-block text-[13px] font-medium tracking-[0.1em] uppercase mb-6 px-3.5 py-1.5 rounded-full"
            style={{ color: TEAL, backgroundColor: TEAL_SOFT }}
          >
            Blog &amp; Guides
          </span>
          <h1 className="text-[clamp(36px,6vw,80px)] font-medium tracking-[-0.04em] leading-[1.05] text-[#0A0A0A] mb-6 sm:mb-7">
            Wellness Guidance
            <br />
            for Every Mom
          </h1>
          <p className="text-base sm:text-lg leading-[1.7] text-[#6B7280] max-w-[540px] mx-auto mb-10 sm:mb-12">
            Real, expert-backed guidance on fitness, nutrition, and wellbeing — for prenatal, postnatal, and every stage of motherhood in between.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
            <button
              className="w-full sm:w-auto text-white border-none rounded-full px-8 py-4 text-[15px] font-semibold cursor-pointer tracking-[-0.01em] group flex items-center justify-center gap-2 transition-colors duration-200"
              style={{
                backgroundColor: TEAL,
                letterSpacing: "0.01em",
                minHeight: "44px",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#085041')}
              onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = TEAL)}
            >
              Book a Consultation
              <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                  <path
                    d="M3 8h10M9 4l4 4-4 4"
                    stroke="#ffffff"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
            </button>
            <Link
              to="/fmc"
              className="w-full sm:w-auto bg-transparent text-[#0A0A0A] border-[1.5px] border-[#E5E7EB] rounded-full px-8 py-4 text-[15px] font-semibold cursor-pointer tracking-[-0.01em] transition-colors duration-200 hover:border-[#0a6c58]"
            >
              View Programs
            </Link>
          </div>
        </div>
      </div>

      {/* ── Articles ── */}
      <section className="max-w-[1200px] mx-auto px-6 py-14 pb-24">

        {/* Section label row */}
        <div className="flex items-center gap-3 mb-10">
          <span className="text-[11px] font-semibold tracking-widest uppercase whitespace-nowrap" style={{ color: TEAL }}>
            All Articles
          </span>
          <div className="flex-1 h-px bg-gray-100" />
          {!loading && posts.length > 0 && (
            <span className="text-xs text-gray-300 whitespace-nowrap">
              {posts.length} article{posts.length !== 1 ? 's' : ''}
            </span>
          )}
        </div>

        {/* Skeleton */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {Array.from({ length: 6 }, (_, i) => <SkeletonCard key={i} />)}
          </div>
        )}

        {/* Empty */}
        {!loading && posts.length === 0 && (
          <div className="text-center py-20 text-sm text-gray-400">
            No articles published yet. Check back soon.
          </div>
        )}

        {/* Grid */}
        {!loading && posts.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
            {posts.map(post => (
              <PostCard key={post._id} post={post} />
            ))}
          </div>
        )}
      </section>
    </div>
  )
}