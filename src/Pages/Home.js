import SubredditPanel from '../Components/User/SubredditPanel';

const Home = ({ isLogin, setIsLogin, isLoginComp, setIsLoginComp }) => {
    return (
        <div>
                {/* {isLoginComp ? (
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
            ) : ( */}
                <SubredditPanel />
            {/* )} */}
                
        </div>
    )
 
  };
  
  export default Home;