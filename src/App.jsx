import { useState, useEffect } from "react";
import axios from "axios";

import {
  IoMdSunny,
  IoMdCloudy,
  IoMdRainy,
  IoMdSnow,
  IoMdThunderstorm,
  IoMdSearch,
} from "react-icons/io";

import {
  BsCloudHaze2Fill,
  BsCloudDrizzleFill,
  BsClouds,
  BsTornado,
  BsEye,
  BsWater,
  BsThermometer,
  BsWind,
} from "react-icons/bs";

import { ImSpinner8 } from "react-icons/im";

const APIkey = "17c6072dd30722149471605547128ece";

const WEATHER_ICONS = {
  Clear: <IoMdSunny className="text-[#ffde33]" />,
  Clouds: <IoMdCloudy className="text-white/90" />,
  Rain: <IoMdRainy className="text-[#31cafb]" />,
  Drizzle: <BsCloudDrizzleFill className="text-[#31cafb]" />,
  Thunderstorm: <IoMdThunderstorm />,
  Snow: <IoMdSnow className="text-[#bfe3ff]" />,
  Haze: <BsCloudHaze2Fill className="text-white/80" />,
  Mist: <BsCloudHaze2Fill className="text-white/80" />,
  Fog: <BsCloudHaze2Fill className="text-white/80" />,
  Smoke: <BsCloudHaze2Fill className="text-white/70" />,
  Dust: <BsClouds className="text-white/70" />,
  Sand: <BsClouds className="text-white/70" />,
  Ash: <BsClouds className="text-white/70" />,
  Squall: <BsClouds className="text-white/80" />,
  Tornado: <BsTornado className="text-white/80" />,
};

const WEATHER_BG = {
  Clear: "from-amber-400 via-orange-400 to-yellow-500",
  Clouds: "from-slate-500 via-slate-700 to-slate-900",
  Rain: "from-sky-600 via-blue-700 to-indigo-900",
  Drizzle: "from-sky-500 via-blue-600 to-slate-800",
  Thunderstorm: "from-slate-700 via-zinc-900 to-black",
  Snow: "from-sky-200 via-slate-300 to-slate-500",
  Haze: "from-amber-200 via-stone-400 to-stone-600",
  Mist: "from-stone-300 via-stone-400 to-stone-600",
  Fog: "from-stone-300 via-stone-400 to-stone-600",
  Smoke: "from-stone-400 via-stone-600 to-zinc-800",
  Dust: "from-amber-300 via-orange-400 to-stone-600",
  Sand: "from-amber-300 via-orange-400 to-stone-600",
  Ash: "from-stone-400 via-zinc-600 to-zinc-800",
  Squall: "from-slate-500 via-slate-700 to-slate-900",
  Tornado: "from-stone-500 via-zinc-700 to-zinc-900",
};

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const pad = (n) => String(n).padStart(2, "0");

const getLocalTime = (dt, timezone) => {
  const d = new Date((dt + timezone) * 1000);
  return {
    date: `${DAYS[d.getUTCDay()]}, ${pad(d.getUTCDate())} ${MONTHS[d.getUTCMonth()]} ${d.getUTCFullYear()}`,
    time: `${pad(d.getUTCHours())}:${pad(d.getUTCMinutes())}`,
  };
};

