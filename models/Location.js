const mongoose = require("mongoose");

/**
 * @description model for Locations
 * location with all the data linked with the user
 * displayed in the frontend
 */

const LocationSchema = mongoose.Schema({
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

module.exports = mongoose.model("location", LocationSchema);
