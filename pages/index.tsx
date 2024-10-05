// pages/index.tsx
import { useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { formatDistanceToNow } from 'date-fns';
import InfiniteScroll from 'react-infinite-scroll-component';
import '../app/index.css';

// Helper functions
const formatViews = (views: number) => {
  if (views >= 10000000) {
    return (views / 10000000).toFixed(1).replace(/\.0$/, '') + 'cr';
  } else if (views >= 100000) {
    return (views / 100000).toFixed(1).replace(/\.0$/, '') + 'L';
  } else if (views >= 1000) {
    return (views / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  } else {
    return views.toString();
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
};

const truncateText = (text: string, wordLimit: number) => {
  const words = text.split(' ');
  return words.length > wordLimit ? words.slice(0, wordLimit).join(' ') + '...' : text;
};

const Home = ({ initialPosts }: { initialPosts: any[] }) => {
  const [posts, setPosts] = useState<any[]>(initialPosts);
  const [page, setPage] = useState(2); // Start from page 2 since page 1 is already loaded
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchPosts = async (page: number) => {
    console.debug(`Fetching posts for page: ${page}`);
    const API_URL = `https://blog.tourismofkashmir.com/apis?posts&page=${page}`;
    setLoading(true);
    setError(null);

    try {
      const response = await axios.get(API_URL);
      console.debug('API Response:', response.data);

      // Log the complete response object
      console.debug('Full Response Object:', response);

      // Check if response.data is an array
      if (Array.isArray(response.data)) {
        if (response.data.length === 0) {
          console.debug("No more posts to fetch.");
          setHasMore(false);
        } else {
          console.debug(`Fetched ${response.data.length} posts.`);
          setPosts((prevPosts) => [...prevPosts, ...response.data]);
          setPage((prevPage) => prevPage + 1); // Increment page here after successful fetch
        }
      } else if (response.data.message === 'No more posts found.') {
        console.debug("No more posts to fetch.");
        setHasMore(false); // No more posts can be loaded
      } else {
        console.warn("Unexpected response format:", response.data);
        setError("Unexpected response format.");
        setHasMore(false); // No more posts can be loaded
      }
    } catch (err) {
      console.error("Error fetching posts:", err);
      setError("Failed to load posts.");
    } finally {
      setLoading(false);
      console.debug("Loading state set to false.");
    }
  };

  const loadMorePosts = () => {
    if (hasMore) {
      fetchPosts(page);
    } else {
      console.debug("No more pages to load.");
    }
  };

  return (
    <div className="news-list">
      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
      <InfiniteScroll
        dataLength={posts.length}
        next={loadMorePosts}
        hasMore={hasMore}
        loader={<p style={{ textAlign: 'center' }}>Loading...</p>}
        endMessage={<p style={{ textAlign: 'center' }}>No more posts available.</p>}
      >
        {posts.map(post => (
          <div key={post.id} className='card' onContextMenu={(e) => e.preventDefault()}>
            <Link href={`/${post.category_slug}/${post.slug}/`} className="news-item-link" style={{ textDecoration: 'none', color: 'inherit' }}>
              <div className="image-container" style={{ position: "relative" }}>
                <img
                  src={post.image}
                  alt={post.title}
                  className="news-item-image"
                  style={{ width: "100%", height: "180px", objectFit: "cover" }}
                />
                <div
                  style={{
                    position: "absolute",
                    bottom: "10px",
                    right: "10px",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    padding: "5px",
                    borderRadius: "5px",
                    fontSize: "0.8rem",
                  }}
                >
                  {post.read_time} min read
                </div>
              </div>
              <div className='card-content'>
                <h2>{truncateText(post.title, 10)}</h2>
                <p>{truncateText(post.meta_description, 20)}</p>
              </div>
            </Link>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '5px' }}>
              <Link href={`/profile/${post.username}`} style={{ textDecoration: 'none', color: 'inherit', display: 'flex', alignItems: 'center' }}>
                <img src={`https://blog.tourismofkashmir.com/${post.avatar}`} alt='Avatar' className='avatar' style={{ width: '30px', height: '30px', borderRadius: '50%', marginRight: '5px' }} />
                <span className='username'>{post.username}</span>
              </Link>
              <span className='views'>. {formatViews(post.views)} views</span>
              <span className='date'>{formatDate(post.created_at)}</span>
            </div>
          </div>
        ))}
      </InfiniteScroll>
    </div>
  );
};

export const getServerSideProps = async () => {
  const API_URL = `https://blog.tourismofkashmir.com/apis?posts&page=1`;

  try {
    const response = await axios.get(API_URL);
    console.debug('Initial API Response:', response.data);
    
    // Log the complete response object
    console.debug('Full Initial Response Object:', response);

    const initialPosts = response.data;
    
    // Check if initialPosts is an array
    if (!Array.isArray(initialPosts)) {
      console.warn("Unexpected initial response format:", initialPosts);
      return {
        props: {
          initialPosts: [],
        },
      };
    }

    console.debug(`Total posts: ${initialPosts.length}`);

    return {
      props: {
        initialPosts,
      },
    };
  } catch (err) {
    console.error("Error fetching posts:", err);
    return {
      props: {
        initialPosts: [],
      },
    };
  }
};

export default Home;
