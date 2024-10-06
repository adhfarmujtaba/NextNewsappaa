// pages/index.tsx

import { useEffect, useState, useRef } from 'react';
import Link from 'next/link'; // Import Link from Next.js
import '../app/index.css'; // Import your global CSS file

interface Post {
  id: number;
  title: string;
  meta_description: string;
  image: string;
  username: string;
  avatar: string;
  category_name: string;
  category_slug: string; // Ensure this field is available in the post data
  slug: string; // Ensure this field is available in the post data
}

interface Props {
  initialPosts: Post[];
}

const HomePage = ({ initialPosts = [] }: Props) => {
  const [posts, setPosts] = useState<Post[]>(initialPosts);
  const [page, setPage] = useState(2); // Start from page 2 since page 1 is fetched on the server
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (page: number) => {
    setLoading(true);
    const response = await fetch(`https://blog.tourismofkashmir.com/apis?posts&page=${page}`);
    const data = await response.json();
    setPosts((prevPosts) => [...prevPosts, ...data]); // Append new posts to existing ones
    setLoading(false);
  };

  useEffect(() => {
    // Fetch more posts only when page changes and page is greater than 1
    if (page > 1) {
      fetchPosts(page);
    }
  }, [page]);

  return (
    <div className="container">
      <h1>Posts</h1>
      {loading && <LoadingSkeleton count={3} />} {/* Show skeleton while loading */}
      <div>
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post.id} className="post">
              <Link className="postLink" href={`/${post.category_slug}/${post.slug}/`}>
                <h2>{post.title}</h2>
                <LazyLoadImage src={post.image} alt={post.title} />
                <p>{post.meta_description}</p>
                <p>Posted by {post.username}</p>
                <p>Category: {post.category_name}</p>
              </Link>
            </div>
          ))
        ) : (
          <p>No posts found.</p>
        )}
      </div>
      <button onClick={() => setPage(page + 1)}>Load More</button>
    </div>
  );
};

// Skeleton Loading Component
const LoadingSkeleton = ({ count }: { count: number }) => {
  return (
    <div>
      {Array.from({ length: count }).map((_, index) => (
        <div key={index} className="skeleton">
          <div className="skeleton-title" />
          <div className="skeleton-image" />
          <div className="skeleton-content" />
          <div className="skeleton-meta">
            <div className="skeleton-username" />
            <div className="skeleton-category" />
          </div>
        </div>
      ))}
    </div>
  );
};

// LazyLoadImage component
const LazyLoadImage = ({ src, alt }: { src: string; alt: string }) => {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 } // Adjust threshold as needed
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => {
      if (imgRef.current) {
        observer.unobserve(imgRef.current);
      }
    };
  }, []);

  return <img ref={imgRef} src={isVisible ? src : undefined} alt={alt} loading="lazy" />;
};

// Server-Side Rendering
export const getServerSideProps = async () => {
  const response = await fetch('https://blog.tourismofkashmir.com/apis?posts&page=1');

  // Check if the response is ok and handle the case if not
  if (!response.ok) {
    return {
      props: {
        initialPosts: [], // Fallback to an empty array if fetch fails
      },
    };
  }

  const initialPosts: Post[] = await response.json();

  return {
    props: {
      initialPosts,
    },
  };
};

export default HomePage;
