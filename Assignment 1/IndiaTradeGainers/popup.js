document.addEventListener('DOMContentLoaded', () => {
  const refreshBtn = document.getElementById('refresh-btn');
  const loadingEl = document.getElementById('loading');
  const errorEl = document.getElementById('error-message');
  const stockListEl = document.getElementById('stock-list');
  const listHeaderEl = document.getElementById('list-header');

  const fetchStocks = async () => {
    // UI state: loading
    refreshBtn.classList.add('spinning');
    loadingEl.classList.remove('hidden');
    errorEl.classList.add('hidden');
    stockListEl.classList.add('hidden');
    listHeaderEl.classList.add('hidden');
    stockListEl.innerHTML = '';

    try {
      const response = await fetch('https://scanner.tradingview.com/india/scan', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "filter": [
            { "left": "exchange", "operation": "equal", "right": "NSE" },
            { "left": "type", "operation": "equal", "right": "stock" },
            { "left": "close", "operation": "nempty" }
          ],
          "options": { "lang": "en" },
          "markets": ["india"],
          "symbols": { "query": { "types": [] }, "tickers": [] },
          "columns": ["name", "description", "close", "change"],
          "sort": { "sortBy": "change", "sortOrder": "desc" },
          "range": [0, 10]
        })
      });

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();
      renderStocks(data.data);
    } catch (error) {
      console.error("Failed to fetch stock data:", error);
      errorEl.textContent = 'Failed to load stock data. Please check your connection or try again.';
      errorEl.classList.remove('hidden');
    } finally {
      loadingEl.classList.add('hidden');
      refreshBtn.classList.remove('spinning');
    }
  };

  const renderStocks = (stocks) => {
    if (!stocks || stocks.length === 0) {
      errorEl.textContent = 'No data available at the moment.';
      errorEl.classList.remove('hidden');
      return;
    }

    stocks.forEach((stock, index) => {
      // TradingView format: stock.d = ["RELIANCE", "RELIANCE INDUSTRIES LTD", 2400.50, 2.5]
      const [symbol, description, price, change] = stock.d;
      
      const li = document.createElement('li');
      li.className = 'stock-item';
      // Staggered animation
      li.style.animationDelay = `${index * 0.05}s`;

      const formattedPrice = new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR'
      }).format(price).replace('₹', '');

      const isPositive = change >= 0;
      const changePrefix = isPositive ? '+' : '';
      
      const pillClass = isPositive ? 'change-pill' : 'change-pill negative';

      li.innerHTML = `
        <div class="item-symbol">
          <span class="symbol-name">${symbol}</span>
          <span class="symbol-desc">${description}</span>
        </div>
        <div class="item-price">₹${formattedPrice}</div>
        <div class="item-change">
          <span class="${pillClass}" ${!isPositive ? 'style="color:#ff4444; background: rgba(255,68,68,0.1);"' : ''}>
            ${changePrefix}${change.toFixed(2)}%
          </span>
        </div>
      `;
      stockListEl.appendChild(li);
    });

    listHeaderEl.classList.remove('hidden');
    stockListEl.classList.remove('hidden');
  };

  refreshBtn.addEventListener('click', fetchStocks);

  // Initial fetch
  fetchStocks();
});
