const mongoose = require("mongoose");

const LocationSchema = mongoose.Schema({
  task: {
    type: String,
    require: true,
  },
  priority: {
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
