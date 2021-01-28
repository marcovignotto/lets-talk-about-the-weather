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
    new User("berlin", "de", "metric", posArr.shift()),
    new User("london", "en", "metric", posArr.shift()),
    new User("paris", "fr", "metric", posArr.shift()),
    new User("new York", "en", "imperial", posArr.shift()),
    new User("bagdad", "ar", "metric", posArr.shift()),
    new User("boston", "en", "imperial", posArr.shift()),
    new User("saigon", "vi", "metric", posArr.shift()),
    new User("prague", "cz", "metric", posArr.shift()),
    new User("barcelona", "ca", "metric", posArr.shift()),
    new User("tel aviv", "en", "metric", posArr.shift()),
    new User("athens", "el", "metric", posArr.shift()),
    new User("venice", "it", "metric", posArr.shift()),
    new User("moscow", "ru", "metric", posArr.shift()),
    new User("kiev", "ua", "metric", posArr.shift()),
    new User("nairobi", "en", "metric", posArr.shift()),
    new User("Addis Abeba", "en", "metric", posArr.shift()),
    new User("Mogadishu", "ar", "metric", posArr.shift()),
  ]);
};

// call the function
makePosArr(0, USERS().length);
