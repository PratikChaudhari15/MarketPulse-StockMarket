const stockInput = document.getElementById('stock-input');
const searchBtn = document.getElementById('search-btn');
const stockName = document.getElementById('stock-name');
const stockPrice = document.getElementById('stock-price');
const stockChange = document.getElementById('stock-change');
const stockChart = document.getElementById('stock-chart').getContext('2d');

document.getElementById('currentYear').textContent = new Date().getFullYear();

let chart;

const API_KEY = 'T4VO7ZV66B8NAWFM'; //this is key T4VO7ZV66B8NAWFM if key is limit 25 limit excedded and use demo word   // Replace with your actual API key from Alpha Vantage

async function fetchStockData(symbol) {
  try {
    const url = `https://www.alphavantage.co/query?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${API_KEY}`;
    const response = await fetch(url);
    const data = await response.json();

    if (data['Time Series (Daily)']) {
      updateUI(symbol, data['Time Series (Daily)']);
    } else {
      alert('Stock not found! Please check the symbol and try again.');
    }
  } catch (error) {
    console.error('Error fetching stock data:', error);
    alert('Failed to fetch stock data. Please try again later.');
  }
}

function updateUI(symbol, timeSeries) {
  const dates = Object.keys(timeSeries).slice(0, 15);
  const prices = dates.map(date => parseFloat(timeSeries[date]['4. close']));

  const latestPrice = prices[0];
  const previousPrice = prices[1];
  const changePercent = (((latestPrice - previousPrice) / previousPrice) * 100).toFixed(2);

  // ⬇️ Chart container animation
  const chartContainer = document.getElementById('chart-container');

  // Show it if hidden (first-time render)
  if (!chartContainer.classList.contains('fade-in')) {
    chartContainer.style.display = 'block';
  }

  // Reset + trigger animation
  chartContainer.classList.remove('fade-in');
  void chartContainer.offsetWidth; // force reflow
  chartContainer.classList.add('fade-in');

  // Update stock details
  stockName.textContent = symbol.toUpperCase();
  stockPrice.textContent = `Price: $${latestPrice.toFixed(2)}`;
  stockChange.textContent = `Change: ${changePercent}%`;

  // Update alert label
  document.getElementById('alert-stock-symbol').textContent =
    `Setting alert for: ${symbol.toUpperCase()}`;

  // Alert trigger
  if (targetAlertPrice && latestPrice >= targetAlertPrice) {
    alert(`📈 ${symbol.toUpperCase()} has reached your target price of $${targetAlertPrice.toFixed(2)}!`);
    targetAlertPrice = null;
    alertMessage.textContent = '';
    alertPriceInput.value = '';
  }

  // Update the chart
  updateChart(dates.reverse(), prices.reverse());
}

function updateChart(dates, prices) {
  if (chart) {
    chart.destroy();
  }

  const isDark = document.body.classList.contains('dark');

  chart = new Chart(stockChart, {
    type: 'line',
    data: {
      labels: dates,
      datasets: [
        {
          label: 'Stock Price (USD)',
          data: prices,
          backgroundColor: isDark ? 'rgba(255, 255, 255, 0.1)' : 'rgba(130, 92, 255, 0.2)',
          borderColor: isDark ? '#ffffff' : '#825CFF',
          borderWidth: 3,
          tension: 0.4,
          pointRadius: 5,
          pointBackgroundColor: isDark ? '#1e1e2f' : '#ffffff',
          pointBorderColor: isDark ? '#fff' : '#825CFF',
          pointHoverRadius: 8,
          pointHoverBackgroundColor: isDark ? '#ffffff' : '#6b4ae8',
        },
      ],
    },
    options: {
      responsive: true,
      animation: {
        duration: 2000,
        easing: 'easeInOutCubic',
      },
      plugins: {
        legend: {
          display: true,
          position: 'top',
          labels: {
            color: isDark ? '#fff' : '#333',
            font: {
              size: 14,
            },
          },
        },
        tooltip: {
          enabled: true,
          backgroundColor: isDark ? '#333' : '#825CFF',
          titleColor: '#fff',
          bodyColor: '#fff',
          cornerRadius: 5,
        },
      },
      scales: {
        x: {
          grid: {
            color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
          },
          ticks: {
            color: isDark ? '#fff' : '#333',
          },
        },
        y: {
          grid: {
            color: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(130, 92, 255, 0.1)',
          },
          ticks: {
            color: isDark ? '#fff' : '#333',
          },
        },
      },
    },
  });
}

const alertPriceInput = document.getElementById('alert-price');
const setAlertBtn = document.getElementById('set-alert-btn');
const alertMessage = document.getElementById('alert-message');

let targetAlertPrice = null;

setAlertBtn.addEventListener('click', () => {
  const value = parseFloat(alertPriceInput.value.trim());
  if (!isNaN(value) && value > 0) {
    targetAlertPrice = value;
    alertMessage.textContent = `🔔 Alert set at $${targetAlertPrice.toFixed(2)}`;
  } else {
    alertMessage.textContent = `❌ Please enter a valid price`;
  }
});

const clearAlertBtn = document.getElementById('clear-alert-btn');

clearAlertBtn.addEventListener('click', () => {
  targetAlertPrice = null;
  alertMessage.textContent = '🔕 Alert cleared.';
  alertPriceInput.value = '';
});


searchBtn.addEventListener('click', () => {
  const symbol = stockInput.value.trim();
  if (symbol) {
    fetchStockData(symbol);
  } else {
    alert('Please enter a stock symbol!');
  }
});

const addToWatchlistBtn = document.getElementById('add-to-watchlist-btn');
const watchlistContainer = document.getElementById('watchlist');

// Load watchlist from localStorage
function loadWatchlist() {
  const watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  renderWatchlist(watchlist);
}

// Render watchlist items
function renderWatchlist(watchlist) {
  watchlistContainer.innerHTML = '';
  watchlist.forEach(symbol => {
    const li = document.createElement('li');
    li.innerHTML = `<span>${symbol}</span> <button class="remove-btn" data-symbol="${symbol}">Remove</button>`;
    watchlistContainer.appendChild(li);
  });
}

// Add to watchlist
addToWatchlistBtn.addEventListener('click', () => {
  const symbol = stockInput.value.trim().toUpperCase();
  if (!symbol) return;

  let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
  if (!watchlist.includes(symbol)) {
    watchlist.push(symbol);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    renderWatchlist(watchlist);
  }
});

// Remove from watchlist
watchlistContainer.addEventListener('click', (e) => {
  if (e.target.classList.contains('remove-btn')) {
    const symbolToRemove = e.target.dataset.symbol;
    let watchlist = JSON.parse(localStorage.getItem('watchlist')) || [];
    watchlist = watchlist.filter(sym => sym !== symbolToRemove);
    localStorage.setItem('watchlist', JSON.stringify(watchlist));
    renderWatchlist(watchlist);
  }
});

// Load on page load
window.addEventListener('DOMContentLoaded', loadWatchlist);


const themeToggle = document.getElementById('theme-toggle');

// Check and apply stored theme on page load
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark');
  themeToggle.textContent = '☀️';
}

themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark');
  const isDark = document.body.classList.contains('dark');
  themeToggle.textContent = isDark ? '☀️' : '🌙';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});
// Refresh chart with current data if available
if (chart && stockInput.value.trim()) {
  fetchStockData(stockInput.value.trim());
}
