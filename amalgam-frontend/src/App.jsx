import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginSignup from './components/LoginSignup/LoginSignup';
import Main from './components/Main/Main';
import About from './components/About/About';
import Contact from './components/Contact/Contact';
import Help from './components/Help/Help';

function App() {
    return (
        <Router>
            <Routes>
                {/* <Route path="/" element={<LoginSignup />} /> */}
                <Route path="/login" element={<LoginSignup />} />
                <Route path="/" element={<Main />} />
                <Route path="/about" element={<About />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/help" element={<Help />} />
            </Routes>
        </Router>
    );
}

export default App;
