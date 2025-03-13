import React, { useEffect, useState } from 'react';

export function Equipment() {
  const [exchangeRates, setExchangeRates] = useState(null); // Initialize to null
  const [baseCurrency, setBaseCurrency] = useState('USD'); // Selected currency
  const [priceInSelectedCurrency, setPriceInSelectedCurrency] = useState(100); // Example product price in USD

  useEffect(() => {
    // Fetch exchange rates from the backend
    fetch('/api/exchange-rates')
      .then((response) => {
        console.log('Raw response:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        console.log('Fetched exchange rates:', data.rates);
        setExchangeRates(data.rates); // Save exchange rates
      })
      .catch((error) => {
        console.error('Error fetching exchange rates:', error);
      });
  }, []);

  // Function to convert price to the selected currency
  const convertPrice = (priceInUSD) => {
    if (exchangeRates && exchangeRates[baseCurrency]) {
      return (priceInUSD * exchangeRates[baseCurrency]).toFixed(2);
    }
    return priceInUSD.toFixed(2); // Default to USD if rates aren't available
  };

  return (
    <div>
      <h2>Product Prices in Multiple Currencies</h2>

      {/* Show loading message or dropdown */}
      {!exchangeRates ? (
        <p>Loading currencies...</p>
      ) : (
        <div>
          <label htmlFor="currency-select">Select a currency:</label>
          <select
            id="currency-select"
            value={baseCurrency}
            onChange={(e) => setBaseCurrency(e.target.value)}
          >
            {Object.keys(exchangeRates).map((currency) => (
              <option key={currency} value={currency}>
                {currency}
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Display the product price */}
      <div>
        <p>
          Product Price: {convertPrice(priceInSelectedCurrency)} {baseCurrency}
        </p>
      </div>
    </div>
  );
}
