import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import axios from 'axios';

function WeatherApp() {
  const [temperature, setTemperature] = useState(null);
  const [city, setCity] = useState('');
  const [weather, setWeather] = useState('');
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    if (city) {
      axios.get(`/api/weather/${city}`)
        .then(response => {
          setTemperature(response.data.main.temp);
          setWeather(response.data.weather[0].main);
        })
        .catch(error => console.log(error));
    }
  }, [city]);

  useEffect(() => {
    const intervalId = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(intervalId);
  }, []);

  let emoji;
  let isDaytime;
  if (weather === 'Clear') {
    if (time.getHours() >= 6 && time.getHours() < 18) {
      emoji = '☀️';
      isDaytime = true;
    } else {
      emoji = '🌙';
      isDaytime = false;
    }
  } else if (weather === 'Clouds') {
    emoji = '☁️';
    isDaytime = true;
  } else if (weather === 'Rain') {
    emoji = '🌧️';
    isDaytime = true;
  } else if (weather === 'Snow') {
    if (temperature < 0) {
      emoji = '❄️🥶';
    } else {
      emoji = '❄️';
    }
    isDaytime = true;
  }

  function handleSearch(event) {
    event.preventDefault();
    const city = event.target.elements.city.value;
    setCity(city);
  }

  return (
    <div className={`container${isDaytime ? '' : ' night'}`}>
      <h1>Weather App</h1>
      <Form onSubmit={handleSearch}>
        <Form.Group controlId="city">
          <Form.Label>Enter a city:</Form.Label>
          <Form.Control type="text" placeholder="e.g. London, Paris" />
        </Form.Group>
        <Button variant="primary" type="submit">
          Search
        </Button>
      </Form>
      {temperature && (
        <>
          <p>{emoji} Current temperature: {temperature}°C</p>
          <p>{emoji === '🌧️' ? 'Bring an umbrella!' : null}</p>
        </>
      )}
      {!temperature && <p>Please enter a city to see the current temperature.</p>}
    </div>
  );
}

export default WeatherApp;
