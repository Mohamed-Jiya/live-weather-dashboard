console.log("script loaded successfully!");

// Constants - Configuration values for better maintainability
const FORECAST_INTERVAL = 8; // API returns data every 3 hours, 8 intervals = 1 day forecast
const MAX_HISTORY_ITEMS = 10; // Maximum number of cities to store in search history
const GEOLOCATION_TIMEOUT = 5000; // Timeout for getting user location (5 seconds)

// DOM Elements - All element selectors with consistent naming
const searchFormEl = document.querySelector('form');
const searchInputEl = document.querySelector('.search-section-input');
const loaderEl = document.querySelector('#loader');
const errorContainerEl = document.querySelector('#error-container');
const historyContainerEl = document.querySelector("#history-container");
const cityNameEl = document.querySelector('#city-name');
const temperatureEl = document.querySelector('#temperature');
const humidityEl = document.querySelector('#humidity');
const windSpeedEl = document.querySelector('#wind-speed');
const forecastContainerEl = document.querySelector('#forecast-container');

// Display current weather data
function displayCurrentWeather(data){
  const currentDate = new Date().toLocaleDateString();
  cityNameEl.textContent = `${data.name} (${currentDate})`;
  temperatureEl.textContent = `${Math.round(data.main.temp)}`;
  humidityEl.textContent = `${data.main.humidity}`;
  windSpeedEl.textContent = `${data.wind.speed}`;
}

// Display 5-day forecast using the FORECAST_INTERVAL constant
function displayForecast(forecastList){
  // Loop through forecast data, taking every 8th item (daily forecast)
  for(let i = 0; i < forecastList.length; i += FORECAST_INTERVAL){
    const dailyForecast = forecastList[i];
    const card = document.createElement('div');
    card.classList.add('forecast-card');
    
    // Format date display
    const date = new Date(dailyForecast.dt_txt);
    const dateEl = document.createElement('h3');
    dateEl.textContent = date.toLocaleDateString();

    // Weather icon from OpenWeatherMap
    const iconCode = dailyForecast.weather[0].icon;
    const iconURL = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
    const iconEl = document.createElement('img');
    iconEl.setAttribute('src', iconURL);
    iconEl.setAttribute('alt', dailyForecast.weather[0].description);

    // Temperature display (fixed character encoding)
    const tempEl = document.createElement('p');
    tempEl.textContent = `Temp: ${Math.round(dailyForecast.main.temp)}°C`;

    // Humidity display
    const humidityEl = document.createElement('p');
    humidityEl.textContent = `Humidity: ${dailyForecast.main.humidity}%`;

    card.append(dateEl, iconEl, tempEl, humidityEl);
    forecastContainerEl.append(card);
  }
}

// Render search history with delete functionality
function renderHistory(){
  const history = JSON.parse(localStorage.getItem('weatherHistory') || '[]');
  historyContainerEl.innerHTML = ''; // Clear existing history

  for(const city of history){
    const historyBtn = document.createElement('button');
    historyBtn.classList.add('history-btn');
    historyBtn.setAttribute('data-city', city);
    
    // Create button with city name and delete option (fixed × character)
    historyBtn.innerHTML = `
      <span class="city-text">${city}</span>
      <span class="delete-x" data-city="${city}">×</span>
    `;
    
    historyContainerEl.append(historyBtn);
  }
}

// Save city to localStorage with MAX_HISTORY_ITEMS limit
function saveCityToHistory(city){
  const historyString = localStorage.getItem('weatherHistory') || '[]';
  let history = JSON.parse(historyString);
  
  // Remove duplicate if exists (case-insensitive), then add to front
  history = history.filter(existingCity => existingCity.toLowerCase() !== city.toLowerCase());
  history.unshift(city);

  // Maintain maximum history items using constant
  if(history.length > MAX_HISTORY_ITEMS){
    history = history.slice(0, MAX_HISTORY_ITEMS);
  }
  localStorage.setItem('weatherHistory', JSON.stringify(history));
  renderHistory(); // Refresh the display
}

