const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
  name: {
    type: String,
    require: true,
  },
  language: {
    type: String,
    require: true,
  },
  location: {
    type: String,
    require: true,
  },
  mainWeather: {
    type: String,
    require: true,
  },
  icon: {
    type: String,
    require: true,
  },
  description: {
    type: String,
    require: true,
  },
  temperature: {
    type: String,
    require: true,
  },
  wind: {
    type: String,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("location", LocationSchema);

// name
// language

// getLocation = res.name,
// getMain = res.weather[0].main,
// getIcon = res.weather[0].icon,
// getMainDesc = res.weather[0].description,
// getTemp = res.main.temp,
// getWind = res.wind.speed,
