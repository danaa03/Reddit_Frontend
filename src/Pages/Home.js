import Login from '../Components/Login'
import Signup from '../Components/Signup'
import SubredditPanel from '../Components/SubredditPanel';

const Home = ({ isLogin, setIsLogin, isLoginComp, setIsLoginComp }) => {
    return (
        <div>
                {isLoginComp ? (
                isLogin ? (
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
                )
            ) : (
                <SubredditPanel />
            )}
                
        </div>
    )
 
  };
  
  export default Home;