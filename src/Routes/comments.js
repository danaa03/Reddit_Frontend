const API_URL = "http://127.0.0.1:8000/";

const addComment = async (post_id, content) => {
    const token = localStorage.getItem("token");
    console.log("token: ", token)
    console.log("comment: ", content)
    if (!token) {
        throw new Error("You must be logged in to comment.");
    }

    try {
        const response = await fetch(API_URL + "comments/create-comment", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
            body: JSON.stringify({ post_id, content }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            const firstError = errorData.detail?.[0]?.msg || errorData.detail || "Comment creation failed.";
            throw new Error(firstError);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Comment Error:", error);
        throw error;
    }
};
//comments/post/postid
const viewComments = async (post_id) => {
    try {
        console.log(post_id)
        const response = await fetch (`${API_URL}comments/post/${post_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            }
        });
        if(!response.ok) {
            const errorData = await response.json();
            const firstError = errorData.detail?.[0]?.msg || "Comments' Retrieval Failed";
            throw new Error(firstError);
        }
        const data = await response.json()
        return data;
    }
    catch (error) {
        console.error("Failed to get username: " , error);
        throw error;
    }
}

const upvoteComment = async (comment_id) => {
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
            body: JSON.stringify({ comment_id, vote_type: "upvote" }),
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

const downvoteComment = async (comment_id) => {
    const token = localStorage.getItem("token");
    console.log("token at downvote: ", token)
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
            body: JSON.stringify({ comment_id, vote_type: "downvote" }),
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

export {addComment, viewComments, upvoteComment, downvoteComment};