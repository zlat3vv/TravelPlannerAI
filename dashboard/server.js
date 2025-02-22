const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(express.json());  
app.use(cors());

const API_KEY = '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'; // Store this securely and don't expose it to the client

app.post('/create-trip', async (req, res) => {
  const { destination, days } = req.body;

  if (!destination || !days) {
    return res.status(400).json({ error: 'Destination and days are required' });
  }

  try {
    const response = await axios.post('https://api.openai.com/v1/chat/completions', {
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a travel assistant." },
        { role: "user", content: `I am planning a trip to ${destination} for ${days} days. Can you recommend some activities or places to visit?` }
      ]
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    res.json({message: response.data.choices[0].message.content});
  } catch (error) {
    console.error('Error fetching recommendations:', error);
    if (error.response && error.response.status === 429) {
      res.status(429).json({ error: 'Rate limit exceeded. Try again later.' });
    } else {
      res.status(500).json({ error: 'Failed to fetch recommendations' });
    }
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});