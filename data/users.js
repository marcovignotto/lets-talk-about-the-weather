const User = require("../models/User");

const USERS = [
  new User("John", "berlin", "de", "metric"),
  new User("Martha", "london", "en", "metric"),
  new User("Joe", "paris", "fr", "metric"),
  new User("William", "new York", "en", "imperial"),
  new User("Bill", "bagdad", "ar", "metric"),
  new User("Jane", "boston", "en", "imperial"),
  new User("Martin", "saigon", "vi", "metric"),
  new User("Elly", "prague", "cz", "metric"),
  new User("Frances", "barcelona", "ca", "metric"),
  new User("Aron", "tel aviv", "en", "metric"),
  new User("Paul", "athens", "el", "metric"),
  new User("Roger", "venice", "it", "metric"),
  new User("Fredrich", "moscow", "ru", "metric"),
  new User("Chris", "kiev", "ua", "metric"),
  new User("Eva", "nairobi", "en", "metric"),
  new User("Caroline", "Addis Abeba", "en", "metric"),
  new User("Anna", "Mogadishu", "ar", "metric"),
];

module.exports = USERS;
