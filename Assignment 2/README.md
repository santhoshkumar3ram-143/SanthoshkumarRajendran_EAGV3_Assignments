# Market Top Gainers & Losers Extension

A Google Chrome extension that displays the top 10 daily gainers/losers in the stock market using real-time data from the Alpha Vantage API.

## Features

- **Real-Time Data**: Fetches the latest stock data directly from Alpha Vantage.
- **Clean UI**: Beautiful, minimalistic popup interface displaying top stock performances.
- **Visual Indicators**: Color-coded prices based on positive or negative change percentages.

## Installation

1. Clone or download this repository to your local machine.
2. Ensure you have your `config.js` or `.env` configured with your Alpha Vantage API key:
   ```javascript
   // Example config.js
   window.CONFIG = {
       API_KEY: "YOUR_ALPHA_VANTAGE_API_KEY"
   };
   ```
3. Open Google Chrome and navigate to `chrome://extensions/`.
4. Enable **"Developer mode"** in the top right corner.
5. Click **"Load unpacked"** and select the folder containing this extension (`Assignment 2`).

## API Key Setup

This extension relies on the [Alpha Vantage API](https://www.alphavantage.co/). 
You will need to get a free API key from their website and place it in your configuration file.

## Technologies Used

- HTML, CSS, JavaScript (Vanilla)
- Alpha Vantage API (REST)
- Chrome Extensions API Manifest V3
