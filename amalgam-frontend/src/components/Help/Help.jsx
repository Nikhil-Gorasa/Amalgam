import './Help.css';
import Navbar from '../Navbar/Navbar';

function Help() {
    return (
        <>
            <Navbar />
            <div className="help-container">
                <h1>Help Center</h1>
                <div className="help-content">
                    <section className="help-section">
                        <h2>Frequently Asked Questions</h2>
                        <div className="faq-item">
                            <h3>How do I add stocks to my portfolio?</h3>
                            <p>Use the "Add Investment" form to enter the stock symbol, quantity, and purchase price.</p>
                        </div>
                        <div className="faq-item">
                            <h3>How often are stock prices updated?</h3>
                            <p>Due to API limitations, stock prices are updated periodically. Click the refresh button to get the latest prices. Note that we use a free-tier API which allows up to 60 calls per minute.</p>
                        </div>
                        <div className="faq-item">
                            <h3>How do I remove stocks from my portfolio?</h3>
                            <p>Click the remove button next to any stock in your portfolio list.</p>
                        </div>
                    </section>
                </div>
            </div>
            <div id="footer">
                <h1>Made with ❤️ by <a href="https://linktr.ee/Nikhil_Gorasa" target="_blank">Nikhil Gorasa</a></h1>
            </div>
        </>
    );
}

export default Help; 