// eslint-disable-next-line @typescript-eslint/no-explicit-any
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, get, child, query, orderByChild, equalTo, limitToFirst } from 'firebase/database';
import { BlogPost } from './blog-types';

// Firebase config
const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
  databaseURL: "https://portfolio-c41fb-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getDatabase(app);

// Get all blog posts
export async function getAllBlogPosts(): Promise<BlogPost[]> {
  try {
    const blogsRef = ref(db, 'blogs');
    const snapshot = await get(blogsRef);

    if (!snapshot.exists()) return [];

    const data = snapshot.val();
    const blogs = Object.entries(data).map(([id, value]: [string, any]) => ({
      id,
      ...value,
    }));

    // Sort by date descending
    blogs.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return blogs;
  } catch (error) {
    console.error("Error fetching blog posts:", error);
    return [];
  }
}

// Get a single blog post by slug
export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  try {
    const blogsRef = query(ref(db, 'blogs'), orderByChild('slug'), equalTo(slug));
    const snapshot = await get(blogsRef);

    if (!snapshot.exists()) return null;

    const data = snapshot.val();
    const [[id, value]] = Object.entries(data) as [string, any][];

    return {
      id,
      ...value,
    };
  } catch (error) {
    console.error("Error fetching blog post by slug:", error);
    return null;
  }
}

// Search blog posts (on client)
export async function searchBlogPosts(searchTerm: string): Promise<BlogPost[]> {
  const allBlogs = await getAllBlogPosts();
  if (!searchTerm) return allBlogs;

  const term = searchTerm.toLowerCase();

  return allBlogs.filter(post =>
    post.title.toLowerCase().includes(term) ||
    post.description.toLowerCase().includes(term) ||
    post.category.toLowerCase().includes(term)
  );
}

export const categoryColors: Record<string, string> = {
  'Design': 'bg-pink-400',
  'Development': 'bg-blue-400',
  'Lifestyle': 'bg-green-400',
  'Writing': 'bg-purple-400'
};