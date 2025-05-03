"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { MDXRemote } from 'next-mdx-remote'
import { serialize } from 'next-mdx-remote/serialize'
import { getBlogPostBySlug, categoryColors } from '../../lib/firebase'
import { BlogPost } from '../../lib/blog-types'
import { sanitizeMdxContent } from '../../lib/mdx-utils'
import rehypeHighlight from 'rehype-highlight'

const components = {
  h1: (props: any) => <h1 className="text-3xl font-bold mt-8 mb-4 border-b-2 border-black pb-2" {...props} />,
  h2: (props: any) => <h2 className="text-2xl font-bold mt-6 mb-3 border-b-2 border-black pb-2" {...props} />,
  h3: (props: any) => <h3 className="text-xl font-bold mt-5 mb-2" {...props} />,
  p: (props: any) => <p className="my-4" {...props} />,
  ul: (props: any) => <ul className="list-disc pl-6 my-4" {...props} />,
  ol: (props: any) => <ol className="list-decimal pl-6 my-4" {...props} />,
  li: (props: any) => <li className="mb-1" {...props} />,
  a: (props: any) => <a className="text-blue-600 font-bold hover:text-blue-800 underline" {...props} />,
  blockquote: (props: any) => <blockquote className="border-l-4 border-black pl-4 italic my-4" {...props} />,
  code: ({ children, className }: any) => {
    const match = /language-(\w+)/.exec(className || '')
    return match ? (
      <pre className="bg-gray-100 p-4 rounded-md overflow-x-auto my-4 border-2 border-black">
        <code className={className}>{children}</code>
      </pre>
    ) : (
      <code className="bg-gray-100 px-1 py-0.5 rounded">{children}</code>
    )
  },
  img: (props: any) => (
    <div className="my-6">
      <img className="border-4 border-black max-w-full h-auto" {...props} />
    </div>
  ),
  table: (props: any) => <table className="w-full border-collapse my-6 border-2 border-black" {...props} />,
  th: (props: any) => <th className="border border-black bg-gray-100 p-2 text-left" {...props} />,
  td: (props: any) => <td className="border border-black p-2" {...props} />,
}

interface BlogPostPageProps {
  params: {
    slug: string
  }
}

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [mdxSource, setMdxSource] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchBlogPost() {
      try {
        setIsLoading(true)
        const blogPost = await getBlogPostBySlug(params.slug)
        setPost(blogPost)

        if (blogPost && blogPost.content) {
          const sanitizedContent = sanitizeMdxContent(blogPost.content)
          try {
            const mdx = await serialize(sanitizedContent, {
              mdxOptions: {
                development: process.env.NODE_ENV === 'development',
                rehypePlugins: [[rehypeHighlight, { detect: true }]],
              },
            })
            setMdxSource(mdx)
          } catch (mdxError) {
            console.warn('MDX parsing failed:', mdxError)
            setError('Failed to parse blog content.')
          }
        } else {
          setError('Blog content not found.')
        }
      } catch (err) {
        setError('Failed to load blog post. Please try again later.')
        console.error('Error fetching or processing blog post:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPost()
  }, [params.slug])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-yellow-200 p-4 sm:p-6 md:p-8 font-mono">
        <div className="max-w-4xl mx-auto">
          <div className="h-64 sm:h-80 md:h-96 mb-6 border-4 border-black bg-gray-300 animate-pulse"></div>
          <div className="h-12 w-64 bg-gray-300 animate-pulse mb-4"></div>
          <div className="flex gap-4 mb-8">
            <div className="h-8 w-20 bg-gray-300 animate-pulse"></div>
            <div className="h-8 w-32 bg-gray-300 animate-pulse"></div>
            <div className="h-8 w-24 bg-gray-300 animate-pulse"></div>
          </div>
          <div className="border-4 border-black bg-white p-6 mb-8">
            <div className="h-6 bg-gray-300 animate-pulse mb-4 w-full"></div>
            <div className="h-6 bg-gray-300 animate-pulse mb-4 w-5/6"></div>
            <div className="h-6 bg-gray-300 animate-pulse mb-4 w-full"></div>
            <div className="h-6 bg-gray-300 animate-pulse mb-4 w-4/5"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !post || !mdxSource) {
    return (
      <div className="min-h-screen bg-yellow-200 p-4 sm:p-6 md:p-8 font-mono">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 border-4 border-black p-4 bg-white inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Blog Not Found
          </h1>
          <p className="mb-6 text-lg">{error || "Sorry, the blog post you're looking for doesn't exist."}</p>
          <Link
            href="/blogs"
            className="inline-block border-4 border-black px-4 py-2 bg-white hover:bg-gray-100 font-bold transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
          >
            <ArrowLeft className="inline mr-2 w-4 h-4" /> Back to Blogs
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-100 p-4 sm:p-6 md:p-8 font-mono">
      <div className="max-w-4xl mx-auto">
        {/* Featured Image */}
        <div className="relative h-64 sm:h-80 md:h-96 mb-6 border-4 border-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
          <Image 
            src={post.image || "/placeholder.svg"} 
            alt={post.title}
            fill
            className="object-cover"
          />
        </div>
        
        {/* Title and Meta */}
        <h1 className="text-3xl sm:text-4xl font-bold mb-4 border-4 border-black p-4 bg-white inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          {post.title}
        </h1>
        
        <div className="flex flex-wrap items-center gap-4 mb-8">
          <span className={`text-sm font-bold px-3 py-1 border-2 border-black rounded-full text-black ${categoryColors[post.category]}`}>
            {post.category}
          </span>
          <span className="flex items-center text-sm border-2 border-black px-3 py-1 bg-white">
            <Calendar className="w-4 h-4 mr-1" />
            {post.date}
          </span>
          <span className="flex items-center text-sm border-2 border-black px-3 py-1 bg-white">
            <Clock className="w-4 h-4 mr-1" />
            {post.readTime}
          </span>
        </div>
        
        {/* Content */}
        <div className="border-4 border-black bg-white p-6 mb-8 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
        <MDXRemote {...mdxSource} components={components} />
        </div>
        
        {/* Navigation */}
        <div className="flex flex-wrap gap-4">
          <Link href="/blogs" className="inline-block border-4 border-black px-4 py-2 bg-white hover:bg-gray-100 font-bold transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ArrowLeft className="inline mr-2 w-4 h-4" />
            Back to Blog List
          </Link>
          <Link href="/" className="inline-block border-4 border-black px-4 py-2 bg-white hover:bg-gray-100 font-bold transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Back to Portfolio
          </Link>
        </div>
      </div>
    </div>
  )
}