// Convert technical errors to user-friendly messages
function getUserFriendlyError(error) {
  const message = error.message.toLowerCase();
  
  if (message.includes('404') || message.includes('not found')) {
    return 'City not found. Please check the spelling and try again.';
  }
  if (message.includes('network') || message.includes('fetch')) {
    return 'No internet connection. Please check your connection and try again.';
  }
  if (message.includes('timeout')) {
    return 'Request timed out. Please try again.';
  }
  
  // Return original message if no specific match found
  return error.message || 'Something went wrong. Please try again.';
}

// Fetch weather data by city name
async function fetchWeather(city) {
  try{  
    // Reset UI state
    errorContainerEl.classList.add('hidden');
    forecastContainerEl.innerHTML = '';
    loaderEl.classList.remove('hidden');
    
    const response = await fetch(`/api/weather/${city}`);

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred.');
    }

    const { currentWeather, forecast } = await response.json();

    // Display weather data and save to history
    displayCurrentWeather(currentWeather);
    displayForecast(forecast.list);
    saveCityToHistory(currentWeather.name);

  } catch(error){
    console.error('Weather fetch error:', error);
    // Show user-friendly error message
    errorContainerEl.textContent = getUserFriendlyError(error);
    errorContainerEl.classList.remove('hidden');
  } finally{
    // Always hide loader regardless of success/failure
    loaderEl.classList.add('hidden');
  }
}

// Fetch weather data by coordinates (geolocation)
async function fetchWeatherByCoords(lat, lon) {
  try {
    // Reset UI state
    errorContainerEl.classList.add('hidden');
    forecastContainerEl.innerHTML = '';
    loaderEl.classList.remove('hidden');
    
    const url = `/api/weather/coords?lat=${lat}&lon=${lon}`;
    const response = await fetch(url);

    if (!response.ok){
      const errorData = await response.json();
      throw new Error(errorData.error || 'An unknown error occurred.');
    }
    
    const { currentWeather, forecast } = await response.json();

    // Display weather data and save to history
    displayCurrentWeather(currentWeather);
    displayForecast(forecast.list);
    saveCityToHistory(currentWeather.name);

  } catch (error) {
    console.error('Geolocation weather fetch failed:', error);
    // Fail silently for location-based requests to avoid annoying users
  } finally{
    loaderEl.classList.add('hidden');
  }
}

// Delete city from search history
function deleteCity(cityName) {
  try {
    const historyString = localStorage.getItem('weatherHistory') || '[]';
    let history = JSON.parse(historyString);
    
    // Remove the city (case-insensitive comparison)
    history = history.filter(city => city.toLowerCase() !== cityName.toLowerCase());
    
    // Update localStorage and refresh display
    localStorage.setItem('weatherHistory', JSON.stringify(history));
    renderHistory();
    
    console.log(`City "${cityName}" deleted successfully`);
    
  } catch (error) {
    console.error('Error deleting city:', error);
    alert('Failed to delete city. Please try again.');
  }
}

// Event Listeners
searchFormEl.addEventListener('submit', (event) => {
  event.preventDefault();
  const city = searchInputEl.value.trim();

  if (city){
    fetchWeather(city);
    searchInputEl.value = ''; // Clear input after search
  } else{
    console.log('Please enter a city name.');
  }
});

// Handle history button clicks (search city or delete from history)
historyContainerEl.addEventListener('click', (event) => {
  if(event.target.matches('.delete-x')) {
    // Delete city from history
    const city = event.target.dataset.city;
    deleteCity(city);
  } else if(event.target.matches('.history-btn') || event.target.matches('.city-text')) {
    // Search for the selected city
    const cityElement = event.target.matches('.history-btn') ? event.target : event.target.closest('.history-btn');
    const city = cityElement.dataset.city;
    fetchWeather(city);
  }
});

// Initialize: Get user's current location weather (if permitted)
if(navigator.geolocation){
  navigator.geolocation.getCurrentPosition(
    (position) => {
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;
      fetchWeatherByCoords(latitude, longitude);
    },
    (error) => {
      console.log('Location access denied - continuing without geolocation');
    },
    {
      timeout: GEOLOCATION_TIMEOUT, // Use constant for timeout
      enableHighAccuracy: false
    }
  );
}

// Load saved search history when page loads
renderHistory();