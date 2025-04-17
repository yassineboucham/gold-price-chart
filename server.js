const express = require('express');
const axios = require('axios');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Replace with your real API key from https://www.goldapi.io/
const GOLD_API_KEY = 'YOUR_API_KEY_HERE';

app.get('/', async (req, res) => {
  try {
    const startDate = new Date('2000-01-01');
    const today = new Date();
    const dateArray = [];

    // Generate a list of monthly dates from 2000-01-01 to now
    while (startDate <= today) {
      const formatted = `${startDate.getFullYear()}-${String(startDate.getMonth() + 1).padStart(2, '0')}-01`;
      dateArray.push(formatted);
      startDate.setMonth(startDate.getMonth() + 1);
    }

    const usdToMad = 10; // Simulated MAD conversion rate
    const history = [];

    // Fetch price for each month (simulated data because goldapi.io does not support historical bulk fetch)
    for (let i = 0; i < dateArray.length; i++) {
      // Simulate fluctuation using sine wave
      const fakeOunceUSD = 1200 + 200 * Math.sin(i / 12);
      const gramPrice24KUSD = fakeOunceUSD / 31.1035;
      const gramPrice18KUSD = (18 / 24) * gramPrice24KUSD;
      const priceMAD = gramPrice18KUSD * usdToMad;

      history.push({
        date: dateArray[i],
        madPrice: priceMAD.toFixed(2)
      });
    }

    res.render('index', { history });
  } catch (error) {
    console.error(error.message);
    res.send('Error fetching gold price');
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
