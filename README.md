# ✈️ TravelPlannerAI

> An AI-powered travel planner that generates personalized day-by-day itineraries, hotel recommendations, and real photos — in your language.

![Next.js](https://img.shields.io/badge/Next.js-16.2-black?logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?logo=prisma&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-Database-4479A1?logo=mysql&logoColor=white)
![OpenAI](https://img.shields.io/badge/OpenAI-GPT--4-412991?logo=openai&logoColor=white)
![Google Maps](https://img.shields.io/badge/Google-Places%20API-4285F4?logo=googlemaps&logoColor=white)

---

## 📖 Overview

TravelPlannerAI lets authenticated users enter a destination, travel dates, budget, and number of travelers — then instantly generates a structured trip plan powered by **GPT-4 Turbo**. Each itinerary includes:

- 📅 A **day-by-day schedule** with 3–5 activities per day
- 🏨 **Hotel suggestions** with official website links
- 📸 **Real place photos** fetched from the Google Places API
- 🌐 **Multilingual output** (Bulgarian, English, German, Russian)
- 🌙 **Dark / Light theme** with system preference detection

---

## 🚀 Features

| Feature | Description |
|---|---|
| 🤖 AI Trip Generation | GPT-4 Turbo crafts detailed, budget-aware itineraries |
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
| **Database** | MySQL via [Prisma ORM](https://www.prisma.io/) |
| **AI** | [OpenAI GPT-4 Turbo](https://platform.openai.com/docs/) |
| **Maps & Photos** | [Google Places API](https://developers.google.com/maps/documentation/places/web-service) |
| **HTTP Client** | [Axios](https://axios-http.com/) |
| **Password Hashing** | bcryptjs |

---

## 📦 Prerequisites

- **Node.js** v18+
- **MySQL** server (XAMPP recommended)
- **OpenAI API key** — [Get one here](https://platform.openai.com/api-keys)
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

# OpenAI
OPENAI_API_KEY="sk-..."

# Google Places
GOOGLE_API_KEY="AIza..."
```

### 4. Set up the database

Make sure your MySQL server is running, then run:

```bash
npx prisma db push
```

This will create the `users` table automatically from the Prisma schema.

### 5. Generate the Prisma client

```bash
npx prisma generate
```

> **Note:** This also runs automatically after `npm install` via the `postinstall` script.

### 6. Start the development server

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
│   ├── results/                  # Trip results display page
│   ├── styles/                   # Page-specific CSS modules
│   ├── globals.css               # Global CSS variables & base styles
│   ├── layout.js                 # Root layout with providers
│   └── providers.jsx             # SessionProvider wrapper
├── lib/
│   └── translations.js           # UI string translations (BG/EN/DE/RU)
├── prisma/
│   └── schema.prisma             # Database schema (User model)
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
  "budget": "medium",
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
  OpenAI GPT-4 Turbo → generate itinerary JSON
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
| `npx prisma studio` | Open Prisma visual database browser |

---

## 🔒 Security Notes

- Passwords are hashed with **bcryptjs** before storage — never stored in plain text.
- All trip generation endpoints are protected — unauthenticated requests receive `401 Unauthorized`.
- Never commit your `.env` file. It is already listed in `.gitignore`.

---

## 📄 License

This project is for personal / educational use. See [LICENSE](LICENSE) if applicable.
