import { useEffect, useState } from 'react';
import { topPosts, nameById } from '../Routes/subreddits';
import { useNavigate } from 'react-router-dom';
import './subredditpanel.css'

const SubredditPanel = () => {
    const [posts, setPosts] = useState([]);
    const [subredditNames, setSubredditNames] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await topPosts();
                setPosts(data.posts || []);
                const names = {};
                for (const post of data.posts || []) {
                    if (post.subreddit_id && !names[post.subreddit_id]) {
                        const name = await fetchNameById(post.subreddit_id);
                        names[post.subreddit_id] = name;
                    }
                }
                setSubredditNames(names);
            } catch (error) {
                console.error("Error while fetching posts: ", error);
            }
        };
        fetchPosts();
    }, []);

    async function fetchNameById(subreddit_id) {
        try {
            const response = await nameById(subreddit_id);
            return response.subreddit;
        } catch (error) {
            console.error("Error while fetching subreddit name: ", error);
            return "Unknown Subreddit";
        }
    }

    function redirectToSubreddit (subreddit_id){
        navigate(`/subreddit/${subreddit_id}`);
    }

    return (
        <div className="container mt-2 ms-4">
            <div className="d-flex flex-column gap-3">
            <h2>Top Subreddits</h2>
                {posts.map((p, index) => (
                    <div key={p.id || index} className="card mb-4 w-50">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5
                                    className="card-title clickable-heading"
                                    onClick={() => redirectToSubreddit(p.subreddit_id)}
                                    style={{cursor : 'pointer'}}
                                >
                                    {p.title}
                                </h5>
                                <p className="card-text">
                                    {subredditNames[p.subreddit_id]
                                        ? `Subreddit: ${subredditNames[p.subreddit_id]}`
                                        : "Loading subreddit name..."}
                                </p>
                                {p.image_url && (
                                    <img
                                        className="img-fluid rounded"
                                        src={`http://127.0.0.1:8000/images/${p.image_url.split(",")[0].trim()}`}
                                        alt="Post visual"
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default SubredditPanel;