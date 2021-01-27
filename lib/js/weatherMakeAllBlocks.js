//"berlin", "en", "metric"
// let arrLocations = [{ location: "berlin", language: "de", units: "metric" }];

// const mainLocation = () => makeWeatherBlock("berlin", "de", "metric");

// console.log(mainLocation());
let col3 = "";

// console.log(USERS);

// SPLIT ARRAY

let newArr = [];
const chopArray = (arr, size) => {
  for (let i = 0; i < arr.length; i = i + size) {
    newArr.push(arr.slice(i, i + size));
  }

  return newArr;
};

chopArray(USERS, 4);

// console.log(newArr);

newArr.map((y, i) => {
  // console.log(i);
  if (i === 0) {
    y.map((x, index) => {
      makeWeatherBlock(x.location, x.language, x.unit, "col-3", "grid-row-1-1");
    });
  } else if (i > 0) {
    y.map((x, index) => {
      makeWeatherBlock(x.location, x.language, x.unit, "col-3", "grid-row-1-1");
    });
  }
});

// USERS.map((x, i) =>
//   makeWeatherBlock(x.location, x.language, x.unit, "col-3", "grid-row-1-1")
// );

// grid-template-rows: 1fr 1fr; // prima riga
// grid - row: 1 / span 1;
// grid - row: 1 / span 1;
// grid - row: 1 / span 2; // big
// grid - row: 2 / span 2;
//     grid-row: 2 / span 2;

//
//

// makeWeatherBlock("berlin", "de", "metric");
// makeWeatherBlock("london", "en", "metric");
// makeWeatherBlock("paris", "fr", "metric");
// makeWeatherBlock("new York", "en", "imperial");
// makeWeatherBlock("bagdad", "ar", "metric");
// makeWeatherBlock("boston", "en", "imperial");
// makeWeatherBlock("saigon", "vi", "metric");
// makeWeatherBlock("prague", "cz", "metric");
// makeWeatherBlock("barcelona", "ca", "metric");
// makeWeatherBlock("tel aviv", "en", "metric");
// makeWeatherBlock("athens", "el", "metric");
// makeWeatherBlock("venice", "it", "metric");
// makeWeatherBlock("moscow", "ru", "metric");
// makeWeatherBlock("kiev", "ua", "metric");
// makeWeatherBlock("nairobi", "en", "metric");
// makeWeatherBlock("Addis Abeba", "en", "metric");
// makeWeatherBlock("Mogadishu", "ar", "metric");
// function chunkArrayInGroups(arr, size) {
//   var myArray = [];

//   for (var i = 0; i < arr.length; i += size) {
//     myArray.push(arr.slice(i, i + size));
//   }

//   return myArray;
// }
// console.log(chunkArrayInGroups(USERS, 4));
