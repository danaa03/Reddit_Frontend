import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { topFiftyPosts, nameById } from '../../Routes/subreddits';
import { getUsername } from '../../Routes/users';
import { handleUpvote } from '../../Routes/posts';
import PostCard from './PostCard';
import './votestyle.css';

const Subreddit = () => {
    const { id: subreddit_id } = useParams();
    const [posts, setPosts] = useState([]);
    const [subredditName, setSubredditName] = useState('');
    const [loading, setLoading] = useState(true);
    const [usernames, setUsernames] = useState({});
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchEverything = async () => {
            setLoading(true);

            try {
                const data = await topFiftyPosts(subreddit_id);
                setPosts(data.posts || []);

                if (data.posts?.length > 0) {
                    const name = await nameById(data.posts[0].subreddit_id);
                    setSubredditName(name.subreddit);
                } else {
                    setSubredditName("No posts found");
                }

                const nameMap = {};
                for (const post of data.posts || []) {
                    if (!nameMap[post.user_id]) {
                        const user = await getUsername(post.user_id);
                        nameMap[post.user_id] = user;
                    }
                }

                setUsernames(nameMap);
            } catch (err) {
                console.log("error fetching stuff: ", err);
                setError("Failed to load posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchEverything();
    }, [subreddit_id]);

    const handleUnauthenticatedAction = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            // possibly show login popup later
            return false;
        }
        return true;
    };

    const addUpvote = async (postId) => {
        console.log("adding upvote to post:", postId);
        try {
            await handleUpvote(postId);
            // update upvote locally
            setPosts(prev =>
                prev.map(post =>
                    post.id === postId ? { ...post, upvotes: post.upvotes + 1 } : post
                )
            );
        } catch (err) {
            console.log("vote error: ", err);
        }
    };

    return (
        <div className="container mt-4">
            {loading && <div>Loading posts...</div>}
            {error && <div className="text-danger">{error}</div>}

            {!loading && !error && (
                <>
                    <h2>{subredditName}</h2>
                    <div className="d-flex flex-column gap-3">
                        {posts.map((post, idx) => (
                            <PostCard
                                key={post.id || idx}
                                post={post}
                                username={usernames[post.user_id]}
                                onUpvote={addUpvote}
                                handleUnauthenticatedAction={handleUnauthenticatedAction}
                            />
                        ))}
                    </div>
                </>
            )}
        </div>
    );
};

export default Subreddit;
