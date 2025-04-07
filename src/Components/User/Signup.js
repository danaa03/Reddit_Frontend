import React from 'react';
import './login.css'
import {useState} from 'react'
import {signupUser} from '../../Routes/auth'

const Signup = ({isLogin, setIsLogin}) => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    
    const handleRedirect = () => {
        setIsLogin(true);
    }

    const handleSubmit = async () => {

        if (username === "" || email === "" || password === "" || confirmPassword === "")
        {
            alert("Error! Empty Field(s) Submitted!");
            return;
        }

        try {
            const data = await signupUser(username, email, password, confirmPassword);
            alert("Signup Successful!");
            setUsername("")
            setEmail("")
            setPassword("")
            setConfirmPassword("")
            setIsLogin(true)
        } catch (error) {
            alert("Signup Failed: " + error.message);
        }
        
    }

    return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 p-md-5 shadow rounded-4" style={{ maxWidth: '400px', width: '100%' }}>
        <h2 className="text-center mb-3">Sign Up</h2>

        <div className="d-grid gap-2 mb-3">
          <button className="btn btn-outline-secondary rounded-pill d-flex align-items-center justify-content-center gap-2 disabled">
            <img src='/google-logo.png'/>Continue with Google
          </button>
          <button className="btn btn-outline-secondary rounded-pill d-flex align-items-center justify-content-center gap-2 disabled">
            <img src='/mac-os.png'/>Continue with Apple
          </button>
        </div>
        <hr className="border-top border-dark"/>

        <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        <div className="form-group mb-2">
            <input type="username" className="form-control" id="username" aria-describedby="usernameHelp" placeholder="Enter username" onChange={(e) => setUsername(e.target.value)} value={username} />
        </div>
        <div className="form-group mb-2">
            <input type="email" className="form-control" id="email" aria-describedby="emailHelp" placeholder="Enter email" onChange={(e) => setEmail(e.target.value)} value={email} />
        </div>
        <div className="form-group mb-2">
            <input type="password" className="form-control" id="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} value={password} />
        </div>
        <div className="form-group mb-3">
            <input type="password" className="form-control" id="cpassword" placeholder="Confirm Password" onChange={(e) => setConfirmPassword(e.target.value)} value={confirmPassword} />
        </div>
        <div className="text-sm text-muted mb-2 ms-2">
            <span>New to reddit? <button type='button' onClick={handleRedirect} className='btn btn-link p-0 mb-2'>Login</button></span>
        </div>
        <button type="submit" className="btn submit-lgn w-100 rounded-pill">Sign Up</button>
        </form>
      </div>
    </div>
  );
};

export default Signup;
