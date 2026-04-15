import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Wind, 
  Droplets, 
  Thermometer, 
  Navigation,
  Cloud,
  Sun,
  CloudRain,
  CloudSnow,
  CloudLightning,
  CloudDrizzle,
  Moon,
  AlertTriangle,
  Loader2,
  Activity
} from 'lucide-react';

// --- Utility Functions ---

// Map WMO Weather codes to descriptions and icons
const getWeatherDetails = (code, isDay) => {
  const codes = {
    0: { desc: 'Clear sky', icon: isDay ? Sun : Moon },
    1: { desc: 'Mainly clear', icon: isDay ? Sun : Moon },
    2: { desc: 'Partly cloudy', icon: Cloud },
    3: { desc: 'Overcast', icon: Cloud },
    45: { desc: 'Fog', icon: Wind },
    48: { desc: 'Depositing rime fog', icon: Wind },
    51: { desc: 'Light drizzle', icon: CloudDrizzle },
    53: { desc: 'Moderate drizzle', icon: CloudDrizzle },
    55: { desc: 'Dense drizzle', icon: CloudDrizzle },
    56: { desc: 'Light freezing drizzle', icon: CloudDrizzle },
    57: { desc: 'Dense freezing drizzle', icon: CloudDrizzle },
    61: { desc: 'Slight rain', icon: CloudRain },
    63: { desc: 'Moderate rain', icon: CloudRain },
    65: { desc: 'Heavy rain', icon: CloudRain },
    66: { desc: 'Light freezing rain', icon: CloudRain },
    67: { desc: 'Heavy freezing rain', icon: CloudRain },
    71: { desc: 'Slight snow fall', icon: CloudSnow },
    73: { desc: 'Moderate snow fall', icon: CloudSnow },
    75: { desc: 'Heavy snow fall', icon: CloudSnow },
    77: { desc: 'Snow grains', icon: CloudSnow },
    80: { desc: 'Slight rain showers', icon: CloudRain },
    81: { desc: 'Moderate rain showers', icon: CloudRain },
    82: { desc: 'Violent rain showers', icon: CloudRain },
    85: { desc: 'Slight snow showers', icon: CloudSnow },
    86: { desc: 'Heavy snow showers', icon: CloudSnow },
    95: { desc: 'Thunderstorm', icon: CloudLightning },
    96: { desc: 'Thunderstorm with slight hail', icon: CloudLightning },
    99: { desc: 'Thunderstorm with heavy hail', icon: CloudLightning },
  };
  return codes[code] || { desc: 'Unknown', icon: Cloud };
};

// Calculate AQI category, colors, and health advice based on US EPA scale
const getAqiDetails = (aqi) => {
  if (aqi <= 50) return { label: 'Good', color: 'bg-green-500', text: 'text-green-500', border: 'border-green-500', advice: 'Air quality is satisfactory, and air pollution poses little or no risk.' };
  if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-500', text: 'text-yellow-500', border: 'border-yellow-500', advice: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', text: 'text-orange-500', border: 'border-orange-500', advice: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500', text: 'text-red-500', border: 'border-red-500', advice: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-500', text: 'text-purple-500', border: 'border-purple-500', advice: 'Health alert: The risk of health effects is increased for everyone.' };
  return { label: 'Hazardous', color: 'bg-rose-900', text: 'text-rose-900', border: 'border-rose-900', advice: 'Health warning of emergency conditions: everyone is more likely to be affected.' };
};

// --- Components ---

// Visual meter for the AQI
const AqiMeter = ({ aqi }) => {
  // Clamp AQI to 500 for the visual bar positioning
  const clampedAqi = Math.min(Math.max(aqi, 0), 500);
  const percentage = (clampedAqi / 500) * 100;
  const aqiInfo = getAqiDetails(aqi);

  return (
    <div className="w-full mt-6">
      <div className="flex justify-between items-end mb-2">
        <span className="text-sm font-semibold text-slate-400 uppercase tracking-wider">AQI Scale (US)</span>
        <span className={`text-2xl font-bold ${aqiInfo.text}`}>{aqi}</span>
      </div>
      
      {/* The Gradient Bar */}
      <div className="relative h-4 rounded-full w-full bg-gradient-to-r from-green-500 via-yellow-400 via-orange-500 via-red-500 via-purple-500 to-rose-900 shadow-inner">
        {/* The Indicator Pointer */}
        <div 
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-4 h-6 bg-white border-2 border-slate-900 rounded-sm shadow-md transition-all duration-1000 ease-out z-10"
          style={{ left: `${percentage}%` }}
        ></div>
      </div>
      
      <div className="flex justify-between text-xs text-slate-500 mt-2 font-medium">
        <span>0</span>
        <span>50</span>
        <span>100</span>
        <span>150</span>
        <span>200</span>
        <span>300</span>
        <span>500+</span>
      </div>

      <div className={`mt-4 p-4 rounded-xl border border-slate-700/50 bg-slate-800/50`}>
        <div className="flex items-center gap-2 mb-1">
          <Activity className={`w-5 h-5 ${aqiInfo.text}`} />
          <h4 className={`font-bold ${aqiInfo.text}`}>{aqiInfo.label}</h4>
        </div>
        <p className="text-sm text-slate-300 leading-relaxed">{aqiInfo.advice}</p>
      </div>
    </div>
  );
};

