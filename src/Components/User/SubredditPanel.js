import { useEffect, useState } from "react";
import { topPosts,detailsById, membershipStatus, toggleFollow } from "../../Routes/subreddits";
import { useNavigate } from "react-router-dom";
import ModalLogin from "./ModalLogin";

import "./subredditpanel.css";

const SubredditPanel = () => {
    const [posts, setPosts] = useState([]);
    const [subredditNames, setSubredditNames] = useState({});
    const [membershipStatuses, setMembershipStatuses] = useState({});
    const [subredditStatuses, setSubredditStatuses] = useState({});
    const [isLogin, setIsLogin] = useState(false);
    const [showLogin, setShowLogin] = useState(false);
    const [emptyJoined, setEmptyJoined] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const data = await topPosts();
                setPosts(data.posts || []);
                setEmptyJoined(data.emptyJoined || []);

                const names = {};
                const membershipStatuses = {};
                const statuses = {};

                for (const post of data.posts || []) {
                    if (post.subreddit_id && !names[post.subreddit_id]) {
                        const response = await fetchDetailsById(post.subreddit_id);
                        names[post.subreddit_id]=response.name;
                        statuses[post.subreddit_id]=response.status;
                    }
                    if (post.subreddit_id && !membershipStatuses[post.subreddit_id]) {
                        membershipStatuses[post.subreddit_id] = await fetchMembershipStatus(post.subreddit_id);
                        if(!membershipStatuses[post.subreddit_id])
                            membershipStatuses[post.subreddit_id] = 'Non-member'
                    }
                }
                setSubredditStatuses(statuses);
                setSubredditNames(names);
                setMembershipStatuses(membershipStatuses);

                
                for (const emptySubredditID of data.empty_joined || []) {
                    console.log("Processing empty subreddit ID:", emptySubredditID);
                    
                    if (emptySubredditID && !names[emptySubredditID]) {
                        const response = await fetchDetailsById(emptySubredditID);
                        console.log("Fetched details for subreddit:", response);

                        setSubredditNames(prevNames => ({
                            ...prevNames,
                            [emptySubredditID]: prevNames[emptySubredditID] ? [...prevNames[emptySubredditID], response.name] : [response.name]
                        }));
                        
                        setSubredditStatuses(prevStatuses => ({
                            ...prevStatuses,
                            [emptySubredditID]: prevStatuses[emptySubredditID] ? [...prevStatuses[emptySubredditID], response.status] : [response.status]
                        }));
                
                        const membershipStatus = await fetchMembershipStatus(emptySubredditID);
                        setMembershipStatuses(prevStatuses => ({
                            ...prevStatuses,
                            [emptySubredditID]: membershipStatus || 'Non-member'
                        }));
                    }
                }

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
          setShowLogin(true)
          setIsLogin(true)
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
                alert("Moderators cannot unfollow their own subreddit.");
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
        if (membershipStatuses[subreddit_id] === "member"||membershipStatuses[subreddit_id] === "moderator") {
            navigate(`/subreddit/${subreddit_id}`);
        } else {
            console.log("Access denied. Current status:", membershipStatuses[subreddit_id]);
            alert("You need to follow this subreddit before accessing it.");
        }
    }

    return (
        <div className="container mt-2 ms-4">
            <div className="d-flex flex-column gap-3">
                <h2>For You Page</h2>
                {posts.map((p, index) => (
                    <div key={p.id || index} className="card mb-4 w-50">
                        <div className="card h-100">
                            <div className="card-body">
                                <h5
                                    className="card-title clickable-heading"
                                    onClick={() => redirectToSubreddit(p.subreddit_id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {p.title}
                                </h5>
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
                                            console.log('authorized follow...')
                                            handleFollowToggle(p.subreddit_id)
                                        }} >
                                        {membershipStatuses[p.subreddit_id] === "Non-member"
                                            ? "Follow"
                                            : "Following"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
                {emptyJoined.length > 0 && (
                <div className="mt-4">
                    <h4>Empty Subreddits</h4>
                    {emptyJoined.map((subredditID) => (
                        <div key={subredditID} className="card mb-4 w-50">
                            <div className="card-body">
                                <h5
                                    className="card-title"
                                    style={{ cursor: "pointer" }}
                                >
                                    {subredditNames[subredditID] || "Loading..."}
                                </h5>
                                <p className="card-text">
                                    {subredditStatuses[subredditID] ? (
                                        <>
                                            {subredditStatuses[subredditID] === "private" ? (
                                                <i className="fas fa-lock text-danger"></i>
                                            ) : (
                                                <i className="fas fa-globe text-success"></i>
                                            )}
                                            {` ${subredditStatuses[subredditID]}`}
                                        </>
                                    ) : (
                                        "Loading subreddit status..."
                                    )}
                                </p>

                                <div className="mt-2">
                                    <button
                                        className={`btn ${
                                            membershipStatuses[subredditID] === "Non-member"
                                                ? "btn-outline-primary"
                                                : "btn-primary"
                                        } btn-sm`}
                                        onClick={() => {
                                            if (!handleUnauthenticatedAction()) return;
                                            handleFollowToggle(subredditID);
                                        }}
                                    >
                                        {membershipStatuses[subredditID] === "Non-member"
                                            ? "Follow"
                                            : "Following"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
        <otherPanel />
        {showLogin && <ModalLogin isLogin={isLogin} setIsLogin={setIsLogin} isLoginComp={showLogin} setIsLoginComp={setShowLogin} />}
    </div>
    );
};

export default SubredditPanel;
