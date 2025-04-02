{/*getting most recent post's photo for display image of the subreddits*/}
const API_URL = "http://127.0.0.1:8000/"

const topPosts = async () => {
    try {
        const response = await fetch(API_URL + "subreddit/top-six-reddits-most-recent-posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorMessage = "An error occurred while fetching posts.";
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
        console.error("Error while fetching top posts:", error.message);
        throw error;
    }
};

const nameById = async (subreddit_id) => {
    try {
        const response = await fetch(`${API_URL}subreddit/name-by-id/${subreddit_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorMessage = "An error occurred while fetching the subreddit's name.";
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

const topFiftyPosts = async (subreddit_id) => {
    try {
        const response = await fetch(`${API_URL}subreddit/${subreddit_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorMessage = "An error occurred while fetching the subreddit's name.";
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

export {topPosts, nameById, topFiftyPosts}