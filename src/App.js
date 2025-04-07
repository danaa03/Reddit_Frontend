import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Header from './Components/User/Header';
import SubredditPage from './Pages/SubredditContent';
import ExpandedPost from './Pages/ExpandedPost';
import Popular from './Pages/Popular';
import Sidebar from './Components/User/Sidebar';
import Home from './Pages/Home';
import FloatingCard from './Components/User/OtherPanel';
import AdminDashboard from './Pages/Admin/Dashboard';
import '@fortawesome/fontawesome-free/css/all.min.css';
import PostsPanel from './Pages/Admin/Posts';
import MyPosts from './Pages/MyPosts';
import UsersPanel from './Pages/Admin/Users';
import SubredditPanel from './Pages/Admin/Subreddits';

function MainContent({ isLogin, setIsLogin, isLoginComp, setIsLoginComp }) {
    const location = useLocation();

    const showHeader = !location.pathname.startsWith("/admin"); 
    const showSidebar = !location.pathname.startsWith("/admin"); 
    const showFloatingCard = location.pathname === "/" || location.pathname.startsWith("/subreddit");

    const contentClass = location.pathname.startsWith("/admin") ? '' : 'flex-grow-1 p-4 position-relative';

    return (
        <div className='d-flex'>
            {showSidebar && <Sidebar />}
            <div className={contentClass}>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <Home
                                isLogin={isLogin}
                                setIsLogin={setIsLogin}
                                isLoginComp={isLoginComp}
                                setIsLoginComp={setIsLoginComp}
                            />
                        }
                    />
                    <Route path="/subreddit/:id" element={<SubredditPage />} />
                    <Route path="/post/:id" element={<ExpandedPost />} />
                    <Route path="/popular" element={<Popular />} />
                    <Route path="/my-posts" element={<MyPosts />} />
                    
                    <Route path="/admin/dashboard" element={<AdminDashboard />} />
                    <Route path="/admin/users" element={<UsersPanel />} />
                    <Route path="/admin/posts" element={<PostsPanel />} />
                    <Route path="/admin/subreddits" element={<SubredditPanel />} />
                    
                </Routes>
            </div>
            <div className="d-none d-lg-block">
                {showFloatingCard && <FloatingCard />}
            </div>
        </div>
    );
}

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoginComp, setIsLoginComp] = useState(false);
    const location = useLocation();

    return (
        <div className="app-wrapper">
            {/* Conditionally render Header */}
            {location.pathname.startsWith("/admin") ? null : (
                <Header
                    isLogin={isLogin}
                    setIsLogin={setIsLogin}
                    isLoginComp={isLoginComp}
                    setIsLoginComp={setIsLoginComp}
                />
            )}
            <MainContent
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                isLoginComp={isLoginComp}
                setIsLoginComp={setIsLoginComp}
            />
        </div>
    );
}

function Root() {
    return (
        <Router>
            <App />
        </Router>
    );
}

export default Root;
