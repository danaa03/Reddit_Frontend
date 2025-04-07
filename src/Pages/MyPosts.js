import { useEffect, useState } from "react";
import { detailsById, membershipStatus, toggleFollow } from "../Routes/subreddits";
import { MyPosts, deletePost } from "../Routes/posts";
import { useNavigate } from "react-router-dom";
import ModalLogin from "../Components/User/ModalLogin";

const SubredditPanel = () => {
    const [posts, setPosts] = useState([]);
    const [subredditNames, setSubredditNames] = useState({});
    const [membershipStatuses, setMembershipStatuses] = useState({});
    const [subredditStatuses, setSubredditStatuses] = useState({});
    const [isLogin, setIsLogin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const token = localStorage.getItem("token");
                if (!token) {
                    setShowLogin(true);
                    setIsLogin(true);
                    return;
                }
                
                const data = await MyPosts(token);  
                setPosts(data || []);
                console.log("Posts data: ", data || []);
                if (!data) {
                    console.error("No posts found for the user.");
                    return;
                }

                const names = {};
                const membershipStatuses = {};
                const statuses = {};

                for (const post of data || []) {
                    if (post.subreddit_id && !names[post.subreddit_id]) {
                        const response = await fetchDetailsById(post.subreddit_id);
                        console.log("Subreddit name response: ", response);
                        names[post.subreddit_id] = response.name;
                        statuses[post.subreddit_id] = response.status;
                    }
                    if (post.subreddit_id && !membershipStatuses[post.subreddit_id]) {
                        membershipStatuses[post.subreddit_id] = await fetchMembershipStatus(post.subreddit_id);
                        if (!membershipStatuses[post.subreddit_id]) membershipStatuses[post.subreddit_id] = 'Non-member';
                    }
                }
                setSubredditStatuses(statuses);
                setSubredditNames(names);
                setMembershipStatuses(membershipStatuses);
            } catch (error) {
                console.error("Error while fetching posts: ", error);
            }
        };
        fetchPosts();
    }, []);  
    async function fetchDetailsById(subreddit_id) {
        try {
            const response = await detailsById(subreddit_id);
            return response;
        } catch (error) {
            console.error("Error while fetching subreddit name: ", error);
            return "Unknown Subreddit";
        }
    }

    const handleUnauthenticatedAction = () => {
        const token = localStorage.getItem("token");
        if (!token) {
            setShowLogin(true);
            setIsLogin(true);
            return false;
        }
        return true;
    };

    async function fetchMembershipStatus(subreddit_id) {
        try {
            const response = await membershipStatus(subreddit_id);
            return response;
        } catch (error) {
            return "Non-member";
        }
    }

    async function handleFollowToggle(subreddit_id) {
        if (!handleUnauthenticatedAction()) return;

        try {
            const response = await toggleFollow(subreddit_id);
            if (response.status === "moderator") {
                alert("Moderators cannot unfollow the subreddit.");
                return;
            }

            setMembershipStatuses((prev) => ({
                ...prev,
                [subreddit_id]: response.status,
            }));
        } catch (error) {
            console.error("Error while toggling follow status:", error);
        }
    }

    function redirectToSubreddit(subreddit_id) {
        if (membershipStatuses[subreddit_id] === "member" || membershipStatuses[subreddit_id] === "moderator") {
            navigate(`/subreddit/${subreddit_id}`);
        } else {
            console.log("Access denied. Current status:", membershipStatuses[subreddit_id]);
            alert("You need to follow this subreddit before accessing it.");
        }
    }

    return (
        <div className="container mt-2 ms-4">
            <div className="d-flex flex-column gap-3">
                <h2>Your Posts</h2>
                {posts.map((p, index) => (
                    <div key={p.id || index} className="card mb-4 w-50">
                        <div className="card h-100">
                            <div className="card-body">
                            <div className="d-flex">
                                <h5
                                    className="card-title clickable-heading"
                                    onClick={() => redirectToSubreddit(p.subreddit_id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {p.title}
                                </h5>
                                <button className="btn ms-auto"  onClick={() => {
                                    // if (!handleUnauthenticatedAction()) return;
                                    // console.log('authorized upvote...')
                                    // addUpvote(p.id)
                                    deletePost(p.id)
                                    .then(() => {
                                        setPosts((prevPosts) => prevPosts.filter((post) => post.id !== p.id));
                                    })
                                }} >
                                    <i className="fa-solid fa-trash-can"></i> 
                                </button>
                            </div>

                                <p className="card-text">
                                    {subredditNames[p.subreddit_id]
                                        ? `Subreddit: ${subredditNames[p.subreddit_id]}`
                                        : "Loading subreddit name..."}
                                </p>
                                <p className="card-text">
                                    {subredditStatuses[p.subreddit_id] ? (
                                        <>
                                            {subredditStatuses[p.subreddit_id] === "private" ? (
                                                <i className="fas fa-lock text-danger"></i>
                                            ) : (
                                                <i className="fas fa-globe text-success"></i>
                                            )}
                                            {` ${subredditStatuses[p.subreddit_id]}`}
                                        </>
                                    ) : (
                                        "Loading subreddit status..."
                                    )}
                                </p>

                                {p.image_url && (
                                    <img
                                        className="img-fluid rounded"
                                        src={`http://127.0.0.1:8000/images/${p.image_url.split(",")[0].trim()}`}
                                        alt="Post visual"
                                    />
                                )}
                                <div className="mt-2">
                                    <button
                                        className={`btn ${
                                            membershipStatuses[p.subreddit_id] === "Non-member"
                                                ? "btn-outline-primary"
                                                : "btn-primary"
                                        } btn-sm`}
                                        onClick={() => {
                                            if (!handleUnauthenticatedAction()) return;
                                            console.log('authorized follow...');
                                            handleFollowToggle(p.subreddit_id);
                                        }}
                                    >
                                        {membershipStatuses[p.subreddit_id] === "Non-member"
                                            ? "Follow"
                                            : "Following"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            {showLogin && <ModalLogin isLogin={isLogin} setIsLogin={setIsLogin} isLoginComp={showLogin} setIsLoginComp={setShowLogin} />}
        </div>
    );
};

export default SubredditPanel;
