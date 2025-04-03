"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Calendar, Clock } from 'lucide-react'
import { remark } from 'remark'
import html from 'remark-html'
import { getBlogPostBySlug, categoryColors } from '../../lib/firebase'
import { BlogPost } from '../../lib/blog-types'


interface BlogPostPageProps {
  params: {
    slug: string
  }
}


export default function BlogPostPage({ params }: BlogPostPageProps) {
  const [post, setPost] = useState<BlogPost | null>(null)
  const [htmlContent, setHtmlContent] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch blog post data
  useEffect(() => {
    async function fetchBlogPost() {
      try {
        setIsLoading(true)
        const blogPost = await getBlogPostBySlug(params.slug)
        setPost(blogPost)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load blog post. Please try again later.')
        setIsLoading(false)
        console.error('Error fetching blog post:', err)
      }
    }

    fetchBlogPost()
  }, [params.slug])

  // Process markdown content
  useEffect(() => {
    const processContent = async () => {
      if (post && post.content) {
        try {
          const processedContent = await remark()
            .use(html)
            .process(post.content)
          setHtmlContent(processedContent.toString())
        } catch (err) {
          console.error('Error processing markdown:', err)
          setHtmlContent('<p>Error rendering content</p>')
        }
      }
    }
    processContent()
  }, [post])

  // Loading state
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

  // Error state
  if (error || !post) {
    return (
      <div className="min-h-screen bg-yellow-200 p-4 sm:p-6 md:p-8 font-mono">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6 border-4 border-black p-4 bg-white inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            Blog Not Found
          </h1>
          <p className="mb-6 text-lg">{error || "Sorry, the blog post you're looking for doesn't exist."}</p>
          <Link href="/blog" className="inline-block border-4 border-black px-4 py-2 bg-white hover:bg-gray-100 font-bold transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            <ArrowLeft className="inline mr-2 w-4 h-4" />
            Back to Blog List
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-yellow-200 p-4 sm:p-6 md:p-8 font-mono">
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
          <div 
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:border-b-2 prose-headings:border-black prose-headings:pb-2 prose-headings:mb-4 prose-a:text-blue-600 prose-a:font-bold hover:prose-a:text-blue-800 prose-img:border-4 prose-img:border-black prose-strong:font-bold prose-code:bg-gray-100 prose-code:p-1 prose-code:rounded prose-code:before:content-none prose-code:after:content-none"
            dangerouslySetInnerHTML={{ __html: htmlContent }} 
          />
        </div>
        
        {/* Navigation */}
        <div className="flex flex-wrap gap-4">
          <Link href="/blog" className="inline-block border-4 border-black px-4 py-2 bg-white hover:bg-gray-100 font-bold transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
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