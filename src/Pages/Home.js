import Login from '../Components/Login'
import Signup from '../Components/Signup'
import { useState } from 'react';

const Home = (props) => {
    const [isLogin, setIsLogin] = useState(true); 
    if (isLogin)
    {    return <div className="bg-dark">
                    <Login isLogin={isLogin} setIsLogin={setIsLogin}/>
                </div>
    }
    else
    {
        return <div className="bg-dark">
                    <Signup isLogin={isLogin} setIsLogin={setIsLogin}/>
                </div>
    }
  };
  
  export default Home;