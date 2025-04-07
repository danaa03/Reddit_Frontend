import { Navigate } from "react-router-dom";
import AdminLayout from "../../Components/Admin/Layout";
import { fetchPosts } from "../../Routes/Admin/Stats";
import { useEffect, useState } from "react";

const PostsPanel = () => {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;

  const isAdmin = localStorage.getItem("userRole") === "admin";

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const data = await fetchPosts();
        console.log("Fetched posts:", data);
        setPosts(data);
      } catch (err) {
        console.error("Failed to load posts:", err);
      }
    };

    loadPosts();
  }, []);

  const handleDelete = async (postId) => {
    const token = localStorage.getItem("token");
    const confirmed = window.confirm("Are you sure you want to delete this post?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-post/${postId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete post");

      setPosts(posts.filter(post => post.id !== postId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2 className="mb-4">All Posts</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Title</th>
                <th>Content</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, idx) => (
                <tr key={post.id}>
                  <td>{indexOfFirstPost + idx + 1}</td>
                  <td>{post.title}</td>
                  <td>{post.content}</td>
                  <td>{new Date(post.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(post.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentPosts.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">No posts found.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <nav className="mt-3">
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, idx) => (
                <li key={idx} className={`page-item ${idx + 1 === currentPage ? "active" : ""}`}>
                  <button className="page-link" onClick={() => setCurrentPage(idx + 1)}>
                    {idx + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>
    </AdminLayout>
  );
};

export default PostsPanel;
