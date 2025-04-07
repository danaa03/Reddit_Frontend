const API_URL = "http://127.0.0.1:8000/admin/stats/"
const API_URL2 = "http://127.0.0.1:8000/admin/"

const getUserCount = async (req, res) => {
    const token = localStorage.getItem("token");
    console.log("token at getUserCount: ", token)
    try{
        const response = await fetch(API_URL + "user-count", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            return res.status(500).json({ error: 'Failed to fetch data from Reddit API' });
        }
        const data = await response.json();
        const userCount = data.user_count;
        console.log("User Count: ", userCount)
        console.log(userCount)
        return userCount;
    } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getPostCount = async (req, res) => {
    const token = localStorage.getItem("token");
    console.log("token at getPostCount: ", token)
    try{
        const response = await fetch(API_URL + "active-posts-count", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            return res.status(500).json({ error: 'Failed to fetch data from Reddit API' });
        }
        const data = await response.json();
        const postCount = data.post_count;
        console.log("Post Count: ", postCount)
        console.log(postCount)
        return postCount;
    } catch (error) {
    console.error("Error fetching user count:", error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
}

const getSubredditCount = async (req, res) => {
    const token = localStorage.getItem("token");
    console.log("token at getSubredditCount: ", token)
    try{
        const response = await fetch(API_URL + "subreddit-count", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            }
        });
        if (!response.ok) {
            return res.status(500).json({ error: 'Failed to fetch data from Reddit API' });
        }
        const data = await response.json();
        const subredditCount = data.subreddit_count;
        console.log("Subreddit Count: ", subredditCount)
        console.log(subredditCount)
        return subredditCount;
    } catch (error) {
    console.error("Error fetching subreddit count:", error);
    res.status(500).json({ error: 'Internal Server Error' });
    }
}

const fetchUsers = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(API_URL2 + "users", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch users.");
        }

        const data = await response.json();
        console.log("Fetched users:", data);
        return data;
    } catch (err) {
        console.error("Error fetching users:", err);
        throw err;
    }
};

const fetchPosts = async () => {
    const token = localStorage.getItem("token");

    try {
        const response = await fetch(API_URL2 + "posts", {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            throw new Error("Failed to fetch posts.");
        }

        const data = await response.json();
        console.log("Fetched posts:", data);
        return data;
    } catch (err) {
        console.error("Error fetching posts:", err);
        throw err;
    }
};

const fetchSubreddits = async () => {
    const res = await fetch(API_URL2+"subreddits", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${localStorage.getItem("token")}`,
      },
    });
    if (!res.ok) {
      throw new Error("Failed to fetch subreddits");
    }
    return await res.json();
  };
  

export { getUserCount, getPostCount, getSubredditCount, fetchUsers, fetchPosts, fetchSubreddits};


