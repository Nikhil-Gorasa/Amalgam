import './PortfolioList.css';
import React,{useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';

function PortfolioList({ onPortfolioUpdate }){

    const [search, setSearch] = useState('');
    const [apiKey, setApiKey] = useState('');
    const [apiopen,setApiOpen] = useState('false');
    const [buyQuantity, setBuyQuantity] = useState('');
    const [buyPrice, setBuyPrice] = useState('');
    const [stockList, setStockList] = useState([
    //     {
    //     id: 'example',
    //     search: 'AAPL',
    //     companyName: 'Apple Inc.',
    //     buyQuantity: 10,
    //     buyPrice: 175.50
    // }
]);
    
    const [marketPrices, setMarketPrices] = useState({});
    const [searchSuggestions, setSearchSuggestions] = useState([]);
    const [selectedCompanyName, setSelectedCompanyName] = useState('');

    function handleApiKey(e){
        setApiKey(e.target.value);
    }

    function ToggleApiOpen(){
        setApiOpen(!apiopen);
    }


    // const fetchMarketPriceAlphaVantage = async (symbol) => {
    //     console.log('Fetching price from Alpha Vantage:', symbol);
    //     try {
    //         const API_KEY = 'ZFZ91EST7DF3HY7B';
            
    //         // For testing: Use mock data if we hit the rate limit
    //         const mockPrices = {
    //             'AAPL': 175.50,
    //             'GOOGL': 142.65,
    //             'MSFT': 420.45,
    //             'AMZN': 178.25,
    //             'TSLA': 185.30
    //         };

    //         const url = `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`;
    //         const response = await axios.get(url);
            
    //         if (response.data['Global Quote']) {
    //             const price = response.data['Global Quote']['05. price'];
    //             setMarketPrices(prev => ({
    //                 ...prev,
    //                 [symbol]: parseFloat(price)
    //             }));
    //         } else if (response.data.Information?.includes('rate limit')) {
    //             // If we hit the rate limit, use mock data
    //             console.log('Rate limit reached, using mock data');
    //             setMarketPrices(prev => ({
    //                 ...prev,
    //                 [symbol]: mockPrices[symbol] || 100.00
    //             }));
    //         } else {
    //             console.log('No price data in response, using mock data');
    //             setMarketPrices(prev => ({
    //                 ...prev,
    //                 [symbol]: mockPrices[symbol] || 100.00
    //             }));
    //         }
    //     } catch (error) {
    //         console.error('Error fetching from Alpha Vantage:', error);
    //         // Use mock data in case of error
    //         setMarketPrices(prev => ({
    //             ...prev,
    //             [symbol]: mockPrices[symbol] || 100.00
    //         }));
    //     }
    // };



    const fetchMarketPrice = async (symbol, retryCount = 0) => {
        // Strip any exchange suffixes (like .MX)
        const baseSymbol = symbol.split('.')[0];
        
        console.log('Fetching price from Finnhub:', baseSymbol);
        try {
            const FINNHUB_API_KEY = 'ctt0ephr01qin3c10ro0ctt0ephr01qin3c10rog';
            const url = `https://finnhub.io/api/v1/quote?symbol=${baseSymbol}&token=${FINNHUB_API_KEY}`;
            
            // Add exponential backoff delay
            if (retryCount > 0) {
                const delay = Math.min(1000 * Math.pow(2, retryCount), 10000);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
            
            const response = await axios.get(url);
            
            if (response.data && response.data.c) {
                const price = response.data.c;
                setMarketPrices(prev => ({
                    ...prev,
                    [symbol]: parseFloat(price)  // Keep original symbol in state
                }));
            }
        } catch (error) {
            if (error.response?.status === 429 && retryCount < 3) {
                console.log(`Rate limited, retrying ${symbol} (attempt ${retryCount + 1})`);
                return fetchMarketPrice(symbol, retryCount + 1);
            }
            console.error('Error fetching from Finnhub:', error);
            setMarketPrices(prev => ({
                ...prev,
                [symbol]: 0  // Default fallback price
            }));
        }
    };

    useEffect(() => {
        console.log('StockList changed, fetching prices...');
        stockList.forEach(stock => {
            fetchMarketPrice(stock.search);
        });
    }, [stockList]);

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    const debouncedSearchSymbols = useCallback(
        debounce(async (query) => {
            if (!query) {
                setSearchSuggestions([]);
                return;
            }
            
            try {
                const FINNHUB_API_KEY = 'ctt0ephr01qin3c10ro0ctt0ephr01qin3c10rog';
                const url = `https://finnhub.io/api/v1/search?q=${query}&token=${FINNHUB_API_KEY}`;
                const response = await axios.get(url);
                
                if (response.data && response.data.result) {
                    const suggestions = response.data.result
                        .filter(item => 
                            item.type === 'Common Stock' && 
                            !item.symbol.includes('.') // Filter out non-US stocks
                        )
                        .slice(0, 5)
                        .map(item => ({
                            symbol: item.symbol,
                            description: item.description
                        }));
                    setSearchSuggestions(suggestions);
                }
            } catch (error) {
                console.error('Error searching symbols:', error);
                setSearchSuggestions([]);
            }
        }, 300),
        []
    );

    function handleSearch(e){
        const value = e.target.value;
        setSearch(value);
        debouncedSearchSymbols(value);
    }

    function handleBuyQuantity(e){
        setBuyQuantity(e.target.value);
    }

    function handleBuyPrice(e){
        setBuyPrice(e.target.value);
    }

    async function handleAddInvestment() {
        if (!search) return;
        
        try {
            const user = JSON.parse(localStorage.getItem('user'));
            const selectedSuggestion = searchSuggestions.find(s => s.symbol === search.toUpperCase());
            
            // Save to backend
            const response = await axios.post('http://localhost:8080/api/stocks', {
                userId: user.id,
                name: selectedCompanyName || selectedSuggestion?.description || search.toUpperCase(),
                ticker: search.toUpperCase(),
                quantity: Number(buyQuantity),
                buyPrice: Number(buyPrice)
            });

            // Update frontend state with the ID from the response
            const newStock = {
                id: response.data.id,
                search: search.toUpperCase(),
                companyName: selectedCompanyName || selectedSuggestion?.description || search.toUpperCase(),
                buyQuantity: Number(buyQuantity),
                buyPrice: Number(buyPrice)
            };
            
            setStockList([...stockList, newStock]);
            setSearch('');
            setSelectedCompanyName('');
            setBuyQuantity('');
            setBuyPrice('');
            setSearchSuggestions([]);
        } catch (error) {
            console.error('Error adding stock:', error);
        }
    }

    async function handleRemoveStock(index) {
        try {
            const stockToRemove = stockList[index];
            const user = JSON.parse(localStorage.getItem('user'));
            
            console.log('Removing stock:', stockToRemove);
            console.log('Stock ID:', stockToRemove.id);
            
            if (!stockToRemove.id) {
                console.error('Stock ID is missing!');
                return;
            }
            
            await axios.delete(`http://localhost:8080/api/stocks/${stockToRemove.id}`, {
                data: { 
                    userId: Number(user.id)
                }
            });
            
            setStockList(prevStocks => prevStocks.filter((_, i) => i !== index));
            
        } catch (error) {
            console.error('Error removing stock:', error);
            console.error('Error details:', error.response?.data);
        }
    }

    const calculateReturns = (stock) => {
        const marketPrice = marketPrices[stock.search];
        if (!marketPrice) return '-';
        const returns = ((marketPrice - stock.buyPrice) * stock.buyQuantity).toFixed(2)
        return Number(returns) > 0 ? `+$${returns}` : `-$${Math.abs(returns)}`;
    };

    const refreshPrices = () => {
        console.log('Refresh clicked, fetching new prices...');
        stockList.forEach(stock => {
            fetchMarketPrice(stock.search);
        });
    };

    function handleSelectSuggestion(symbol, description) {
        console.log('Selected:', symbol, description); // Debug log
        setSearch(symbol);
        setSelectedCompanyName(description);
        setSearchSuggestions([]);
    }

    const calculateTotalInvestment = () => {
        return stockList.reduce((total, stock) => {
            const investedAmount = stock.buyQuantity * stock.buyPrice;
            return total + investedAmount;
        }, 0).toFixed(2);
    };

    const calculateTotalCurrentValue = () => {
        return stockList.reduce((total, stock) => {
            const currentPrice = marketPrices[stock.search] || stock.buyPrice;
            const currentValue = stock.buyQuantity * currentPrice;
            return total + currentValue;
        }, 0).toFixed(2);
    };

    const calculateTotalReturns = () => {
        const totalInvestment = parseFloat(calculateTotalInvestment());
        const totalCurrent = parseFloat(calculateTotalCurrentValue());
        return (totalCurrent - totalInvestment).toFixed(2);
    };

    useEffect(() => {
        const portfolioData = {
            totalInvestment: calculateTotalInvestment(),
            totalCurrentValue: calculateTotalCurrentValue(),
            totalReturns: calculateTotalReturns()
        };
        onPortfolioUpdate(portfolioData);
    }, [stockList, marketPrices]);

    useEffect(() => {
        const fetchStocks = async () => {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await axios.get(`http://localhost:8080/api/stocks/user/${user.id}`);
                
                console.log('Backend response:', response.data); // Debug log
                
                const transformedStocks = response.data.map(stock => {
                    console.log('Transforming stock:', stock); // Debug log
                    return {
                        id: stock.id,
                        search: stock.ticker,
                        companyName: stock.name,
                        buyQuantity: stock.quantity,
                        buyPrice: stock.buyPrice
                    };
                });
                
                console.log('Transformed stocks:', transformedStocks); // Debug log
                setStockList(transformedStocks);
                
                // Fetch prices with delay
                for (const stock of transformedStocks) {
                    await new Promise(resolve => setTimeout(resolve, 1000));
                    await fetchMarketPrice(stock.search);
                }
            } catch (error) {
                console.error('Error fetching stocks:', error);
            }
        };

        fetchStocks();
    }, []);

    return(
        <>
            <h1 id="yourinvestments">Your Investments ({stockList.length})</h1>
            <button id="refreshportfolio" onClick={refreshPrices}>Refresh Positions ⟳</button>
            <div id="addinvestment">
                <div id="addinvestmentbar">
                    <div className="search-container">
                        <input 
                            type="search" 
                            placeholder="AAPL" 
                            id="addinvestmentsearch" 
                            value={search} 
                            onChange={handleSearch}
                            autoComplete="off"
                        />
                        {searchSuggestions.length > 0 && (
                            <div className="suggestions-container">
                                {searchSuggestions.map((suggestion, index) => (
                                    <div
                                        key={index}
                                        onClick={() => handleSelectSuggestion(suggestion.symbol, suggestion.description)}
                                        className="suggestion-item"
                                        role="button"
                                        tabIndex={0}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' || e.key === ' ') {
                                                handleSelectSuggestion(suggestion.symbol, suggestion.description);
                                            }
                                        }}
                                    >
                                        <strong>{suggestion.symbol}</strong> - {suggestion.description}
                                    </div>
                                ))}
                            </div>
                        )}

                    </div>
                    <input type="number" placeholder="Buy Quantity" id="addinvestmentbuy" value={buyQuantity} onChange={handleBuyQuantity}/>
                    <input type="number" placeholder="Buy Price" id="addinvestmentprice" value={buyPrice} onChange={handleBuyPrice}/>
                    <button id="addinvestmentbutton" onClick={handleAddInvestment}>Add Investment</button>
                </div>
            </div>

            <div id="stocklist">
                <div id="stocklist-head">
                    <div id="top-performer">
                        <p>TOP PERFORMER : INFOSYS (INFY)</p>
                    </div>    
                    
                    {apiopen && <div id="askapi-hidden"><button onClick={ToggleApiOpen}>⚙️</button></div>}
                    {!apiopen &&
                    <div id="askapi">
                        <input type="text" placeholder='ctt0ephr01qin3c10ro0ctt0ephr01qin3c10rog' onChange={handleApiKey} value={apiKey}/>
                        <button onClick={ToggleApiOpen}>✅</button>
                    </div>
                    }
                    

                </div>
                
                {stockList.length==0 && <div id="firsttime">
                    <h1>No investments yet!</h1> <br />
                    <h5>Add your first investment to get started!</h5>
                </div>}

                {stockList.length>0 && (
                <div id="Info">
                    <p>Stock Name</p>
                    <p>Quantity</p>
                    <p>Buy Price</p>
                        <p>Market Price</p>
                        <p>Returns</p>
                    </div>
                )}

                <div id="stocklistbody">
                    {stockList.map((stock, index) => (
                        <div id="stocklistitem" key={index}>
                            <p id="stocknumber">{index + 1}.</p>
                            <div id="stockitem">
                                <p id="stockname">{stock.companyName} ({stock.search})</p>
                                <p id="stockqty">{stock.buyQuantity || 0}</p>
                                <p id="stockprice">${stock.buyPrice?.toFixed(2) || '0.00'}</p>
                                <p id="stockmarket">
                                    {marketPrices[stock.search] ? `$${marketPrices[stock.search].toFixed(2)}` : '-'}
                                </p>
                                <p id="stocktotal" 
                                    className={Number(calculateReturns(stock).replace(/[^-0-9.]/g, '')) > 0 ? 'returns-positive' : 'returns-negative'}>
                                    {calculateReturns(stock)}
                                </p>
                            </div>
                            <button type="button" id="removestock" onClick={() => handleRemoveStock(index)}>Remove</button>
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
}

PortfolioList.propTypes = {
    onPortfolioUpdate: PropTypes.func.isRequired
};

export default PortfolioList;