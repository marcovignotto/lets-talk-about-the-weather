const mongoose = require("mongoose");

const WeatherUser = mongoose.Schema({
  firstName: {
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
  unit: {
    type: String,
    require: true,
  },
  userCode: {
    type: Number,
    require: true,
    unique: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WeatherUser", WeatherUser);
