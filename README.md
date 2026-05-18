<<<<<<< HEAD
# ============================================================
# WeatherSphere
# Global Weather Dashboard for the InitZone Frontend Contest
# ============================================================

![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=111827)
![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=flat-square&logo=vite&logoColor=ffffff)
![Framer Motion](https://img.shields.io/badge/Framer_Motion-12-0055FF?style=flat-square&logo=framer&logoColor=ffffff)
![OpenWeatherMap](https://img.shields.io/badge/OpenWeatherMap-API-EB6E4B?style=flat-square)
![REST Countries](https://img.shields.io/badge/REST_Countries-API-10B981?style=flat-square)
![MIT](https://img.shields.io/badge/License-MIT-111827?style=flat-square)

WeatherSphere is a polished, mobile-first global weather dashboard that turns a city search into a complete weather intelligence view: current conditions, five-day forecasting, hourly temperature trends, country context, persistent local search history, graceful API fallbacks, and theme-aware glass UI.

**Live Demo:** <https://your-vercel-deployment-url>  
**GitHub Repo:** <https://github.com/your-username/weathersphere>

![WeatherSphere screenshot](./screenshot.png)

(Replace with actual screenshot)

## Features

| Feature | Description |
| --- | --- |
| City search with autocomplete | Fast search box with popular city suggestions and keyboard-friendly form behavior. |
| Current weather card | Large condition-first panel with temperature, location, sunrise, sunset, and optional Unsplash city image. |
| 8-stat weather grid | Humidity, wind, pressure, visibility, clouds, dew point, gust, and temperature range. |
| Dew point/gust/visibility detail panel | Comfort and travel-focused weather details derived from current weather data. |
| SVG temperature trend chart | Lightweight custom SVG chart for upcoming 3-hour forecast slots. |
| 5-day forecast cards | Aggregates OpenWeatherMap 3-hour forecast data into readable daily cards. |
| Dynamic city background | Uses Unsplash imagery when `VITE_UNSPLASH_KEY` is available and falls back gracefully. |
| Country info sidebar | REST Countries profile with flag, capital, population, currencies, languages, and region. |
| localStorage search history | Stores up to 10 successful city searches on the current device. |
| Dark/light mode | Uses system preference by default and saves manual toggle preference. |
| Dynamic weather background tint | Changes the page atmosphere for clear, cloudy, rainy, stormy, snowy, foggy, and night states. |
| Mobile-first responsive layout | Optimized from 375px phones through desktop dashboards. |
| Framer Motion transitions | Smooth entry, hover, loading, and error transitions. |
| Error handling | Friendly states for invalid cities, missing API key, rate limits, and offline connections. |
| Graceful API fallbacks | Unsplash is optional; country and photo failures do not break core weather search. |

## Tech Stack

**Core:** React 18, Vite, JavaScript, CSS custom properties, React hooks  
**APIs:** OpenWeatherMap Current Weather, OpenWeatherMap 5 Day / 3 Hour Forecast, REST Countries, Unsplash Search Photos  
**Tools:** Axios, React Icons, Framer Motion, ESLint, Vercel, Netlify

## Project Structure

```text
.
|-- .env.example              # Example environment variables for API keys.
|-- .gitignore                # Keeps dependencies, build output, logs, and secrets out of git.
|-- index.html                # Vite entry HTML with metadata, favicon, and Google Fonts.
|-- netlify.toml              # Netlify single-page app redirect config.
|-- package.json              # Scripts and project dependencies.
|-- package-lock.json         # Locked dependency graph.
|-- README.md                 # Contest-grade project documentation.
|-- vercel.json               # Vercel single-page app rewrite config.
|-- vite.config.js            # Vite React plugin configuration.
|-- public/
|   `-- favicon.svg           # WeatherSphere globe favicon.
`-- src/
    |-- App.jsx               # Top-level dashboard orchestration and UI states.
    |-- main.jsx              # React root render and global stylesheet import.
    |-- components/
    |   |-- CountrySidebar.jsx # REST Countries sidebar profile.
    |   |-- ErrorMessage.jsx   # Friendly error panel with retry support.
    |   |-- Footer.jsx         # Contest and API credit links.
    |   |-- ForecastSection.jsx# Five-day forecast card grid.
    |   |-- Header.jsx         # Brand header and theme toggle.
    |   |-- Loader.jsx         # Full-content loading state.
    |   |-- SearchBar.jsx      # Search form and autocomplete suggestions.
    |   |-- SearchHistory.jsx  # Persistent local search history.
    |   |-- StatCard.jsx       # Reusable weather stat tile.
    |   |-- TemperatureChart.jsx # Custom SVG hourly trend chart.
    |   |-- WeatherCard.jsx    # Current weather hero card.
    |   |-- WeatherDetails.jsx # Eight-stat condition grid.
    |   `-- WelcomeScreen.jsx  # First-run dashboard entry state.
    |-- hooks/
    |   |-- useLocalStorage.js # Safe localStorage state helper.
    |   |-- useTheme.js        # System-aware saved theme management.
    |   `-- useWeather.js      # Weather dashboard data workflow.
    |-- services/
    |   |-- countryApi.js      # REST Countries request helper.
    |   |-- photoApi.js        # Optional Unsplash request helper.
    |   |-- storage.js         # Search history persistence helpers.
    |   `-- weatherApi.js      # OpenWeatherMap request helpers.
    |-- styles/
    |   `-- global.css         # Complete design system and component styling.
    `-- utils/
        |-- constants.js       # Storage keys and curated city suggestions.
        |-- helpers.js         # Formatting, forecast aggregation, and chart utilities.
        `-- weatherIcons.js    # Weather condition to icon mapping.
```

## APIs Used

| API | Endpoint | Params | Auth | Free tier limits | Link |
| --- | --- | --- | --- | --- | --- |
| OpenWeatherMap Current Weather | `https://api.openweathermap.org/data/2.5/weather` | `q`, `appid`, `units=metric` | `VITE_OWM_KEY` | Free account limits vary by plan and account settings. | <https://openweathermap.org/current> |
| OpenWeatherMap 5 Day Forecast | `https://api.openweathermap.org/data/2.5/forecast` | `q`, `appid`, `units=metric`, `cnt=40` | `VITE_OWM_KEY` | Free account limits vary by plan and account settings. | <https://openweathermap.org/forecast5> |
| REST Countries | `https://restcountries.com/v3.1/name/{name}` | `fields=name,flags,capital,population,currencies,languages,region,subregion,cca2` | None | Public API with fair-use expectations. | <https://restcountries.com/> |
| Unsplash Search Photos | `https://api.unsplash.com/search/photos` | `query`, `client_id`, `per_page=1`, `orientation=landscape` | `VITE_UNSPLASH_KEY` | Demo applications are rate-limited; check Unsplash app dashboard. | <https://unsplash.com/developers> |

## Local Setup

1. Clone: `git clone https://github.com/your-username/weathersphere.git`
2. Install: `npm install`
3. Env: `cp .env.example .env` then add your API keys.
4. Dev server: `npm run dev`
5. Build: `npm run build`

## Environment Variables

| Variable | Required | How to get |
| --- | --- | --- |
| `VITE_OWM_KEY` | Required | Create a free key at <https://openweathermap.org/api>. |
| `VITE_UNSPLASH_KEY` | Optional | Create an app at <https://unsplash.com/developers>. |

## Deployment

**Vercel preferred:** import the public GitHub repository, add `VITE_OWM_KEY` and optional `VITE_UNSPLASH_KEY` in project environment variables, then deploy.

**Netlify:** connect the repository or upload the `dist/` folder after `npm run build`, then add the same environment variables in site settings.

## Submission Checklist

- [ ] GitHub repo is public
- [ ] README.md is complete and professional
- [ ] .env is gitignored, .env.example is committed
- [ ] API keys not exposed in any committed file
- [ ] Live demo is deployed and working
- [ ] Mobile responsive (tested 375px-1440px)
- [ ] City search works
- [ ] Current weather displays correctly
- [ ] 5-day forecast works
- [ ] Country sidebar populates
- [ ] Search history persists across page refresh
- [ ] Dark/light mode toggle works and is saved
- [ ] Error shown for invalid city name
- [ ] Error shown for network failure
- [ ] No console errors in production build
- [ ] npm run build completes without errors

## Author

Built by Abu Jafar for the InitZone Frontend Intern Contest.

Released under the MIT License.
=======
# weather-dashboard
A responsive weather dashboard with live forecasts, country profiles, temperature trends, saved searches, and dark/light mode.
>>>>>>> 18c9c5d3a063afec74c1fbfb0b8db1f42aa5e134
