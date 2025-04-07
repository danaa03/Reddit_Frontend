const API_URL = "http://127.0.0.1:8000/"

const allSubreddits = async () => {
    try {
        const response = await fetch(`${API_URL}subreddit/get-all`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
        });

        if (!response.ok) {
            let errorMessage = "An error occurred while fetching all subreddits.";
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
        console.error("Error while fetching all subreddits:", error.message);
        throw error;
    }
}

const createSubreddit = async (subreddit) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");
  
    try {
      const response = await fetch(`${API_URL}subreddit/create-subreddit`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(subreddit),
      });
  
    
      let data;
      try {
        data = await response.json();
      } catch (err) {
        throw new Error("error while creating subreddit");
      }
  
      if (response.status === 403) {
        throw new Error("Subreddit already exists!");
      }
  
      if (response.status === 500) {
        throw new Error("Server error. Please try again later.");
      }
  
      if (!response.ok) {
        throw new Error(data.detail || "Failed to create subreddit");
      }
  
      return data;
    } catch (err) {
      console.error("Error creating subreddit:", err.message);
      throw new Error(err.message);
    }
  };
  
  

const toggleFollow = async (subreddit_id) => {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized");
    const response = await fetch(`${API_URL}subreddit/follow`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ subreddit_id }),
    });

    console.log("Response status:", response.status); 

    if (response.status === 403) {
        return { status: "moderator" }; 
    }

    if (!response.ok) {
        const errorText = await response.text(); 
        console.warn(`Request failed: ${response.status} - ${errorText}`);
        return { status: "error", message: errorText };  
    }

    return await response.json();
};


const membershipStatus = async (subreddit_id) => {
    const token = localStorage.getItem("token");
    if (token)
    {
        try {
            const response = await fetch(`${API_URL}subreddit/membership-status/${subreddit_id}`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                let errorMessage = "An error occurred while fetching membership status.";
                try {
                    const errorData = await response.json();
                    errorMessage = errorData.detail || errorMessage;
                } catch (parseError) {
                    console.error("Error parsing error response:", parseError);
                }
                throw new Error(errorMessage);
            }
            
            const data = await response.json();  
            return data.status;   
            
        } catch (error) {
            console.error("Error while fetching membership status:", error.message);
            throw error;
        }
    }   
};

const topPosts = async () => {
    const token = localStorage.getItem("token");
    let posts = [];
    let empty_subreddits = [];

    if (token) {
        try {
            const response = await fetch(API_URL + "subreddit/top-six-reddits-most-recent-posts-joined", {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
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
            posts = data.posts || [];
            empty_subreddits = data.empty_joined || [];
            
            if (posts.length === 0 && empty_subreddits.length===0) {
                console.log("User hasn't joined any subreddits, showing recommended public subreddits.");
                return topPostsPublic(); 
            }
            else return data;

        } catch (error) {
            console.error("Error while fetching top posts:", error.message);
            throw error;
        }
    } else {
        return topPostsPublic();  
    }

};

const topPostsPublic = async () => {
    try {
        const response = await fetch(API_URL + "subreddit/top-six-reddits-most-recent-posts-public", {
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
        return data || {};
    } catch (error) {
        console.error("Error while fetching top posts:", error.message);
        throw error;
    }
};

const detailsById = async (subreddit_id) => {
    try {
        const response = await fetch(`${API_URL}subreddit/details-by-id/${subreddit_id}`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            let errorMessage = "An error occurred while fetching the subreddit's name and status.";
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
        console.error("Error while fetching the subreddit's name and status:", error.message);
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

export {topPosts, topPostsPublic, detailsById, topFiftyPosts, membershipStatus, toggleFollow, allSubreddits, createSubreddit}