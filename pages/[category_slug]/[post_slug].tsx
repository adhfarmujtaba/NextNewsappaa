import axios from 'axios';
import { GetServerSideProps } from 'next';
import Head from 'next/head';
import Breadcrumb from '../../components/Breadcrumb';
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
  post: Post | null;
  error: string | null;
}

const Post = ({ post, error }: PostProps) => {
  if (error) return <p className="error-message">{error}</p>;

  const breadcrumbPaths = [
    { name: 'Home', href: '/' },
    { name: post?.category_slug || 'Category', href: `/category/${post?.category_slug || ''}` }, // Fallback for slug
    { name: post?.title || 'Post Title', href: '#' }, // Fallback for title
  ];

  // Dynamically get the current domain
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
    const response = await axios.get(API_URL);
    const post: Post = response.data;

    if (!post) {
      return {
        props: {
          post: null,
          error: "Post not found.",
        },
      };
    }

    return {
      props: {
        post,
        error: null,
      },
    };
  } catch (err) {
    console.error("Error fetching post:", err);
    return {
      props: {
        post: null,
        error: "Failed to load post.",
      },
    };
  }
};

export default Post;
