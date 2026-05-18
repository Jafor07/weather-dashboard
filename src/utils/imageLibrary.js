const IMAGE_PARAMS = 'auto=format&fit=crop&w=1800&q=88'

const WEATHER_SCENES = {
  clear: {
    url: `https://images.unsplash.com/photo-1419833173245-f59e1b93f9ee?${IMAGE_PARAMS}`,
    alt: 'Bright clear sky with soft clouds',
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
  },
  clouds: {
    url: `https://images.unsplash.com/photo-1499346030926-9a72daac6c63?${IMAGE_PARAMS}`,
    alt: 'Layered cloudy sky with soft daylight',
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
  },
  rain: {
    url: `https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?${IMAGE_PARAMS}`,
    alt: 'Rain drops on glass with a moody city atmosphere',
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
  },
  storm: {
    url: `https://images.unsplash.com/photo-1500674425229-f692875b0ab7?${IMAGE_PARAMS}`,
    alt: 'Lightning storm over a wide landscape',
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
  },
  snow: {
    url: `https://images.unsplash.com/photo-1483728642387-6c3bdd6c93e5?${IMAGE_PARAMS}`,
    alt: 'Snowy alpine mountain scene',
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
  },
  fog: {
    url: `https://images.unsplash.com/photo-1485236715568-ddc5ee6ca227?${IMAGE_PARAMS}`,
    alt: 'Misty forest with soft morning fog',
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
  },
  night: {
    url: `https://images.unsplash.com/photo-1519681393784-d120267933ba?${IMAGE_PARAMS}`,
    alt: 'Clear night sky over a mountain landscape',
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
  },
  welcome: {
    url: `https://images.unsplash.com/photo-1507525428034-b723cf961d3e?${IMAGE_PARAMS}`,
    alt: 'Aerial coastline with bright blue water',
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
  },
}

const CITY_SCENES = {
  'new york': {
    url: `https://images.unsplash.com/photo-1496588152823-86ff7695e68f?${IMAGE_PARAMS}`,
    alt: 'New York City skyline at sunset',
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
  },
  'new york city': {
    url: `https://images.unsplash.com/photo-1496588152823-86ff7695e68f?${IMAGE_PARAMS}`,
    alt: 'New York City skyline at sunset',
    author: 'Unsplash',
    authorUrl: 'https://unsplash.com',
  },
}

function normalizeCityName(cityName = '') {
  return cityName.trim().toLowerCase()
}

export function getWeatherScene(conditionId, isDay = true, cityName = '') {
  const cityScene = CITY_SCENES[normalizeCityName(cityName)]
  if (cityScene) return cityScene

  if (!conditionId) return isDay ? WEATHER_SCENES.clear : WEATHER_SCENES.night
  if (conditionId >= 200 && conditionId < 300) return WEATHER_SCENES.storm
  if (conditionId >= 300 && conditionId < 600) return WEATHER_SCENES.rain
  if (conditionId >= 600 && conditionId < 700) return WEATHER_SCENES.snow
  if (conditionId >= 700 && conditionId < 800) return WEATHER_SCENES.fog
  if (conditionId === 800) return WEATHER_SCENES.clear
  return WEATHER_SCENES.clouds
}

export function getWelcomeScene() {
  return WEATHER_SCENES.welcome
}