export default function App() {
  const [locationInfo, setLocationInfo] = useState({ name: 'Patna', lat: 25.6022, lon: 85.1194, country: 'India' });
  const [weather, setWeather] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch data from Open-Meteo APIs
  const fetchWeatherData = async (lat, lon, locName) => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Weather
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      
      // 2. Fetch AQI
      const aqiRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`
      );

      if (!weatherRes.ok || !aqiRes.ok) throw new Error("Failed to fetch weather or AQI data");

      const weatherJson = await weatherRes.json();
      const aqiJson = await aqiRes.json();

      setWeather(weatherJson.current);
      setAqiData(aqiJson.current);
      
      // Map daily forecast
      const daily = weatherJson.daily.time.map((time, index) => ({
        time,
        maxTemp: weatherJson.daily.temperature_2m_max[index],
        minTemp: weatherJson.daily.temperature_2m_min[index],
        weatherCode: weatherJson.daily.weather_code[index]
      })).slice(0, 5); // Get next 5 days
      
      setDailyForecast(daily);
      
    } catch (err) {
      setError("Unable to load data. Please try again later.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Search for a city using Open-Meteo Geocoding
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=1&language=en&format=json`);
      const data = await res.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];
        const newLoc = { 
          name: result.name, 
          lat: result.latitude, 
          lon: result.longitude, 
          country: result.country 
        };
        setLocationInfo(newLoc);
        fetchWeatherData(newLoc.lat, newLoc.lon, newLoc.name);
        setSearchQuery('');
      } else {
        setError(`City "${searchQuery}" not found.`);
        setLoading(false);
      }
    } catch (err) {
      setError("Error searching for city.");
      setLoading(false);
    }
  };

  // Get User's Geolocation
  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          
          try {
             // Reverse geocoding (rough approximation using the search API, though open-meteo doesn't have a direct reverse geocoding, we can just use Coordinates as name)
             setLocationInfo({ name: "Current Location", lat, lon, country: "GPS" });
             fetchWeatherData(lat, lon, "Current Location");
          } catch(err) {
             setError("Location accessed, but data fetch failed.");
             setLoading(false);
          }
        },
        (err) => {
          setError("Location access denied or unavailable.");
          setLoading(false);
        }
      );
    } else {
      setError("Geolocation is not supported by your browser.");
    }
  };

  // Initial Load
  useEffect(() => {
    fetchWeatherData(locationInfo.lat, locationInfo.lon, locationInfo.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const WeatherIcon = weather ? getWeatherDetails(weather.weather_code, weather.is_day).icon : Cloud;
  const weatherDesc = weather ? getWeatherDetails(weather.weather_code, weather.is_day).desc : '';

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-blue-500/30">
      
      {/* Navbar / Header */}
      <nav className="border-b border-slate-800 bg-slate-900/50 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-blue-400">
            <CloudLightning className="w-8 h-8" />
            <h1 className="text-xl font-bold tracking-tight text-white">SkyMeter<span className="text-blue-500">.</span></h1>
          </div>

          <form onSubmit={handleSearch} className="flex w-full md:w-auto relative">
            <input
              type="text"
              placeholder="Search city (e.g. London, Tokyo)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-80 bg-slate-800 text-white border border-slate-700 rounded-l-lg py-2 px-4 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <button 
              type="submit" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-r-lg font-medium transition-colors"
            >
              Search
            </button>
            <button 
              type="button"
              onClick={handleGeolocation}
              title="Use my location"
              className="ml-2 bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 p-2.5 rounded-lg transition-colors flex items-center justify-center group"
            >
              <Navigation className="w-5 h-5 group-hover:text-blue-400 transition-colors" />
            </button>
          </form>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        
        {/* Error Message */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg mb-6 flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <p>{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-blue-500 animate-spin mb-4" />
            <p className="text-slate-400 animate-pulse">Gathering atmospheric data...</p>
          </div>
        ) : weather && aqiData ? (
          <div className="space-y-6">
            
            {/* Location Header */}
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-5 h-5 text-blue-400" />
              <h2 className="text-3xl font-bold">{locationInfo.name}</h2>
              {locationInfo.country && <span className="text-slate-400 text-lg font-medium">, {locationInfo.country}</span>}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              
              {/* Left Column: Current Weather */}
              <div className="lg:col-span-1 space-y-6">
                
                {/* Primary Weather Card */}
                <div className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700/50 rounded-3xl p-6 shadow-xl relative overflow-hidden group">
                  {/* Decorative background blur */}
                  <div className="absolute -top-20 -right-20 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl group-hover:bg-blue-500/20 transition-all duration-700"></div>
                  
                  <div className="relative z-10 flex flex-col items-center text-center">
                    <WeatherIcon className="w-24 h-24 text-blue-400 drop-shadow-lg mb-4" strokeWidth={1.5} />
                    <div className="text-6xl font-black tracking-tighter mb-2">
                      {Math.round(weather.temperature_2m)}°
                    </div>
                    <p className="text-xl font-medium text-slate-300 capitalize">{weatherDesc}</p>
                    <p className="text-slate-500 mt-1 text-sm">Feels like {Math.round(weather.apparent_temperature)}°C</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-8 relative z-10 border-t border-slate-700/50 pt-6">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-500/10 rounded-lg">
                        <Droplets className="w-5 h-5 text-blue-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Humidity</p>
                        <p className="font-semibold text-lg">{weather.relative_humidity_2m}%</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-teal-500/10 rounded-lg">
                        <Wind className="w-5 h-5 text-teal-400" />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400 font-medium uppercase tracking-wider">Wind</p>
                        <p className="font-semibold text-lg">{weather.wind_speed_10m} <span className="text-sm text-slate-500">km/h</span></p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* 5-Day Forecast Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-slate-400" />
                    5-Day Forecast
                  </h3>
                  <div className="space-y-4">
                    {dailyForecast.map((day, idx) => {
                      const date = new Date(day.time);
                      const DayIcon = getWeatherDetails(day.weatherCode, 1).icon;
                      return (
                        <div key={idx} className="flex items-center justify-between">
                          <span className="w-12 text-slate-400 font-medium">
                            {idx === 0 ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                          </span>
                          <DayIcon className="w-5 h-5 text-slate-300" />
                          <div className="flex gap-3 text-sm font-medium w-24 justify-end">
                            <span className="text-white">{Math.round(day.maxTemp)}°</span>
                            <span className="text-slate-500">{Math.round(day.minTemp)}°</span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>

              </div>

              {/* Right Column: AQI & Details */}
              <div className="lg:col-span-2 space-y-6">
                
                {/* AQI Meter Card */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 md:p-8 shadow-lg">
                  <h3 className="text-2xl font-bold mb-1">Air Quality Index</h3>
                  <p className="text-slate-400 text-sm mb-6">Real-time air pollution metrics and health advisories.</p>
                  
                  <AqiMeter aqi={aqiData.us_aqi} />

                  {/* Pollutant Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8">
                    <PollutantCard 
                      name="PM2.5" 
                      value={aqiData.pm2_5} 
                      unit="µg/m³" 
                      desc="Fine Particles" 
                      status={aqiData.pm2_5 > 35 ? 'poor' : 'good'} 
                    />
                    <PollutantCard 
                      name="PM10" 
                      value={aqiData.pm10} 
                      unit="µg/m³" 
                      desc="Coarse Particles"
                      status={aqiData.pm10 > 150 ? 'poor' : 'good'} 
                    />
                    <PollutantCard 
                      name="O₃" 
                      value={aqiData.ozone} 
                      unit="µg/m³" 
                      desc="Ozone"
                      status={aqiData.ozone > 100 ? 'poor' : 'good'} 
                    />
                    <PollutantCard 
                      name="NO₂" 
                      value={aqiData.nitrogen_dioxide} 
                      unit="µg/m³" 
                      desc="Nitrogen Dioxide"
                      status={aqiData.nitrogen_dioxide > 100 ? 'poor' : 'good'} 
                    />
                    <PollutantCard 
                      name="SO₂" 
                      value={aqiData.sulphur_dioxide} 
                      unit="µg/m³" 
                      desc="Sulphur Dioxide"
                      status={aqiData.sulphur_dioxide > 75 ? 'poor' : 'good'} 
                    />
                    <PollutantCard 
                      name="CO" 
                      value={aqiData.carbon_monoxide} 
                      unit="µg/m³" 
                      desc="Carbon Monoxide"
                      status={aqiData.carbon_monoxide > 10000 ? 'poor' : 'good'} 
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>
        ) : null}
      </main>
      
      <footer className="border-t border-slate-800 py-6 mt-auto">
        <div className="max-w-6xl mx-auto px-4 text-center text-slate-500 text-sm">
          <p>Data provided seamlessly via <a href="https://open-meteo.com" className="text-blue-400 hover:underline">Open-Meteo API</a>. No API Keys required.</p>
        </div>
      </footer>
    </div>
  );
}

// Small sub-component for pollutants
const PollutantCard = ({ name, value, unit, desc, status }) => (
  <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 flex flex-col hover:bg-slate-800 transition-colors">
    <div className="flex justify-between items-start mb-2">
      <span className="font-bold text-slate-200">{name}</span>
      <div className={`w-2 h-2 rounded-full mt-1 ${status === 'good' ? 'bg-green-500' : 'bg-red-500'}`}></div>
    </div>
    <div className="flex items-baseline gap-1 mb-1">
      <span className="text-2xl font-bold text-white">{value ?? '--'}</span>
      <span className="text-xs text-slate-400">{unit}</span>
    </div>
    <span className="text-xs text-slate-500 truncate" title={desc}>{desc}</span>
  </div>
);
