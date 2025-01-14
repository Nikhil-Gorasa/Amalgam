import React,{useState,useEffect} from 'react';
import './Main.css';
import Navbar from '../Navbar/Navbar.jsx';
import Footer from '../Footer/Footer.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';import PortfolioList from '../PortfolioList/PortfolioList.jsx';

function Main(){
    const [indianmarketStatus,setIndianMarketStatus] = useState(true);
    const [usmarketStatus,setUsMarketStatus] = useState(true);
    const [portfolioData, setPortfolioData] = useState({
        totalInvestment: '0.00',
        totalCurrentValue: '0.00',
        totalReturns: '0.00'
    });
    const [chartData, setChartData] = useState(() => {
        const last7Days = [];
        for (let i = 6; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            last7Days.push({
                date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                value: 0,
                timestamp: date.getTime()
            });
        }
        return last7Days;
    });

    const checkMarketStatus = (marketType) => {
        const now = new Date();
        const day = now.getDay();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        const currentTime = hours * 60 + minutes;


        if (day >= 1 && day <= 5) {
            if (marketType === 'indian') {
                const isOpen = currentTime >= 555 && currentTime <= 930;
                setIndianMarketStatus(isOpen);
                return isOpen;
            } else {
                // 7:00 PM (1140) to 1:30 AM (90)
                const isOpen = currentTime >= 1140 || currentTime <= 90;
                setUsMarketStatus(isOpen);
                return isOpen;
            }
        }
        
        marketType === 'indian' ? setIndianMarketStatus(false) : setUsMarketStatus(false);
        return false;
    };

    // Update market status every minute
    useEffect(() => {
        const updateMarketStatus = () => {
            checkMarketStatus('indian');
            checkMarketStatus('us');
        };

        updateMarketStatus();
        const interval = setInterval(updateMarketStatus, 60000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Update chart data whenever portfolio value changes, including when it's 0
        const now = new Date();
        const todayStr = now.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        
        setChartData(prevData => {
            const todayExists = prevData.find(item => item.date === todayStr);
            
            if (todayExists) {
                return prevData.map(item => 
                    item.date === todayStr 
                        ? { ...item, value: parseFloat(portfolioData.totalCurrentValue) }
                        : item
                );
            } else {
                const newData = [...prevData.slice(1)];
                newData.push({
                    date: todayStr,
                    value: parseFloat(portfolioData.totalCurrentValue),
                    timestamp: now.getTime()
                });
                return newData;
            }
        });
    }, [portfolioData.totalCurrentValue]); // This will now trigger even when value is "0.00"

    const handlePortfolioUpdate = (data) => {
        setPortfolioData(data);
    };

    return(
        <>
        <Navbar/>
        <div id="main">
            <div id="marketstatus">
                <div id="indianmarket" style={{backgroundColor: indianmarketStatus?"var(--green-color)":"gray"}}>
                    <h1>{indianmarketStatus?"Indian Market is now Open 🎉":"Indian Market is Closed 🕛"}</h1>
                    <p> 9:15 AM to 3:30 PM IST (Monday to Friday)</p>
                </div>

                <div id="usmarket" style={{backgroundColor: usmarketStatus?"var(--green-color)":"gray"}}>
                    <h1>{usmarketStatus?"US Market is now Open 🎉":"US Market is Closed 🕛"}</h1>
                    <p>7:00 PM to 1:30 AM IST (Monday to Friday)</p>
                </div>
            </div>
            <div id="maindisplay">
                <div id="yourportfolio">
                    <h1>Your Portfolio</h1>
                </div>
                <div id="analytics">
                    <div id="totalvaluecard">
                        <h1>Dashboard</h1>
                        <div id="valuecardsecone">
                            <div id="invested">
                                <h1>Invested Amount</h1>
                                <p>${portfolioData.totalInvestment}</p>
                            </div>
                            <div id="currentvalue">
                                <h1>Current Value</h1>
                                <p>${portfolioData.totalCurrentValue}</p>
                            </div>
                        </div>

                        <div id="yourreturns" style={{
                            backgroundColor: Number(portfolioData.totalReturns) >= 0 ? "var(--green-color)" : "var(--red-color)"
                        }}>
                            <h1>Your Returns</h1>
                            <p>{Number(portfolioData.totalReturns) >= 0 ? 
                                `+$${portfolioData.totalReturns}` : 
                                `-$${Math.abs(portfolioData.totalReturns)}`}</p>
                        </div>

                    </div>

                    <div id="linechartcard">
                        <h1>Portfolio Growth</h1>
                        <div id="chart">
                            <ResponsiveContainer width="100%" height={200}>
                                <LineChart data={chartData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="date"
                                        tick={{ fill: 'var(--green-color)' }}
                                    />
                                    <YAxis 
                                        tick={{ color: 'var(--green-color)' }}
                                    />
                                    <Tooltip 
                                        formatter={(value) => [`$${parseFloat(value).toLocaleString()}`, 'Portfolio Value']}
                                    />
                                    <Legend />
                                    <Line 
                                        type="monotone" 
                                        dataKey="value" 
                                        stroke="var(--green-color)" 
                                        strokeWidth={2}
                                        dot={{ fill: 'var(--green-color)', r: 4 }}
                                        activeDot={{ r: 8 }}
                                        name="Portfolio Value"
                                    />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
                <PortfolioList onPortfolioUpdate={handlePortfolioUpdate} />
                {/* <TradingViewWidget/> */}
            </div>
        </div>
        <div id="footerr">
            <h1>Made with ❤️ by <a href="https://linktr.ee/Nikhil_Gorasa" target="_blank">Nikhil Gorasa</a></h1>
        </div>
        </>
    );
}

export default Main;