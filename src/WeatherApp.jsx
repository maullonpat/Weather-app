import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';
import clouds from './assets/cloudy.jpg';
import rain from './assets/heavy_rain.jpg';
import thunderstorm from './assets/thunderstorm.jpg';
import drizzle from './assets/drizzle.jpg';
import snow from './assets/snow.jpg';
import mist from './assets/fog.jpg';
import clear from './assets/clear.jpg';
import heavy_rain from './assets/heavy_rain.jpg';

function WeatherApp() {
  const [data, setData] = useState({});
  const [location, setLocation] = useState('');
  const [background, setBackground] = useState('');

  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${location}&units=metric&appid=59e417ee8ca618acb36c2d7cdda25a97`;
  const defaultLocation = `https://api.openweathermap.org/data/2.5/forecast?q=manila&units=metric&appid=59e417ee8ca618acb36c2d7cdda25a97`;

  //Handles the default location displayed in the app (set to Manila, PH)
  useEffect(() => {
    axios
      .get(defaultLocation)
      .then((response) => {
        setData(response.data);
      })
      .catch((error) => console.error('Error fetching default data:', error));
  }, []);

  //Handles the searching of location

  const searchLocation = (event) => {
    if (event.key === 'Enter') {
      axios.get(url).then((response) => {
        setData(response.data);
        console.log(response.data);
      });
      setLocation('');
    }
  };

  //Handles the dynamic background change for varying weather descriptions
  useEffect(() => {
    if (data.list) {
      switch (data.list[0].weather[0].main) {
        case 'Clouds':
          setBackground(`linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.6)), url(${clouds})`);
          break;
        case 'Rain':
          setBackground(`linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${rain})`);
          break;
        case 'Thunderstorm':
          setBackground(`linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${thunderstorm})`);
          break;
        case 'Drizzle':
          setBackground(`linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${drizzle})`);
          break;
        case 'Snow':
          setBackground(`linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${snow})`);
          break;
        case 'Mist':
          setBackground(`linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${mist})`);
          break;
        case 'Clear':
          setBackground(`linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${clear})`);
          break;
        default:
          setBackground(`linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.5)), url(${heavy_rain})`);
      }
    }
  }, [data]);

  //Function for dynamic icons change for varying weather descriptions (for 3hour forecast)
  const getIcon = (weatherName) => {
    if (data.list) {
      switch (weatherName) {
        case 'Clouds':
          return (
            <i>
              <i className="bi bi-cloud"></i>
            </i>
          );
        case 'Rain':
          return (
            <i>
              <i className="bi bi-cloud-rain-heavy"></i>
            </i>
          );
        case 'Thunderstorm':
          return (
            <i>
              <i className="bi bi-cloud-lightning-rain"></i>
            </i>
          );
        case 'Drizzle':
          return (
            <i>
              <i className="bi bi-cloud-drizzle"></i>
            </i>
          );
        case 'Snow':
          return (
            <i>
              <i className="bi bi-snow3"></i>
            </i>
          );
        case 'Mist':
          return (
            <i>
              <i className="bi bi-water"></i>
            </i>
          );
        case 'Clear':
          return (
            <i>
              <i className="bi bi-circle"></i>
            </i>
          );
        default:
          return (
            <i>
              <i className="bi bi-cloud"></i>
            </i>
          );
      }
    }
  };

  //Handles the conversion of degree angle to wind direction
  const angleToDirection = (angle) => {
    // Normalize the angle to be within [0, 360) degrees
    angle = angle % 360;
    if (angle < 0) {
      angle += 360;
    }

    // Define the 16-point compass directions
    const directions = [
      'N', // 0°
      'NNE', // 22.5°
      'NE', // 45°
      'ENE', // 67.5°
      'E', // 90°
      'ESE', // 112.5°
      'SE', // 135°
      'SSE', // 157.5°
      'S', // 180°
      'SSW', // 202.5°
      'SW', // 225°
      'WSW', // 247.5°
      'W', // 270°
      'WNW', // 292.5°
      'NW', // 315°
      'NNW', // 337.5°
    ];

    const index = Math.round(angle / 22.5) % 16;

    return directions[index];
  };
  //Handles the current Date and Time
  const getFormattedDateTime = (gmtTime) => {
    const now = new Date();
    const date = now.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return { date, time };
  };

  const { date, time } = getFormattedDateTime();

  //Still needs code for converting Unix timestamp to PH timezone
  //for readable 3hour weawther forecast
  const GMTToLocalTime = (gmtTime) => {
    const date = new Date(gmtTime + ' GMT');
    const localDate = date.toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' });
    const localTime = date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });

    return `${localDate} ${localTime}`;
  };

  return (
    <>
      <div className="container-fluid background " style={{ backgroundImage: background }}>
        {/* Main Page design */}
        <div className="dailyForecast px-2 px-md-5">
          {/* Search bar section */}
          <div className="row">
            <div className="col-sm-4 my-4 mx-auto">
              <div className="input-group">
                <input
                  onChange={(event) => setLocation(event.target.value)}
                  onKeyPress={searchLocation}
                  type="text"
                  value={location}
                  className="form-control bg-transparent search-bar text-capitalize input-group fs-5 px-4"
                  placeholder="Enter Location"
                />
                {/* Search Icon/Button */}
                <div className="list-container">
                  <ul className="search">
                    <li className="search-item">{data[0] ? `${data[1].name}, ${data[1].country}` : null}</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Display date and time */}
          <div className="dateToday text-end">
            <h4>
              {date}
              <span> | </span>
              {time}
            </h4>
          </div>
          <div className="container-fluid temp my-2 mt-5">
            {/* City Name */}
            <h4 className="fw-light">{data.city ? `${data.city.name}, ${data.city.country}` : null}</h4>

            {/* Temperature */}
            <h1 className="display-1 fw-bold">{data.list ? `${data.list[0].main.temp.toFixed()}°C` : null}</h1>
          </div>
          {/* Other weather details here eg. humidity wind */}
          <div className="temp">
            <h4 className="fw-light">
              <i className="bi bi-thermometer-half"></i>
              {data.list ? ` Feels Like: ${data.list[0].main.feels_like.toFixed()}°C` : null}
            </h4>
            <h4 className="fw-light">
              <i className="bi bi-droplet"></i>
              {data.list ? ` Humidity: ${data.list[0].main.humidity}%` : null}
            </h4>

            <h4 className="fw-light">
              <i className="bi bi-arrows-collapse"></i>
              {data.list ? ` Pressure: ${data.list[0].main.pressure} hPa` : null}
            </h4>
            <h4 className="fw-light">
              <i className="bi bi-eye"></i>
              {data.list ? ` Visibility: ${data.list[0].visibility / 1000} km` : null}
            </h4>
            <h4 className="fw-light">
              <i className="bi bi-wind"></i>
              {data.list ? ` ${angleToDirection(data.list[0].wind.deg)}, Speed: ${data.list[0].wind.speed} m/s` : null}
            </h4>
          </div>
          <div className="weatherToday mt-4 pt-2">
            {/* weather description*/}
            <h4 className="fw-light text-end text-capitalize">{data.list ? data.list[0].weather[0].main : null}</h4>
            <h1 className="display-1 fw-bold text-end text-capitalize">
              {data.list ? data.list[0].weather[0].description : null}
            </h1>
          </div>
        </div>

        {/* 3 Hour Forecast */}
        <div className="weeklyForecast container-fluid mb-3 px-1 pt-3">
          <div className="weeklyTitle">
            <h4 className="fw-light mb-1 px-2 px-md-5">3 Hour Forecast</h4>
          </div>
          <div className="hourly-scroll d-flex justify-content-evenly gap-2">
            {/* 1st Hour */}
            <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter fs-5">{data.list ? GMTToLocalTime(data.list[0].dt_txt) : null}</h4>
              <h4>{data.list ? getIcon(data.list[0].weather[0].main) : null}</h4>
              <h4 className="fw-lighter text-center">{data.list ? data.list[0].weather[0].description : null}</h4>
              <h3 className="fw-light">{data.list ? `${data.list[0].main.temp.toFixed()}°C` : null}</h3>
              <h4 className="fw-lighter">
                <i className="bi bi-droplet fs-6"></i>
                {data.list ? ` ${data.list[0].main.humidity}%` : null}
              </h4>
            </div>
            {/* 2nd Hour */}
            <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter fs-5">{data.list ? GMTToLocalTime(data.list[1].dt_txt) : null}</h4>
              <h4>{data.list ? getIcon(data.list[1].weather[0].main) : null}</h4>
              <h4 className="fw-lighter text-center">{data.list ? data.list[1].weather[0].description : null}</h4>
              <h3 className="fw-light">{data.list ? `${data.list[1].main.temp.toFixed()}°C` : null}</h3>
              <h4 className="fw-lighter">
                <i className="bi bi-droplet fs-6"></i>
                {data.list ? ` ${data.list[1].main.humidity}%` : null}
              </h4>
            </div>
            {/* 3rd Hour */}
            <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter fs-5">{data.list ? GMTToLocalTime(data.list[2].dt_txt) : null}</h4>
              <h4>{data.list ? getIcon(data.list[2].weather[0].main) : null}</h4>
              <h4 className="fw-lighter text-center">{data.list ? data.list[2].weather[0].description : null}</h4>
              <h3 className="fw-light">{data.list ? `${data.list[2].main.temp.toFixed()}°C` : null}</h3>
              <h4 className="fw-lighter">
                <i className="bi bi-droplet fs-6"></i>
                {data.list ? ` ${data.list[2].main.humidity}%` : null}
              </h4>
            </div>
            {/* 4th Hour */}
            <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter fs-5">{data.list ? GMTToLocalTime(data.list[3].dt_txt) : null}</h4>
              <h4>{data.list ? getIcon(data.list[3].weather[0].main) : null}</h4>
              <h4 className="fw-lighter text-center">{data.list ? data.list[3].weather[0].description : null}</h4>
              <h3 className="fw-light">{data.list ? `${data.list[3].main.temp.toFixed()}°C` : null}</h3>
              <h4 className="fw-lighter">
                <i className="bi bi-droplet fs-6"></i>
                {data.list ? ` ${data.list[3].main.humidity}%` : null}
              </h4>
            </div>
            {/* 5th Hour */}
            <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter fs-5">{data.list ? GMTToLocalTime(data.list[4].dt_txt) : null}</h4>
              <h4>{data.list ? getIcon(data.list[4].weather[0].main) : null}</h4>
              <h4 className="fw-lighter text-center">{data.list ? data.list[4].weather[0].description : null}</h4>
              <h3 className="fw-light">{data.list ? `${data.list[4].main.temp.toFixed()}°C` : null}</h3>
              <h4 className="fw-lighter">
                <i className="bi bi-droplet fs-6"></i>
                {data.list ? ` ${data.list[4].main.humidity}%` : null}
              </h4>
            </div>
            {/* 6th Hour */}
            <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter fs-5">{data.list ? GMTToLocalTime(data.list[5].dt_txt) : null}</h4>
              <h4>{data.list ? getIcon(data.list[5].weather[0].main) : null}</h4>
              <h4 className="fw-lighter text-center">{data.list ? data.list[5].weather[0].description : null}</h4>
              <h3 className="fw-light">{data.list ? `${data.list[5].main.temp.toFixed()}°C` : null}</h3>
              <h4 className="fw-lighter">
                <i className="bi bi-droplet fs-6"></i>
                {data.list ? ` ${data.list[5].main.humidity}%` : null}
              </h4>
            </div>
            {/* 7th Hour */}
            <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter fs-5">{data.list ? GMTToLocalTime(data.list[6].dt_txt) : null}</h4>
              <h4>{data.list ? getIcon(data.list[6].weather[0].main) : null}</h4>
              <h4 className="fw-lighter text-center">{data.list ? data.list[6].weather[0].description : null}</h4>
              <h3 className="fw-light">{data.list ? `${data.list[6].main.temp.toFixed()}°C` : null}</h3>
              <h4 className="fw-lighter">
                <i className="bi bi-droplet fs-6"></i>
                {data.list ? ` ${data.list[6].main.humidity}%` : null}
              </h4>
            </div>
            {/* 8th Hour */}
            <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter fs-5">{data.list ? GMTToLocalTime(data.list[7].dt_txt) : null}</h4>
              <h4>{data.list ? getIcon(data.list[7].weather[0].main) : null}</h4>
              <h4 className="fw-lighter text-center">{data.list ? data.list[7].weather[0].description : null}</h4>
              <h3 className="fw-light">{data.list ? `${data.list[7].main.temp.toFixed()}°C` : null}</h3>
              <h4 className="fw-lighter">
                <i className="bi bi-droplet fs-6"></i>
                {data.list ? ` ${data.list[7].main.humidity}%` : null}
              </h4>
            </div>
            {/* 9th Hour */}
            {/* <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter">8AM</h4>
              <h3>
                <i className="bi bi-cloudy"></i>
              </h3>
              <h3 className="fw-light">{data.list ? `${data.list[0].main.temp.toFixed()}°C` : null}</h3>
              <h4 className="fw-lighter">80%</h4>
            </div> */}
            {/* 10th Hour */}
            {/* <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter">9AM</h4>
              <h3>
                <i className="bi bi-cloudy"></i>
              </h3>
              <h3 className="fw-light">{data.list ? `${data.list[0].main.temp.toFixed()}°C` : null}</h3>
              <h4 className="fw-lighter">80%</h4>
            </div> */}
            {/* 11th Hour */}
            {/* <div className="hourly-container p-1 mb-3 text-center">
              <h4 className="fw-lighter">10AM</h4>
              <h3>
                <i className="bi bi-cloudy"></i>
              </h3>
              <h3 className="fw-light">34°C</h3>
              <h4 className="fw-lighter">80%</h4>
            </div> */}
            {/* 12th Hour */}
          </div>
        </div>
        <p className="text-end fw-lighter text-secondary mb-0">
          made with <i className="bi bi-suit-heart text-danger"></i> by Patrick Maullon
        </p>
      </div>
    </>
  );
}

export default WeatherApp;
