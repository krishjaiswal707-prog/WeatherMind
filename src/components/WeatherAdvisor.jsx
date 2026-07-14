import React from 'react';
import { Shirt, Footprints, AlertCircle, Compass, Smile } from 'lucide-react';

export default function WeatherAdvisor({ current }) {
  const { temp, label, theme, windSpeed, humidity, precipitation } = current;

  // Compute Advisor Logic
  const getAdvisorAdvice = () => {
    let clothing = '';
    let activity = '';
    let alertText = '';
    let summary = '';

    // Clothing advice based on temperature
    if (temp < 8) {
      clothing = 'Heavy winter coat, gloves, scarf, and thermal layers are essential.';
    } else if (temp >= 8 && temp < 16) {
      clothing = 'Chilly! We recommend a warm sweater, fleece, or a light winter jacket.';
    } else if (temp >= 16 && temp < 24) {
      clothing = 'Comfortable weather. A light long-sleeve shirt, hoodie, or cardigans are perfect.';
    } else if (temp >= 24 && temp < 32) {
      clothing = 'Warm day. Light cotton t-shirts, shorts, or summer dresses are recommended.';
    } else {
      clothing = 'Extremely hot! Wear breathable, loose, light-colored clothing. Use sunglasses.';
    }

    // Add rain/snow specific clothing additions
    if (precipitation > 0.5 || theme === 'rainy') {
      clothing += ' Don\'t forget a waterproof jacket or a sturdy umbrella!';
    }

    // Activity advice based on theme & variables
    if (theme === 'stormy') {
      activity = 'High lightning/wind risks. Avoid outdoor travel, stay indoors, and enjoy movie time.';
      alertText = 'Severe weather alert. Keep windows closed and avoid metallic items outdoors.';
      summary = 'Stay secure indoors';
    } else if (theme === 'rainy') {
      activity = 'Wet outdoors. Great day for visiting museums, reading a novel, or cooking a warm soup.';
      summary = 'Perfect indoor weather';
    } else if (theme === 'snowy') {
      activity = 'Snowy scenery. Go for a winter stroll, build a snowman, or cozy up by a fireplace.';
      summary = 'Embrace the winter vibe';
    } else if (theme === 'foggy') {
      activity = 'Dense mist. Driving visibility is low. Best to relax with a warm drink or work indoors.';
      alertText = 'Low road visibility. Keep headlights on low beam if commuting.';
      summary = 'Quiet misty mood';
    } else {
      // Good weather (clear / cloudy)
      if (temp >= 15 && temp <= 28 && windSpeed < 25) {
        activity = 'Splendid conditions! Highly recommended for running, hiking, cycling, or a picnic.';
        summary = 'Fantastic day for outdoors';
      } else if (temp > 28) {
        activity = 'Sultry heat. Choose shaded pools, indoor AC gyms, or evening walks instead of midday runs.';
        summary = 'Beat the midday heat';
      } else {
        activity = 'Fair skies, though slightly cool/windy. Good for light jogs or grabbing coffee with friends.';
        summary = 'Nice day to get fresh air';
      }
    }

    // Wind and humidity secondary alerts
    if (windSpeed > 35 && theme !== 'stormy') {
      alertText = 'Gale winds detected. Avoid biking and watch out for falling tree branches.';
    } else if (humidity > 85 && temp > 27 && !alertText) {
      alertText = 'High moisture levels. Humidity increases heat exhaustion. Keep well hydrated.';
    }

    return { clothing, activity, alertText, summary };
  };

  const advice = getAdvisorAdvice();

  return (
    <div className="glass-panel advisor-container">
      <div className="advisor-header">
        <Compass className="advisor-logo-icon" />
        <div>
          <h4>Smart Weather Advisor</h4>
          <p className="advisor-summary">{advice.summary}</p>
        </div>
      </div>
      
      <div className="advisor-grid">
        <div className="advisor-card">
          <div className="advisor-card-header">
            <Shirt className="advisor-card-icon" />
            <h5>What to Wear</h5>
          </div>
          <p className="advisor-card-text">{advice.clothing}</p>
        </div>

        <div className="advisor-card">
          <div className="advisor-card-header">
            <Footprints className="advisor-card-icon" />
            <h5>Activities</h5>
          </div>
          <p className="advisor-card-text">{advice.activity}</p>
        </div>
      </div>

      {advice.alertText && (
        <div className="advisor-alert-banner">
          <AlertCircle className="alert-icon" size={16} />
          <span>{advice.alertText}</span>
        </div>
      )}
    </div>
  );
}
