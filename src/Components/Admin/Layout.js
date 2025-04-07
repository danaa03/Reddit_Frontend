import React from 'react'
import { Link, useLocation } from 'react-router-dom'

const AdminLayout = ({ children }) => {
  const location = useLocation()
  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('userRole')
    window.location.href = '/'
  }
  return (
    <div className="d-flex">
      <div className="d-flex flex-column flex-shrink-0 p-3 text-white bg-dark" style={{ width: '280px', minHeight: '100vh' }}>
        <Link to="/admin" className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none">
          <span className="fs-4">Admin Panel</span>
        </Link>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <Link to="/admin/dashboard" className={`nav-link text-white ${location.pathname === '/admin' ? 'active' : ''}`}>
              Dashboard
            </Link>
          </li>
          <li>
            <Link to="/admin/users" className={`nav-link text-white ${location.pathname === '/admin/users' ? 'active' : ''}`}>
              Users
            </Link>
          </li>
          <li>
            <Link to="/admin/posts" className={`nav-link text-white ${location.pathname === '/admin/posts' ? 'active' : ''}`}>
              Posts
            </Link>
          </li>
          <li>
            <Link to="/admin/subreddits" className={`nav-link text-white ${location.pathname === '/admin/settings' ? 'active' : ''}`}>
              Subreddits
            </Link>
          </li>
        </ul>
        <hr />
        <button className="btn btn-danger" onClick={handleLogout}>Logout</button>
      </div>

      <div className="flex-grow-1 p-4 bg-light">
        {children}
      </div>
    </div>
  )
}

export default AdminLayout
