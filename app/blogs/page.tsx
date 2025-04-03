"use client"

import { useState, useEffect } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { Search, Calendar, Clock, ArrowRight } from 'lucide-react'
import { getAllBlogPosts, searchBlogPosts, categoryColors } from '../lib/firebase'
import { BlogPost } from '../lib/blog-types'

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [filteredBlogs, setFilteredBlogs] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch all blogs on component mount
  useEffect(() => {
    async function fetchBlogs() {
      try {
        setIsLoading(true)
        const blogData = await getAllBlogPosts()
        setBlogs(blogData)
        setFilteredBlogs(blogData)
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load blogs. Please try again later.')
        setIsLoading(false)
        console.error('Error fetching blogs:', err)
      }
    }

    fetchBlogs()
  }, [])

  // Handle search
  useEffect(() => {
    async function performSearch() {
      if (searchTerm === '') {
        setFilteredBlogs(blogs)
      } else {
        const results = await searchBlogPosts(searchTerm)
        setFilteredBlogs(results)
      }
    }

    performSearch()
  }, [searchTerm, blogs])

  return (
    <div className="min-h-screen bg-yellow-200 p-4 sm:p-6 md:p-8 font-mono">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4 md:mb-0 border-4 border-black p-4 bg-white inline-block transform -rotate-1 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
            My Blog
          </h1>
          <div className="relative w-full md:w-64">
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full border-4 border-black p-2 pl-10 font-mono focus:outline-none"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5" />
          </div>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="grid gap-8">
            {[1, 2, 3].map((i) => (
              <div key={i} className="border-4 border-black bg-white overflow-hidden">
                <div className="h-48 sm:h-64 bg-gray-300 animate-pulse"></div>
                <div className="p-4 sm:p-6">
                  <div className="h-8 bg-gray-300 animate-pulse mb-4 w-3/4"></div>
                  <div className="h-4 bg-gray-300 animate-pulse mb-2 w-full"></div>
                  <div className="h-4 bg-gray-300 animate-pulse mb-4 w-2/3"></div>
                  <div className="flex justify-between">
                    <div className="h-4 bg-gray-300 animate-pulse w-1/3"></div>
                    <div className="h-4 bg-gray-300 animate-pulse w-1/4"></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="border-4 border-black bg-white p-6 text-center">
            <p className="text-xl font-bold text-red-500">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 border-2 border-black px-4 py-2 bg-yellow-300 hover:bg-yellow-400 font-bold"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!isLoading && !error && filteredBlogs.length === 0 && (
          <div className="border-4 border-black bg-white p-6 text-center">
            <p className="text-xl font-bold">No blogs found matching {searchTerm}</p>
          </div>
        )}

        {/* Blog List */}
        {!isLoading && !error && filteredBlogs.length > 0 && (
          <div className="grid gap-8">
            {filteredBlogs.map((blog) => (
              <Link href={`/blogs/${blog.slug}`} key={blog.id} className="block group">
                <article className="border-4 border-black bg-white overflow-hidden transition-all hover:-translate-y-1 hover:shadow-[6px_6px_0px_0px_rgba(0,0,0,1)]">
                  <div className="relative h-48 sm:h-64 overflow-hidden border-b-4 border-black">
                    <Image 
                      src={blog.image || "/placeholder.svg"} 
                      alt={blog.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-4 sm:p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h2 className="text-2xl sm:text-3xl font-bold group-hover:underline">{blog.title}</h2>
                      <span className={`text-xs sm:text-sm font-bold px-2 py-1 rounded-full text-black ${categoryColors[blog.category]}`}>
                        {blog.category}
                      </span>
                    </div>
                    <p className="text-base sm:text-lg mb-4">{blog.description}</p>
                    <div className="flex justify-between items-center text-sm">
                      <div className="flex items-center space-x-4">
                        <span className="flex items-center">
                          <Calendar className="w-4 h-4 mr-1" />
                          {blog.date}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {blog.readTime}
                        </span>
                      </div>
                      <span className="font-bold flex items-center group-hover:underline">
                        Read More <ArrowRight className="ml-1 w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}

        {/* Back to Portfolio */}
        <Link href="/" className="inline-block mt-8 border-4 border-black px-4 py-2 bg-white hover:bg-gray-100 font-bold text-lg transition-all hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
          Back to Portfolio
        </Link>
      </div>
    </div>
  )
}