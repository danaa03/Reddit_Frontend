import Login from "./Login";
import Signup from "./Signup";

const ModalLogin = ({isLogin, setIsLogin, isLoginComp, setIsLoginComp}) => {
    return(
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
    )
}
export default ModalLogin;