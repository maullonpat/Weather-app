import React, { useState } from 'react';
import './App.css';

function WeatherApp() {
  const [city, setCity] = useState('');
  const [weatherData, setWeatherData] = useState(null);
  const [error, setError] = useState(false);
  const [backgroundImage, setBackgroundImage] = useState('');

  const APIKey = '59e417ee8ca618acb36c2d7cdda25a97';

  const handleSearch = () => {
    if (!city) return;

    fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${APIKey}`)
      .then((response) => response.json())
      .then((data) => {
        if (data.cod === '404') {
          setError(true);
          setWeatherData(null);
        } else {
          setError(false);
          setWeatherData(data);

          // Set background image based on weather description
          switch (data.weather[0].main) {
            case 'Clear':
              setBackgroundImage('url(/assets/clear.jpg)');
              break;
            case 'Rain':
              setBackgroundImage('url(/assets/rain.jpg)');
              break;
            case 'Snow':
              setBackgroundImage('url(/assets/snow.jpg)');
              break;
            case 'Clouds':
              setBackgroundImage('url(/assets/clouds.jpg)');
              break;
            case 'Haze':
              setBackgroundImage('url(/assets/haze.jpg)');
              break;
            default:
              setBackgroundImage('url(/assets/default.jpg)');
          }
        }
      })
      .catch(() => setError(true));
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Helper function to format date and time
  const getFormattedDateTime = () => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    return { date, time };
  };

  const { date, time } = getFormattedDateTime();

  return (
    <div className="container-fluid" style={{ backgroundImage: setBackgroundImage }}>
      <div className="dailyForecast">
        <div className="row">
          <div className="col-sm-6 my-4 mx-4">
            <div className="input-group">
              <input
                type="text"
                className="form-control bg-transparent search-bar text-capitalize input-group"
                placeholder="City/State"
                aria-label="City"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                onKeyPress={handleKeyPress}
              />
              <div className="input-group-append">
                <button className="btn btn-outline-secondary" type="button" onClick={handleSearch}>
                  <i className="fa-solid fa-magnifying-glass" />
                </button>
              </div>
            </div>
          </div>
        </div>
        <div className="dateToday text-end">
          <h3>{date}</h3>
          <h3>{time}</h3>
        </div>
        {error ? (
          <div className="error text-center">
            <p>Oops! Invalid location :/</p>
          </div>
        ) : (
          weatherData && (
            <>
              <div className="temp text-end">
                <h1>{parseInt(weatherData.main.temp)}°C</h1>
                <h4>
                  {weatherData.wind.deg > 0 ? 'North' : 'South'}, {parseInt(weatherData.wind.speed)}km/h
                </h4>
              </div>
              <div className="weatherToday d-flex flex-row-reverse">
                <h1 className="mb-0 display-1">{weatherData.weather[0].description}</h1>
              </div>
              <div className="weatherDetails text-end">
                <h4>Humidity: {weatherData.main.humidity}%</h4>
              </div>
            </>
          )
        )}
      </div>
    </div>
  );
}

export default WeatherApp;
