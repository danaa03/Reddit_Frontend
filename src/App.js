import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './Components/Header';
import SubredditPage from './Pages/SubredditContent';
import ExpandedPost from './Pages/ExpandedPost'
import Sidebar from './Components/Sidebar'
import Home from './Pages/Home';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
    const [isLogin, setIsLogin] = useState(true);
    const [isLoginComp, setIsLoginComp] = useState(false);

    return (
        <Router>
            <Header
                isLogin={isLogin}
                setIsLogin={setIsLogin}
                isLoginComp={isLoginComp}
                setIsLoginComp={setIsLoginComp}
            />
            <div className='d-flex'>
            <Sidebar/>
            <div className='flex-grow-1 p-4'>
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
                <Route path="/post/:id" element={<ExpandedPost/>} />
            </Routes>
            </div>
            </div>
        </Router>
    );
}

export default App;
