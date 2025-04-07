import { Navigate } from "react-router-dom";
import AdminLayout from "../../Components/Admin/Layout";
import { fetchUsers } from "../../Routes/Admin/Stats";
import { useEffect, useState } from "react";

const UsersPanel = () => {
  const [users, setUsers] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  const isAdmin = localStorage.getItem("userRole") === "admin";

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const data = await fetchUsers();
        console.log("Fetched users:", data);
        setUsers(data);
      } catch (err) {
        console.error("Failed to load users:", err);
      }
    };

    loadUsers();
  }, []);

  const handleDelete = async (user_username) => {
    const token = localStorage.getItem("token");
    const confirmed = window.confirm("Are you sure you want to delete this user?");
    if (!confirmed) return;

    try {
      const res = await fetch(`http://127.0.0.1:8000/admin/delete-user/${user_username}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers(users.filter(user => user.username !== user_username));
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = users.slice(indexOfFirstUser, indexOfLastUser);
  const totalPages = Math.ceil(users.length / usersPerPage);

  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <AdminLayout>
      <div className="container mt-4">
        <h2 className="mb-4">All Users</h2>
        <div className="table-responsive">
          <table className="table table-striped">
            <thead className="thead-dark">
              <tr>
                <th>#</th>
                <th>Email</th>
                <th>Username</th>
                <th>Joined</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map((user, idx) => (
                <tr key={user.username}>
                  <td>{indexOfFirstUser + idx + 1}</td>
                  <td>{user.email}</td>
                  <td>{user.username}</td>
                  <td>{new Date(user.created_at).toLocaleDateString()}</td>
                  <td>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => handleDelete(user.username)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
              {currentUsers.length === 0 && (
                <tr>
                  <td colSpan="5" className="text-center">No users found.</td>
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

export default UsersPanel;
