document.addEventListener('DOMContentLoaded', async () => {
  const loadingEl = document.getElementById('loading');
  const stockListEl = document.getElementById('stock-list');

  try {
    // 1. Retrieve the API Key from the globally loaded CONFIG object
    let apiKey = window.CONFIG ? window.CONFIG.API_KEY : null;

    // Safety check for brackets if the user left them in the .env file
    if (apiKey && apiKey.startsWith('[') && apiKey.endsWith(']')) {
      apiKey = apiKey.slice(1, -1);
    }

    if (!apiKey) {
      throw new Error('API Key is missing. Please check your .env file.');
    }

    // 2. Fetch data from Alpha Vantage API
    const response = await fetch(`https://www.alphavantage.co/query?function=TOP_GAINERS_LOSERS&apikey=${apiKey}`);

    if (!response.ok) {
      throw new Error(`API Request failed with status: ${response.status}`);
    }

    const data = await response.json();

    if (data.Information) {
      throw new Error(data.Information); // Handle API rate limit or informational messages
    }

    if (!data.top_gainers) {
      throw new Error('Failed to retrieve top gainers from Alpha Vantage.');
    }

    const stocks = data.top_gainers.slice(0, 10).map(item => ({
      symbol: item.ticker,
      name: item.ticker, // Alpha Vantage does not provide company names in this endpoint
      price: `$${parseFloat(item.price).toFixed(2)}`,
      change: parseFloat(item.change_amount) > 0 && !item.change_percentage.startsWith('+') 
                ? `+${item.change_percentage}` 
                : item.change_percentage
    }));

    // 3. Render the UI
    loadingEl.style.display = 'none';

    stocks.forEach(stock => {
      const isPositive = stock.change.startsWith('+');
      const changeClass = isPositive ? 'change-positive' : 'change-negative';

      const item = document.createElement('div');
      item.className = 'stock-item';

      item.innerHTML = `
        <div class="stock-info">
          <span class="stock-symbol">${stock.symbol}</span>
          <span class="stock-name">${stock.name}</span>
        </div>
        <div class="stock-price-info">
          <span class="stock-price">${stock.price}</span>
          <span class="stock-change ${changeClass}">${stock.change}</span>
        </div>
      `;

      stockListEl.appendChild(item);
    });

  } catch (error) {
    loadingEl.style.display = 'none';
    stockListEl.innerHTML = `
      <div class="error-message">
        <strong>Error Loading Stocks</strong><br>
        ${error.message}
      </div>
    `;
    console.error("Extension Error:", error);
  }
});
