# 📊 MarketPulse – Live Stock Tracker

MarketPulse is a simple, responsive, and interactive stock tracking web application built with **HTML, CSS, and JavaScript**. It allows users to search for U.S. stock prices in real-time, view line charts, add stocks to a watchlist, and set custom price alerts.

---

## 🚀 Features

- 🔍 **Real-Time Stock Search** – Search and track U.S. stock symbols (like AAPL, MSFT, TSLA).
- 📈 **Dynamic Chart** – View stock price history on a responsive chart (using Chart.js).
- 🌗 **Light/Dark Mode** – Toggle between light and dark themes with a single click.
- ⭐ **Watchlist** – Add your favorite stocks to a watchlist stored in `localStorage`.
- 🔔 **Price Alert** – Set target price alerts. Get notified when the stock crosses your set price.
- ✅ **Responsive Design** – Fully mobile-friendly and works across modern browsers.

---

## 🛠️ Built With

- **HTML5** – Structure
- **CSS3** – Styling
- **JavaScript (Vanilla)** – Functionality
- **Chart.js** – Chart rendering
- **Alpha Vantage API** – Stock market data

## 🧠 How It Works

- 🔎 **User enters a stock symbol** → App fetches data using the **Alpha Vantage API**
- 📊 **Real-time update** → Stock name, current price, percentage change, and price chart are updated instantly
- ⭐ **Add to Watchlist** → Users can save stocks to a watchlist (stored in `localStorage`)
- 🔔 **Set Price Alert** → Users get a UI notification when the stock crosses their target price
