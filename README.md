
# 🌤️ Live Weather Dashboard

A real-time weather application that provides current weather information and forecasts for any city worldwide.

![Weather Dashboard](https://img.shields.io/badge/Status-Active-brightgreen) 
![Node.js](https://img.shields.io/badge/Node.js-v22.18.0-green) 
![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ Features

- 🔍 **Search weather by city name** - Get weather for any city worldwide
- 📍 **Auto-detect location weather** - Automatically fetch weather for your current location
- 📊 **5-day weather forecast** - Plan ahead with detailed forecasts
- 📱 **Responsive design** - Works perfectly on desktop, tablet, and mobile
- 🕒 **Real-time data** - Always up-to-date weather information from OpenWeatherMap API
- 💾 **Search history** - Keep track of previously searched cities with delete option
- 🎨 **Clean UI** - Modern, intuitive user interface

## 🛠️ Technologies Used

- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript (ES6+)
  - LocalStorage for search history

- **Backend:**
  - Node.js
  - Express.js
  - OpenWeatherMap API

- **Dependencies:**
  - `express` - Web framework for Node.js
  - `dotenv` - Environment variables management
  - `cors` - Cross-Origin Resource Sharing

## 🚀 Installation & Setup

### Prerequisites
- Node.js (v14.0.0 or higher)
- npm (Node Package Manager)
- OpenWeatherMap API key

### Step 1: Clone the Repository
```bash
git clone https://github.com/Mohamed-Jiya/live-weather-dashboard.git
cd live-weather-dashboard
```

### Step 2: Install Dependencies
```bash
npm install
```

### Step 3: Get API Key
1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Generate your API key

### Step 4: Environment Setup
Create a `.env` file in the root directory:
```bash
OPENWEATHER_API_KEY=your_api_key_here
PORT=3000
```

### Step 5: Start the Server
```bash
node server.js
```
or
```bash
npm start
```

### Step 6: Access the Application
Open your browser and navigate to: `http://localhost:3000`

## 📁 Project Structure

```
live-weather-dashboard/
├── Public/                 # Frontend files
│   ├── index.html         # Main HTML file
│   ├── script.js          # JavaScript functionality
│   └── style.css          # CSS styles
├── server.js              # Node.js/Express server
├── package.json           # Project dependencies
├── package-lock.json      # Dependency lock file
├── .env                   # Environment variables (create this)
├── .gitignore            # Git ignore rules
└── README.md             # Project documentation
```

## 🔧 API Endpoints

### Weather by City
```
GET /api/weather/:city
```
**Example:** `GET /api/weather/London`

**Response:**
```json
{
  "cod": "200",
  "message": "city found",
  "weather": {
    "temperature": "15°C",
    "description": "Partly cloudy",
    "humidity": "65%",
    "windSpeed": "12 km/h"
  }
}
```

### Weather by Coordinates
```
GET /api/weather/coords?lat={latitude}&lon={longitude}
```
**Example:** `GET /api/weather/coords?lat=51.5074&lon=0.1278`

## 🎯 Usage

1. **Search by City Name:**
   - Enter city name in the search box
   - Click search or press Enter
   - View current weather and 5-day forecast

2. **Auto Location Detection:**
   - Click the location button
   - Allow location access when prompted
   - Weather data will load for your current location

3. **Search History:**
   - Previously searched cities appear in the sidebar
   - Click any city to quickly view its weather again
   - Use delete button to remove cities from history


## 🤝 Contributing

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🐛 Known Issues

- API rate limiting may occur with excessive requests
- Location detection requires HTTPS in production
- Some older browsers may not support all ES6 features

## 📋 Future Enhancements

- [ ] Weather alerts and notifications
- [ ] Multiple language support
- [ ] Dark/Light theme toggle
- [ ] Weather maps integration
- [ ] Hourly weather forecast
- [ ] Weather widget for embedding

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Mohamed Jiya**
- GitHub: [@Mohamed-Jiya](https://github.com/Mohamed-Jiya)
- LinkedIn: [@Mohamed Jiya baig](www.linkedin.com/in/mohamed-jiya-baig)

## 🙏 Acknowledgments

- [OpenWeatherMap](https://openweathermap.org/) for weather API
- [Express.js](https://expressjs.com/) for web framework
- Icons from (https://openweathermap.org/)

## 📞 Support

If you encounter any issues or have questions:

1. Check the [Issues](https://github.com/Mohamed-Jiya/live-weather-dashboard/issues) page
2. Create a new issue if your problem isn't listed
3. Provide detailed information about the problem
   
## 📱 Screenshot


<img width="1360" height="768" alt="app" src="https://github.com/user-attachments/assets/fa150cc4-6cbc-452b-b92c-89d81ae50f17" />






⭐ **Don't forget to give this project a star if you found it helpful!**
