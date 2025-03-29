import React, { useEffect,useRef,useState} from 'react'
import './Weather.css'

import search_icon from '../assets/search.png'
import clear_icon from '../assets/clear.png'
import cloud_icon from '../assets/cloud.png'
import drizzle_icon from '../assets/drizzle.png'
import rain_icon from '../assets/rain.png'
import snow_icon from '../assets/snow.png'
import wind_icon from '../assets/wind.png'
import humidity_icon from '../assets/humidity.png'
import refresh_icon from '../assets/refresh.png'
const Weather = () => {

  const inputRef=useRef()
  const [weatherData,setWeatherData]=useState(false);
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light');

  const [currentCity, setCurrentCity] = useState("Delhi");

  const [loading, setLoading] = useState(false);
  const allIcons={
    "01d":clear_icon,
    "01n":clear_icon,
    "02d":cloud_icon,
    "02n":cloud_icon,
    "03d":cloud_icon,
    "03n":cloud_icon,
    "04d":drizzle_icon,
    "04n":drizzle_icon,
    "09d":rain_icon,
    "09n":rain_icon,
    "10d":rain_icon,
    "10n":rain_icon,
    "13d":snow_icon,
    "13n":snow_icon,
  }
  const search=async(city)=>{
    if(city===""){
      alert("Enter The City Name");
      return;
    }
    try{
      setLoading(true);
      setCurrentCity(city);
      const url=`https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response=await fetch(url);
      const data=await response.json();
      if(!response.ok){
        alert(data.message);
        return;
      }
      console.log(data); 
      const icon=allIcons[data.weather[0].icon]|| icon_icon;
      setWeatherData({
        humidity:data.main.humidity,
        windSpeed:data.wind.speed,
        temperature: Math.floor(data.main.temp),
        location:data.name,
        icon:icon
      })
    }catch(error){
      setWeatherData(false);
      console.error("Error in fetching weather data");
    }finally {
      setLoading(false);
    }
  }
  useEffect(()=>{
    search("Delhi");
  },[])

  useEffect(() => {
    document.body.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  return (
    <div className={`weather ${theme}`}>
      <button className="theme-toggle" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
        {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
      </button>
      
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img src={search_icon} alt="Search" onClick={() => search(inputRef.current.value)} />
        <img src={refresh_icon} alt="Refresh" className="refresh-button" onClick={() => search(currentCity)} />
      </div>
      {loading?(
        <div className="loading">loading...</div>):(
          weatherData&&(<>
        <img src={weatherData.icon} alt="" className="weather-icon"/> 
      <p className='temprature'>{weatherData.temperature}°C</p>
      <p className='location'>{weatherData.location}</p>
      <div className="weather-data">
      <div className="col">
        <img src={humidity_icon}/>
        <div>
      <p>{weatherData.humidity} %</p>
      <span>Humidity</span>
      </div>
    <div className="col">
        <img src={wind_icon}/>
        <div>
      <p>{weatherData.windSpeed} Km/h</p>
      <span>Wind Speed</span>
      </div>
      </div>
      </div>
      </div>
      </>))}
      </div>
  );
};

export default Weather
