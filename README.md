# 🌴🌍 TravelPlannerAI ✈️🗺️

**TravelPlannerAI** is an intelligent, full-stack travel planning application! 🎒 It magically generates personalized travel itineraries and recommendations based on your destination, budget, group size, and travel dates using the power of **OpenAI's GPT-4** 🧠 and the **Google Maps Places API** 📍.

## ✨ Features
- **🔒 User Authentication:** Secure registration and login system built with PHP and MySQL.
- **🪄 Smart Recommendations:** Leverages OpenAI to draft personalized day-by-day itineraries and hotel suggestions. 🏨
- **🎯 Location Auto-complete:** Integrated Google Maps API to assist users in selecting accurate city destinations flawlessly.
- **💅 Modern UI/UX:** Sleek light mode design with glassmorphism 🧊, fluid micro-animations ✨, and vibrant gradients 🌅.
- **📱 Responsive Design:** Completely optimized for both desktop and mobile viewing.

## 🛠 Tech Stack
- **🎨 Frontend:** HTML, CSS, JavaScript, Bootstrap
- **🔐 Authentication/Session:** PHP
- **⚙️ Backend API:** Node.js, Express.js, Axios
- **🗄️ Database:** MySQL
- **🤖 APIs:** OpenAI API, Google Maps API

## 🚀 Setup & Installation

### 📋 Prerequisites
1. 🟩 [Node.js](https://nodejs.org/en/) installed on your system.
2. 🗃️ [XAMPP](https://www.apachefriends.org/index.html) (or an equivalent local PHP/MySQL server).
3. 📦 npm package manager.

### 1️⃣ Database Setup
1. Launch **XAMPP** and start **Apache** 🌐 and **MySQL** 🗄️.
2. Open your web browser and navigate to `http://localhost/phpmyadmin/`.
3. Create a new database named `loginsystem` 🪪.
4. Import the provided `loginsystem.sql` file (located in the root of this project) into the `loginsystem` database.

### 2️⃣ Environment Variables 🔐
You need configuration for the backend Node server to securely communicate with the APIs.
1. Create a `.env` file in the root directory (if it hasn't been created already).
2. Insert your secret API Keys:
```env
OPENAI_API_KEY=your_openai_api_key_here
GOOGLE_API_KEY=your_google_maps_api_key_here
```

*(📝 Note: There is also a Google Maps API script tag located inside `dashboard/create.php` that requires a client-side Google API Key for the location autocomplete feature!)*

### 3️⃣ Start the Backend API 🖥️
The Node server processes the HTTP requests to OpenAI. Open your terminal at the root of the project:
```bash
# 📦 Install dependencies
npm install

# 🚀 Start the Node.js server
npm run dev
# or
npm start
```
The server will boot up and listen on **port 3000**! 🎧

### 4️⃣ Start the Application 🛫
Assuming your folder is placed in `C:/xampp/htdocs/TravelPlannerAI` (or the equivalent specific `www` path of your system):
- 🌍 Navigate your browser to: `http://localhost/TravelPlannerAI/`
- 📝 Register for an account and enjoy creating your custom itineraries! 🎉

## 🤝 Contributing
Feel free to fork the repository 🍴 and submit pull requests 📥 if you want to contribute to the code! Happy building! 💻✨
