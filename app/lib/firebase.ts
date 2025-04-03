import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore';
import { BlogPost } from './blog-types';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Function to get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogCollection = collection(db, 'blogs');
    const blogQuery = query(blogCollection, orderBy('date', 'desc'));
    const blogSnapshot = await getDocs(blogQuery);
    
    const blogs: BlogPost[] = [];
    blogSnapshot.forEach((doc) => {
      const data = doc.data();
      blogs.push({
        id: doc.id,
        title: data.title,
        description: data.description,
        content: data.content,
        date: data.date,
        readTime: data.readTime,
        category: data.category,
        image: data.image,
        slug: data.slug
      });
    });
    
    return blogs;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// Function to get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const blogCollection = collection(db, 'blogs');
    const blogQuery = query(blogCollection, where('slug', '==', slug), limit(1));
    const blogSnapshot = await getDocs(blogQuery);
    
    if (blogSnapshot.empty) {
      return null;
    }
    
    const blogDoc = blogSnapshot.docs[0];
    const data = blogDoc.data();
    
    return {
      id: blogDoc.id,
      title: data.title,
      description: data.description,
      content: data.content,
      date: data.date,
      readTime: data.readTime,
      category: data.category,
      image: data.image,
      slug: data.slug
    };
  } catch (error) {
    console.error("Error fetching blog post:", error);
    return null;
  }
}

// Function to search blog posts
export async function searchBlogPosts(searchTerm: string): Promise<BlogPost[]> {
  // First get all blog posts
  const allBlogs = await getAllBlogPosts();
  
  // If no search term, return all blogs
  if (!searchTerm) return allBlogs;
  
  // Filter blogs based on search term
  // Note: For a production app, you might want to implement this search on the server
  // or use a service like Algolia for better performance
  const lowerCaseSearchTerm = searchTerm.toLowerCase();
  return allBlogs.filter(post => 
    post.title.toLowerCase().includes(lowerCaseSearchTerm) ||
    post.description.toLowerCase().includes(lowerCaseSearchTerm) ||
    post.category.toLowerCase().includes(lowerCaseSearchTerm)
  );
}

export const categoryColors: Record<string, string> = {
  'Design': 'bg-pink-400',
  'Development': 'bg-blue-400',
  'Lifestyle': 'bg-green-400',
  'Writing': 'bg-purple-400'
};