const WeatherUser = require("../models/WeatherUser");

const WEATHER_USERS = [
  new WeatherUser("John", "berlin", "de", "metric"),
  new WeatherUser("Martha", "london", "en", "metric"),
  new WeatherUser("Joe", "paris", "fr", "metric"),
  new WeatherUser("William", "new York", "en", "imperial"),
  new WeatherUser("Bill", "bagdad", "ar", "metric"),
  new WeatherUser("Jane", "boston", "en", "imperial"),
  new WeatherUser("Martin", "saigon", "vi", "metric"),
  new WeatherUser("Elly", "prague", "cz", "metric"),
  new WeatherUser("Frances", "barcelona", "ca", "metric"),
  new WeatherUser("Aron", "tel aviv", "en", "metric"),
  new WeatherUser("Paul", "athens", "el", "metric"),
  new WeatherUser("Roger", "venice", "it", "metric"),
  new WeatherUser("Fredrich", "moscow", "ru", "metric"),
  new WeatherUser("Chris", "kiev", "ua", "metric"),
  new WeatherUser("Eva", "nairobi", "en", "metric"),
  new WeatherUser("Caroline", "Addis Abeba", "en", "metric"),
  new WeatherUser("Anna", "Mogadishu", "ar", "metric"),
];

module.exports = WEATHER_USERS;
