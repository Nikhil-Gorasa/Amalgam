import React,{useState,useEffect} from 'react';
import './Main.css';
import Navbar from '../Navbar/Navbar.jsx';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';import PortfolioList from '../PortfolioList/PortfolioList.jsx';

function Main(){
    const [indianmarketStatus,setIndianMarketStatus] = useState(true);
    const [usmarketStatus,setUsMarketStatus] = useState(true);
    const [portfolioData, setPortfolioData] = useState({
        totalInvestment: '0.00',
        totalCurrentValue: '0.00',
        totalReturns: '0.00'
    });
    const [chartData, setChartData] = useState([]);
    const [initialLoadComplete, setInitialLoadComplete] = useState(false);

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

    // Effect to populate initial 7 seconds of data ONLY on first load
    useEffect(() => {
        if (!initialLoadComplete) {
            let count = 0;
            const currentValue = parseFloat(portfolioData.totalCurrentValue);
            console.log("Initial value:", currentValue); // Debug log
            
            // Only start if we have a valid value
            if (currentValue > 0) {
                // Function to add a new data point
                const addDataPoint = () => {
                    const now = new Date();
                    setChartData(prevData => {
                        const newData = [...(prevData || []), {
                            point: now.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                second: '2-digit'
                            }),
                            value: currentValue // Use the captured current value
                        }];
                        
                        console.log("Adding point with value:", currentValue); // Debug log
                        return newData.slice(-7);
                    });
                };

                // Add initial point immediately
                addDataPoint();

                // Add a point every second for 6 more seconds
                const intervalId = setInterval(() => {
                    count++;
                    addDataPoint();
                    
                    // Stop after 6 more points (total 7 points)
                    if (count >= 6) {
                        clearInterval(intervalId);
                        setInitialLoadComplete(true);
                    }
                }, 1000);

                return () => clearInterval(intervalId);
            }
        }
    }, [portfolioData.totalCurrentValue]); // Watch for portfolio value changes

    // Normal update effect for portfolio changes
    useEffect(() => {
        if (initialLoadComplete) {
            const currentValue = parseFloat(portfolioData.totalCurrentValue);
            console.log("Update value:", currentValue); // Debug log

            if (currentValue > 0) {
                const timeoutId = setTimeout(() => {
                    setChartData(prevData => {
                        const now = new Date();
                        const newData = [...prevData.slice(1), {
                            point: now.toLocaleTimeString('en-US', { 
                                hour: '2-digit', 
                                minute: '2-digit',
                                second: '2-digit'
                            }),
                            value: currentValue
                        }];
                        return newData;
                    });
                }, 500);

                return () => clearTimeout(timeoutId);
            }
        }
    }, [portfolioData.totalCurrentValue, initialLoadComplete]);

    // Calculate fixed Y-axis domain
    const yMax = Math.max(...chartData.map(item => item.value)) || 100;
    const yMin = Math.min(...chartData.map(item => item.value)) || 0;
    const yDomain = [0, Math.ceil(yMax * 1.1)];

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
                                <LineChart data={chartData} margin={{ top: 10, right: 30, left: 30, bottom: 10 }}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis 
                                        dataKey="point"
                                        tick={{ 
                                            fill: 'var(--green-color)',
                                            fontSize: 10  // Smaller font size for time labels
                                        }}
                                        label={{ 
                                            position: 'bottom', 
                                            fill: 'var(--green-color)',
                                            offset: 0
                                        }}
                                    />
                                    <YAxis 
                                        domain={yDomain}
                                        tick={{ fill: 'var(--green-color)' }}
                                        tickCount={5}
                                        tickFormatter={(value) => `$${value}`}
                                    />
                                    <Tooltip 
                                        formatter={(value) => [`$${parseFloat(value).toFixed(2)}`, 'Portfolio Value']}
                                        contentStyle={{
                                            backgroundColor: 'var(--green-color)',
                                            border: 'none',
                                            borderRadius: '5px',
                                            color: 'var(--green-color)'
                                        }}
                                        labelStyle={{
                                            color: 'white'
                                        }}
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
                                        isAnimationActive={true}
                                        animationDuration={500}
                                        connectNulls={true}
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