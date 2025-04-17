const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.get('/', async (req, res) => {
  const dates = [
    '2021-04-10',
    '2022-04-11',
    '2023-04-12',
    '2024-04-13',
    '2025-04-14'
  ];

  const goldPrices = [];

  for (let date of dates) {
    try {
      const response = await axios.get(`https://www.goldapi.io/api/XAU/USD/${date}`, {
        headers: {
          'x-access-token': 'goldapi-apv72wsm7j0wkez-io',
          'Content-Type': 'application/json'
        }
      });
      // This API doesn’t support historical data via the same endpoint.
      // You’ll get the latest price. (For historical you'd need another endpoint or store data daily.)
      goldPrices.push(response.data.price_gram_18k);
    } catch (error) {
      goldPrices.push(null); // In case of error, push null
    }
  }

  res.render('index', {
    dates,
    goldPrices
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
