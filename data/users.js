// // create positions
// let posArr = [];
// function makePosArr(start, total) {
//   for (let i = start; i < total + 1; i++) {
//     posArr.push(i);
//   }

//   // delete second position
//   return posArr.splice(
//     posArr.find((x) => x === start + 1),
//     1
//   );
// }

const User = require("../models/User");

let usersArr = [];
// location, language,unit
const USERS = [
  new User("John", "berlin", "de", "metric"),
  new User("Martha", "london", "en", "metric"),
  new User("Joe", "paris", "fr", "metric"),
  new User("William", "new York", "en", "imperial"),
  // new User("Bill", "bagdad", "ar", "metric"),
  // new User("John","boston", "en", "imperial"),
  // new User("John","saigon", "vi", "metric"),
  // new User("John","prague", "cz", "metric"),
  // new User("John","barcelona", "ca", "metric"),
  // new User("John","tel aviv", "en", "metric"),
  // new User("John","athens", "el", "metric"),
  // new User("John","venice", "it", "metric"),
  // new User("John","moscow", "ru", "metric"),
  // new User("John","kiev", "ua", "metric"),
  // new User("John","nairobi", "en", "metric"),
  // new User("John","Addis Abeba", "en", "metric"),
  // new User("John","Mogadishu", "ar", "metric"),
];

// call the function
// makePosArr(0, USERS().length);

module.exports = USERS;

// randomization
// console.log(posArr.sort(() => Math.random() - 0.5));
