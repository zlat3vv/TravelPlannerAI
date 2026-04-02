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

async function getPlacePhoto(placeName, nearCity) {
    try {
        const searchRes = await axios.get('https://maps.googleapis.com/maps/api/place/textsearch/json', {
            params: { query: `${placeName} ${nearCity}`, key: GOOGLE_API_KEY }
        });
        const results = searchRes.data.results;
        if (!results || results.length === 0) return null;
        const photos = results[0].photos;
        if (!photos || photos.length === 0) return null;
        const photoRef = photos[0].photo_reference;
        return `https://maps.googleapis.com/maps/api/place/photo?maxwidth=800&photoreference=${photoRef}&key=${GOOGLE_API_KEY}`;
    } catch (e) {
        return null;
    }
}

async function verifyUrl(url) {
    if (!url || !url.startsWith('http')) return null;
    try {
        await axios.head(url, { timeout: 5000, maxRedirects: 5 });
        return url;
    } catch {
        try {
            await axios.get(url, { timeout: 5000, maxRedirects: 5 });
            return url;
        } catch {
            return null;
        }
    }
}

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
            params: { query: destination, key: GOOGLE_API_KEY }
        });
        if (!googlePlaceResponse.data.results || googlePlaceResponse.data.results.length === 0) {
            return res.status(404).json({ error: 'Could not find the destination.', googleStatus: googlePlaceResponse.data.status });
        }

        const placeName = googlePlaceResponse.data.results[0].name;

        const prompt = `You are a travel assistant. Return ONLY valid JSON (no markdown, no code fences).

Plan a trip to ${placeName}. Dates: ${startDate} to ${endDate} (${days} days). Budget: "${budget}". Travelers: ${people}.

Return this exact JSON structure:
{
  "destination": "${placeName}",
  "days": [
    {
      "day": 1,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "name": "Place or activity name in Bulgarian",
          "description": "Short description in Bulgarian (1-2 sentences)",
          "url": "https://..."
        }
      ]
    }
  ],
  "hotels": [
    {
      "name": "Hotel name",
      "description": "Short description in Bulgarian (1-2 sentences)",
      "url": "https://..."
    }
  ]
}

Rules:
- All descriptions must be in Bulgarian
- Include exactly ${days} day objects
- Include 3-5 activities per day
- Include 3 hotel suggestions
- For activity URLs: use ONLY the official website of the attraction (e.g. the museum's own site, national park site, etc.). Never use Google Maps, TripAdvisor, Wikipedia, or redirect links.
- For hotel URLs: use ONLY the hotel's own official website (e.g. https://www.hotelname.com). Never use Booking.com, Hotels.com, Expedia, or aggregator links.
- Every URL must be a real, currently live website that you are certain exists. If you are not 100% sure the URL works, use null instead of guessing.
- Return ONLY the JSON object, nothing else`;

        const openAIResponse = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4-turbo',
            messages: [
                { role: "system", content: "You are a travel assistant. Always respond with valid JSON only." },
                { role: "user", content: prompt }
            ],
            response_format: { type: "json_object" }
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${OPENAI_API_KEY}`
            }
        });

        const rawJson = openAIResponse.data.choices[0].message.content;
        const tripData = JSON.parse(rawJson);

        const tasks = [];

        for (const day of tripData.days) {
            for (const activity of day.activities) {
                tasks.push(
                    getPlacePhoto(activity.name, placeName).then(url => { activity.photo = url; })
                );
                tasks.push(
                    verifyUrl(activity.url).then(url => { activity.url = url; })
                );
            }
        }

        for (const hotel of tripData.hotels) {
            tasks.push(
                getPlacePhoto(hotel.name, placeName).then(url => { hotel.photo = url; })
            );
            tasks.push(
                verifyUrl(hotel.url).then(url => { hotel.url = url; })
            );
        }

        await Promise.all(tasks);

        res.json(tripData);

    } catch (error) {
        console.error('Error:', error.response?.data || error.message);
        if (error.response) {
            return res.status(error.response.status || 500).json({ error: error.response.data || 'External API error' });
        }
        res.status(500).json({ error: 'An unexpected error occurred.' });
    }
});

const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
