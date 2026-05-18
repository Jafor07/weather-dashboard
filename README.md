# Global Weather Dashboard

A responsive weather dashboard for searching global cities, viewing live forecasts, country details, saved searches, and theme-aware weather insights.

## Live Demo

- Live Demo: https://weather-dashboard-sable-two.vercel.app/
- GitHub Repository: https://github.com/Jafor07/weather-dashboard

## Features

- City-based weather search
- Current weather dashboard with live conditions
- Five-day forecast cards
- Temperature trend chart
- Country profile card with flag and regional data
- Recent search history using local storage
- Invalid city and API error states
- Dark/light theme toggle
- Responsive desktop and mobile UI
- Vercel-ready production build

## Tech Stack

| Tool | Purpose |
| --- | --- |
| React | Component-based UI |
| Vite | Development server and production bundling |
| JavaScript | Application logic |
| CSS | Responsive styling and theme system |
| Framer Motion | UI transitions and animations |
| React Icons | Weather and interface icons |
| Axios | API requests |
| OpenWeatherMap API | Current weather and forecast data |
| REST Countries API | Country profile data |
| Unsplash API | Optional city background images |
| Local Storage | Recent search persistence |
| Vercel | Hosting and deployment |

## Getting Started

### Prerequisites

- Node.js 18 or newer
- npm
- OpenWeatherMap API key
- Unsplash access key, optional

### Installation

```bash
git clone https://github.com/Jafor07/weather-dashboard.git
cd weather-dashboard
npm install
cp .env.example .env
npm run dev
```

Open the local Vite URL shown in the terminal, usually `http://localhost:5173/`.

## Environment Variables

| Variable | Description | Required |
| --- | --- | --- |
| `VITE_OWM_KEY` | OpenWeatherMap API key for current weather and five-day forecast requests. | Yes |
| `VITE_UNSPLASH_KEY` | Unsplash access key for optional city background photos. | No |

Example:

```env
VITE_OWM_KEY=your_openweathermap_api_key
VITE_UNSPLASH_KEY=your_unsplash_access_key
```

## Project Structure

```text
weather-dashboard/
|-- public/
|   `-- favicon.svg
|-- src/
|   |-- components/
|   |-- hooks/
|   |-- services/
|   |-- styles/
|   |-- utils/
|   |-- App.jsx
|   `-- main.jsx
|-- .env.example
|-- .gitignore
|-- eslint.config.js
|-- index.html
|-- package-lock.json
|-- package.json
|-- README.md
|-- vercel.json
`-- vite.config.js
```

## Deployment

### Vercel (recommended)

1. Push the project to GitHub.
2. Import `https://github.com/Jafor07/weather-dashboard` into Vercel.
3. Add `VITE_OWM_KEY` and optional `VITE_UNSPLASH_KEY` in Vercel project environment variables.
4. Use `npm run build` as the build command.
5. Use `dist` as the output directory.
6. Deploy.

## API Reference

| API | Endpoint | Usage |
| --- | --- | --- |
| OpenWeatherMap Current Weather | `https://api.openweathermap.org/data/2.5/weather` | Loads current city weather, temperature, humidity, wind, pressure, visibility, sunrise, and sunset. |
| OpenWeatherMap Five-Day Forecast | `https://api.openweathermap.org/data/2.5/forecast` | Loads three-hour forecast data used for daily forecast cards and the temperature trend chart. |
| REST Countries | `https://restcountries.com/v3.1/name/{country}` | Loads country flag, capital, population, currency, language, and region details. |
| Unsplash Search Photos | `https://api.unsplash.com/search/photos` | Loads optional city background images when an Unsplash key is configured. |

## Screenshots

Add final screenshots before submission.

```text
public/screenshots/landing.png
public/screenshots/dashboard-dark.png
public/screenshots/dashboard-light.png
public/screenshots/mobile.png
```

Update this section with Markdown image links after adding the files:

```md
![Landing page](./public/screenshots/landing-dark.png)
![Dashboard dark mode](./public/screenshots/dashboard-dark.png)
![Dashboard light mode](./public/screenshots/dashboard-light.png)
![Mobile view](./public/screenshots/mobile.png)
```

## License

MIT
