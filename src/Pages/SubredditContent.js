import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { topFiftyPosts, detailsById } from '../Routes/subreddits';
import { getUsername } from '../Routes/users';
import { handleUpvote, handleDownvote } from '../Routes/posts';
import './subredditcontent.css'
import ModalLogin from '../Components/User/ModalLogin';
import {uploadPost} from '../Routes/posts'
import {addComment} from '../Routes/comments'
import { useNavigate } from 'react-router-dom';

const Subreddit = () => {
    const { id: subreddit_id } = useParams();
    const navigate = useNavigate();
    // console.log("heres the subreddit id: ", subreddit_id)
    const [posts, setPosts] = useState([]);
    const [subredditName, setSubredditName] = useState('');
    const [loading, setLoading] = useState(true);
    const [usernames, setUsernames] = useState({})
    const [error, setError] = useState('');
    const [showLogin, setShowLogin] = useState(false)
    const [isLogin, setIsLogin] = useState(true);
    const [selectedFiles, setSelectedFiles] = useState([]);
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [commentContent, setCommentContent] = useState("");

    const handleFileChange = (e) => {
        setSelectedFiles((prevFiles) => [...prevFiles, ...Array.from(e.target.files)]);
    };
    

    const handleUpload = async (e) => {
        e.preventDefault();
    
        if (!handleUnauthenticatedAction()) return;
        
        if(!title){
            alert("Error! You cannot submit an empty post!")
            return
        }

        if (e.target) {
            const formData = new FormData();
    
            formData.append("title", title);
            formData.append("content", content || ""); 
            formData.append("subreddit_id", subreddit_id);
    
            selectedFiles.forEach((file) => formData.append("files", file));
    
            console.log("FormData entries:");
            for (let [key, value] of formData.entries()) {
                console.log(`${key}: ${value}`);
            }
    
            try {
                await uploadPost(formData);
                console.log("Post uploaded successfully!");
                window.location.reload();

            } catch (error) {
                console.error("Error while uploading post: ", error);
            }
        }
    };

    // const handleDelete = async (id) => {
    //     try {
    //         const response = await deletePost(id);
    //         alert("Post deleted successfully.");
    //     } catch (err) {
    //         console.error("Error while deleting post: ", err);
    //         return "Deletion Error";
    //     }
    // };

    const createComment = async (post_id) => {
        try {
            const response = await addComment(post_id, commentContent);
            alert("Comment posted.");
            window.location.reload();
            return;
        } catch (err) {
            console.error("Error creatinf comment: ", err);
            return;
        }
    };

    const fetchNameById = async (id) => {
        try {
            const response = await detailsById(id);
            return response.name;
        } catch (err) {
            console.error("Error fetching subreddit name: ", err);
            return "Unknown Subreddit";
        }
    };

    const handleUnauthenticatedAction = () => {
        const token = localStorage.getItem("token");
        if (!token) {
          setShowLogin(true)
          setIsLogin(true)
          return false;
        }
        return true;
      };

    const addUpvote = async (postId) => {
        console.log('adding upvote to post: ', postId)
        try {
            await handleUpvote(postId);
            const data = await topFiftyPosts(subreddit_id);
            setPosts(data.posts || []);
        } catch (err) {
            console.error("Error voting on post: ", err);
            return "Vote Error";
        }
    }

    const addDownvote = async (postId) => {
        console.log('adding downvote to post: ', postId)
        try {
            await handleDownvote(postId);
            const data = await topFiftyPosts(subreddit_id);
            setPosts(data.posts || []);
        } catch (err) {
            console.error("Error voting on post: ", err);
            return "Vote Error";
        }
    }

    function redirectToPost(post_id){
        navigate(`/post/${post_id}`);
    }

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
           
            try {
                const data = await topFiftyPosts(subreddit_id);
                setPosts(data.posts || []);

                if (data.posts?.length > 0) {
                    const name = await fetchNameById(data.posts[0].subreddit_id);
                    setSubredditName(name);
                } else {
                    setSubredditName("No posts found");
                }

                const usernameMap = {};
                for (const post of data.posts || []) {
                    if (!usernameMap[post.user_id]) {
                        const username = await getUsername(post.user_id);
                        console.log("here is the data: ", username)
                        usernameMap[post.user_id] = username;
                    }
                }
                setUsernames(usernameMap);
                console.log("Final usernames object:", usernames);

            } catch (err) {
                console.error("Error fetching posts: ", err);
                setError("Failed to load posts.");
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [subreddit_id]);

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        const droppedFiles = e.dataTransfer.files;
        handleFileChange({ target: { files: droppedFiles } });
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
    };

    const renderFileNames = () => {
        if (selectedFiles.length === 0) return null;
        return (
            <ul className='list-group'>
                {selectedFiles.map((file, index) => (
                    <li className='list-group-item' key={index}>{file.name}</li>
                ))}
            </ul>
        );
    };

    if (loading) return <div className="container mt-4">Loading posts...</div>;
    if (error) return <div className="container mt-4 text-danger">{error}</div>;

    return (
        <div className="container mt-4 ms-4">
            <h2>{subredditName}</h2>
            <form onSubmit={handleUpload} className="card p-3 shadow border-0 rounded bg-white w-50 mt-5 mb-5">
            <h5 className="text-dark mb-3 ms-1">Create a Post</h5>

            <div className="mb-2">
                <input
                    id="title"
                    type="text"
                    className="form-control border-0 bg-light rounded-pill px-3"
                    placeholder="Title (required)"
                    onChange={(e) => setTitle(e.target.value)}
                    value={title}
                    style={{ backgroundColor: "#F6F7F8", color: "#000" }}
                />
            </div>
            <div className="mb-2">
                <textarea
                    id="content"
                    className="form-control border-0 rounded px-3 py-2"
                    placeholder="What’s on your mind?"
                    rows="4"
                    onChange={(e) => setContent(e.target.value)}
                    value={content}
                    style={{ backgroundColor: "#F6F7F8", color: "#000" }}
                ></textarea>
            </div>
            <div
                className="mb-2 p-3 border border-secondary-subtle rounded text-center"
                style={{ backgroundColor: "#F6F7F8", color: "#000" }}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
            >
                <label className="fw-light">
                    Drag & drop images or{" "}
                    <span
                        className="text-primary fw-bold"
                        onClick={() => document.getElementById("fileInput").click()}
                    >
                        browse
                    </span>
                </label>
                <input
                    type="file"
                    id="fileInput"
                    className="d-none"
                    multiple
                    onChange={handleFileChange}
                />
                {renderFileNames()}
            </div>

            <button
                type="submit"
                className="btn w-100 fw-bold rounded-pill"
                style={{ backgroundColor: "#FF4500", color: "#FFF" }}
            >
                Post
            </button>
        </form>

     
        <div className="d-flex flex-column gap-3">
            {posts.map((p, index) => (
                <div key={p.id || index} className="card mb-4 w-50">
                    <div className="card-body">  
                        <div className='d-flex'>
                            <h5 className="card-title clickable-heading" onClick={() => redirectToPost(p.id)}>{p.title}</h5>
                            {/* <button className="btn btn-light customize-trash-can" onClick={() => {
                                    if (!handleUnauthenticatedAction()) return;
                                    console.log('authorized delete...')
                                    deletePost(p.id)
                                }} >
                                    <i className="fa-solid fa-trash-can"></i>
                                </button> */}
                        </div>
                        <span className='text-muted'>{"u/"+usernames[p.user_id] || "Loading username..."}</span>
                        <p className="card-text">{p.content}</p>
                        {p.image_url && (
                            <img
                                className="img-fluid rounded"
                                src={`http://127.0.0.1:8000/images/${p.image_url.split(',')[0].trim()}`}
                                alt="Post visual"
                            />
                        )}
                            <div className='d-flex align-items-center mt-2'>
                                <button className="btn btn-success button"  onClick={() => {
                                    if (!handleUnauthenticatedAction()) return;
                                    console.log('authorized upvote...')
                                    addUpvote(p.id)
                                }} >
                                    <i className="fas fa-thumbs-up"></i>
                                </button>
                                <span className='ms-2 me-3'>{p.upvotes}</span>

                                <button className="btn btn-outline-danger"  onClick={() => {
                                    if (!handleUnauthenticatedAction()) return;
                                    console.log('authorized downvote...')
                                    addDownvote(p.id)
                            
                                }}>
                                    <i className="fas fa-thumbs-down"></i>
                                </button>
                                <span className='ms-3'>{p.downvotes}</span>
                            </div>
                            <div className="d-flex">
                            <input type="text" className="form-control rounded-pill bg-light mt-3" id= {p.id} placeholder="Add Comment"  onClick={() => {
                                if (!handleUnauthenticatedAction()) return;
                                // <i class="fa fa-paper-plane" aria-hidden="true"></i>
                            }}  onChange={(e) => setCommentContent(e.target.value)} value={commentContent} />
                            <button type="button" className="btn mt-3" onClick={() => {
                                    if (!handleUnauthenticatedAction()) return;
                                    console.log('authorized comment...')
                                    createComment(p.id)
                                }} >
                            <i class="fa fa-paper-plane" aria-hidden="true"></i>   
                            </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showLogin && <ModalLogin isLogin={isLogin} setIsLogin={setIsLogin} isLoginComp={showLogin} setIsLoginComp={setShowLogin}/>}

        </div>
    );
};

export default Subreddit;
