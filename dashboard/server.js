import express from 'express';
import axios from 'axios';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;

app.post('/create', async (req, res) => {
    const { destination, startDate, endDate, budget, people } = req.body;
    try {
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (days < 1) {
            return res.status(400).json({ error: 'End date must be after start date.' });
        }
        const googlePlaceResponse = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: {
                query: destination,
                key: GOOGLE_API_KEY
            }
        });
        if (!googlePlaceResponse.data.results || googlePlaceResponse.data.results.length === 0) {
            return res.status(404).json({ error: 'Could not find the destination.' });
        }

        const placeDetails = googlePlaceResponse.data.results[0];
        const placeName = placeDetails.name;
        const message = `I am planning a trip to ${placeName}. The trip starts on ${startDate} and ends on ${endDate}, lasting ${days} days. The budget category is "${budget}", and I will be traveling with ${people}. 
        Please provide:
        1. Recommendations for activities and places to visit, organized by day (${days} days total). Give working links for attractions. Add for the link a href tag.
        2. Suggestions for hotels near ${placeName}, suitable for the "${budget}" budget. Include hotel names and brief descriptions. Give the working  hotels link with a href tag. Give the days and hotels <strong> tags, instead of **. Add before every day and hotel name <br> tag, dont forget them. Връщаш отговор на български.`;

        const openAIResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4-turbo',
            messages: [
                { role: "system", content: "You are a travel assistant." },
                { role: "user", content: message }
            ]
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        const recommendations = openAIResponse.data.choices[0].message.content;
        res.json({ message: recommendations });
        console.log(openAIResponse);

    } catch (error) {
        console.error('Error during the API calls:', error);
        if (error.response) {
            return res.status(error.response.status || 500).json({ error: error.response.data || 'Error in external API call' });
        }
        res.status(500).json({ error: 'An unexpected error occurred while processing the request.' });
    }
});
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
