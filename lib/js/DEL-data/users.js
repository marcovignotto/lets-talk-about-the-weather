// create positions
let posArr = [];
function makePosArr(start, total) {
  for (let i = start; i < total + 1; i++) {
    posArr.push(i);
  }

  // delete second position
  return posArr.splice(
    posArr.find((x) => x === start + 1),
    1
  );
}

let usersArr = [];
// location, language,unit
const USERS = () => {
  return (usersArr = [
    new User("John", "berlin", "de", "metric", posArr.shift()),
    new User("Martha", "london", "en", "metric", posArr.shift()),
    new User("Joe", "paris", "fr", "metric", posArr.shift()),
    new User("William", "new York", "en", "imperial", posArr.shift()),
    // new User("Bill", "bagdad", "ar", "metric", posArr.shift()),
    // new User("John","boston", "en", "imperial", posArr.shift()),
    // new User("John","saigon", "vi", "metric", posArr.shift()),
    // new User("John","prague", "cz", "metric", posArr.shift()),
    // new User("John","barcelona", "ca", "metric", posArr.shift()),
    // new User("John","tel aviv", "en", "metric", posArr.shift()),
    // new User("John","athens", "el", "metric", posArr.shift()),
    // new User("John","venice", "it", "metric", posArr.shift()),
    // new User("John","moscow", "ru", "metric", posArr.shift()),
    // new User("John","kiev", "ua", "metric", posArr.shift()),
    // new User("John","nairobi", "en", "metric", posArr.shift()),
    // new User("John","Addis Abeba", "en", "metric", posArr.shift()),
    // new User("John","Mogadishu", "ar", "metric", posArr.shift()),
  ]);
};

// call the function
makePosArr(0, USERS().length);

// randomization
// console.log(posArr.sort(() => Math.random() - 0.5));
