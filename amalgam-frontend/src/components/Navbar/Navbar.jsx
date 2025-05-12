import './Navbar.css';
import logo from '../../assets/amalgam_placeholder.svg'
import { useNavigate, Link } from 'react-router-dom';
import { useState } from 'react';

function Navbar() {
    const navigate = useNavigate();
    const user = localStorage.getItem('user');
    const [showLogoutPopup, setShowLogoutPopup] = useState(false);

    const handleLoginLogout = () => {
        if (user) {
            setShowLogoutPopup(true);
        } else {
            navigate('/login');
        }
    };

    const confirmLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        setShowLogoutPopup(false);
        navigate('/login');
    };

    return (
        <div id="nav">
            <Link to="/main" id="logoset">
                <img src={logo} alt="logo" id="logo"/>
                <div id="logo-title">AMALGAM</div>
            </Link>
            
            <div id="navlinks">
                <a href="#" id="login-link" onClick={handleLoginLogout}>
                    {user ? 'Logout' : 'Login'}
                </a>
                <Link to="/about" id="about-link">About</Link>
                <Link to="/contact" id="contact-link">Contact</Link>
                <Link to="/help" id="help-link">Help</Link>
            </div>

            {showLogoutPopup && (
                <>
                    <div className="overlay"></div>
                    <div className="logout-popup">
                        <p>Are you sure you want to logout?</p>
                        <div className="logout-buttons">
                            <button onClick={confirmLogout}>Yes</button>
                            <button onClick={() => setShowLogoutPopup(false)}>No</button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Navbar;