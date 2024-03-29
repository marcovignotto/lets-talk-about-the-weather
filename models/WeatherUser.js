const mongoose = require("mongoose");

/**
 * @description model for Weather Users
 * users linked with a location
 * displayed in /admin
 */

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
  mainLocation: {
    type: Boolean,
    require: true,
  },
  timezone: {
    type: Number,
    require: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("WeatherUser", WeatherUser);
