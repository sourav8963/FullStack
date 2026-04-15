import React, { useState, useEffect, useRef } from 'react';
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
  Activity,
  ChevronRight,
  Info
} from 'lucide-react';

// --- Utility Functions ---

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

const getAqiDetails = (aqi) => {
  if (aqi <= 50) return { label: 'Good', color: 'bg-emerald-500', text: 'text-emerald-400', border: 'border-emerald-500', shadow: 'shadow-emerald-500/20', advice: 'Air quality is satisfactory, and air pollution poses little or no risk.' };
  if (aqi <= 100) return { label: 'Moderate', color: 'bg-yellow-400', text: 'text-yellow-400', border: 'border-yellow-400', shadow: 'shadow-yellow-400/20', advice: 'Air quality is acceptable. However, there may be a risk for some people, particularly those who are unusually sensitive to air pollution.' };
  if (aqi <= 150) return { label: 'Unhealthy for Sensitive Groups', color: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500', shadow: 'shadow-orange-500/20', advice: 'Members of sensitive groups may experience health effects. The general public is less likely to be affected.' };
  if (aqi <= 200) return { label: 'Unhealthy', color: 'bg-red-500', text: 'text-red-400', border: 'border-red-500', shadow: 'shadow-red-500/20', advice: 'Some members of the general public may experience health effects; members of sensitive groups may experience more serious health effects.' };
  if (aqi <= 300) return { label: 'Very Unhealthy', color: 'bg-purple-500', text: 'text-purple-400', border: 'border-purple-500', shadow: 'shadow-purple-500/20', advice: 'Health alert: The risk of health effects is increased for everyone.' };
  return { label: 'Hazardous', color: 'bg-rose-600', text: 'text-rose-500', border: 'border-rose-600', shadow: 'shadow-rose-600/20', advice: 'Health warning of emergency conditions: everyone is more likely to be affected.' };
};

// --- Components ---

const AqiMeter = ({ aqi }) => {
  const clampedAqi = Math.min(Math.max(aqi, 0), 500);
  const percentage = (clampedAqi / 500) * 100;
  const aqiInfo = getAqiDetails(aqi);

  return (
    <div className="w-full flex flex-col h-full justify-between">
      <div>
        <div className="flex justify-between items-start mb-6">
          <div>
            <h3 className="text-lg font-medium text-slate-300 flex items-center gap-2">
              <Activity className="w-5 h-5 text-slate-400" />
              Air Quality Index
            </h3>
            <p className="text-sm text-slate-500 mt-1">US EPA Standard</p>
          </div>
          <div className={`px-4 py-2 rounded-2xl bg-white/5 border border-white/10 flex items-center gap-3 backdrop-blur-sm shadow-lg ${aqiInfo.shadow}`}>
            <span className={`text-3xl font-bold ${aqiInfo.text} tracking-tight`}>{aqi}</span>
            <div className="h-8 w-px bg-white/10"></div>
            <span className={`text-sm font-semibold uppercase tracking-wider ${aqiInfo.text}`}>{aqiInfo.label}</span>
          </div>
        </div>
        
        {/* Modern Stepped Gradient Bar */}
        <div className="relative h-3 rounded-full w-full bg-gradient-to-r from-emerald-500 via-yellow-400 via-orange-500 via-red-500 via-purple-500 to-rose-600 shadow-inner mt-8">
          <div 
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-5 h-5 bg-white border-[3px] border-slate-900 rounded-full shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-1000 ease-out z-10"
            style={{ left: `${percentage}%` }}
          ></div>
        </div>
        
        <div className="flex justify-between text-[10px] text-slate-500 mt-3 font-bold px-1">
          <span>0</span>
          <span>50</span>
          <span>100</span>
          <span>150</span>
          <span>200</span>
          <span>300</span>
          <span>500+</span>
        </div>
      </div>

      <div className={`mt-8 p-4 rounded-2xl bg-gradient-to-br from-white/[0.03] to-transparent border border-white/[0.05] flex items-start gap-3`}>
        <Info className={`w-5 h-5 mt-0.5 shrink-0 ${aqiInfo.text}`} />
        <p className="text-sm text-slate-400 leading-relaxed">{aqiInfo.advice}</p>
      </div>
    </div>
  );
};

const PollutantCard = ({ name, value, unit, desc, status }) => (
  <div className="bg-white/[0.02] hover:bg-white/[0.04] border border-white/[0.05] rounded-2xl p-4 flex flex-col transition-all duration-300 group">
    <div className="flex justify-between items-start mb-3">
      <span className="font-semibold text-slate-300 group-hover:text-white transition-colors">{name}</span>
      <div className={`w-2 h-2 rounded-full mt-1.5 shadow-lg ${status === 'good' ? 'bg-emerald-500 shadow-emerald-500/50' : 'bg-red-500 shadow-red-500/50'}`}></div>
    </div>
    <div className="flex items-baseline gap-1 mt-auto">
      <span className="text-2xl font-bold text-white tracking-tight">{value ?? '--'}</span>
      <span className="text-xs text-slate-500 font-medium">{unit}</span>
    </div>
    <span className="text-xs text-slate-500 truncate mt-1 group-hover:text-slate-400 transition-colors" title={desc}>{desc}</span>
  </div>
);

export default function App() {
  const [locationInfo, setLocationInfo] = useState({ name: 'Patna', lat: 25.6022, lon: 85.1194, country: 'India' });
  const [weather, setWeather] = useState(null);
  const [aqiData, setAqiData] = useState(null);
  const [dailyForecast, setDailyForecast] = useState([]);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch Autocomplete Suggestions (Debounced)
  useEffect(() => {
    // Skip fetching if the query exactly matches the current location (prevents re-opening after selection)
    if (searchQuery === locationInfo.name) return;

    const fetchSuggestions = async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }
      try {
        // Using Open-Meteo geocoding here because it naturally ranks by population ("most famous")
        const res = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(searchQuery)}&count=10&language=en&format=json`);
        const data = await res.json();
        
        if (data.results) {
          // Filter strictly for India and take top 5 famous results
          const indianResults = data.results.filter(r => r.country_code === 'IN').slice(0, 5);
          setSuggestions(indianResults);
          setShowSuggestions(true);
        } else {
          setSuggestions([]);
        }
      } catch (err) {
        console.error("Autocomplete error:", err);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300); // 300ms debounce
    return () => clearTimeout(timeoutId);
  }, [searchQuery, locationInfo.name]);

  const fetchWeatherData = async (lat, lon, locName) => {
    setLoading(true);
    setError(null);
    try {
      const weatherRes = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,weather_code,wind_speed_10m&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`
      );
      
      const aqiRes = await fetch(
        `https://air-quality-api.open-meteo.com/v1/air-quality?latitude=${lat}&longitude=${lon}&current=us_aqi,pm10,pm2_5,carbon_monoxide,nitrogen_dioxide,sulphur_dioxide,ozone&timezone=auto`
      );

      if (!weatherRes.ok || !aqiRes.ok) throw new Error("Failed to fetch weather or AQI data");

      const weatherJson = await weatherRes.json();
      const aqiJson = await aqiRes.json();

      setWeather(weatherJson.current);
      setAqiData(aqiJson.current);
      
      const daily = weatherJson.daily.time.map((time, index) => ({
        time,
        maxTemp: weatherJson.daily.temperature_2m_max[index],
        minTemp: weatherJson.daily.temperature_2m_min[index],
        weatherCode: weatherJson.daily.weather_code[index]
      })).slice(0, 6); 
      
      setDailyForecast(daily);
      
    } catch (err) {
      setError("Unable to load atmospheric data. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    const newLoc = { 
      name: suggestion.name, 
      lat: suggestion.latitude, 
      lon: suggestion.longitude, 
      country: 'India' 
    };
    setLocationInfo(newLoc);
    setSearchQuery(suggestion.name);
    setShowSuggestions(false);
    fetchWeatherData(newLoc.lat, newLoc.lon, newLoc.name);
  };

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    
    setShowSuggestions(false);
    setLoading(true);
    setError(null);
    try {
      // Using OpenStreetMap (Nominatim) API for high-granularity Indian locations
      const res = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(searchQuery)}&countrycodes=in&format=json&limit=1`);
      const data = await res.json();

      if (data && data.length > 0) {
        const result = data[0];
        // Extract the most relevant short name from the OSM display name
        const shortName = result.display_name.split(',')[0];
        
        const newLoc = { 
          name: shortName, 
          lat: parseFloat(result.lat), 
          lon: parseFloat(result.lon), 
          country: 'India' 
        };
        setLocationInfo(newLoc);
        fetchWeatherData(newLoc.lat, newLoc.lon, newLoc.name);
        setSearchQuery('');
      } else {
        setError(`Location "${searchQuery}" could not be found in India.`);
        setLoading(false);
      }
    } catch (err) {
      setError("Network error while searching for location.");
      setLoading(false);
    }
  };

  const handleGeolocation = () => {
    if ("geolocation" in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const lat = position.coords.latitude;
          const lon = position.coords.longitude;
          try {
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

  useEffect(() => {
    fetchWeatherData(locationInfo.lat, locationInfo.lon, locationInfo.name);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const WeatherIcon = weather ? getWeatherDetails(weather.weather_code, weather.is_day).icon : Cloud;
  const weatherDesc = weather ? getWeatherDetails(weather.weather_code, weather.is_day).desc : '';
  const isDayTheme = weather?.is_day === 1;

  return (
    <div className={`min-h-screen transition-colors duration-1000 ease-in-out ${isDayTheme ? 'bg-[#0f172a]' : 'bg-[#020617]'} text-slate-100 font-sans selection:bg-blue-500/30 overflow-x-hidden relative`}>
      
      {/* Dynamic Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden">
        <div className={`absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full blur-[120px] opacity-20 ${isDayTheme ? 'bg-blue-400' : 'bg-indigo-600'}`}></div>
        <div className={`absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full blur-[150px] opacity-20 ${isDayTheme ? 'bg-teal-400' : 'bg-purple-800'}`}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03] mix-blend-overlay"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col min-h-screen">
        
        {/* Premium Header & Search */}
        <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/20">
              <CloudLightning className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Sky<span className="text-blue-400">Meter</span></h1>
          </div>

          <form onSubmit={handleSearch} ref={searchRef} className="w-full md:w-[480px] relative group z-50">
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-teal-400 rounded-2xl blur opacity-20 group-hover:opacity-40 transition-opacity duration-300"></div>
            <div className="relative flex items-center bg-[#1e293b]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
              <Search className="w-5 h-5 text-slate-400 ml-3" />
              <input
                type="text"
                placeholder="Search any village, town, or city in India..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => { if (suggestions.length > 0) setShowSuggestions(true); }}
                className="w-full bg-transparent text-white placeholder-slate-400 px-3 py-2.5 focus:outline-none"
              />
              <button 
                type="button"
                onClick={handleGeolocation}
                title="Current Location"
                className="p-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-blue-400 rounded-xl transition-all mr-1"
              >
                <Navigation className="w-4 h-4" />
              </button>
              <button 
                type="submit" 
                className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-xl font-medium transition-colors shadow-lg shadow-blue-500/20"
              >
                Find
              </button>
            </div>

            {/* Autocomplete Dropdown */}
            {showSuggestions && suggestions.length > 0 && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-[#1e293b]/95 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                {suggestions.map((suggestion, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handleSuggestionClick(suggestion)}
                    className="w-full text-left px-5 py-3.5 hover:bg-white/10 transition-colors border-b border-white/5 last:border-0 flex flex-col group/item"
                  >
                    <span className="font-semibold text-white text-base group-hover/item:text-blue-400 transition-colors">{suggestion.name}</span>
                    <span className="text-xs text-slate-400 mt-0.5">{suggestion.admin1 ? `${suggestion.admin1}, ` : ''}{suggestion.country}</span>
                  </button>
                ))}
              </div>
            )}
          </form>
        </header>

        {/* Error Handling */}
        {error && (
          <div className="mb-8 p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center gap-3 animate-in fade-in slide-in-from-top-4">
            <AlertTriangle className="w-5 h-5 shrink-0" />
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="relative">
              <div className="absolute inset-0 rounded-full blur-xl bg-blue-500/20 animate-pulse"></div>
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin relative z-10" />
            </div>
            <p className="text-slate-400 mt-6 font-medium animate-pulse tracking-wide">Syncing atmosphere data...</p>
          </div>
        ) : weather && aqiData ? (
          
          <main className="flex-1 flex flex-col gap-6 animate-in fade-in duration-700">
            
            {/* Location Title */}
            <div className="flex items-end gap-3 px-2">
              <MapPin className="w-6 h-6 text-blue-400 mb-1" />
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white">{locationInfo.name}</h2>
              {locationInfo.country && <span className="text-xl md:text-2xl font-medium text-slate-500 mb-1">{locationInfo.country}</span>}
            </div>

            {/* Bento Grid Layout */}
            <div className="grid grid-cols-12 gap-6 mt-4">
              
              {/* Box 1: Primary Weather (Spans 4 cols on desktop) */}
              <div className="col-span-12 lg:col-span-4 bg-[#1e293b]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 right-0 p-6 opacity-20 group-hover:opacity-40 group-hover:scale-110 transition-all duration-700">
                  <WeatherIcon className="w-48 h-48 text-blue-400 drop-shadow-2xl" strokeWidth={1} />
                </div>
                
                <div className="relative z-10 flex flex-col h-full justify-between">
                  <div>
                    <h3 className="text-lg font-medium text-slate-400 flex items-center gap-2 mb-8">
                      <Thermometer className="w-5 h-5" />
                      Current Conditions
                    </h3>
                    
                    <div className="flex items-start gap-2">
                      <span className="text-7xl md:text-8xl font-black tracking-tighter text-white">
                        {Math.round(weather.temperature_2m)}
                      </span>
                      <span className="text-4xl font-bold text-blue-400 mt-2">°C</span>
                    </div>
                    
                    <p className="text-2xl font-semibold text-white capitalize mt-2">{weatherDesc}</p>
                    <p className="text-slate-400 mt-1">Feels like {Math.round(weather.apparent_temperature)}°</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mt-12 bg-white/[0.03] rounded-2xl p-4 border border-white/[0.05]">
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><Droplets className="w-3.5 h-3.5 text-blue-400" /> Humidity</p>
                      <p className="font-semibold text-lg text-white">{weather.relative_humidity_2m}%</p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1 flex items-center gap-1.5"><Wind className="w-3.5 h-3.5 text-teal-400" /> Wind</p>
                      <p className="font-semibold text-lg text-white">{weather.wind_speed_10m} <span className="text-sm text-slate-500">km/h</span></p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Box 2: AQI Meter (Spans 8 cols) */}
              <div className="col-span-12 lg:col-span-8 bg-[#1e293b]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-8 shadow-2xl">
                <AqiMeter aqi={aqiData.us_aqi} />
              </div>

              {/* Box 3: 6-Day Forecast (Spans 8 cols) */}
              <div className="col-span-12 lg:col-span-8 bg-[#1e293b]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 shadow-2xl overflow-hidden">
                <div className="flex items-center justify-between mb-6 px-2">
                  <h3 className="text-lg font-medium text-slate-300 flex items-center gap-2">
                    <Cloud className="w-5 h-5 text-blue-400" />
                    Extended Forecast
                  </h3>
                  <button className="text-sm text-slate-500 hover:text-white flex items-center transition-colors">
                    Details <ChevronRight className="w-4 h-4 ml-1" />
                  </button>
                </div>
                
                <div className="flex overflow-x-auto pb-4 pt-2 gap-4 snap-x hide-scrollbar">
                  {dailyForecast.map((day, idx) => {
                    const date = new Date(day.time);
                    const DayIcon = getWeatherDetails(day.weatherCode, 1).icon;
                    const isToday = idx === 0;
                    
                    return (
                      <div key={idx} className={`snap-center shrink-0 w-[110px] flex flex-col items-center p-4 rounded-2xl border ${isToday ? 'bg-blue-500/10 border-blue-500/30' : 'bg-white/[0.02] border-white/[0.05] hover:bg-white/[0.05]'} transition-colors`}>
                        <span className={`text-sm font-semibold mb-3 ${isToday ? 'text-blue-400' : 'text-slate-400'}`}>
                          {isToday ? 'Today' : date.toLocaleDateString('en-US', { weekday: 'short' })}
                        </span>
                        <DayIcon className={`w-8 h-8 mb-4 ${isToday ? 'text-blue-300' : 'text-slate-300'}`} strokeWidth={1.5} />
                        <div className="flex flex-col items-center gap-1">
                          <span className="text-lg font-bold text-white">{Math.round(day.maxTemp)}°</span>
                          <span className="text-sm font-medium text-slate-500">{Math.round(day.minTemp)}°</span>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Box 4: Pollutants Grid (Spans 4 cols) */}
              <div className="col-span-12 lg:col-span-4 bg-[#1e293b]/40 backdrop-blur-2xl border border-white/5 rounded-[2rem] p-6 shadow-2xl flex flex-col">
                <h3 className="text-lg font-medium text-slate-300 mb-6 px-2">Pollutant Breakdown</h3>
                <div className="grid grid-cols-2 gap-3 flex-1">
                  <PollutantCard name="PM2.5" value={aqiData.pm2_5} unit="µg/m³" desc="Fine Particles" status={aqiData.pm2_5 > 35 ? 'poor' : 'good'} />
                  <PollutantCard name="PM10" value={aqiData.pm10} unit="µg/m³" desc="Coarse Particles" status={aqiData.pm10 > 150 ? 'poor' : 'good'} />
                  <PollutantCard name="O₃" value={aqiData.ozone} unit="µg/m³" desc="Ozone" status={aqiData.ozone > 100 ? 'poor' : 'good'} />
                  <PollutantCard name="NO₂" value={aqiData.nitrogen_dioxide} unit="µg/m³" desc="Nitrogen Dioxide" status={aqiData.nitrogen_dioxide > 100 ? 'poor' : 'good'} />
                </div>
              </div>

            </div>
          </main>
        ) : null}

        {/* Footer */}
        <footer className="mt-auto pt-12 pb-4 text-center">
          <p className="text-slate-600 text-sm font-medium flex items-center justify-center gap-2">
            Data seamlessly provided by <a href="https://open-meteo.com" className="text-blue-500 hover:text-blue-400 transition-colors">Open-Meteo</a>
          </p>
        </footer>

      </div>

      {/* Global styles for hiding scrollbar in forecast */}
      <style dangerouslySetInnerHTML={{__html: `
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
