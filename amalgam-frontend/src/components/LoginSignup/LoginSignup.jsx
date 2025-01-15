import './LoginSignup.css';
import Footer from '../Footer/Footer.jsx';
import {useState} from 'react';
import Navbar from '../Navbar/Navbar';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { API_BASE_URL } from '../../config/config';

function LoginSignup(){

    const [username,setUsername]=useState("");
    const [password,setPassword]=useState("");
    const [email,setEmail]=useState("");
    const [isLogin, setIsLogin] = useState(true);
    const [isVisible, setVisibility] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    function handleUsername(e){
        setUsername(e.target.value);
    }

    function handlePassword(e){
        setPassword(e.target.value);
    }

    function handleEmail(e){
        setEmail(e.target.value);
    }

    function toggleIsLogin(){
        setIsLogin(!isLogin);
    }

    function handleVisibility(){
        setVisibility(!isVisible);
    }

    const handleSubmit = async () => {
        try {
            if (isLogin) {
                // Login
                if (!username || !password) {
                    setError("Please fill in all fields");
                    return;
                }
                
                const response = await axios.post(`${API_BASE_URL}/api/users/login`, {
                    username,
                    password
                });
                
                if (response.data) {
                    localStorage.setItem('user', JSON.stringify(response.data));
                    navigate('/main');
                } else {
                    setError("Invalid credentials");
                }
            } else {
                // Register
                if (!username || !email || !password) {
                    setError("Please fill in all fields");
                    return;
                }
                
                const response = await axios.post(`${API_BASE_URL}/api/users/register`, {
                    username,
                    email,
                    password
                });
                setIsLogin(true);
                setError("Registration successful! Please login.");
            }
        } catch (error) {
            if (error.response) {
                // Server responded with error
                setError(error.response.data.message || error.response.data || "Invalid credentials");
            } else if (error.request) {
                // No response received
                setError("Server not responding. Please try again later.");
            } else {
                // Other errors
                setError("An unexpected error occurred. Please try again.");
            }
        }
    };

    return(
    <>
        <Navbar/>

        <div id="login-signup">
            <div id="signup-card">
            <h1 id="title">{isLogin?"Login":"Sign Up"}</h1>
            {error && <p style={{color: 'red'}}>{error}</p>}
            <div id="details">
                <div id="username">
                    <label htmlFor="username">Username</label><br />
                    <input type="text" name="username" value={username} onChange={handleUsername} autoComplete='off'/>
                    
                </div>

                <div id="email" className={isLogin ? 'hidden' : ''}>
                    <label htmlFor="email">Email</label><br />
                    <input type="email" name="email" value={email} onChange={handleEmail} autoComplete='off'/>
                </div>

                <div id="password">
                    <label htmlFor="password">Password</label><br />
                    <input type={isVisible ? 'text' : 'password'} name="password" value={password} onChange={handlePassword} autoComplete='off'/>
                    <button id="eye-hide" onClick={handleVisibility} style={{transform: !isVisible ? 'rotate3d(0,1,0,180deg)' : '', userSelect: 'none'}}>👀 </button>
                </div>
            </div>
            <div id="button-div">
            <button id="login-button" onClick={handleSubmit}>{isLogin?"Login":"Sign Up"}</button>
            </div>
            <div id="accstatus">
                <button onClick={toggleIsLogin}>{isLogin?"Don't have an account ? Sign Up":"Already have an account? Login"}</button>
            </div>
            
            </div>
        </div>

    <Footer/>
    </>
    );
}

export default LoginSignup;
