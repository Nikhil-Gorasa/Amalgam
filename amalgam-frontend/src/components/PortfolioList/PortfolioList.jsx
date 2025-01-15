import './PortfolioList.css';
import React,{useState, useEffect, useCallback} from 'react';
import axios from 'axios';
import PropTypes from 'prop-types';
import { API_BASE_URL } from '../../config/config';

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
    const [userApiKey, setUserApiKey] = useState('');
    const [isApiKeyValid, setIsApiKeyValid] = useState(false);
    const [isUsingFallbackKey, setIsUsingFallbackKey] = useState(true);
    const [isApiValid, setIsApiValid] = useState(false);
    const [apiKeyStatus, setApiKeyStatus] = useState('');
    const [isRefreshing, setIsRefreshing] = useState(false);

    function handleApiKey(e){
        setApiKey(e.target.value);
    }

    async function handleApiKeySave() {
        try {
            // First validate the key with Finnhub
            const testResponse = await axios.get(`https://finnhub.io/api/v1/quote?symbol=AAPL&token=${apiKey}`);
            
            if (testResponse.data && testResponse.data.c) {
                // Key is valid, save it
                const user = JSON.parse(localStorage.getItem('user'));
                await axios.post(`${API_BASE_URL}/api/users/${user.id}/finnhub-key`, {
                    finnhubKey: apiKey
                });
                
                setUserApiKey(apiKey);
                setIsUsingFallbackKey(false);
                setIsApiValid(true);
                setApiKeyStatus('valid');
                setApiOpen(true);
                alert('API key validated and saved successfully!');
                
                // Refresh prices with new key
                stockList.forEach(stock => {
                    fetchMarketPrice(stock.search);
                });
            }
        } catch (error) {
            console.error('API Key validation error:', error);
            setIsApiValid(false);
            setApiKeyStatus('invalid');
            if (error.response?.status === 403) {
                alert('Invalid API key! Please check your Finnhub API key.');
            } else {
                alert('Error validating API key. Please try again.');
            }
        }
    }

    // Load saved API key on component mount
    useEffect(() => {
        async function loadApiKey() {
            try {
                const user = JSON.parse(localStorage.getItem('user'));
                const response = await axios.get(`${API_BASE_URL}/api/users/${user.id}/finnhub-key`);
                if (response.data.finnhubKey) {
                    setUserApiKey(response.data.finnhubKey);
                    setApiKey(response.data.finnhubKey);
                }
            } catch (error) {
                console.error('Error loading API key:', error);
            }
        }
        loadApiKey();
    }, []);

    function ToggleApiOpen(){
        setApiOpen(!apiopen);
    }

    const fetchMarketPrice = async (symbol, retryCount = 0) => {
        const baseSymbol = symbol.split('.')[0];
        const FALLBACK_KEY = 'ctt0ephr01qin3c10ro0ctt0ephr01qin3c10rog';
        
        const usingKey = userApiKey || FALLBACK_KEY;
        const isUsingFallback = !userApiKey;
        setIsUsingFallbackKey(isUsingFallback);
        
        console.log(`Fetching price for ${baseSymbol} using ${isUsingFallback ? 'fallback' : 'user'} API key`);
        
        try {
            const url = `https://finnhub.io/api/v1/quote?symbol=${baseSymbol}&token=${usingKey}`;
            const response = await axios.get(url);
            
            if (response.data && response.data.c) {
                setIsApiValid(true);
                setMarketPrices(prev => ({
                    ...prev,
                    [symbol]: parseFloat(response.data.c)
                }));
            }
        } catch (error) {
            if (error.response?.status === 403) {
                setIsApiValid(false);
                if (!isUsingFallback) {
                    alert('Your API key appears to be invalid. Falling back to default key.');
                    setUserApiKey(''); // Clear invalid user key
                    // Retry with fallback key
                    return fetchMarketPrice(symbol, retryCount);
                }
            }
            console.error('Error fetching price:', error);
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
                const FINNHUB_API_KEY = userApiKey || 'ctt0ephr01qin3c10ro0ctt0ephr01qin3c10rog';
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
            const response = await axios.post(`${API_BASE_URL}/api/stocks`, {
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
            
            await axios.delete(`${API_BASE_URL}/api/stocks/${stockToRemove.id}`, {
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

    const refreshPrices = async () => {
        setIsRefreshing(true);
        console.log('Refresh clicked, fetching new prices...');
        
        try {
            for (const stock of stockList) {
                await fetchMarketPrice(stock.search);
                // Small delay between requests to avoid rate limiting
                await new Promise(resolve => setTimeout(resolve, 200));
            }
        } catch (error) {
            console.error('Error refreshing prices:', error);
        } finally {
            setIsRefreshing(false);
        }
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
                const response = await axios.get(`${API_BASE_URL}/api/stocks/user/${user.id}`);
                
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

    const calculatePercentageReturn = (stock) => {
        const marketPrice = marketPrices[stock.search];
        if (!marketPrice) return 0;
        return ((marketPrice - stock.buyPrice) / stock.buyPrice) * 100;
    };

    const getTopPerformer = () => {
        if (stockList.length === 0) return null;
        
        // Filter stocks with positive returns first
        const profitableStocks = stockList.filter(stock => {
            const marketPrice = marketPrices[stock.search];
            if (!marketPrice) return false;
            return marketPrice > stock.buyPrice;
        });

        if (profitableStocks.length === 0) return null;

        // Find the stock with highest return among profitable stocks
        return profitableStocks.reduce((topStock, currentStock) => {
            const topReturn = calculatePercentageReturn(topStock);
            const currentReturn = calculatePercentageReturn(currentStock);
            return currentReturn > topReturn ? currentStock : topStock;
        }, profitableStocks[0]);
    };

    return(
        <>
            <h1 id="yourinvestments">Your Investments ({stockList.length})</h1>
            <button 
                id="refreshportfolio" 
                onClick={refreshPrices}
                disabled={isRefreshing}
                className={isRefreshing ? 'refreshing' : ''}
            >
                Refresh Positions {isRefreshing ? '' : ''}
            </button>
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
                    <div id="top-performer" 
                        style={{ 
                            backgroundColor: isUsingFallbackKey ? 'var(--red-color)' : 'var(--green-color)',
                            color: isUsingFallbackKey ? 'white' : 'var(--purple-color)'
                        }}>
                        {(() => {
                            if (isUsingFallbackKey) {
                                return <p>Please enter your <a title="Get Key" href="https://finnhub.io/register" target="_blank">Finnhub API key</a> 👉</p>;
                            }
                            
                            if (stockList.length === 0) {
                                return <p>TOP PERFORMER: No stocks in portfolio</p>;
                            }
                            
                            const topStock = getTopPerformer();
                            if (!topStock) {
                                return <p>TOP PERFORMER: No profitable stocks</p>;
                            }
                            
                            const returnPercentage = calculatePercentageReturn(topStock);
                            return returnPercentage > 0 ? (
                                <p>TOP PERFORMER: {topStock.companyName} ({topStock.search}) 
                                    +{returnPercentage.toFixed(2)}%</p>
                            ) : (
                                <p>TOP PERFORMER: No profitable stocks</p>
                            );
                        })()}
                    </div>
                    
                    <div id={apiopen ? 'askapi-hidden' : 'askapi'}>
                        {!apiopen && (
                            <>
                                <input 
                                    type="text" 
                                    placeholder='Enter your Finnhub API key'
                                    onChange={handleApiKey} 
                                    value={apiKey}
                                    style={{
                                        borderColor: apiKeyStatus === 'valid' ? 'green' : 
                                        apiKeyStatus === 'invalid' ? 'red' : 'initial'
                                    }}
                                />
                                <button onClick={handleApiKeySave} title="Save API Key">
                                    <span className="settings-icon">
                                        {apiKeyStatus === 'valid' ? '💾' : '💾'}
                                    </span>
                                </button>
                            </>
                        )}
                        <button onClick={ToggleApiOpen} title={apiopen ? "Open API Settings" : "Close API Settings"}>
                            <span className={`settings-icon ${!apiopen ? 'rotate' : ''}`}>
                                {apiopen ? '⚙️' : '✅'}
                            </span>
                        </button>
                    </div>
                    

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