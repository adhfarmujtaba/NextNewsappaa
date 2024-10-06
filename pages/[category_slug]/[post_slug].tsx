import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Breadcrumb from '../../components/Breadcrumb';
import { useEffect, useState } from 'react';
import '../../app/post.css';

interface Post {
  title: string;
  content: string;
  image: string;
  category_slug: string;
  slug: string;
  meta_description?: string;
}

interface PostProps {
  initialPost: Post | null;
  initialError: string | null;
}

const Post = ({ initialPost, initialError }: PostProps) => {
  const [post, setPost] = useState<Post | null>(initialPost);
  const [error, setError] = useState<string | null>(initialError);
  const [loading, setLoading] = useState<boolean>(!initialPost);

  useEffect(() => {
    if (!initialPost) {
      const fetchPost = async () => {
        const post_slug = window.location.pathname.split('/').pop(); // Extract the post_slug from the URL
        try {
          setLoading(true); // Start loading
          const response = await axios.get(`/api/posts?post_slug=${post_slug}`);
          setPost(response.data);
        } catch (err) {
          console.error("Error fetching post:", err);
          setError("Failed to load post.");
        } finally {
          setLoading(false); // Stop loading
        }
      };

      fetchPost();
    }
  }, [initialPost]);

  if (loading) return <p className="loading-message">Loading...</p>; // Show loading state

  if (error) return <p className="error-message">{error}</p>;

  const breadcrumbPaths = [
    { name: 'Home', href: '/' },
    { name: post?.category_slug || 'Category', href: `/category/${post?.category_slug || ''}` },
    { name: post?.title || 'Post Title', href: '#' },
  ];

  const domain = typeof window !== 'undefined' ? window.location.origin : '';

  return (
    <div className="post-container">
      <Head>
        <title>{post?.title || 'Post Title'}</title>
        <meta property="og:title" content={post?.title || 'Post Title'} />
        <meta property="og:description" content={post?.meta_description || 'Read this post to learn more!'} />
        <meta property="og:image" content={post?.image} />
        <meta property="og:url" content={`${domain}/category/${post?.category_slug}/${post?.slug}`} />
        <meta property="og:type" content="article" />
      </Head>
      
      <Breadcrumb paths={breadcrumbPaths} />
      {post && (
        <>
          {post.image && <img className="post-image" src={post.image} alt={post.title} />}
          <h1 className="post-title">{post.title}</h1>
          <div className="post-content" dangerouslySetInnerHTML={{ __html: post.content }} />
        </>
      )}
    </div>
  );
};

export const getServerSideProps: GetServerSideProps = async (context) => {
  const { post_slug } = context.params || {};
  const API_URL = `https://blog.tourismofkashmir.com/apis?post_slug=${post_slug}`;

  try {
    const response = await axios.get<Post>(API_URL);
    const post: Post = response.data;

    if (!post) {
      return {
        props: {
          initialPost: null,
          initialError: "Post not found.",
        },
      };
    }

    return {
      props: {
        initialPost: post,
        initialError: null,
      },
    };
  } catch (err) {
    console.error("Error fetching post:", err);
    return {
      props: {
        initialPost: null,
        initialError: "Failed to load post.",
      },
    };
  }
};

export default Post;
