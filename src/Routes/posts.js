const API_URL = "http://127.0.0.1:8000/";

const handleUpvote = async (post_id) => {
    const token = localStorage.getItem("token");
    console.log("token at upvote: ", token)
    if (!token) {
        throw new Error("You must be logged in to vote.");
    }

    try {
        const response = await fetch(API_URL + "votes/add-vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ post_id, vote_type: "upvote" }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const firstError = errorData.detail?.[0]?.msg || errorData.detail || "Upvote failed";
            throw new Error(firstError);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Upvote Error:", error);
        throw error;
    }
};

const handleDownvote = async (post_id) => {
    const token = localStorage.getItem("token");
    console.log("Token at downvote: ", token)
    if (!token) {
        throw new Error("You must be logged in to vote.");
    }

    try {
        const response = await fetch(API_URL + "votes/add-vote", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ post_id, vote_type: "downvote" }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const firstError = errorData.detail?.[0]?.msg || errorData.detail || "Downvote failed";
            throw new Error(firstError);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Downvote Error:", error);
        throw error;
    }
};

const uploadPost = async (formData) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(API_URL+"posts/create-post", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.detail || "Failed to upload post");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in uploadPost:", error.message);
        throw error;
    }
};

const postById = async (subreddit_id) => {
    try {
        const response = await fetch(`${API_URL}posts/${subreddit_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorMessage = "An error occurred while fetching the post.";
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorMessage; 
            } catch (parseError) {
                console.error("Error parsing error response:", parseError);
            } 
            throw new Error(errorMessage);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error while fetching the subreddit's name:", error.message);
        throw error;
    }
}

const MyPosts = async () => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}posts/my-posts/`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            let errorMessage = "An error occurred while fetching the posts.";
            try {
                const errorData = await response.json();
                errorMessage = errorData.detail || errorMessage; 
            } catch (parseError) {
                console.error("Error parsing error response:", parseError);
            } 
            throw new Error(errorMessage);
        }

        const data = await response.json();
        console.log("MyPosts dataaaa: ", data);
        return data;
    } catch (error) {
        console.error("Error while fetching user's posts:", error.message);
        throw error;
    }
}

const deletePost = async (postId) => {
    const token = localStorage.getItem("token");
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      const res = await fetch(`${API_URL}posts/delete-post/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete post");

    } catch (err) {
      console.error("Delete failed:", err);
    }
};

const checkVoteStatus = async (postId) => {
    const token = localStorage.getItem("token");
    try {
        const response = await fetch(`${API_URL}votes/check-vote-on-post/${postId}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
        });

        if (!response.ok) {
            throw new Error("Failed to check vote status");
        }

        const data = await response.json();
        console.log("Vote status data: ", data);
        return data;
    } catch (error) {
        console.error("Error checking vote status:", error.message);
        throw error;
    }
};

export {handleUpvote, handleDownvote, uploadPost, postById, MyPosts, deletePost, checkVoteStatus}
  