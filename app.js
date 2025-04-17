// File: app.js
const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set EJS as templating engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

// Function to fetch gold price data in Moroccan Dirhams
async function fetchGoldPriceData() {
  try {
    // Using the free Metals API
    const response = await axios.get('https://www.goldapi.io/api/XAU/MAD', {
      headers: {
        'x-access-token': 'YOUR_API_KEY_HERE', // Replace with your actual API key
        'Content-Type': 'application/json'
      }
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching gold data:', error);
    return null;
  }
}

// Route for homepage
app.get('/', async (req, res) => {
  try {
    // For demo purposes, we'll create sample data
    // In production, you'd use the fetchGoldPriceData function with your API key
    
    // Sample data for the last 7 days - Prices in Moroccan Dirhams (MAD)
    // Note: 18k gold is typically 75% pure gold, so prices reflect that ratio
    const sampleData = {
      dates: ['2025-04-11', '2025-04-12', '2025-04-13', '2025-04-14', '2025-04-15', '2025-04-16', '2025-04-17'],
      prices: [675, 678, 680, 682, 685, 688, 690] // Example prices in MAD for 18k gold per gram
    };
    
    res.render('inde', { 
      goldData: sampleData,
      currentPrice: sampleData.prices[sampleData.prices.length - 1],
      lastUpdated: new Date().toLocaleString(),
      currency: 'MAD'
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).send('An error occurred while fetching gold price data');
  }
});

app.listen(port, () => {
  console.log(`Gold price app listening at http://localhost:${port}`);
});