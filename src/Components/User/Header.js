import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { allSubreddits , membershipStatus, toggleFollow, detailsById} from '../../Routes/subreddits';
import Login from './Login';
import Signup from './Signup';

const Header = ({ isLogin, setIsLogin, isLoginComp, setIsLoginComp }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
  const navigate = useNavigate();
  const [subreddits, setSubreddits] = useState([]);
  const [filteredSubreddits, setFilteredSubreddits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [membershipStatuses, setMembershipStatuses] = useState({});
  const [subredditStatuses, setSubredditStatuses] = useState({});

  useEffect(() => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token); 
  }, [isLoginComp]);

  useEffect(() => {
    const fetchSubreddits = async () => {
      try {
        const response = await allSubreddits();
        setSubreddits(response.subreddits);
        const statuses = {};
        for (const sub of response.subreddits) {
          statuses[sub.id] = await fetchMembershipStatus(sub.id);
          // console.log("Membership Statusssssssssssssssssss: ", statuses[sub.id]);
        }
        setMembershipStatuses(statuses); 
        console.log("Membership Statuses: ", statuses);
        const subStatuses = {};
        for (const sub of response.subreddits) {
          subStatuses[sub.id] = await fetchDetailsById(sub.id);
        }
        setSubredditStatuses(subStatuses);  
  
      } catch (error) {
        console.error("Error fetching all subreddits: ", error);
      }
    };
  
    fetchSubreddits();
  }, []);
  
  useEffect(() => {
    if (searchTerm) {
      setFilteredSubreddits(
        subreddits.filter(sub =>
        sub.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredSubreddits([]);
    }
  }, [searchTerm, subreddits]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  function handleSubredditClick(subreddit_id) {
    const status = membershipStatuses[subreddit_id.id];

    if (status === "member" || status === "moderator") {
      navigate(`/subreddit/${subreddit_id.id}`);
    } else {
      console.log("Access denied. Current status:", status);
      alert("You need to follow this subreddit before accessing it.");
    }
  }
  
  const loginBtnClicked = () => {
    if (isLoggedIn) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      setIsLogin(false);
      console.log("logged out");
      redirectToHome();
      window.location.reload();
  } else {
    setIsLoginComp(!isLoginComp);
    }
  };

  function redirectToHome () {
      navigate('/');
  }

  const fetchMembershipStatus = async (subreddit_id) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return "Non-member";
  
      const response = await membershipStatus(subreddit_id);
      return response;
    } catch (error) {
      console.error("Error fetching membership status: ", error);
      return "Non-member"; 
    }
  };

  async function fetchDetailsById(subreddit_id) {
    try {
        const response = await detailsById(subreddit_id);
        return response;
    } catch (error) {
        console.error("Error while fetching subreddit name: ", error);
        return "Unknown Subreddit";
    }
}

  const handleUnauthenticatedAction = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      setIsLoginComp(true);
      return false;
    }
    return true;
  };

  const handleFollowToggle = async (subreddit_id) => {
    if (!handleUnauthenticatedAction()) return;

    try {
        const status = subredditStatuses[subreddit_id];
        // if (status === "private") {
        //     alert("You cannot follow private subreddits.");
        //     return;
        // }

        const response = await toggleFollow(subreddit_id);
        if (response.status === "moderator") {
            alert("Moderators cannot unfollow the subreddit.");
            return;
        }

        setMembershipStatuses((prev) => {
            return {
                ...prev,
                [subreddit_id]: response.status, 
            };
        });

        const updatedStatus = await fetchMembershipStatus(subreddit_id);
        setMembershipStatuses((prev) => ({
            ...prev,
            [subreddit_id]: updatedStatus,
        }));

    } catch (error) {
        console.error("Error while toggling follow status:", error);
    }
};


  return (
    <>
      <nav className="navbar navbar-expand-lg bg-white">
        <a className="navbar-brand ms-5" href="#"><img src="/reddit_logo.PNG" alt="Reddit Logo" onClick={redirectToHome}/></a>
          <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav">
              <li className="nav-item">

              <div className="input-group position-relative">
                <input 
                  type="search" 
                  className="form-control rounded-pill bg-light" 
                  placeholder="Search Reddit" 
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                {filteredSubreddits.length > 0 && (
                  <ul className="dropdown-menu show position-absolute w-100 mt-5 rounded shadow" style={{ zIndex: 1000, maxHeight: '200px', overflowY: 'auto' }}>
                    {filteredSubreddits.map((sub, index) => (
                      <li key={index} className="dropdown-item d-flex justify-content-between align-items-center">
                        <span onClick={() => handleSubredditClick(sub)}>{sub.name}</span>
                        <button
                          className={`btn btn-sm ms-2 ${membershipStatuses[sub.id] === "Non-member" ? "btn-outline-primary" : "btn-primary"}`}
                          onClick={(e) => {
                            e.stopPropagation(); 
                            handleFollowToggle(sub.id);
                          }}
                        >
                          {membershipStatuses[sub.id] === "Non-member" ? "Follow" : "Following"}
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              </li>
              <li className="nav-item">
                <button
                  className="btn ms-2 w-100 rounded-pill submit-lgn"
                  type="button"
                  onClick={loginBtnClicked}
                >
                  {isLoggedIn ? 'Log Out' : 'Log In'}
                </button>
              </li>
            </ul>
        </div>
      </nav>

    {isLoginComp && (
      <div
        className="modal fade show"
        style={{ display: 'block', backgroundColor: 'rgba(0, 0, 0, 0.5)' }}
        tabIndex="-1"
        role="dialog"
      >
        <div className="modal-dialog modal-dialog-centered" role="document">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">{isLogin ? 'Log In' : 'Sign Up'}</h5>
              <button
                type="button"
                className="btn-close"
                onClick={() => setIsLoginComp(false)}
              ></button>
            </div>
            <div className="modal-body">
              {isLogin ? (
                <Login
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                  isLoginComp={isLoginComp}
                  setIsLoginComp={setIsLoginComp}
                />
              ) : (
                <Signup
                  isLogin={isLogin}
                  setIsLogin={setIsLogin}
                  isLoginComp={isLoginComp}
                  setIsLoginComp={setIsLoginComp}
                />
              )}
            </div>
          </div>
        </div>
      </div>
     )}
   </>
  );
};

export default Header;