function App() {
  const [data, setData] = useState(null);
  const [location, setLocation] = useState("Accra");
  const [inputValue, setInputValue] = useState("");
  const [animate, setAnimate] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    const value = inputValue.trim();

    if (value === "") {
      setAnimate(true);
      setTimeout(() => setAnimate(false), 500);
      return;
    }

    setLocation(value);
    setInputValue("");
  };

  useEffect(() => {
    setLoading(true);
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${location}&units=metric&appid=${APIkey}`;

    axios
      .get(url)
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setLoading(false);
        setError(
          err.response?.data?.message
            ? err.response.data.message.charAt(0).toUpperCase() + err.response.data.message.slice(1)
            : "Could not load weather. Please check your connection."
        );
      });
  }, [location]);

  useEffect(() => {
    const timer = setTimeout(() => setError(""), 2500);
    return () => clearTimeout(timer);
  }, [error]);

  const main = data?.weather?.[0]?.main;
  const bg = WEATHER_BG[main] || "from-slate-500 via-slate-700 to-slate-900";
  const icon = data ? WEATHER_ICONS[main] || <BsClouds className="text-white/80" /> : null;
  const localTime = data ? getLocalTime(data.dt, data.timezone) : null;

  return (
    <div className={`flex flex-col items-center justify-center w-full min-h-screen px-4 py-8 bg-gradient-to-br ${bg} transition-colors duration-700`}>
      {error && (
        <div className="w-full max-w-md px-4 py-3 mb-4 text-white capitalize rounded-xl bg-red-500/90 shadow-lg">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={`${animate ? "animate-bounce " : ""}flex items-center justify-between w-full max-w-md pl-5 sm:pl-6 pr-2 mb-5 text-white rounded-full bg-black/25 h-14 backdrop-blur-[32px] shadow-xl`}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Search by city or country"
          aria-label="Search by city or country"
          className="flex-1 min-w-0 h-full text-base sm:text-lg font-light outline-none placeholder:text-white/70 bg-transparent"
        />
        <button
          type="submit"
          className="flex items-center justify-center w-14 sm:w-20 transition rounded-full h-11 bg-amber-300 hover:bg-amber-400 hover:scale-105 active:scale-95 shrink-0"
        >
          <IoMdSearch size={28} />
        </button>
      </form>

      <div className="w-full max-w-md text-white xl:max-w-xl bg-black/25 min-h-[420px] sm:min-h-[500px] backdrop-blur-[32px] rounded-3xl py-10 sm:py-12 px-5 sm:px-8 shadow-2xl">
        {!data && !loading && (
          <div className="flex flex-col items-center justify-center w-full h-full gap-4">
            <p className="text-white/80">Search for a city to see the weather</p>
          </div>
        )}

        {loading && (
          <div className="flex items-center justify-center w-full h-full">
            <ImSpinner8 className="text-4xl animate-spin" />
          </div>
        )}

        {data && !loading && (
          <div>
            {/* card top */}
            <div className="flex items-center space-x-4 sm:space-x-5">
              <div className="text-5xl sm:text-6xl">{icon}</div>
              <div className="min-w-0">
                <div className="text-lg sm:text-2xl font-semibold truncate">
                  {data.name}, {data.sys.country}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-white/75">
                  {localTime.date} · {localTime.time} local
                </div>
              </div>
            </div>

            {/* card body */}
            <div className="my-10 sm:my-14">
              <div className="flex items-start justify-center leading-none">
                <div className="font-light text-[96px] sm:text-[128px]">
                  {Math.round(data.main.temp)}
                  <span className="text-4xl sm:text-5xl align-top ml-1">°</span>
                </div>
              </div>
              <div className="mt-4 text-lg sm:text-xl text-center capitalize">
                {data.weather[0].description}
              </div>
            </div>

            {/* card bottom */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4 mt-8">
              <div className="flex flex-col items-center gap-1.5 py-3.5 px-2 bg-white/5 rounded-xl">
                <BsEye className="text-lg text-amber-300" />
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-white/60">Visibility</span>
                <span className="text-sm sm:text-base font-semibold">{(data.visibility / 1000).toFixed(1)} km</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 py-3.5 px-2 bg-white/5 rounded-xl">
                <BsThermometer className="text-lg text-amber-300" />
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-white/60">Feels like</span>
                <span className="text-sm sm:text-base font-semibold">{Math.round(data.main.feels_like)}°</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 py-3.5 px-2 bg-white/5 rounded-xl">
                <BsWater className="text-lg text-amber-300" />
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-white/60">Humidity</span>
                <span className="text-sm sm:text-base font-semibold">{data.main.humidity}%</span>
              </div>
              <div className="flex flex-col items-center gap-1.5 py-3.5 px-2 bg-white/5 rounded-xl">
                <BsWind className="text-lg text-amber-300" />
                <span className="text-[11px] sm:text-xs uppercase tracking-wider text-white/60">Wind</span>
                <span className="text-sm sm:text-base font-semibold">{data.wind.speed.toFixed(1)} m/s</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
