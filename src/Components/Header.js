import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Login from './Login';
import Signup from './Signup';

const Header = ({ isLogin, setIsLogin, isLoginComp, setIsLoginComp }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("token"));
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        setIsLoggedIn(!!token); 
    }, [isLoginComp]);
    const loginBtnClicked = () => {
        if (isLoggedIn) {
            localStorage.removeItem("token");
            setIsLoggedIn(false);
            setIsLogin(false);
            console.log("logged out");
        } else {
            setIsLoginComp(!isLoginComp);
        }
    };

    function redirectToHome () {
        navigate('/');
    }

    return (
        <>
        <nav className="navbar navbar-expand-lg bg-white">
            <a className="navbar-brand ms-5" href="#"><img src="/reddit_logo.PNG" alt="Reddit Logo" onClick={redirectToHome}/></a>
            <div className="collapse navbar-collapse" id="navbarNav">
                <ul className="navbar-nav">
                    <li className="nav-item">
                        <div className="input-group">
                            <div className="form-outline" data-mdb-input-init>
                                <input type="search" className="form-control rounded-pill bg-light" placeholder="Search Reddit" />
                            </div>
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
