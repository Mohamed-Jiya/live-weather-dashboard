require('dotenv').config();
const express = require('express');
const https = require('https');

// Constants for better maintainability
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';
const DEFAULT_UNITS = 'metric';
const REQUEST_TIMEOUT = 10000; // 10 seconds timeout for API requests
const PORT = process.env.PORT || 3000;

// Critical: Validate environment variables at startup
if (!process.env.API_KEY) {
  console.error('❌ FATAL ERROR: API_KEY environment variable is required!');
  console.error('Please add your OpenWeatherMap API key to your .env file');
  process.exit(1); // Stop server if no API key
}

const app = express();
app.use(express.static('public'));

// Validate coordinate ranges (latitude: -90 to 90, longitude: -180 to 180)
function isValidCoordinate(lat, lon) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lon);
  return !isNaN(latitude) && !isNaN(longitude) && 
         latitude >= -90 && latitude <= 90 && 
         longitude >= -180 && longitude <= 180;
}

// Convert technical API errors to user-friendly messages
function getErrorMessage(error) {
  const message = error.message.toLowerCase();
  
  if (message.includes('404') || message.includes('not found')) {
    return 'City not found. Please check the spelling.';
  }
  if (message.includes('401') || message.includes('unauthorized')) {
    return 'Weather service authentication failed.';
  }
  if (message.includes('timeout')) {
    return 'Weather service request timed out. Please try again.';
  }
  if (message.includes('network') || message.includes('enotfound')) {
    return 'Unable to connect to weather service.';
  }
  
  return 'Weather service temporarily unavailable. Please try again.';
}

// Helper function to make HTTPS requests to OpenWeatherMap API with timeout
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const request = https.get(url, (response) => {
      let data = '';
      
      // Collect response data chunks
      response.on('data', (chunk) => {
        data += chunk;
      });
      
      // Process complete response
      response.on('end', () => {
        if (response.statusCode === 200) {
          try {
            const jsonData = JSON.parse(data);
            resolve(jsonData);
          } catch (error) {
            reject(new Error('Invalid JSON response from weather API'));
          }
        } else {
          reject(new Error(`Weather API returned status ${response.statusCode}: ${data}`));
        }
      });
    }).on('error', (error) => {
      reject(error);
    });

    // Add timeout to prevent hanging requests
    request.setTimeout(REQUEST_TIMEOUT, () => {
      request.destroy();
      reject(new Error('Request timeout - weather service took too long to respond'));
    });
  });
}

// API route: Get weather data by city name
app.get('/api/weather/:city', async (req, res) => {
  try {
    const { city } = req.params;
    const API_KEY = process.env.API_KEY;

    console.log('Weather request for city:', city);

    // Validate city name input
    if (!city || city.trim().length === 0) {
      return res.status(400).json({ error: 'City name is required and cannot be empty.' });
    }

    // Sanitize city name (remove extra spaces, limit length)
    const sanitizedCity = city.trim();
    if (sanitizedCity.length > 100) {
      return res.status(400).json({ error: 'City name is too long.' });
    }

    // Build API URLs using constants
    const currentWeatherUrl = `${API_BASE_URL}/weather?q=${encodeURIComponent(sanitizedCity)}&appid=${API_KEY}&units=${DEFAULT_UNITS}`;
    const forecastUrl = `${API_BASE_URL}/forecast?q=${encodeURIComponent(sanitizedCity)}&appid=${API_KEY}&units=${DEFAULT_UNITS}`;

    console.log('Fetching weather data from OpenWeatherMap API...');

    // Make parallel requests to both endpoints for faster response
    const [currentWeather, forecast] = await Promise.all([
      makeRequest(currentWeatherUrl),
      makeRequest(forecastUrl)
    ]);

    console.log('✅ Successfully fetched weather data for:', currentWeather.name);

    res.json({ currentWeather, forecast });
  } catch (error) {
    console.error('❌ Error fetching weather data:', error.message);
    // Send user-friendly error message
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// API route: Get weather data by coordinates (for geolocation)
app.get('/api/weather/coords', async (req, res) => {
  try {
    const { lat, lon } = req.query;
    const API_KEY = process.env.API_KEY;

    console.log('Weather request for coordinates:', { lat, lon });

    // Validate coordinates presence and format
    if (!lat || !lon) {
      console.log('❌ Missing coordinates in request');
      return res.status(400).json({ error: 'Latitude and longitude are required.' });
    }

    // Validate coordinate ranges
    if (!isValidCoordinate(lat, lon)) {
      console.log('❌ Invalid coordinate values:', { lat, lon });
      return res.status(400).json({ 
        error: 'Invalid coordinates. Latitude must be -90 to 90, longitude must be -180 to 180.' 
      });
    }

    // Build API URLs using coordinates and constants
    const currentWeatherUrl = `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${DEFAULT_UNITS}`;
    const forecastUrl = `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=${DEFAULT_UNITS}`;

    console.log('Fetching weather data from OpenWeatherMap API...');

    // Make parallel requests for better performance
    const [currentWeather, forecast] = await Promise.all([
      makeRequest(currentWeatherUrl),
      makeRequest(forecastUrl)
    ]);

    console.log('✅ Successfully fetched weather data for:', currentWeather.name);

    res.json({ currentWeather, forecast });
  } catch (error) {
    console.error('❌ Error fetching weather data by coordinates:', error.message);
    // Send user-friendly error message
    res.status(500).json({ error: getErrorMessage(error) });
  }
});

// Start the server with enhanced logging
app.listen(PORT, () => {
  console.log('🌤️  Weather Dashboard Server Successfully Started!');
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📡 API endpoints:`);
  console.log(`   • GET /api/weather/:city - Get weather by city name`);
  console.log(`   • GET /api/weather/coords?lat=&lon= - Get weather by coordinates`);
  console.log('✅ Ready to serve weather data!');
});