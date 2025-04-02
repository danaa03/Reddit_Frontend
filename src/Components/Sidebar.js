import React from "react";
import { Link } from "react-router-dom";

const RedditSidebar = () => {
  return (
    <div className="d-flex flex-column p-3 bg-white border-end vh-100" style={{ width: "250px" }}>
  
      <Link to="/" className="text-decoration-none text-dark">
        <h4 className="mb-3">
          <i className="fab fa-reddit-alien me-2 text-warning"></i> Reddit
        </h4>
      </Link>

      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/" className="nav-link text-dark">
            <i className="fas fa-home me-2"></i> Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/popular" className="nav-link text-dark">
            <i className="fas fa-fire me-2"></i> Popular
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/explore" className="nav-link text-dark">
            <i className="fas fa-compass me-2"></i> Explore
          </Link>
        </li>
      </ul>

      <hr />
      <h6 className="text-secondary">CUSTOM FEEDS</h6>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/create-feed" className="nav-link text-dark">
            <i className="fas fa-plus-circle me-2"></i> Create a custom feed
          </Link>
        </li>
      </ul>

      <hr />
      <h6 className="text-secondary">COMMUNITIES</h6>
      <ul className="nav flex-column">
        <li className="nav-item">
          <Link to="/create-community" className="nav-link text-dark">
            <i className="fas fa-users me-2"></i> Create a community
          </Link>
        </li>
      </ul>
    </div>
  );
};

export default RedditSidebar;
