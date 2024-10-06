// pages/[post_slug].tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import '../../app/post.css'; // Import your global CSS file

interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  username: string;
  avatar: string;
  category_name: string;
  tag_names: string;
}

const PostPage = ({ initialPost }: { initialPost: Post }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post>(initialPost);
  const [loading, setLoading] = useState(false);

  // Handle loading state if the post is not fetched
  if (router.isFallback) {
    return (
      <div className="skeleton">
        <div className="skeleton-title" />
        <div className="skeleton-image" />
        <div className="skeleton-content" />
        <div className="skeleton-meta">
          <div className="skeleton-username" />
          <div className="skeleton-category" />
        </div>
      </div>
    ); // Show skeleton while loading
  }

  // Function to fetch post on client side (CSR)
  const fetchPost = async () => {
    setLoading(true);
    const response = await fetch(`https://blog.tourismofkashmir.com/apis?post_slug=${router.query.post_slug}`);
    const data = await response.json();
    setPost(data);
    setLoading(false);
  };

  useEffect(() => {
    if (router.query.post_slug) {
      fetchPost(); // Fetch the post if post_slug is available
    }
  }, [router.query.post_slug]);

  return (
    <div className="post-container">
      {loading ? (
        <div className="skeleton">
          <div className="skeleton-title" />
          <div className="skeleton-image" />
          <div className="skeleton-content" />
          <div className="skeleton-meta">
            <div className="skeleton-username" />
            <div className="skeleton-category" />
          </div>
        </div> // Show skeleton while loading
      ) : (
        <>
          <h1>{post.title}</h1>
          <img src={post.image} alt={post.title} />
          <div dangerouslySetInnerHTML={{ __html: post.content }} />
          <p>Posted by {post.username}</p>
          <p>Category: {post.category_name}</p>
          <p>Tags: {post.tag_names}</p>
        </>
      )}
    </div>
  );
};

// Fetching the post based on post_slug
export const getServerSideProps = async (context: { params: { post_slug: string } }) => {
  const { post_slug } = context.params;

  const response = await fetch(`https://blog.tourismofkashmir.com/apis?post_slug=${post_slug}`);

  if (!response.ok) {
    return {
      notFound: true, // Return a 404 page if post is not found
    };
  }

  const initialPost: Post = await response.json();

  return {
    props: {
      initialPost,
    },
  };
};

export default PostPage;
