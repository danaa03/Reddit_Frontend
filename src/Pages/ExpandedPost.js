import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { postById, handleDownvote, handleUpvote , checkVoteStatus} from "../Routes/posts";
import { addComment, viewComments, upvoteComment, downvoteComment } from "../Routes/comments";
import ModalLogin from "../Components/User/ModalLogin"
import { getUsername } from "../Routes/users";
import "./expandedpost.css";

const Post = () => {
    const [loading, setLoading] = useState(true);
    const [post, setPost] = useState({});
    const [authorUsername, setAuthorUsername] = useState("");
    const [error, setError] = useState("");
    const [commentContent, setCommentContent] = useState("");
    const { id: post_id } = useParams();
    const [comments, setComments] = useState([]);
    const [showLogin, setShowLogin] = useState(false);
    const [isLogin, setIsLogin] = useState(true);
    const [commentUsername, setCommentUsername] = useState([]);
    const [voteStatus, setVoteStatus] = useState(null); //can either be upvote, downvote or null

    useEffect(() => {
        const fetchPost = async () => {
            setLoading(true);
            try {
                const data = await postById(post_id);
                setPost(data.post || {});
                setComments(await viewComments(post_id));
                setAuthorUsername(await getUsername(data.post.user_id));
            } catch (err) {
                console.error("Error fetching post: ", err);
                setError("Failed to load post.");
            } finally {
                setLoading(false);
            }
        };
        fetchPost();
        checkVote(post_id);
        console.log("HSHSH: ",voteStatus)
    }, [post_id]);

    useEffect(() => {
        const fetchCommentUsernames = async () => {
            if (comments.length > 0) {
                const users = await Promise.all(comments.map(async (comment) => {
                    return await getUsername(comment.user_id);
                }));
                setCommentUsername(users);
            }
        };
    
        fetchCommentUsernames();
    }, [comments]); 

    const addUpvoteComment = async (comment_id, post_id) => {
        if (!handleUnauthenticatedAction()) return;
        await upvoteComment(comment_id);
        const updatedComments = await viewComments(post_id);
        setComments(updatedComments);
    };

    const addDownvoteComment = async (comment_id, post_id) => {
        if (!handleUnauthenticatedAction()) return;
        await downvoteComment(comment_id);
        const updatedComments = await viewComments(post_id);
        setComments(updatedComments);
    };

    const addUpvote = async (post_id) => { //post
        if (!handleUnauthenticatedAction()) return;
        await handleUpvote(post.id);
        const data = await postById(post_id);
        setPost(data.post || {});
        window.location.reload(); 
    };

    const addDownvote = async (post_id) => { //post
        if (!handleUnauthenticatedAction()) return;
        await handleDownvote(post.id);
        const data = await postById(post_id);
        setPost(data.post || {});
        window.location.reload(); 
    };

    const createComment = async (post_id) => {
        if (!handleUnauthenticatedAction()) return;
        await addComment(post_id, commentContent);
        setCommentContent("");
        setComments(await viewComments(post_id));
    };

    const handleUnauthenticatedAction = () => {
        if (!localStorage.getItem("token")) {
            setShowLogin(true);
            setIsLogin(true);
            return false;
        }
        return true;
    };

    const checkVote = async(post_id) => {
        try {
            const response = await checkVoteStatus(post_id);
            setVoteStatus(response.vote_type);
            console.log("Vote statusssssssssss: ", response.vote_type);
        } catch (error) {
            console.error("Error checking vote status:", error.message);
        }
    }

    return (
        <div className="d-flex justify-content-center align-items-start min-vh-100 bg-light p-3">
            <div className="card p-4 shadow rounded-4" style={{ maxWidth: "600px", width: "100%" }}>
                <h2 className="text-center mb-3">{post.title ?? "Loading..."}</h2>
                <h6 className="text-muted">u/{authorUsername ?? "Loading username..."}</h6>
                <p className="card-text">{post.content}</p>
                {post.image_url && (
                    <img className="img-fluid rounded" src={`http://127.0.0.1:8000/images/${post.image_url.split(',')[0].trim()}`} alt="Post" />
                )}

                <div className="d-flex align-items-center mt-3">
                {voteStatus !== null && (
                    <button
                        className={`btn ${voteStatus === 'upvote' ? 'btn btn-success' : 'btn border-success'}`}
                        onClick={() => {
                            if (!handleUnauthenticatedAction()) return;
                            console.log('authorized upvote...');
                            addUpvote(post.id);
                        }}
                    >
                        <i className="fas fa-thumbs-up"></i>
                    </button>
                )}
                <span className='ms-2 me-3'>{post.upvotes}</span>

                {voteStatus !== null && (
                    <button
                        className={`btn ${voteStatus === 'downvote' ? 'btn btn-danger' : 'btn border-danger'}`}
                        onClick={() => {
                            if (!handleUnauthenticatedAction()) return;
                            console.log('authorized downvote...');
                            addDownvote(post.id);
                        }}
                    >
                        <i className="fas fa-thumbs-down"></i>
                    </button>
                )}
                <span className='ms-2 me-3'>{post.downvotes}</span>
                </div>
                <div className="d-flex mt-3">
                <input type="text" className="form-control rounded-pill bg-light mt-3"  placeholder="Add Comment"  onClick={() => {
                                if (!handleUnauthenticatedAction()) return;
                                // <i class="fa fa-paper-plane" aria-hidden="true"></i>
                            }}  onChange={(e) => setCommentContent(e.target.value)} value={commentContent} />
                    <button type="button" className="btn" onClick={() => {
                                    if (!handleUnauthenticatedAction()) return;
                                    console.log('authorized comment...')
                                    createComment(post.id)
                                }} >
                        <i class="fa fa-paper-plane mt-3" aria-hidden="true"></i>   
                    </button>
                </div>

                <div className="border rounded p-3 mt-3" style={{ maxHeight: "300px", overflowY: "auto", width: "100%" }}>
                    {comments.length > 0 ? comments.map((comment, index) => (
                        <div key={comment.id} className="mb-2 p-2 border-bottom">
                            <strong>u/{commentUsername[index] ?? "Loading..."}</strong>
                            <p className="mb-1">{comment.content}</p>
                            <div className="d-flex align-items-center mt-3">
                                <button className="btn btn-success button"  onClick={() => {
                                            if (!handleUnauthenticatedAction()) return;
                                            console.log('authorized upvote...')
                                            addUpvoteComment(comment.id, post.id)
                                        }} >
                                    <i className="fas fa-thumbs-up"></i>
                                </button>
                                <span className='ms-2 me-3'>{comment.upvotes}</span>
                                <button className="btn btn-danger button"  onClick={() => {
                                            if (!handleUnauthenticatedAction()) return;
                                            console.log('authorized upvote...')
                                            addDownvoteComment(comment.id, post.id)
                                        }} >
                                    <i className="fas fa-thumbs-down"></i>
                                </button>
                                <span className='ms-2 me-3'>{comment.downvotes}</span>
                            </div>
                        </div>
                    )) : <p className="text-muted">No comments yet.</p>}
                </div>
            </div>
            {showLogin && <ModalLogin isLogin={isLogin} setIsLogin={setIsLogin} isLoginComp={showLogin} setIsLoginComp={setShowLogin} />}
        </div>
    );
};

export default Post;
