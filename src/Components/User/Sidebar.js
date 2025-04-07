import React, {useState} from "react";
import { Link } from "react-router-dom";
import CreateSubreddit from "./CreateSubreddit";
import ModalLogin from "./ModalLogin";

const RedditSidebar = () => {
  const [showCreateComm, setShowCreateComm] = useState(false);
  const [isLogin, setIsLogin] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const toggleModal = () => {
    setShowCreateComm(!showCreateComm);
  };
  const handleUnauthenticatedAction = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setShowLogin(true)
      setIsLogin(true)
      return false;
    }
    return true;
  };
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
          <Link to="/my-posts" className="nav-link text-dark">
            <i className="fas fa-compass me-2"></i> My Posts
          </Link>
        </li>
      </ul>

      <hr />
      <h6 className="text-secondary">COMMUNITIES</h6>
      <ul className="nav flex-column">
        <li className="nav-item">
          <button 
          onClick={() => {
            if (!handleUnauthenticatedAction()) return;
            toggleModal();
            }}
     
            className="nav-link text-dark" 
            style={{ background: "none", border: "none", padding: "0.375rem 0.75rem", textAlign: "left" }}
          >
            <i className="fas fa-users me-2"></i> Create a community
          </button>
        </li>
        {/* <li className="nav-item">
          <button 
          onClick={() => {
            if (!handleUnauthenticatedAction()) return;
              
            }}
     
            className="nav-link text-dark disabled" 
            style={{ background: "none", border: "none", padding: "0.375rem 0.75rem", textAlign: "left" }}
          >
            <i class="fa fa-cog" aria-hidden="true"></i> My Communities
          </button>
        </li> */}
      </ul>
      {showCreateComm && <CreateSubreddit isComp={showCreateComm} setIsComp={setShowCreateComm} />}
      {showLogin && <ModalLogin isLogin={isLogin} setIsLogin={setIsLogin} isLoginComp={showLogin} setIsLoginComp={setShowLogin}/>}
    </div>
  );
};

export default RedditSidebar;
