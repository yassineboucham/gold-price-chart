const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Helper function to get dates for different periods
function getDatesForPeriod(period) {
  const dates = [];
  const now = new Date();
  
  if (period === 'day') {
    for (let i = 0; i < 24; i++) {
      const date = new Date(now);
      date.setHours(date.getHours() - i);
      dates.unshift(date.toISOString().split('T')[0] + ' ' + date.toISOString().split('T')[1].substring(0, 5));
    }
  } else if (period === 'month') {
    for (let i = 0; i < 30; i++) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      dates.unshift(date.toISOString().split('T')[0]);
    }
  } else if (period === 'year') {
    for (let i = 0; i < 12; i++) {
      const date = new Date(now);
      date.setMonth(date.getMonth() - i);
      const monthYear = date.toLocaleString('default', { month: 'short', year: 'numeric' });
      dates.unshift(monthYear);
    }
  }
  
  return dates;
}

app.get('/', async (req, res) => {
  try {
    const period = req.query.period || 'day'; // Default to day view
    const dates = getDatesForPeriod(period);
    const goldPrices = [];

    // For demo purposes, generate some sample data
    const basePrice = 45.5; // Base price for 18K gold in USD per gram
    
    for (let i = 0; i < dates.length; i++) {
      try {
        const response = await axios.get(`https://www.goldapi.io/api/XAU/USD`, {
          headers: {
            'x-access-token': 'goldapi-apv72wsm7j0wkez-io',
            'Content-Type': 'application/json'
          }
        });
        goldPrices.push(response.data.price_gram_18k);
      } catch (error) {
        // If API call fails, generate random price variation
        const randomVariation = (Math.random() * 2 - 1) * 2; // Random value between -2 and 2
        goldPrices.push((basePrice + randomVariation + (i * 0.1)).toFixed(2));
      }
    }

    // Get current price for display
    const currentPrice = goldPrices[goldPrices.length - 1];
    const lastUpdated = new Date().toLocaleString();

    res.render('index', {
      dates,
      goldPrices,
      currentPrice,
      lastUpdated,
      period
    });
  } catch (error) {
    console.error('Error rendering chart:', error);
    res.status(500).send('Error generating chart data');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});