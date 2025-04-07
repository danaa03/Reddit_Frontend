import { Navigate } from "react-router-dom";
import AdminLayout from "../../Components/Admin/Layout";
import { getUserCount , getPostCount, getSubredditCount} from "../../Routes/Admin/Stats";
import { useEffect, useState } from "react";

const AdminDashboard = () => {
  const [userCount, setUserCount] = useState(null); 
  const [postCount, setPostCount] = useState(null); 
  const [subredditCount, setSubredditCount] = useState(null); 
  const isAdmin = localStorage.getItem("userRole") === "admin";

  useEffect(() => {
    const fetchUserCount = async () => {
      try {
        const response = await getUserCount();
        console.log("User Count:", response);
        setUserCount(response); 
      } catch (error) {
        console.error("Error fetching user count:", error);
      }
    };

    fetchUserCount();
  }, []); 

  useEffect(() => {
    const fetchPostCount = async () => {
      try {
        const response = await getPostCount();
        console.log("Post Count:", response);
        setPostCount(response); 
      } catch (error) {
        console.error("Error fetching post count:", error);
      }
    };

    fetchPostCount();
  }, []); 

  useEffect(() => {
    const fetchSubredditCount = async () => {
      try {
        const response = await getSubredditCount();
        console.log("Subreddit Count:", response);
        setSubredditCount(response); 
      } catch (error) {
        console.error("Error fetching subreddit count:", error);
      }
    };

    fetchSubredditCount();
  }, []); 


  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return (
    <AdminLayout>
      <div className="admin-dashboard">
        <h1 className="mb-4">Admin Dashboard</h1>
        <div className="admin-stats-grid">
          <div className="admin-stat-card">
            <h3>Total Users</h3>
            <p className="stat-number">{userCount !== null ? userCount : "Loading..."}</p> 
          </div>
          <div className="admin-stat-card">
            <h3>Active Posts</h3>
            <p className="stat-number">{postCount !== null ? postCount : "Loading..."}</p> 
          </div>
          <div className="admin-stat-card">
            <h3>Active Subreddits</h3>
            <p className="stat-number">{subredditCount !== null ? subredditCount : "Loading..."}</p> 
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
