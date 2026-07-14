# WeatherMind

WeatherMind is a premium, live weather dashboard built with React, Vite, and Vanilla CSS. It features dynamic watercolor sky backdrops and interactive weather overlay effects (rain, snow, lightning, fog) that adapt in real-time based on your searched locations, along with custom theme configurations.

---

## 🌟 Key Features

- **🎨 Curated Visual Themes**: Toggle between four custom color palettes in the settings menu:
  - *Deep Space (Default)*: Sleek near-black aesthetics, indigo shades, and warm orange highlights.
  - *Cyberpunk Neon*: Vivid magenta glows, neon violet skies, and electric cyan highlights.
  - *Emerald Forest*: Organic dark forest gradients and mint green highlights.
  - *Sunset Crimson*: Fiery amber accents, rose overlays, and burgundy skies.
- **🌦️ Dynamic Weather overlays**: Dynamic backdrop particles representing the location's actual weather:
  - *Rain*: Vertical raindrops falling across the viewport. Speed and diagonal tilt adjust dynamically based on wind speed and direction.
  - *Thunderstorm*: Rain animations paired with fullscreen storm discharges and branching lightning bolts.
  - *Snow*: Swaying and bobbing snow particles floating down the screen.
  - *Fog*: Volumetric mist layers drifting across the bottom screen.
  - *Clear Sky*: A pulsing sun flare with rotating rays or a soft glowing moon based on local day/night status.
- **⚙️ Integrated Settings Panel**: Switch measurement units (°C vs. °F) and manage local search query history caches.
- **📊 Meteorological Telemetry widgets**: Real-time stats including an Air Quality Index (AQI) metric gauge, Hourly Timeline, 7-day outlook, and a circular wind compass.

---

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js (version 18+) installed.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/krishjaiswal707-prog/WeatherMind.git
   cd WeatherMind
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the local development server:
   ```bash
   npm run dev
   ```
   Open [http://localhost:5173/](http://localhost:5173/) in your browser.

4. Build for production:
   ```bash
   npm run build
   ```
