import './About.css';
import Navbar from '../Navbar/Navbar';

function About() {
    return (
        <>
            <Navbar />
            <div className="about-container">
                <h1>About Amalgam</h1>
                <div className="about-content">
                    <section className="about-section">
                        <h2>Our Mission</h2>
                        <p>Amalgam is designed to help investors track and manage their stock portfolio efficiently. 
                        We provide real-time market data and portfolio analytics to help you make informed investment decisions.</p>
                    </section>
                    
                    <section className="about-section">
                        <h2>Features</h2>
                        <ul>
                            <li>Real-time stock tracking</li>
                            <li>Portfolio management</li>
                            <li>Market status monitoring</li>
                            <li>Investment performance analytics</li>
                        </ul>
                    </section>
                </div>
            </div>
            <div id="footer">
                <h1>Made with ❤️ by <a href="https://linktr.ee/Nikhil_Gorasa" target="_blank">Nikhil Gorasa</a></h1>
            </div>
        </>
    );
}

export default About; 