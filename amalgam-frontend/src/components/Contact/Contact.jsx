import './Contact.css';
import Navbar from '../Navbar/Navbar';

function Contact() {
    return (
        <>
            <Navbar />
            <div className="contact-container">
                <h1>Contact Us</h1>
                <div className="contact-content">
                    <div className="contact-info">
                        <h2>Get in Touch</h2>
                        <p>Have questions or suggestions? We'd love to hear from you!</p>
                        <div className="contact-details">
                            <p>📧 Email: nikhil.gorasa1@gmail.com</p>
                            <p>📞 Phone: (+91)999999999</p>
                            <p>📍 Location: Hyderabad, India</p>
                        </div>
                    </div>
                    
                    <div className="contact-form">
                        <h2>Send us a Message</h2>
                        <form>
                            <input type="text" placeholder="Name" required />
                            <input type="email" placeholder="Email" required />
                            <textarea placeholder="Your message" required></textarea>
                            <button type="submit" onClick={(e) => {
                                e.preventDefault();
                                window.location.href = `mailto:nikhil.gorasa1@gmail.com?subject=Contact Form Submission&body=${encodeURIComponent(
                                    `Name: ${e.target.form[0].value}\nEmail: ${e.target.form[1].value}\n\nMessage:\n${e.target.form[2].value}`
                                )}`;
                            }}>Send Message</button>
                        </form>
                    </div>
                </div>
            </div>
            <div id="footer">
                <h1>Made with ❤️ by <a href="https://linktr.ee/Nikhil_Gorasa" target="_blank">Nikhil Gorasa</a></h1>
            </div>
        </>
    );
}

export default Contact; 