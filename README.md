# ✈️ TravelPlannerAI

> An AI-powered travel planner that generates personalized day-by-day itineraries, hotel recommendations, and real photos — in your language.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![MariaDB](https://img.shields.io/badge/MariaDB-Database-003545?logo=mariadb&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-2.5_Flash-8E75B2?logo=googlegemini&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google-Places%20API-4285F4?logo=googlemaps&logoColor=white)

---

## 📖 Overview

TravelPlannerAI lets authenticated users enter a destination, travel dates, budget, and number of travelers — then instantly generates a structured trip plan powered by **Google Gemini 2.5 Flash**. Each itinerary includes:

- 📅 A **day-by-day schedule** with 3–5 activities per day
- 🏨 **Hotel suggestions** with official website links
- 📸 **Real place photos** fetched from the Google Places API
- 🌐 **Multilingual output** (Bulgarian, English, German, Russian)
- 🌙 **Dark / Light theme** with system preference detection

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🤖 AI Trip Generation | Gemini 2.5 Flash crafts detailed, budget-aware itineraries |
| 🗺️ Google Places Integration | Real photos for every activity and hotel |
| 🔐 Authentication | Secure login & registration with NextAuth + bcrypt |
| 🌍 Internationalization | UI and AI responses in BG, EN, DE, RU |
| 🌙 Dark Mode | Persisted theme preference via localStorage |
| ✅ URL Verification | All generated links are live-checked before display |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **UI** | React 19, Vanilla CSS |
| **Auth** | [NextAuth.js v4](https://next-auth.js.org/) |
| **Database** | MariaDB via raw SQL (`mariadb` driver) |
| **AI** | [Google Gemini](https://ai.google.dev/) |
| **Maps & Photos** | [Google Places API](https://developers.google.com/maps/documentation/places/web-service) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Password Hashing** | bcryptjs |

---

## 📦 Prerequisites

- **Node.js** v18+
- **MariaDB / MySQL** server (XAMPP recommended)
- **Gemini API key** — [Get one from Google AI Studio](https://aistudio.google.com/app/apikey)
- **Google API key** with the **Places API** enabled — [Google Cloud Console](https://console.cloud.google.com/)

---

## ⚙️ Setup & Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/TravelPlannerAI.git
cd TravelPlannerAI
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env` file in the project root:

```env
# Database
DATABASE_URL="mysql://root:@localhost:3306/travelplannerai"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Google Gemini
GEMINI_API_KEY="AIza..."

# Google Places
GOOGLE_API_KEY="AIza..."
```

### 4. Set up the database

Make sure your MariaDB/MySQL server is running, then run the following SQL commands to create the required tables in your `travelplannerai` database:

```sql
CREATE DATABASE IF NOT EXISTS travelplannerai;
USE travelplannerai;

CREATE TABLE users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL
);

CREATE TABLE trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  userId INT NOT NULL,
  destination VARCHAR(255) NOT NULL,
  startDate VARCHAR(50) NOT NULL,
  endDate VARCHAR(50) NOT NULL,
  budget VARCHAR(50) NOT NULL,
  people VARCHAR(50) NOT NULL,
  tripData JSON NOT NULL,
  FOREIGN KEY (userId) REFERENCES users(id) ON DELETE CASCADE
);
```

### 5. Start the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🗂️ Project Structure

```
TravelPlannerAI/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/   # NextAuth route handler
│   │   ├── create-trip/          # AI trip generation endpoint
│   │   └── register/             # User registration endpoint
│   ├── components/
│   │   └── HeaderControls.jsx    # Theme & language toggles
│   ├── contexts/
│   │   ├── ThemeContext.js       # Dark/light mode context
│   │   └── LanguageContext.js    # i18n context
│   ├── create/                   # Trip creation page
│   ├── login/                    # Login page
│   ├── register/                 # Registration page
│   ├── results/                  # Old results directory (deprecated)
│   ├── styles/                   # Page-specific CSS modules
│   ├── trips/                    # Dynamic trip details display page
│   ├── globals.css               # Global CSS variables & base styles
│   ├── layout.js                 # Root layout with providers
│   └── providers.jsx             # SessionProvider wrapper
├── lib/
│   ├── db.js                     # MariaDB connection pool
│   └── translations.js           # UI string translations (BG/EN/DE/RU)
├── public/                       # Static assets
├── .env                          # Environment variables (not committed)
├── next.config.mjs
└── package.json
```

---

## 🌍 Supported Languages

The app UI and AI-generated content both adapt to the selected language:

| Code | Language |
|------|----------|
| `bg` | 🇧🇬 Bulgarian *(default)* |
| `en` | 🇬🇧 English |
| `de` | 🇩🇪 German |
| `ru` | 🇷🇺 Russian |

Language preference is saved in `localStorage` and persisted across sessions.

---

## 🔌 API Routes

### `POST /api/register`
Registers a new user with a hashed password.

**Body:** `{ username, email, password }`

---

### `POST /api/auth/[...nextauth]`
Handles login/logout via NextAuth credentials provider.

---

### `POST /api/create-trip`
Generates a full trip plan. **Requires authentication.**

**Body:**
```json
{
  "destination": "Paris",
  "startDate": "2026-06-01",
  "endDate": "2026-06-05",
  "budget": "moderate",
  "people": "2",
  "language": "en"
}
```

**Response:** A structured JSON object with daily activities, hotel suggestions, verified URLs, and Google Place photos.

---

## 🧩 How It Works

```
User submits trip form
        │
        ▼
  Validate session (NextAuth)
        │
        ▼
  Google Places → resolve destination name
        │
        ▼
  Google Gemini → generate itinerary JSON
        │
        ▼
  Google Places API → fetch photos for each activity & hotel
        │
        ▼
  URL Verifier → HEAD/GET check all generated links
        │
        ▼
  Return enriched trip JSON to client
```

---

## 📝 Scripts

| Command | Description |
|---|---|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Run production build |
| `npm run lint` | Run ESLint |

---

## 🔒 Security Notes

- Passwords are hashed with **bcryptjs** before storage — never stored in plain text.
- All trip generation endpoints are protected — unauthenticated requests receive `401 Unauthorized`.
- Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📄 License

This project is for personal / educational use. See [LICENSE](LICENSE) if applicable.
