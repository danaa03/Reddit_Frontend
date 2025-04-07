import { Navigate } from "react-router-dom";
import AdminLayout from "../../Components/Admin/Layout";
import { fetchSubreddits } from "../../Routes/Admin/Stats"; 
import { useEffect, useState } from "react";

const SubredditsPanel = () => {
  const [subreddits, setSubreddits] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const subredditsPerPage = 5;

  const isAdmin = localStorage.getItem("userRole") === "admin";

  useEffect(() => {
    const loadSubreddits = async () => {
      try {
        const data = await fetchSubreddits();
        console.log("Fetched subreddits:", data);
        setSubreddits(data);
      } catch (err) {
        console.error("Failed to load subreddits:", err);
      }
    };

    loadSubreddits();
  }, []);

  const handleDelete = async (subredditId) => {
    console.log("Deleting subreddit with ID:", subredditId);
    const token = localStorage.getItem("token");
    const confirmed = window.confirm("Are you sure you want to delete this subreddit?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-subreddit/${subredditId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete subreddit");

      setSubreddits(subreddits.filter(subreddit => subreddit.id !== subredditId));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const indexOfLastSubreddit = currentPage * subredditsPerPage;
  const indexOfFirstSubreddit = indexOfLastSubreddit - subredditsPerPage;
  const currentSubreddits = subreddits.slice(indexOfFirstSubreddit, indexOfLastSubreddit);
  const totalPages = Math.ceil(subreddits.length / subredditsPerPage);

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2 className="mb-4">All Subreddits</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentSubreddits.map((subreddit, idx) => (
                <tr key={subreddit.id}>
                  <td>{indexOfFirstSubreddit + idx + 1}</td>
                  <td>{subreddit.name}</td>
                  <td>{subreddit.description}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(subreddit.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentSubreddits.length === 0 && (
                <tr>
                  <td colSpan="4" className="text-center">No subreddits found.</td>
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

export default SubredditsPanel;
