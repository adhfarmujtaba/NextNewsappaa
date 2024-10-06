// pages/[post_slug].tsx

import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Head from 'next/head';
import Image from 'next/image'; // Import Image for optimization
import '../../app/post.css';

interface Post {
  id: number;
  title: string;
  content: string;
  image: string;
  username: string;
  avatar: string;
  category_name: string;
  tag_names: string;
  meta_description?: string;
}

const PostPage = ({ initialPost }: { initialPost: Post }) => {
  const router = useRouter();
  const [post, setPost] = useState<Post>(initialPost);
  const [loading, setLoading] = useState(false);
  const [domain, setDomain] = useState('');

  // Set domain on the client-side
  useEffect(() => {
    setDomain(window.location.origin);
  }, []);

  // Function to fetch post on client side (CSR)
  const fetchPost = async () => {
    setLoading(true);
    const response = await fetch(`https://blog.tourismofkashmir.com/apis?post_slug=${router.query.post_slug}`);
    const data = await response.json();
    setPost(data);
    setLoading(false);
  };

  // Only call fetchPost when post_slug changes
  useEffect(() => {
    if (router.query.post_slug) {
      fetchPost(); // Fetch the post if post_slug is available
    }
  }, [router.query.post_slug]); // Added dependency

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

  return (
    <div className="post-container">
      <Head>
        <title>{post.title}</title>
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.meta_description || ''} />
        <meta property="og:image" content={post.image} />
        <meta property="og:url" content={`${domain}/${router.query.post_slug}`} />
        <meta property="og:type" content="article" />
      </Head>

      {loading ? (
        <div className="skeleton">
          <div className="skeleton-title" />
          <div className="skeleton-image" />
          <div className="skeleton-content" />
          <div className="skeleton-meta">
            <div className="skeleton-username" />
            <div className="skeleton-category" />
          </div>
        </div>
      ) : (
        <>
          <h1>{post.title}</h1>
          <Image src={post.image} alt={post.title} width={600} height={400} /> {/* Use Image component */}
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
      notFound: true,
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
