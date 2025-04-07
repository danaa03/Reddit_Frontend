import React, { useState, useEffect } from "react";
import { topPostsPublic } from "../../Routes/subreddits";
import "./otherPanel.css";

const FloatingCard = () => {
    const [posts, setPosts] = useState([]); 
    const [loading, setLoading] = useState(true); 

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await topPostsPublic();
                console.log("API Response:", response); 
                setPosts(Array.isArray(response) ? response : []); 
                console.log("Posts:", posts);
            } catch (error) {
                console.error("Error fetching posts:", error);
                setPosts([]); 
            } finally {
                setLoading(false); 
            }
        };
        fetchPosts();
    }, []);

    return (
        <div className="floating-card card p-3 bg-light border-0">
            <h6 className="text-muted">Trending Now</h6>
            {loading ? (
                <p>Loading...</p> 
            ) : posts.length > 0 ? (
                <ul className="list-unstyled text-dark">
                    {posts.map((post, index) => (
                        <li key={index} className="mb-2">
                            <div>
                                <p>🔥 {post.subreddit_name}</p>
                                <p className="text-muted text-sm">{post.member_count} members</p>
                            </div>
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No trending posts available.</p> 
            )}
        </div>
    );
};

export default FloatingCard;