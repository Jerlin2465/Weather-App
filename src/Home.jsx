import React, { useState, useRef, useEffect } from "react";
import { FaSearch } from "react-icons/fa";

import sun from "./assets/sun.png";
import rain from "./assets/rain.png";
import cloud from "./assets/cloud.webp";

import humiditE from "./assets/humiditE.png";
import wind from "./assets/wind.png";

const Home = () => {
  const [weather, setWeather] = useState("");
  const [icon, setIcon] = useState(sun);
  const [bgClass, setBgClass] = useState("");
  const [loading, setLoading] = useState(false);
  const ref = useRef("");

  const search = async (city) => {
    if (!city) return;

    setLoading(true);

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const res = await fetch(url);
      const data = await res.json();

      if (!res.ok) throw new Error("City not found");

      setWeather({
        temperature: Math.floor(data.main.temp),
        wind: data.wind.speed,
        humidity: data.main.humidity,
        location: data.name,
        country: data.sys.country,
        condition: data.weather[0].main,
      });

      handleWeatherUI(data.weather[0].main);
    } catch (err) {
      setWeather(null);
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleWeatherUI = (condition) => {
    if (condition.includes("Cloud")) {
      setIcon(cloud);
      setBgClass("cloudy");
    } else if (condition.includes("Rain")) {
      setIcon(rain);
      setBgClass("rainy");
    } else {
      setIcon(sun);
      setBgClass("sunny");
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;

        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
        const res = await fetch(url);
        const data = await res.json();

        setWeather({
          temperature: Math.floor(data.main.temp),
          wind: data.wind.speed,
          humidity: data.main.humidity,
          location: data.name,
          country: data.sys.country,
          condition: data.weather[0].main,
        });

        handleWeatherUI(data.weather[0].main);
      });
    }
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      search(ref.current.value);
    }
  };

  return (
    <div className={`app-container ${bgClass}`}>
      <div className="main-div">
        <div className="search-container">
          <input
            className="in-button"
            placeholder="Search City..."
            ref={ref}
            onKeyDown={handleKeyDown}
          />
          <button
            className="search-button"
            onClick={() => search(ref.current.value)}
          >
            <FaSearch />
          </button>
        </div>

        {loading && <p className="status">Loading...</p>}

        {weather && (
          <>
            <img src={icon} alt="weather" className="img-main animate" />

            <div className="text-container">
              <p className="degree">{weather.temperature}°C</p>
              <p className="city">{weather.location}</p>
              <p className="country">{weather.country}</p>
            </div>

            <div className="speed-container">
              <div className="info-box">
                <img src={humiditE} className="img-2" />
                <p>{weather.humidity}%</p>
                <span>Humidity</span>
              </div>

              <div className="info-box">
                <img src={wind} className="img-3" />
                <p>{weather.wind} km/h</p>
                <span>Wind</span>
              </div>
            </div>
          </>
        )}

        <div className="copy-right">Design by Jerry</div>
      </div>
    </div>
  );
};

export default Home;
