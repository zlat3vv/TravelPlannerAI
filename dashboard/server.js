import express from 'express';
import axios from 'axios';
import cors from 'cors';

const app = express();
app.use(express.json());
app.use(cors());

const OPENAI_API_KEY = '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';
const GOOGLE_API_KEY = 'AIzaSyC3YUQokfrVjE2ClcMwgRgiWJxspyCCYcM';

app.post('/create', async (req, res) => {
    const { destination, startDate, endDate, budget, people } = req.body;

    try {
        // Проверка дали началната дата е преди крайната
        const start = new Date(startDate);
        const end = new Date(endDate);
        const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;

        if (days < 1) {
            return res.status(400).json({ error: 'End date must be after start date.' });
        }

        // Извличане на информация за дестинацията чрез Google Places API
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
        const location = placeDetails.geometry.location;
        const placeName = placeDetails.name;
        const formattedAddress = placeDetails.formatted_address;

        // Съставяне на съобщението за OpenAI API
        const message = `I am planning a trip to ${placeName} (${formattedAddress}), located at lat: ${location.lat}, long: ${location.lng}.
        The trip starts on ${startDate} and ends on ${endDate}, lasting ${days} days. The budget category is "${budget}", and I will be traveling with ${people}. 
        Please provide:
        1. Recommendations for activities and places to visit, organized by day (${days} days total).
        2. Suggestions for hotels near ${placeName}, suitable for the "${budget}" budget. Include hotel names and brief descriptions. Separate the days and hotels in a list. Give the days and hotels <strong> tags.
        Format it with separate paragraphs, not one long`;

        // Изпращане на заявката към OpenAI API
        const openAIResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4',
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

        // Изпращане на препоръките обратно към клиента
        const recommendations = openAIResponse.data.choices[0].message.content;
        res.json({ message: recommendations });

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
